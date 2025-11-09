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
  const ordem = req.query.ordem || "asc";
  const total = parseInt(req.query.total || "1", 10);
 


  try {
    const rifa = await rifaService.obterRifaPorIdEUsuario(id, usuarioId);
  
    if (!rifa) {
      return res.status(404).json({ erro: "Rifa não encontrada" });
    }
  
    if (rifa.usuario_id !== usuarioId) {
      return res.status(403).json({ erro: "Acesso negado. Esta rifa não pertence a você." });
    }
  
    const resultado = await rifaService.sortearNumeroPago(id, ordem, total);
  
    console.log("📣 Resultado enviado ao front:", {
      nome: resultado.nome,
      numero: resultado.numero,
      telefone: resultado.telefone,
    });
  
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
async function listarCompradoresDaRifa(req, res) {
  const { id } = req.params;

  try {
    const compradores = await rifaService.listarCompradoresPorRifa(id);

    if (!compradores || compradores.length === 0) {
      return res.status(200).json([]);
    }

    res.json(compradores);
  } catch (error) {
    console.error("❌ Erro ao listar compradores da rifa:", error);
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
  listarCompradoresDaRifa,
};
