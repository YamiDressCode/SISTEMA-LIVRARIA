const jwt = require('jsonwebtoken');
const db = require('../config/database'); // Sua conexão com o banco

// Middleware para verificar se o usuário está autenticado
const autenticar = (req, res, next) => {
  const token = req.header('Authorization'); // Obtendo o token do cabeçalho

  if (!token) {
    return res.status(403).json({ error: 'Acesso negado! Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, 'seuSegredo'); // Verificando e decodificando o token
    req.user = decoded; // Armazenando informações do usuário no objeto da requisição
    next(); // Chamando a próxima função (o próximo middleware ou a rota)
  } catch (err) {
    res.status(400).json({ error: 'Token inválido.' });
  }
};

// Middleware para verificar se o usuário é administrador
const verificarAdministrador = (req, res, next) => {
  // Vamos assumir que você armazena o campo "role" dentro do payload do token JWT
  const { user } = req; // O objeto "user" foi salvo no middleware de autenticação

  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Acesso negado! Você não tem permissão de administrador.' });
  }

  next(); // Se for admin, passa para a próxima função (a rota ou outro middleware)
};

// Exportando os middlewares para serem utilizados nas rotas
module.exports = {
  autenticar,
  verificarAdministrador
};
