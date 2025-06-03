require('dotenv').config();
console.log('URL do banco carregada:', process.env.DATABASE_URL);
const pool = require('./connection');

async function seedNumeros() {
  const total = 100;
  const rifaId = 1;

  try {
    for (let i = 1; i <= total; i++) {
      await pool.query(
        'INSERT INTO numeros (numero, status, nome, rifa_id) VALUES ($1, $2, $3, $4)',
        [i, 'disponivel', null, rifaId]
      );
    }

    console.log(`${total} números inseridos com sucesso.`);
  } catch (error) {
    console.error('Erro ao inserir números:', error);
  } finally {
    await pool.end();
  }
}

seedNumeros();
