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

-- Seed: cria uma rifa base
INSERT INTO rifas (
  titulo, descricao, valorNumero, dataSorteio,
  chavePix, banco, mensagemFinal, totalNumeros
) VALUES (
  '💘 RIFA DE DIA DOS NAMORADOS 💘',
  'Em clima de amor e solidariedade, que tal ajudar uma causa especial?\n\nEstou organizando essa rifa para levantar um fundo estudantil pessoal...',
  'R$ 20,00',
  '2025-06-11',
  '05037890977',
  'Banco Inter - Taylaine',
  'Obrigada desde já pelo apoio e carinho! 💖',
  100
);

-- Criação da tabela de usuários (para login admin)
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role TEXT DEFAULT 'admin'
);
