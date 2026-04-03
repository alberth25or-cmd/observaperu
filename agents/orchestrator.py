"""
orchestrator.py — Orquestador del pipeline completo de generación de artículos

Secuencia:
  1. Ingesta (noticias + candidatos)
  2. SEO Agent → 40 temas únicos
  3. Writers en PARALELO por categoría
  4. Verificación por artículo
  5. Guardar en DB con estado "pending"
  6. LOG resumen + costos estimados
"""

import asyncio
import json
import logging
from datetime import datetime
from typing import Any

import supabase_queue
import config

logger = logging.getLogger(__name__)


class Orchestrator:

    def __init__(self, dry_run: bool = False, categoria_filtro: str | None = None):
        self.dry_run = dry_run
        self.categoria_filtro = categoria_filtro
        self.tokens_input_total = 0
        self.tokens_output_total = 0

    def _acumular_tokens(self, agente: Any):
        self.tokens_input_total  += getattr(agente, "tokens_input", 0)
        self.tokens_output_total += getattr(agente, "tokens_output", 0)

    @property
    def costo_estimado(self) -> float:
        return (
            self.tokens_input_total  * config.PRICE_INPUT_PER_TOKEN +
            self.tokens_output_total * config.PRICE_OUTPUT_PER_TOKEN
        )

    # ------------------------------------------------------------------
    # Guardar artículo en DB
    # ------------------------------------------------------------------

    def _guardar_en_db(self, articulo: dict, verificacion: dict) -> int | None:
        """Guarda artículo en la cola. Retorna el ID asignado."""
        slug = articulo.get("slug", "")
        if not slug:
            logger.warning("Artículo sin slug, omitiendo")
            return None

        existente_id = supabase_queue.existe_por_slug(slug)
        if existente_id:
            logger.debug(f"Slug ya existe en DB: {slug}")
            return existente_id

        requiere_ext = articulo.get("requiere_revision_extendida", False)
        if verificacion.get("nivel_riesgo") in ("medio", "alto"):
            requiere_ext = True

        return supabase_queue.guardar_articulo(
            titulo=articulo.get("titulo", ""),
            slug=slug,
            contenido=articulo.get("contenido", ""),
            keyword=articulo.get("keyword", ""),
            categoria=articulo.get("categoria", "noticias"),
            excerpt=articulo.get("excerpt"),
            tiempo_lectura=articulo.get("tiempo_lectura"),
            tipo=articulo.get("tipo", "nuevo"),
            articulo_original_slug=articulo.get("articulo_original_slug") or None,
            verificacion_json=json.dumps(verificacion, ensure_ascii=False),
            requiere_revision_extendida=requiere_ext,
        )

    # ------------------------------------------------------------------
    # Pipeline de un artículo (write + verify)
    # ------------------------------------------------------------------

    async def _procesar_tema(
        self,
        tema: dict,
        contexto_ingesta: dict,
        writer,
        verificacion_agent,
    ) -> dict | None:
        titulo = tema.get("titulo", "?")
        try:
            # 1. Escribir
            articulo = await writer.write(tema, contexto_ingesta)
            if not articulo:
                logger.warning(f"Writer retornó vacío para: {titulo}")
                return None

            # 2. Verificar
            verificacion = await verificacion_agent.verify(articulo)

            # 3. Guardar en DB
            art_id = self._guardar_en_db(articulo, verificacion)

            logger.info(
                f"  [OK] [{articulo.get('categoria')}] {titulo[:60]} "
                f"→ riesgo={verificacion.get('nivel_riesgo')} id={art_id}"
            )
            return {"articulo": articulo, "verificacion": verificacion, "id": art_id}

        except Exception as e:
            logger.error(f"Error procesando tema '{titulo}': {e}")
            return None

    # ------------------------------------------------------------------
    # run_daily()
    # ------------------------------------------------------------------

    async def run_daily(self) -> dict:
        inicio = datetime.utcnow()
        logger.info(f"{'='*60}")
        logger.info(f"Iniciando run diario {inicio.strftime('%Y-%m-%d %H:%M:%S UTC')}")
        if self.dry_run:
            logger.info("[DRY RUN activado — no se publicará nada]")
        logger.info(f"{'='*60}")

        # ---- 1. INGESTA -----------------------------------------------
        from ingesta_agent import IngestaAgent
        ingesta_agente = IngestaAgent()
        try:
            ingesta = await ingesta_agente.run()
        except Exception as e:
            logger.error(f"Ingesta falló completamente: {e}. Usando datos vacíos.")
            ingesta = {"noticias_hoy": [], "candidatos": [], "fuentes_exitosas": [], "fuentes_fallidas": [str(e)]}

        # ---- 1b. CARGAR ESTADÍSTICAS DE DEBATES (datos propios) -------
        # Son el diferencial de contenido de Observa Perú
        import json as _json
        debate_stats_files = [
            "debate6_stats.json", "debate5_stats.json", "debate4_stats.json",
            "debate3_stats.json", "debate2_stats.json", "debate_stats.json",
        ]
        todos_debates = []
        for fname in debate_stats_files:
            fpath = config.CONTENT_DIR.parent / "public" / "data" / fname
            try:
                with open(fpath, encoding="utf-8") as f:
                    todos_debates.append(_json.load(f))
            except Exception:
                pass

        # El más reciente como stats principal; todos para búsquedas cruzadas
        ingesta["debate_stats"] = todos_debates[0] if todos_debates else {}
        ingesta["todos_debates"] = todos_debates
        logger.info(f"Estadísticas de debates cargadas: {len(todos_debates)} jornadas")

        logger.info(f"Ingesta: {len(ingesta['noticias_hoy'])} noticias | "
                    f"fuentes OK: {ingesta['fuentes_exitosas']} | "
                    f"fuentes fallidas: {len(ingesta['fuentes_fallidas'])}")

        # ---- 2. SEO → TEMAS -------------------------------------------
        from seo_agent import SEOAgent
        seo = SEOAgent()

        if not config.ANTHROPIC_API_KEY:
            logger.warning("ANTHROPIC_API_KEY no configurada. Usando temas de demo.")
            temas = self._demo_temas()
        else:
            try:
                temas = await seo.run(ingesta)
                self._acumular_tokens(seo)
            except Exception as e:
                logger.error(f"SEO Agent falló: {e}. Usando temas de demo.")
                temas = self._demo_temas()

        # Filtrar por categoría si se pidió
        if self.categoria_filtro:
            temas = [t for t in temas if t.get("categoria") == self.categoria_filtro]
            logger.info(f"Filtro categoría '{self.categoria_filtro}': {len(temas)} temas")

        nuevos = sum(1 for t in temas if t.get("tipo") == "nuevo")
        reformulados = sum(1 for t in temas if t.get("tipo") == "actualizacion")
        logger.info(f"Temas: {len(temas)} total | {nuevos} nuevos | {reformulados} reformulados")

        # ---- 3. WRITERS EN PARALELO -----------------------------------
        from writer_agents import get_writer, WRITERS
        from verificacion_agent import VerificacionAgent

        verificacion_agent = VerificacionAgent()

        # Agrupar temas por categoría y crear writers
        temas_por_cat: dict[str, list] = {}
        for t in temas:
            cat = t.get("categoria", "noticias")
            temas_por_cat.setdefault(cat, []).append(t)

        writers = {cat: get_writer(cat) for cat in temas_por_cat}

        # Crear todas las tareas
        tareas = []
        for cat, temas_cat in temas_por_cat.items():
            writer = writers[cat]
            for tema in temas_cat:
                tareas.append(
                    self._procesar_tema(tema, ingesta, writer, verificacion_agent)
                )

        logger.info(f"Ejecutando {len(tareas)} tareas de escritura en paralelo...")

        if config.ANTHROPIC_API_KEY:
            resultados = await asyncio.gather(*tareas, return_exceptions=False)
        else:
            logger.info("[SIN API KEY] Simulando escritura en dry-run")
            # Cerrar coroutines sin ejecutarlas para evitar RuntimeWarning
            for t in tareas:
                t.close()
            resultados = []

        # Acumular tokens de writers y verificación
        for writer in writers.values():
            self._acumular_tokens(writer)
        self._acumular_tokens(verificacion_agent)

        # ---- 4. ESTADÍSTICAS ------------------------------------------
        articulos_ok = [r for r in resultados if r is not None]
        articulos_fail = len(resultados) - len(articulos_ok)

        riesgo_bajo  = sum(1 for r in articulos_ok if r["verificacion"].get("nivel_riesgo") == "bajo")
        riesgo_medio = sum(1 for r in articulos_ok if r["verificacion"].get("nivel_riesgo") == "medio")
        riesgo_alto  = sum(1 for r in articulos_ok if r["verificacion"].get("nivel_riesgo") == "alto")

        duracion = (datetime.utcnow() - inicio).total_seconds()

        logger.info(f"{'='*60}")
        logger.info(f"Run completado en {duracion:.1f}s")
        logger.info(f"  Artículos en cola: {len(articulos_ok)}")
        logger.info(f"  Fallos:            {articulos_fail}")
        logger.info(f"  Riesgo bajo:       {riesgo_bajo}")
        logger.info(f"  Riesgo medio:      {riesgo_medio}")
        logger.info(f"  Riesgo alto:       {riesgo_alto}")
        logger.info(f"  Tokens entrada:    {self.tokens_input_total:,}")
        logger.info(f"  Tokens salida:     {self.tokens_output_total:,}")
        logger.info(f"  Costo estimado:    ${self.costo_estimado:.4f} USD")
        logger.info(f"{'='*60}")

        return {
            "articulos_generados": len(articulos_ok),
            "articulos_fallidos":  articulos_fail,
            "riesgo_bajo":  riesgo_bajo,
            "riesgo_medio": riesgo_medio,
            "riesgo_alto":  riesgo_alto,
            "tokens_input":  self.tokens_input_total,
            "tokens_output": self.tokens_output_total,
            "costo_usd":     round(self.costo_estimado, 4),
            "duracion_seg":  round(duracion, 1),
        }

    # ------------------------------------------------------------------
    # Demo temas (sin API key)
    # ------------------------------------------------------------------

    def _demo_temas(self) -> list[dict]:
        return [
            {"titulo": "¿Cuándo son las elecciones presidenciales en Perú 2026?", "keyword": "elecciones presidenciales Perú 2026", "categoria": "faq", "angulo": "calendario electoral", "tipo": "nuevo", "articulo_original_slug": "", "prioridad_seo": 10},
            {"titulo": "Keiko Fujimori: perfil, propuestas y trayectoria 2026", "keyword": "Keiko Fujimori candidata 2026", "categoria": "perfiles", "angulo": "perfil completo", "tipo": "nuevo", "articulo_original_slug": "", "prioridad_seo": 9},
            {"titulo": "Rafael López Aliaga: propuestas económicas para Perú 2026", "keyword": "López Aliaga propuestas económicas", "categoria": "perfiles", "angulo": "economía", "tipo": "nuevo", "articulo_original_slug": "", "prioridad_seo": 9},
        ]


# ---------------------------------------------------------------------------
# Audit de duplicados existentes
# ---------------------------------------------------------------------------

async def audit_duplicados():
    """Detecta duplicados entre artículos ya publicados en content/."""
    from dedup_service import DeduplicationService
    from revision_queue import SessionLocal, TemaPublicado

    logger.info("Iniciando auditoría de duplicados...")
    dedup = DeduplicationService()

    db = SessionLocal()
    try:
        temas = db.query(TemaPublicado).all()
    finally:
        db.close()

    if not temas:
        logger.info("No hay temas publicados registrados en la DB.")
        return

    duplicados_detectados = 0
    for tema in temas:
        resultado = dedup.check_duplicate(tema.titulo, tema.categoria)
        if resultado["status"] == "duplicado" and resultado.get("articulo_similar", {}).get("slug") != tema.slug:
            duplicados_detectados += 1
            logger.warning(
                f"DUPLICADO: '{tema.titulo}' ↔ '{resultado['articulo_similar']['titulo']}' "
                f"(sim={resultado['similitud']})"
            )

    logger.info(f"Auditoría completada: {duplicados_detectados} duplicados detectados en {len(temas)} temas")
