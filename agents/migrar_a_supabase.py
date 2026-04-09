"""
migrar_a_supabase.py — Migra artículos de SQLite local a Supabase.

Uso:
  python migrar_a_supabase.py

Requiere que .env tenga SUPABASE_URL y SUPABASE_SERVICE_KEY.
"""

import json
import sqlite3
from pathlib import Path

from dotenv import load_dotenv
import supabase_queue

load_dotenv()

DB_PATH = Path(__file__).parent / "articulos.db"

def migrar():
    if not DB_PATH.exists():
        print(f"[ERROR] No se encontró {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM articulos ORDER BY id ASC")
    rows = cursor.fetchall()
    conn.close()

    print(f"[INFO] {len(rows)} artículos encontrados en SQLite")

    ok = 0
    skip = 0
    error = 0

    for row in rows:
        slug = row["slug"]

        # Verificar si ya existe en Supabase
        existente = supabase_queue.existe_por_slug(slug)
        if existente:
            print(f"  [SKIP] ya existe: {slug}")
            skip += 1
            continue

        art_id = supabase_queue.guardar_articulo(
            titulo=row["titulo"],
            slug=slug,
            contenido=row["contenido"] or "",
            keyword=row["keyword"] or "",
            categoria=row["categoria"] or "noticias",
            excerpt=row["excerpt"],
            tiempo_lectura=row["tiempo_lectura"],
            tipo=row["tipo"] or "nuevo",
            articulo_original_slug=row["articulo_original_slug"],
            verificacion_json=row["verificacion_json"] or "{}",
            requiere_revision_extendida=bool(row["requiere_revision_extendida"]),
        )

        if art_id:
            # Si el estado no es "pending", actualizarlo
            estado = row["estado"]
            if estado and estado != "pending":
                try:
                    supabase_queue.get_client().table("articulos").update({
                        "estado": estado,
                    }).eq("id", art_id).execute()
                except Exception as e:
                    print(f"  [WARN] No se pudo actualizar estado de {slug}: {e}")

            print(f"  [OK] {slug} (estado: {estado})")
            ok += 1
        else:
            print(f"  [ERROR] {slug}")
            error += 1

    print(f"\nResultado: {ok} migrados, {skip} ya existían, {error} errores")

if __name__ == "__main__":
    migrar()
