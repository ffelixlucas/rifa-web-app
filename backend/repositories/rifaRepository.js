const pool = require("../database/connection");

async function criarRifa(rifa) {
  const query = `
    INSERT INTO rifas (
      titulo, descricao, valorNumero, dataSorteio,
      chavePix, banco, mensagemFinal, totalNumeros, imagemUrl, finalizada
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,FALSE)
    RETURNING *;
  `;
  const values = [
    rifa.titulo,
    rifa.descricao,
    rifa.valorNumero,
    rifa.dataSorteio,
    rifa.chavePix,
    rifa.banco,
    rifa.mensagemFinal,
    rifa.totalNumeros,
    rifa.imagemUrl || null,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
}

async function gerarNumeros(rifaId, totalNumeros) {
  const queries = [];
  for (let i = 1; i <= totalNumeros; i++) {
    queries.push(
      pool.query(
        `INSERT INTO numeros (numero, status, rifa_id) VALUES ($1, 'disponivel', $2)`,
        [i, rifaId]
      )
    );
  }
  await Promise.all(queries);
}

async function buscarRifaPorId(id) {
  try {
    const result = await pool.query("SELECT * FROM rifas WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    console.error("Erro ao buscar rifa por ID:", error);
    throw error;
  }
}

async function buscarNumerosPorRifaId(rifaId) {
  try {
    const result = await pool.query(
      "SELECT * FROM numeros WHERE rifa_id = $1 ORDER BY numero ASC",
      [rifaId]
    );
    return result.rows;
  } catch (error) {
    console.error("Erro ao buscar números da rifa:", error);
    throw error;
  }
}

async function atualizarRifa(id, dados) {
  const query = `
    UPDATE rifas
    SET titulo = $1,
        descricao = $2,
        valorNumero = $3,
        dataSorteio = $4,
        chavePix = $5,
        banco = $6,
        mensagemFinal = $7,
        totalNumeros = $8,
        imagemUrl = $9
    WHERE id = $10
    RETURNING *;
  `;

  const values = [
    dados.titulo,
    dados.descricao,
    dados.valorNumero,
    dados.dataSorteio,
    dados.chavePix,
    dados.banco,
    dados.mensagemFinal,
    dados.totalNumeros,
    dados.imagemUrl || null,
    id
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

async function excluirRifa(id) {
  const query = `DELETE FROM rifas WHERE id = $1`;
  await pool.query(query, [id]);
}

async function finalizarRifa(id) {
  const query = `
    UPDATE rifas
    SET finalizada = TRUE
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
}

module.exports = {
  criarRifa,
  gerarNumeros,
  buscarRifaPorId,
  buscarNumerosPorRifaId,
  atualizarRifa,
  excluirRifa,
  finalizarRifa,
};
