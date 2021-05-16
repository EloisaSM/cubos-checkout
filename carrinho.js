const fs = require("fs/promises");
const diasUteis = require("date-fns/addBusinessDays");
const {
  pegarItemEstoquePorId,
  estoqueSuficiente,
  abaterDoEstoque,
} = require("./Produtos");

const lerArquivoCarrinho = async () => {
  const carrinhoObj = JSON.parse(await fs.readFile("carrinho.json"));

  return carrinhoObj;
};

const escreverAquivoCarrinho = async (produto) => {
  const json = fs.writeFile("carrinho.json", JSON.stringify(produto, null, 2));
};

const calcularProdutos = (produtos) => {
  const valoresProdutos = {
    subtotal: 0,
    dataEntrega: null,
    valorDoFrete: 0,
    totalAPagar: 0,
  };

  if (!produtos.length) {
    return valoresProdutos;
  }

  for (const produto of produtos) {
    valoresProdutos.subtotal += produto.preco * produto.quantidade;
  }

  if (valoresProdutos.subtotal <= 20000) {
    valoresProdutos.valorDoFrete = 5000;
  } else {
    valoresProdutos.valorDoFrete = 0;
  }

  valoresProdutos.dataEntrega = diasUteis(new Date(), 15);
  valoresProdutos.totalAPagar =
    valoresProdutos.subtotal + valoresProdutos.valorDoFrete;

  return valoresProdutos;
};

const alterarCarrinho = async () => {
  const itensCarrinho = await lerArquivoCarrinho();
  const valoresCalculados = calcularProdutos(itensCarrinho.produtos);

  const carrinhoAtualizado = { ...itensCarrinho, ...valoresCalculados };

  await escreverAquivoCarrinho(carrinhoAtualizado);

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
        produto.quantidade += quantidade;
      }
    });
  } else {
    carrinhoAtual.produtos.push(produto);
  }

  const calculoDosProdutos = calcularProdutos(carrinhoAtual.produtos);
  console.log(calculoDosProdutos);
  const carrinhoAtualizado = { ...calculoDosProdutos, ...carrinhoAtual };

  await escreverAquivoCarrinho(carrinhoAtualizado);

  return carrinhoAtualizado;
}

async function editarQuantidadeProduto(id, quantidade) {
  const carrinhoAtual = await lerArquivoCarrinho();

  const produtoAdicionado = carrinhoAtual.produtos.find(
    (produto) => produto.id === id
  );

  if (!produtoAdicionado) {
    return "Este produto não está no carrinho!";
  }

  const totalSubtraido = quantidade + produtoAdicionado.quantidade;

  if (quantidade < 0) {
    if (totalSubtraido <= 0) {
      return "Você está tentando diminuir uma quantidade maior do que a que existe no carrinho!";
    }
  }

  const quantidadeTotal = produtoAdicionado.quantidade + quantidade;

  const temEstoque = await estoqueSuficiente(id, quantidadeTotal);

  if (!temEstoque) {
    return "Esse produto não tem estoque suficiente!";
  }

  carrinhoAtual.produtos.map((produto) => {
    if (produto.id === id) {
      return (produto.quantidade = quantidadeTotal);
    }
  });

  const calculoProdutos = calcularProdutos(carrinhoAtual.produtos);
  const carrinhoAtualizado = { ...calculoProdutos, ...carrinhoAtual };

  await escreverAquivoCarrinho(carrinhoAtualizado);

  return carrinhoAtualizado;
}

async function deletarUmProduto(id) {
  const carrinhoAtual = await lerArquivoCarrinho();

  const produtoAdicionado = carrinhoAtual.produtos.find(
    (produto) => produto.id === id
  );

  if (!produtoAdicionado) {
    return "Produto não está no carrinho!";
  }

  const indice = carrinhoAtual.produtos.indexOf(produtoAdicionado);

  carrinhoAtual.produtos.splice(indice, 1);
  const calculoProdutos = calcularProdutos(carrinhoAtual.produtos);
  const carrinhoAtualizado = { ...calculoProdutos, ...carrinhoAtual };

  await escreverAquivoCarrinho(carrinhoAtualizado);

  return carrinhoAtualizado;
}

const limparCarrinho = async () => {
  const carrinhoVazio = {
    produtos: [],
  };

  await escreverAquivoCarrinho(carrinhoVazio);
};

async function finalizarCompra() {
  const carrinhoAtual = await lerArquivoCarrinho();

  if (!carrinhoAtual.produtos.length) {
    return "O carrinho está vazio!";
  }

  const listaSeHaEmEstoque = await Promise.all(
    carrinhoAtual.produtos.map(async (produto) => {
      return await estoqueSuficiente(produto.id, produto.quantidade);
    })
  );

  const estoqueValido = listaSeHaEmEstoque.every((estoque) => estoque === true);

  if (!estoqueValido) {
    return "Produto não possui estoque suficiente";
  }

  //não consegui fazer o abate no estoque

  await limparCarrinho();

  return carrinhoAtual;
}

module.exports = {
  alterarCarrinho,
  adicionarCarrinho,
  editarQuantidadeProduto,
  deletarUmProduto,
  limparCarrinho,
  finalizarCompra,
};
