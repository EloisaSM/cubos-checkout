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

async function mostrarCarrinhoDetalhado(req, res) {
  const itensCarrinho = await alterarCarrinho();

  res.json(itensCarrinho);
}

async function adicionarNoCarrinho(req, res) {
  const {
    body: { id, quantidade },
  } = req;

  const itensCarrinho = await lerArquivoCarrinho();

  const produtosEmEstoque = await listarProdutosEmEstoque();

  const produtoEncontrado = produtosEmEstoque.find(
    (produto) => produto.id === id
  );

  if (!produtoEncontrado) {
    return res.status(404).json({ mensagem: "Esse produto não existe." });
  }

  if (produtoEncontrado.estoque < quantidade) {
    return res
      .status(404)
      .json({ mensagem: "Esse produto não tem estoque suficiente!" });
  }

  const produto = {
    id,
    quantidade,
    nome: produtoEncontrado.nome,
    preco: produtoEncontrado.preco,
    categoria: produtoEncontrado.categoria,
  };

  itensCarrinho.produtos.push(produto);
  const carrinho = calcularProdutos(itensCarrinho.produtos);
  const carrinhoAtualizado = { ...itensCarrinho, ...carrinho };

  escreverAquivoCarrinho(carrinhoAtualizado);

  res.status(201).json(itensCarrinho);
}

async function editarQuantidadeProduto(req, res) {
  const {
    params: { idProduto },
  } = req;

  const itensCarrinho = await lerArquivoCarrinho();

  return res.json("teste");
}

module.exports = {
  listarProdutosEmEstoque,
};
