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
};
