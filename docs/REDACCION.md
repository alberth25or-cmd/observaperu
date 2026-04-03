# Sala de Redacción — Documentación

Panel editorial compartido en `observaperu.com/redaccion` para que el equipo valide artículos generados por los agentes IA antes de publicarlos.

---

## Arquitectura

```
Agentes Python (local)
  └── generan artículos → los guardan en Supabase (tabla: articulos)

observaperu.com/redaccion  (Vercel)
  └── lee/escribe Supabase vía API routes de Next.js
  └── el equipo aprueba o rechaza artículos

python run.py --publish-approved  (local)
  └── lee artículos aprobados de Supabase → escribe .mdx en content/
  └── hace commit + push → Vercel redeploya la web pública
```

---

## Supabase

### Proyecto
- **Organización:** observaperu
- **Project ID:** `slpxdfwzlnnopwwvbsik`
- **URL:** `https://slpxdfwzlnnopwwvbsik.supabase.co`
- **Region:** AWS us-east-1
- **Plan:** Free (NANO)

### Tabla: `articulos`

| Columna | Tipo | Descripción |
|---------|------|-------------|
| `id` | bigserial PK | ID autoincremental |
| `titulo` | text | Título del artículo |
| `slug` | text UNIQUE | URL slug (ej: `keiko-propone-plan`) |
| `contenido` | text | Cuerpo en Markdown |
| `keyword` | text | Keyword SEO principal |
| `categoria` | text | `noticias` \| `perfiles` \| `debates` \| `analisis` \| `faq` |
| `excerpt` | text | Resumen ≤150 caracteres |
| `tiempo_lectura` | int | Minutos estimados |
| `tipo` | text | `nuevo` \| `actualizacion` |
| `articulo_original_slug` | text | Solo si es actualización |
| `estado` | text | `pending` \| `approved` \| `rejected` \| `published` |
| `verificacion_json` | text | JSON con nivel_riesgo, observaciones, sugerencias |
| `requiere_revision_extendida` | boolean | true si riesgo medio/alto |
| `creado_en` | timestamptz | Fecha de creación |
| `aprobado_en` | timestamptz | Fecha de aprobación |
| `publicado_en` | timestamptz | Fecha de publicación |

### Recrear la tabla (si se borra)
Ejecutar en **Supabase Dashboard → SQL Editor** el archivo `agents/supabase_schema.sql`.

### Row Level Security
La tabla tiene RLS activado. Solo el `service_role` puede leer/escribir. La `anon` key NO tiene acceso — todo pasa por las API routes de Next.js (server-side con service_role).

### Cómo agregar una columna nueva
```sql
-- Ejemplo: agregar campo "autor"
alter table articulos add column autor text default 'Observa Perú';
```
Luego actualizar `supabase_queue.py` (Python) y la API route correspondiente en Next.js.

### Cómo ver los artículos directamente
Supabase Dashboard → **Table Editor** → tabla `articulos`.

### Cómo borrar artículos de prueba
```sql
delete from articulos where titulo ilike '%prueba%';
-- o por estado
delete from articulos where estado = 'rejected';
```

---

## Variables de entorno

### Vercel (Next.js — la web pública + sala de redacción)

| Variable | Valor | Para qué |
|----------|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://slpxdfwzlnnopwwvbsik.supabase.co` | Conectar a Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (secret) | Acceso completo server-side |
| `REVIEW_PASSWORD` | `observaredactores` | Contraseña de la sala de redacción |

> **Cambiar la contraseña:** En Vercel → Settings → Environment Variables → editar `REVIEW_PASSWORD` → Redeploy.

### Agentes Python (archivo `agents/.env`)

| Variable | Valor |
|----------|-------|
| `SUPABASE_URL` | `https://slpxdfwzlnnopwwvbsik.supabase.co` |
| `SUPABASE_SERVICE_KEY` | (la misma service_role key) |
| `ANTHROPIC_API_KEY` | `sk-ant-...` |
| `CMS_TYPE` | `nextjs_api` |
| `CMS_URL` | `../content` |
| `MAX_ARTICULOS_DIA` | `40` |

---

## Archivos clave

### Next.js (Vercel)
| Archivo | Qué hace |
|---------|----------|
| `middleware.ts` | Protege `/redaccion/*` — redirige a login si no hay cookie |
| `src/lib/supabase.ts` | Crea el cliente Supabase server-side |
| `src/app/redaccion/login/page.tsx` | Pantalla de login con contraseña |
| `src/app/redaccion/page.tsx` | UI completa de revisión editorial |
| `src/app/api/redaccion/login/route.ts` | POST — valida contraseña y setea cookie |
| `src/app/api/redaccion/stats/route.ts` | GET — contadores (pending/approved/etc) |
| `src/app/api/redaccion/queue/route.ts` | GET lista + POST crear artículo |
| `src/app/api/redaccion/queue/[id]/route.ts` | GET detalle + PUT editar |
| `src/app/api/redaccion/queue/[id]/approve/route.ts` | POST aprobar |
| `src/app/api/redaccion/queue/[id]/reject/route.ts` | POST rechazar |

### Python (agentes locales)
| Archivo | Qué hace |
|---------|----------|
| `agents/supabase_queue.py` | Cliente Supabase para los agentes Python |
| `agents/orchestrator.py` | Genera artículos y los guarda en Supabase |
| `agents/publisher_agent.py` | Lee aprobados de Supabase y publica .mdx |
| `agents/supabase_schema.sql` | SQL para crear la tabla (ejecutar en Supabase) |

---

## Flujo completo de un artículo

```
1. python run.py           → orchestrator genera artículos → Supabase (estado: pending)
2. observaperu.com/redaccion → equipo revisa → aprueba (estado: approved)
3. python run.py --publish-approved → publisher lee aprobados → escribe .mdx en content/
4. git push → Vercel redeploya → artículo visible en la web
```

---

## Tareas comunes

### Ver artículos pendientes
```
observaperu.com/redaccion  (filtro: Pendientes)
```

### Cambiar la contraseña del equipo
1. Vercel → proyecto observaperu → Settings → Environment Variables
2. Editar `REVIEW_PASSWORD`
3. Hacer Redeploy

### Agregar un miembro al equipo
Solo compartirles la URL `observaperu.com/redaccion` y la contraseña. No requiere cuenta.

### La tabla de Supabase se llenó de basura
```sql
-- Borrar rechazados viejos (más de 30 días)
delete from articulos
where estado = 'rejected'
and creado_en < now() - interval '30 days';
```

### Ver los keys de Supabase
Supabase Dashboard → proyecto observaperu → Settings → API Keys → pestaña "Legacy anon, service_role API keys"

### El agente Python no conecta a Supabase
Verificar que `agents/.env` tenga `SUPABASE_URL` y `SUPABASE_SERVICE_KEY` correctos.
Correr: `pip install supabase` si no está instalado.
