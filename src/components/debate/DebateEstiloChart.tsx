"use client";

import {
  ScatterChart, Scatter, XAxis, YAxis,
  CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer,
} from "recharts";
import { DebateCandidato, CANDIDATE_COLORS } from "@/lib/debateAnalytics";

// Very short labels that fit inside a small bubble
const BUBBLE: Record<string, string> = {
  // Debate 1
  alex_gonzalez:     "Alex",
  carlos_alvarez:    "Álv.",
  cesar_acuna:       "Acuña",
  fernando_oliveira: "Oliv.",
  johnny_lescano:    "Les.",
  jose_luna:         "Luna",
  jose_williams:     "Will.",
  marisol_perez:     "Mar.",
  pablo_lopez:       "Pab.",
  lopez_aliaga:      "Ali.",
  wolfgang_grosso:   "Wolf",
  // Debate 2
  fiorela_molineli:    "Fior.",
  alvaro_paz_barra:    "Paz",
  george_fors:         "Fors.",
  carlos_jaiko:        "Jaiko",
  walter_chirinos:     "Chir.",
  charlie_carrasco:    "Carr.",
  ricardo_belmont:     "Bel.",
  francisco_dizcanseco:"Dizc.",
  armando_mae:         "Maé",
  alfonso_spa:         "Spa",
  roberto_sanchez:     "Sánch.",
};

interface Props {
  candidatos: DebateCandidato[];
}

interface ScatterTooltipProps {
  active?: boolean;
  payload?: any[];
  avgX: number;
  avgY: number;
}

const ScatterTooltip = ({ active, payload, avgX, avgY }: ScatterTooltipProps) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  const style =
    d.x >= avgX && d.y >= avgY ? "Activo y concentrado" :
    d.x <  avgX && d.y >= avgY ? "Activo y fragmentado" :
    d.x >= avgX && d.y <  avgY ? "Pasivo y concentrado" :
                                  "Pasivo y fragmentado";
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-sm min-w-[210px]">
      <p className="font-bold text-[#1b2b5a] mb-1 pb-1.5 border-b border-slate-100">{d.nombre}</p>
      <p className="text-xs text-slate-400 mb-2 italic">{style}</p>
      <div className="space-y-1 text-xs text-slate-600">
        <div className="flex justify-between gap-4">
          <span>Promedio/intervención</span>
          <span className="font-bold text-[#1b2b5a]">{d.x}s</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Nº de intervenciones</span>
          <span className="font-bold text-[#1b2b5a]">{d.y}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Palabras totales</span>
          <span className="font-bold text-[#1b2b5a]">{d.z.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Interrupciones</span>
          <span className="font-bold text-[#1b2b5a]">{d.interrupciones}</span>
        </div>
      </div>
    </div>
  );
};

// Custom bubble shape: colored circle with name label inside
const CustomDot = (props: any) => {
  const { cx, cy, payload } = props;
  const color = CANDIDATE_COLORS[payload.key] ?? "#94a3b8";
  // Scale r by words: ~900 min → r=13, ~2000 max → r=25
  const r = Math.max(13, Math.min(25, 13 + ((payload.z - 900) / 1100) * 12));
  return (
    <g>
      <circle
        cx={cx} cy={cy} r={r}
        fill={color} fillOpacity={0.85}
        stroke="white" strokeWidth={2}
      />
      <text
        x={cx} y={cy}
        textAnchor="middle" dominantBaseline="middle"
        fontSize={8} fontWeight={800} fill="white"
      >
        {BUBBLE[payload.key] ?? ""}
      </text>
    </g>
  );
};

export default function DebateEstiloChart({ candidatos }: Props) {
  const avgX = Math.round(
    candidatos.reduce((s, c) => s + c.promSegPorInterv, 0) / candidatos.length
  );
  const avgY = Math.round(
    candidatos.reduce((s, c) => s + c.intervenciones, 0) / candidatos.length
  );

  const data = candidatos.map(c => ({
    key: c.key,
    x: c.promSegPorInterv,       // avg seconds/intervention
    y: c.intervenciones,          // number of interventions
    z: c.palabrasTotales,         // bubble size
    nombre: c.nombre,
    tiempoLabel: c.tiempoLabel,
    interrupciones: c.interrupciones,
  }));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h3 className="text-lg font-bold text-[#1b2b5a]">Estilo del discurso</h3>
        <span className="text-xs text-slate-500 bg-[#eef2fb] border border-slate-200 px-2.5 py-1 rounded-full">
          Concentrado vs fragmentado
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Eje horizontal: duración promedio por intervención. Eje vertical: número de
        intervenciones. Tamaño de burbuja: palabras totales. Las líneas punteadas marcan
        el promedio del grupo. Hover para detalle.
      </p>

      <ResponsiveContainer width="100%" height={380}>
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="x"
            name="Prom. seg/interv"
            domain={[24, 65]}
            tick={{ fontSize: 10, fill: "#64748b" }}
            tickLine={false}
            axisLine={{ stroke: "#dde3f0" }}
            tickFormatter={(v) => `${v}s`}
            label={{
              value: "Duración promedio por intervención",
              position: "insideBottom",
              offset: -25,
              fontSize: 11,
              fill: "#64748b",
            }}
          />
          <YAxis
            type="number"
            dataKey="y"
            name="Intervenciones"
            domain={[9, 23]}
            tick={{ fontSize: 10, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
            label={{
              value: "Nº de intervenciones",
              angle: -90,
              position: "insideLeft",
              offset: 15,
              fontSize: 11,
              fill: "#64748b",
            }}
          />
          <ReferenceLine
            x={avgX}
            stroke="#cbd5e1"
            strokeDasharray="4 3"
            label={{ value: `← ${avgX}s prom. →`, position: "top", fontSize: 9, fill: "#94a3b8" }}
          />
          <ReferenceLine
            y={avgY}
            stroke="#cbd5e1"
            strokeDasharray="4 3"
            label={{ value: `prom. ${avgY}`, position: "insideTopRight", fontSize: 9, fill: "#94a3b8" }}
          />
          <Tooltip content={(p: any) => <ScatterTooltip {...p} avgX={avgX} avgY={avgY} />} cursor={{ strokeDasharray: "3 3" }} />
          <Scatter data={data} shape={CustomDot} />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Quadrant legend */}
      <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
        <div className="bg-[#eef2fb] rounded-lg p-2.5">
          <span className="font-bold text-[#1b2b5a]">↖ Activo y fragmentado</span>
          <p className="text-slate-500 mt-0.5">
            Muchas intervenciones cortas. El debate lo domina en frecuencia pero no en profundidad.
            <strong className="text-slate-600"> Ej: Alex González</strong>
          </p>
        </div>
        <div className="bg-[#eef2fb] rounded-lg p-2.5">
          <span className="font-bold text-[#1b2b5a]">↗ Activo y concentrado</span>
          <p className="text-slate-500 mt-0.5">
            Muchas intervenciones largas. Máxima presencia y control del tiempo.
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5">
          <span className="font-bold text-slate-500">↙ Pasivo y fragmentado</span>
          <p className="text-slate-400 mt-0.5">
            Pocas intervenciones cortas. Menor presencia en el debate.
          </p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2.5">
          <span className="font-bold text-slate-500">↘ Pasivo y concentrado</span>
          <p className="text-slate-400 mt-0.5">
            Pocas pero largas intervenciones. Discurso denso y elaborado.
            <strong className="text-slate-600"> Ej: César Acuña</strong>
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Debate JNE 23/03/2026
      </p>
    </div>
  );
}
