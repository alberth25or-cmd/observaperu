"""
config.py — Carga de variables de entorno con python-dotenv
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Cargar .env desde el directorio agents/
_env_path = Path(__file__).parent / ".env"
load_dotenv(_env_path)

_raw_key = os.getenv("ANTHROPIC_API_KEY", "")
# Ignorar placeholders como "sk-ant-..."
ANTHROPIC_API_KEY: str = _raw_key if (len(_raw_key) > 20 and _raw_key != "sk-ant-...") else ""
CMS_TYPE: str = os.getenv("CMS_TYPE", "nextjs_api")          # nextjs_api | wordpress
CMS_URL: str = os.getenv("CMS_URL", "../content")             # ruta al content/ o URL WordPress
CMS_TOKEN: str = os.getenv("CMS_TOKEN", "")
DB_PATH: str = os.getenv("DB_PATH", str(Path(__file__).parent / "articulos.db"))
MAX_ARTICULOS_DIA: int = int(os.getenv("MAX_ARTICULOS_DIA", "40"))

# Directorio raíz del proyecto Next.js (un nivel arriba de agents/)
PROJECT_ROOT: Path = Path(__file__).parent.parent

# Directorio content/ donde se publican los .mdx
if CMS_TYPE == "nextjs_api":
    CONTENT_DIR: Path = (Path(__file__).parent / CMS_URL).resolve()
else:
    CONTENT_DIR: Path = PROJECT_ROOT / "content"

# Modelo Claude a usar
CLAUDE_MODEL: str = "claude-sonnet-4-6"

# Precios por token (USD) — claude-sonnet-4-6
PRICE_INPUT_PER_TOKEN: float = 0.000003
PRICE_OUTPUT_PER_TOKEN: float = 0.000015

if __name__ == "__main__":
    print("=== config.py ===")
    print(f"  ANTHROPIC_API_KEY : {'SET' if ANTHROPIC_API_KEY else 'MISSING'}")
    print(f"  CMS_TYPE          : {CMS_TYPE}")
    print(f"  CMS_URL           : {CMS_URL}")
    print(f"  DB_PATH           : {DB_PATH}")
    print(f"  MAX_ARTICULOS_DIA : {MAX_ARTICULOS_DIA}")
    print(f"  CONTENT_DIR       : {CONTENT_DIR}")
    print(f"  PROJECT_ROOT      : {PROJECT_ROOT}")
