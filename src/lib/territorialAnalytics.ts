/**
 * KPIs, concentración, entropía y matriz de transición para análisis territorial.
 * Observa Perú — centralización, migración interna, comparativo nacimiento/domicilio.
 */

const NO_ENCONTRADO = "No se encontró";
const LIMA = "LIMA";
const CALLAO = "CALLAO";

export interface TerritorialRow {
  slug?: string;
  nacimiento_pais?: string;
  nacimiento_departamento?: string;
  domicilio_departamento?: string;
}

export interface TerritorialKPIs {
  total: number;
  totalConDomicilio: number;
  sinDomicilio: number;
  pctSinDomicilio: number;

  // Centralización nacimiento
  limaNacimiento: number;
  callaoNacimiento: number;
  limaMetroNacimiento: number;
  regionesNacimiento: number;
  pctLimaNacimiento: number;
  ratioLimaRegionesNacimiento: number;

  // Centralización domicilio
  limaLMetroDomicilio: number;
  regionesDomicilio: number;
  pctLimaDomicilio: number;
  ratioLimaRegionesDomicilio: number;

  // Migración
  mismoDepartamento: number;
  migraron: number;
  pctMismoDepto: number;
  pctMigraron: number;
  flujoNetoLima: number; // (nacidos fuera, viven Lima) - (nacidos Lima, viven fuera)

  // Concentración
  hhiNacimiento: number;
  hhiDomicilio: number;
  entropiaNacimiento: number;
  entropiaDomicilio: number;
  deptosRepresentadosNacimiento: number;
  deptosRepresentadosDomicilio: number;
  concentracionNacimiento: "baja" | "moderada" | "alta";
  concentracionDomicilio: "baja" | "moderada" | "alta";

  // Top y matriz
  topNacimiento: Array<{ departamento: string; count: number; pct: number }>;
  topDomicilio: Array<{ departamento: string; count: number; pct: number }>;
  topFlujos: Array<{ origen: string; destino: string; count: number }>;
  matrizFlujos: Record<string, Record<string, number>>;
}

function hhiFromCounts(counts: Record<string, number>, total: number): number {
  if (total <= 0) return 0;
  let sum = 0;
  for (const c of Object.values(counts)) {
    const s = c / total;
    sum += s * s;
  }
  return Math.round(sum * 10000);
}

function entropyFromCounts(counts: Record<string, number>, total: number): number {
  if (total <= 0) return 0;
  let h = 0;
  for (const c of Object.values(counts)) {
    const p = c / total;
    if (p > 0) h -= p * Math.log2(p);
  }
  return Math.round(h * 100) / 100;
}

function concentracionLabel(hhi: number): "baja" | "moderada" | "alta" {
  if (hhi < 1500) return "baja";
  if (hhi < 2500) return "moderada";
  return "alta";
}

export function computeTerritorialKPIs(
  data: TerritorialRow[]
): TerritorialKPIs {
  const valid = data.filter(
    (r) =>
      r.nacimiento_pais === "PERÚ" &&
      r.nacimiento_departamento &&
      r.nacimiento_departamento !== NO_ENCONTRADO
  );
  const total = valid.length;
  const conDomicilio = valid.filter(
    (r) =>
      r.domicilio_departamento &&
      r.domicilio_departamento !== NO_ENCONTRADO
  );
  const totalConDomicilio = conDomicilio.length;
  const sinDomicilio = total - totalConDomicilio;

  const countNacimiento: Record<string, number> = {};
  const countDomicilio: Record<string, number> = {};
  const matriz: Record<string, Record<string, number>> = {};
  let mismoDepartamento = 0;
  let migraron = 0;
  let nacidosFueraResidenLima = 0;
  let nacidosLimaResidenFuera = 0;

  for (const r of valid) {
    const nac = r.nacimiento_departamento!;
    countNacimiento[nac] = (countNacimiento[nac] ?? 0) + 1;
  }
  for (const r of conDomicilio) {
    const dom = r.domicilio_departamento!;
    countDomicilio[dom] = (countDomicilio[dom] ?? 0) + 1;

    const nac = r.nacimiento_departamento!;
    if (nac === dom) mismoDepartamento++;
    else migraron++;

    if (nac !== LIMA && nac !== CALLAO && (dom === LIMA || dom === CALLAO))
      nacidosFueraResidenLima++;
    if ((nac === LIMA || nac === CALLAO) && dom !== LIMA && dom !== CALLAO)
      nacidosLimaResidenFuera++;

    if (!matriz[nac]) matriz[nac] = {};
    matriz[nac][dom] = (matriz[nac][dom] ?? 0) + 1;
  }

  const limaN = (countNacimiento[LIMA] ?? 0) + (countNacimiento[CALLAO] ?? 0);
  const regN = total - limaN;
  const limaLD = (countDomicilio[LIMA] ?? 0) + (countDomicilio[CALLAO] ?? 0);
  const regD = totalConDomicilio - limaLD;

  const hhiN = hhiFromCounts(countNacimiento, total);
  const hhiD = totalConDomicilio ? hhiFromCounts(countDomicilio, totalConDomicilio) : 0;

  const topNacimiento = Object.entries(countNacimiento)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([departamento, count]) => ({
      departamento,
      count,
      pct: total ? Math.round((count / total) * 1000) / 10 : 0,
    }));

  const topDomicilio = Object.entries(countDomicilio)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([departamento, count]) => ({
      departamento,
      count,
      pct: totalConDomicilio ? Math.round((count / totalConDomicilio) * 1000) / 10 : 0,
    }));

  const flowList: Array<{ origen: string; destino: string; count: number }> = [];
  for (const [origen, dests] of Object.entries(matriz)) {
    for (const [destino, count] of Object.entries(dests)) {
      if (origen !== destino) flowList.push({ origen, destino, count });
    }
  }
  const topFlujos = flowList.sort((a, b) => b.count - a.count).slice(0, 8);

  return {
    total,
    totalConDomicilio,
    sinDomicilio,
    pctSinDomicilio: total ? Math.round((sinDomicilio / total) * 1000) / 10 : 0,

    limaNacimiento: countNacimiento[LIMA] ?? 0,
    callaoNacimiento: countNacimiento[CALLAO] ?? 0,
    limaMetroNacimiento: limaN,
    regionesNacimiento: regN,
    pctLimaNacimiento: total ? Math.round((limaN / total) * 1000) / 10 : 0,
    ratioLimaRegionesNacimiento: regN > 0 ? Math.round((limaN / regN) * 100) / 100 : 0,

    limaLMetroDomicilio: limaLD,
    regionesDomicilio: regD,
    pctLimaDomicilio: totalConDomicilio ? Math.round((limaLD / totalConDomicilio) * 1000) / 10 : 0,
    ratioLimaRegionesDomicilio: regD > 0 ? Math.round((limaLD / regD) * 100) / 100 : 0,

    mismoDepartamento,
    migraron,
    pctMismoDepto: totalConDomicilio ? Math.round((mismoDepartamento / totalConDomicilio) * 1000) / 10 : 0,
    pctMigraron: totalConDomicilio ? Math.round((migraron / totalConDomicilio) * 1000) / 10 : 0,
    flujoNetoLima: nacidosFueraResidenLima - nacidosLimaResidenFuera,

    hhiNacimiento: hhiN,
    hhiDomicilio: hhiD,
    entropiaNacimiento: entropyFromCounts(countNacimiento, total),
    entropiaDomicilio: totalConDomicilio ? entropyFromCounts(countDomicilio, totalConDomicilio) : 0,
    deptosRepresentadosNacimiento: Object.keys(countNacimiento).length,
    deptosRepresentadosDomicilio: Object.keys(countDomicilio).length,
    concentracionNacimiento: concentracionLabel(hhiN),
    concentracionDomicilio: concentracionLabel(hhiD),

    topNacimiento,
    topDomicilio,
    topFlujos,
    matrizFlujos: matriz,
  };
}
