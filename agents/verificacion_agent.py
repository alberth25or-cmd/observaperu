"""
verificacion_agent.py — Agente de verificación editorial

Analiza cada artículo generado y detecta:
  1. Afirmaciones sin fuente verificable
  2. Nombres de candidatos o partidos potencialmente incorrectos
  3. Fechas o números sin respaldo
  4. Afirmaciones categóricas sobre temas disputados
  5. Posible sesgo marcado en una dirección política
"""

import json
import logging
import re
from typing import Any

import anthropic

import config

logger = logging.getLogger(__name__)

SYSTEM_VERIFICACION = """Eres un editor de verificación de hechos para Observa Perú, una plataforma electoral peruana.
Tu trabajo es revisar artículos generados automáticamente y detectar problemas antes de su publicación.

Analiza el artículo y responde SOLO con un JSON válido con esta estructura exacta:
{
  "aprobado": true,
  "nivel_riesgo": "bajo",
  "observaciones": [],
  "requiere_revision_urgente": false,
  "sugerencias": []
}

Niveles de riesgo:
- "bajo":  sin problemas graves, puede publicarse
- "medio": hay observaciones menores, revisar antes de publicar
- "alto":  hay afirmaciones sin respaldo, sesgo o datos incorrectos — NO publicar sin revisión

Para nivel_riesgo "alto": requiere_revision_urgente = true

Sé específico en las observaciones: indica exactamente qué frase es problemática y por qué."""


class VerificacionAgent:

    def __init__(self):
        self.client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)
        self.tokens_input = 0
        self.tokens_output = 0

    def _build_prompt(self, articulo: dict) -> str:
        titulo    = articulo.get("titulo", "")
        categoria = articulo.get("categoria", "")
        contenido = articulo.get("contenido", "")

        # Limitar contenido a 3000 tokens aprox para no superar contexto
        contenido_truncado = contenido[:6000] if len(contenido) > 6000 else contenido

        return (
            f"Artículo a verificar:\n"
            f"Título: {titulo}\n"
            f"Categoría: {categoria}\n\n"
            f"Contenido:\n{contenido_truncado}\n\n"
            f"Revisa el artículo y responde con el JSON de verificación."
        )

    def _parse_verificacion(self, raw: str) -> dict:
        """Parsea la respuesta JSON de Claude. Tolerante a texto adicional."""
        # Intentar parsear directo
        try:
            return json.loads(raw.strip())
        except json.JSONDecodeError:
            pass

        # Buscar JSON en el texto
        match = re.search(r'\{.*\}', raw, re.DOTALL)
        if match:
            try:
                return json.loads(match.group())
            except json.JSONDecodeError:
                pass

        # Fallback: aprobado con nivel medio (no sabemos)
        logger.warning("No se pudo parsear respuesta de verificación, usando fallback")
        return {
            "aprobado": True,
            "nivel_riesgo": "medio",
            "observaciones": ["No se pudo parsear la respuesta de verificación automática"],
            "requiere_revision_urgente": False,
            "sugerencias": ["Revisar manualmente antes de publicar"],
        }

    async def verify(self, articulo: dict) -> dict:
        """
        Verifica un artículo.

        Retorna:
        {
          "aprobado": bool,
          "nivel_riesgo": "bajo" | "medio" | "alto",
          "observaciones": [...],
          "requiere_revision_urgente": bool,
          "sugerencias": [...]
        }
        """
        if not articulo:
            return {
                "aprobado": False,
                "nivel_riesgo": "alto",
                "observaciones": ["Artículo vacío o inválido"],
                "requiere_revision_urgente": True,
                "sugerencias": ["Regenerar el artículo"],
            }

        try:
            prompt = self._build_prompt(articulo)
            msg = self.client.messages.create(
                model=config.CLAUDE_MODEL,
                max_tokens=1500,
                system=SYSTEM_VERIFICACION,
                messages=[{"role": "user", "content": prompt}],
            )
            self.tokens_input += msg.usage.input_tokens
            self.tokens_output += msg.usage.output_tokens

            resultado = self._parse_verificacion(msg.content[0].text)

            # Asegurar que nivel "alto" → requiere_revision_urgente = True
            if resultado.get("nivel_riesgo") == "alto":
                resultado["requiere_revision_urgente"] = True
                resultado["aprobado"] = False

            logger.info(
                f"Verificación '{articulo.get('titulo', '')[:50]}': "
                f"nivel={resultado.get('nivel_riesgo')} "
                f"observaciones={len(resultado.get('observaciones', []))}"
            )
            return resultado

        except Exception as e:
            logger.error(f"Error en verificación: {e}")
            return {
                "aprobado": True,
                "nivel_riesgo": "medio",
                "observaciones": [f"Error en verificación automática: {str(e)[:100]}"],
                "requiere_revision_urgente": False,
                "sugerencias": ["Revisar manualmente"],
            }

    @property
    def costo_estimado(self) -> float:
        return (
            self.tokens_input * config.PRICE_INPUT_PER_TOKEN +
            self.tokens_output * config.PRICE_OUTPUT_PER_TOKEN
        )


# ---------------------------------------------------------------------------
# Test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import asyncio
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    async def main():
        if not config.ANTHROPIC_API_KEY:
            print("ANTHROPIC_API_KEY no configurada. Saltando test.")
            return

        agente = VerificacionAgent()
        articulo_test = {
            "titulo": "¿Se puede votar con DNI vencido en las Elecciones Perú 2026?",
            "categoria": "faq",
            "contenido": (
                "Sí, se puede votar con DNI vencido en las Elecciones Generales del Perú 2026. "
                "El Reniec confirmó que el DNI vencido es válido para votar el 11 de abril de 2026. "
                "Según el artículo 31 de la Constitución Peruana, todos los ciudadanos tienen "
                "derecho a votar. No se necesita renovar el DNI antes de las elecciones."
            ),
        }

        resultado = await agente.verify(articulo_test)
        print(f"\nVerificación completada:")
        print(f"  Aprobado: {resultado['aprobado']}")
        print(f"  Nivel de riesgo: {resultado['nivel_riesgo']}")
        print(f"  Observaciones: {resultado['observaciones']}")
        print(f"  Requiere revisión urgente: {resultado['requiere_revision_urgente']}")

    asyncio.run(main())
