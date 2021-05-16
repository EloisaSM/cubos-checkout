const { lerArquivoProdutosEstoque } = require("../Produtos");
const {
  alterarCarrinho,
  adicionarCarrinho,
  editarQuantidadeProduto,
  deletarUmProduto,
  limparCarrinho,
  finalizarCompra,
} = require("../carrinho");

async function filtrarProdutosEmEstoque(req, res) {
  const {
    query: { categoria, precoInicial, precoFinal },
  } = req;

  const produtosEmEstoque = await lerArquivoProdutosEstoque();

  if (precoFinal && precoFinal && categoria) {
    const FiltroFaixaDePrecoECategoria = produtosEmEstoque.filter((produto) => {
      return (
        produto.preco > precoInicial &&
        produto.preco <= precoFinal &&
        categoria === produto.categoria
      );
    });

    return res.json(FiltroFaixaDePrecoECategoria);
  }

  if (categoria) {
    const filtroPorCategoria = produtosEmEstoque.filter(
      (produto) => produto.categoria === categoria
    );

    return res.json(filtroPorCategoria);
  }

  if (precoInicial && precoFinal) {
    const filtroFaixaDePreco = produtosEmEstoque.filter(
      (produto) => produto.preco >= precoInicial && produto.preco <= precoFinal
    );

    return res.json(filtroFaixaDePreco);
  }

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

  const carrinhoAtualizado = await adicionarCarrinho(id, quantidade);

  return res.json(carrinhoAtualizado);
}

async function quantidadesAtualizadasnoCarrinho(req, res) {
  const {
    params: { idProduto },
    body: { quantidade },
  } = req;

  if (!idProduto || !quantidade) {
    return res
      .status(400)
      .json({ mensagem: "É preciso passar id e quantidade do produto!" });
  }
  const carrinhoAtualizado = await editarQuantidadeProduto(
    Number(idProduto),
    quantidade
  );

  if (typeof carrinhoAtualizado === "string") {
    const erro = carrinhoAtualizado;
    return res.status(404).json({ mensagem: erro });
  }

  return res.json(carrinhoAtualizado);
}

async function carrinhoComProdutoDeletado(req, res) {
  const {
    params: { idProduto },
  } = req;

  const carrinhoAtualizado = await deletarUmProduto(Number(idProduto));

  if (typeof carrinhoAtualizado === "string") {
    const erro = carrinhoAtualizado;
    return res.status(404).json({ mensagem: erro });
  }

  return res.json(carrinhoAtualizado);
}

async function mostrarCarrinholimpo(req, res) {
  await limparCarrinho();

  res.json({ mensagem: "O carrinho foi limpo com sucesso!" });
}

function validaDadosCliente(cliente) {
  const { type, country, name, documents } = cliente;

  const regNome = /^[A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+$/;
  const nomeEhValido = regNome.test(name);
  const cpfReg = /^\d+$/;

  if (type !== "individual") {
    return "Verifique os dados do usuário!";
  }

  if (country.length !== 2) {
    return "Verifique os dados do usuário!";
  }

  if (!nomeEhValido) {
    return "Verifique os dados do usuário!";
  }

  for (const doc of documents) {
    const ehNumero = cpfReg.test(doc.number);

    if (doc.type !== "cpf" || !ehNumero || doc.number.length !== 11) {
      return "Verifique os dados do usuário!";
    }
  }
}

async function mostrarCompraFinalizada(req, res) {
  const {
    body: { customer },
  } = req;

  const erro = validaDadosCliente(customer);

  if (erro) {
    return res.status(404).json({ mensagem: erro });
  }

  const compraFinalizada = await finalizarCompra();

  if (typeof compraFinalizada === "string") {
    const erro = compraFinalizada;
    return res.status(404).json({ mensagem: erro });
  }

  res.json({ mensagem: compraFinalizada });
}

module.exports = {
  filtrarProdutosEmEstoque,
  mostrarCarrinhoDetalhado,
  adicionarNoCarrinho,
  quantidadesAtualizadasnoCarrinho,
  carrinhoComProdutoDeletado,
  mostrarCarrinholimpo,
  mostrarCompraFinalizada,
};
