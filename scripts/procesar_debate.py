"""
Procesa debate_presidencial_2026_identificado.json y genera public/data/debate_stats.json
para la sección de debate de Observa Perú.

Uso: python scripts/procesar_debate.py
"""

import json
import os
import unicodedata
from collections import defaultdict


def normalize(text: str) -> str:
    """Elimina acentos y pasa a minusculas para matching robusto."""
    return "".join(
        c for c in unicodedata.normalize("NFD", text.lower())
        if unicodedata.category(c) != "Mn"
    )

# ─── Rutas ──────────────────────────────────────────────────────────────────
INPUT_FILE = r"C:\Users\Asd\Downloads\debate_presidencial_2026_identificado.json"
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "..", "public", "data", "debate_stats.json")

# ─── Candidatos ─────────────────────────────────────────────────────────────
CANDIDATOS = [
    {"key": "alex_gonzalez",     "nombre": "Alex Gonzalez Castillo",   "partido": "Partido Democrata Verde",  "speaker": "Alex Gonzalez Castillo (Partido Democrata Verde)"},
    {"key": "carlos_alvarez",    "nombre": "Carlos Alvarez Loaiza",    "partido": "Pais para Todos",          "speaker": "Carlos Alvarez Loaiza (Pais para Todos)"},
    {"key": "cesar_acuna",       "nombre": "Cesar Acuna Peralta",      "partido": "Alianza para el Progreso", "speaker": "Cesar Acuna Peralta (Alianza para el Progreso)"},
    {"key": "fernando_oliveira", "nombre": "Fernando Oliveira Vega",   "partido": "Frente de la Esperanza",  "speaker": "Fernando Oliveira Vega (Frente de la Esperanza)"},
    {"key": "johnny_lescano",    "nombre": "Johnny Lescano",           "partido": "Cooperacion Popular",     "speaker": "Johnny Lescano (Cooperacion Popular)"},
    {"key": "jose_luna",         "nombre": "Jose Luna Galvez",         "partido": "Podemos Peru",            "speaker": "Jose Luna Galvez (Podemos Peru)"},
    {"key": "jose_williams",     "nombre": "Jose Williams Zapata",     "partido": "Avanza Pais",             "speaker": "Jose Williams Zapata (Avanza Pais)"},
    {"key": "marisol_perez",     "nombre": "Marisol Perez Tello",      "partido": "Primero la Gente",        "speaker": "Marisol Perez Tello (Primero la Gente)"},
    {"key": "pablo_lopez",       "nombre": "Pablo Alfonso Lopez Chao", "partido": "Ahora Nacion",            "speaker": "Pablo Alfonso Lopez Chao (Ahora Nacion)"},
    {"key": "lopez_aliaga",      "nombre": "Rafael Lopez Aliaga",      "partido": "Renovacion Popular",      "speaker": "Rafael Lopez Aliaga (Renovacion Popular)"},
    {"key": "wolfgang_grosso",   "nombre": "Wolfgang Grosso",          "partido": "Integridad Democratica",  "speaker": "Wolfgang Grosso (Integridad Democratica)"},
]
SPEAKER_TO_KEY = {c["speaker"]: c["key"] for c in CANDIDATOS}
KEY_TO_CAND = {c["key"]: c for c in CANDIDATOS}

NON_CANDIDATES = {
    "Claudia Quiroga (Conductora JNE)",
    "Fernando (Conductor JNE)",
    "Narrador",
    "Periodista (TV Peru)",
    "Ricardo (TV Peru)",
}

# ─── Keywords ────────────────────────────────────────────────────────────────
ATTACK_KW = [
    "corrupto", "corrupcion", "ladron", "ladrón", "mentira", "mentiroso", "mentirosa",
    "criminal", "delincuente", "fracasado", "fracaso", "incapaz", "irresponsable",
    "escandalo", "escándalo", "investigado", "cuestionado", "no ha hecho", "no hizo",
    "no cumplió", "no cumplio", "ha robado", "robar", "robo", "mienten", "mentiras",
    "su gobierno", "su gestion", "su gestión", "lo que no hizo", "impunidad",
    "narcotráfico", "narcotrafico", "crimen organizado", "organización criminal",
    "organizacion criminal", "testaferro", "perjurio", "cinismo",
]

PROPOSAL_KW = [
    "propongo", "vamos a", "implementaremos", "planteo", "mi propuesta", "haremos",
    "crearemos", "estableceremos", "derogaremos", "garantizaremos", "nos comprometemos",
    "proponemos", "implementaré", "implementare", "construiremos", "crearemos",
    "refundaremos", "reorganizaremos", "digitalizaremos", "aumentaremos",
    "reduciremos", "eliminaremos", "reformaremos",
]

TOPIC_KW = {
    "seguridad": ["policia", "policía", "crimen", "delito", "extorsion", "extorsión",
                  "sicario", "homicidio", "matar", "robar", "banda", "seguridad ciudadana",
                  "crimen organizado", "narcotráfico", "narcotrafico", "serenazgo",
                  "pandilla", "terrorismo", "terrorista"],
    "economia":  ["economia", "economía", "empleo", "trabajo", "inversion", "inversión",
                  "sueldo", "pbi", "presupuesto", "empresa", "crecimiento", "salario",
                  "deuda", "inflacion", "inflación", "exportacion", "exportación",
                  "importacion", "importación", "aranceles", "mineria", "minería",
                  "industria", "industrializacion", "industrialización"],
    "corrupcion": ["corrupcion", "corrupción", "corrupto", "impunidad", "fiscal",
                   "justicia", "transparencia", "ladron", "ladrón", "robar", "robo",
                   "rendicion de cuentas", "anticorrupcion", "anticorrupción",
                   "contraloría", "contraloria", "auditoria", "auditoría"],
    "educacion": ["educacion", "educación", "colegio", "universidad", "maestro",
                  "alumno", "escuela", "becas", "curriculum", "currículo",
                  "docente", "profesor", "estudiante", "pedagogia", "pedagogía"],
    "salud":     ["salud", "hospital", "medico", "médico", "enfermero", "seguro",
                  "essalud", "medicina", "clinica", "clínica", "paciente",
                  "cobertura medica", "cobertura médica", "sis", "farmacia",
                  "pandemia", "vacuna"],
    "estado":    ["gobierno", "estado", "congreso", "municipio", "región", "region",
                  "descentralizacion", "descentralización", "instituciones",
                  "constitucion", "constitución", "democracia", "republica",
                  "república", "poder ejecutivo", "poder judicial", "ministerio",
                  "burocracia", "reforma del estado"],
}

# ─── Nombres para detección de menciones (sin acentos, ya normalizados) ─────
# Verificado contra el transcript real del debate 23/03/2026
MENTION_KW = {
    "alex_gonzalez":     ["alex gonzalez", "gonzalez castillo", "democrata verde", "vota verde"],
    "carlos_alvarez":    ["carlos alvarez", "alvarez loaiza", "pais para todos", "montesinos"],
    "cesar_acuna":       ["cesar acuna", "acuna", "alianza para el progreso"],
    "fernando_oliveira": ["fernando oliveira", "oliveira vega", "frente de la esperanza", "señor oliveira", "senor oliveira"],
    "johnny_lescano":    ["johnny lescano", "lescano", "cooperacion popular"],
    "jose_luna":         ["jose luna", "luna galvez", "podemos peru"],
    "jose_williams":     ["jose williams", "williams zapata", "avanza pais"],
    "marisol_perez":     ["marisol perez", "perez tello", "primero la gente"],
    "pablo_lopez":       ["pablo lopez", "lopez chao", "ahora nacion", "pablo escobar del norte"],
    "lopez_aliaga":      ["lopez aliaga", "senor aliaga", "señor aliaga", "senora aliaga"],
    "wolfgang_grosso":   ["wolfgang grosso", "integridad democratica"],
    # "grosso" solo no se usa porque en español "grosso" es adjetivo coloquial
}


def parse_time(t: str) -> float:
    parts = t.split(":")
    h = int(parts[0])
    m = int(parts[1])
    s = float(parts[2]) if len(parts) > 2 else 0.0
    return h * 3600 + m * 60 + s


def fmt_time(secs: float) -> str:
    m = int(secs // 60)
    s = int(secs % 60)
    return f"{m}m {s:02d}s"


def has_kw(text: str, keywords: list) -> bool:
    return any(kw in text for kw in keywords)


def topic_score(text: str, keywords: list) -> float:
    return 1.0 if any(kw in text for kw in keywords) else 0.0


def main():
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        data = json.load(f)

    segments = data["segments"]
    meta = data["metadata"]

    # Pre-normalizar keywords una vez
    attack_kw_n  = [normalize(k) for k in ATTACK_KW]
    proposal_kw_n = [normalize(k) for k in PROPOSAL_KW]
    topic_kw_n   = {t: [normalize(k) for k in kws] for t, kws in TOPIC_KW.items()}
    mention_kw_n = {t: [normalize(k) for k in kws] for t, kws in MENTION_KW.items()}

    # ── Acumuladores ────────────────────────────────────────────────────────
    tiempo         = defaultdict(float)
    palabras       = defaultdict(int)
    intervs        = defaultdict(int)
    ataque_segs    = defaultdict(int)   # segmentos con ataque (exclusivo: ataque > propuesta)
    propuesta_segs = defaultdict(int)   # segmentos con propuesta (sin ataque)
    neutro_segs    = defaultdict(int)   # ninguno de los dos
    topic_hits     = {k: defaultdict(int) for k in TOPIC_KW}
    interrups      = defaultdict(int)
    mention_matrix = defaultdict(lambda: defaultdict(int))  # from → to → count

    for i, seg in enumerate(segments):
        spk = seg["speaker"]
        key = SPEAKER_TO_KEY.get(spk)
        if key is None:
            continue

        dur = max(0.0, parse_time(seg["end"]) - parse_time(seg["start"]))
        text = seg["text"]
        textn = normalize(text)  # sin acentos, minusculas

        tiempo[key] += dur
        palabras[key] += len(text.split())
        intervs[key] += 1

        # Clasificación mutuamente exclusiva: ataque tiene prioridad
        is_ataque   = has_kw(textn, attack_kw_n)
        is_propuesta = has_kw(textn, proposal_kw_n)

        if is_ataque:
            ataque_segs[key] += 1
        elif is_propuesta:
            propuesta_segs[key] += 1
        else:
            neutro_segs[key] += 1

        for topic, kws in topic_kw_n.items():
            if topic_score(textn, kws) > 0:
                topic_hits[topic][key] += 1

        # Interrupciones: habla directo después de otro candidato
        if i > 0:
            prev_spk = segments[i - 1]["speaker"]
            prev_key = SPEAKER_TO_KEY.get(prev_spk)
            if prev_key is not None and prev_key != key:
                interrups[key] += 1

        # Menciones directas a otros candidatos (texto normalizado)
        for target_key, kws in mention_kw_n.items():
            if target_key == key:
                continue
            if any(kw in textn for kw in kws):
                mention_matrix[key][target_key] += 1

    # ── Red de ataques: solo menciones que ocurren en segmentos agresivos ────
    red_ataques = []
    for from_key, targets in mention_matrix.items():
        for to_key, count in targets.items():
            if count > 0:
                red_ataques.append({"from": from_key, "to": to_key, "count": count})

    # Candidatos agresivos sin ataques directos nominales → atacan al "sistema"
    keys_with_direct = {e["from"] for e in red_ataques}
    for c in CANDIDATOS:
        k = c["key"]
        if k not in keys_with_direct and ataque_segs[k] >= 3:
            red_ataques.append({"from": k, "to": "sistema", "count": ataque_segs[k]})

    # ── Construir candidatos output ──────────────────────────────────────────
    candidatos_out = []
    for c in CANDIDATOS:
        k = c["key"]
        total_segs = intervs[k]
        t_seg = tiempo[k]
        atk_pct   = round(ataque_segs[k]    / total_segs * 100, 1) if total_segs else 0
        prop_pct  = round(propuesta_segs[k] / total_segs * 100, 1) if total_segs else 0
        neutr_pct = round(neutro_segs[k]    / total_segs * 100, 1) if total_segs else 0

        # Normalizar temas: % de sus segmentos que toca cada tema
        temas = {}
        for topic in TOPIC_KW:
            temas[topic] = round(topic_hits[topic][k] / total_segs, 3) if total_segs else 0

        # Menciones recibidas
        mencionado_por = sum(
            1 for from_key in mention_matrix
            if mention_matrix[from_key].get(k, 0) > 0
        )

        candidatos_out.append({
            "key":                k,
            "nombre":             c["nombre"],
            "partido":            c["partido"],
            "tiempoSegundos":     round(t_seg, 1),
            "tiempoLabel":        fmt_time(t_seg),
            "palabrasTotales":    palabras[k],
            "intervenciones":     total_segs,
            "promSegPorInterv":   round(t_seg / total_segs, 1) if total_segs else 0,
            "porcentajeAtaque":   atk_pct,
            "porcentajePropuesta": prop_pct,
            "porcentajeNeutro":   neutr_pct,
            "temas":              temas,
            "mencionadoPor":      mencionado_por,
            "interrupciones":     interrups[k],
        })

    # Ordenar por tiempo de habla descendente
    candidatos_out.sort(key=lambda x: -x["tiempoSegundos"])

    # ── Output final ─────────────────────────────────────────────────────────
    output = {
        "metadata": {
            "fecha":            "2026-03-23",
            "jornada":          "Primera jornada",
            "candidatos":       len(CANDIDATOS),
            "segmentos":        meta["segment_count"],
            "duracionSegundos": round(meta["duration_seconds"]),
            "duracionLabel":    fmt_time(meta["duration_seconds"]),
        },
        "candidatos": candidatos_out,
        "redAtaques":  red_ataques,
    }

    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Generado: {OUTPUT_FILE}")
    print(f"  {len(candidatos_out)} candidatos procesados")
    print(f"  {len(red_ataques)} conexiones en red de ataques")
    for c in candidatos_out:
        print(f"  {c['nombre']:<30} {c['tiempoLabel']:>10}  ataques:{c['porcentajeAtaque']:5.1f}%  propuestas:{c['porcentajePropuesta']:5.1f}%")


if __name__ == "__main__":
    main()
