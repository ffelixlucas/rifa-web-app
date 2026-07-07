const numeroRepository = require('../repositories/numeroRepository');

async function atualizarNumero(id, status, nome, telefone) {
  // Validação do status
  if (!['disponivel', 'reservado', 'pago'].includes(status)) {
    const erro = new Error('Status inválido');
    erro.status = 400;
    throw erro;
  }

  if (status === "disponivel") {
    return await numeroRepository.atualizarNumero(id, status, null, null);
  }

  return await numeroRepository.atualizarNumero(id, status, nome, telefone);
}

function normalizarNome(nome) {
  return String(nome || "")
    .trim()
    .replace(/\s+/g, " ");
}

function normalizarTelefone(telefone) {
  let telefoneLimpo = String(telefone || "").replace(/\D/g, "");

  if (telefoneLimpo.startsWith("55") && telefoneLimpo.length > 11) {
    telefoneLimpo = telefoneLimpo.slice(2);
  }

  if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    const erro = new Error("Telefone inválido. Use DDD + número.");
    erro.status = 400;
    throw erro;
  }

  return telefoneLimpo;
}

function normalizarNumeroIds(numeroIds) {
  if (!Array.isArray(numeroIds) || numeroIds.length === 0) {
    const erro = new Error("Selecione ao menos um número.");
    erro.status = 400;
    throw erro;
  }

  const ids = [...new Set(numeroIds.map((id) => Number(id)).filter(Number.isInteger))];

  if (ids.length === 0) {
    const erro = new Error("Lista de números inválida.");
    erro.status = 400;
    throw erro;
  }

  return ids;
}

async function reservarNumerosPublico(rifaId, numeroIds, nome, telefone) {
  const nomeNormalizado = normalizarNome(nome);
  if (nomeNormalizado.length < 5) {
    const erro = new Error("Informe o nome completo.");
    erro.status = 400;
    throw erro;
  }

  const telefoneNormalizado = normalizarTelefone(telefone);
  const idsNormalizados = normalizarNumeroIds(numeroIds);

  return await numeroRepository.reservarNumerosPorIds(
    Number(rifaId),
    idsNormalizados,
    nomeNormalizado,
    telefoneNormalizado
  );
}

module.exports = {
  atualizarNumero,
  reservarNumerosPublico,
};
