const pool = require('../database/connection');

async function buscarRifaPorId(id) {
  try {
    const result = await pool.query('SELECT * FROM rifas WHERE id = $1', [id]);
    return result.rows[0]; // retorna a rifa encontrada ou undefined
  } catch (error) {
    console.error('Erro ao buscar rifa por ID:', error);
    throw error;
  }
}

async function buscarNumerosPorRifaId(rifaId) {
    try {
      const result = await pool.query(
        'SELECT * FROM numeros WHERE rifa_id = $1 ORDER BY numero ASC',
        [rifaId]
      );
      return result.rows;
    } catch (error) {
      console.error('Erro ao buscar números da rifa:', error);
      throw error;
    }
  }
  
  module.exports = {
    buscarRifaPorId,
    buscarNumerosPorRifaId
  };