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
  rango: string;
  valor: string;
  count: number;
}

interface PostulacionesHistogramChartProps {
  data: Item[];
  title?: string;
  color?: string;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Item }>;
}) {
  if (!active || !payload?.[0]) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg">
      <p className="font-semibold text-[#0b1b3b] text-sm">{p.valor}</p>
      <p className="text-xs text-slate-600">{p.count} candidatos</p>
    </div>
  );
}

export default function PostulacionesHistogramChart({
  data,
  title = "Distribución",
  color = "#1b2b5a",
}: PostulacionesHistogramChartProps) {
  if (!data?.length) {
    return (
      <div className="h-[240px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[260px] sm:h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 24 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="rango"
            tick={{ fontSize: 11, fill: "#475569" }}
            stroke="#94a3b8"
            label={{
              value: "Nº de postulaciones",
              position: "insideBottom",
              offset: -8,
              style: { fontSize: 12, fill: "#475569", fontWeight: 500 },
            }}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#64748b" }}
            stroke="#94a3b8"
            label={{
              value: "Nº de candidatos",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: "#475569", fontWeight: 500 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            name="Candidatos"
            fill={color}
            radius={[4, 4, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
