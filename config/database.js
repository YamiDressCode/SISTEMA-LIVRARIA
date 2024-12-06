// CONFIGURAÇÃO DO SERVIDOR

const mysql = require('mysql2');

// Configuração da conexão com o MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Seu usuário
  password: '', // Sua senha do MySQL
  database: 'livraria', // Nome do seu banco de dados
});

// Verifica a conexão com o banco de dados
db.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados com ID ' + db.threadId);
});

module.exports = db;