const db = require('./connection');

const TOTAL_NUMEROS = 100;
const RIFA_ID = 1;

function inserirNumeros() {
  db.serialize(() => {
    const stmt = db.prepare('INSERT INTO numeros (numero, rifa_id) VALUES (?, ?)');

    for (let i = 1; i <= TOTAL_NUMEROS; i++) {
      stmt.run(i, RIFA_ID);
    }

    stmt.finalize((err) => {
      if (err) {
        console.error('Erro ao finalizar inserção:', err.message);
      } else {
        console.log('✅ Números inseridos com sucesso!');
      }
      db.close();
    });
  });
}

inserirNumeros();
