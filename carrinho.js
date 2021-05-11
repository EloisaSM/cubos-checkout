const fs = require("fs/promises");
const { listarProdutosEmEstoque } = require("./Produtos");

const lerArquivoCarrinho = async () => {
  const carrinhoObj = JSON.parse(await fs.readFile("carrinho.json"));

  return carrinhoObj;
};

const escreverAquivoCarrinho = async (produto) => {
  const json = fs.writeFile("carrinho.json", JSON.stringify(produto, null, 2));
};

const alterarCarrinho = async () => {
  const itensCarrinho = await lerArquivoCarrinho();

  const produtosEmEstoque = await listarProdutosEmEstoque();

  console.log(produtosEmEstoque);

  const dataEntrega = +new Date();
  const prazoFreteMili = 1296000000;
  const dataEntregaUTC = new Date(dataEntrega + prazoFreteMili).toISOString();

  for (const produto of produtosEmEstoque) {
    itensCarrinho.subtotal += produto.preco * produto.quantidade;
  }

  if (itensCarrinho.subtotal <= 20000) {
    itensCarrinho.valorDoFrete = 5000;
  } else {
    itensCarrinho.valorDoFrete = 0;
  }

  itensCarrinho.dataDeEntrega = dataEntregaUTC;
  itensCarrinho.totalAPagar =
    itensCarrinho.subtotal + itensCarrinho.valorDoFrete;

  return itensCarrinho;
};

module.exports = {
  lerArquivoCarrinho,
  alterarCarrinho,
};
