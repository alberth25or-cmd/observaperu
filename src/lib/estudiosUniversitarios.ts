/**
 * Limpieza, variables analíticas y KPIs para estudios universitarios de candidatos.
 * Observa Perú – transparencia electoral.
 */

const NO_ENCONTRADO = "No se encontró";
const INVALID_GRADO = /¿CUENTA CON ESTUDIOS|SÍ NO|^\s*$/i;

// ─── Normalización de universidades ─────────────────────────────────────────
function normalizeUniversidad(name: string): string {
  if (!name || name === NO_ENCONTRADO) return "";
  let s = name
    .replace(/\s+S\.A\.C\.?$/i, "")
    .replace(/\s+S\.A\.?$/i, "")
    .replace(/\s+ASOCIACI[OÓ]N CIVIL\s*$/i, "")
    .trim();
  // Unificar variantes conocidas
  if (/SAN MARTIN DE PORRES/i.test(s) && !/SAN MARTÍN/i.test(s))
    s = s.replace(/SAN MARTIN/i, "SAN MARTÍN");
  if (/INGENIERIA\b/i.test(s) && !/INGENIERÍA/i.test(s))
    s = s.replace(/INGENIERIA\b/i, "INGENIERÍA");
  return s.trim();
}

// ─── Corrección de grado/título ──────────────────────────────────────────────
function normalizeGrado(grado: string): string {
  if (!grado || grado === NO_ENCONTRADO) return "";
  if (INVALID_GRADO.test(grado)) return "";
  return grado.replace(/BACHIYER/gi, "BACHILLER").trim();
}

// ─── Tipo de universidad ────────────────────────────────────────────────────
const PUBLICAS =
  /NACIONAL|MAYOR DE SAN MARCOS|DEL CALLAO|UNIVERSIDAD NACIONAL/i;
const MILITAR = /MILITAR|CHORRILLOS|FUERZA AÉREA|OFICIALES.*PERÚ|BOLOGNESI/i;
const EXTRANJERA_LIST = [
  "BOSTON UNIVERSITY",
  "INSTITUTO SUPERIOR DE CIENCIAS MÉDICAS DE CAMAGUEY",
];

function getTipoUniversidad(
  normalizedName: string,
): "Pública" | "Privada" | "Militar" | "Extranjera" {
  if (!normalizedName) return "Privada"; // fallback para evitar vacío
  const upper = normalizedName.toUpperCase();
  if (MILITAR.test(upper)) return "Militar";
  if (EXTRANJERA_LIST.some((e) => upper.includes(e))) return "Extranjera";
  if (PUBLICAS.test(upper)) return "Pública";
  return "Privada";
}

// ─── Área profesional (por grado/título) ────────────────────────────────────
function getAreaProfesional(grado: string): string {
  const g = (grado || "").toUpperCase();
  if (/\bDERECHO\b|ABOGADO|ABOGADA/.test(g)) return "Derecho";
  if (/\bECONOM[ÍI]A|ECONOMISTA/.test(g)) return "Economía";
  if (/\bINGENIER[ÍI]A|INGENIERO|INGENIERA/.test(g)) return "Ingeniería";
  if (/\bADMINISTRACI[OÓ]N|ADMIN\b/.test(g)) return "Administración";
  if (/\bMEDICINA|MÉDICO|NEUROCIRUGÍA|DOCTOR EN MEDICINA/.test(g))
    return "Medicina";
  if (/\bMILITAR|AEROESPACIAL|CHORRILLOS/.test(g)) return "Militar";
  if (/\bEDUCACI[OÓ]N|EDUCADOR/.test(g)) return "Educación";
  if (/\bPSICOLOG[ÍI]A|PSICÓLOGO|PSICOLOGO/.test(g)) return "Psicología";
  if (/\bCONTADOR|CONTABILIDAD|CONTADUR/.test(g)) return "Contabilidad";
  if (/\bSOCIOLOG/.test(g)) return "Sociología";
  if (g.length > 0) return "Otros";
  return "";
}

// ─── Nivel máximo (por concluidos + grado) ───────────────────────────────────
function nivelOrden(nivel: string): number {
  if (/ESPECIALISTA|MAESTR[ÍI]A|DOCTOR|POSGRADO/i.test(nivel)) return 4;
  if (
    /TÍTULO|TITULO|ABOGADO|INGENIERO|LICENCIADO|ECONOMISTA|CONTADOR|PSICÓLOGO|MÉDICO/i.test(
      nivel,
    )
  )
    return 3;
  if (/BACHILLER/i.test(nivel)) return 2;
  return 1; // No concluido
}

function getNivelMaximo(
  c1: string,
  g1: string,
  c2: string,
  g2: string,
): "No concluido" | "Bachiller" | "Título profesional" | "Especialidad" {
  const concluidos = [c1, c2].filter((c) => c === "Concluido");
  const grados = [normalizeGrado(g1), normalizeGrado(g2)].filter(Boolean);
  if (concluidos.length === 0 && grados.length === 0) return "No concluido";
  let max = 0;
  if (concluidos.length > 0) {
    for (const g of grados) max = Math.max(max, nivelOrden(g));
    if (max === 0) max = 1; // concluido pero sin grado claro
  }
  if (max >= 4) return "Especialidad";
  if (max === 3) return "Título profesional";
  if (max === 2) return "Bachiller";
  return "No concluido";
}

// ─── Registro enriquecido ───────────────────────────────────────────────────
export interface EstudioEnriquecido {
  slug: string;
  tiene_estudios: string;
  universidad_principal: string;
  tipo_universidad: "Pública" | "Privada" | "Militar" | "Extranjera";
  area_profesional: string;
  nivel_maximo:
    | "No concluido"
    | "Bachiller"
    | "Título profesional"
    | "Especialidad";
  tiene_estudios_concluidos: 0 | 1;
  sin_datos: boolean;
}

export interface EstudiosKPIs {
  totalCandidatos: number;
  conDatos: number;
  sinDatos: number;
  totalConArea: number;
  pctConcluidos: number;
  pctSinInfo: number;
  pctPorTipo: Record<string, number>;
  pctPorArea: Record<string, number>;
  pctPorNivel: Record<string, number>;
  top10Universidades: Array<{ nombre: string; count: number; pct: number }>;
  hhi: number;
  entropiaAreas: number;
}

export function enriquecerEstudios(
  data: Array<{
    slug?: string;
    tiene_estudios?: string;
    estudio1_universidad?: string;
    estudio1_grado_titulo?: string;
    estudio1_concluidos?: string;
    estudio1_egresado?: string;
    estudio2_universidad?: string;
    estudio2_grado_titulo?: string;
    estudio2_concluidos?: string;
    estudio2_egresado?: string;
  }>,
): EstudioEnriquecido[] {
  return data.map((row) => {
    const u1 = (row.estudio1_universidad ?? "").trim();
    const u2 = (row.estudio2_universidad ?? "").trim();
    const noEncontrado =
      u1 === NO_ENCONTRADO || (row.tiene_estudios ?? "") === NO_ENCONTRADO;
    const univ1Norm = normalizeUniversidad(u1);
    const universidad_principal = univ1Norm || normalizeUniversidad(u2) || "";
    const tipo_universidad = getTipoUniversidad(universidad_principal);
    const g1 = row.estudio1_grado_titulo ?? "";
    const g2 = row.estudio2_grado_titulo ?? "";
    const area_profesional =
      getAreaProfesional(g1) || getAreaProfesional(g2) || "";
    const nivel_maximo = getNivelMaximo(
      row.estudio1_concluidos ?? "",
      g1,
      row.estudio2_concluidos ?? "",
      g2,
    );
    const concluido1 = (row.estudio1_concluidos ?? "") === "Concluido";
    const concluido2 = (row.estudio2_concluidos ?? "") === "Concluido";
    const tiene_estudios_concluidos = noEncontrado
      ? 0
      : concluido1 || concluido2
        ? 1
        : 0;

    return {
      slug: row.slug ?? "",
      tiene_estudios: row.tiene_estudios ?? "",
      universidad_principal,
      tipo_universidad,
      area_profesional,
      nivel_maximo,
      tiene_estudios_concluidos: tiene_estudios_concluidos as 0 | 1,
      sin_datos: noEncontrado,
    };
  });
}

export function calcularKPIs(enriquecidos: EstudioEnriquecido[]): EstudiosKPIs {
  const total = enriquecidos.length;
  const conDatos = enriquecidos.filter((e) => !e.sin_datos).length;
  const sinDatos = enriquecidos.filter((e) => e.sin_datos).length;
  const conConcluidos = enriquecidos.filter(
    (e) => e.tiene_estudios_concluidos === 1,
  ).length;

  const conUniv = enriquecidos.filter((e) => e.universidad_principal).length;
  const countByUniv: Record<string, number> = {};
  const countByTipo: Record<string, number> = {};
  const countByArea: Record<string, number> = {};
  const countByNivel: Record<string, number> = {};

  for (const e of enriquecidos) {
    if (e.universidad_principal) {
      countByUniv[e.universidad_principal] =
        (countByUniv[e.universidad_principal] ?? 0) + 1;
    }
    if (!e.sin_datos) {
      countByTipo[e.tipo_universidad] =
        (countByTipo[e.tipo_universidad] ?? 0) + 1;
      if (e.area_profesional) {
        countByArea[e.area_profesional] =
          (countByArea[e.area_profesional] ?? 0) + 1;
      }
    }
    countByNivel[e.nivel_maximo] = (countByNivel[e.nivel_maximo] ?? 0) + 1;
  }

  const top10Universidades = Object.entries(countByUniv)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([nombre, count]) => ({
      nombre: nombre
        .replace(/^UNIVERSIDAD\s+/, "U. ")
        .replace(/PONTIFICIA\s+/, "PUCP / "),
      count,
      pct: conUniv ? (count / conUniv) * 100 : 0,
    }));

  // HHI: sum of squared shares (en proporción 0-1 sobre conUniv)
  let hhi = 0;
  if (conUniv > 0) {
    for (const c of Object.values(countByUniv)) {
      const s = c / conUniv;
      hhi += s * s;
    }
    hhi = Math.round(hhi * 10000); // escala 0-10000
  }

  // Entropía por áreas (solo con área asignada)
  const totalConArea = Object.values(countByArea).reduce((a, b) => a + b, 0);
  let entropiaAreas = 0;
  if (totalConArea > 0) {
    for (const c of Object.values(countByArea)) {
      const p = c / totalConArea;
      if (p > 0) entropiaAreas -= p * Math.log2(p);
    }
    entropiaAreas = Math.round(entropiaAreas * 100) / 100;
  }

  const pctPorTipo: Record<string, number> = {};
  if (conDatos > 0) {
    for (const [k, v] of Object.entries(countByTipo)) {
      pctPorTipo[k] = Math.round((v / conDatos) * 1000) / 10;
    }
  }

  const pctPorArea: Record<string, number> = {};
  if (totalConArea > 0) {
    for (const [k, v] of Object.entries(countByArea)) {
      pctPorArea[k] = Math.round((v / totalConArea) * 1000) / 10;
    }
  }

  const pctPorNivel: Record<string, number> = {};
  for (const [k, v] of Object.entries(countByNivel)) {
    pctPorNivel[k] = Math.round((v / total) * 1000) / 10;
  }

  return {
    totalCandidatos: total,
    conDatos,
    sinDatos,
    totalConArea,
    pctConcluidos: total ? Math.round((conConcluidos / total) * 1000) / 10 : 0,
    pctSinInfo: total ? Math.round((sinDatos / total) * 1000) / 10 : 0,
    pctPorTipo,
    pctPorArea,
    pctPorNivel,
    top10Universidades,
    hhi,
    entropiaAreas,
  };
}
