"""
writer_agents.py — Agentes escritores por categoría

Clases:
  ArticleWriter (base)
  PerfilesWriter   → 12 artículos/día
  DebatesWriter    → 10 artículos/día
  NoticiasWriter   → 10 artículos/día
  AnalisisWriter   →  8 artículos/día
  FAQWriter        → artículos restantes

Cada writer llama a Claude con el system prompt de su categoría y retorna
un dict con frontmatter parseado + contenido markdown completo.
"""

import asyncio
import logging
import re
from datetime import date
from pathlib import Path
from typing import Any

import anthropic
from slugify import slugify

import config

logger = logging.getLogger(__name__)

PROMPTS_DIR = Path(__file__).parent / "prompts"

NOTA_ACTUALIZACION = (
    "*Este artículo actualiza información publicada anteriormente. "
    "[Ver artículo original →](/noticias/{slug})*\n\n"
)

# Categorías que van a content/analisis/ vs content/noticias/
CATEGORIAS_ANALISIS = {"analisis"}
CATEGORIAS_NOTICIAS = {"noticias", "perfiles", "debates", "faq"}


# ---------------------------------------------------------------------------
# Base
# ---------------------------------------------------------------------------

class ArticleWriter:

    categoria: str = "noticias"
    system_prompt_file: str = "system_noticias.md"

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)
        self.tokens_input = 0
        self.tokens_output = 0
        self._system_prompt: str | None = None

    @property
    def system_prompt(self) -> str:
        if self._system_prompt is None:
            path = PROMPTS_DIR / self.system_prompt_file
            try:
                self._system_prompt = path.read_text(encoding="utf-8")
            except FileNotFoundError:
                self._system_prompt = f"Eres un redactor de artículos sobre {self.categoria} para Observa Perú."
        return self._system_prompt

    def _build_user_prompt(self, tema: dict, contexto_ingesta: dict) -> str:
        titulo    = tema.get("titulo", "")
        keyword   = tema.get("keyword", "")
        angulo    = tema.get("angulo", "")
        tipo      = tema.get("tipo", "nuevo")
        orig_slug = tema.get("articulo_original_slug", "")
        hoy       = date.today().isoformat()
        palabras_titulo = titulo.lower().split()

        contexto_str = ""

        # 1. DATOS ESTADÍSTICOS DE DEBATES (fuente propia — diferencial legal)
        stats_debates = contexto_ingesta.get("debate_stats", {})
        if stats_debates:
            candidatos_en_titulo = [
                c for c in stats_debates.get("candidatos", [])
                if any(p in titulo.lower() for p in c.get("nombre", "").lower().split()[:2])
            ][:3]

            if candidatos_en_titulo:
                contexto_str += "\n\n=== DATOS ESTADÍSTICOS PROPIOS DE OBSERVA PERÚ (úsalos como base del análisis) ===\n"
                grupo = stats_debates.get("candidatos", [])
                prom_tiempo = sum(c.get("tiempoSegundos", 0) for c in grupo) / max(len(grupo), 1)
                prom_interv = sum(c.get("intervenciones", 0) for c in grupo) / max(len(grupo), 1)

                for c in candidatos_en_titulo:
                    temas_top = sorted(
                        c.get("temas", {}).items(), key=lambda x: x[1], reverse=True
                    )[:3]
                    contexto_str += (
                        f"\nCandidato: {c['nombre']} ({c.get('partido', '')})\n"
                        f"  Tiempo total de habla : {c.get('tiempoLabel', '')} "
                        f"({'por encima' if c.get('tiempoSegundos',0) > prom_tiempo else 'por debajo'} del promedio)\n"
                        f"  Intervenciones        : {c.get('intervenciones', 0)} "
                        f"(promedio del grupo: {prom_interv:.0f})\n"
                        f"  Promedio por interv.  : {c.get('promSegPorInterv', 0)}s\n"
                        f"  Palabras totales      : {c.get('palabrasTotales', 0):,}\n"
                        f"  % Ataque              : {c.get('porcentajeAtaque', 0)}%\n"
                        f"  % Propuesta           : {c.get('porcentajePropuesta', 0)}%\n"
                        f"  % Neutro              : {c.get('porcentajeNeutro', 0)}%\n"
                        f"  Temas predominantes   : {', '.join(f'{t}={round(v*100)}%' for t,v in temas_top)}\n"
                    )

                contexto_str += f"\nDebate: {stats_debates.get('metadata', {}).get('jornada', '')} — {stats_debates.get('metadata', {}).get('fecha', '')}\n"
                contexto_str += "=== FIN DATOS ESTADÍSTICOS ===\n"

        # 2. DATOS ESTRUCTURADOS DEL CANDIDATO (fuente propia)
        candidatos_mencionados = [
            c for c in contexto_ingesta.get("candidatos", [])
            if any(p in titulo.lower() for p in c.get("nombre", "").lower().split()[:2])
        ][:2]
        if candidatos_mencionados:
            contexto_str += "\n\n=== DATOS DEL CANDIDATO (fuente: base de datos Observa Perú) ===\n"
            for c in candidatos_mencionados:
                contexto_str += (
                    f"Nombre     : {c['nombre']}\n"
                    f"Partido    : {c['partido']}\n"
                    f"Edad       : {c.get('edad', 'N/D')} años\n"
                    f"Cargo previo: {c.get('cargo_previo', 'N/D')}\n"
                    f"Región     : {c.get('region_nacimiento', 'N/D')}\n"
                )
            contexto_str += "=== FIN DATOS CANDIDATO ===\n"

        # 3. HECHOS RECIENTES (solo títulos como referencia del tema — NO copiar texto)
        noticias_ref = [
            n for n in contexto_ingesta.get("noticias_hoy", [])
            if any(p in n.get("titulo", "").lower() for p in palabras_titulo[:4])
        ][:3]
        if noticias_ref:
            contexto_str += "\n\n=== HECHOS RECIENTES DE REFERENCIA (NO copiar, solo usar como contexto del tema) ===\n"
            for n in noticias_ref:
                contexto_str += f"- Hecho: {n['titulo']} (Fuente: {n['fuente']})\n"
            contexto_str += "=== FIN HECHOS (redacción 100% propia requerida) ===\n"

        actualizacion_note = ""
        if tipo == "actualizacion" and orig_slug:
            actualizacion_note = (
                f"\n\nIMPORTANTE: Artículo de ACTUALIZACIÓN de '{orig_slug}'. "
                f"Añade nota de actualización al inicio del contenido."
            )

        return (
            f"Escribe un artículo completamente original para Observa Perú.\n\n"
            f"Título    : {titulo}\n"
            f"Keyword   : {keyword}\n"
            f"Ángulo    : {angulo}\n"
            f"Categoría : {self.categoria}\n"
            f"Fecha     : {hoy}\n"
            f"Tipo      : {tipo}{actualizacion_note}"
            f"{contexto_str}\n\n"
            f"IMPORTANTE: Basa el artículo en los datos estadísticos propios proporcionados arriba. "
            f"No copies texto de otros medios. Los hechos son públicos, la redacción debe ser 100% original.\n"
            f"Genera el artículo COMPLETO con frontmatter YAML al inicio."
        )

    def _parse_article(self, raw: str, tema: dict) -> dict:
        """Extrae frontmatter y contenido del texto generado por Claude."""
        # Extraer bloque frontmatter YAML
        fm_match = re.match(r'^---\s*\n(.*?)\n---\s*\n(.*)', raw, re.DOTALL)
        if fm_match:
            frontmatter_raw = fm_match.group(1)
            contenido = fm_match.group(2).strip()
        else:
            frontmatter_raw = ""
            contenido = raw.strip()

        # Parsear campos del frontmatter manualmente (sin PyYAML para evitar dependencia)
        def _get_field(key: str, default: Any = "") -> Any:
            pattern = rf'^{key}:\s*(.+)$'
            m = re.search(pattern, frontmatter_raw, re.MULTILINE)
            if m:
                val = m.group(1).strip().strip('"').strip("'")
                return val
            return default

        hoy = date.today().isoformat()
        titulo = _get_field("title") or tema.get("titulo", "")
        slug_raw = _get_field("slug") or slugify(titulo, allow_unicode=False, separator="-")
        slug = slugify(slug_raw, allow_unicode=False, separator="-")[:100]

        # tiempo_lectura: aproximar por palabras (200 palabras/min)
        palabras = len(contenido.split())
        tiempo = max(1, round(palabras / 200))
        try:
            tiempo = int(_get_field("tiempo_lectura") or tiempo)
        except (ValueError, TypeError):
            pass

        requiere_revision = _get_field("requiere_revision_extendida", "false").lower() == "true"
        if self.categoria == "analisis":
            requiere_revision = True

        tipo = tema.get("tipo", _get_field("tipo", "nuevo"))
        orig_slug = tema.get("articulo_original_slug", _get_field("articulo_original_slug", ""))

        # Añadir nota de actualización al inicio del contenido
        if tipo == "actualizacion" and orig_slug:
            nota = NOTA_ACTUALIZACION.format(slug=orig_slug)
            if not contenido.startswith("*Este artículo actualiza"):
                contenido = nota + contenido

        # Añadir sugerencias de links internos si no están
        if "<!-- LINKS INTERNOS" not in contenido:
            contenido += (
                "\n\n<!-- LINKS INTERNOS SUGERIDOS:\n"
                "- /candidatos\n"
                "- /estadisticas\n"
                "- /debates\n"
                "-->"
            )

        excerpt = _get_field("excerpt") or (contenido[:147] + "..." if len(contenido) > 150 else contenido)
        excerpt = re.sub(r'[#*\[\]`]', '', excerpt)[:150]

        meta = _get_field("metaDescription") or excerpt[:160]

        return {
            "titulo":                  titulo,
            "slug":                    slug,
            "contenido":               contenido,
            "keyword":                 tema.get("keyword", _get_field("keyword", "")),
            "categoria":               self.categoria,
            "excerpt":                 excerpt,
            "tiempo_lectura":          tiempo,
            "tipo":                    tipo,
            "articulo_original_slug":  orig_slug or None,
            "requiere_revision_extendida": requiere_revision,
            "metaDescription":         meta,
            # Para el publisher MDX
            "date":                    hoy,
            "author":                  "Observa Perú",
        }

    async def write(self, tema: dict, contexto_ingesta: dict) -> dict:
        """Genera un artículo completo. Retorna dict con todos los campos."""
        user_prompt = self._build_user_prompt(tema, contexto_ingesta)
        try:
            msg = self.client.messages.create(
                model=config.CLAUDE_MODEL,
                max_tokens=4000,
                system=self.system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            )
            self.tokens_input += msg.usage.input_tokens
            self.tokens_output += msg.usage.output_tokens
            raw = msg.content[0].text
            return self._parse_article(raw, tema)
        except Exception as e:
            logger.error(f"Error en writer {self.categoria} para '{tema.get('titulo')}': {e}")
            return {}

    @property
    def costo_estimado(self) -> float:
        return (
            self.tokens_input * config.PRICE_INPUT_PER_TOKEN +
            self.tokens_output * config.PRICE_OUTPUT_PER_TOKEN
        )


# ---------------------------------------------------------------------------
# Subclases por categoría
# ---------------------------------------------------------------------------

class PerfilesWriter(ArticleWriter):
    categoria = "perfiles"
    system_prompt_file = "system_perfiles.md"
    articulos_dia = 12


class DebatesWriter(ArticleWriter):
    categoria = "debates"
    system_prompt_file = "system_debates.md"
    articulos_dia = 10


class NoticiasWriter(ArticleWriter):
    categoria = "noticias"
    system_prompt_file = "system_noticias.md"
    articulos_dia = 10


class AnalisisWriter(ArticleWriter):
    categoria = "analisis"
    system_prompt_file = "system_analisis.md"
    articulos_dia = 8

    def _parse_article(self, raw: str, tema: dict) -> dict:
        art = super()._parse_article(raw, tema)
        art["requiere_revision_extendida"] = True
        return art


class FAQWriter(ArticleWriter):
    categoria = "faq"
    system_prompt_file = "system_faq.md"
    articulos_dia = 0  # el resto hasta MAX_ARTICULOS_DIA


# ---------------------------------------------------------------------------
# Factory
# ---------------------------------------------------------------------------

WRITERS: dict[str, type[ArticleWriter]] = {
    "perfiles": PerfilesWriter,
    "debates":  DebatesWriter,
    "noticias": NoticiasWriter,
    "analisis": AnalisisWriter,
    "faq":      FAQWriter,
}

def get_writer(categoria: str) -> ArticleWriter:
    cls = WRITERS.get(categoria, NoticiasWriter)
    return cls()


# ---------------------------------------------------------------------------
# Test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import asyncio
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    async def main():
        if not config.ANTHROPIC_API_KEY:
            print("ANTHROPIC_API_KEY no configurada. No se puede testear writer.")
            print("Instancia de PerfilesWriter creada: OK")
            w = PerfilesWriter()
            print(f"  System prompt cargado: {len(w.system_prompt)} chars")
            return

        w = FAQWriter()
        tema_test = {
            "titulo": "¿Se puede votar con DNI vencido en las Elecciones Perú 2026?",
            "keyword": "votar DNI vencido Perú 2026",
            "categoria": "faq",
            "angulo": "requisitos de votación",
            "tipo": "nuevo",
            "articulo_original_slug": "",
        }
        contexto = {"noticias_hoy": [], "candidatos": []}
        art = await w.write(tema_test, contexto)
        if art:
            print(f"[OK] Artículo generado: {art['titulo']}")
            print(f"  Slug: {art['slug']}")
            print(f"  Palabras: {len(art['contenido'].split())}")
            print(f"  Tiempo lectura: {art['tiempo_lectura']} min")
        else:
            print("[ERR] Error generando artículo")

    asyncio.run(main())
