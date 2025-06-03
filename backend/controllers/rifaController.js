const rifaService = require('../services/rifaService');

async function criarRifa(req, res) {
  try {
    const rifaData = req.body;
    const novaRifa = await rifaService.criarRifaComNumeros(rifaData);
    res.status(201).json(novaRifa);
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.message });
  }
}

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

async function atualizarRifa(req, res) {
  const { id } = req.params;
  const dados = req.body;
  try {
    const rifaAtualizada = await rifaService.atualizarRifa(id, dados);
    res.json(rifaAtualizada);
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.message });
  }
}

async function excluirRifa(req, res) {
  const { id } = req.params;
  try {
    await rifaService.excluirRifa(id);
    res.status(204).send();
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.message });
  }
}

async function finalizarRifa(req, res) {
  const { id } = req.params;
  try {
    const rifaFinalizada = await rifaService.finalizarRifa(id);
    res.json(rifaFinalizada);
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.message });
  }
}

module.exports = {
  criarRifa,
  getRifaPorId,
  getNumerosPorRifaId,
  atualizarRifa,
  excluirRifa,
  finalizarRifa,
};
