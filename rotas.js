const express = require("express");
const {
  filtrarProdutosEmEstoque,
  mostrarCarrinhoDetalhado,
  adicionarNoCarrinho,
  // editarQuantidadeProduto,
  deletarUmProduto,
  limparCarrinho,
} = require("./controllers/cubos-checkout");

const rotas = express();

rotas.get("/produtos", filtrarProdutosEmEstoque);
rotas.get("/carrinho", mostrarCarrinhoDetalhado);
rotas.post("/carrinho/produtos", adicionarNoCarrinho);
// rotas.patch("/carrinho/produtos/:idProduto", editarQuantidadeProduto);
rotas.delete("/carrinho/produtos/:idProduto", deletarUmProduto);
rotas.delete("/carrinho", limparCarrinho);

module.exports = rotas;
