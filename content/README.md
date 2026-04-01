# Cómo publicar artículos en Observa Perú

## Estructura

```
content/
  noticias/    ← artículos de noticias
  analisis/    ← artículos de análisis
```

## Publicar un artículo nuevo

1. Crear un archivo `.mdx` en la carpeta correspondiente.
2. El nombre del archivo será el **slug** de la URL. Ejemplo: `elecciones-peru-2026.mdx` → `/noticias/elecciones-peru-2026`
3. Añadir el frontmatter con los metadatos.
4. Escribir el contenido en Markdown.
5. Hacer deploy (Vercel detecta el cambio automáticamente).

**Sin necesidad de tocar ningún archivo TypeScript.**

---

## Frontmatter (campos disponibles)

```yaml
---
title: "Título del artículo"          # REQUERIDO — aparece en H1 y meta title
date: "2026-03-23"                     # REQUERIDO — formato YYYY-MM-DD
metaDescription: "Descripción SEO..." # REQUERIDO — 150-160 caracteres
keywords:                              # Opcional — para SEO
  - "keyword 1"
  - "keyword 2"
author: "Observa Perú"                 # Opcional — por defecto "Observa Perú"
tags:                                  # Opcional — el primer tag aparece en la card
  - "elecciones"
  - "candidatos"
image: "/images/articulos/mi-img.jpg"  # Opcional — para OpenGraph
bajada: "Subtítulo del artículo..."    # Opcional — aparece destacado bajo la fecha
references:                            # Opcional — lista de fuentes al final
  - "JNE — portal.jne.gob.pe"
  - "ONPE — www.onpe.gob.pe"
---
```

---

## Markdown disponible

```markdown
## Título H2
### Subtítulo H3

Párrafo normal con **negrita** y *cursiva*.

- Lista con viñetas
- Otro item

1. Lista numerada
2. Otro item

[Enlace interno](/candidatos)
[Enlace externo](https://www.jne.gob.pe)

> Cita o destacado

| Columna 1 | Columna 2 |
|-----------|-----------|
| Dato A    | Dato B    |

---  (separador)
```

---

## Componentes especiales (solo noticias)

Puedes insertar charts de React directamente en el MDX:

```mdx
<Electorado2026Chart />
<Multas2026Chart />
<Padron2026Chart />
```

Para análisis:

```mdx
<CandidatosPresidencialesEvolucionChart />
```

Para agregar nuevos componentes: editar `src/app/noticias/[slug]/page.tsx` o `src/app/analisis/[slug]/page.tsx` y añadir el componente al objeto `components`.

---

## Convenciones de naming

El slug afecta el SEO. Usa keywords relevantes:

```
candidatos-presidenciales-peru-2026.mdx     ✓
jne-proceso-electoral-2026-calendario.mdx   ✓
articulo1.mdx                               ✗  (no descriptivo)
mi-nuevo-post.mdx                           ✗  (sin keyword)
```

Formato: `keyword-principal-año.mdx` o `tema-subtema-año.mdx`

---

## Dónde aparece cada artículo

| Archivo | URL |
|---------|-----|
| `content/noticias/mi-articulo.mdx` | `/noticias/mi-articulo` |
| `content/analisis/mi-analisis.mdx` | `/analisis/mi-analisis` |

Automáticamente aparece en:
- La página de listado (`/noticias` o `/analisis`)
- El sitemap XML (para indexación en Google)
- Los metadatos de la página (title, description, OpenGraph)
