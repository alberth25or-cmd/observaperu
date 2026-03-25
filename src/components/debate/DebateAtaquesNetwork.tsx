"use client";

import { useState, useMemo } from "react";
import type { DebateCandidato, AtaqueEdge } from "@/lib/debateAnalytics";
import { CANDIDATE_COLORS } from "@/lib/debateAnalytics";

const SHORT: Record<string, string> = {
  // Debate 1
  alex_gonzalez:     "Alex González",
  carlos_alvarez:    "C. Álvarez",
  cesar_acuna:       "César Acuña",
  fernando_oliveira: "F. Oliveira",
  johnny_lescano:    "J. Lescano",
  jose_luna:         "José Luna",
  jose_williams:     "J. Williams",
  marisol_perez:     "M. Pérez",
  pablo_lopez:       "P. López",
  lopez_aliaga:      "L. Aliaga",
  wolfgang_grosso:   "Wolfgang",
  // Debate 2
  fiorela_molineli:    "F. Molineli",
  alvaro_paz_barra:    "Paz de la Barra",
  george_fors:         "G. Forsyth",
  carlos_jaiko:        "C. Jaiko",
  walter_chirinos:     "Chirinos",
  charlie_carrasco:    "Carrasco",
  ricardo_belmont:     "Belmont",
  francisco_dizcanseco:"Dizcanseco",
  armando_mae:         "Armando Maé",
  alfonso_spa:         "A. Spa",
  roberto_sanchez:     "R. Sánchez",
};

interface Props {
  candidatos: DebateCandidato[];
  redAtaques: AtaqueEdge[];
}

/* ── SVG constants ──────────────────────────────── */
const CX  = 260;   // SVG center X
const CY  = 260;   // SVG center Y
const R   = 168;   // chord radius (inner edge of outer arcs)
const AW  = 18;    // arc width (outer arc thickness)
const GAP = 0.04;  // gap in radians between candidate arcs

/* ── Math helpers ───────────────────────────────── */
/** Clockwise-from-top angle → SVG [x, y] (origin = circle center) */
function pt(angle: number, r: number): [number, number] {
  return [r * Math.sin(angle), -r * Math.cos(angle)];
}

/** Large-arc-flag: 1 when arc span > 180° */
function laf(a1: number, a2: number): 0 | 1 {
  return Math.abs(a2 - a1) > Math.PI ? 1 : 0;
}

/** Filled annular arc (donut slice) centered at origin, from a1 to a2 */
function annularArc(a1: number, a2: number, r1: number, r2: number): string {
  const [ox1, oy1] = pt(a1, r2);
  const [ox2, oy2] = pt(a2, r2);
  const [ix2, iy2] = pt(a2, r1);
  const [ix1, iy1] = pt(a1, r1);
  const la = laf(a1, a2);
  return (
    `M${ox1},${oy1}` +
    ` A${r2},${r2} 0 ${la} 1 ${ox2},${oy2}` +
    ` L${ix2},${iy2}` +
    ` A${r1},${r1} 0 ${la} 0 ${ix1},${iy1} Z`
  );
}

/**
 * Chord ribbon connecting sub-arc (a1→a2) to sub-arc (b1→b2) at radius R.
 * Bezier control point = origin (0,0) → curves through the circle center.
 */
function ribbon(a1: number, a2: number, b1: number, b2: number): string {
  const [xa1, ya1] = pt(a1, R);
  const [xa2, ya2] = pt(a2, R);
  const [xb1, yb1] = pt(b1, R);
  const [xb2, yb2] = pt(b2, R);
  const la = laf(a1, a2);
  const lb = laf(b1, b2);
  return (
    `M${xa1},${ya1}` +
    ` A${R},${R} 0 ${la} 1 ${xa2},${ya2}` +
    ` C0,0 0,0 ${xb1},${yb1}` +
    ` A${R},${R} 0 ${lb} 0 ${xb2},${yb2}` +
    ` C0,0 0,0 ${xa1},${ya1} Z`
  );
}

/* ── Main component ─────────────────────────────── */
export default function DebateAtaquesNetwork({ redAtaques }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const directEdges  = useMemo(() => redAtaques.filter(e => e.to !== "sistema"), [redAtaques]);
  const sistemaEdges = useMemo(() => redAtaques.filter(e => e.to === "sistema"),  [redAtaques]);

  /* ── Chord geometry ── */
  const { nodes, chords } = useMemo(() => {
    /* 1. Per-candidate totals */
    const totalOut: Record<string, number> = {};
    const totalIn:  Record<string, number> = {};
    directEdges.forEach(({ from, to, count }) => {
      totalOut[from] = (totalOut[from] ?? 0) + count;
      totalIn[to]    = (totalIn[to]   ?? 0) + count;
    });

    /* 2. Participants sorted by total involvement descending */
    const keySet = new Set<string>([
      ...Object.keys(totalOut),
      ...Object.keys(totalIn),
    ]);
    const sorted = [...keySet].sort((a, b) => {
      const ta = (totalOut[a] ?? 0) + (totalIn[a] ?? 0);
      const tb = (totalOut[b] ?? 0) + (totalIn[b] ?? 0);
      return tb - ta;
    });

    /* 3. Assign arc angular spans */
    const n           = sorted.length;
    const totalWeight = sorted.reduce((s, k) => s + (totalOut[k] ?? 0) + (totalIn[k] ?? 0), 0);
    const arcSpace    = 2 * Math.PI - n * GAP;

    type NodeInfo = {
      key: string; start: number; end: number; size: number;
      totalOut: number; totalIn: number;
    };
    const nodes: NodeInfo[] = [];
    let cursor = 0;
    sorted.forEach(k => {
      const tot  = (totalOut[k] ?? 0) + (totalIn[k] ?? 0);
      const size = (tot / totalWeight) * arcSpace;
      nodes.push({
        key: k, start: cursor, end: cursor + size, size,
        totalOut: totalOut[k] ?? 0,
        totalIn:  totalIn[k]  ?? 0,
      });
      cursor += size + GAP;
    });

    /* 4. Sub-arc write-pointers: OUT region first, then IN region */
    const outPtr: Record<string, number> = {};
    const inPtr:  Record<string, number> = {};
    nodes.forEach(nd => {
      const outFrac = nd.totalOut / ((nd.totalOut + nd.totalIn) || 1);
      outPtr[nd.key] = nd.start;
      inPtr[nd.key]  = nd.start + nd.size * outFrac;
    });

    /* 5. Build chord data */
    type Chord = {
      from: string; to: string; count: number;
      fa1: number; fa2: number;
      ta1: number; ta2: number;
    };

    const chords: Chord[] = [...directEdges]
      .sort((a, b) => a.from.localeCompare(b.from) || a.to.localeCompare(b.to))
      .flatMap(({ from, to, count }) => {
        const fnd = nodes.find(nd => nd.key === from);
        const tnd = nodes.find(nd => nd.key === to);
        if (!fnd || !tnd) return [];

        const outSize = fnd.size * (fnd.totalOut / ((fnd.totalOut + fnd.totalIn) || 1));
        const inSize  = tnd.size * (tnd.totalIn  / ((tnd.totalOut + tnd.totalIn) || 1));

        const fa1 = outPtr[from];
        const fa2 = fa1 + (count / fnd.totalOut) * outSize;
        outPtr[from] = fa2;

        const ta1 = inPtr[to];
        const ta2 = ta1 + (count / tnd.totalIn) * inSize;
        inPtr[to] = ta2;

        return [{ from, to, count, fa1, fa2, ta1, ta2 }];
      });

    return { nodes, chords };
  }, [directEdges]);

  /* ── Tooltip data ── */
  const tooltipInfo = useMemo(() => {
    if (!hovered) return null;
    return {
      attacks:  directEdges.filter(e => e.from === hovered),
      received: directEdges.filter(e => e.to   === hovered),
    };
  }, [hovered, directEdges]);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div>
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-base font-bold text-[#1b2b5a]">Red de ataques directos</h3>
          <span className="text-xs bg-red-50 text-red-700 border border-red-200 px-2.5 py-0.5 rounded-full font-semibold">
            Diagrama de cuerdas
          </span>
        </div>
        <p className="text-xs text-slate-500">
          El tamaño de cada arco refleja la participación total en la red de ataques.
          Las cuerdas muestran menciones directas nominales; el color indica quién atacó.
          Hover sobre un arco o chip para resaltar sus conexiones.
        </p>
      </div>

      {/* Chord diagram + side info panel */}
      <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">

        {/* SVG */}
        <div className="flex-1 min-w-0 w-full">
        <svg
          width="100%"
          viewBox="0 0 520 520"
          style={{ display: "block", maxWidth: 520, margin: "0 auto" }}
          onMouseLeave={() => setHovered(null)}
        >
          <g transform={`translate(${CX},${CY})`}>

            {/* ── Chord ribbons (rendered below arcs) ── */}
            {chords.map(({ from, to, fa1, fa2, ta1, ta2 }) => {
              const color  = CANDIDATE_COLORS[from] ?? "#94a3b8";
              const active = !hovered || hovered === from || hovered === to;
              return (
                <path
                  key={`r-${from}-${to}`}
                  d={ribbon(fa1, fa2, ta1, ta2)}
                  fill={color}
                  stroke={color}
                  strokeWidth={0.5}
                  fillOpacity={active ? (hovered ? 0.82 : 0.60) : 0.05}
                  strokeOpacity={active ? 0.8 : 0.05}
                  style={{ transition: "fill-opacity 0.18s, stroke-opacity 0.18s" }}
                />
              );
            })}

            {/* ── Outer arcs + labels (rendered above ribbons) ── */}
            {nodes.map(({ key, start, end }) => {
              const color    = CANDIDATE_COLORS[key] ?? "#94a3b8";
              const active   = !hovered || hovered === key;
              const midAngle = (start + end) / 2;
              const labelR   = R + AW + 28;
              const [lx, ly] = pt(midAngle, labelR);
              const sinM     = Math.sin(midAngle);
              const anchor   = Math.abs(sinM) < 0.18
                ? "middle"
                : sinM > 0 ? "start" : "end";
              return (
                <g key={key} onMouseEnter={() => setHovered(key)} style={{ cursor: "pointer" }}>
                  <path
                    d={annularArc(start, end, R, R + AW)}
                    fill={color}
                    opacity={active ? 1 : 0.22}
                    style={{ transition: "opacity 0.18s" }}
                  />
                  <text
                    x={lx} y={ly}
                    textAnchor={anchor}
                    dominantBaseline="middle"
                    fontSize={10.5}
                    fontWeight={700}
                    fill={active ? "#1b2b5a" : "#94a3b8"}
                    style={{ transition: "fill 0.18s", pointerEvents: "none", userSelect: "none" }}
                  >
                    {SHORT[key] ?? key}
                  </text>
                </g>
              );
            })}

          </g>
        </svg>
        </div>

        {/* Side info panel */}
        <div className="sm:w-[190px] w-full flex-shrink-0">
          {hovered && tooltipInfo ? (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-3 text-xs">
              <p className="font-bold text-[#1b2b5a] mb-1.5 pb-1 border-b border-slate-100">
                {SHORT[hovered] ?? hovered}
              </p>
              {tooltipInfo.attacks.length > 0 && (
                <div className="mb-2">
                  <p className="text-slate-400 mb-1 font-semibold"
                    style={{ fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Atacó a
                  </p>
                  {tooltipInfo.attacks.map(e => (
                    <div key={e.to} className="flex items-center gap-1.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 inline-block"
                        style={{ backgroundColor: CANDIDATE_COLORS[e.to] ?? "#94a3b8" }} />
                      <span className="text-slate-600">{SHORT[e.to] ?? e.to}</span>
                      <span className="ml-auto font-bold text-[#1b2b5a]">{e.count}×</span>
                    </div>
                  ))}
                </div>
              )}
              {tooltipInfo.received.length > 0 && (
                <div>
                  <p className="text-slate-400 mb-1 font-semibold"
                    style={{ fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                    Fue atacado por
                  </p>
                  {tooltipInfo.received.map(e => (
                    <div key={e.from} className="flex items-center gap-1.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 inline-block"
                        style={{ backgroundColor: CANDIDATE_COLORS[e.from] ?? "#94a3b8" }} />
                      <span className="text-slate-600">{SHORT[e.from] ?? e.from}</span>
                      <span className="ml-auto font-bold text-[#1b2b5a]">{e.count}×</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center sm:justify-start sm:pt-[30%]">
              <p className="text-xs text-slate-400 italic text-center">
                Hover sobre un arco para ver detalle
              </p>
            </div>
          )}
        </div>

      </div>

      {/* Legend chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {nodes.map(({ key }) => (
          <button
            key={key}
            onMouseEnter={() => setHovered(key)}
            onMouseLeave={() => setHovered(null)}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-semibold transition-all"
            style={{
              backgroundColor: hovered === key ? (CANDIDATE_COLORS[key] ?? "#94a3b8") : "#ffffff",
              borderColor:     CANDIDATE_COLORS[key] ?? "#94a3b8",
              color:           hovered === key ? "#ffffff" : "#475569",
            }}
          >
            <span className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: CANDIDATE_COLORS[key] ?? "#94a3b8" }} />
            {SHORT[key] ?? key}
          </button>
        ))}
      </div>

      {/* Sistema note */}
      {sistemaEdges.length > 0 && (
        <div className="bg-[#eef2fb] border border-slate-200 rounded-xl p-4">
          <p className="text-xs font-bold text-[#1b2b5a] mb-1.5">
            Ataques al sistema político (sin objetivo personal):
          </p>
          <div className="flex flex-wrap gap-3">
            {sistemaEdges.map(e => (
              <span key={e.from}
                className="inline-flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: CANDIDATE_COLORS[e.from] ?? "#94a3b8" }} />
                {SHORT[e.from] ?? e.from} — {e.count} segmentos agresivos
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Estos candidatos usaron lenguaje de ataque pero sin nombrar a un rival específico.
          </p>
        </div>
      )}

      <p className="text-xs text-slate-400 text-center">
        Basado en detección de menciones nominales verificadas · Debate JNE 23/03/2026
      </p>
    </div>
  );
}
