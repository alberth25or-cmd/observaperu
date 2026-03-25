# PRODUCT.md — Qué hace Observa Perú

## Visión estratégica

**Observa Perú es un medio digital en construcción, cuyo motor de crecimiento es el SEO orgánico.**

La estrategia tiene tres fases:

| Fase | Periodo | Foco |
|------|---------|------|
| 1 — Elecciones | Ahora → 2026 | Posicionarse en Google con contenido electoral de alta demanda |
| 2 — Diario digital | Post-elecciones | Convertirse en diario de noticias con volumen de contenido |
| 3 — Fintech | Mediano plazo | Pivotar hacia noticias financieras y educación fintech en Perú |

**Objetivo de tráfico:** 1,000 usuarios diarios activos (DAU) vía SEO orgánico.

---

## Resumen actual

**Observa Perú** es una plataforma web informativa e independiente orientada a las elecciones presidenciales del Perú 2026. El contenido electoral es el anzuelo SEO inicial: términos de alta búsqueda como "candidatos presidenciales Perú 2026", perfiles individuales de candidatos, propuestas, controversias.

**URL de producción:** https://www.observaperu.com
**Dominio actual:** Político / electoral
**Dominio objetivo:** Noticias generales → Fintech Perú
**Audiencia:** Ciudadanía peruana que busca información política e informarse sobre candidatos.

---

## Propósito

En un contexto de sobreinformación y polarización política, Observa Perú brinda:
- Información clara, verificable y accesible sobre candidatos
- Herramientas para comparar propuestas e ideologías
- Datos estadísticos sobre el universo de candidatos
- Análisis editoriales y noticias con contexto

La plataforma no promueve ni favorece a ningún candidato.

---

## Funcionalidades principales

### 1. Directorio de candidatos (`/candidatos`)
- Grid de tarjetas con foto y partido
- Filtros: búsqueda de texto, sexo, presencia en el Congreso actual
- Badge "En el Congreso actual" para candidatos con partido en el legislativo
- Hover effect: muestra logo del partido al pasar sobre la foto

### 2. Perfil de candidato (`/candidatos/[slug]`)
8 pestañas de información por candidato:
- Biografía
- Historial académico
- Controversias
- Ideología política
- Ingresos / financiamiento
- Experiencia política
- Logros
- Propuestas principales

Links a Plan de Gobierno y Hoja de Vida (JNE).

### 3. Mapa ideológico (`/mapa-ideologico`)
- Plano político 2D: eje económico (izquierda/derecha) × eje social (progresista/conservador)
- El usuario selecciona candidatos y los visualiza en el mapa
- Agrupación de candidatos en mismas coordenadas para evitar solapamiento
- Herramienta visual, no toma de postura política

### 4. Comparación lado a lado (`/comparacion`)
- Selector de dos candidatos con autocompletado
- Compara las mismas 8 dimensiones del perfil, en paralelo
- Útil para votantes indecisos

### 5. Dashboard estadístico (`/estadisticas`)
Múltiples secciones con visualizaciones:
- **KPIs**: métricas generales del universo de candidatos
- **Demografía**: pirámide poblacional, timeline generacional
- **Geografía**: ratio Lima vs regiones, mapa de burbujas, flujos territoriales, chord diagram
- **Perfil académico**: nivel máximo de estudios, tipo de universidad, top universidades, área profesional
- **Antecedentes electorales**: historial de postulaciones previas, tipo de postulación, heatmap
- **Persistencia política**: ranking, curva de Pareto, histogramas, scatter plot, boxplot, índices

### 6. Análisis (`/analisis`)
Artículos de análisis y opinión crítica sobre candidatos, propuestas y coyuntura electoral.

### 7. Noticias (`/noticias`)
Noticias con contexto sobre JNE, ONPE, partidos y proceso electoral.

### 8. Sobre nosotros (`/conocenos`)
Equipo de estudiantes (4 miembros) + servicios que ofrecen (reportes estadísticos, desarrollo web, dashboards, visualización de datos).

---

## Motor de crecimiento SEO

Para llegar a 1,000 DAU desde Google se necesita:

1. **Volumen de contenido** — docenas de artículos bien estructurados con keywords de alta demanda
2. **On-page SEO** — H1 único, meta description, schema `NewsArticle`/`Article`, canonical
3. **Google News** — sitemap de noticias separado (`/news-sitemap.xml`), formato de fecha correcto
4. **Velocidad de publicación** — actualmente los artículos están en TypeScript, requieren un deploy por cada publicación. Esto bloquea escalar contenido.
5. **Internal linking** — los perfiles de candidatos deben enlazar a artículos relacionados y viceversa

### Bottleneck crítico actual
Los artículos están en `src/data/articulos-analisis.ts` y `src/data/articulos-noticias.ts`. Cada nuevo artículo = rebuild + deploy. Esto es inviable para un diario. **Necesita migrar a un sistema de contenido desacoplado** (CMS headless, MDX, o JSON en `/public/data/`).

---

## Hoja de ruta de contenido

### Fase 1 — Política electoral (ahora)
- Perfiles de candidatos (ya implementado)
- Análisis de propuestas por tema (economía, seguridad, educación, salud)
- Cobertura de eventos electorales (debates, encuestas, JNE, ONPE)
- Keywords target: "candidatos Peru 2026", "[nombre candidato] propuestas", "elecciones presidenciales Peru"

### Fase 2 — Diario general (post-elecciones)
- Ampliar secciones: política, economía, tecnología, sociedad
- Publicación diaria de noticias
- Requiere CMS o pipeline automatizado de contenido

### Fase 3 — Fintech Perú (mediano plazo)
- Noticias sobre Yape, Plin, banca digital, regulación financiera
- Educación financiera (inversiones, AFP, créditos)
- Posicionarse como referente fintech en español para Perú

---

## Modelo de monetización (roadmap)

La monetización depende directamente del tráfico. Sin volumen de usuarios no hay ingresos. Secuencia lógica:

| Fase | Umbral de tráfico | Mecanismo |
|------|------------------|-----------|
| 1 | 0 → 1,000 DAU | Construir audiencia, sin monetización aún |
| 2 | 1,000+ DAU | Google AdSense / publicidad display |
| 3 | 5,000+ DAU | Contenido patrocinado, branded content |
| 4 | 10,000+ DAU | Newsletter de pago, membresías, eventos |
| Fintech | — | Comparadores financieros (afiliados), leads para bancos/fintechs |

### Vías de monetización planificadas
- **Publicidad display** (AdSense o red directa) — ingreso pasivo, se activa con volumen
- **Contenido patrocinado** — artículos pagados por partidos, instituciones, empresas
- **Newsletter** — captura de audiencia propia, eventual versión premium
- **Afiliados Fintech** — en Fase 3: comparadores de cuentas, préstamos, inversiones en Perú (modelo como comparabien.com)
- **Servicios del equipo** — reportes estadísticos, dashboards, visualización de datos para terceros

### Prerequisitos técnicos para monetizar
- [ ] Integrar Google AdSense (requiere tráfico mínimo aprobado por Google, ~100+ DAU)
- [ ] Crear página `/newsletter` con captura de emails
- [ ] Separar claramente contenido editorial de contenido patrocinado (requisito legal y de credibilidad)

---

## Analytics

- Google Analytics 4 (GA4): `G-MTBLSNLSLM`
- Google Tag Manager: `GTM-K76RR546`

---

## Candidatos incluidos (~35 candidatos)

Incluye todos los candidatos presidenciales registrados ante el JNE para las elecciones 2026. Ejemplos: Keiko Fujimori, Rafael López Aliaga, George Forsyth, César Acuña, Vladimir Cerrón, entre otros.
