const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, senha } = req.body;

  // Verificar se o email e a senha foram fornecidos
  if (!email || !senha) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios!' });
  }

  // Buscar o usuário no banco de dados
  const sql = 'SELECT * FROM cliente WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Erro ao buscar o usuário' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Email ou senha incorretos!' });
    }

    const cliente = results[0];

    // Verificar se a senha informada bate com a senha armazenada
    const senhaValida = await bcrypt.compare(senha, cliente.senha);
    if (!senhaValida) {
      return res.status(400).json({ error: 'Email ou senha incorretos!' });
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: cliente.idcliente, role: cliente.role }, 
      'seu-segredo-aqui', 
      { expiresIn: '24h' }
    );

    res.json({ token });
  });
});

module.exports = router;
