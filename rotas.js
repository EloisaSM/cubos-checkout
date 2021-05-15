const express = require("express");
const {
  filtrarProdutosEmEstoque,
  mostrarCarrinhoDetalhado,
  adicionarNoCarrinho,
  quantidadesAtualizadasnoCarrinho,
  carrinhoComProdutoDeletado,
  mostrarCarrinholimpo,
  mostrarCompraFinalizada,
} = require("./controllers/cubos-checkout");

const rotas = express();

rotas.get("/produtos", filtrarProdutosEmEstoque);
rotas.get("/carrinho", mostrarCarrinhoDetalhado);
rotas.post("/carrinho/produtos", adicionarNoCarrinho);
rotas.patch("/carrinho/produtos/:idProduto", quantidadesAtualizadasnoCarrinho);
rotas.delete("/carrinho/produtos/:idProduto", carrinhoComProdutoDeletado);
rotas.delete("/carrinho", mostrarCarrinholimpo);
rotas.post("/finalizar-compra", mostrarCompraFinalizada);

module.exports = rotas;
