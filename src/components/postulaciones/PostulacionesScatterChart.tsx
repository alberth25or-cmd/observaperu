"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Point {
  postulante: string;
  total: number;
  presidencia: number;
  indiceAmbicion: number;
}

interface PostulacionesScatterChartProps {
  data: Point[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Point }>;
}) {
  if (!active || !payload?.[0]) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg max-w-[220px]">
      <p className="font-semibold text-[#0b1b3b] text-sm truncate">
        {p.postulante}
      </p>
      <p className="text-xs text-slate-600">
        Total: {p.total} · Presidencia: {p.presidencia}
      </p>
      <p className="text-xs text-slate-500">
        Índice ambición: {(p.indiceAmbicion * 100).toFixed(0)}%
      </p>
    </div>
  );
}

export default function PostulacionesScatterChart({
  data,
}: PostulacionesScatterChartProps) {
  if (!data?.length) {
    return (
      <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 16, right: 16, left: 8, bottom: 32 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            dataKey="total"
            tick={{ fontSize: 11, fill: "#64748b" }}
            stroke="#94a3b8"
            label={{
              value: "Total postulaciones",
              position: "insideBottom",
              offset: -12,
              style: { fontSize: 12, fill: "#475569", fontWeight: 500 },
            }}
          />
          <YAxis
            type="number"
            dataKey="presidencia"
            tick={{ fontSize: 11, fill: "#64748b" }}
            stroke="#94a3b8"
            label={{
              value: "Postulaciones a Presidencia",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: "#475569", fontWeight: 500 },
            }}
          />
          <ZAxis type="number" dataKey="indiceAmbicion" range={[80, 400]} />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ strokeDasharray: "3 3" }}
          />
          <Scatter
            name="Candidatos"
            data={data}
            fill="#1b2b5a"
            fillOpacity={0.85}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
