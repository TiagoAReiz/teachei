-- supabase/migrations/002_vendas_avaliacoes.sql
-- Vendedor declara que vendeu para o comprador de uma intenção; o comprador pode então avaliá-lo.

create table if not exists vendas (
  id            uuid primary key default gen_random_uuid(),
  anuncio_id    uuid references anuncios(id) on delete set null,
  vendedor_id   uuid not null references usuarios(id) on delete cascade,
  comprador_id  uuid not null references usuarios(id) on delete cascade,
  criado_em     timestamptz default now(),
  unique(anuncio_id, vendedor_id)
);

create table if not exists avaliacoes (
  id            uuid primary key default gen_random_uuid(),
  venda_id      uuid not null unique references vendas(id) on delete cascade,
  avaliador_id  uuid not null references usuarios(id) on delete cascade,
  avaliado_id   uuid not null references usuarios(id) on delete cascade,
  nota          smallint not null check (nota between 1 and 5),
  comentario    text,
  criado_em     timestamptz default now()
);

create index if not exists idx_vendas_comprador_id on vendas(comprador_id);
create index if not exists idx_avaliacoes_avaliado_id on avaliacoes(avaliado_id);
