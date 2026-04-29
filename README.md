# Premia

Plataforma web para criação, divulgação e gestão de rifas online. O projeto reúne página pública para compradores, reserva de números, painel administrativo, controle de participantes e fluxo de sorteio.

## Demo

- Rifa pública: [premia-app.vercel.app/rifa/9](https://premia-app.vercel.app/rifa/9)

## Objetivo

Criar uma experiência simples para quem compra números e uma área administrativa prática para acompanhar rifas, participantes, reservas e sorteios.

## Funcionalidades

- Página pública da rifa com detalhes, números e disponibilidade
- Seleção e reserva de números
- Painel administrativo para criação e gestão de rifas
- Controle de compradores e status de participação
- Autenticação para área administrativa
- Tela dedicada para sorteio
- Separação entre frontend e backend

## Stack

**Frontend**

- React
- Vite
- React Router
- Tailwind CSS
- Styled Components
- Framer Motion

**Backend**

- Node.js
- Express
- JWT
- PostgreSQL
- SQLite

## Estrutura

```text
.
├── src/          # Interface React
├── backend/      # API, autenticação e persistência
├── public/       # Arquivos públicos
└── package.json
```

## Como rodar localmente

Frontend:

```bash
npm install
npm run dev
```

Backend:

```bash
cd backend
npm install
npm start
```

> Configure as variáveis de ambiente localmente. Arquivos `.env` reais não devem ser versionados.

## Status

Projeto em evolução, usado como vitrine de fluxo completo com frontend, backend, autenticação, banco de dados e gestão administrativa.
