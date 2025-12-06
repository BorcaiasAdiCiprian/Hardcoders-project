const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

const checkAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        
        if (!authHeader) {
            return res.status(401).json({ message: "Lipsa token de autentificare" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: "Formatul token invalid" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'CHEIE_SECRETA');

        const user = await User.findByPk(decoded.id);

        if (!user) {
            return res.status(404).json({ message: "Utilizatorul nu exista" });
        }

        req.user = user;
        
        next();

    } catch (error) {
        return res.status(403).json({ message: "Token invalid sau expirat" });
    }
};

module.exports = checkAuth;