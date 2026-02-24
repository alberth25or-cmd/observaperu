"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";

// -----------------------------------------------------------------------------
// Tipos
// -----------------------------------------------------------------------------
export interface LugarRow {
  slug?: string;
  nombre?: string;
  nacimiento_departamento?: string;
  domicilio_departamento?: string;
}

const INVALID = ["", "No se encontró", "No encontrado"];
const MAX_GROUPS = 10;

// Paleta Observa Perú / NYT (azules y tonos sobrios como la referencia)
const COLORS = [
  "#1b2b5a",
  "#2E7D8F",
  "#4A90E2",
  "#6B9BD1",
  "#8B9DC3",
  "#88a0a8",
  "#5a7d6a",
  "#0f1d46",
  "#7d8a7d",
  "#6b7d9e",
];
const INTERNAL_COLOR = "#cbd5e1";
const CHORD_STROKE = "#94a3b8";

function isValid(d: string | undefined): boolean {
  if (d == null || typeof d !== "string") return false;
  const t = d.trim();
  return t.length > 0 && !INVALID.includes(t);
}

// Construir datos del chord: departamentos, ángulos, y por cada flujo la lista de candidatos (nombre)
function buildChordData(data: LugarRow[]) {
  const pairCandidatos = new Map<string, Array<{ nombre: string }>>();
  const bornCount = new Map<string, number>();
  const resideCount = new Map<string, number>();

  for (const row of data) {
    const nac = (row.nacimiento_departamento ?? "").trim();
    const dom = (row.domicilio_departamento ?? "").trim();
    if (!isValid(nac) || !isValid(dom)) continue;
    const key = `${nac}\t${dom}`;
    if (!pairCandidatos.has(key)) pairCandidatos.set(key, []);
    pairCandidatos.get(key)!.push({ nombre: row.nombre ?? row.slug ?? "—" });
    bornCount.set(nac, (bornCount.get(nac) ?? 0) + 1);
    resideCount.set(dom, (resideCount.get(dom) ?? 0) + 1);
  }

  const totalByDept = new Map<string, number>();
  for (const [d, c] of bornCount) totalByDept.set(d, (totalByDept.get(d) ?? 0) + c);
  for (const [d, c] of resideCount) totalByDept.set(d, (totalByDept.get(d) ?? 0) + c);

  const sorted = Array.from(totalByDept.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);

  const departments =
    sorted.length <= MAX_GROUPS
      ? [...sorted]
      : [...sorted.slice(0, MAX_GROUPS - 1), "OTROS"];
  const deptIndex = new Map(departments.map((d, i) => [d, i]));
  const mapDept = (d: string) => (deptIndex.has(d) ? d : "OTROS");
  const n = departments.length;

  const matrix: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  for (const [key, candidatos] of pairCandidatos) {
    const [nac, dom] = key.split("\t");
    const i = deptIndex.get(mapDept(nac));
    const j = deptIndex.get(mapDept(dom));
    if (i != null && j != null) matrix[i][j] = candidatos.length;
  }

  const totalPerGroup = departments.map((_, i) => {
    let t = 0;
    for (let j = 0; j < n; j++) t += matrix[i][j];
    for (let k = 0; k < n; k++) t += matrix[k][i];
    t -= matrix[i][i];
    return Math.max(t, 1);
  });
  const sumTotal = totalPerGroup.reduce((a, b) => a + b, 0);
  if (sumTotal === 0) return null;

  const twoPi = 2 * Math.PI;
  const groupStart: number[] = [];
  let acc = 0;
  for (let i = 0; i < n; i++) {
    groupStart.push(acc);
    acc += (totalPerGroup[i] / sumTotal) * twoPi;
  }
  const groupMid = groupStart.map((start, i) => start + (totalPerGroup[i] / sumTotal) * twoPi * 0.5);

  // Por cada par (i,j) reunir candidatos de todos los (nac,dom) que mapean a i,j
  const linkCandidatos = new Map<string, Array<{ nombre: string }>>();
  for (const [key, candidatos] of pairCandidatos) {
    const [nac, dom] = key.split("\t");
    const i = deptIndex.get(mapDept(nac));
    const j = deptIndex.get(mapDept(dom));
    if (i == null || j == null) continue;
    const linkKey = `${i}-${j}`;
    if (!linkCandidatos.has(linkKey)) linkCandidatos.set(linkKey, []);
    linkCandidatos.get(linkKey)!.push(...candidatos);
  }

  const links: Array<{
    i: number;
    j: number;
    value: number;
    candidatos: Array<{ nombre: string }>;
    sourceMid: number;
    targetMid: number;
  }> = [];
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const linkKey = `${i}-${j}`;
      const candidatos = linkCandidatos.get(linkKey) ?? [];
      const v = candidatos.length;
      if (v <= 0) continue;
      links.push({
        i,
        j,
        value: v,
        candidatos,
        sourceMid: groupMid[i],
        targetMid: groupMid[j],
      });
    }
  }

  const born: number[] = departments.map((d) =>
    d === "OTROS"
      ? sorted.slice(MAX_GROUPS - 1).reduce((s, dep) => s + (bornCount.get(dep) ?? 0), 0)
      : bornCount.get(d) ?? 0
  );
  const reside: number[] = departments.map((d) =>
    d === "OTROS"
      ? sorted.slice(MAX_GROUPS - 1).reduce((s, dep) => s + (resideCount.get(dep) ?? 0), 0)
      : resideCount.get(d) ?? 0
  );

  return {
    departments,
    groupStart,
    totalPerGroup,
    groupMid,
    links,
    born,
    reside,
    sumTotal,
  };
}

function angleToXY(cx: number, cy: number, r: number, angle: number) {
  const a = -angle + Math.PI / 2;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as const;
}

// Curva desde origen hasta destino con abultamiento (sentido: origen → destino para la flecha)
function chordPath(
  cx: number,
  cy: number,
  R: number,
  angleSource: number,
  angleTarget: number
) {
  const [x1, y1] = angleToXY(cx, cy, R, angleSource);
  const [x2, y2] = angleToXY(cx, cy, R, angleTarget);
  const midAngle = (angleSource + angleTarget) / 2;
  const bulge = 1.15;
  const [cxQ, cyQ] = angleToXY(cx, cy, R * bulge, midAngle);
  return `M ${x1} ${y1} Q ${cxQ} ${cyQ} ${x2} ${y2}`;
}

// -----------------------------------------------------------------------------
// Componente
// -----------------------------------------------------------------------------
interface ChordTerritorialProps {
  data: LugarRow[];
}

export default function ChordTerritorial({ data }: ChordTerritorialProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(340);
  const [hoverArc, setHoverArc] = useState<number | null>(null);
  const [hoverLink, setHoverLink] = useState<number | null>(null);
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    type: "arc" | "link";
    arc?: { name: string; born: number; reside: number };
    link?: {
      source: string;
      target: string;
      value: number;
      candidatos: Array<{ nombre: string }>;
    };
  } | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      setSize(w < 400 ? Math.min(300, w - 24) : Math.min(380, w - 48));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const chord = useMemo(() => buildChordData(data), [data]);

  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 52;
  const nodeR = 6;

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltip((t) => (t ? { ...t, x: e.clientX, y: e.clientY } : null));
  }, []);

  if (!chord || chord.sumTotal === 0) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
          Flujo territorial: Nacimiento → Domicilio
        </h3>
        <p className="mt-2 text-sm text-slate-500">No hay datos suficientes para el diagrama.</p>
      </div>
    );
  }

  const { departments, groupMid, links, born, reside, sumTotal } = chord;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
      <h3 className="mb-1 text-lg font-bold text-slate-900 sm:text-xl">
        Flujo territorial: Nacimiento → Domicilio
      </h3>
      <p className="mb-4 text-sm text-slate-500 sm:mb-6">
        De dónde nacieron a dónde residen. Pasa el cursor sobre una línea para ver los candidatos.
      </p>

      <div ref={containerRef} className="flex justify-center overflow-x-auto py-2">
        <svg
          width={size}
          height={size}
          className="max-w-full"
          style={{ minWidth: 260 }}
          onMouseLeave={() => {
            setHoverArc(null);
            setHoverLink(null);
            setTooltip(null);
          }}
        >
          <defs>
            <marker
              id="chord-arrow"
              markerWidth="10"
              markerHeight="8"
              refX="9"
              refY="4"
              orient="auto"
            >
              <path d="M0 0 L10 4 L0 8 Z" fill={CHORD_STROKE} />
            </marker>
          </defs>
          <g transform={`translate(${cx},${cy})`}>
            {/* Líneas con flecha (nacimiento → domicilio) */}
            {links.map((link, idx) => {
              const isInternal = link.i === link.j;
              const isDim =
                (hoverArc != null && link.i !== hoverArc && link.j !== hoverArc) ||
                (hoverLink != null && hoverLink !== idx);
              const isHighlight =
                hoverLink === idx || (hoverArc != null && (link.i === hoverArc || link.j === hoverArc));
              const stroke =
                isInternal ? INTERNAL_COLOR : COLORS[link.i % COLORS.length];
              const strokeWidth = Math.min(2.5, 0.8 + link.value * 0.4);
              return (
                <path
                  key={`${link.i}-${link.j}-${idx}`}
                  d={chordPath(0, 0, R, link.sourceMid, link.targetMid)}
                  fill="none"
                  stroke={stroke}
                  strokeWidth={strokeWidth}
                  strokeOpacity={isDim ? 0.15 : isHighlight ? 0.95 : 0.5}
                  markerEnd={isInternal ? undefined : "url(#chord-arrow)"}
                  style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
                  onMouseEnter={(e) => {
                    setHoverLink(idx);
                    setHoverArc(null);
                    setTooltip({
                      x: e.clientX,
                      y: e.clientY,
                      type: "link",
                      link: {
                        source: departments[link.i],
                        target: departments[link.j],
                        value: link.value,
                        candidatos: link.candidatos,
                      },
                    });
                  }}
                  onMouseMove={handleMouseMove}
                />
              );
            })}

            {/* Nodos (círculos como en la referencia) */}
            {departments.map((_, i) => {
              const mid = groupMid[i];
              const [x, y] = angleToXY(0, 0, R, mid);
              const isDim = hoverArc != null && hoverArc !== i;
              return (
                <g key={i}>
                  <circle
                    cx={x}
                    cy={y}
                    r={nodeR}
                    fill={COLORS[i % COLORS.length]}
                    fillOpacity={isDim ? 0.3 : 0.9}
                    stroke="#fff"
                    strokeWidth={1.5}
                    style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
                    onMouseEnter={(e) => {
                      setHoverArc(i);
                      setHoverLink(null);
                      setTooltip({
                        x: e.clientX,
                        y: e.clientY,
                        type: "arc",
                        arc: {
                          name: departments[i],
                          born: born[i],
                          reside: reside[i],
                        },
                      });
                    }}
                    onMouseMove={handleMouseMove}
                  />
                </g>
              );
            })}

            {/* Texto central (estilo NYT) */}
            <text
              x={0}
              y={-4}
              textAnchor="middle"
              className="fill-slate-400 text-xs font-medium"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              Nacimiento
            </text>
            <text
              x={0}
              y={8}
              textAnchor="middle"
              className="fill-slate-400 text-xs font-medium"
              style={{ fontFamily: "Inter, system-ui, sans-serif" }}
            >
              → Domicilio
            </text>

            {/* Etiquetas de departamentos */}
            {departments.map((name, i) => {
              const mid = groupMid[i];
              const labelR = R + 26;
              const [x, y] = angleToXY(0, 0, labelR, mid);
              return (
                <text
                  key={i}
                  x={x}
                  y={y}
                  textAnchor={x >= 0 ? "start" : "end"}
                  dominantBaseline="middle"
                  className="fill-slate-600 text-[9px] font-medium sm:text-[10px]"
                  style={{ fontFamily: "Inter, system-ui, sans-serif" }}
                >
                  {name}
                </text>
              );
            })}
          </g>
        </svg>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 max-w-[90vw] rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-lg sm:max-w-xs"
          style={{
            left: Math.min(tooltip.x + 14, typeof window !== "undefined" ? window.innerWidth - 220 : tooltip.x + 14),
            top: tooltip.y + 14,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            pointerEvents: "none",
          }}
        >
          {tooltip.type === "arc" && tooltip.arc && (
            <>
              <p className="font-semibold text-slate-900">{tooltip.arc.name}</p>
              <p className="text-xs text-slate-500">Nacidos allí: {tooltip.arc.born}</p>
              <p className="text-xs text-slate-500">Residen allí: {tooltip.arc.reside}</p>
            </>
          )}
          {tooltip.type === "link" && tooltip.link && (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {tooltip.link.source} → {tooltip.link.target}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {tooltip.link.value} candidato{tooltip.link.value !== 1 ? "s" : ""}
              </p>
              <ul className="mt-2 max-h-32 space-y-0.5 overflow-y-auto">
                {tooltip.link.candidatos.map((c, k) => (
                  <li key={k} className="text-xs font-medium text-slate-800">
                    {c.nombre}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}
