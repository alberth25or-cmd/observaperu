"""
Script para extraer lugar de nacimiento y domicilio de las hojas de vida de candidatos.

Extrae información estructurada:
- Lugar de nacimiento: país, departamento, provincia, distrito
- Lugar de domicilio: departamento, provincia, distrito
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


def extract_lugar_nacimiento(text: str) -> dict[str, str]:
    """
    Extrae lugar de nacimiento del texto del PDF.

    Busca patrones como:
    - LUGAR DE NACIMIENTO / Lugar de nacimiento
    - PAÍS: PERÚ
    - DEPARTAMENTO: APURIMAC
    - PROVINCIA: ANDAHUAYLAS
    - DISTRITO: HUANCARAMA
    """
    if not text:
        return {
            "pais": "No se encontró",
            "departamento": "No se encontró",
            "provincia": "No se encontró",
            "distrito": "No se encontró",
        }

    # Buscar sección de lugar de nacimiento
    # Patrones para encontrar la sección
    lugar_nacimiento_patterns = [
        r"LUGAR\s+DE\s+NACIMIENTO",
        r"Lugar\s+de\s+nacimiento",
        r"LUGAR\s+NACIMIENTO",
        r"Lugar\s+nacimiento",
    ]

    # Encontrar índice de la sección
    section_start = -1
    for pattern in lugar_nacimiento_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            section_start = match.start()
            break

    if section_start == -1:
        # Si no se encuentra la sección, buscar directamente los campos
        return extract_campos_directos(text, "nacimiento")

    # Extraer texto desde la sección hasta el siguiente título o fin
    section_text = text[section_start : section_start + 2000]  # 2000 caracteres después

    return extract_campos_directos(section_text, "nacimiento")


def extract_lugar_domicilio(text: str) -> dict[str, str]:
    """
    Extrae lugar de domicilio del texto del PDF.

    Busca patrones como:
    - LUGAR DE DOMICILIO / Lugar de domicilio
    - DEPARTAMENTO: LIMA
    - PROVINCIA: LIMA
    - DISTRITO: RIMAC
    """
    if not text:
        return {
            "departamento": "No se encontró",
            "provincia": "No se encontró",
            "distrito": "No se encontró",
        }

    # Buscar sección de lugar de domicilio
    lugar_domicilio_patterns = [
        r"LUGAR\s+DE\s+DOMICILIO",
        r"Lugar\s+de\s+domicilio",
        r"LUGAR\s+DOMICILIO",
        r"Lugar\s+domicilio",
    ]

    section_start = -1
    for pattern in lugar_domicilio_patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            section_start = match.start()
            break

    if section_start == -1:
        return extract_campos_directos(text, "domicilio")

    # Extraer texto desde la sección
    section_text = text[section_start : section_start + 2000]

    return extract_campos_directos(section_text, "domicilio")


def extract_campos_directos(text: str, tipo: str) -> dict[str, str]:
    """
    Extrae campos directamente del texto usando patrones regex.

    Busca patrones como:
    - PAÍS:\s*([^\n]+)
    - DEPARTAMENTO:\s*([^\n]+)
    - PROVINCIA:\s*([^\n]+)
    - DISTRITO:\s*([^\n]+)
    """
    resultado: dict[str, str] = {}

    # Patrones para cada campo - más específicos para capturar solo el valor
    patterns = {
        "pais": [
            r"PA[ÍI]S[:\s]+([A-ZÁÉÍÓÚÑÜ\s]+?)(?:\s+DEPARTAMENTO|$|\n)",
            r"Pa[íi]s[:\s]+([A-ZÁÉÍÓÚÑÜa-záéíóúñü\s]+?)(?:\s+Departamento|$|\n)",
        ],
        "departamento": [
            r"DEPARTAMENTO[:\s]+([A-ZÁÉÍÓÚÑÜ\s]+?)(?:\s+PROVINCIA|$|\n)",
            r"Departamento[:\s]+([A-ZÁÉÍÓÚÑÜa-záéíóúñü\s]+?)(?:\s+Provincia|$|\n)",
        ],
        "provincia": [
            r"PROVINCIA[:\s]+([A-ZÁÉÍÓÚÑÜ\s]+?)(?:\s+DISTRITO|$|\n)",
            r"Provincia[:\s]+([A-ZÁÉÍÓÚÑÜa-záéíóúñü\s]+?)(?:\s+Distrito|$|\n)",
        ],
        "distrito": [
            r"DISTRITO[:\s]+([A-ZÁÉÍÓÚÑÜ\s]+?)(?:\s+LUGAR|$|\n|PROVINCIA|DEPARTAMENTO)",
            r"Distrito[:\s]+([A-ZÁÉÍÓÚÑÜa-záéíóúñü\s]+?)(?:\s+Lugar|$|\n|Provincia|Departamento)",
        ],
    }

    # Extraer cada campo
    for campo, campo_patterns in patterns.items():
        # Si es domicilio, no buscar país
        if tipo == "domicilio" and campo == "pais":
            continue

        valor = None
        for pattern in campo_patterns:
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                valor = match.group(1).strip()
                # Limpiar valor más agresivamente
                # Quitar palabras clave que puedan haber sido capturadas
                valor = re.sub(
                    r"\s*(DEPARTAMENTO|PROVINCIA|DISTRITO|PA[ÍI]S)[:\s]*",
                    "",
                    valor,
                    flags=re.IGNORECASE,
                )
                valor = re.sub(r"\s+", " ", valor)
                valor = valor.strip(".,;:")
                # Limitar longitud (lugares no deberían ser muy largos)
                if len(valor) > 50:
                    # Si es muy largo, tomar solo la primera palabra o palabras relevantes
                    palabras = valor.split()
                    if len(palabras) > 3:
                        valor = " ".join(palabras[:3])
                if len(valor) > 0:
                    break

        # Validar que el valor no contenga palabras clave inválidas
        palabras_invalidas = [
            "LUGAR DE DOMICILIO",
            "LUGAR DE NACIMIENTO",
            "Lugar de domicilio",
            "Lugar de nacimiento",
            "DEPARTAMENTO",
            "PROVINCIA",
            "DISTRITO",
            "PAÍS",
            "PAIS",
            "ÚNICO NACIONAL",
            "UNICO NACIONAL",
        ]

        if valor and len(valor) > 0 and len(valor) <= 50:
            # Verificar que no contenga palabras inválidas
            valor_upper = valor.upper()
            es_valido = True
            for palabra_invalida in palabras_invalidas:
                if palabra_invalida.upper() in valor_upper:
                    es_valido = False
                    break

            # Verificar que no sea solo números (excepto para distritos que pueden tener números)
            if campo != "distrito" and valor.isdigit():
                es_valido = False

            if es_valido:
                resultado[campo] = valor
            else:
                resultado[campo] = "No se encontró"
        else:
            resultado[campo] = "No se encontró"

    # Si es domicilio, asegurar que no tenga campo país
    if tipo == "domicilio" and "pais" in resultado:
        del resultado["pais"]

    return resultado


def process_candidate(slug: str) -> dict[str, str]:
    """Procesa un candidato y extrae su información de lugar de nacimiento y domicilio."""
    pdf_path = HOJAS_VIDA_DIR / f"{slug}.pdf"

    if not pdf_path.exists():
        print(f"  [X] {slug}: PDF no encontrado")
        return {
            "slug": slug,
            "nacimiento_pais": "No se encontró",
            "nacimiento_departamento": "No se encontró",
            "nacimiento_provincia": "No se encontró",
            "nacimiento_distrito": "No se encontró",
            "domicilio_departamento": "No se encontró",
            "domicilio_provincia": "No se encontró",
            "domicilio_distrito": "No se encontró",
        }

    # Extraer texto
    text = extract_text_from_pdf(pdf_path)

    if not text:
        print(f"  [X] {slug}: No se pudo extraer texto")
        return {
            "slug": slug,
            "nacimiento_pais": "No se encontró",
            "nacimiento_departamento": "No se encontró",
            "nacimiento_provincia": "No se encontró",
            "nacimiento_distrito": "No se encontró",
            "domicilio_departamento": "No se encontró",
            "domicilio_provincia": "No se encontró",
            "domicilio_distrito": "No se encontró",
        }

    # Extraer lugar de nacimiento
    lugar_nac = extract_lugar_nacimiento(text)

    # Extraer lugar de domicilio
    lugar_dom = extract_lugar_domicilio(text)

    resultado = {
        "slug": slug,
        "nacimiento_pais": lugar_nac.get("pais", "No se encontró"),
        "nacimiento_departamento": lugar_nac.get("departamento", "No se encontró"),
        "nacimiento_provincia": lugar_nac.get("provincia", "No se encontró"),
        "nacimiento_distrito": lugar_nac.get("distrito", "No se encontró"),
        "domicilio_departamento": lugar_dom.get("departamento", "No se encontró"),
        "domicilio_provincia": lugar_dom.get("provincia", "No se encontró"),
        "domicilio_distrito": lugar_dom.get("distrito", "No se encontró"),
    }

    print(f"  [OK] {slug}: Extraído")
    return resultado


def main():
    """Función principal."""
    print("=" * 60)
    print("EXTRACCIÓN DE LUGAR DE NACIMIENTO Y DOMICILIO")
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
                        "nacimiento_pais": "Error",
                        "nacimiento_departamento": "Error",
                        "nacimiento_provincia": "Error",
                        "nacimiento_distrito": "Error",
                        "domicilio_departamento": "Error",
                        "domicilio_provincia": "Error",
                        "domicilio_distrito": "Error",
                    }
                )

    # Ordenar por slug
    resultados.sort(key=lambda x: x["slug"])

    # Guardar CSV
    df = pd.DataFrame(resultados)
    csv_path = OUTPUT_DIR / "candidatos_lugares_detalle.csv"
    df.to_csv(csv_path, index=False, encoding="utf-8")
    print(f"\n[OK] CSV guardado en: {csv_path}")

    # Guardar JSON
    json_path = OUTPUT_DIR / "candidatos_lugares_detalle.json"
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(resultados, f, indent=2, ensure_ascii=False)
    print(f"[OK] JSON guardado en: {json_path}")

    # Estadísticas
    print("\n" + "=" * 60)
    print("RESUMEN")
    print("=" * 60)

    total = len(resultados)
    nacimiento_completo = sum(
        1
        for r in resultados
        if r["nacimiento_pais"] != "No se encontró"
        and r["nacimiento_departamento"] != "No se encontró"
    )
    domicilio_completo = sum(
        1
        for r in resultados
        if r["domicilio_departamento"] != "No se encontró"
        and r["domicilio_provincia"] != "No se encontró"
    )

    print(f"Total de candidatos: {total}")
    print(f"Nacimiento completo: {nacimiento_completo}/{total}")
    print(f"Domicilio completo: {domicilio_completo}/{total}")

    # Mostrar algunos ejemplos
    print("\nEjemplos de datos extraídos:")
    for r in resultados[:3]:
        if r["nacimiento_departamento"] != "No se encontró":
            print(f"  {r['slug']}:")
            print(
                f"    Nacimiento: {r['nacimiento_distrito']}, {r['nacimiento_provincia']}, {r['nacimiento_departamento']}"
            )
            print(
                f"    Domicilio: {r['domicilio_distrito']}, {r['domicilio_provincia']}, {r['domicilio_departamento']}"
            )


if __name__ == "__main__":
    main()
