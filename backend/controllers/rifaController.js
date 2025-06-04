const rifaService = require("../services/rifaService");

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
  console.log("🔐 Rota protegida /admin/rifas/:id acessada");

  const { id } = req.params;
  try {
    const rifa = await rifaService.obterRifaPorId(id);

    if (!rifa) {
      return res.status(404).json({ erro: "Rifa não encontrada" });
    }

    console.log("🎯 Rifa encontrada:", rifa); // 🔍 Aqui o segredo

    res.json(rifa);
  } catch (error) {
    console.error("❌ Erro ao buscar rifa por ID:", error);
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

async function getTodasRifas(req, res) {
  try {
    const rifas = await rifaService.obterTodasRifas();
    res.json(rifas);
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
  getTodasRifas,
  atualizarRifa,
  excluirRifa,
  finalizarRifa,
};
