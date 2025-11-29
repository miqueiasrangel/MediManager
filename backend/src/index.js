require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const produtosRotas = require('./routes/produtos');
app.use('/api/produtos', produtosRotas);



const PORTA = process.env.PORTA || 3001;
app.listen(PORTA, () => {
  console.log(`Servidor rodando na porta ${PORTA}`);
});
