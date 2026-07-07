const express = require('express');
const router = express.Router();
const numeroController = require('../controllers/numeroController');
const verificarToken = require('../middleware/authMiddleware');

router.post('/rifas/:id/reservas', numeroController.reservarNumerosPublico);
router.put('/numeros/:id', verificarToken, numeroController.atualizarNumero);

module.exports = router;
