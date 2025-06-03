const express = require('express');
require('dotenv').config();
const app = express();

app.use(express.json());

// 🔗 Importar e usar as rotas
const rifaRoutes = require('./routes/rifaRoutes');
app.use('/api', rifaRoutes); // agora /api/rifas/:id funciona

module.exports = app;
