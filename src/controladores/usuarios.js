const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const jwt_Secret = require("../jwt_secret");

const cadastrarUsuario = async (req, res) => {
    const {
        nome,
        email,
        senha,
        nome_loja
    } = req.body;

    if (!nome) {
        return res.status(400).json({
            "mensagem": "O campo nome é obrigatório"
        });
    }
    if (!email) {
        return res.status(400).json({
            "mensagem": "O campo email é obrigatório"
        });
    }
    if (!senha) {
        return res.status(400).json({
            "mensagem": "O campo senha é obrigatório"
        });
    }
    if (!nome_loja) {
        return res.status(400).json({
            "mensagem": "O campo nome_loja é obrigatório"
        });
    }

    try {
        const queryVerificacao = "select * from usuarios where email = $1";
        const {
            rowCount: quantidadeUsuarios
        } = await conexao.query(queryVerificacao, [email]);

        if (quantidadeUsuarios > 0) {
            return res.status(400).json({
                "mensagem": "Já existe usuário cadastrado com o e-mail informado."
            });
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const queryCadastro = "insert into usuarios (nome, email, senha, nome_loja) values ($1, $2, $3, $4)";
        const usuarioCadastrado = await conexao.query(queryCadastro, [nome, email, senhaCriptografada, nome_loja]);

        if (usuarioCadastrado.rowCount === 0) {
            return res.status(400).json({
                "mensagem": "Não foi possível cadastrar o usuário"
            });
        }

        return res.status(200).json({
            "mensagem": "Usuário cadastrado com sucesso"
        });
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