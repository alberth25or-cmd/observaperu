export interface DebateCandidato {
  key: string;
  nombre: string;
  partido: string;
  tiempoSegundos: number;
  tiempoLabel: string;
  palabrasTotales: number;
  intervenciones: number;
  promSegPorInterv: number;
  porcentajeAtaque: number;
  porcentajePropuesta: number;
  porcentajeNeutro: number;
  temas: Record<string, number>;
  mencionadoPor: number;
  interrupciones: number;
}

export interface AtaqueEdge {
  from: string;
  to: string;
  count: number;
}

export interface DebateStats {
  metadata: {
    fecha: string;
    jornada: string;
    candidatos: number;
    segmentos: number;
    duracionSegundos: number;
    duracionLabel: string;
  };
  candidatos: DebateCandidato[];
  redAtaques: AtaqueEdge[];
}

export async function getDebateStats(): Promise<DebateStats> {
  const res = await fetch("/data/debate_stats.json");
  if (!res.ok) throw new Error("No se pudo cargar debate_stats.json");
  return res.json();
}

export const TOPIC_LABELS: Record<string, string> = {
  seguridad: "Seguridad",
  economia: "Economía",
  corrupcion: "Corrupción",
  educacion: "Educación",
  salud: "Salud",
  estado: "Estado",
};

export const CANDIDATE_COLORS: Record<string, string> = {
  // Debate 1 — 23 mar 2026
  alex_gonzalez:     "#2563eb",
  carlos_alvarez:    "#dc2626",
  cesar_acuna:       "#d97706",
  fernando_oliveira: "#7c3aed",
  johnny_lescano:    "#059669",
  jose_luna:         "#0284c7",
  jose_williams:     "#0d9488",
  marisol_perez:     "#db2777",
  pablo_lopez:       "#64748b",
  lopez_aliaga:      "#991b1b",
  wolfgang_grosso:   "#0f766e",
  // Debate 2 — 24 mar 2026
  fiorela_molineli:    "#e11d48",
  alvaro_paz_barra:    "#f59e0b",
  george_fors:         "#16a34a",
  carlos_jaiko:        "#0ea5e9",
  walter_chirinos:     "#8b5cf6",
  charlie_carrasco:    "#b45309",
  ricardo_belmont:     "#0f172a",
  francisco_dizcanseco:"#0891b2",
  armando_mae:         "#be185d",
  alfonso_spa:         "#4f46e5",
  roberto_sanchez:     "#15803d",
};
