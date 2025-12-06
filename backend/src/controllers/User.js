const { User } = require('../models/index');
const jwt = require('jsonwebtoken');

const userController = {
    createUser: async (req, res) => {
        try {
            let vectorErori = [];
            const userNou = {
                email: req.body.email,
                parola: req.body.parola,
                nume: req.body.nume,
                prenume: req.body.prenume,
                rol: req.body.rol
            };

            if (!userNou.email || !userNou.parola || !userNou.nume || !userNou.prenume || !userNou.rol) {
                vectorErori.push("Toate campurile sunt obligatorii");
            }

            const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
            if (userNou.email && !regexEmail.test(userNou.email)) {
                vectorErori.push("Email invalid");
            }

            if (userNou.rol && !['student', 'profesor'].includes(userNou.rol)) {
                vectorErori.push("Rolul trebuie sa fie 'student' sau 'profesor'");
            }

            const existingUser = await User.findOne({ where: { email: userNou.email } });
            if (existingUser) {
                vectorErori.push("Email folosit");
            }

            if (vectorErori.length > 0) {
                return res.status(400).json({ errors: vectorErori });
            }

            const createdUser = await User.create(userNou);
            
            const userResponse = createdUser.toJSON();
            delete userResponse.parola;

            res.status(201).json({ message: "Cont creat cu succes", user: userResponse });

        } catch (error) {
            console.error(error);
            res.status(500).json("Server Error");
        }
    },

    loginUser: async (req, res) => {
        try {
            const { email, parola } = req.body;
            let vectorErori = [];

            if (!email || !parola) {
                vectorErori.push("Emailul si parola sunt obligatorii");
            }

            if (vectorErori.length > 0) {
                return res.status(400).json({ errors: vectorErori });
            }

            const user = await User.findOne({ where: { email } });

            if (!user || user.parola !== parola) {
                return res.status(401).json({ message: "Email sau parola incorecte" });
            }

            const token = jwt.sign(
                { id: user.id, rol: user.rol }, 
                process.env.JWT_SECRET || 'CHEIE_SECRETA',
                { expiresIn: '24h' }
            );

            res.status(200).json({ 
                message: "Autentificare reusita",
                token: token,
                user: {
                    id: user.id,
                    nume: user.nume,
                    prenume: user.prenume,
                    email: user.email,
                    rol: user.rol
                }
            });

        } catch (error) {
            console.error(error);
            res.status(500).json("Server Error");
        }
    },

    getCurrentUser: async (req, res) => {
        try {
            if (!req.user || !req.user.id) {
                return res.status(401).json("Nu sunteti autentificat");
            }

            const user = await User.findByPk(req.user.id, {
                attributes: { exclude: ['parola'] }
            });

            if (user) {
                res.status(200).json(user);
            } else {
                res.status(404).json("Userul nu a fost gasit");
            }
        } catch (error) {
            res.status(500).json("Server Error");
        }
    }
};

module.exports = userController;