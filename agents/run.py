"""
run.py — Punto de entrada CLI del sistema de generación de artículos

Uso:
  python run.py                          # run completo
  python run.py --dry-run                # genera pero no publica
  python run.py --categoria perfiles     # solo ese writer
  python run.py --api                    # levanta FastAPI de revisión (puerto 8001)
  python run.py --audit                  # detecta duplicados existentes
  python run.py --publish-approved       # publica artículos aprobados en cola

Cron:
  python agents/run.py >> agents/logs/run.log 2>&1
"""

import argparse
import asyncio
import logging
import sys
from pathlib import Path

# Asegurar que el directorio agents/ esté en el path
sys.path.insert(0, str(Path(__file__).parent))

# Crear directorio de logs si no existe
(Path(__file__).parent / "logs").mkdir(exist_ok=True)

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------

def setup_logging(verbose: bool = False):
    level = logging.DEBUG if verbose else logging.INFO
    fmt = "%(asctime)s %(levelname)-8s %(name)s — %(message)s"
    datefmt = "%Y-%m-%d %H:%M:%S"

    handlers: list[logging.Handler] = [logging.StreamHandler(sys.stdout)]

    # File handler
    log_file = Path(__file__).parent / "logs" / "run.log"
    try:
        fh = logging.FileHandler(log_file, encoding="utf-8")
        fh.setFormatter(logging.Formatter(fmt, datefmt=datefmt))
        handlers.append(fh)
    except Exception:
        pass

    logging.basicConfig(level=level, format=fmt, datefmt=datefmt, handlers=handlers, force=True)


# ---------------------------------------------------------------------------
# Comandos
# ---------------------------------------------------------------------------

async def cmd_run(dry_run: bool, categoria: str | None, verbose: bool):
    setup_logging(verbose)
    logger = logging.getLogger("run")

    import config
    logger.info(f"Observa Perú — Sistema de Generación Automática de Artículos")
    logger.info(f"API Key:     {'configurada' if config.ANTHROPIC_API_KEY else 'NO CONFIGURADA'}")
    logger.info(f"CMS Type:    {config.CMS_TYPE}")
    logger.info(f"Content dir: {config.CONTENT_DIR}")
    logger.info(f"Dry run:     {dry_run}")

    from orchestrator import Orchestrator
    orch = Orchestrator(dry_run=dry_run, categoria_filtro=categoria)
    stats = await orch.run_daily()
    return stats


async def cmd_publish_approved(dry_run: bool):
    setup_logging()
    logger = logging.getLogger("publish")
    from publisher_agent import PublisherAgent
    pub = PublisherAgent()
    n = await pub.publish_approved(dry_run=dry_run)
    logger.info(f"Artículos publicados: {n}")


async def cmd_audit():
    setup_logging()
    from orchestrator import audit_duplicados
    await audit_duplicados()


def cmd_api():
    setup_logging()
    try:
        from revision_queue import app, init_db
        import uvicorn
        init_db()
        print("Levantando API de revisión en http://localhost:8001")
        print("Swagger UI: http://localhost:8001/docs")
        uvicorn.run(app, host="0.0.0.0", port=8001)
    except ImportError as e:
        print(f"Error: {e}")
        print("Instala las dependencias: pip install -r requirements.txt")
        sys.exit(1)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Observa Perú — Sistema de generación automática de artículos",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ejemplos:
  python run.py                          # run completo del día
  python run.py --dry-run                # simula sin publicar
  python run.py --categoria faq          # solo artículos FAQ
  python run.py --api                    # levanta API REST de revisión
  python run.py --audit                  # detecta duplicados
  python run.py --publish-approved       # publica artículos aprobados
        """,
    )

    parser.add_argument(
        "--dry-run", action="store_true",
        help="Genera artículos pero no los publica ni escribe archivos",
    )
    parser.add_argument(
        "--categoria",
        choices=["perfiles", "debates", "noticias", "analisis", "faq"],
        help="Ejecutar solo el writer de esta categoría",
    )
    parser.add_argument(
        "--api", action="store_true",
        help="Levantar servidor FastAPI de cola de revisión (puerto 8001)",
    )
    parser.add_argument(
        "--audit", action="store_true",
        help="Detectar duplicados entre artículos ya publicados",
    )
    parser.add_argument(
        "--publish-approved", action="store_true",
        help="Publicar artículos en estado 'approved' de la cola",
    )
    parser.add_argument(
        "--verbose", "-v", action="store_true",
        help="Logging detallado (DEBUG)",
    )

    args = parser.parse_args()

    if args.api:
        cmd_api()

    elif args.audit:
        asyncio.run(cmd_audit())

    elif args.publish_approved:
        asyncio.run(cmd_publish_approved(dry_run=args.dry_run))

    else:
        # Run principal (con o sin --dry-run, con o sin --categoria)
        stats = asyncio.run(cmd_run(
            dry_run=args.dry_run,
            categoria=args.categoria,
            verbose=args.verbose,
        ))
        # Exit code 0 siempre (errores parciales son normales)
        sys.exit(0)


if __name__ == "__main__":
    main()
