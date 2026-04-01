# CLAUDE.md — Reglas de trabajo para este proyecto

## Identidad del proyecto

**Observa Perú** (`observaperu.com`) — plataforma cívica de información electoral para las elecciones presidenciales del Perú 2026.
Stack: Next.js 15 (App Router) + React 18 + TypeScript 5 + Tailwind CSS v4 + Recharts + react-simple-maps.

Documentación fuente de verdad: `/docs/`

---

## Reglas de desarrollo

### Mentalidad MVP — no sobreingeniería
- Construye lo mínimo que funcione. No agregues features que no se pidan.
- No añadas abstracción prematura. Tres líneas repetidas son preferibles a una utilidad innecesaria.
- No agregues manejo de errores para escenarios que no pueden ocurrir en producción.
- No uses feature flags ni capas de compatibilidad hacia atrás.

### Código limpio sin gold-plating
- No agregues comentarios, docstrings ni tipos extra a código que no modificaste.
- No refactorices código adyacente al cambio solicitado.
- No añadas logging, validaciones ni fallbacks innecesarios.
- Elimina código muerto en lugar de comentarlo.

### Antes de tocar código
- Lee el archivo antes de modificarlo.
- Si no entiendes el contexto, explora primero.
- No hagas cambios destructivos sin avisar explícitamente al usuario.

### Convenciones del proyecto
- Componentes en `src/components/`, páginas en `src/app/`.
- Datos estáticos (candidatos, artículos) en `src/data/` como módulos TypeScript.
- Datos estadísticos JSON en `public/data/` (cargados en runtime con fetch).
- Paleta de colores: azul oscuro `#0b1b3b`, fondo `#eef2fb`, texto secundario slate.
- El componente `Banner` mini-hero está duplicado en varias páginas — no crear más copias, idealmente extraerlo.
- `normalizeStr()` también está duplicada — candidato para extracción cuando haya necesidad real.

### Instrucciones para IA
- Usa `/docs/` como fuente de verdad del contexto del proyecto.
- Actualiza `/docs/TASKS.md` cuando identifiques o completes tareas.
- Propón mejoras proactivamente pero espera confirmación antes de implementarlas.
- Ante duda sobre el alcance de un cambio, pregunta antes de proceder.
- Nunca hagas push a git sin confirmación explícita.

---

## Estructura de navegación

```
/                   → Home
/candidatos         → Lista de candidatos con filtros
/candidatos/[slug]  → Perfil detallado de candidato
/mapa-ideologico    → Plano político interactivo
/comparacion        → Comparación lado a lado
/estadisticas       → Dashboard estadístico con charts
/analisis           → Artículos de análisis
/analisis/[slug]    → Artículo individual
/noticias           → Noticias electorales
/noticias/[slug]    → Noticia individual
/conocenos          → About + equipo + servicios
/contactanos        → Formulario de contacto
```

## Fuente de datos

| Tipo | Ubicación |
|------|-----------|
| Lista de candidatos | `src/data/candidatos.ts` |
| Detalle de candidatos | `src/data/candidatos-detalle.ts` |
| Artículos de análisis | `src/data/articulos-analisis.ts` |
| Noticias | `src/data/articulos-noticias.ts` |
| Estadísticas (runtime) | `public/data/*.json` |
