const { json } = require("express");

const fs = require("fs/promises");

const lerArquivo = async () => {
  const produtosJson = JSON.parse(await fs.readFile("data.json"));
  const produtosArr = produtosJson.produtos;

  return produtosArr;
};

async function listarProdutosEmEstoque(req, res) {
  const listaProdutos = await lerArquivo();

  const produtosEmEstoque = listaProdutos.filter(
    (produto) => produto.estoque > 0
  );

  res.json(produtosEmEstoque);
}

module.exports = {
  listarProdutosEmEstoque,
};
