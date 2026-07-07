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

async function reservarNumerosPorIds(rifaId, numeroIds, nome, telefone) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const numerosResult = await client.query(
      `SELECT id, numero, status
       FROM numeros
       WHERE rifa_id = $1
         AND id = ANY($2::int[])
       FOR UPDATE`,
      [rifaId, numeroIds]
    );

    if (numerosResult.rows.length !== numeroIds.length) {
      const erro = new Error("Um ou mais números selecionados não existem.");
      erro.status = 404;
      throw erro;
    }

    const indisponiveis = numerosResult.rows.filter(
      (numero) => numero.status !== "disponivel"
    );

    if (indisponiveis.length > 0) {
      const erro = new Error(
        `Números indisponíveis: ${indisponiveis
          .map((n) => n.numero)
          .sort((a, b) => a - b)
          .join(", ")}`
      );
      erro.status = 409;
      throw erro;
    }

    const updateResult = await client.query(
      `UPDATE numeros
       SET status = 'reservado',
           nome = $1,
           telefone = $2
       WHERE rifa_id = $3
         AND id = ANY($4::int[])
       RETURNING id, numero, status, nome, telefone`,
      [nome, telefone, rifaId, numeroIds]
    );

    await client.query("COMMIT");
    return updateResult.rows;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

module.exports = {
  atualizarNumero,
  reservarNumerosPorIds,
};
