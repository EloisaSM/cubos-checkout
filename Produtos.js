const fs = require("fs/promises");

const lerArquivoProdutos = async () => {
  const produtosJson = JSON.parse(await fs.readFile("data.json"));
  const produtosArr = produtosJson.produtos;

  return produtosArr;
};

const escreverAquivoEstoque = async (produtos) => {
  const json = fs.writeFile("estoque.json", JSON.stringify(produtos, null, 2));
};

const lerArquivoProdutosEstoque = async () => {
  const produtosArr = JSON.parse(await fs.readFile("estoque.json"));

  return produtosArr;
};

async function listarProdutosEmEstoque() {
  const listaProdutos = await lerArquivoProdutos();

  const produtosEmEstoque = listaProdutos.filter(
    (produto) => produto.estoque > 0
  );

  await escreverAquivoEstoque(produtosEmEstoque);

  return produtosEmEstoque;
}

async function pegarItemEstoquePorId(id) {
  const listaProdutos = await lerArquivoProdutosEstoque();

  const produtoEmEstoque = listaProdutos.find((produto) => produto.id === id);

  return produtoEmEstoque;
}

async function estoqueSuficiente(id, quantidade) {
  const listaProdutos = await lerArquivoProdutosEstoque();

  const produtoEmEstoque = listaProdutos.find((produto) => produto.id === id);

  return produtoEmEstoque.estoque >= quantidade;
}

async function abaterDoEstoque(produtos) {
  const produtosEmEstoque = await lerArquivoProdutosEstoque();

  // const estoqueAbatido = produtosEmEstoque.map((produto) => {
  //   return produto.estoque;
  // });

  // console.log(estoqueAbatido);
}

//criar funcao para abater do estoque

module.exports = {
  lerArquivoProdutos,
  lerArquivoProdutosEstoque,
  listarProdutosEmEstoque,
  pegarItemEstoquePorId,
  estoqueSuficiente,
  abaterDoEstoque,
};
