//Structura tabelului pentru utilizatori (student si profesor)

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    parola:{
        type: DataTypes.STRING,
        allowNull: false
    },
    nume:{
        type: DataTypes.STRING,
        allowNull: false
    },
    prenume:{
        type: DataTypes.STRING,
        allowNull: false
    },
    rol:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isIn: [['student', 'profesor']]
        }
    }
}, {
    timestamps: true
});

module.exports = User;