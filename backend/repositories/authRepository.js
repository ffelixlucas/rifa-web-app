const db = require('../database/connection');

async function buscarUsuarioPorEmail(email) {
  const query = 'SELECT * FROM usuarios WHERE email = $1';
  const values = [email];
  const result = await db.query(query, values);
  return result.rows[0];
}

module.exports = {
  buscarUsuarioPorEmail
};
