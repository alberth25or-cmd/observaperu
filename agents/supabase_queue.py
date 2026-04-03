"""
supabase_queue.py — Cliente Supabase para la cola de revisión editorial.

Reemplaza las operaciones SQLAlchemy/SQLite de revision_queue.py
para la tabla 'articulos'. La tabla 'temas_publicados' sigue en SQLite
(revision_queue.py) por los embeddings numpy.
"""

import json
import logging
import os
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

logger = logging.getLogger(__name__)

_client: Optional[Client] = None


def get_client() -> Client:
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY")
        if not url or not key:
            raise RuntimeError("SUPABASE_URL y SUPABASE_SERVICE_KEY son requeridos en .env")
        _client = create_client(url, key)
    return _client


def existe_por_slug(slug: str) -> Optional[int]:
    """Retorna el id del artículo si ya existe, None si no."""
    try:
        res = get_client().table("articulos").select("id").eq("slug", slug).maybe_single().execute()
        return res.data["id"] if res.data else None
    except Exception as e:
        logger.error(f"Error consultando slug '{slug}': {e}")
        return None


def guardar_articulo(
    titulo: str,
    slug: str,
    contenido: str,
    keyword: str,
    categoria: str,
    excerpt: Optional[str],
    tiempo_lectura: Optional[int],
    tipo: str,
    articulo_original_slug: Optional[str],
    verificacion_json: str,
    requiere_revision_extendida: bool,
) -> Optional[int]:
    """Inserta artículo en Supabase. Retorna el id o None si falla."""
    try:
        res = get_client().table("articulos").insert({
            "titulo": titulo,
            "slug": slug,
            "contenido": contenido,
            "keyword": keyword,
            "categoria": categoria,
            "excerpt": excerpt[:150] if excerpt else None,
            "tiempo_lectura": tiempo_lectura,
            "tipo": tipo,
            "articulo_original_slug": articulo_original_slug,
            "estado": "pending",
            "verificacion_json": verificacion_json,
            "requiere_revision_extendida": requiere_revision_extendida,
        }).execute()
        return res.data[0]["id"] if res.data else None
    except Exception as e:
        logger.error(f"Error guardando artículo '{slug}': {e}")
        return None


def get_approved_articles() -> list[dict]:
    """Retorna todos los artículos en estado 'approved'."""
    try:
        res = get_client().table("articulos").select("*").eq("estado", "approved").execute()
        return res.data or []
    except Exception as e:
        logger.error(f"Error obteniendo artículos aprobados: {e}")
        return []


def marcar_publicado(slug: str):
    """Marca el artículo como publicado."""
    try:
        get_client().table("articulos").update({
            "estado": "published",
            "publicado_en": datetime.utcnow().isoformat(),
        }).eq("slug", slug).execute()
    except Exception as e:
        logger.error(f"Error marcando como publicado '{slug}': {e}")
