const express = require('express');
const router = express.Router();
const rifaController = require('../controllers/rifaController');

// Rota pública para buscar dados da rifa
router.get('/rifas/:id', rifaController.getRifaPorId);
router.get('/rifas/:id/numeros', rifaController.getNumerosPorRifaId);


module.exports = router;
