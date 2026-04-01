# ARCHITECTURE.md — Arquitectura actual del proyecto

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|------------|---------|
| Framework | Next.js (App Router) | ^15.2.5 |
| UI | React | 18.3.1 |
| Lenguaje | TypeScript | ^5 |
| Estilos | Tailwind CSS v4 | ^4 |
| Gráficos | Recharts | ^3.7.0 |
| Mapas | react-simple-maps | ^3.0.0 |
| Analytics | GA4 + GTM | — |
| Deploy | Vercel (inferido por dominio) | — |

---

## Estructura de directorios

```
observa-peru/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx                # Root layout (Navbar, GTM, GA4, JSON-LD)
│   │   ├── page.tsx                  # Home (Hero + FeatureCards + About + Footer)
│   │   ├── candidatos/
│   │   │   ├── page.tsx              # Lista con filtros (client)
│   │   │   └── [slug]/
│   │   │       ├── layout.tsx        # SEO metadata dinámica
│   │   │       └── page.tsx          # Perfil detallado con tabs (client)
│   │   ├── mapa-ideologico/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # Plano político interactivo (client)
│   │   ├── comparacion/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # Comparación lado a lado (client)
│   │   ├── estadisticas/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx              # Dashboard (client, fetch de JSONs)
│   │   ├── analisis/
│   │   │   ├── page.tsx              # Lista de artículos (server)
│   │   │   └── [slug]/
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx          # Artículo individual (server)
│   │   ├── noticias/
│   │   │   ├── page.tsx              # Lista de noticias (server)
│   │   │   └── [slug]/
│   │   │       ├── layout.tsx
│   │   │       └── page.tsx          # Noticia individual (server)
│   │   ├── conocenos/page.tsx        # About (server)
│   │   ├── contactanos/page.tsx      # Contacto (server/client)
│   │   ├── sitemap.ts                # Sitemap dinámico
│   │   └── globals.css               # Tailwind import + variables CSS
│   ├── components/
│   │   ├── Navbar.tsx                # Navegación responsive (client)
│   │   ├── Hero.tsx                  # Hero de home
│   │   ├── Footer.tsx
│   │   ├── FeatureCards.tsx
│   │   ├── AboutSection.tsx
│   │   ├── Analytics.tsx             # GA4 script injection
│   │   ├── KPICards.tsx
│   │   ├── PiramidePoblacional.tsx
│   │   ├── TimelineGeneracional.tsx
│   │   ├── RatioLimaRegiones.tsx
│   │   ├── MapaBurbujasPeru.tsx
│   │   ├── TerritorialDashboardSection.tsx
│   │   │   ├── TerritorialKPICards.tsx
│   │   │   ├── TerritorialComparativoChart.tsx
│   │   │   ├── MapaFlujosTerritoriales.tsx
│   │   │   ├── ChordTerritorial.tsx
│   │   │   ├── TerritorialMovilidadChart.tsx
│   │   │   ├── TopFlujosTable.tsx
│   │   │   └── TerritorialInsights.tsx
│   │   ├── PerfilAcademicoSection.tsx
│   │   │   ├── NivelMaximoChart.tsx
│   │   │   ├── TipoUniversidadChart.tsx
│   │   │   ├── TopUniversidadesChart.tsx
│   │   │   ├── AreaProfesionalChart.tsx
│   │   │   └── EstudiosInsights.tsx
│   │   ├── antecedentes/
│   │   │   ├── AntecedentesElectoralesSection.tsx
│   │   │   ├── AntecedentesKPICards.tsx
│   │   │   ├── AntecedentesDonutChart.tsx
│   │   │   ├── AntecedentesTipoPostulacionChart.tsx
│   │   │   ├── AntecedentesSenadoDiputadoChart.tsx
│   │   │   ├── AntecedentesHeatmap.tsx
│   │   │   └── AntecedentesInsights.tsx
│   │   ├── postulaciones/
│   │   │   ├── PostulacionesSection.tsx
│   │   │   ├── PostulacionesKPICards.tsx
│   │   │   ├── PostulacionesRankingChart.tsx
│   │   │   ├── PostulacionesParetoChart.tsx
│   │   │   ├── PostulacionesHistogramChart.tsx
│   │   │   ├── PostulacionesScatterChart.tsx
│   │   │   ├── PostulacionesBoxplotVisual.tsx
│   │   │   ├── PostulacionesIndicesChart.tsx
│   │   │   └── PostulacionesInsights.tsx
│   │   └── noticias/
│   │       ├── Electorado2026Chart.tsx
│   │       ├── Padron2026Chart.tsx
│   │       └── Multas2026Chart.tsx
│   └── data/                         # Módulos TypeScript con datos embebidos
│       ├── candidatos.ts             # Lista de candidatos (nombre, partido, imagen, coords ideológicas)
│       ├── candidatos-detalle.ts     # Perfil detallado por slug
│       ├── articulos-analisis.ts     # Artículos de análisis
│       └── articulos-noticias.ts     # Artículos de noticias
├── public/
│   ├── data/                         # JSONs cargados en runtime (estadísticas)
│   │   ├── candidatos_edades.json
│   │   ├── candidatos_lugares_detalle.json
│   │   ├── candidatos_estudios_universitarios.json
│   │   ├── candidatos_scores.json
│   │   ├── candidatos_antecedentes_electorales.json  # puede no existir aún
│   │   └── numerode_postulaciones.json               # puede no existir aún
│   ├── candidatos/                   # Fotos .webp de candidatos
│   ├── partidos/                     # Logos .webp de partidos
│   └── team/                         # Fotos del equipo
├── CLAUDE.md
├── docs/
├── package.json
└── postcss.config.mjs
```

---

## Patrones arquitectónicos

### Server vs Client Components
- **Server Components** (default): páginas estáticas como `/analisis`, `/noticias`, `/conocenos` — renderizan en servidor, mejor SEO.
- **Client Components** (`"use client"`): páginas con estado interactivo — `/candidatos`, `/mapa-ideologico`, `/comparacion`, `/estadisticas`.

### Capa de datos
Dos patrones distintos según el tipo de dato:

**1. Datos embebidos en bundle (TypeScript modules)**
```
src/data/candidatos.ts         → import { ALL_CANDIDATES } from "@/data/candidatos"
src/data/candidatos-detalle.ts → import { getCandidateDetail } from "@/data/candidatos-detalle"
```
Pros: sin latencia, sin fetch. Contras: aumenta el bundle, requiere rebuild para actualizar.

**2. Datos estadísticos cargados en runtime (JSON fetch)**
```
fetch("/data/candidatos_edades.json")         → useEffect en EstadisticasPage
fetch("/data/candidatos_lugares_detalle.json")
...
```
Pros: actualizable sin rebuild. Contras: loading state, posibles errores de red.

### SEO
- Metadata estática por página (`export const metadata`)
- Metadata dinámica en layouts de `[slug]` routes
- JSON-LD `WebSite` schema en root layout
- Canonical URLs y OpenGraph configurados
- Sitemap dinámico en `src/app/sitemap.ts`

### Analytics
- GTM (`GTM-K76RR546`) cargado con `strategy="beforeInteractive"`
- GA4 (`G-MTBLSNLSLM`) cargado con `strategy="afterInteractive"` via `<Analytics />`

---

## Deuda técnica identificada

| Problema | Impacto | Prioridad |
|----------|---------|-----------|
| Componente `Banner` duplicado en ~7 páginas | Mantenimiento | Media |
| Función `normalizeStr()` duplicada en 3+ archivos | Mantenimiento | Baja |
| Algunos JSONs de estadísticas pueden no existir (`antecedentes`, `postulaciones`) | Runtime error | Alta |
| Tab "Historial académico" dice "Edad y biografía" en `/candidatos/[slug]` (mislabel) | UX | Baja |
| `any` types en `estadisticas/page.tsx` (`lugaresData`, `estudiosData`, etc.) | Type safety | Baja |
