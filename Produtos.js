const fs = require("fs/promises");

const lerArquivoProdutos = async () => {
  const produtosJson = JSON.parse(await fs.readFile("data.json"));
  const produtosArr = produtosJson.produtos;

  return produtosArr;
};

async function listarProdutosEmEstoque() {
  const listaProdutos = await lerArquivoProdutos();

  const produtosEmEstoque = listaProdutos.filter(
    (produto) => produto.estoque > 0
  );

  return produtosEmEstoque;
}

async function pegarItemEstoquePorId(id) {
  const listaProdutos = await listarProdutosEmEstoque();

  const produtosEmEstoque = listaProdutos.find((produto) => produto.id === id);

  return produtosEmEstoque;
}

module.exports = {
  lerArquivoProdutos,
  listarProdutosEmEstoque,
  pegarItemEstoquePorId,
};
