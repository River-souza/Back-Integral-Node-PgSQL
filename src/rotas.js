const express = require('express');
const usuarios = require('./controladores/usuarios');
const login = require('./controladores/login');
const produtos = require('./controladores/produtos');
const verificaLogin = require('./filtros/verificaLogin');

const rotas = express.Router();

// cadastro de usuario
rotas.post('/usuarios', usuarios.cadastrarUsuario);//teste feito!

// login
rotas.post('/login', login.login);//teste feito!

// filtro para verificar usuario logado
rotas.use(verificaLogin);//teste feito!

// obter e atualizar perfil do usuario logado
rotas.get('/perfil', usuarios.obterPerfil);//teste feito!
rotas.put('/perfil', usuarios.atualizarPerfil);
rotas.delete('/perfil', usuarios.excluirPerfil);

// crud de produtos
rotas.get('/produtos', produtos.listarProdutos);
rotas.get('/produtos/:id', produtos.obterProduto);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.excluirProduto);

module.exports = rotas;