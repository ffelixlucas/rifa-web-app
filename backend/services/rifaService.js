const rifaRepository = require('../repositories/rifaRepository');

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

  
  module.exports = {
    obterRifaPorId,
    obterNumerosPorRifaId
  };
  