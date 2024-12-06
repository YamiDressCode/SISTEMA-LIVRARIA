
// INICIANDO SERVIDOR
const express = require('express');
const comprasRoutes = require('./routes/compras');
const admRoutes = require('./routes/adm');
const pesquisarRoutes = require('./routes/pesquisar');
const cadastroRoutes = require('./routes/cadastro');
const loginRoutes = require('./routes/login');

const app = express();

// Middleware para ler o corpo da requisição
app.use(express.json());

// Usar as rotas de compras
app.use('/apiss', comprasRoutes);

app.use('/apiss', admRoutes);

app.use('/apiss', pesquisarRoutes);

app.use('/apiss', cadastroRoutes);

app.use('/apiss', loginRoutes);

// Iniciar o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});