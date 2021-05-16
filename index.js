const express = require("express");
const rotas = require("./rotas");
// const { carregarListaDeProdutos } = require("./Produtos");

const app = express();

app.use(express.json());
app.use(rotas);

app.listen(3000);
