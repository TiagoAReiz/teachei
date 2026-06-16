-- supabase/migrations/001_schema.sql

create table if not exists usuarios (
  id          uuid primary key default gen_random_uuid(),
  email       text unique not null,
  senha_hash  text,
  google_id   text unique,
  aceitou_termos boolean not null default false,
  criado_em   timestamptz default now()
);

create table if not exists perfis (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references usuarios(id) on delete cascade,
  nome        text not null,
  bio         text,
  foto_url    text,
  whatsapp    text,
  instagram   text,
  facebook    text,
  cidade      text,
  estado      text,
  role        text not null default 'BUYER',
  criado_em   timestamptz default now()
);

create table if not exists anuncios (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references usuarios(id) on delete cascade,
  tipo        text not null,
  status      text not null default 'ATIVO',
  veiculo     jsonb not null,
  contato     jsonb not null,
  observacoes text,
  criado_em   timestamptz default now(),
  expira_em   timestamptz
);

create table if not exists favoritos (
  id          uuid primary key default gen_random_uuid(),
  usuario_id  uuid not null references usuarios(id) on delete cascade,
  anuncio_id  uuid not null references anuncios(id) on delete cascade,
  criado_em   timestamptz default now(),
  unique(usuario_id, anuncio_id)
);

-- Indexes for frequent FK lookups
create index if not exists idx_anuncios_usuario_id on anuncios(usuario_id);
create index if not exists idx_favoritos_anuncio_id on favoritos(anuncio_id);

-- One profile per user
alter table perfis add constraint perfis_usuario_id_unique unique (usuario_id);
