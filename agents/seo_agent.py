"""
seo_agent.py — Agente SEO: genera 40 temas únicos por día usando Claude

Proceso:
  1. Llama a Claude con contexto de ingesta → 70 títulos candidatos en JSON
  2. Chequea duplicados con DeduplicationService
  3. Reformula los "actualizables" con sugerir_angulo_nuevo()
  4. Si aprobados < 40, pide 30 temas adicionales y repite
  5. Retorna lista de exactamente MAX_ARTICULOS_DIA temas
"""

import asyncio
import json
import logging
import re
from pathlib import Path
from typing import Any

import anthropic

import config
from dedup_service import DeduplicationService

logger = logging.getLogger(__name__)

SYSTEM_PROMPT_PATH = Path(__file__).parent / "prompts" / "system_seo.md"

# Distribución diaria por categoría
DISTRIBUCION: dict[str, int] = {
    "perfiles":  12,
    "debates":   10,
    "noticias":  10,
    "analisis":  8,
    "faq":       0,   # el resto hasta MAX_ARTICULOS_DIA
}


def _load_system_prompt() -> str:
    try:
        return SYSTEM_PROMPT_PATH.read_text(encoding="utf-8")
    except FileNotFoundError:
        return (
            "Eres un experto en SEO para medios digitales peruanos. "
            "Generas títulos optimizados para búsquedas electorales peruanas 2026. "
            "Siempre respondes en JSON válido."
        )


def _build_user_prompt(datos_ingesta: dict, n_titulos: int = 70) -> str:
    noticias = datos_ingesta.get("noticias_hoy", [])[:15]
    candidatos = datos_ingesta.get("candidatos", [])[:10]

    noticias_str = "\n".join(
        f"- {n['titulo']} ({n['fuente']})" for n in noticias
    ) or "- Sin noticias recientes disponibles"

    candidatos_str = "\n".join(
        f"- {c['nombre']} ({c['partido']})" for c in candidatos
    ) or "- Keiko Fujimori, Rafael López Aliaga, César Acuña"

    return f"""Noticias electorales recientes:
{noticias_str}

Candidatos principales:
{candidatos_str}

Genera exactamente {n_titulos} títulos de artículos en JSON con este formato exacto:
[
  {{
    "titulo": "título del artículo",
    "keyword": "keyword principal de búsqueda",
    "categoria": "perfiles|debates|noticias|analisis|faq",
    "angulo": "descripción breve del enfoque",
    "prioridad_seo": 8
  }},
  ...
]

Distribución aproximada:
- perfiles: ~17 artículos
- debates: ~14 artículos
- noticias: ~14 artículos
- analisis: ~12 artículos
- faq: ~13 artículos

Responde SOLO con el JSON, sin texto adicional."""


def _parse_json_response(text: str) -> list[dict]:
    """Extrae JSON de la respuesta de Claude, tolerando texto adicional."""
    # Intentar parsear directo
    try:
        return json.loads(text.strip())
    except json.JSONDecodeError:
        pass
    # Buscar array JSON en el texto
    match = re.search(r'\[.*\]', text, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass
    logger.error("No se pudo parsear JSON de la respuesta SEO")
    return []


class SEOAgent:

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)
        self.dedup = DeduplicationService()
        self.system_prompt = _load_system_prompt()
        self.tokens_input = 0
        self.tokens_output = 0

    def _call_claude(self, user_prompt: str) -> list[dict]:
        """Llama a Claude y retorna lista de temas parseados."""
        msg = self.client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=8000,
            system=self.system_prompt,
            messages=[{"role": "user", "content": user_prompt}],
        )
        self.tokens_input += msg.usage.input_tokens
        self.tokens_output += msg.usage.output_tokens
        return _parse_json_response(msg.content[0].text)

    async def run(self, datos_ingesta: dict) -> list[dict]:
        """
        Genera lista final de MAX_ARTICULOS_DIA temas únicos.
        """
        aprobados: list[dict] = []
        descartados = 0
        reformulados = 0

        async def _procesar_tema(tema: dict) -> dict | None:
            nonlocal descartados, reformulados
            titulo    = tema.get("titulo", "")
            categoria = tema.get("categoria", "noticias")

            resultado = self.dedup.check_duplicate(titulo, categoria)

            if resultado["status"] == "duplicado":
                descartados += 1
                logger.debug(f"Descartado (dup): {titulo}")
                return None

            if resultado["status"] == "actualizable":
                articulo_similar = resultado.get("articulo_similar") or {}
                articulo_similar["dias"] = resultado.get("dias_desde_publicacion", 0)
                nuevo_titulo = self.dedup.sugerir_angulo_nuevo(titulo, articulo_similar)
                tema = {**tema, "titulo": nuevo_titulo, "tipo": "actualizacion",
                        "articulo_original_slug": articulo_similar.get("slug", "")}
                reformulados += 1
                logger.debug(f"Reformulado: {titulo} → {nuevo_titulo}")
            else:
                tema = {**tema, "tipo": "nuevo", "articulo_original_slug": ""}

            return tema

        # Primera ronda: 70 temas
        logger.info("Generando primera tanda de temas (70)...")
        prompt1 = _build_user_prompt(datos_ingesta, 70)
        temas_raw = self._call_claude(prompt1)
        logger.info(f"Claude generó {len(temas_raw)} temas en primera ronda")

        for tema in temas_raw:
            if len(aprobados) >= config.MAX_ARTICULOS_DIA:
                break
            resultado = await _procesar_tema(tema)
            if resultado:
                aprobados.append(resultado)

        # Segunda ronda si hacen falta
        if len(aprobados) < config.MAX_ARTICULOS_DIA:
            faltan = config.MAX_ARTICULOS_DIA - len(aprobados)
            logger.info(f"Faltan {faltan} temas. Generando segunda tanda (30)...")
            prompt2 = _build_user_prompt(datos_ingesta, 30)
            temas_raw2 = self._call_claude(prompt2)
            for tema in temas_raw2:
                if len(aprobados) >= config.MAX_ARTICULOS_DIA:
                    break
                resultado = await _procesar_tema(tema)
                if resultado:
                    aprobados.append(resultado)

        # Rellenar con FAQs genéricos si aún faltan
        if len(aprobados) < config.MAX_ARTICULOS_DIA:
            faq_fallback = [
                {"titulo": "¿Cómo consultar dónde me toca votar en 2026?", "keyword": "consultar mesa de votación Perú 2026", "categoria": "faq", "angulo": "proceso práctico", "tipo": "nuevo", "articulo_original_slug": "", "prioridad_seo": 9},
                {"titulo": "¿Qué pasa si no voto en las elecciones 2026?", "keyword": "multa por no votar Perú 2026", "categoria": "faq", "angulo": "consecuencias del ausentismo", "tipo": "nuevo", "articulo_original_slug": "", "prioridad_seo": 9},
                {"titulo": "¿Cuándo es la segunda vuelta en Perú 2026?", "keyword": "segunda vuelta Perú 2026 fecha", "categoria": "faq", "angulo": "calendario electoral", "tipo": "nuevo", "articulo_original_slug": "", "prioridad_seo": 8},
            ]
            for faq in faq_fallback:
                if len(aprobados) >= config.MAX_ARTICULOS_DIA:
                    break
                aprobados.append(faq)

        aprobados = aprobados[:config.MAX_ARTICULOS_DIA]

        logger.info(
            f"SEO Agent completado: {len(aprobados)} aprobados, "
            f"{descartados} descartados, {reformulados} reformulados"
        )

        return aprobados

    @property
    def costo_estimado(self) -> float:
        return (
            self.tokens_input * config.PRICE_INPUT_PER_TOKEN +
            self.tokens_output * config.PRICE_OUTPUT_PER_TOKEN
        )


# ---------------------------------------------------------------------------
# Test con mock de ingesta
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import asyncio
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    # Mock de ingesta
    mock_ingesta = {
        "noticias_hoy": [
            {"titulo": "Keiko Fujimori presenta plan económico en debate JNE", "fuente": "RPP", "resumen": ""},
            {"titulo": "JNE confirma fechas de segunda vuelta 2026", "fuente": "El Comercio", "resumen": ""},
        ],
        "candidatos": [
            {"nombre": "Keiko Fujimori", "partido": "Fuerza Popular"},
            {"nombre": "Rafael López Aliaga", "partido": "Renovación Popular"},
            {"nombre": "César Acuña", "partido": "Alianza para el Progreso"},
        ],
    }

    async def main():
        if not config.ANTHROPIC_API_KEY:
            print("ANTHROPIC_API_KEY no configurada. Test con mock.")
            print("Temas de ejemplo generados: 3 (mock)")
            return

        agente = SEOAgent()
        temas = await agente.run(mock_ingesta)
        print(f"\n{'='*50}")
        print(f"Temas generados: {len(temas)}")
        for t in temas[:5]:
            print(f"  [{t['categoria']}] {t['titulo']}")
        print(f"Costo estimado: ${agente.costo_estimado:.4f} USD")

    asyncio.run(main())
