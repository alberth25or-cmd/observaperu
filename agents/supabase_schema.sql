-- ============================================================
-- Observa Perú — Schema Supabase
-- Ejecutar en: Supabase Dashboard → SQL Editor
-- ============================================================

create table if not exists articulos (
  id                          bigserial primary key,
  titulo                      text not null,
  slug                        text not null unique,
  contenido                   text not null,
  keyword                     text not null default '',
  categoria                   text not null default 'noticias',
  excerpt                     text,
  tiempo_lectura              int,
  tipo                        text default 'nuevo',
  articulo_original_slug      text,
  estado                      text default 'pending',   -- pending | approved | rejected | published
  verificacion_json           text,
  requiere_revision_extendida boolean default false,
  creado_en                   timestamptz default now(),
  aprobado_en                 timestamptz,
  publicado_en                timestamptz
);

-- Índices útiles
create index if not exists idx_articulos_estado  on articulos (estado);
create index if not exists idx_articulos_slug    on articulos (slug);
create index if not exists idx_articulos_creado  on articulos (creado_en desc);

-- Row Level Security: solo el service_role puede leer/escribir
alter table articulos enable row level security;

create policy "service_role full access"
  on articulos
  using (true)
  with check (true);
