const { CerereDisertatie, SesiuneInscriere, User } = require('../models/index');
const { Op } = require('sequelize');
const path = require('path');

const cerereDisertatieController = {
    
    createCerere: async (req, res) => {
        try {
            const studentId = req.user.id;
            const { sesiuneId } = req.body;
            let vectorErori = [];

            const cerereAprobata = await CerereDisertatie.findOne({
                where: {
                    studentId: studentId,
                    status: ['preliminar_aprobata', 'fisier_incarcat', 'final_aprobata', 'fisier_respins']
                }
            });

            if (cerereAprobata) {
                return res.status(403).json({ message: "Aveti deja o cerere aprobata." });
            }

            const cerereExistentaSesiune = await CerereDisertatie.findOne({
                where: { studentId: studentId, sesiuneId: sesiuneId }
            });

            if (cerereExistentaSesiune) {
                vectorErori.push("Ati trimis deja o cerere la aceasta sesiune.");
            }

            if (vectorErori.length > 0) {
                return res.status(400).json({ errors: vectorErori });
            }

            const nouaCerere = await CerereDisertatie.create({
                studentId: studentId,
                sesiuneId: sesiuneId,
                status: 'trimisa'
            });

            res.status(201).json(nouaCerere);

        } catch (error) {
            console.error(error);
            res.status(500).json("Server Error");
        }
    },


    getCereriStudent: async (req, res) => {
        try {
            const cereri = await CerereDisertatie.findAll({
                where: { studentId: req.user.id },
                include: [{
                    model: SesiuneInscriere,
                    as: 'sesiune',
                    include: [{ model: User, as: 'profesor', attributes: ['nume', 'prenume'] }]
                }]
            });
            res.status(200).json(cereri);
        } catch (error) {
            res.status(500).json("Server Error");
        }
    },

    getCereriProfesor: async (req, res) => {
        try {
            const sesiuni = await SesiuneInscriere.findAll({
                where: { profesorId: req.user.id },
                attributes: ['id']
            });
            const ids = sesiuni.map(s => s.id);

            const cereri = await CerereDisertatie.findAll({
                where: { sesiuneId: ids },
                include: [{ model: User, as: 'student', attributes: ['nume', 'prenume', 'email'] }]
            });
            res.status(200).json(cereri);
        } catch (error) {
            res.status(500).json("Server Error");
        }
    },

    actiunePreliminara: async (req, res) => {
        try {
            const { actiune, justificare } = req.body;
            const cerere = await CerereDisertatie.findByPk(req.params.id);

            if (!cerere) return res.status(404).json("Cererea nu exista");

            if (actiune === 'respinge') {
                if(!justificare) return res.status(400).json("Justificarea este necesara la respingere");
                await cerere.update({ status: 'respinsa', justificare_respingere: justificare });
                return res.status(200).json("Cerere respinsa");
            }

            if (actiune === 'aproba') {
                //Sa nu aibe deja o cerere aprobatta
                const alteAprobari = await CerereDisertatie.findOne({
                    where: {
                        studentId: cerere.studentId,
                        status: ['preliminar_aprobata', 'final_aprobata'],
                        id: { [Op.ne]: cerere.id }
                    }
                });
                if (alteAprobari) return res.status(400).json("Studentul are deja o aprobare!");

                const sesiune = await SesiuneInscriere.findByPk(cerere.sesiuneId);
                const locuriOcupate = await CerereDisertatie.count({
                    where: {
                        sesiuneId: sesiune.id,
                        status: ['preliminar_aprobata', 'fisier_incarcat', 'final_aprobata', 'fisier_respins']
                    }
                });

                if (locuriOcupate >= sesiune.numar_locuri_max) {
                    return res.status(400).json("Nu mai sunt locuri la sesiunea asta");
                }

                await cerere.update({ status: 'preliminar_aprobata' });
                return res.status(200).json("Cerere aprobata preliminar");
            }

            res.status(400).json("Actiune invalida");
        } catch (error) {
            res.status(500).json("Server Error");
        }
    },

    uploadStudent: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json("Nu a fost incărcat vreun fisier valid. Acestea sunt .pdf, .doc si .docx");
            }

            const cerere = await CerereDisertatie.findByPk(req.params.id);
            if (!cerere) return res.status(404).json("Cererea nu exista");

            if (cerere.studentId !== req.user.id) return res.status(403).json("Nu aveti acces");
            if (!['preliminar_aprobata', 'fisier_respins'].includes(cerere.status)) {
                return res.status(400).json("Nu puteti incarca fisier in acest stadiu");
            }

            await cerere.update({
                fisier_student_path: req.file.path,
                status: 'fisier_incarcat'
            });

            res.status(200).json({ message: "Fisier incarcat", path: req.file.path });

        } catch (error) {
            console.error(error);
            res.status(500).json("Server Error");
        }
    },

    raspunsProfesor: async (req, res) => {
        try {
            const { actiune, justificare } = req.body;
            const cerere = await CerereDisertatie.findByPk(req.params.id);

            if (!cerere) return res.status(404).json("Cererea nu exista");

            if (actiune === 'respinge_fisier') {
                await cerere.update({
                    status: 'fisier_respins',
                    justificare_respingere: justificare || "Fisier respins"
                });
                return res.status(200).json("Fisier respins");
            }

            if (actiune === 'aproba_final') {
                if (!req.file) {
                    return res.status(400).json("Este necesar un fisier semnat pentru aprobarea finala");
                }
                await cerere.update({
                    status: 'final_aprobata',
                    fisier_profesor_path: req.file.path
                });
                return res.status(200).json("Cerere finala aprobata!");
            }

            res.status(400).json("Acțiune invalida");

        } catch (error) {
            res.status(500).json("Server Error");
        }
    },

    downloadFisier: async (req, res) => {
        try {
            const { cerereId, tip } = req.params;
            const cerere = await CerereDisertatie.findByPk(cerereId);

            if (!cerere) return res.status(404).json("Cererea nu există");

            const sesiunea = await SesiuneInscriere.findByPk(cerere.sesiuneId);
            const userId = req.user.id;
            
            if (userId !== cerere.studentId && userId !== sesiunea.profesorId) {
                return res.status(403).json("Nu aveti dreptul sa descarcati acest fisier");
            }

            let filePath = null;
            if (tip === 'student') filePath = cerere.fisier_student_path;
            if (tip === 'profesor') filePath = cerere.fisier_profesor_path;

            if (!filePath) {
                return res.status(404).json("Fisierul nu exista");
            }

            res.download(path.resolve(filePath));

        } catch (error) {
            console.error(error);
            res.status(500).json("Server Error");
        }
    }
};

module.exports = cerereDisertatieController;