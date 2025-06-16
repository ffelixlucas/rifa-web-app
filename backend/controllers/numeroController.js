const numeroService = require('../services/numeroService');

async function atualizarNumero(req, res) {
  const { id } = req.params;
  const { status, nome, telefone } = req.body; // 👈 agora também captura telefone

  try {
    const numeroAtualizado = await numeroService.atualizarNumero(id, status, nome, telefone);
    res.json(numeroAtualizado);
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.message });
  }
}

module.exports = {
  atualizarNumero,
};
