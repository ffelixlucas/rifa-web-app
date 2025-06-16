const express = require('express');
const router = express.Router();
const rifaController = require('../controllers/rifaController');
const verificarToken = require('../middleware/authMiddleware');

// 🔓 Rotas públicas
router.get('/rifas', rifaController.getTodasRifas);
router.get('/rifas/:id', rifaController.getRifaPorId); // pública
router.get('/rifas/:id/numeros', rifaController.getNumerosPorRifaId);

// 🔐 Rotas protegidas (Admin vê suas próprias rifas)
router.get('/admin/rifas', verificarToken, rifaController.getMinhasRifas);
router.get('/admin/rifas/:id', verificarToken, rifaController.getRifaPorIdPrivada);

// 🔧 Ações administrativas protegidas
router.post('/admin/rifas', verificarToken, rifaController.criarRifa);
router.put('/admin/rifas/:id', verificarToken, rifaController.atualizarRifa);
router.delete('/admin/rifas/:id', verificarToken, rifaController.excluirRifa);
router.patch('/admin/rifas/:id/finalizar', verificarToken, rifaController.finalizarRifa);

// 🎰 Sorteio e histórico de sorteios (protegidos)
router.get('/admin/rifas/:id/sorteio', verificarToken, rifaController.sortearNumeroDaRifa);
router.get('/admin/rifas/:id/sorteios', verificarToken, rifaController.listarSorteiosDaRifa);

module.exports = router;
