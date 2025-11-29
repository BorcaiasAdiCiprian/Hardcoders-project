//Structura tabelului pentru cererile de disertatie
//legatura dintre un student si o sesiune

const DataTypes = require('sequelize');
const sequelize = require('../config/database');

const CerereDisertatie = sequelize.define('CerereDisertatie', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'trimisa',  //cand e creata o cerere e si automat trimisa
        validate: {
            isIn: [[
                'trimisa', 'preliminar_aprobata', 'respinsa', 'fisier_incarcat', 'final_aprobata', 'fisier_respins'
            ]]
        }
    },
    justificare_respingere: {
        type: DataTypes.STRING,
        allowNull: true //la inceput e NULL
    },
    fisier_student_path: {
        type: DataTypes.STRING,
        allowNull: true //NULL pana cand incarca studentul un fisier
    },
    fisier_profesor_path: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
})

module.exports = CerereDisertatie;