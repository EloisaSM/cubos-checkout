const fs = require("fs/promises");
const diasUteis = require("date-fns/addBusinessDays");
const {
  listarProdutosEmEstoque,
  pegarItemEstoquePorId,
} = require("./Produtos");

const { intervalToDuration } = require("date-fns");

const lerArquivoCarrinho = async () => {
  const carrinhoObj = JSON.parse(await fs.readFile("carrinho.json"));

  return carrinhoObj;
};

const escreverAquivoCarrinho = async (produto) => {
  const json = fs.writeFile("carrinho.json", JSON.stringify(produto, null, 2));
};

const calcularProdutos = (produtos) => {
  const carrinho = {
    subtotal: 0,
    dataEntrega: null,
    valorDoFrete: 0,
    totalAPagar: 0,
  };

  if (!produtos.length) {
    return carrinho;
  }

  for (const produto of produtos) {
    carrinho.subtotal += produto.preco * produto.quantidade;
  }

  if (carrinho.subtotal <= 20000) {
    carrinho.valorDoFrete = 5000;
  } else {
    carrinho.valorDoFrete = 0;
  }

  carrinho.dataEntrega = diasUteis(new Date(), 15);
  carrinho.totalAPagar = carrinho.subtotal + carrinho.valorDoFrete;

  return carrinho;
};

const alterarCarrinho = async () => {
  const itensCarrinho = await lerArquivoCarrinho();
  const valoresCalculados = calcularProdutos(itensCarrinho.produtos);

  const carrinhoAtualizado = { ...itensCarrinho, ...valoresCalculados };

  await escreverAquivoCarrinho(carrinhoAtualizado);

  console.log(carrinhoAtualizado);

  return carrinhoAtualizado;
};

async function adicionarCarrinho(id, quantidade) {
  const produtosEmEstoque = await pegarItemEstoquePorId(id);

  const produto = {
    id,
    quantidade,
    nome: produtosEmEstoque.nome,
    preco: produtosEmEstoque.preco,
    categoria: produtosEmEstoque.categoria,
  };

  const carrinhoAtual = await lerArquivoCarrinho();

  const produtoJaInserido = carrinhoAtual.produtos.find(
    (produto) => produto.id === id
  );

  if (produtoJaInserido) {
    carrinhoAtual.produtos.map((produto) => {
      if (produto.id === id) {
        return (produto.quantidade += quantidade);
      }
    });
  } else {
    carrinhoAtual.produtos.push(produto);
  }

  const calculoProdutos = calcularProdutos(carrinhoAtual.produtos);
  const carrinhoAtualizado = { ...carrinhoAtual, ...calculoProdutos };

  await escreverAquivoCarrinho(carrinhoAtualizado);

  return carrinhoAtualizado;
}

module.exports = {
  lerArquivoCarrinho,
  escreverAquivoCarrinho,
  alterarCarrinho,
  adicionarCarrinho,
  calcularProdutos,
};
