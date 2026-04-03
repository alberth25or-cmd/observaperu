"""
revision_queue.py — Base de datos SQLite + API REST FastAPI (puerto 8001)

Tablas:
  - articulos        : cola de revisión editorial
  - temas_publicados : índice antiduplicados con embeddings

API endpoints:
  GET  /queue              → artículos pendientes
  POST /queue/{id}/approve → aprobar
  POST /queue/{id}/reject  → rechazar
  GET  /queue/stats        → conteos del día
  GET  /docs               → Swagger UI
"""

import json
from datetime import date, datetime
from pathlib import Path
from typing import Optional

from sqlalchemy import (
    Boolean, Column, DateTime, Integer, LargeBinary,
    String, Text, create_engine, func,
)
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

import config

# ---------------------------------------------------------------------------
# SQLAlchemy ORM
# ---------------------------------------------------------------------------

engine = create_engine(f"sqlite:///{config.DB_PATH}", echo=False)
SessionLocal = sessionmaker(bind=engine)


class Base(DeclarativeBase):
    pass


class Articulo(Base):
    __tablename__ = "articulos"

    id                       = Column(Integer, primary_key=True, index=True)
    titulo                   = Column(String, nullable=False)
    slug                     = Column(String, nullable=False, unique=True)
    contenido                = Column(Text, nullable=False)          # markdown completo
    keyword                  = Column(String, nullable=False)
    categoria                = Column(String, nullable=False)        # perfiles|debates|noticias|analisis|faq
    excerpt                  = Column(String, nullable=True)         # ≤150 chars
    tiempo_lectura           = Column(Integer, nullable=True)        # minutos
    tipo                     = Column(String, default="nuevo")       # nuevo | actualizacion
    articulo_original_slug   = Column(String, nullable=True)
    estado                   = Column(String, default="pending")     # pending|approved|rejected|published
    verificacion_json        = Column(Text, nullable=True)           # JSON serializado
    requiere_revision_extendida = Column(Boolean, default=False)
    creado_en                = Column(DateTime, default=datetime.utcnow)
    aprobado_en              = Column(DateTime, nullable=True)
    publicado_en             = Column(DateTime, nullable=True)


class TemaPublicado(Base):
    __tablename__ = "temas_publicados"

    id              = Column(Integer, primary_key=True, index=True)
    titulo          = Column(String, nullable=False)
    slug            = Column(String, nullable=False)
    keyword         = Column(String, nullable=False)
    categoria       = Column(String, nullable=False)
    embedding       = Column(LargeBinary, nullable=True)             # numpy vector serializado
    publicado_en    = Column(DateTime, default=datetime.utcnow)
    actualizado_en  = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    veces_publicado = Column(Integer, default=1)


def init_db():
    Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------------------------
# FastAPI
# ---------------------------------------------------------------------------

try:
    from fastapi import FastAPI, HTTPException
    from fastapi.responses import JSONResponse, HTMLResponse
    from fastapi.middleware.cors import CORSMiddleware

    app = FastAPI(
        title="Observa Perú — Cola de Revisión",
        description="API de gestión editorial para artículos generados automáticamente.",
        version="1.0.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    def _session() -> Session:
        return SessionLocal()

    @app.get("/", response_class=HTMLResponse, include_in_schema=False)
    def dashboard():
        html_path = Path(__file__).parent / "review_ui.html"
        if html_path.exists():
            return HTMLResponse(html_path.read_text(encoding="utf-8"))
        return HTMLResponse("<h1>review_ui.html no encontrado</h1>")

    @app.get("/queue", summary="Artículos pendientes de revisión")
    def get_queue(estado: str = "pending"):
        db = _session()
        try:
            query = db.query(Articulo)
            if estado != "all":
                query = query.filter(Articulo.estado == estado)
            rows = query.order_by(Articulo.id.desc()).all()
            result = []
            for a in rows:
                verificacion = None
                if a.verificacion_json:
                    try:
                        verificacion = json.loads(a.verificacion_json)
                    except Exception:
                        verificacion = a.verificacion_json
                result.append({
                    "id": a.id,
                    "titulo": a.titulo,
                    "slug": a.slug,
                    "categoria": a.categoria,
                    "keyword": a.keyword,
                    "excerpt": a.excerpt,
                    "tipo": a.tipo,
                    "tiempo_lectura": a.tiempo_lectura,
                    "requiere_revision_extendida": a.requiere_revision_extendida,
                    "verificacion": verificacion,
                    "estado": a.estado,
                    "creado_en": a.creado_en.isoformat() if a.creado_en else None,
                })
            return result
        finally:
            db.close()

    @app.get("/queue/{articulo_id}", summary="Artículo completo con contenido")
    def get_articulo(articulo_id: int):
        db = _session()
        try:
            a = db.query(Articulo).filter(Articulo.id == articulo_id).first()
            if not a:
                raise HTTPException(status_code=404, detail="Artículo no encontrado")
            verificacion = None
            if a.verificacion_json:
                try:
                    verificacion = json.loads(a.verificacion_json)
                except Exception:
                    verificacion = a.verificacion_json
            return {
                "id": a.id,
                "titulo": a.titulo,
                "slug": a.slug,
                "categoria": a.categoria,
                "keyword": a.keyword,
                "excerpt": a.excerpt,
                "contenido": a.contenido,
                "tipo": a.tipo,
                "tiempo_lectura": a.tiempo_lectura,
                "requiere_revision_extendida": a.requiere_revision_extendida,
                "verificacion": verificacion,
                "estado": a.estado,
                "creado_en": a.creado_en.isoformat() if a.creado_en else None,
            }
        finally:
            db.close()

    @app.post("/queue", summary="Crear artículo manualmente")
    def create_articulo(body: dict):
        from slugify import slugify as _slugify
        titulo = (body.get("titulo") or "").strip()
        if not titulo:
            raise HTTPException(status_code=400, detail="El título es obligatorio")
        contenido  = body.get("contenido", "")
        keyword    = body.get("keyword", "")
        categoria  = body.get("categoria", "noticias")
        excerpt    = body.get("excerpt", contenido[:147] + "..." if len(contenido) > 150 else contenido)
        slug_base  = _slugify(titulo, allow_unicode=False, separator="-")[:100]

        palabras   = len(contenido.split())
        tiempo     = max(1, round(palabras / 200))

        db = _session()
        try:
            # Evitar slug duplicado
            slug = slug_base
            sufijo = 1
            while db.query(Articulo).filter(Articulo.slug == slug).first():
                slug = f"{slug_base}-{sufijo}"
                sufijo += 1

            row = Articulo(
                titulo=titulo,
                slug=slug,
                contenido=contenido,
                keyword=keyword,
                categoria=categoria,
                excerpt=excerpt[:150],
                tiempo_lectura=tiempo,
                tipo="nuevo",
                estado="pending",
                verificacion_json=json.dumps({
                    "aprobado": False,
                    "nivel_riesgo": "medio",
                    "observaciones": [{"frase": "", "problema": "Artículo creado manualmente — revisar antes de publicar"}],
                    "requiere_revision_urgente": False,
                    "sugerencias": ["Verificar datos y fuentes antes de aprobar"],
                }, ensure_ascii=False),
                requiere_revision_extendida=False,
            )
            db.add(row)
            db.commit()
            db.refresh(row)
            return {"ok": True, "id": row.id, "slug": slug}
        finally:
            db.close()

    @app.put("/queue/{articulo_id}", summary="Editar artículo")
    def update_articulo(articulo_id: int, body: dict):
        db = _session()
        try:
            a = db.query(Articulo).filter(Articulo.id == articulo_id).first()
            if not a:
                raise HTTPException(status_code=404, detail="Artículo no encontrado")
            if "titulo" in body:
                a.titulo = body["titulo"]
            if "contenido" in body:
                a.contenido = body["contenido"]
            if "excerpt" in body:
                a.excerpt = body["excerpt"][:150]
            db.commit()
            return {"ok": True, "id": articulo_id}
        finally:
            db.close()

    @app.post("/queue/{articulo_id}/approve", summary="Aprobar artículo")
    def approve(articulo_id: int):
        db = _session()
        try:
            a = db.query(Articulo).filter(Articulo.id == articulo_id).first()
            if not a:
                raise HTTPException(status_code=404, detail="Artículo no encontrado")
            a.estado = "approved"
            a.aprobado_en = datetime.utcnow()
            db.commit()
            return {"ok": True, "id": articulo_id, "estado": "approved"}
        finally:
            db.close()

    @app.post("/queue/{articulo_id}/reject", summary="Rechazar artículo")
    def reject(articulo_id: int):
        db = _session()
        try:
            a = db.query(Articulo).filter(Articulo.id == articulo_id).first()
            if not a:
                raise HTTPException(status_code=404, detail="Artículo no encontrado")
            a.estado = "rejected"
            db.commit()
            return {"ok": True, "id": articulo_id, "estado": "rejected"}
        finally:
            db.close()

    @app.get("/queue/stats", summary="Estadísticas del día")
    def stats():
        db = _session()
        try:
            hoy = date.today()
            pending   = db.query(func.count(Articulo.id)).filter(Articulo.estado == "pending").scalar()
            approved  = db.query(func.count(Articulo.id)).filter(Articulo.estado == "approved").scalar()
            rejected  = db.query(func.count(Articulo.id)).filter(Articulo.estado == "rejected").scalar()
            published_hoy = db.query(func.count(Articulo.id)).filter(
                Articulo.estado == "published",
                func.date(Articulo.publicado_en) == hoy,
            ).scalar()
            return {
                "pending": pending,
                "approved": approved,
                "rejected": rejected,
                "published_hoy": published_hoy,
            }
        finally:
            db.close()

except ImportError:
    app = None  # FastAPI no instalado aún


# ---------------------------------------------------------------------------
# CLI: inicializar DB y levantar servidor
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    init_db()
    print(f"[OK] Base de datos inicializada en: {config.DB_PATH}")

    if app is not None:
        import uvicorn
        print("[OK] Levantando API en http://localhost:8001")
        print("  Swagger UI: http://localhost:8001/docs")
        uvicorn.run(app, host="0.0.0.0", port=8001)
    else:
        print("  FastAPI no disponible. Instala dependencias primero.")
