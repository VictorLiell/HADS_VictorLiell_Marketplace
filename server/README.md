# Server (Node + Express + TypeScript)

API simples com cadastro e login de usuário.

## Requisitos
- Node 18+
- PostgreSQL (local ou hospedado)

## Setup
1. Entre na pasta `server/`.
2. Crie um `.env` a partir do `.env.example`.
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Crie a tabela:
   ```bash
   psql "$DATABASE_URL" -f sql/001_init.sql
   ```
   > ou rode o script equivalente no seu gerenciador de banco.

5. Rode em modo dev:
   ```bash
   npm run dev
   ```

A API ficará em `http://localhost:3333`.

## Rotas
- `GET /health` → checagem
- `POST /api/usuarios` → { nome, email, senha }
- `POST /api/login` → { email, senha }
