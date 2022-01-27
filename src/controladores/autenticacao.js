const conexao = require('../conexao');
const jwt = require("jsonwebtoken");
const jwt_Secret = require("../jwt_secret");

const autenticacao = async (req, res, next) => {
    const {
        authorization
    } = req.headers;

    if (!authorization) {
        res.status(404).json({ "mensagem": "token não informado." });
    }
    try {
        const token = authorization.replace('Bearer', '').trim();
        const {
            id
        } = jwt.verify(token, jwt_Secret);

        const queryAutenticacao = 'select * from usuarios where id = $1';
        const usuarioAutorizado = await conexao.query(queryAutenticacao, [id]);

        if (usuarioAutorizado.rowCount === 0) {
            req.status(404).json('Usuário não encontrado.');
        }

        //SEPARANDO SENHA DO CONTEUDO DO USUARIO
        const {
            senha,
            ...usuario
        } = usuarioAutorizado.rows[0];

        req.usuario = usuario;

        next();
    } catch (error) {
        res.status(400).json(error.message);
    }
}

module.exports = autenticacao;