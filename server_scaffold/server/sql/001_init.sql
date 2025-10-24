-- Tabela simples de usuários
create table if not exists usuarios (
  id serial primary key,
  nome text not null,
  email text unique not null,
  senha_hash text not null,
  created_at timestamp with time zone default now()
);
