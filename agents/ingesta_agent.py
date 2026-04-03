"""
ingesta_agent.py — Agente de ingesta de noticias y candidatos

Fuentes RSS:
  - RPP, El Comercio, La República, Gestión, Peru21, Andina, Correo

Fuentes por scraping directo:
  - Infobae Perú 2026 (https://www.infobae.com/tag/elecciones-peru-2026/)

Para cada noticia: extrae título + resumen del RSS, luego
intenta leer el contenido completo del artículo original.

NUNCA crashea por fallo de una fuente individual.
"""

import asyncio
import json
import logging
import re
from datetime import datetime
from pathlib import Path
from typing import Any

import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Fuentes RSS
# ---------------------------------------------------------------------------

RSS_SOURCES = [
    {"nombre": "RPP",         "url": "https://rpp.pe/rss"},
    {"nombre": "El Comercio", "url": "https://elcomercio.pe/feed/"},
    {"nombre": "La Republica","url": "https://larepublica.pe/feed/"},
    {"nombre": "Gestion",     "url": "https://gestion.pe/rss/"},
    {"nombre": "Andina",      "url": "https://andina.pe/agencia/rss.aspx"},
    {"nombre": "Correo",      "url": "https://diariocorreo.pe/rss/"},
    {"nombre": "Peru21",      "url": "https://peru21.pe/rss/"},
]

# Fuentes que se scrapean directamente (sin RSS)
SCRAPING_SOURCES = [
    {
        "nombre": "Infobae Peru 2026",
        "url": "https://www.infobae.com/tag/elecciones-peru-2026/",
        "tipo": "infobae_tag",
    },
]

FILTROS_ELECTORALES = [
    "candidato", "elecciones", "jne", "2026", "presidente",
    "congreso", "partido", "voto", "electoral", "campaña",
    "debate", "primera vuelta", "segunda vuelta", "keiko",
    "lopez aliaga", "acuña", "fujimori", "onpe", "ballotage",
    "inscripcion", "plancha", "formula presidencial",
]

STATIC_CANDIDATOS_PATH = Path(__file__).parent / "data" / "candidatos.json"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "es-PE,es;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
}

TIMEOUT = 15.0
MAX_CONTENT_CHARS = 3000  # máximo de caracteres del contenido completo a extraer


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _es_noticia_electoral(titulo: str, resumen: str) -> bool:
    texto = (titulo + " " + resumen).lower()
    return any(kw in texto for kw in FILTROS_ELECTORALES)


def _limpiar_texto(texto: str) -> str:
    """Elimina espacios múltiples, saltos innecesarios y caracteres raros."""
    texto = re.sub(r'\s+', ' ', texto)
    return texto.strip()


def _parse_rss(xml_text: str, fuente: str) -> list[dict]:
    """Parsea XML de RSS y retorna lista de noticias con URL para scraping posterior."""
    soup = BeautifulSoup(xml_text, "lxml-xml")
    items = soup.find_all("item")
    noticias = []
    for item in items[:40]:
        titulo  = item.find("title")
        resumen = item.find("description")
        fecha   = item.find("pubDate")
        url_tag = item.find("link")

        titulo  = _limpiar_texto(titulo.get_text()  if titulo  else "")
        resumen = _limpiar_texto(resumen.get_text() if resumen else "")
        fecha   = fecha.get_text(strip=True)         if fecha   else ""
        url     = url_tag.get_text(strip=True)       if url_tag else ""

        # Algunos RSS ponen la URL en <guid> si <link> está vacío
        if not url:
            guid = item.find("guid")
            if guid:
                url = guid.get_text(strip=True)

        if titulo and _es_noticia_electoral(titulo, resumen):
            noticias.append({
                "titulo":   titulo,
                "resumen":  resumen[:400],
                "contenido_completo": "",   # se llena en fase 2
                "fecha":    fecha,
                "url":      url,
                "fuente":   fuente,
            })
    return noticias


def _extraer_contenido_articulo(html: str) -> str:
    """
    Extrae el texto principal de un artículo HTML.
    Intenta varios selectores comunes de medios peruanos.
    """
    soup = BeautifulSoup(html, "html.parser")

    # Eliminar scripts, estilos, navs, footers, publicidad
    for tag in soup(["script", "style", "nav", "footer", "header",
                     "aside", "figure", "iframe", "form", "button"]):
        tag.decompose()

    # Selectores por orden de prioridad (cubren RPP, El Comercio, Infobae, etc.)
    selectores = [
        "article",
        '[class*="article-body"]',
        '[class*="content-body"]',
        '[class*="story-body"]',
        '[class*="nota-cuerpo"]',
        '[class*="entry-content"]',
        '[class*="article__body"]',
        "main",
    ]

    for sel in selectores:
        bloque = soup.select_one(sel)
        if bloque:
            parrafos = [p.get_text(separator=" ", strip=True)
                        for p in bloque.find_all(["p", "h2", "h3"])
                        if len(p.get_text(strip=True)) > 40]
            if parrafos:
                texto = " ".join(parrafos)
                return _limpiar_texto(texto)[:MAX_CONTENT_CHARS]

    # Fallback: todos los párrafos de la página
    parrafos = [p.get_text(separator=" ", strip=True)
                for p in soup.find_all("p")
                if len(p.get_text(strip=True)) > 50]
    return _limpiar_texto(" ".join(parrafos[:15]))[:MAX_CONTENT_CHARS]


def _scrape_infobae_tag(html: str) -> list[dict]:
    """Extrae artículos de la página de tag de Infobae."""
    soup = BeautifulSoup(html, "html.parser")
    noticias = []

    # Infobae usa tarjetas de artículo con estos selectores
    tarjetas = soup.select("article, [class*='story-card'], [class*='article-card'], [class*='feed-list-card']")

    if not tarjetas:
        # Fallback: buscar todos los <a> con href que contengan /peru/ o /america/
        links = soup.find_all("a", href=re.compile(r'/peru/|/america/peru/'))
        for link in links[:20]:
            titulo = link.get_text(strip=True)
            url = link.get("href", "")
            if len(titulo) > 20 and url:
                if not url.startswith("http"):
                    url = "https://www.infobae.com" + url
                noticias.append({
                    "titulo": titulo,
                    "resumen": "",
                    "contenido_completo": "",
                    "fecha": "",
                    "url": url,
                    "fuente": "Infobae Peru 2026",
                })
        return noticias[:15]

    for tarjeta in tarjetas[:20]:
        titulo_tag = tarjeta.find(["h2", "h3", "h4"])
        link_tag   = tarjeta.find("a", href=True)
        fecha_tag  = tarjeta.find(["time", "[class*='date']"])

        titulo = titulo_tag.get_text(strip=True) if titulo_tag else ""
        url    = link_tag["href"]                if link_tag   else ""
        fecha  = fecha_tag.get_text(strip=True)  if fecha_tag  else ""

        if not url.startswith("http"):
            url = "https://www.infobae.com" + url

        if titulo and len(titulo) > 15:
            noticias.append({
                "titulo": titulo,
                "resumen": "",
                "contenido_completo": "",
                "fecha": fecha,
                "url": url,
                "fuente": "Infobae Peru 2026",
            })

    return noticias


# ---------------------------------------------------------------------------
# Agente principal
# ---------------------------------------------------------------------------

class IngestaAgent:

    async def _fetch_rss(
        self, client: httpx.AsyncClient, source: dict
    ) -> tuple[list, str | None]:
        """Scrapea un feed RSS. Retorna (noticias, error)."""
        try:
            resp = await client.get(
                source["url"], headers=HEADERS, timeout=TIMEOUT, follow_redirects=True
            )
            resp.raise_for_status()
            noticias = _parse_rss(resp.text, source["nombre"])
            logger.info(f"RSS {source['nombre']}: {len(noticias)} noticias electorales")
            return noticias, None
        except Exception as e:
            msg = f"RSS {source['nombre']} fallo: {e}"
            logger.warning(msg)
            return [], msg

    async def _fetch_scraping(
        self, client: httpx.AsyncClient, source: dict
    ) -> tuple[list, str | None]:
        """Scrapea una página de tag/sección directamente."""
        try:
            resp = await client.get(
                source["url"], headers=HEADERS, timeout=TIMEOUT, follow_redirects=True
            )
            resp.raise_for_status()

            if source["tipo"] == "infobae_tag":
                noticias = _scrape_infobae_tag(resp.text)
            else:
                noticias = []

            logger.info(f"Scraping {source['nombre']}: {len(noticias)} articulos")
            return noticias, None
        except Exception as e:
            msg = f"Scraping {source['nombre']} fallo: {e}"
            logger.warning(msg)
            return [], msg

    async def _enriquecer_contenido(
        self, client: httpx.AsyncClient, noticia: dict
    ) -> dict:
        """
        Descarga el artículo completo y extrae el texto principal.
        Si falla, deja contenido_completo vacío — no es crítico.
        """
        url = noticia.get("url", "")
        if not url or not url.startswith("http"):
            return noticia
        try:
            resp = await client.get(
                url, headers=HEADERS, timeout=12.0, follow_redirects=True
            )
            if resp.status_code == 200:
                contenido = _extraer_contenido_articulo(resp.text)
                noticia["contenido_completo"] = contenido
        except Exception:
            pass  # silencioso — el contenido completo es opcional
        return noticia

    async def _fetch_jne(self, client: httpx.AsyncClient) -> tuple[list, str | None]:
        """Intenta scrapear JNE. No crítico."""
        try:
            url = "https://declara.jne.gob.pe/ASJNE/candidato.aspx"
            resp = await client.get(url, headers=HEADERS, timeout=TIMEOUT, follow_redirects=True)
            soup = BeautifulSoup(resp.text, "html.parser")
            nombres = [
                el.get_text(strip=True) for el in soup.select("td")
                if el.get_text(strip=True)
            ][:20]
            logger.info(f"JNE scraping: {len(nombres)} elementos")
            return nombres, None
        except Exception as e:
            logger.info(f"JNE scraping fallo (esperado): {e}")
            return [], str(e)

    def _load_static_candidatos(self) -> list[dict]:
        try:
            with open(STATIC_CANDIDATOS_PATH, encoding="utf-8") as f:
                data = json.load(f)
            candidatos = data.get("candidatos", [])
            logger.info(f"Candidatos estaticos cargados: {len(candidatos)}")
            return candidatos
        except Exception as e:
            logger.error(f"Error cargando candidatos estaticos: {e}")
            return []

    async def run(self) -> dict[str, Any]:
        """
        Ejecuta la ingesta completa en 3 fases:
          1. RSS + scraping de páginas de tag (en paralelo)
          2. Enriquecimiento: descarga contenido completo de cada artículo
          3. Candidatos estáticos

        Retorna:
          {
            "noticias_hoy": [...],   # con contenido_completo incluido
            "candidatos":  [...],
            "fecha_ingesta": str,
            "fuentes_exitosas": [...],
            "fuentes_fallidas": [...]
          }
        """
        noticias_hoy: list[dict] = []
        fuentes_exitosas: list[str] = []
        fuentes_fallidas: list[str] = []

        async with httpx.AsyncClient() as client:

            # ---- FASE 1: RSS + scraping en paralelo ----------------------
            rss_tasks      = [self._fetch_rss(client, src)      for src in RSS_SOURCES]
            scraping_tasks = [self._fetch_scraping(client, src) for src in SCRAPING_SOURCES]
            jne_task       = self._fetch_jne(client)

            todos = await asyncio.gather(
                *rss_tasks, *scraping_tasks, jne_task,
                return_exceptions=False,
            )

            # Procesar RSS
            for i, src in enumerate(RSS_SOURCES):
                noticias, error = todos[i]
                if error:
                    fuentes_fallidas.append(f"{src['nombre']}: {error}")
                else:
                    noticias_hoy.extend(noticias)
                    if noticias:
                        fuentes_exitosas.append(src["nombre"])

            # Procesar scraping directo
            offset = len(RSS_SOURCES)
            for i, src in enumerate(SCRAPING_SOURCES):
                noticias, error = todos[offset + i]
                if error:
                    fuentes_fallidas.append(f"{src['nombre']}: {error}")
                else:
                    noticias_hoy.extend(noticias)
                    if noticias:
                        fuentes_exitosas.append(src["nombre"])

            # JNE (último elemento)
            _, jne_error = todos[-1]
            if jne_error:
                fuentes_fallidas.append(f"JNE: {jne_error}")

            # ---- FASE 2: Enriquecimiento de contenido completo -----------
            # Limitar a 20 artículos para no sobrecargar ni gastar demasiado tiempo
            a_enriquecer = noticias_hoy[:20]
            resto        = noticias_hoy[20:]

            logger.info(f"Descargando contenido completo de {len(a_enriquecer)} articulos...")
            enriquecidos = await asyncio.gather(
                *[self._enriquecer_contenido(client, n) for n in a_enriquecer],
                return_exceptions=False,
            )
            noticias_hoy = list(enriquecidos) + resto

        con_contenido = sum(1 for n in noticias_hoy if n.get("contenido_completo"))
        logger.info(f"Contenido completo extraido: {con_contenido}/{len(noticias_hoy)} articulos")

        # ---- FASE 3: Candidatos ------------------------------------------
        candidatos = self._load_static_candidatos()
        fuentes_exitosas.append("candidatos_estaticos")

        logger.info(
            f"Ingesta completada: {len(noticias_hoy)} noticias, "
            f"{len(candidatos)} candidatos, "
            f"{len(fuentes_exitosas)} fuentes OK, "
            f"{len(fuentes_fallidas)} fallidas"
        )

        return {
            "noticias_hoy":    noticias_hoy,
            "candidatos":      candidatos,
            "fecha_ingesta":   datetime.utcnow().isoformat(),
            "fuentes_exitosas": fuentes_exitosas,
            "fuentes_fallidas": fuentes_fallidas,
        }


# ---------------------------------------------------------------------------
# Test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    async def main():
        agente = IngestaAgent()
        resultado = await agente.run()
        print(f"\n{'='*55}")
        print(f"Noticias electorales encontradas : {len(resultado['noticias_hoy'])}")
        print(f"Candidatos cargados              : {len(resultado['candidatos'])}")
        print(f"Fuentes exitosas                 : {resultado['fuentes_exitosas']}")
        print(f"Fuentes fallidas                 : {len(resultado['fuentes_fallidas'])}")

        con_contenido = sum(1 for n in resultado["noticias_hoy"] if n.get("contenido_completo"))
        print(f"Con contenido completo           : {con_contenido}")

        print(f"\nPrimeras 5 noticias:")
        for n in resultado["noticias_hoy"][:5]:
            palabras = len(n.get("contenido_completo", "").split())
            print(f"  [{n['fuente']}] {n['titulo'][:70]} ({palabras} palabras)")

    asyncio.run(main())
