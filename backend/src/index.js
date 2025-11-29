//Main entry point
//Punctul de pornire al serverului Node.js

const express = require('express');
const db = require('./models/index');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//force: true - sterge datele si recreaza tabelele de fiecare data (folosim acum la inceput)
//force: false - pastreaza datele
db.sequelize.sync({force: true})
    .then(()=>{
        console.log(`Baza de date si tabelele au fost create`);

        app.listen(PORT, ()=>{
            console.log(`Serverul ruleaza pe portul ${PORT}.`);
        });
    })
    .catch(err =>{
        console.error('Eroare', err);
    });