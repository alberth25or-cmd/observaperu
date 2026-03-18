/**
 * Agregación y normalización global para flujos nacimiento → domicilio.
 * Min–max sobre todos los conteos para que la intensidad de color sea comparable.
 */

export interface FlowRow {
  origen: string;
  destino: string;
  count: number;
  /** Normalizado 0–1 según min–max global de todos los conteos */
  normalized: number;
}

export interface SameDeptDot {
  departamento: string;
  count: number;
  normalized: number;
}

export interface FlujosTerritorialesData {
  flows: FlowRow[];
  sameDept: SameDeptDot[];
  minCount: number;
  maxCount: number;
}

const INVALID = ["", "No se encontró", "No encontrado"];

function isValid(d: string | undefined): boolean {
  if (d == null || typeof d !== "string") return false;
  const t = d.trim();
  return t.length > 0 && !INVALID.includes(t);
}

export function buildFlujosTerritoriales(
  data: Array<{
    nacimiento_departamento?: string;
    domicilio_departamento?: string;
  }>,
  minFlowCount: number = 1,
): FlujosTerritorialesData {
  const pairCount = new Map<string, number>();

  for (const row of data) {
    const nac = (row.nacimiento_departamento ?? "").trim();
    const dom = (row.domicilio_departamento ?? "").trim();
    if (!isValid(nac) || !isValid(dom)) continue;
    const key = `${nac}\t${dom}`;
    pairCount.set(key, (pairCount.get(key) ?? 0) + 1);
  }

  const flows: FlowRow[] = [];
  const sameDeptCount = new Map<string, number>();

  for (const [key, count] of pairCount) {
    if (count < minFlowCount) continue;
    const [origen, destino] = key.split("\t");
    if (origen === destino) {
      sameDeptCount.set(origen, (sameDeptCount.get(origen) ?? 0) + count);
    } else {
      flows.push({ origen, destino, count, normalized: 0 });
    }
  }

  const allCounts = [
    ...flows.map((f) => f.count),
    ...Array.from(sameDeptCount.values()),
  ];
  const minCount = allCounts.length ? Math.min(...allCounts) : 0;
  const maxCount = allCounts.length ? Math.max(...allCounts) : 1;
  const range = maxCount - minCount || 1;

  for (const f of flows) {
    f.normalized = (f.count - minCount) / range;
  }

  const sameDept: SameDeptDot[] = Array.from(sameDeptCount.entries()).map(
    ([departamento, count]) => ({
      departamento,
      count,
      normalized: (count - minCount) / range,
    }),
  );

  return { flows, sameDept, minCount, maxCount };
}

/** Interpola color entre #93C5FD (0) → #3B82F6 (0.5) → #1E3A8A (1) */
export function flowColor(normalized: number): string {
  const light = { r: 0x93, g: 0xc5, b: 0xfd };
  const mid = { r: 0x3b, g: 0x82, b: 0xf6 };
  const dark = { r: 0x1e, g: 0x3a, b: 0x8a };

  const lerp = (a: number, b: number, t: number) => Math.round(a + (b - a) * t);
  const toHex = (r: number, g: number, b: number) =>
    `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;

  if (normalized <= 0.5) {
    const t = normalized * 2; // 0..1
    return toHex(
      lerp(light.r, mid.r, t),
      lerp(light.g, mid.g, t),
      lerp(light.b, mid.b, t),
    );
  }
  const t = (normalized - 0.5) * 2;
  return toHex(
    lerp(mid.r, dark.r, t),
    lerp(mid.g, dark.g, t),
    lerp(mid.b, dark.b, t),
  );
}
