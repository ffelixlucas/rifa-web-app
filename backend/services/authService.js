const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/authRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'segredo_dev'; // usar variável de ambiente no deploy

async function autenticarUsuario(email, senha) {
  const usuario = await authRepository.buscarUsuarioPorEmail(email);
  if (!usuario) {
    throw new Error('Usuário não encontrado');
  }

  const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
  if (!senhaCorreta) {
    throw new Error('Senha incorreta');
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, role: usuario.role },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  return { token, usuario };
}

module.exports = {
  autenticarUsuario
};
