const express = require('express');
const produtos = require('./controladores/produtos');
const usuarios = require('./controladores/usuarios');
const autenticacao = require('./controladores/autenticacao');

const rotas = express();

//LOGIN
rotas.post('/login', usuarios.login);

//USUARIOS
rotas.post('/cadastrar', usuarios.cadastrarUsuario);
rotas.get('/usuario/:id', usuarios.obterUsuario);
rotas.put('/usuario/:id', usuarios.atualizarUsuario);
rotas.use(autenticacao);
//PRODUTOS
rotas.get('/produtos', produtos.listarProdutos);
rotas.post('/produtos', produtos.cadastrarProduto);
rotas.get('/produtos/:id', produtos.obterProduto);
rotas.put('/produtos/:id', produtos.atualizarProduto);
rotas.delete('/produtos/:id', produtos.deletarProduto);

module.exports = rotas;