# TASKS.md — Tareas actuales y pendientes

_Actualizar este archivo al completar o descubrir tareas._
_Fecha de última revisión: 2026-03-23_

---

## En progreso

_(vacío)_

---

## ESTRATEGIA — Para llegar a 1,000 DAU

El crecimiento depende de SEO orgánico. Las tres palancas son:
1. **Contenido** — más artículos, bien estructurados, con keywords correctas
2. **Técnica SEO** — schema markup, Google News sitemap, Core Web Vitals
3. **Pipeline de publicación** — desacoplar contenido del código (hoy no escala)

---

## Pendientes — Crítico (bloquea escalar contenido)

- [ ] **Migrar sistema de artículos a JSON o MDX**
  - Problema: `src/data/articulos-analisis.ts` y `src/data/articulos-noticias.ts` requieren un deploy por cada artículo publicado
  - Opciones (de menor a mayor complejidad):
    - **Opción A (más rápida)**: mover artículos a JSONs en `/public/data/` igual que las estadísticas
    - **Opción B (escalable)**: archivos `.mdx` en `/content/` con `next-mdx-remote` o similar
    - **Opción C (CMS)**: Sanity, Contentful o Notion API para edición sin código
  - Confirmar con el usuario cuál adoptar antes de implementar

- [ ] **Aumentar volumen de artículos en `/noticias` y `/analisis`**
  - Objetivo mínimo para SEO: 20+ artículos publicados con keywords relevantes
  - Keywords prioritarias: "candidatos presidenciales Peru 2026", "elecciones Peru 2026", "[nombre candidato] propuestas", "JNE Peru 2026"
  - Cada artículo debe tener: título con keyword, meta description única, H2s estructurados, mínimo 600 palabras

---

## Pendientes — Alta prioridad (SEO técnico)

- [ ] **Añadir schema.org `NewsArticle` en páginas de artículos**
  - Actualmente solo hay `WebSite` schema en el root layout
  - Implementar en `src/app/noticias/[slug]/layout.tsx` y `src/app/analisis/[slug]/layout.tsx`
  - Campos mínimos: `headline`, `datePublished`, `dateModified`, `author`, `publisher`, `image`

- [ ] **Crear Google News sitemap (`/news-sitemap.xml`)**
  - El sitemap actual (`sitemap.ts`) es genérico
  - Google News requiere un sitemap separado con `<news:publication>`, `<news:publication_date>`, `<news:title>`
  - Solo incluye artículos publicados en los últimos 2 días para indexación inmediata

- [ ] **Añadir schema.org `Person` en perfiles de candidatos**
  - Mejora E-E-A-T y visibilidad en Google Knowledge Panel
  - Implementar en `src/app/candidatos/[slug]/layout.tsx`
  - Campos: `name`, `jobTitle`, `affiliation` (partido), `birthDate`, `url`

- [ ] **Verificar existencia de JSONs faltantes en `/public/data/`**
  - `candidatos_antecedentes_electorales.json` — referenciado pero no confirmado
  - `numerode_postulaciones.json` — ídem
  - Si no existen: crearlos o deshabilitar las secciones que los consumen

- [ ] **Validar que todas las rutas `/candidatos/[slug]` funcionan correctamente**
  - ~35 candidatos — confirmar que todos tienen entrada en `src/data/candidatos-detalle.ts`

---

## Pendientes — Media prioridad

- [ ] **Corregir label incorrecto en perfil de candidato**
  - `src/app/candidatos/[slug]/page.tsx:105`: pestaña "Historial académico" muestra `<h2>Edad y biografía</h2>`

- [ ] **Página 404 personalizada**
  - Crear `src/app/not-found.tsx` con diseño del sitio

- [ ] **Extraer `Banner` a componente compartido**
  - Duplicado en ~7 páginas. Extraer a `src/components/Banner.tsx`
  - _Solo cuando haya que cambiar el Banner_

- [ ] **Optimización de imágenes**
  - Logo en Navbar: `width={1200}` para un elemento de 110px — añadir `sizes` correcto

---

## Pendientes — Baja prioridad / Ideas futuras

- [ ] **Sección Fintech** — nueva categoría en noticias para cubrir Yape, Plin, banca digital, regulación financiera en Perú (Fase 3 del producto)
- [ ] **Newsletter** — captura de emails para construir audiencia propia independiente de Google
- [ ] **Página de encuestas electorales** — alta demanda de búsqueda, fácil de posicionar
- [ ] **Tipar `any` en `estadisticas/page.tsx`**

---

## Completadas

- [x] Setup inicial del proyecto con Next.js 15 + App Router
- [x] Implementar directorio de candidatos con filtros
- [x] Implementar perfil individual con 8 tabs
- [x] Implementar mapa ideológico interactivo
- [x] Implementar comparación lado a lado
- [x] Implementar dashboard estadístico (demografía, geografía, académico)
- [x] Implementar secciones Antecedentes electorales y Persistencia política
- [x] Configurar GTM + GA4
- [x] Configurar SEO base (metadata, OpenGraph, canonical, sitemap)
- [x] Publicar en producción (`observaperu.com`)
- [x] Agregar fotos de candidatos (rama `add-imgs`)
