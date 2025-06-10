const pool = require("../database/connection");

async function criarRifa(rifa) {
  const query = `
INSERT INTO rifas (
  titulo, descricao, valorNumero, dataSorteio,
  chavePix, banco, mensagemFinal, totalNumeros,
  imagemUrl, telefoneContato, descricaopremio, finalizada
) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,FALSE)
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
    rifa.telefoneContato || null,
    rifa.descricaoPremio || null,
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

async function buscarTodasRifas() {
  try {
    const result = await pool.query(`
      SELECT 
        id,
        titulo,
        descricao,
        valorNumero,
        dataSorteio AS "dataSorteio",
        chavePix,
        banco,
        mensagemFinal,
        totalNumeros,
        imagemUrl,
        finalizada,
        descricaoPremio
      FROM rifas
      ORDER BY id DESC
    `);
    return result.rows;
  } catch (error) {
    console.error("Erro ao buscar todas as rifas:", error);
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
        imagemUrl = $9,
        descricaoPremio = $10
    WHERE id = $11
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
    dados.descricaoPremio || null,
    id,
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

async function sortearNumeroPago(rifaId) {
  // 1. Buscar todos os números com status = 'pago' e que ainda NÃO foram sorteados
  const query = `
    SELECT n.*
    FROM numeros n
    WHERE n.rifa_id = $1
      AND n.status = 'pago'
      AND NOT EXISTS (
        SELECT 1 FROM sorteios s
        WHERE s.numero_id = n.id
        AND s.rifa_id = $1
      );
  `;

  const result = await pool.query(query, [rifaId]);
  const numerosValidos = result.rows;

  if (numerosValidos.length === 0) {
    throw new Error("Nenhum número restante para sortear.");
  }

  // 2. Escolher um número aleatório
  const indiceSorteado = Math.floor(Math.random() * numerosValidos.length);
  const numeroSorteado = numerosValidos[indiceSorteado];

  // 3. Verificar quantos sorteios já ocorreram para essa rifa
  const resContagem = await pool.query(
    `SELECT COUNT(*) FROM sorteios WHERE rifa_id = $1`,
    [rifaId]
  );
  const colocacao = parseInt(resContagem.rows[0].count) + 1;

  // 4. Registrar o sorteio
  await pool.query(
    `INSERT INTO sorteios (rifa_id, numero_id, colocacao) VALUES ($1, $2, $3)`,
    [rifaId, numeroSorteado.id, colocacao]
  );

  // 5. Retornar os dados
  return {
    numero: numeroSorteado.numero,
    nome: numeroSorteado.nome,
    colocacao: colocacao,
  };
}

async function listarSorteiosDaRifa(rifaId) {
  const query = `
    SELECT s.colocacao, n.numero, n.nome, s.data
    FROM sorteios s
    JOIN numeros n ON s.numero_id = n.id
    WHERE s.rifa_id = $1
    ORDER BY s.colocacao ASC;
  `;
  const result = await pool.query(query, [rifaId]);
  return result.rows;
}

module.exports = {
  criarRifa,
  gerarNumeros,
  buscarRifaPorId,
  buscarNumerosPorRifaId,
  buscarTodasRifas,
  atualizarRifa,
  excluirRifa,
  finalizarRifa,
  sortearNumeroPago,
  listarSorteiosDaRifa,
};
