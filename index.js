require('dotenv').config();
const cors = require('cors');

const app = require('./up-server');
const knex = require('./storage/connection');

/*
A cada requisição solicitada pelo usuário o terminal apresenta a data e hora atual.
*/
app.all("*", (req, res, next) => {

    console.log('Nova requisição...\n', new Date(Date.now()));
    
    next();

});

app.get('/', async(req, res) => {

    try {
        
        const users = await knex('usuarios').debug();

        return res.json(users);

    } catch(e) {

        console.log(e);
        return res.json([]);

    }
})