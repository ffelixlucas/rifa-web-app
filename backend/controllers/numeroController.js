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

async function reservarNumerosPublico(req, res) {
  const { id } = req.params;
  const { numeroIds, nome, telefone } = req.body;

  try {
    const reservados = await numeroService.reservarNumerosPublico(
      id,
      numeroIds,
      nome,
      telefone
    );

    res.status(201).json({
      mensagem: "Números reservados com sucesso.",
      numeros: reservados,
    });
  } catch (error) {
    res.status(error.status || 500).json({ erro: error.message });
  }
}

module.exports = {
  atualizarNumero,
  reservarNumerosPublico,
};
