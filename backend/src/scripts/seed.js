//Script de populare a bazei de date cu date de test

const {sequelize, User, SesiuneInscriere, CerereDisertatie} = require('../models/index');
async function seed() {
    try{
        //resetare baza de date
        await sequelize.sync({force: true});
        console.log('Baza de date a fost resetata');

        //populare date de test
        const prof1 = await User.create({
            email: 'profesor1@univ.ro',
            parola: '123456', 
            nume: 'Ionescu',
            prenume: 'Cornel',
            rol: 'profesor'
        });

        const prof2 = await User.create({
            email: 'profesor2@univ.ro',
            parola: '123456',
            nume: 'Popa',
            prenume: 'Maria',
            rol: 'profesor'
        });

        // 3. Creăm Studenți
        const student1 = await User.create({
            email: 'student1@univ.ro',
            parola: '123456',
            nume: 'Andrei',
            prenume: 'Ionut',
            rol: 'student'
        });

        const student2 = await User.create({
            email: 'student2@univ.ro',
            parola: '123456',
            nume: 'Barbu',
            prenume: 'Elena',
            rol: 'student'
        });

        const sesiune1 = await SesiuneInscriere.create({
            titlu: 'Sesiune Licenta Iulie 2024',
            data_start: new Date(), // Azi
            data_stop: new Date(new Date().setDate(new Date().getDate() + 7)), // Azi + 7 zile
            numar_locuri_max: 5,
            profesorId: prof1.id // sesiunea lui prof1
        });

        await CerereDisertatie.create({
            status: 'trimisa',
            studentId: student1.id,
            sesiuneId: sesiune1.id
        });

        console.log('Datele de test au fost adăugate cu succes!');
        } catch (error) {
            console.error('Eroare la seed:', error);
        } finally {
            await sequelize.close();
    }
}

seed()