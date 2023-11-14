const express = require('express');

const app = express();

app.use(express.json());//middleware nativo do express que só aceita informações no formato json

app.listen(process.env.PORT, () => {

    console.log(`Servidor rodando na porta ${process.env.PORT}`);
    
});

module.exports = app;