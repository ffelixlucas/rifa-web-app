const rifaService = require("../services/rifaService");

async function criarRifa(req, res) {
  const tiposValidos = ["cpf", "celular", "email", "aleatoria", "cnpj"];

  if (!tiposValidos.includes(req.body.tipoChavePix)) {
    return res.status(400).json({ erro: "Tipo de chave Pix inválido." });
  }

  try {
    const usuarioId = req.usuario.id;

    const rifaData = {
      ...req.body,
      usuario_id: usuarioId,
    };

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

    if (!rifa) {
      return res.status(404).json({ erro: "Rifa não encontrada." });
    }

    res.json(rifa);
  } catch (error) {
    console.error("❌ Erro ao buscar rifa por ID:", error);
    res.status(error.status || 500).json({ erro: error.message });
  }
}

async function getRifaPorIdPrivada(req, res) {
  console.log("🔐 Rota protegida /admin/rifas/:id acessada");

  const { id } = req.params;
  const usuarioId = req.usuario.id;

  try {
    const rifa = await rifaService.obterRifaPorIdEUsuario(id, usuarioId);

    if (!rifa) {
      return res
        .status(404)
        .json({ erro: "Rifa não encontrada ou não pertence a você." });
    }

    res.json(rifa);
  } catch (error) {
    console.error("❌ Erro ao buscar rifa por ID (privada):", error);
    res.status(error.status || 500).json({ erro: error.message });
  }
}

async function getNumerosPorRifaId(req, res) {
  const { id } = req.params;

  try {
    const rifa = await rifaService.obterRifaPorId(id);

    if (!rifa) {
      return res.status(404).json({ erro: "Rifa não encontrada" });
    }

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

async function getMinhasRifas(req, res) {
  const usuarioId = req.usuario.id;
  try {
    const rifas = await rifaService.obterRifasPorUsuarioId(usuarioId);
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
  const usuarioId = req.usuario.id; // 🔐 Pegando o usuário do token

  try {
    await rifaService.excluirRifa(id, usuarioId);
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
async function sortearNumeroDaRifa(req, res) {
  const { id } = req.params;
  const usuarioId = req.usuario.id;

  try {
    // 1. Buscar dados da rifa
    const rifa = await rifaService.obterRifaPorIdEUsuario(id, usuarioId);

    if (!rifa) {
      return res.status(404).json({ erro: "Rifa não encontrada" });
    }

    // 2. Verificar se a rifa pertence ao usuário logado
    if (rifa.usuario_id !== usuarioId) {
      return res
        .status(403)
        .json({ erro: "Acesso negado. Esta rifa não pertence a você." });
    }

    // 3. Executar sorteio
    const resultado = await rifaService.sortearNumeroPago(id);
    res.json(resultado);
  } catch (error) {
    console.error("❌ Erro ao sortear número:", error);
    res.status(error.status || 500).json({ erro: error.message });
  }
}

async function listarSorteiosDaRifa(req, res) {
  const { id } = req.params;

  try {
    const sorteios = await rifaService.listarSorteiosDaRifa(id);
    res.json(sorteios);
  } catch (error) {
    console.error("❌ Erro ao listar sorteios:", error);
    res.status(error.status || 500).json({ erro: error.message });
  }
}

module.exports = {
  criarRifa,
  getRifaPorId,
  getRifaPorIdPrivada,
  getNumerosPorRifaId,
  getTodasRifas,
  getMinhasRifas,
  atualizarRifa,
  excluirRifa,
  finalizarRifa,
  sortearNumeroDaRifa,
  listarSorteiosDaRifa,
};
