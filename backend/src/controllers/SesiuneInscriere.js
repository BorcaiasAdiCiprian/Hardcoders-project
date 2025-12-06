const { SesiuneInscriere, User } = require('../models/index');
const { Op } = require('sequelize');

const sesiuneInscriereController = {
    createSesiune: async (req, res) => {
        try {
            let vectorErori = [];
            const profesorId = req.user.id; 

            const sesiuneNoua = {
                titlu: req.body.titlu,
                data_start: req.body.data_start,
                data_stop: req.body.data_stop,
                numar_locuri_max: req.body.numar_locuri_max,
                profesorId: profesorId
            };

            if (!sesiuneNoua.titlu || !sesiuneNoua.data_start || !sesiuneNoua.data_stop || !sesiuneNoua.numar_locuri_max) {
                vectorErori.push("Toate campurile sunt obligatorii");
            }

            const start = new Date(sesiuneNoua.data_start);
            const stop = new Date(sesiuneNoua.data_stop);

            if (start >= stop) {
                vectorErori.push("Data de stop trebuie sa fie după data de start");
            }
            if (sesiuneNoua.numar_locuri_max < 1) {
                vectorErori.push("Numarul de locuri trebuie sa fie minim 1");
            }

            if (vectorErori.length > 0) {
                return res.status(400).json({ errors: vectorErori });
            }

            //Aici e ca sesiunile sa nu se suprapuna
            const suprapunere = await SesiuneInscriere.findOne({
                where: {
                    profesorId: profesorId,
                    [Op.or]: [
                        { data_start: { [Op.between]: [start, stop] } },
                        { data_stop: { [Op.between]: [start, stop] } },
                        { [Op.and]: [{ data_start: { [Op.lte]: start } }, { data_stop: { [Op.gte]: stop } }] }
                    ]
                }
            });

            if (suprapunere) {
                return res.status(409).json(
                { message: "O sesiune se suprapune deja cu acest interval orar." });
            }

            const newSesiune = await SesiuneInscriere.create(sesiuneNoua);
            res.status(201).json(newSesiune);

        } catch (error) {
            console.error(error);
            res.status(500).json("Server Error");
        }
    },

    getAllActive: async (req, res) => {
        try {
            const now = new Date();
            const sesiuni = await SesiuneInscriere.findAll({
                where: {
                    data_stop: { [Op.gte]: now } // Ca sa nu aplice studentul la o sesiune expirata
                },
                include: [{
                    model: User,
                    as: 'profesor',
                    attributes: ['nume', 'prenume', 'email']
                }]
            });
            res.status(200).json(sesiuni);
        } catch (error) {
            res.status(500).json("Server Error");
        }
    },

    getPersonale: async (req, res) => {
        try {
            const sesiuni = await SesiuneInscriere.findAll({
                where: { profesorId: req.user.id }
            });
            res.status(200).json(sesiuni);
        } catch (error) {
            res.status(500).json("Server Error");
        }
    },

    deleteSesiune: async (req, res) => {
        try {
            const idSesiune = req.params.id;
            const sesiune = await SesiuneInscriere.findOne({
                where: { id: idSesiune, profesorId: req.user.id }
            });

            if (!sesiune) {
                return res.status(404).json("Sesiunea nu a fost gasita/Nu aveti dreptul sa o stergeti");
            }

            await sesiune.destroy();
            res.status(200).json("Sesiune stearsa cu succes!");
        } catch (error) {
            res.status(500).json("Server Error");
        }
    },
    
    updateSesiune: async (req, res) => {
        try {
            const idSesiune = req.params.id;
            let vectorErori = [];
            
            let sesiune = await SesiuneInscriere.findOne({
                where: { id: idSesiune, profesorId: req.user.id }
            });

            if (!sesiune) {
                return res.status(404).json("Sesiunea nu exista");
            }

            if(req.body.data_start && req.body.data_stop) {
                if(new Date(req.body.data_start) >= new Date(req.body.data_stop)) {
                    vectorErori.push("Data start trebuie sa fie inainte de data stop");
                }
            }

            if(vectorErori.length > 0) {
                 return res.status(400).json({ errors: vectorErori });
            }
            await sesiune.update(req.body);
            res.status(200).json(sesiune);

        } catch(error) {
            res.status(500).json("Server Error");
        }
    }
};

module.exports = sesiuneInscriereController;