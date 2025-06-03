const numeroRepository = require('../repositories/numeroRepository');

async function atualizarNumero(id, status, nome) {
  // Validações básicas podem entrar aqui (ex: status válido)
  if (!['disponivel', 'reservado', 'pago'].includes(status)) {
    const erro = new Error('Status inválido');
    erro.status = 400;
    throw erro;
  }

  return await numeroRepository.atualizarNumero(id, status, nome);
}

module.exports = {
  atualizarNumero,
};
