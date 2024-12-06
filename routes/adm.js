//ROTAS DE POSTAR NOVOS LIVROS 
const express = require('express');
const db = require('../config/database'); 
const router = express.Router();
const { autenticar, verificarAdministrador } = require('../middlewares/authMiddleware'); // Importando os middlewares


// ROTA QUE ADICIONA LIVROS

router.post('/livro',autenticar, verificarAdministrador, (req, res) => {
  const { titulo, autor, genero, ano, paginas, estoque } = req.body;
  if (!titulo || !autor || !genero || !ano || !paginas || !estoque) {
    return res.status(400).json({ error: 'Informações obrigatórias faltando' });
  }
  const sql = `
    INSERT INTO livro (titulo, autor, genero, ano, paginas, estoque)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const values = [titulo, autor, genero, ano, paginas, estoque];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Erro ao adicionar livro' });
    }

    const novoLivro = { idlivro: result.insertId, titulo, autor, genero, ano, paginas, estoque };
    res.status(201).json(novoLivro);
  });
});

//EXIBE TODOS OS LIVROS

router.get('/livro',autenticar, verificarAdministrador, (req, res) => {
    const sql = `
    SELECT * FROM livro 
 `;
    db.query(sql,(err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Erro ao buscar livros');
      }
      res.status(200).json(results);
    });
  });

module.exports = router;

// DELETA UM LIVRO

router.delete('/livro/:idlivro',autenticar, verificarAdministrador, (req, res) => {
    const { idlivro } = req.params;
    if (!idlivro) {
      return res.status(400).json({ message: 'ID do livro é necessário' });
    }
  
    // Consulta SQL para deletar o livro com o id fornecido
    const sql = 'DELETE FROM livro WHERE idlivro = ?';
  
    db.query(sql, [idlivro], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erro ao tentar deletar o livro' });
      }
  
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Livro não encontrado' });
      }
  
      res.status(200).json({ message: `Livro com id ${idlivro} deletado com sucesso!` });
    });
  });
  



    