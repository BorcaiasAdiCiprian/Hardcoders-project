//Configurare baza de date Sequelize - conexiunea la baza de date SQLite

const { Sequelize } = require('sequelize');
const path = require('path');

const storagePath = path.join(__dirname, '../../database.sqlite');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: storagePath,
    logging: false,
    define: {
        freezeTableName: true
    }
});

module.exports = sequelize;