const express = require("express");
const { listarProdutosEmEstoque } = require("./controllers/cubos-checkout");

const rotas = express();

rotas.get("/produtos", listarProdutosEmEstoque);

module.exports = rotas;
