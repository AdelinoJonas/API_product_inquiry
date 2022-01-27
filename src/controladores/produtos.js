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

const obterProduto = async (req, res) => {
    const { usuario } = req;
    const { id: produtoId } = req.params;

    if (!usuario) {
        return res.status(401).json({ "mensagem": "Para acessar este recurso um token de autenticação válido deve ser enviado." });
    }

    try {
        const queryObterProduto = "select * from produtos where id = $1";
        const produtos = await conexao.query(queryObterProduto, [produtoId]);

        if (produtos.rowCount === 0) {
            return res.status(404).json({ "mensagem": `Não existe produto cadastrado com ID ${produtoId}.` });
        }

        const produto = produtos.rows[0];

        if (produto.usuario_id !== usuario.id) {
            return res.status(403).json({ "mensagem": "O usuário logado não tem permissão para acessar este produto." });
        }

        return res.status(200).json(produto);
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