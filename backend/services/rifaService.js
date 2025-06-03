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

module.exports = {
  obterRifaPorId
};
