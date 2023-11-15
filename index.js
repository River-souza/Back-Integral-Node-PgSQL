require('dotenv').config();
const cors = require('cors');
const rotas = require('./src/rotas');

const app = require('./up-server');

/*
A cada requisição solicitada pelo usuário o terminal apresenta a data e hora atual.
*/
app.all("*", (req, res, next) => {

    console.log('Nova requisição...\n', new Date(Date.now()));
    
    next();

});

app.use(rotas);
