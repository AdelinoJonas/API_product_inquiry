const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const jwt_Secret = require("../jwt_secret");

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return res.status(400).json({ "mensagem": "O campo nome é obrigatório" });
    }
    if (!email) {
        return res.status(400).json({ "mensagem": "O campo email é obrigatório" });
    }
    if (!senha) {
        return res.status(400).json({ "mensagem": "O campo senha é obrigatório" });
    }
    if (!nome_loja) {
        return res.status(400).json({ "mensagem": "O campo nome_loja é obrigatório" });
    }

    try {
        const queryVerificacao = "select * from usuarios where email = $1";
        const { rowCount: quantidadeUsuarios } = await conexao.query(queryVerificacao, [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json({ "mensagem": "Já existe usuário cadastrado com o e-mail informado." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryCadastro = "insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)";
        const usuarioCadastrado = await conexao.query(queryCadastro, [nome, email, senhaCriptografada, nome_loja]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(400).json({ "mensagem": "Não foi possível cadastrar o usuário" });
        }

        return res.status(200).json({ "mensagem": "Usuário cadastrado com sucesso" });
    } catch (error) {
        return res.status(400).json(error);
    }
}

const login = async (req, res) => {
    const {
        email,
        senha
    } = req.body;

    if (!email || !senha) {
        return res.status(400).json('O campo email e senha são obrigatórios.');
    }

    try {
        const queryVerificaEmail = 'select * from usuarios where email = $1';
        const {
            rows,
            rowCount
        } = await conexao.query(queryVerificaEmail, [email]);

        if (rowCount === 0) {
            return res.status(404).json('Usuario não encontrado.');
        }
        const usuario = rows[0];

        const SenhaVerificada = await bcrypt.compare(senha, usuario.senha);

        if (!SenhaVerificada) {
            return res.status(400).json('Usuário e/ou senha inválido(s).');
        }

        const token = jwt.sign({ id:usuario.id}, jwt_Secret);
        return res.status(200).json(token);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterUsuario = async (req, res) => {
    const token = req.header('authorization');
    
    if (!token) {
        return res.status(401).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    const id = req.params.id;

    try {
        const queryVericacaoEmail = "select * from usuarios where id = $1";
        const usuario = await conexao.query(queryVericacaoEmail, [id]);
        
        return res.status(200).json(usuario.rows);
    } catch (error) {
        return res.status(401).json({error});
    }
    
}

const atualizarUsuario = async (req, res) => {
    const token = req.header('authorization');
    const { nome, email, senha, nome_loja } = req.body;

    if (!token) {
        return res.status(401).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }
    if (!nome) {
        return res.status(400).json({ "mensagem": "O campo nome é obrigatório" });
    }
    if (!email) {
        return res.status(400).json({ "mensagem": "O campo email é obrigatório" });
    }
    if (!senha) {
        return res.status(400).json({ "mensagem": "O campo senha é obrigatório" });
    }
    if (!nome_loja) {
        return res.status(400).json({ "mensagem": "O campo nome_loja é obrigatório" });
    }

    const id = req.params.id;

    try {
        const queryVericacaoEmail = "select * from usuarios where email = $1 and id = $2";
        const usuarios = await conexao.query(queryVericacaoEmail, [email, id]);

        if (usuarios.rowCount > 0) {
            return res.status(400).json({ "mensagem": "Já existe usuário cadastrado com o e-mail informado." });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryAtualizarUsuario = `update usuarios set
            nome = $1,
            email = $2,
            senha = $3,
            nome_loja = $4
            where id = $5
        `;
        const usuarioAtualizado = await conexao.query(queryAtualizarUsuario,
            [nome, email, senhaCriptografada, nome_loja, id]);

        if (usuarioAtualizado.rowCount === 0) {
            return res.status(400).json({ "mensagem": "Não foi possível atualizar o usuário" });
        }

        return res.status(204).json();
    } catch (error) {
        return res.status(400).json(error);
    }

}


module.exports = {
    cadastrarUsuario,
    login,
    obterUsuario,
    atualizarUsuario
}
