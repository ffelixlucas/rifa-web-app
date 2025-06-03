const rifaService = require('../services/rifaService');

async function getRifaPorId(req, res) {
  const { id } = req.params;

  try {
    const rifa = await rifaService.obterRifaPorId(id);
    res.json(rifa);
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.message });
  }
}


async function getNumerosPorRifaId(req, res) {
  const { id } = req.params;

  try {
    const numeros = await rifaService.obterNumerosPorRifaId(id);
    res.json(numeros);
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.message });
  }
}


module.exports = {
    getRifaPorId,
    getNumerosPorRifaId
  };
  