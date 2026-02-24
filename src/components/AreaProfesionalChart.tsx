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

const COLORS = ["#1b2b5a", "#2E7D8F", "#4A90E2", "#6B9BD1", "#8B9DC3", "#0f1d46", "#5a7d6a", "#88a0a8"];

interface Item {
  area: string;
  count: number;
  pct: number;
}

interface AreaProfesionalChartProps {
  pctPorArea: Record<string, number>;
  totalConArea: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Item }> }) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg text-left">
      <p className="font-semibold text-[#0b1b3b] text-sm">{d.area}</p>
      <p className="text-xs text-slate-600">{d.count} candidatos</p>
      <p className="text-xs text-slate-500">{d.pct.toFixed(1)}%</p>
    </div>
  );
}

export default function AreaProfesionalChart({ pctPorArea, totalConArea }: AreaProfesionalChartProps) {
  const data: Item[] = Object.entries(pctPorArea || {})
    .map(([area, pct]) => ({
      area,
      pct,
      count: Math.round((pct / 100) * totalConArea),
    }))
    .filter((d) => d.pct > 0)
    .sort((a, b) => b.pct - a.pct);

  if (data.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[280px] sm:h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 24, left: 4, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis type="number" tick={{ fontSize: 11, fill: "#64748b" }} stroke="#94a3b8" />
          <YAxis
            type="category"
            dataKey="area"
            width={100}
            tick={{ fontSize: 11, fill: "#475569" }}
            stroke="#94a3b8"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" name="Candidatos" radius={[0, 4, 4, 0]} maxBarSize={24}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
