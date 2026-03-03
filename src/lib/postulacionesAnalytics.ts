/**
 * Análisis estadístico de número de postulaciones (total y a presidencia).
 * Fuente: public/data/numerode_postulaciones.json
 * Nota: Los datos corresponden a procesos electorales anteriores a las elecciones actuales.
 */

export interface PostulacionRow {
  postulante: string;
  totalPostulaciones: number;
  postulacionesPresidencia: number;
}

function sum(arr: number[]): number {
  return arr.reduce((a, b) => a + b, 0);
}

function mean(arr: number[]): number {
  return arr.length === 0 ? 0 : sum(arr) / arr.length;
}

function sortedCopy(arr: number[]): number[] {
  return [...arr].sort((a, b) => a - b);
}

function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const s = sortedCopy(arr);
  const i = (p / 100) * (s.length - 1);
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  if (lo === hi) return s[lo];
  return s[lo] + (i - lo) * (s[hi] - s[lo]);
}

function std(arr: number[], m?: number): number {
  if (arr.length === 0) return 0;
  const avg = m ?? mean(arr);
  const sqDiffs = arr.map((x) => (x - avg) ** 2);
  return Math.sqrt(sum(sqDiffs) / arr.length);
}

function mode(arr: number[]): number | null {
  if (arr.length === 0) return null;
  const counts = new Map<number, number>();
  for (const x of arr) counts.set(x, (counts.get(x) ?? 0) + 1);
  let maxCount = 0;
  let modeVal: number | null = null;
  for (const [val, c] of counts) {
    if (c > maxCount) {
      maxCount = c;
      modeVal = val;
    }
  }
  return modeVal;
}

/** Coeficiente de Gini (0 = igualdad, 1 = máxima concentración) */
function gini(arr: number[]): number {
  if (arr.length === 0) return 0;
  const s = sortedCopy(arr);
  const n = s.length;
  const total = sum(s);
  if (total === 0) return 0;
  let cum = 0;
  for (let i = 0; i < n; i++) {
    cum += (2 * (i + 1) - n - 1) * s[i];
  }
  return cum / (n * total);
}

/** Covarianza entre x e y */
function covariance(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;
  const mx = mean(x);
  const my = mean(y);
  return mean(x.map((xi, i) => (xi - mx) * (y[i] - my)));
}

/** Correlación de Pearson */
function pearson(x: number[], y: number[]): number {
  const cov = covariance(x, y);
  const sx = std(x);
  const sy = std(y);
  if (sx === 0 || sy === 0) return 0;
  return cov / (sx * sy);
}

/** Outliers por método IQR (devuelve índices) */
function outlierIndices(arr: number[]): number[] {
  if (arr.length < 4) return [];
  const s = sortedCopy(arr);
  const q1 = percentile(s, 25);
  const q3 = percentile(s, 75);
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr;
  const hi = q3 + 1.5 * iqr;
  const out: number[] = [];
  arr.forEach((v, i) => {
    if (v < lo || v > hi) out.push(i);
  });
  return out;
}

export interface PostulacionesKPIs {
  n: number;
  totalPostulaciones: number[];
  postulacionesPresidencia: number[];
  mediaTotal: number;
  medianaTotal: number;
  modaTotal: number | null;
  stdTotal: number;
  cvTotal: number;
  minTotal: number;
  maxTotal: number;
  p25Total: number;
  p50Total: number;
  p75Total: number;
  mediaPresidencia: number;
  medianaPresidencia: number;
  modaPresidencia: number | null;
  stdPresidencia: number;
  cvPresidencia: number;
  minPresidencia: number;
  maxPresidencia: number;
  p25Presidencia: number;
  p50Presidencia: number;
  p75Presidencia: number;
  proporcionAlMenosUnaPresidencia: number;
  giniTotal: number;
  giniPresidencia: number;
  covarianza: number;
  correlacionPearson: number;
  outliersTotal: number[];
  outliersPresidencia: number[];
  pareto: Array<{ postulante: string; totalPostulaciones: number; acumulado: number; pctAcumulado: number }>;
  ranking: Array<{ postulante: string; totalPostulaciones: number; postulacionesPresidencia: number }>;
  /** Ranking ordenado por postulaciones a Presidencia (desc) */
  rankingPresidencia: Array<{ postulante: string; totalPostulaciones: number; postulacionesPresidencia: number }>;
  /** Ranking por índice de ambición (presidencia/total), solo candidatos con total ≥ 1, ordenado desc */
  rankingAmbicion: Array<{
    postulante: string;
    totalPostulaciones: number;
    postulacionesPresidencia: number;
    indiceAmbicion: number;
  }>;
  scatterData: Array<{ postulante: string; total: number; presidencia: number; indiceAmbicion: number }>;
  histogramTotal: Array<{ rango: string; valor: string; count: number }>;
  histogramPresidencia: Array<{ rango: string; valor: string; count: number }>;
  boxplotTotal: { min: number; q1: number; mediana: number; q3: number; max: number };
  boxplotPresidencia: { min: number; q1: number; mediana: number; q3: number; max: number };
  /** Índice de Persistencia Política: media de total postulaciones */
  indicePersistenciaMedia: number;
  /** Índice de Ambición Presidencial (media): promedio de presidencia/total entre quienes tienen total > 0 */
  indiceAmbicionMedia: number;
}

export function computePostulacionesKPIs(rows: PostulacionRow[]): PostulacionesKPIs | null {
  if (!rows?.length) return null;

  const totalPostulaciones = rows.map((r) => r.totalPostulaciones);
  const postulacionesPresidencia = rows.map((r) => r.postulacionesPresidencia);
  const n = rows.length;

  const mediaTotal = mean(totalPostulaciones);
  const medianaTotal = percentile(totalPostulaciones, 50);
  const modaTotal = mode(totalPostulaciones);
  const stdTotal = std(totalPostulaciones, mediaTotal);
  const cvTotal = mediaTotal === 0 ? 0 : (stdTotal / mediaTotal) * 100;
  const minTotal = Math.min(...totalPostulaciones);
  const maxTotal = Math.max(...totalPostulaciones);
  const p25Total = percentile(totalPostulaciones, 25);
  const p50Total = percentile(totalPostulaciones, 50);
  const p75Total = percentile(totalPostulaciones, 75);

  const mediaPresidencia = mean(postulacionesPresidencia);
  const medianaPresidencia = percentile(postulacionesPresidencia, 50);
  const modaPresidencia = mode(postulacionesPresidencia);
  const stdPresidencia = std(postulacionesPresidencia, mediaPresidencia);
  const cvPresidencia = mediaPresidencia === 0 ? 0 : (stdPresidencia / mediaPresidencia) * 100;
  const minPresidencia = Math.min(...postulacionesPresidencia);
  const maxPresidencia = Math.max(...postulacionesPresidencia);
  const p25Presidencia = percentile(postulacionesPresidencia, 25);
  const p50Presidencia = percentile(postulacionesPresidencia, 50);
  const p75Presidencia = percentile(postulacionesPresidencia, 75);

  const conAlMenosUnaPresidencia = rows.filter((r) => r.postulacionesPresidencia >= 1).length;
  const proporcionAlMenosUnaPresidencia = n > 0 ? (conAlMenosUnaPresidencia / n) * 100 : 0;

  const giniTotal = gini(totalPostulaciones);
  const giniPresidencia = gini(postulacionesPresidencia);
  const covarianza = covariance(totalPostulaciones, postulacionesPresidencia);
  const correlacionPearson = pearson(totalPostulaciones, postulacionesPresidencia);

  const outlierIdxTotal = outlierIndices(totalPostulaciones);
  const outlierIdxPresidencia = outlierIndices(postulacionesPresidencia);
  const outliersTotal = outlierIdxTotal.map((i) => totalPostulaciones[i]);
  const outliersPresidencia = outlierIdxPresidencia.map((i) => postulacionesPresidencia[i]);

  const sortedByTotal = [...rows].sort((a, b) => b.totalPostulaciones - a.totalPostulaciones);
  const sumaTotal = sum(totalPostulaciones);
  let cum = 0;
  const pareto = sortedByTotal.map((r) => {
    cum += r.totalPostulaciones;
    return {
      postulante: r.postulante,
      totalPostulaciones: r.totalPostulaciones,
      acumulado: cum,
      pctAcumulado: sumaTotal > 0 ? (cum / sumaTotal) * 100 : 0,
    };
  });

  const ranking = sortedByTotal.map((r) => ({
    postulante: r.postulante,
    totalPostulaciones: r.totalPostulaciones,
    postulacionesPresidencia: r.postulacionesPresidencia,
  }));

  const sortedByPresidencia = [...rows].sort((a, b) => b.postulacionesPresidencia - a.postulacionesPresidencia);
  const rankingPresidencia = sortedByPresidencia.map((r) => ({
    postulante: r.postulante,
    totalPostulaciones: r.totalPostulaciones,
    postulacionesPresidencia: r.postulacionesPresidencia,
  }));

  const withAmbicion = rows
    .filter((r) => r.totalPostulaciones >= 1)
    .map((r) => ({
      postulante: r.postulante,
      totalPostulaciones: r.totalPostulaciones,
      postulacionesPresidencia: r.postulacionesPresidencia,
      indiceAmbicion: r.postulacionesPresidencia / r.totalPostulaciones,
    }));
  const rankingAmbicion = [...withAmbicion].sort((a, b) => b.indiceAmbicion - a.indiceAmbicion);

  const scatterData = rows.map((r) => ({
    postulante: r.postulante,
    total: r.totalPostulaciones,
    presidencia: r.postulacionesPresidencia,
    indiceAmbicion: r.totalPostulaciones > 0 ? r.postulacionesPresidencia / r.totalPostulaciones : 0,
  }));

  const histogramTotal: Array<{ rango: string; valor: string; count: number }> = [];
  for (let i = 0; i <= maxTotal; i++) {
    const count = totalPostulaciones.filter((x) => x === i).length;
    histogramTotal.push({ rango: `${i}`, valor: `${i} postulaciones`, count });
  }
  if (histogramTotal.length === 0) histogramTotal.push({ rango: "0", valor: "0", count: n });

  const histogramPresidencia: Array<{ rango: string; valor: string; count: number }> = [];
  for (let i = 0; i <= maxPresidencia; i++) {
    const count = postulacionesPresidencia.filter((x) => x === i).length;
    histogramPresidencia.push({ rango: `${i}`, valor: `${i} a presidencia`, count });
  }

  const boxplotTotal = {
    min: minTotal,
    q1: p25Total,
    mediana: medianaTotal,
    q3: p75Total,
    max: maxTotal,
  };
  const boxplotPresidencia = {
    min: minPresidencia,
    q1: p25Presidencia,
    mediana: medianaPresidencia,
    q3: p75Presidencia,
    max: maxPresidencia,
  };

  const conPostulaciones = rows.filter((r) => r.totalPostulaciones > 0);
  const indiceAmbicionMedia =
    conPostulaciones.length > 0
      ? mean(conPostulaciones.map((r) => r.postulacionesPresidencia / r.totalPostulaciones))
      : 0;

  return {
    n,
    totalPostulaciones,
    postulacionesPresidencia,
    mediaTotal,
    medianaTotal,
    modaTotal,
    stdTotal,
    cvTotal,
    minTotal,
    maxTotal,
    p25Total,
    p50Total,
    p75Total,
    mediaPresidencia,
    medianaPresidencia,
    modaPresidencia,
    stdPresidencia,
    cvPresidencia,
    minPresidencia,
    maxPresidencia,
    p25Presidencia,
    p50Presidencia,
    p75Presidencia,
    proporcionAlMenosUnaPresidencia,
    giniTotal,
    giniPresidencia,
    covarianza,
    correlacionPearson,
    outliersTotal,
    outliersPresidencia,
    pareto,
    ranking,
    rankingPresidencia,
    rankingAmbicion,
    scatterData,
    histogramTotal,
    histogramPresidencia,
    boxplotTotal,
    boxplotPresidencia,
    indicePersistenciaMedia: mediaTotal,
    indiceAmbicionMedia,
  };
}
