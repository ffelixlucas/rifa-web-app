const numeroRepository = require('../repositories/numeroRepository');

async function atualizarNumero(id, status, nome, telefone) {
  // Validação do status
  if (!['disponivel', 'reservado', 'pago'].includes(status)) {
    const erro = new Error('Status inválido');
    erro.status = 400;
    throw erro;
  }

  return await numeroRepository.atualizarNumero(id, status, nome, telefone);
}

module.exports = {
  atualizarNumero,
};
