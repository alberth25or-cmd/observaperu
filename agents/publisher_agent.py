"""
publisher_agent.py — Agente publicador

Modos:
  nextjs_api  → escribe archivos .mdx en content/noticias/ o content/analisis/
  wordpress   → usa WordPress REST API

Programación escalonada:
  - noticias/perfiles/faq/debates : 8am-6pm, 4-6 artículos/hora
  - analisis                      : 7pm-9pm

Después de publicar: llama a dedup_service.registrar_tema() + actualiza DB.
"""

import asyncio
import json
import logging
import re
from datetime import datetime, date
from pathlib import Path
from typing import Any

import httpx

import config
import supabase_queue

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Helpers de frontmatter MDX
# ---------------------------------------------------------------------------

def _build_mdx(articulo: dict) -> str:
    """Construye el contenido completo del archivo .mdx con frontmatter YAML."""
    hoy = date.today().isoformat()

    def _esc(v: str) -> str:
        """Escapa comillas dobles para YAML."""
        return str(v).replace('"', '\\"')

    keywords = articulo.get("keywords", [articulo.get("keyword", "")])
    if isinstance(keywords, str):
        keywords = [k.strip() for k in keywords.split(",")]
    keywords_yaml = json.dumps(keywords, ensure_ascii=False)

    tags = articulo.get("tags", [articulo.get("categoria", ""), "elecciones 2026"])
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",")]
    tags_yaml = json.dumps(tags, ensure_ascii=False)

    refs = articulo.get("references", [])
    if isinstance(refs, str):
        refs = [r.strip() for r in refs.split(",")]
    refs_yaml = json.dumps(refs, ensure_ascii=False)

    frontmatter = f"""---
title: "{_esc(articulo.get('titulo', ''))}"
date: "{articulo.get('date', hoy)}"
metaDescription: "{_esc(articulo.get('metaDescription', articulo.get('excerpt', '')))}"
keywords: {keywords_yaml}
author: "{articulo.get('author', 'Observa Perú')}"
tags: {tags_yaml}
bajada: "{_esc(articulo.get('excerpt', ''))}"
references: {refs_yaml}
---
"""

    # Limpiar el contenido de bloques de comments HTML innecesarios para MDX
    contenido = articulo.get("contenido", "")
    contenido = re.sub(r'<!--.*?-->', '', contenido, flags=re.DOTALL).strip()

    return frontmatter + "\n" + contenido


def _content_subdir(categoria: str) -> str:
    """Mapea categoría del agente a subdirectorio de content/."""
    if categoria == "analisis":
        return "analisis"
    return "noticias"  # perfiles, debates, faq, noticias → noticias/


# ---------------------------------------------------------------------------
# Publisher principal
# ---------------------------------------------------------------------------

class PublisherAgent:

    def __init__(self):
        self._dedup = None  # lazy load para no bloquear si no hay modelo

    @property
    def dedup(self):
        if self._dedup is None:
            from dedup_service import DeduplicationService
            self._dedup = DeduplicationService()
        return self._dedup

    # ------------------------------------------------------------------
    # nextjs_api: escribir .mdx
    # ------------------------------------------------------------------

    async def _publish_nextjs(self, articulo: dict) -> bool:
        subdir = _content_subdir(articulo.get("categoria", "noticias"))
        dest_dir = config.CONTENT_DIR / subdir
        dest_dir.mkdir(parents=True, exist_ok=True)

        slug = articulo.get("slug", "sin-slug")
        filepath = dest_dir / f"{slug}.mdx"

        # No sobreescribir si ya existe (podría ser una publicación manual)
        if filepath.exists():
            logger.warning(f"Ya existe {filepath}, omitiendo")
            return False

        mdx_content = _build_mdx(articulo)
        filepath.write_text(mdx_content, encoding="utf-8")
        logger.info(f"Publicado: {filepath}")
        return True

    # ------------------------------------------------------------------
    # WordPress
    # ------------------------------------------------------------------

    async def _publish_wordpress(self, articulo: dict) -> bool:
        if not config.CMS_URL or not config.CMS_TOKEN:
            logger.error("CMS_URL y CMS_TOKEN requeridos para WordPress")
            return False

        headers = {
            "Authorization": f"Bearer {config.CMS_TOKEN}",
            "Content-Type": "application/json",
        }

        subdir = _content_subdir(articulo.get("categoria", "noticias"))
        categoria_wp = "analisis" if subdir == "analisis" else "noticias"

        payload = {
            "title":   articulo.get("titulo", ""),
            "content": articulo.get("contenido", ""),
            "status":  "publish",
            "slug":    articulo.get("slug", ""),
            "excerpt": articulo.get("excerpt", ""),
        }

        api_url = f"{config.CMS_URL}/wp-json/wp/v2/posts"
        try:
            async with httpx.AsyncClient(timeout=30) as client:
                resp = await client.post(api_url, json=payload, headers=headers)
                resp.raise_for_status()
                logger.info(f"WordPress publicado: {articulo.get('slug')}")
                return True
        except Exception as e:
            logger.error(f"Error publicando en WordPress: {e}")
            return False

    # ------------------------------------------------------------------
    # publish()
    # ------------------------------------------------------------------

    async def publish(self, articulo: dict, dry_run: bool = False) -> bool:
        """
        Publica un artículo aprobado.

        Si dry_run=True: simula sin escribir archivos ni actualizar DB.
        """
        if not articulo:
            return False

        if dry_run:
            logger.info(f"[DRY RUN] Publicaría: {articulo.get('slug')} → {_content_subdir(articulo.get('categoria','noticias'))}/")
            return True

        # Publicar según CMS_TYPE
        if config.CMS_TYPE == "nextjs_api":
            ok = await self._publish_nextjs(articulo)
        elif config.CMS_TYPE == "wordpress":
            ok = await self._publish_wordpress(articulo)
        else:
            logger.error(f"CMS_TYPE desconocido: {config.CMS_TYPE}")
            return False

        if ok:
            # Registrar en antiduplicados
            try:
                self.dedup.registrar_tema(
                    titulo=articulo.get("titulo", ""),
                    slug=articulo.get("slug", ""),
                    keyword=articulo.get("keyword", ""),
                    categoria=articulo.get("categoria", "noticias"),
                )
            except Exception as e:
                logger.warning(f"No se pudo registrar en dedup: {e}")

            # Actualizar estado en DB
            self._marcar_publicado(articulo.get("slug", ""))

        return ok

    async def publish_approved(self, dry_run: bool = False) -> int:
        """
        Publica todos los artículos en estado 'approved' de Supabase.
        Retorna número de artículos publicados.
        """
        aprobados = supabase_queue.get_approved_articles()

        count = 0
        for row in aprobados:
            articulo = {
                "titulo":    row["titulo"],
                "slug":      row["slug"],
                "contenido": row["contenido"],
                "keyword":   row["keyword"],
                "categoria": row["categoria"],
                "excerpt":   row["excerpt"],
                "tipo":      row["tipo"],
                "date":      date.today().isoformat(),
                "author":    "Observa Perú",
            }
            ok = await self.publish(articulo, dry_run=dry_run)
            if ok:
                count += 1
        return count

    def _marcar_publicado(self, slug: str):
        supabase_queue.marcar_publicado(slug)


# ---------------------------------------------------------------------------
# Test
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    import asyncio
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")

    async def main():
        pub = PublisherAgent()
        articulo_test = {
            "titulo":    "Test de publicación automática Observa Perú",
            "slug":      "test-publicacion-automatica-observa-peru",
            "contenido": "Este es un artículo de prueba generado automáticamente.\n\n## Sección de prueba\n\nContenido de ejemplo.",
            "keyword":   "test observa perú",
            "categoria": "noticias",
            "excerpt":   "Artículo de prueba del sistema de publicación automática.",
            "tipo":      "nuevo",
            "date":      date.today().isoformat(),
            "author":    "Observa Perú",
            "metaDescription": "Test del sistema de publicación automática de Observa Perú.",
        }

        ok = await pub.publish(articulo_test, dry_run=True)
        print(f"[OK] PublisherAgent test (dry_run): {'OK' if ok else 'FALLÓ'}")
        print(f"  CMS_TYPE: {config.CMS_TYPE}")
        print(f"  CONTENT_DIR: {config.CONTENT_DIR}")

    asyncio.run(main())
