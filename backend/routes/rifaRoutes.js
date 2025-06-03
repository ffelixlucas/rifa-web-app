const express = require('express');
const router = express.Router();
const rifaController = require('../controllers/rifaController');
const verificarToken = require('../middleware/authMiddleware');

// Rotas públicas
router.get('/rifas/:id', rifaController.getRifaPorId);
router.get('/rifas/:id/numeros', rifaController.getNumerosPorRifaId);

// Rotas protegidas
router.get('/rifas', verificarToken, rifaController.getTodasRifas); // LISTAR TODAS
router.post('/rifas', verificarToken, rifaController.criarRifa);
router.put('/rifas/:id', verificarToken, rifaController.atualizarRifa);
router.delete('/rifas/:id', verificarToken, rifaController.excluirRifa);
router.patch('/rifas/:id/finalizar', verificarToken, rifaController.finalizarRifa);

module.exports = router;
