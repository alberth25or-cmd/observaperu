"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  } from "recharts";

interface Item {
  postulante: string;
  totalPostulaciones: number;
  postulacionesPresidencia: number;
}

interface ItemAmbicion extends Item {
  indiceAmbicion: number;
}

interface PostulacionesRankingChartProps {
  data: Item[] | ItemAmbicion[];
  maxBars?: number;
  /** "total" | "presidencia" | "ambicion" (ambición = % postulaciones a Presidencia) */
  variant?: "total" | "presidencia" | "ambicion";
}

const BAR_COLOR_TOTAL = "#1b2b5a";
const BAR_COLOR_PRES = "#2E7D8F";

function CustomTooltipTotal({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Item }>;
}) {
  if (!active || !payload?.[0]) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg max-w-[240px]">
      <p className="font-semibold text-[#0b1b3b] text-sm truncate">{p.postulante}</p>
      <p className="text-xs text-slate-600">Total postulaciones: {p.totalPostulaciones}</p>
      <p className="text-xs text-slate-600">A presidencia: {p.postulacionesPresidencia}</p>
    </div>
  );
}

function CustomTooltipPresidencia({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Item }>;
}) {
  if (!active || !payload?.[0]) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg max-w-[240px]">
      <p className="font-semibold text-[#0b1b3b] text-sm truncate">{p.postulante}</p>
      <p className="text-xs text-slate-600">Postulaciones a Presidencia: {p.postulacionesPresidencia}</p>
      <p className="text-xs text-slate-500">Total postulaciones: {p.totalPostulaciones}</p>
    </div>
  );
}

function CustomTooltipAmbicion({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: ItemAmbicion }>;
}) {
  if (!active || !payload?.[0]) return null;
  const p = payload[0].payload;
  const pct = (p.indiceAmbicion * 100).toFixed(1);
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg max-w-[240px]">
      <p className="font-semibold text-[#0b1b3b] text-sm truncate">{p.postulante}</p>
      <p className="text-xs text-slate-600">Índice de ambición: {pct}%</p>
      <p className="text-xs text-slate-500">
        {p.postulacionesPresidencia} de {p.totalPostulaciones} postulaciones a Presidencia
      </p>
    </div>
  );
}

export default function PostulacionesRankingChart({
  data,
  maxBars = 15,
  variant = "total",
}: PostulacionesRankingChartProps) {
  const visible = data.slice(0, maxBars);
  const isPresidencia = variant === "presidencia";
  const isAmbicion = variant === "ambicion";

  if (!visible.length) {
    return (
      <div className="h-[320px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[340px] sm:h-[380px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={visible}
          layout="vertical"
          margin={{ top: 8, right: 24, left: 4, bottom: 32 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748b" }}
            stroke="#94a3b8"
            domain={isAmbicion ? [0, 1] : undefined}
            label={{
              value: isAmbicion
                ? "Índice de ambición (%)"
                : isPresidencia
                  ? "Postulaciones a Presidencia"
                  : "Total postulaciones",
              position: "insideBottom",
              offset: -4,
              style: { fontSize: 12, fill: "#475569", fontWeight: 500 },
            }}
            tickFormatter={isAmbicion ? (v: number) => `${(v * 100).toFixed(0)}%` : undefined}
          />
          <YAxis
            type="category"
            dataKey="postulante"
            width={140}
            tick={{ fontSize: 10, fill: "#475569" }}
            stroke="#94a3b8"
            tickFormatter={(v) => (v.length > 22 ? v.slice(0, 20) + "…" : v)}
            label={{
              value: "Candidato",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: "#475569", fontWeight: 500 },
            }}
          />
          <Tooltip
            content={
              isAmbicion
                ? <CustomTooltipAmbicion />
                : isPresidencia
                  ? <CustomTooltipPresidencia />
                  : <CustomTooltipTotal />
            }
          />
          <Bar
            dataKey={
              isAmbicion ? "indiceAmbicion" : isPresidencia ? "postulacionesPresidencia" : "totalPostulaciones"
            }
            name={
              isAmbicion
                ? "Índice de ambición"
                : isPresidencia
                  ? "Postulaciones a Presidencia"
                  : "Total postulaciones"
            }
            radius={[0, 4, 4, 0]}
            maxBarSize={20}
            fill={isAmbicion ? "#6B9BD1" : isPresidencia ? BAR_COLOR_PRES : BAR_COLOR_TOTAL}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
