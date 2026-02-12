"""
Script para extraer lugares de nacimiento de candidatos.

Metodología combinada:
1. Extraer de biografías en candidatos-detalle.ts (fuente primaria)
2. Extraer de PDFs de hojas de vida (fuente secundaria/validación)
3. Combinar resultados y generar CSV/JSON
"""

import os
import re
import json
import sys
import io
import pandas as pd
from pathlib import Path
from typing import Dict, Optional
import pdfplumber

# Configurar stdout para UTF-8 en Windows
if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    except AttributeError:
        pass

# Configuración
BASE_DIR = Path(__file__).parent.parent
DETAIL_FILE = BASE_DIR / "src" / "data" / "candidatos-detalle.ts"
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


def extract_from_biografia(biografia: str) -> Optional[str]:
    """
    Extrae lugar de nacimiento de una biografía.
    
    Patrones comunes:
    - "nació el X en la ciudad de Y"
    - "nació el X en el distrito de Y, provincia de Z, departamento de W"
    - "Nacido/Nacida el X en Y"
    - "nació/nacida en Y"
    """
    if not biografia:
        return None
    
    text_lower = biografia.lower()
    
    # Patrón 1: "nació/nacida/nacido el [fecha] en [lugar]" (con fecha)
    # Ejemplo: "nació el 17 de julio de 1950 en la ciudad de Lima"
    pattern1 = r'naci[óo]da?\s+el\s+[^,]+?\s+en\s+(?:la\s+)?(?:ciudad\s+de\s+|distrito\s+de\s+|provincia\s+de\s+)?([^.,]+?)(?:\.|,|$)'
    match1 = re.search(pattern1, text_lower)
    if match1:
        lugar = match1.group(1).strip()
        # Limpiar y normalizar
        lugar = re.sub(r'\s+', ' ', lugar)
        # Filtrar fechas (años de 4 dígitos) pero permitir otros números
        if not re.search(r'\b\d{4}\b', lugar) and len(lugar) > 2:
            return lugar.title()
    
    # Patrón 2: "nació/nacida/nacido en [lugar]" (sin fecha, más simple)
    # Ejemplo: "Nacida en Lima" o "nació en la ciudad de Lima"
    pattern2 = r'naci[óo]da?\s+en\s+(?:la\s+)?(?:ciudad\s+de\s+|distrito\s+de\s+|provincia\s+de\s+)?([^.,]+?)(?:\.|,|$)'
    match2 = re.search(pattern2, text_lower)
    if match2:
        lugar = match2.group(1).strip()
        lugar = re.sub(r'\s+', ' ', lugar)
        # Filtrar fechas pero permitir otros números
        if not re.search(r'\b\d{4}\b', lugar) and len(lugar) > 2:
            return lugar.title()
    
    # Patrón 3: "nació en [lugar], [departamento]" (con departamento)
    pattern3 = r'naci[óo]da?\s+en\s+([^,]+?),\s*(?:departamento\s+de\s+)?([^.,]+?)(?:\.|$)'
    match3 = re.search(pattern3, text_lower)
    if match3:
        lugar1 = match3.group(1).strip()
        lugar2 = match3.group(2).strip()
        # Filtrar fechas
        if not re.search(r'\d{4}', lugar1) and not re.search(r'\d{4}', lugar2):
            lugar = f"{lugar1}, {lugar2}"
            lugar = re.sub(r'\s+', ' ', lugar)
            if len(lugar) > 3:
                return lugar.title()
    
    # Patrón 4: "nació el [fecha] en el distrito de X, provincia de Y, departamento de Z"
    pattern4 = r'naci[óo]da?\s+el\s+[^,]+?\s+en\s+el\s+distrito\s+de\s+([^,]+?)(?:,\s+provincia\s+de\s+([^,]+?))?(?:,\s+departamento\s+de\s+([^.,]+?))?(?:\.|$)'
    match4 = re.search(pattern4, text_lower)
    if match4:
        distrito = match4.group(1).strip()
        provincia = match4.group(2).strip() if match4.group(2) else None
        departamento = match4.group(3).strip() if match4.group(3) else None
        
        partes = [distrito]
        if provincia:
            partes.append(provincia)
        if departamento:
            partes.append(departamento)
        
        lugar = ", ".join(partes)
        lugar = re.sub(r'\s+', ' ', lugar)
        if len(lugar) > 3:
            return lugar.title()
    
    return None


def extract_from_pdf(text: str) -> Optional[str]:
    """
    Extrae lugar de nacimiento de un PDF de hoja de vida.
    
    Busca en secciones comunes:
    - "Lugar de nacimiento"
    - "Nacimiento"
    - "Datos personales"
    """
    if not text:
        return None
    
    text_lower = text.lower()
    
    # Patrón 1: "Lugar de nacimiento: [lugar]"
    pattern1 = r'lugar\s+de\s+nacimiento[:\s]+([^\n]+?)(?:\n|$)'
    match1 = re.search(pattern1, text_lower)
    if match1:
        lugar = match1.group(1).strip()
        lugar = re.sub(r'\s+', ' ', lugar)
        if len(lugar) > 3:
            return lugar.title()
    
    # Patrón 2: "Nacimiento: [lugar]"
    pattern2 = r'nacimiento[:\s]+([^\n]+?)(?:\n|$)'
    match2 = re.search(pattern2, text_lower)
    if match2:
        lugar = match2.group(1).strip()
        lugar = re.sub(r'\s+', ' ', lugar)
        if len(lugar) > 3:
            return lugar.title()
    
    # Patrón 3: "Nació en [lugar]" (mismo que biografía)
    lugar_biografia = extract_from_biografia(text)
    if lugar_biografia:
        return lugar_biografia
    
    return None


def extract_from_detail_file() -> Dict[str, Dict]:
    """Extrae biografías del archivo candidatos-detalle.ts."""
    if not DETAIL_FILE.exists():
        print(f"Error: No se encontró el archivo {DETAIL_FILE}")
        return {}
    
    content = DETAIL_FILE.read_text(encoding='utf-8')
    resultados = {}
    
    # Buscar cada candidato y su biografía
    for slug in CANDIDATOS_SLUGS:
        # Patrón para encontrar el objeto del candidato
        pattern = rf'"{slug}"\s*:\s*\{{[^}}]*?biografia:\s*"([^"]+)"'
        match = re.search(pattern, content, re.DOTALL)
        
        if match:
            biografia = match.group(1)
            # Limpiar escapes de comillas
            biografia = biografia.replace('\\"', '"').replace('\\n', ' ')
            
            # Extraer nombre
            name_pattern = rf'"{slug}"[^}}]*?name:\s*"([^"]+)"'
            name_match = re.search(name_pattern, content)
            nombre = name_match.group(1) if name_match else slug
            
            # Extraer lugar de nacimiento
            lugar = extract_from_biografia(biografia)
            
            resultados[slug] = {
                'nombre': nombre,
                'lugar_biografia': lugar,
                'fuente_biografia': 'biografia' if lugar else None
            }
        else:
            resultados[slug] = {
                'nombre': slug,
                'lugar_biografia': None,
                'fuente_biografia': None
            }
    
    return resultados


def main():
    """Función principal."""
    print("=" * 60)
    print("EXTRACCIÓN DE LUGARES DE NACIMIENTO")
    print("=" * 60)
    print()
    
    # Paso 1: Extraer de biografías
    print("Paso 1: Extrayendo de biografías...")
    resultados = extract_from_detail_file()
    
    encontrados_biografia = sum(1 for r in resultados.values() if r['lugar_biografia'])
    print(f"  [OK] Encontrados en biografias: {encontrados_biografia}/{len(CANDIDATOS_SLUGS)}")
    print()
    
    # Paso 2: Extraer de PDFs (para los que no se encontró)
    print("Paso 2: Extrayendo de PDFs de hojas de vida...")
    encontrados_pdf = 0
    
    for slug in CANDIDATOS_SLUGS:
        if resultados[slug]['lugar_biografia']:
            continue  # Ya lo tenemos
        
        pdf_path = HOJAS_VIDA_DIR / f"{slug}.pdf"
        if not pdf_path.exists():
            continue
        
        print(f"  Procesando: {slug}")
        texto_pdf = extract_text_from_pdf(pdf_path)
        lugar_pdf = extract_from_pdf(texto_pdf)
        
        if lugar_pdf:
            resultados[slug]['lugar_pdf'] = lugar_pdf
            resultados[slug]['fuente_pdf'] = 'pdf'
            encontrados_pdf += 1
        else:
            resultados[slug]['lugar_pdf'] = None
            resultados[slug]['fuente_pdf'] = None
    
    print(f"  [OK] Encontrados en PDFs: {encontrados_pdf}")
    print()
    
    # Paso 3: Combinar resultados (priorizar biografía, luego PDF)
    print("Paso 3: Combinando resultados...")
    datos_finales = []
    
    for slug in CANDIDATOS_SLUGS:
        datos = resultados[slug]
        
        # Priorizar biografía, luego PDF
        lugar_final = datos['lugar_biografia'] or datos.get('lugar_pdf')
        fuente_final = datos['fuente_biografia'] or datos.get('fuente_pdf') or 'no_encontrado'
        
        datos_finales.append({
            'slug': slug,
            'nombre': datos['nombre'],
            'lugar_nacimiento': lugar_final or 'No encontrado',
            'fuente': fuente_final
        })
    
    # Guardar resultados
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # CSV
    df = pd.DataFrame(datos_finales)
    csv_path = OUTPUT_DIR / "candidatos_lugares_nacimiento.csv"
    df.to_csv(csv_path, index=False, encoding='utf-8')
    print(f"[OK] CSV guardado en: {csv_path}")
    
    # JSON
    json_path = OUTPUT_DIR / "candidatos_lugares_nacimiento.json"
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(datos_finales, f, indent=2, ensure_ascii=False)
    print(f"[OK] JSON guardado en: {json_path}")
    
    # Estadísticas
    print()
    print("=" * 60)
    print("RESUMEN")
    print("=" * 60)
    
    encontrados_total = sum(1 for d in datos_finales if d['lugar_nacimiento'] != 'No encontrado')
    por_fuente = {}
    for d in datos_finales:
        fuente = d['fuente']
        por_fuente[fuente] = por_fuente.get(fuente, 0) + 1
    
    print(f"Total de candidatos: {len(datos_finales)}")
    print(f"Lugares encontrados: {encontrados_total}")
    print(f"No encontrados: {len(datos_finales) - encontrados_total}")
    print()
    print("Por fuente:")
    for fuente, count in por_fuente.items():
        print(f"  {fuente}: {count}")
    
    # Mostrar algunos ejemplos
    print()
    print("Ejemplos de lugares encontrados:")
    for d in datos_finales[:5]:
        if d['lugar_nacimiento'] != 'No encontrado':
            print(f"  {d['nombre']}: {d['lugar_nacimiento']} ({d['fuente']})")


if __name__ == "__main__":
    main()

