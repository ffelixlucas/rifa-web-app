const express = require('express');
const router = express.Router();
const numeroController = require('../controllers/numeroController');
const verificarToken = require('../middleware/authMiddleware');

router.put('/numeros/:id', verificarToken, numeroController.atualizarNumero);

module.exports = router;
