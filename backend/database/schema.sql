-- Criação da tabela de rifas
CREATE TABLE IF NOT EXISTS rifas (
  id SERIAL PRIMARY KEY,
  titulo TEXT,
  descricao TEXT,
  valorNumero TEXT,
  dataSorteio TEXT,
  chavePix TEXT,
  banco TEXT,
  mensagemFinal TEXT,
  totalNumeros INTEGER
);

-- Criação da tabela de números
CREATE TABLE IF NOT EXISTS numeros (
  id SERIAL PRIMARY KEY,
  numero INTEGER,
  status TEXT DEFAULT 'disponivel',
  nome TEXT,
  rifa_id INTEGER REFERENCES rifas(id) ON DELETE CASCADE
);

-- Criação da tabela de usuários (para login admin)
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role TEXT DEFAULT 'admin'
);

-- Alterações para adicionar campos opcionais na tabela rifas
ALTER TABLE rifas ADD COLUMN IF NOT EXISTS imagemUrl TEXT;
ALTER TABLE rifas ADD COLUMN IF NOT EXISTS ganhadorNumeroId INTEGER REFERENCES numeros(id);
ALTER TABLE rifas ADD COLUMN IF NOT EXISTS finalizada BOOLEAN DEFAULT FALSE;

-- Seed da rifa base (rodar só uma vez manualmente ou controlar duplicidade)
INSERT INTO rifas (
  titulo, descricao, valorNumero, dataSorteio,
  chavePix, banco, mensagemFinal, totalNumeros
) SELECT
  '💘 RIFA DE DIA DOS NAMORADOS 💘',
  'Em clima de amor e solidariedade, que tal ajudar uma causa especial?\n\nEstou organizando essa rifa para levantar um fundo estudantil pessoal...',
  'R$ 20,00',
  '2025-06-11',
  '05037890977',
  'Banco Inter - Taylaine',
  'Obrigada desde já pelo apoio e carinho! 💖',
  100
WHERE NOT EXISTS (SELECT 1 FROM rifas WHERE titulo = '💘 RIFA DE DIA DOS NAMORADOS 💘');
