"""
Script para extraer información de estudios universitarios de las hojas de vida de candidatos.

Extrae:
- ¿Cuenta con estudios universitarios? (SÍ/NO)
- Estudio Universitario 1: universidad, grado/título, concluidos, egresado
- Estudio Universitario 2: universidad, grado/título, concluidos, egresado
"""

import re
import json
import sys
import io
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

import pandas as pd
import pdfplumber

# Configurar stdout para UTF-8 en Windows
if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")
    except AttributeError:
        pass

# Configuración
BASE_DIR = Path(__file__).parent.parent
HOJAS_VIDA_DIR = BASE_DIR / "public" / "pdfs" / "hojas-vida"
OUTPUT_DIR = BASE_DIR / "public" / "data"

# Lista de candidatos
CANDIDATOS_SLUGS = [
    "alex-gonzalez-castillo",
    "alfonso-lopez-chau-nava",
    "alvaro-gonzalo-paz-de-la-barra-freigeiro",
    "antonio-ortiz-villano",
    "armando-joaquin-masse-fernandez",
    "carlos-ernesto-jaico-carranza",
    "carlos-espa-y-garces-alvear",
    "carlos-gonzalo-alvarez-loayza",
    "cesar-acuna-peralta",
    "charlie-carrasco-salazar",
    "fiorella-giannina-molinelli-aristondo",
    "francisco-ernesto-diez-canseco-tavara",
    "george-patrick-forsyth-sommer",
    "herbert-caller-gutierrez",
    "jose-leon-luna-galvez",
    "jose-williams-zapata",
    "jorge-nieto-montesinos",
    "keiko-sofia-fujimori-higuchi",
    "luis-fernando-olivera-vega",
    "mario-enrique-vizcarra-cornejo",
    "maria-soledad-perez-tello-de-rodriguez",
    "mesias-antonio-guevara-amasifuen",
    "napoleon-becerra-garcia",
    "paul-davis-jaimes-blanco",
    "pitter-enrique-valderrama-pena",
    "rafael-bernardo-lopez-aliaga",
    "rafael-jorge-belaunde-llosa",
    "ricardo-pablo-belmont-cassinelli",
    "roberto-enrique-chiabra-leon",
    "roberto-helbert-sanchez-palomino",
    "ronald-darwin-atencio-sotomayor",
    "rosario-del-pilar-fernandez-bazan",
    "vladimir-roy-cerron-rojas",
    "walter-gilmer-chirinos-purizaga",
    "wolfgang-mario-grozo-costa",
    "yonhy-lescano-ancieta",
]

MAX_WORKERS = 4


def extract_text_from_pdf(pdf_path: Path) -> str:
    """Extrae texto de un PDF."""
    if not pdf_path.exists():
        return ""

    try:
        text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
        return text
    except Exception as e:
        print(f"  Error leyendo PDF {pdf_path.name}: {e}")
        return ""


def extract_estudios_universitarios(text: str) -> dict[str, str]:
    """
    Extrae información de estudios universitarios del texto del PDF.

    Busca:
    1. ¿Cuenta con estudios universitarios? (SÍ/NO)
    2. Estudio Universitario 1: universidad, grado/título, concluidos, egresado
    3. Estudio Universitario 2: universidad, grado/título, concluidos, egresado
    """
    if not text:
        return {
            "tiene_estudios": "No se encontró",
            "estudio1_universidad": "No se encontró",
            "estudio1_grado_titulo": "No se encontró",
            "estudio1_concluidos": "No se encontró",
            "estudio1_egresado": "No se encontró",
            "estudio2_universidad": "No se encontró",
            "estudio2_grado_titulo": "No se encontró",
            "estudio2_concluidos": "No se encontró",
            "estudio2_egresado": "No se encontró",
        }

    resultado: dict[str, str] = {}

    # 1. Buscar si tiene estudios universitarios
    tiene_estudios_patterns = [
        r"¿CUENTA\s+CON\s+ESTUDIOS\s+UNIVERSITARIOS\?[:\s]+([SÍSÍNO\s]+)",
        r"¿Cuenta\s+con\s+estudios\s+universitarios\?[:\s]+([SíNo\s]+)",
        r"CUENTA\s+CON\s+ESTUDIOS\s+UNIVERSITARIOS[:\s]+([SÍSÍNO\s]+)",
        r"Cuenta\s+con\s+estudios\s+universitarios[:\s]+([SíNo\s]+)",
    ]

    tiene_estudios = None
    for pattern in tiene_estudios_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            respuesta = match.group(1).strip().upper()
            if "NO" in respuesta or respuesta.startswith("N"):
                tiene_estudios = "NO"
            elif "SÍ" in respuesta or "SI" in respuesta or respuesta.startswith("S"):
                tiene_estudios = "SÍ"
            break

    if tiene_estudios == "NO":
        resultado["tiene_estudios"] = "No posee"
        resultado["estudio1_universidad"] = "No posee"
        resultado["estudio1_grado_titulo"] = "No posee"
        resultado["estudio1_concluidos"] = "No posee"
        resultado["estudio1_egresado"] = "No posee"
        resultado["estudio2_universidad"] = "No posee"
        resultado["estudio2_grado_titulo"] = "No posee"
        resultado["estudio2_concluidos"] = "No posee"
        resultado["estudio2_egresado"] = "No posee"
        return resultado

    resultado["tiene_estudios"] = tiene_estudios if tiene_estudios else "No se encontró"

    # 2. Buscar sección de ESTUDIOS UNIVERSITARIOS
    estudios_section_patterns = [
        r"ESTUDIOS\s+UNIVERSITARIOS",
        r"Estudios\s+universitarios",
        r"ESTUDIO\s+UNIVERSITARIO",
        r"Estudio\s+universitario",
    ]

    section_start = -1
    for pattern in estudios_section_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            section_start = match.start()
            break

    if section_start == -1:
        # Si no se encuentra la sección, buscar directamente los campos
        estudio1 = extract_estudio_universitario(text, 1)
        estudio2 = extract_estudio_universitario(text, 2)
    else:
        # Extraer texto desde la sección
        section_text = text[
            section_start : section_start + 5000
        ]  # 5000 caracteres después
        estudio1 = extract_estudio_universitario(section_text, 1)
        estudio2 = extract_estudio_universitario(section_text, 2)

    # Combinar resultados
    resultado.update(
        {
            "estudio1_universidad": estudio1.get("universidad", "No se encontró"),
            "estudio1_grado_titulo": estudio1.get("grado_titulo", "No se encontró"),
            "estudio1_concluidos": estudio1.get("concluidos", "No se encontró"),
            "estudio1_egresado": estudio1.get("egresado", "No se encontró"),
            "estudio2_universidad": estudio2.get("universidad", "No se encontró"),
            "estudio2_grado_titulo": estudio2.get("grado_titulo", "No se encontró"),
            "estudio2_concluidos": estudio2.get("concluidos", "No se encontró"),
            "estudio2_egresado": estudio2.get("egresado", "No se encontró"),
        }
    )

    return resultado


def extract_estudio_universitario(text: str, numero: int) -> dict[str, str]:
    """
    Extrae información de un estudio universitario específico (1 o 2).

    Busca:
    - NOMBRE DE LA UNIVERSIDAD
    - GRADO O TÍTULO
    - CONCLUIDOS (SÍ/NO)
    - EGRESADO (SÍ/NO)
    """
    resultado: dict[str, str] = {}

    # Buscar sección del estudio (1 o 2)
    estudio_patterns = [
        rf"ESTUDIO\s+UNIVERSITARIO\s+{numero}",
        rf"Estudio\s+universitario\s+{numero}",
        rf"ESTUDIO\s+UNIVERSITARIO\s+{numero}",
    ]

    section_start = -1
    for pattern in estudio_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            section_start = match.start()
            break

    if section_start == -1:
        # Si no se encuentra la sección específica, buscar en todo el texto
        search_text = text
    else:
        # Buscar hasta el siguiente estudio o fin de sección
        next_section = text.find(f"ESTUDIO UNIVERSITARIO {numero + 1}", section_start)
        if next_section == -1:
            next_section = text.find(
                f"Estudio universitario {numero + 1}", section_start
            )
        if next_section == -1:
            search_text = text[section_start : section_start + 2000]
        else:
            search_text = text[section_start:next_section]

    # Extraer nombre de la universidad
    universidad_patterns = [
        r"NOMBRE\s+DE\s+LA\s+UNIVERSIDAD[:\s]+([^\n\r]+)",
        r"Nombre\s+de\s+la\s+universidad[:\s]+([^\n\r]+)",
        r"UNIVERSIDAD[:\s]+([^\n\r]+)",
    ]

    universidad = None
    for pattern in universidad_patterns:
        match = re.search(pattern, search_text, re.IGNORECASE)
        if match:
            universidad = match.group(1).strip()
            # Limpiar - remover texto adicional que viene después
            # Remover palabras clave que no son parte del nombre
            palabras_a_remover = [
                "CONCLUIDOS",
                "EGRESADO",
                "GRADO",
                "TÍTULO",
                "TITULO",
                "AÑO",
                "AÑO DE OBTENCIÓN",
                "INFORMACIÓN COMPLEMENTARIA",
            ]
            for palabra in palabras_a_remover:
                # Remover desde la palabra clave hasta el final o siguiente campo
                if palabra in universidad.upper():
                    idx = universidad.upper().find(palabra)
                    universidad = universidad[:idx].strip()
                    break

            # Limpiar espacios y caracteres especiales
            universidad = re.sub(r"\s+", " ", universidad)
            universidad = universidad.strip(".,;:")
            if len(universidad) > 0 and len(universidad) < 200:
                break

    resultado["universidad"] = (
        universidad if universidad and len(universidad) > 0 else "No se encontró"
    )

    # Extraer grado o título
    grado_patterns = [
        r"GRADO\s+O\s+T[ÍI]TULO[:\s]+([^\n\r]+)",
        r"Grado\s+o\s+t[íi]tulo[:\s]+([^\n\r]+)",
        r"GRADO[:\s]+([^\n\r]+)",
        r"T[ÍI]TULO[:\s]+([^\n\r]+)",
    ]

    grado_titulo = None
    for pattern in grado_patterns:
        match = re.search(pattern, search_text, re.IGNORECASE)
        if match:
            grado_titulo = match.group(1).strip()
            # Limpiar - remover texto adicional que viene después
            palabras_a_remover = [
                "EGRESADO",
                "CONCLUIDOS",
                "AÑO",
                "AÑO DE OBTENCIÓN",
                "INFORMACIÓN COMPLEMENTARIA",
                "INFORMACION COMPLEMENTARIA",
            ]
            for palabra in palabras_a_remover:
                if palabra in grado_titulo.upper():
                    idx = grado_titulo.upper().find(palabra)
                    grado_titulo = grado_titulo[:idx].strip()
                    break

            # Limpiar espacios y caracteres especiales
            grado_titulo = re.sub(r"\s+", " ", grado_titulo)
            grado_titulo = grado_titulo.strip(".,;:")
            if len(grado_titulo) > 0 and len(grado_titulo) < 200:
                break

    resultado["grado_titulo"] = (
        grado_titulo if grado_titulo and len(grado_titulo) > 0 else "No se encontró"
    )

    # Extraer CONCLUIDOS
    concluidos_patterns = [
        r"CONCLUIDOS[:\s]+([SÍSÍNO\s]+)",
        r"Concluidos[:\s]+([SíNo\s]+)",
    ]

    concluidos = None
    for pattern in concluidos_patterns:
        match = re.search(pattern, search_text, re.IGNORECASE)
        if match:
            valor = match.group(1).strip().upper()
            if "NO" in valor or valor.startswith("N"):
                concluidos = "No concluido"
            elif "SÍ" in valor or "SI" in valor or valor.startswith("S"):
                concluidos = "Concluido"
            break

    resultado["concluidos"] = concluidos if concluidos else "No se encontró"

    # Extraer EGRESADO
    egresado_patterns = [
        r"EGRESADO[:\s]+([SÍSÍNO\s]+)",
        r"Egresado[:\s]+([SíNo\s]+)",
    ]

    egresado = None
    for pattern in egresado_patterns:
        match = re.search(pattern, search_text, re.IGNORECASE)
        if match:
            valor = match.group(1).strip().upper()
            if "NO" in valor or valor.startswith("N"):
                egresado = "No"
            elif "SÍ" in valor or "SI" in valor or valor.startswith("S"):
                egresado = "Sí"
            break

    resultado["egresado"] = egresado if egresado else "No se encontró"

    return resultado


def process_candidate(slug: str) -> dict[str, str]:
    """Procesa un candidato y extrae su información de estudios universitarios."""
    pdf_path = HOJAS_VIDA_DIR / f"{slug}.pdf"

    if not pdf_path.exists():
        print(f"  [X] {slug}: PDF no encontrado")
        return {
            "slug": slug,
            "tiene_estudios": "No se encontró",
            "estudio1_universidad": "No se encontró",
            "estudio1_grado_titulo": "No se encontró",
            "estudio1_concluidos": "No se encontró",
            "estudio1_egresado": "No se encontró",
            "estudio2_universidad": "No se encontró",
            "estudio2_grado_titulo": "No se encontró",
            "estudio2_concluidos": "No se encontró",
            "estudio2_egresado": "No se encontró",
        }

    # Extraer texto
    text = extract_text_from_pdf(pdf_path)

    if not text:
        print(f"  [X] {slug}: No se pudo extraer texto")
        return {
            "slug": slug,
            "tiene_estudios": "No se encontró",
            "estudio1_universidad": "No se encontró",
            "estudio1_grado_titulo": "No se encontró",
            "estudio1_concluidos": "No se encontró",
            "estudio1_egresado": "No se encontró",
            "estudio2_universidad": "No se encontró",
            "estudio2_grado_titulo": "No se encontró",
            "estudio2_concluidos": "No se encontró",
            "estudio2_egresado": "No se encontró",
        }

    # Extraer estudios universitarios
    estudios = extract_estudios_universitarios(text)

    resultado = {"slug": slug, **estudios}

    print(f"  [OK] {slug}: Extraído")
    return resultado


def main():
    """Función principal."""
    print("=" * 60)
    print("EXTRACCIÓN DE ESTUDIOS UNIVERSITARIOS")
    print("=" * 60)
    print()

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Procesar candidatos en paralelo
    print(f"Procesando {len(CANDIDATOS_SLUGS)} candidatos...")
    resultados: list[dict[str, str]] = []

    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        future_to_slug = {
            executor.submit(process_candidate, slug): slug for slug in CANDIDATOS_SLUGS
        }

        for future in as_completed(future_to_slug):
            slug = future_to_slug[future]
            try:
                resultado = future.result()
                resultados.append(resultado)
            except Exception as e:
                print(f"  [ERROR] {slug}: {e}")
                resultados.append(
                    {
                        "slug": slug,
                        "tiene_estudios": "Error",
                        "estudio1_universidad": "Error",
                        "estudio1_grado_titulo": "Error",
                        "estudio1_concluidos": "Error",
                        "estudio1_egresado": "Error",
                        "estudio2_universidad": "Error",
                        "estudio2_grado_titulo": "Error",
                        "estudio2_concluidos": "Error",
                        "estudio2_egresado": "Error",
                    }
                )

    # Ordenar por slug
    resultados.sort(key=lambda x: x["slug"])

    # Guardar CSV
    df = pd.DataFrame(resultados)
    csv_path = OUTPUT_DIR / "candidatos_estudios_universitarios.csv"
    df.to_csv(csv_path, index=False, encoding="utf-8")
    print(f"\n[OK] CSV guardado en: {csv_path}")

    # Guardar JSON
    json_path = OUTPUT_DIR / "candidatos_estudios_universitarios.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(resultados, f, indent=2, ensure_ascii=False)
    print(f"[OK] JSON guardado en: {json_path}")

    # Estadísticas
    print("\n" + "=" * 60)
    print("RESUMEN")
    print("=" * 60)

    total = len(resultados)
    tiene_estudios = sum(1 for r in resultados if r["tiene_estudios"] in ["SÍ", "SI"])
    no_tiene = sum(1 for r in resultados if r["tiene_estudios"] == "No posee")
    estudio1_completo = sum(
        1
        for r in resultados
        if r["estudio1_universidad"] != "No se encontró"
        and r["estudio1_universidad"] != "No posee"
    )
    estudio2_completo = sum(
        1
        for r in resultados
        if r["estudio2_universidad"] != "No se encontró"
        and r["estudio2_universidad"] != "No posee"
    )

    print(f"Total de candidatos: {total}")
    print(f"Tiene estudios universitarios: {tiene_estudios}")
    print(f"No tiene estudios: {no_tiene}")
    print(f"Estudio 1 completo: {estudio1_completo}/{total}")
    print(f"Estudio 2 completo: {estudio2_completo}/{total}")

    # Mostrar algunos ejemplos
    print("\nEjemplos de datos extraídos:")
    for r in resultados[:3]:
        if r["tiene_estudios"] != "No se encontró":
            print(f"  {r['slug']}:")
            print(f"    Tiene estudios: {r['tiene_estudios']}")
            if (
                r["estudio1_universidad"] != "No se encontró"
                and r["estudio1_universidad"] != "No posee"
            ):
                print(
                    f"    Estudio 1: {r['estudio1_universidad']} - {r['estudio1_grado_titulo']}"
                )
                print(
                    f"      Concluidos: {r['estudio1_concluidos']}, Egresado: {r['estudio1_egresado']}"
                )


if __name__ == "__main__":
    main()
