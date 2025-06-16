const express = require('express');
const router = express.Router();
const rifaController = require('../controllers/rifaController');
const verificarToken = require('../middleware/authMiddleware');

// 🔓 Rotas públicas
router.get('/rifas', rifaController.getTodasRifas);  // 
router.get('/rifas/:id', rifaController.getRifaPorId);
router.get('/rifas/:id/numeros', rifaController.getNumerosPorRifaId);

// 🔐 Rotas protegidas (Admin vê suas próprias rifas e uma rifa específica)
router.get('/admin/rifas', verificarToken, rifaController.getMinhasRifas);
router.get('/admin/rifas/:id', verificarToken, rifaController.getRifaPorId);

// 🔧 Ações administrativas protegidas
router.post('/rifas', verificarToken, rifaController.criarRifa);
router.put('/rifas/:id', verificarToken, rifaController.atualizarRifa);
router.delete('/rifas/:id', verificarToken, rifaController.excluirRifa);
router.patch('/rifas/:id/finalizar', verificarToken, rifaController.finalizarRifa);

// 🎰 Sorteio e histórico de sorteios (protegidos)
router.get('/rifas/:id/sorteio', verificarToken, rifaController.sortearNumeroDaRifa);
router.get('/rifas/:id/sorteios', verificarToken, rifaController.listarSorteiosDaRifa);

module.exports = router;
