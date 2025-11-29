//Structura tabelului pentru sesiunile de inscrieri
//sesiune creata de un profesor la care un student poate aplica

const DataTypes = require('sequelize');
const sequelize = require('../config//database');

const SesiuneInscriere = sequelize.define('SesiuneInscriere', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    titlu: {
        type: DataTypes.STRING,
        allowNull: false
    },
    data_start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    data_stop: {
        type: DataTypes.DATE,
        allowNull: false
    },
    numar_locuri_max: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1 //o sesiune trebuie sa aiba minim un loc disponibil
        }
    }
}, {
    timestamps: true
});

module.exports = SesiuneInscriere;