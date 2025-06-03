const rifaRepository = require('../repositories/rifaRepository');

async function criarRifaComNumeros(rifaData) {
  const novaRifa = await rifaRepository.criarRifa(rifaData);
  await rifaRepository.gerarNumeros(novaRifa.id, novaRifa.totalNumeros);
  return novaRifa;
}

async function obterRifaPorId(id) {
  const rifa = await rifaRepository.buscarRifaPorId(id);
  if (!rifa) {
    const erro = new Error('Rifa não encontrada');
    erro.status = 404;
    throw erro;
  }
  return rifa;
}

async function obterNumerosPorRifaId(rifaId) {
  const numeros = await rifaRepository.buscarNumerosPorRifaId(rifaId);
  if (!numeros || numeros.length === 0) {
    const erro = new Error('Nenhum número encontrado para esta rifa');
    erro.status = 404;
    throw erro;
  }
  return numeros;
}

async function atualizarRifa(id, dados) {
  const rifaExistente = await rifaRepository.buscarRifaPorId(id);
  if (!rifaExistente) {
    const erro = new Error('Rifa não encontrada');
    erro.status = 404;
    throw erro;
  }
  return await rifaRepository.atualizarRifa(id, dados);
}

async function excluirRifa(id) {
  const rifaExistente = await rifaRepository.buscarRifaPorId(id);
  if (!rifaExistente) {
    const erro = new Error('Rifa não encontrada');
    erro.status = 404;
    throw erro;
  }
  await rifaRepository.excluirRifa(id);
}

async function finalizarRifa(id) {
  const rifaExistente = await rifaRepository.buscarRifaPorId(id);
  if (!rifaExistente) {
    const erro = new Error('Rifa não encontrada');
    erro.status = 404;
    throw erro;
  }
  return await rifaRepository.finalizarRifa(id);
}

module.exports = {
  criarRifaComNumeros,
  obterRifaPorId,
  obterNumerosPorRifaId,
  atualizarRifa,
  excluirRifa,
  finalizarRifa,
};
