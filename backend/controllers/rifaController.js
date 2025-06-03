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

module.exports = {
  getRifaPorId
};
