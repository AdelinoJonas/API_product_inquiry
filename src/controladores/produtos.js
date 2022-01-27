const conexao = require("../conexao");

const listarProdutos = async (req, res) => {
    const { usuario } = req;
    const { categoria } = req.query;

    if (!usuario) {
        return res.status(401).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    try {
        let produtos;
        console.log(categoria);
        if (!categoria) {
            const queryListagem = "select * from produtos where usuario_id = $1 order by id";
            produtos = await conexao.query(queryListagem, [usuario.id]);
        }
        else {
            const queryListagem = "select * from produtos where usuario_id = $1 and categoria = $2 order by id";
            produtos = await conexao.query(queryListagem, [usuario.id, categoria]);
        }

        return res.status(200).json(produtos.rows);
    } catch (error) {
        return res.status(400).json(error);
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    deletarProduto
}