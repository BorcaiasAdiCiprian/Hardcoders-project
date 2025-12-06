//Main entry point
//Punctul de pornire al serverului Node.js

const express = require('express');
const cors = require('cors');
const db = require('./models/index');
const router = require('./routes'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api', router);


app.get('/',(req,res) => {  
    res.status(200).json("Serverul functioneaza!") //Mergea si cu .send, dar am facut peste tot cu .json pentru
    // cand va fi facut frontend-ul
});

//force: true - sterge datele si recreaza tabelele de fiecare data (folosim acum la inceput)
//force: false - pastreaza datele
db.sequelize.sync({force: false})
    .then(()=>{
        console.log(`Baza de date si tabelele au fost create`);

        app.listen(PORT, ()=>{
            console.log(`Serverul ruleaza pe portul ${PORT}.`);
        });
    })
    .catch(err =>{
        console.error('Eroare', err);
    });

