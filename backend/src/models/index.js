//Importa modelele individuale
//Defineste relatiile dintre tabele si exporta un obiect(db)

const sequelize = require('../config/database');

const User = require('./User');
const SesiuneInscriere = require('./SesiuneInscriere');
const CerereDisertatie = require('./CerereDisertatie');

//un profesor are mai multe sesiuni
User.hasMany(SesiuneInscriere, {foreignKey: 'profesorId', as: 'sesiuni'});
SesiuneInscriere.belongsTo(User, {foreignKey: 'profesorId', as: 'profesor'});
//un student are mai multe cereri
User.hasMany(CerereDisertatie, {foreignKey: 'studentId', as: 'cereri'});
CerereDisertatie.belongsTo(User, {foreignKey: 'studentId', as: 'student'});
//o sesiune are mai multe cereri
SesiuneInscriere.hasMany(CerereDisertatie, {foreignKey: 'sesiuneId', as: 'cereri'});
CerereDisertatie.belongsTo(SesiuneInscriere, {foreignKey: 'sesiuneId', as: 'sesiune'});

module.exports ={
    sequelize,
    User,
    SesiuneInscriere,
    CerereDisertatie
};
