const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🔐 CORS dinâmico com variável de ambiente
const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];

app.use(cors({
  origin: true
}));


app.use(express.json());

// 🔗 Rotas
const rifaRoutes = require('./routes/rifaRoutes');
app.use('/api', rifaRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api', authRoutes);

const verificarToken = require('./middleware/authMiddleware');
const numeroRoutes = require('./routes/numeroRoutes');
app.use('/api', numeroRoutes);

app.get('/admin', verificarToken, (req, res) => {
  res.json({
    mensagem: `Acesso autorizado! Bem-vindo, ${req.usuario.email}`,
    usuario: req.usuario
  });
});

module.exports = app;
