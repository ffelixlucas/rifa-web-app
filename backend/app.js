const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());

// 🔗 Importar e usar as rotas
const rifaRoutes = require('./routes/rifaRoutes');
app.use('/api', rifaRoutes); // agora /api/rifas/:id funciona

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const verificarToken = require('./middleware/authMiddleware');
const numeroRoutes = require('./routes/numeroRoutes');
app.use('/api', numeroRoutes);


// Rota protegida de exemplo
app.get('/admin', verificarToken, (req, res) => {
  res.json({
    mensagem: `Acesso autorizado! Bem-vindo, ${req.usuario.email}`,
    usuario: req.usuario
  });
});


module.exports = app;
