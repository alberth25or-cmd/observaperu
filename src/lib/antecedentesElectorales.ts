/**
 * Antecedentes electorales: transformación y KPIs para el dashboard de multipostulación.
 * Fuente: public/data/candidatos_antecedentes_electorales.json
 */

export type TipoPostulacion =
  | "Solo Presidencia"
  | "Presidencia + Senado"
  | "Presidencia + Diputado"
  | "Triple Postulación";

export interface AntecedentesRow {
  candidato: string;
  presidencia: string;
  diputado: string;
  senador: string;
}

export interface AntecedentesRowTransformada {
  candidato: string;
  presidencia: number;
  diputado: number;
  senador: number;
  numeroCargos: number;
  tipoPostulacion: TipoPostulacion;
}

function siNoToNum(val: string): number {
  return String(val).toUpperCase() === "SI" ? 1 : 0;
}

function getTipoPostulacion(p: number, d: number, s: number): TipoPostulacion {
  const cargos = p + d + s;
  if (cargos >= 3) return "Triple Postulación";
  if (d === 1 && s === 1) return "Triple Postulación";
  if (d === 1) return "Presidencia + Diputado";
  if (s === 1) return "Presidencia + Senado";
  return "Solo Presidencia";
}

export function transformarAntecedentes(rows: AntecedentesRow[]): AntecedentesRowTransformada[] {
  return rows.map((r) => {
    const p = siNoToNum(r.presidencia);
    const d = siNoToNum(r.diputado);
    const s = siNoToNum(r.senador);
    const numeroCargos = p + d + s;
    return {
      candidato: r.candidato,
      presidencia: p,
      diputado: d,
      senador: s,
      numeroCargos,
      tipoPostulacion: getTipoPostulacion(p, d, s),
    };
  });
}

export interface AntecedentesKPIs {
  totalCandidatos: number;
  pctSoloPresidencia: number;
  pctDoblePostulacion: number;
  pctPostulanSenado: number;
  pctPostulanDiputado: number;
  promedioCargosPorCandidato: number;
  rankingTipoPostulacion: Array<{ tipo: TipoPostulacion; cantidad: number; pct: number }>;
  soloPresidencia: number;
  doblePostulacion: number;
  postulanSenado: number;
  postulanDiputado: number;
  /** Porcentaje de candidatos que además de presidencia postulan a al menos otro cargo */
  pctTambienOtroCargo: number;
  /** Datos para gráfico donut: solo vs doble */
  donutSoloVsDoble: Array<{ name: string; value: number }>;
  /** Datos para gráfico barras: tipo postulación */
  barrasTipoPostulacion: Array<{ tipo: string; cantidad: number }>;
  /** Datos para gráfico comparativo Senado vs Diputado */
  senadoVsDiputado: Array<{ cargo: string; cantidad: number }>;
  /** Filas transformadas para heatmap */
  filas: AntecedentesRowTransformada[];
}

export function computeAntecedentesKPIs(
  rows: AntecedentesRow[]
): AntecedentesKPIs | null {
  if (!rows?.length) return null;

  const filas = transformarAntecedentes(rows);
  const total = filas.length;

  const soloPresidencia = filas.filter((f) => f.tipoPostulacion === "Solo Presidencia").length;
  const doblePostulacion = total - soloPresidencia;
  const postulanSenado = filas.filter((f) => f.senador === 1).length;
  const postulanDiputado = filas.filter((f) => f.diputado === 1).length;

  const sumaCargos = filas.reduce((s, f) => s + f.numeroCargos, 0);
  const promedioCargosPorCandidato = total > 0 ? sumaCargos / total : 0;

  const tipoCount = new Map<TipoPostulacion, number>();
  for (const f of filas) {
    tipoCount.set(f.tipoPostulacion, (tipoCount.get(f.tipoPostulacion) ?? 0) + 1);
  }
  const rankingTipoPostulacion: Array<{ tipo: TipoPostulacion; cantidad: number; pct: number }> = [
    "Solo Presidencia",
    "Presidencia + Senado",
    "Presidencia + Diputado",
    "Triple Postulación",
  ].map((tipo) => {
    const cantidad = tipoCount.get(tipo as TipoPostulacion) ?? 0;
    return { tipo: tipo as TipoPostulacion, cantidad, pct: total > 0 ? (cantidad / total) * 100 : 0 };
  }).filter((r) => r.cantidad > 0);

  const pctTambienOtroCargo = total > 0 ? (doblePostulacion / total) * 100 : 0;

  const donutSoloVsDoble = [
    { name: "Solo Presidencia", value: soloPresidencia },
    { name: "También otro cargo", value: doblePostulacion },
  ].filter((d) => d.value > 0);

  const barrasTipoPostulacion = rankingTipoPostulacion.map((r) => ({
    tipo: r.tipo,
    cantidad: r.cantidad,
  }));

  const senadoVsDiputado = [
    { cargo: "Postulan a Senado", cantidad: postulanSenado },
    { cargo: "Postulan a Diputado", cantidad: postulanDiputado },
  ];

  return {
    totalCandidatos: total,
    pctSoloPresidencia: total > 0 ? (soloPresidencia / total) * 100 : 0,
    pctDoblePostulacion: total > 0 ? (doblePostulacion / total) * 100 : 0,
    pctPostulanSenado: total > 0 ? (postulanSenado / total) * 100 : 0,
    pctPostulanDiputado: total > 0 ? (postulanDiputado / total) * 100 : 0,
    promedioCargosPorCandidato,
    rankingTipoPostulacion,
    soloPresidencia,
    doblePostulacion,
    postulanSenado,
    postulanDiputado,
    pctTambienOtroCargo,
    donutSoloVsDoble,
    barrasTipoPostulacion,
    senadoVsDiputado,
    filas,
  };
}
