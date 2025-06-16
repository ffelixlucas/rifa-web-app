const pool = require('../database/connection');

async function atualizarNumero(id, status, nome, telefone) {
  const query = `
    UPDATE numeros
    SET status = $1, nome = $2, telefone = $3
    WHERE id = $4
    RETURNING *;
  `;
  const values = [status, nome, telefone, id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  atualizarNumero,
};
