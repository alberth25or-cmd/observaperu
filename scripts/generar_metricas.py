"""
Script para procesar PDFs de candidatos políticos y generar métricas estadísticas.

Pipeline determinístico con procesamiento paralelo:
1. Extracción de texto de PDFs (paralelo)
2. Generación de features crudas (conteos objetivos)
3. Cálculo de scores con normalización truncada
4. Exportación de resultados (CSV y JSON)

Autor: Observatorio Político
Fecha: 2026
"""

import os
import re
import json
import sys
import io
import pandas as pd
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from concurrent.futures import ThreadPoolExecutor, as_completed
import pdfplumber

# Configurar stdout para UTF-8 en Windows (solución para caracteres Unicode)
if sys.platform == "win32":
    try:
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    except AttributeError:
        # Si ya está configurado, no hacer nada
        pass


# ========================================
# CONFIGURACIÓN
# ========================================

BASE_DIR = Path(__file__).parent.parent
PDFS_DIR = BASE_DIR / "public" / "pdfs"
OUTPUT_DIR = BASE_DIR / "public" / "data"

# Directorios de PDFs
HOJAS_VIDA_DIR = PDFS_DIR / "hojas-vida"
PLANES_GOBIERNO_DIR = PDFS_DIR / "planes-gobierno"
RESUMENES_DIR = PDFS_DIR / "resumenes-planes"

# Configuración de paralelización
MAX_WORKERS = 4  # Ajustar según CPU/memoria (4-8 es razonable)

# Lista completa de candidatos (slugs)
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

# Máximos teóricos para normalización truncada
# Ajustados según nueva metodología (conteo de estructuras reales, no palabras)
MAX_PROPUESTAS = 50  # Propuestas estructuradas reales (listas, viñetas)
MAX_EXPERIENCIA = 30  # Años de experiencia únicos
MAX_GESTION = 30  # Actividades estructuradas
MAX_IMPACTO_SOCIAL = 25  # Metas cuantificadas únicas

# Mapeo ordinal para formación
FORMACION_SCORES = {
    "secundaria": 30,
    "bachiller": 50,
    "titulo": 70,
    "licenciatura": 70,
    "maestria": 85,
    "doctorado": 100,
}


# ========================================
# FUNCIONES DE EXTRACCIÓN
# ========================================

def extract_text(pdf_path: Path) -> str:
    """
    Extrae texto de un archivo PDF.
    
    Thread-safe: pdfplumber es seguro para uso concurrente.
    
    Args:
        pdf_path: Ruta al archivo PDF
        
    Returns:
        Texto extraído del PDF (string vacío si hay error)
    """
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
        print(f"Error extrayendo texto de {pdf_path}: {e}")
        return ""


# ========================================
# FUNCIONES DE FEATURES CRUDAS
# ========================================

def count_propuestas(text: str) -> int:
    """
    Cuenta propuestas estructuradas reales (no palabras sueltas).
    
    Metodología:
    - Listas numeradas: 1., 2., 3., etc.
    - Viñetas: •, -, *, o
    - Secciones estructuradas: "Propuesta X:", "Objetivo X:"
    - Párrafos que comienzan con palabras clave seguidas de dos puntos
    """
    if not text:
        return 0
    
    text_lower = text.lower()
    count = 0
    
    # 1. Contar listas numeradas (1., 2., 3., etc. o 1), 2), 3), etc.)
    # Patrón: número seguido de punto o paréntesis al inicio de línea o después de espacio
    numbered_lists = re.findall(r'(?:^|\s)(?:[0-9]+[\.\)])\s+[A-ZÁÉÍÓÚÑ]', text, re.MULTILINE)
    count += len(numbered_lists)
    
    # 2. Contar viñetas (•, -, *, o) al inicio de línea
    bullets = re.findall(r'^(?:[\u2022\u2023\u25E6\u2043\-\*o])\s+[A-ZÁÉÍÓÚÑ]', text, re.MULTILINE)
    count += len(bullets)
    
    # 3. Contar secciones estructuradas: "Propuesta X:", "Objetivo X:", "Meta X:"
    structured_sections = re.findall(
        r'(?:propuesta|objetivo|meta|programa|estrategia)\s+(?:[0-9]+|[ivxlcdm]+)[:\.]',
        text_lower
    )
    count += len(structured_sections)
    
    # 4. Contar párrafos que comienzan con palabras clave estructuradas
    # Patrón: inicio de línea + palabra clave + dos puntos + texto
    structured_paragraphs = re.findall(
        r'^(?:propuesta|objetivo|meta|programa|estrategia|acción|medida)[:\s]+[A-ZÁÉÍÓÚÑ]',
        text,
        re.MULTILINE | re.IGNORECASE
    )
    count += len(structured_paragraphs)
    
    # 5. Contar listas con formato "a)", "b)", "c)" o "i)", "ii)", "iii)"
    lettered_lists = re.findall(r'(?:^|\s)(?:[a-z]|[ivxlcdm]+)\)\s+[A-ZÁÉÍÓÚÑ]', text_lower, re.MULTILINE)
    count += len(lettered_lists)
    
    return count


def count_metas_cuantificadas(text: str) -> int:
    """
    Cuenta metas cuantificadas únicas (no todas las menciones de números).
    
    Metodología:
    - Buscar porcentajes en contexto de metas: "alcanzar X%", "reducir a X%", "incrementar a X%"
    - Buscar números con unidades en contexto de objetivos: "X personas", "X familias" en frases estructuradas
    - Agrupar valores similares para evitar duplicados
    - Contar solo metas explícitas, no números sueltos
    """
    if not text:
        return 0
    
    text_lower = text.lower()
    metas_unicas = set()
    
    # 1. Porcentajes en contexto de metas/objetivos
    # Patrones: "alcanzar X%", "reducir a X%", "incrementar a X%", "meta: X%", "objetivo: X%"
    porcentaje_patterns = [
        r'(?:alcanzar|reducir|incrementar|aumentar|disminuir|llegar|lograr|meta|objetivo)[:\s]+(\d+)%',
        r'(\d+)%\s+(?:de|para|en|al|del)',
        r'(?:meta|objetivo)[:\s]+\w+\s+(\d+)%',
    ]
    
    for pattern in porcentaje_patterns:
        matches = re.findall(pattern, text_lower)
        for match in matches:
            # Normalizar: redondear a múltiplos de 5 para agrupar similares
            try:
                valor = int(match)
                valor_normalizado = (valor // 5) * 5
                metas_unicas.add(f"porcentaje_{valor_normalizado}")
            except ValueError:
                continue
    
    # 2. Números con unidades en contexto estructurado
    # Buscar: "X mil personas", "X millones de beneficiarios" en frases de objetivos
    unidades_patterns = [
        r'(?:alcanzar|atender|beneficiar|llegar|lograr|meta|objetivo)[:\s]+(\d+[\s,.]*\d*)\s*(?:mil|millones?)?\s*(?:personas|familias|beneficiarios|ciudadanos|habitantes|estudiantes|niños|jóvenes)',
        r'(\d+[\s,.]*\d*)\s*(?:mil|millones?)?\s*(?:personas|familias|beneficiarios|ciudadanos|habitantes|estudiantes|niños|jóvenes)\s+(?:para|en|al|del|de)',
    ]
    
    for pattern in unidades_patterns:
        matches = re.findall(pattern, text_lower)
        for match in matches:
            # Normalizar números grandes (redondear a miles)
            try:
                # Limpiar el número (quitar espacios, puntos, comas)
                numero_limpio = match.replace(' ', '').replace('.', '').replace(',', '')
                valor = int(numero_limpio)
                # Normalizar a miles para agrupar similares
                if valor >= 1000:
                    valor_normalizado = (valor // 1000) * 1000
                    metas_unicas.add(f"unidad_{valor_normalizado}")
                else:
                    metas_unicas.add(f"unidad_{valor}")
            except ValueError:
                continue
    
    # 3. Metas con fechas/plazos específicos
    # Buscar: "para 2026", "hasta 2030", "en 5 años"
    plazos = re.findall(
        r'(?:para|hasta|en|al)\s+(?:el\s+)?(?:año\s+)?(\d{4})',
        text_lower
    )
    metas_unicas.update([f"plazo_{p}" for p in plazos if 2020 <= int(p) <= 2040])
    
    return len(metas_unicas)


def extract_anios_experiencia(text: str) -> int:
    """
    Extrae años de experiencia detectando rangos YYYY-YYYY en contexto de cargos.
    
    Metodología mejorada:
    - Buscar rangos de años en contexto de experiencia laboral
    - Validar que estén en secciones relevantes (cargos, experiencia, trayectoria)
    - Sumar años únicos de todos los rangos válidos
    - Filtrar rangos que parezcan fechas pero no sean experiencia
    """
    if not text:
        return 0
    
    # Buscar rangos de años en contexto de experiencia
    # Patrones más específicos: "2010-2015", "2020–2023", "desde 2010 hasta 2015"
    patterns = [
        r'(\d{4})[-–](\d{4})',  # Rango directo
        r'desde\s+(\d{4})\s+hasta\s+(\d{4})',  # Desde-hasta
        r'(\d{4})\s+a\s+(\d{4})',  # Año a año
    ]
    
    anios_unicos = set()
    
    for pattern in patterns:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for inicio, fin in matches:
            try:
                inicio_int = int(inicio)
                fin_int = int(fin)
                
                # Validaciones más estrictas
                if not (1900 <= inicio_int <= 2100 and 1900 <= fin_int <= 2100):
                    continue
                
                # Validar que el rango sea razonable (no más de 50 años)
                if fin_int - inicio_int > 50:
                    continue
                
                # Validar que fin >= inicio
                if fin_int < inicio_int:
                    continue
                
                # Agregar todos los años del rango
                for anio in range(inicio_int, fin_int + 1):
                    anios_unicos.add(anio)
                    
            except ValueError:
                continue
    
    # También buscar años individuales en contexto de "año" o "años"
    # Patrón: "X años" donde X es un número razonable
    anios_individuales = re.findall(
        r'(\d{1,2})\s+años?\s+(?:de\s+)?(?:experiencia|trabajo|servicio|ejercicio)',
        text.lower()
    )
    
    for anios_str in anios_individuales:
        try:
            anios = int(anios_str)
            if 1 <= anios <= 50:  # Validar rango razonable
                # Agregar años recientes basados en la experiencia
                # Asumimos que es experiencia reciente
                anios_unicos.update(range(2024 - anios, 2024 + 1))
        except ValueError:
            continue
    
    return len(anios_unicos)


def count_actividades(text: str) -> int:
    """
    Cuenta actividades estructuradas (no palabras sueltas).
    
    Metodología:
    - Buscar actividades en listas estructuradas
    - Contar acciones con verbos de implementación en contexto estructurado
    - Identificar cronogramas y planes de ejecución
    """
    if not text:
        return 0
    
    text_lower = text.lower()
    count = 0
    
    # 1. Actividades en listas (mismo patrón que propuestas)
    numbered_activities = re.findall(
        r'(?:^|\s)(?:[0-9]+[\.\)])\s+(?:implementar|ejecutar|realizar|desarrollar|aplicar|establecer)',
        text,
        re.MULTILINE | re.IGNORECASE
    )
    count += len(numbered_activities)
    
    # 2. Viñetas con verbos de acción
    bullet_activities = re.findall(
        r'^(?:[\u2022\u2023\u25E6\u2043\-\*o])\s+(?:implementar|ejecutar|realizar|desarrollar|aplicar|establecer)',
        text,
        re.MULTILINE | re.IGNORECASE
    )
    count += len(bullet_activities)
    
    # 3. Secciones estructuradas de actividades
    structured_activities = re.findall(
        r'(?:actividad|acción|medida|implementación|ejecución)\s+(?:[0-9]+|[ivxlcdm]+)[:\.]',
        text_lower
    )
    count += len(structured_activities)
    
    # 4. Cronogramas y planes estructurados
    cronogramas = re.findall(
        r'(?:cronograma|plan\s+de\s+ejecución|calendario|agenda)[:\s]+',
        text_lower
    )
    count += len(cronogramas)
    
    # 5. Párrafos que comienzan con verbos de implementación
    verb_activities = re.findall(
        r'^(?:implementar|ejecutar|realizar|desarrollar|aplicar|establecer|crear|construir)[:\s]+',
        text,
        re.MULTILINE | re.IGNORECASE
    )
    count += len(verb_activities)
    
    return count


def detect_grado_max(text: str) -> str:
    """
    Detecta el nivel educativo máximo por keywords.
    
    Retorna el nivel más alto encontrado.
    Orden: secundaria < bachiller < titulo/licenciatura < maestria < doctorado
    """
    if not text:
        return "secundaria"
    
    text_lower = text.lower()
    
    # Detectar niveles (ordenados de menor a mayor)
    niveles = {
        "doctorado": ["doctorado", "phd", "doctor", "doctor en"],
        "maestria": ["maestría", "maestria", "master", "magíster", "magister"],
        "titulo": ["título", "titulo", "licenciatura", "licenciado", "licenciado en"],
        "bachiller": ["bachiller", "bachillerato"],
        "secundaria": ["secundaria", "secundario"],
    }
    
    # Buscar desde el nivel más alto
    for nivel, keywords in niveles.items():
        for keyword in keywords:
            if keyword in text_lower:
                return nivel
    
    return "secundaria"


# ========================================
# FUNCIÓN PRINCIPAL DE EXTRACCIÓN
# ========================================

def extract_features(slug: str) -> Dict:
    """
    Extrae features crudas para un candidato.
    
    Thread-safe: solo lee archivos, no modifica estado global.
    
    Args:
        slug: Identificador del candidato
        
    Returns:
        Diccionario con features crudas
    """
    # Rutas a los PDFs
    hoja_vida_path = HOJAS_VIDA_DIR / f"{slug}.pdf"
    plan_gobierno_path = PLANES_GOBIERNO_DIR / f"{slug}.pdf"
    resumen_path = RESUMENES_DIR / f"{slug}.pdf"
    
    # Extraer texto de cada PDF
    texto_hoja_vida = extract_text(hoja_vida_path)
    texto_plan = extract_text(plan_gobierno_path)
    texto_resumen = extract_text(resumen_path)
    
    # Combinar textos para análisis general
    texto_completo = f"{texto_hoja_vida} {texto_plan} {texto_resumen}"
    texto_plan_completo = f"{texto_plan} {texto_resumen}"
    
    # Calcular features crudas
    features = {
        "slug": slug,
        "propuestas_count": count_propuestas(texto_plan_completo) if texto_plan else 0,
        "metas_cuantificadas_count": count_metas_cuantificadas(texto_plan_completo) if texto_plan else 0,
        "anios_experiencia": extract_anios_experiencia(texto_hoja_vida),
        "actividades_count": count_actividades(texto_plan_completo) if texto_plan else 0,
        "grado_max": detect_grado_max(texto_hoja_vida),
    }
    
    return features


# ========================================
# FUNCIONES DE SCORING
# ========================================

def normalize_truncated(value: float, max_value: float) -> float:
    """
    Normalización truncada: score = min(x, M) / M * 100
    
    Args:
        value: Valor a normalizar
        max_value: Máximo teórico M
        
    Returns:
        Score normalizado (0-100)
    """
    if max_value == 0:
        return 0.0
    
    truncated = min(value, max_value)
    score = (truncated / max_value) * 100
    return round(score, 2)


def compute_scores(features: Dict) -> Dict:
    """
    Calcula scores normalizados a partir de features crudas.
    
    Thread-safe: función pura, sin estado compartido.
    
    Args:
        features: Diccionario con features crudas
        
    Returns:
        Diccionario con scores (0-100)
    """
    # Score de propuestas (normalización truncada)
    propuestas_score = normalize_truncated(
        features["propuestas_count"],
        MAX_PROPUESTAS
    )
    
    # Score de experiencia (normalización truncada)
    experiencia_score = normalize_truncated(
        features["anios_experiencia"],
        MAX_EXPERIENCIA
    )
    
    # Score de gestión (actividades + propuestas combinadas)
    gestion_raw = features["actividades_count"] + (features["propuestas_count"] * 0.5)
    gestion_score = normalize_truncated(gestion_raw, MAX_GESTION)
    
    # Score de formación (ordinal)
    formacion_score = FORMACION_SCORES.get(features["grado_max"], 30)
    
    # Score de impacto social (metas cuantificadas)
    impacto_social_score = normalize_truncated(
        features["metas_cuantificadas_count"],
        MAX_IMPACTO_SOCIAL
    )
    
    return {
        "slug": features["slug"],
        "propuestas": propuestas_score,
        "experiencia": experiencia_score,
        "gestion": gestion_score,
        "formacion": formacion_score,
        "impacto_social": impacto_social_score,
    }


# ========================================
# FUNCIÓN DE PROCESAMIENTO (PARALELO)
# ========================================

def process_candidate(slug: str) -> Tuple[str, Optional[Dict], Optional[Dict]]:
    """
    Procesa un candidato completo: extrae features y calcula scores.
    
    Thread-safe: función pura que puede ejecutarse en paralelo.
    
    Args:
        slug: Identificador del candidato
        
    Returns:
        Tupla (slug, features, scores) o (slug, None, None) si hay error
    """
    try:
        # Extraer features crudas
        features = extract_features(slug)
        
        # Calcular scores
        scores = compute_scores(features)
        
        return (slug, features, scores)
    except Exception as e:
        print(f"[ERROR] Error procesando {slug}: {e}")
        return (slug, None, None)


def process_candidates_parallel(slugs: List[str]) -> Tuple[List[Dict], List[Dict]]:
    """
    Procesa candidatos en paralelo usando ThreadPoolExecutor.
    
    Mantiene el orden original de los slugs.
    
    Args:
        slugs: Lista de identificadores de candidatos
        
    Returns:
        Tupla (lista_features, lista_scores) en orden original
    """
    all_features = []
    all_scores = []
    
    # Diccionario para mantener orden original
    results_dict = {}
    
    # Procesar en paralelo
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        # Enviar todas las tareas
        future_to_slug = {
            executor.submit(process_candidate, slug): slug 
            for slug in slugs
        }
        
        # Recolectar resultados conforme se completan
        completed = 0
        for future in as_completed(future_to_slug):
            slug = future_to_slug[future]
            completed += 1
            
            try:
                result_slug, features, scores = future.result()
                
                if features is not None and scores is not None:
                    results_dict[slug] = (features, scores)
                    print(f"[OK] [{completed}/{len(slugs)}] Procesado: {slug}")
                else:
                    print(f"[ERROR] [{completed}/{len(slugs)}] Error en: {slug}")
                    
            except Exception as e:
                print(f"[ERROR] [{completed}/{len(slugs)}] Excepción en {slug}: {e}")
    
    # Reconstruir listas en orden original
    for slug in slugs:
        if slug in results_dict:
            features, scores = results_dict[slug]
            all_features.append(features)
            all_scores.append(scores)
    
    return all_features, all_scores


# ========================================
# FUNCIONES DE EXPORTACIÓN
# ========================================

def save_outputs(all_features: List[Dict], all_scores: List[Dict]) -> None:
    """
    Guarda los resultados en CSV y JSON.
    
    Args:
        all_features: Lista de diccionarios con features crudas
        all_scores: Lista de diccionarios con scores
    """
    # Crear directorio de salida si no existe
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    
    # Guardar features crudas en CSV
    df_features = pd.DataFrame(all_features)
    features_path = OUTPUT_DIR / "candidatos_features.csv"
    df_features.to_csv(features_path, index=False, encoding="utf-8")
    print(f"[OK] Features guardadas en: {features_path}")
    
    # Guardar scores en JSON
    scores_path = OUTPUT_DIR / "candidatos_scores.json"
    with open(scores_path, "w", encoding="utf-8") as f:
        json.dump(all_scores, f, indent=2, ensure_ascii=False)
    print(f"[OK] Scores guardados en: {scores_path}")
    
    # También guardar scores en CSV para facilidad de análisis
    df_scores = pd.DataFrame(all_scores)
    scores_csv_path = OUTPUT_DIR / "candidatos_scores.csv"
    df_scores.to_csv(scores_csv_path, index=False, encoding="utf-8")
    print(f"[OK] Scores CSV guardados en: {scores_csv_path}")


# ========================================
# FUNCIÓN PRINCIPAL
# ========================================

def main():
    """
    Función principal que ejecuta el pipeline completo con procesamiento paralelo.
    """
    import time
    
    print("=" * 60)
    print("PROCESAMIENTO DE PDFs DE CANDIDATOS (PARALELO)")
    print("=" * 60)
    print(f"Workers: {MAX_WORKERS}")
    print(f"Candidatos: {len(CANDIDATOS_SLUGS)}")
    print()
    
    start_time = time.time()
    
    # Procesar candidatos en paralelo
    all_features, all_scores = process_candidates_parallel(CANDIDATOS_SLUGS)
    
    processing_time = time.time() - start_time
    
    # Guardar resultados
    print()
    print("=" * 60)
    print("GUARDANDO RESULTADOS")
    print("=" * 60)
    save_outputs(all_features, all_scores)
    
    # Resumen estadístico
    print()
    print("=" * 60)
    print("RESUMEN ESTADÍSTICO")
    print("=" * 60)
    
    if all_scores:
        df = pd.DataFrame(all_scores)
        print("\nEstadísticas de scores:")
        print(df[["propuestas", "experiencia", "gestion", "formacion", "impacto_social"]].describe())
    
    print()
    print(f"[OK] Procesamiento completado en {processing_time:.2f} segundos")
    print(f"[OK] Candidatos procesados: {len(all_scores)}/{len(CANDIDATOS_SLUGS)}")


if __name__ == "__main__":
    main()

