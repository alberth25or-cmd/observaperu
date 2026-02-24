"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

const COLORS = ["#1b2b5a", "#2E7D8F", "#4A90E2", "#6B9BD1", "#8B9DC3", "#0f1d46", "#5a7d6a", "#88a0a8", "#7d8a7d", "#6b7d9e"];

interface Item {
  nombre: string;
  count: number;
  pct: number;
}

interface TopUniversidadesChartProps {
  data: Item[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Item }> }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg text-left">
      <p className="font-semibold text-[#0b1b3b] text-xs sm:text-sm">{d.nombre}</p>
      <p className="text-xs text-slate-600">{d.count} candidatos</p>
      <p className="text-xs text-slate-500">{d.pct.toFixed(1)}%</p>
    </div>
  );
}

export default function TopUniversidadesChart({ data }: TopUniversidadesChartProps) {
  if (!data?.length) {
    return (
      <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 16, left: 12, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} stroke="#94a3b8" />
          <YAxis
            type="category"
            dataKey="nombre"
            width={180}
            tick={{ fontSize: 10, fill: "#475569" }}
            tickFormatter={(value) => (value.length > 24 ? `${value.slice(0, 22)}…` : value)}
            stroke="#94a3b8"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Candidatos" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
