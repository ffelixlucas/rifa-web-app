const pool = require('../database/connection');

async function atualizarNumero(id, status, nome) {
  const query = `
    UPDATE numeros
    SET status = $1, nome = $2
    WHERE id = $3
    RETURNING *;
  `;
  const values = [status, nome, id];
  const result = await pool.query(query, values);
  return result.rows[0];
}

module.exports = {
  atualizarNumero,
};
