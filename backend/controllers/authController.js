const authService = require('../services/authService');

async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const { token, usuario } = await authService.autenticarUsuario(email, senha);
    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        role: usuario.role
      }
    });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

module.exports = {
  login
};
