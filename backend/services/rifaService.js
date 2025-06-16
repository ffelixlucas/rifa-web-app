const rifaRepository = require('../repositories/rifaRepository');

async function criarRifaComNumeros(rifaData) {
  const novaRifa = await rifaRepository.criarRifa(rifaData);

  console.log('🟢 ID da nova rifa:', novaRifa.id);
  console.log('🟢 Total de números recebido:', novaRifa.totalNumeros);

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

async function obterRifaPorIdEUsuario(id, usuarioId) {
  return await rifaRepository.buscarRifaPorIdEUsuario(id, usuarioId);
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

async function obterTodasRifas() {
  return await rifaRepository.buscarTodasRifas();
}

async function obterRifasPorUsuarioId(usuarioId) {
  return await rifaRepository.buscarRifasPorUsuarioId(usuarioId);
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
async function excluirRifa(id, usuarioId) {
  const rifa = await rifaRepository.buscarRifaPorIdEUsuario(id, usuarioId);

  if (!rifa) {
    const erro = new Error('Rifa não encontrada ou não pertence a você');
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
async function sortearNumeroPago(rifaId) {
  const rifaExistente = await rifaRepository.buscarRifaPorId(rifaId);

  if (!rifaExistente) {
    const erro = new Error('Rifa não encontrada');
    erro.status = 404;
    throw erro;
  }

  const resultado = await rifaRepository.sortearNumeroPago(rifaId);
  return resultado; // { numero, nome, colocacao }
}
async function listarSorteiosDaRifa(rifaId) {
  const rifaExistente = await rifaRepository.buscarRifaPorId(rifaId);
  if (!rifaExistente) {
    const erro = new Error('Rifa não encontrada');
    erro.status = 404;
    throw erro;
  }
  return await rifaRepository.listarSorteiosDaRifa(rifaId);
}




module.exports = {
  criarRifaComNumeros,
  obterRifaPorId,
  obterRifaPorIdEUsuario,
  obterNumerosPorRifaId,
  obterTodasRifas,
  obterRifasPorUsuarioId,
  atualizarRifa,
  excluirRifa,
  finalizarRifa,
  sortearNumeroPago,
  listarSorteiosDaRifa,

};
