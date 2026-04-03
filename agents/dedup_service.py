"""
dedup_service.py — Servicio antiduplicados con sentence-transformers

Modelo: paraphrase-multilingual-MiniLM-L12-v2
  - Multilingüe, funciona bien con español peruano
  - Vectores de 384 dimensiones
  - Ligero (~120 MB), rápido en CPU
"""

import io
import logging
from datetime import datetime, timedelta
from typing import Optional

import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy.orm import Session

import config
from revision_queue import SessionLocal, TemaPublicado, init_db

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Umbrales por categoría
# ---------------------------------------------------------------------------

UMBRALES = {
    "perfiles":  {"duplicado": 0.92, "actualizable": 0.70},
    "noticias":  {"duplicado": 0.75, "actualizable": 0.55},
    "faq":       {"duplicado": 0.95, "actualizable": 0.80},
    "debates":   {"duplicado": 0.85, "actualizable": 0.65},
    "analisis":  {"duplicado": 0.85, "actualizable": 0.65},
}

VENTANA_DIAS = 60          # días atrás para buscar duplicados
VENTANA_REFRESCO_DIAS = 14  # si fue publicado hace +14 días, bajamos umbral


class DeduplicationService:

    def __init__(self, db_path: str = config.DB_PATH):
        from sentence_transformers import SentenceTransformer
        self.model = SentenceTransformer("paraphrase-multilingual-MiniLM-L12-v2")
        self.db_path = db_path
        init_db()
        logger.info("Modelo cargado correctamente")

    # ------------------------------------------------------------------
    # Vectorización
    # ------------------------------------------------------------------

    def get_embedding(self, texto: str) -> np.ndarray:
        """Retorna vector de 384 dimensiones para el texto dado."""
        return self.model.encode(texto, convert_to_numpy=True)

    def _serialize(self, vec: np.ndarray) -> bytes:
        buf = io.BytesIO()
        np.save(buf, vec)
        return buf.getvalue()

    def _deserialize(self, blob: bytes) -> np.ndarray:
        buf = io.BytesIO(blob)
        return np.load(buf)

    # ------------------------------------------------------------------
    # Chequeo de duplicados
    # ------------------------------------------------------------------

    def check_duplicate(self, titulo: str, categoria: str) -> dict:
        """
        Compara el título contra temas publicados en los últimos 60 días.

        Retorna:
          {
            "status": "nuevo" | "duplicado" | "actualizable",
            "similitud": float,
            "articulo_similar": {titulo, slug, publicado_en} | None,
            "dias_desde_publicacion": int | None
          }
        """
        umbrales = UMBRALES.get(categoria, UMBRALES["noticias"])
        umbral_dup = umbrales["duplicado"]
        umbral_act = umbrales["actualizable"]

        vec_nuevo = self.get_embedding(titulo)
        ventana = datetime.utcnow() - timedelta(days=VENTANA_DIAS)

        db: Session = SessionLocal()
        try:
            temas = (
                db.query(TemaPublicado)
                .filter(TemaPublicado.publicado_en >= ventana)
                .all()
            )
        finally:
            db.close()

        if not temas:
            return {"status": "nuevo", "similitud": 0.0, "articulo_similar": None, "dias_desde_publicacion": None}

        max_sim = 0.0
        mejor_tema = None

        for tema in temas:
            if not tema.embedding:
                continue
            vec_existente = self._deserialize(tema.embedding)
            sim = float(cosine_similarity([vec_nuevo], [vec_existente])[0][0])
            if sim > max_sim:
                max_sim = sim
                mejor_tema = tema

        if mejor_tema is None:
            return {"status": "nuevo", "similitud": 0.0, "articulo_similar": None, "dias_desde_publicacion": None}

        dias = (datetime.utcnow() - mejor_tema.publicado_en).days if mejor_tema.publicado_en else 0

        articulo_similar = {
            "titulo": mejor_tema.titulo,
            "slug": mejor_tema.slug,
            "publicado_en": mejor_tema.publicado_en.isoformat() if mejor_tema.publicado_en else None,
        }

        # Regla temporal: si fue publicado hace +14 días, bajamos "duplicado" a "actualizable"
        if max_sim >= umbral_dup:
            if dias > VENTANA_REFRESCO_DIAS:
                status = "actualizable"
            else:
                status = "duplicado"
        elif max_sim >= umbral_act:
            status = "actualizable"
        else:
            status = "nuevo"

        return {
            "status": status,
            "similitud": round(max_sim, 4),
            "articulo_similar": articulo_similar,
            "dias_desde_publicacion": dias,
        }

    # ------------------------------------------------------------------
    # Sugerencia de ángulo nuevo
    # ------------------------------------------------------------------

    def sugerir_angulo_nuevo(self, titulo: str, articulo_existente: dict) -> str:
        """
        Llama a Claude para reformular el tema con un ángulo diferente.
        Retorna el título reformulado.
        """
        import anthropic

        client = anthropic.Anthropic(api_key=config.ANTHROPIC_API_KEY)
        prompt = (
            f"Tengo este artículo ya publicado: \"{articulo_existente.get('titulo', '')}\" "
            f"(publicado hace {articulo_existente.get('dias', 'varios')} días).\n\n"
            f"Quiero publicar un nuevo artículo sobre: \"{titulo}\"\n\n"
            f"Dame UN título alternativo que cubra el mismo tema pero con un ángulo diferente, "
            f"actualización o enfoque noticioso distinto. Responde solo con el título, sin comillas ni explicaciones."
        )

        msg = client.messages.create(
            model=config.CLAUDE_MODEL,
            max_tokens=150,
            messages=[{"role": "user", "content": prompt}],
        )
        return msg.content[0].text.strip()

    # ------------------------------------------------------------------
    # Registro de nuevo tema publicado
    # ------------------------------------------------------------------

    def registrar_tema(self, titulo: str, slug: str, keyword: str, categoria: str):
        """Guarda o actualiza el tema en temas_publicados con su embedding."""
        embedding_blob = self._serialize(self.get_embedding(titulo))
        db: Session = SessionLocal()
        try:
            existente = db.query(TemaPublicado).filter(TemaPublicado.slug == slug).first()
            if existente:
                existente.titulo = titulo
                existente.keyword = keyword
                existente.categoria = categoria
                existente.embedding = embedding_blob
                existente.actualizado_en = datetime.utcnow()
                existente.veces_publicado += 1
            else:
                nuevo = TemaPublicado(
                    titulo=titulo,
                    slug=slug,
                    keyword=keyword,
                    categoria=categoria,
                    embedding=embedding_blob,
                )
                db.add(nuevo)
            db.commit()
            logger.info(f"Tema registrado: {slug}")
        finally:
            db.close()


# ---------------------------------------------------------------------------
# Test básico
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO, format="%(levelname)s: %(message)s")
    svc = DeduplicationService()
    print("Modelo cargado correctamente")

    # Test de vectorización
    vec = svc.get_embedding("Keiko Fujimori propuestas económicas 2026")
    print(f"Embedding shape: {vec.shape}  (esperado: (384,))")

    # Test de check_duplicate (DB vacía → siempre "nuevo")
    resultado = svc.check_duplicate("Keiko Fujimori perfil presidencial 2026", "perfiles")
    print(f"check_duplicate (vacío): {resultado}")

    # Registrar y volver a chequear
    svc.registrar_tema(
        "Keiko Fujimori perfil presidencial 2026",
        "keiko-fujimori-perfil-presidencial-2026",
        "Keiko Fujimori candidata 2026",
        "perfiles",
    )
    resultado2 = svc.check_duplicate("Keiko Fujimori candidata presidencial Perú 2026", "perfiles")
    print(f"check_duplicate (tras registro): {resultado2}")
    print("[OK] DeduplicationService funcionando correctamente")
