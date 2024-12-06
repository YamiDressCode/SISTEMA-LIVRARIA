const express = require('express');
const db = require('../config/database');
const router = express.Router();

// Rota para buscar livros pelo parâmetro na URL
router.get('/livro/:parametro', (req, res) => {
  const { parametro } = req.params; 

  // Monta o SQL para buscar nos 3 campos: genero, autor ou titulo
  const sql = `
    SELECT * 
    FROM livro 
    WHERE genero = ? OR autor = ? OR titulo = ?
  `;

  // Executa a consulta passando o mesmo parâmetro para todas as condições
  db.query(sql, [parametro, parametro, parametro], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao buscar livros.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Nenhum livro encontrado com os critérios informados.' });
    }

    // Retorna os livros encontrados
    res.json(results);
  });
});

module.exports = router;
