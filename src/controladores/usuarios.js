const bcrypt = require('bcrypt');
const conexao = require('../../storage/connection');
const knex = require('../../storage/connection-knex');

const cadastrarUsuario = async (req, res) => {

    const { nome, email, senha, nome_loja } = req.body;

    if (!nome || !email || !senha || !nome_loja) {

        return res.status(404).json("Todos os campos são obrigatórios!");

    }

    try {
        //const { rowCount: quantidadeUsuarios } = await conexao.query('select * from usuarios where email = $1', [email]);
        const rows = await knex('usuarios').where('email', email).debug();

        if (rows.length > 0) {

            return res.status(400).json("O email já existe");

        }

        //if (quantidadeUsuarios > 0) {
          //  return res.status(400).json("O email já existe");
        //}

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const user = {
            nome,
            email,
            senha: senhaCriptografada, 
            nome_loja
        }
        
        //const query = 'insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)';
        //const usuario = await conexao.query(query, [nome, email, senhaCriptografada, nome_loja]);
        //const userAdd = await knex('usuarios').insert(user).returning('id');//ou returning(['id', 'nome'])
        const userAdd = await knex('usuarios').insert(user).returning('*');

        //if (usuario.rowCount === 0) {
        if(!userAdd) {

            return res.status(400).json("O usuário não foi cadastrado.");
            
        }

        return res.status(200).json("O usuario foi cadastrado com sucesso!");

    } catch (error) {

        return res.status(400).json(error.message);

    }
}

const obterPerfil = async (req, res) => {
    return res.status(200).json(req.usuario);
}

const atualizarPerfil = async (req, res) => {

    const { nome, email, senha, nome_loja } = req.body;

    if (!nome && !email && !senha && !nome_loja) {
        return res.status(404).json('É obrigatório informar ao menos um campo para atualização');
    }

    try {
        // update usuarios set nome = $1, email = $2...
        const body = {};
        const params = [];
        let n = 1;

        if (nome) {
            body.nome = nome;
            params.push(`nome = $${n}`);
            n++;
        }

        if (email) {
            if (email !== req.usuario.email) {
                const { rowCount: quantidadeUsuarios } = await conexao.query('select * from usuarios where email = $1', [email]);

                if (quantidadeUsuarios > 0) {
                    return res.status(400).json("O email já existe");
                }
            }

            body.email = email;
            params.push(`email = $${n}`);
            n++;
        }

        if (senha) {
            body.senha = await bcrypt.hash(senha, 10);
            params.push(`senha = $${n}`);
            n++;
        }

        if (nome_loja) {
            body.nome_loja = nome_loja;
            params.push(`nome_loja = $${n}`);
            n++;
        }

        const valores = Object.values(body);
        valores.push(req.usuario.id);
        const query = `update usuarios set ${params.join(', ')} where id = $${n}`;
        const usuarioAtualizado = await conexao.query(query, valores);

        //const user = await('usuarios').update({ nome, email, telefone }).where('id',id);//se atualizou retorna 1, senão 0
        //const user = await('usuarios').update({ nome, email, telefone }).where('id',id).returning('*');

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(400).json("O usuario não foi atualizado");
        }

        return res.status(200).json('Usuario foi atualizado com sucesso.');
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

async function excluirPerfil(req, res) {//exclui o usuário logado

    console.log(req.usuario.id);

    try {

        const isDeleted = await knex('usuarios').del().where('id', req.usuario.id);

        if(!isDeleted) {

            return res.json('O usuário não foi excluído!');

        }

        return res.statusCode(200).json([]);

    } catch(error) {

        return res.json(error.message);

    }

}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil,
    excluirPerfil
}