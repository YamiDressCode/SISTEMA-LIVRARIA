
// ROTAS DE COMPRA
const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Rota para adicionar um livro na lista de compras
router.post('/compra/:idcliente', (req, res) => {
  const { idcliente } = req.params;
  const { idlivro , estoque } = req.body;

  // Verificar a quantidade disponível do livro
  const checarEstoqueSql = 'SELECT estoque FROM livro WHERE idlivro = ?';
  db.query(checarEstoqueSql, [idlivro], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao verificar disponibilidade do livro');
    }

    const livro = results[0];
    if (!livro || livro.estoque < estoque) {
      return res.status(400).send('Quantidade do livro indisponível');
    }

    // Decrementar a quantidade do livro
    const updateLivroSql = 'UPDATE livro SET estoque = estoque - ? WHERE idlivro = ?';
    db.query(updateLivroSql, [estoque, idlivro], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao atualizar a quantidade do livro');
      }

      // Registrar a compra do cliente
      const insertCompraSql = 'INSERT INTO compra (cliente_id,cliente_idcliente,valor_total) VALUES (?, ?, ?)';
      db.query(insertCompraSql, [idcliente, idlivro, estoque], (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Erro ao registrar a compra');
        }
        return res.status(201).send('Compra realizada com sucesso');
      });
    });
  });
});

// // Rota para obter as compras de um cliente
router.get('/compra/:idcliente', (req, res) => {
  const { idcliente } = req.params;

  // Buscar compras do cliente
  const sql = `
  SELECT livro.titulo, livro.autor, compra.valor_total
  FROM compra
  JOIN livro ON compra.cliente_idcliente = livro.idlivro
  WHERE compra.cliente_id = ?
`;

  db.query(sql, [idcliente], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Erro ao buscar compras');
    }
    res.status(200).json(results);
  });
});



module.exports = router;


