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

const ORDER: Record<string, number> = {
  "No concluido": 0,
  Bachiller: 1,
  "Título profesional": 2,
  Especialidad: 3,
};
const COLORS: Record<string, string> = {
  "No concluido": "#94a3b8",
  Bachiller: "#6B9BD1",
  "Título profesional": "#4A90E2",
  Especialidad: "#1b2b5a",
};

interface Item {
  nivel: string;
  count: number;
  pct: number;
}

interface NivelMaximoChartProps {
  pctPorNivel: Record<string, number>;
  total: number;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Item }>;
}) {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg text-left">
      <p className="font-semibold text-[#0b1b3b] text-sm">{d.nivel}</p>
      <p className="text-xs text-slate-600">{d.count} candidatos</p>
      <p className="text-xs text-slate-500">{d.pct.toFixed(1)}%</p>
    </div>
  );
}

export default function NivelMaximoChart({
  pctPorNivel,
  total,
}: NivelMaximoChartProps) {
  const data: Item[] = Object.entries(pctPorNivel || {})
    .map(([nivel, pct]) => ({
      nivel,
      pct,
      count: Math.round((pct / 100) * total),
    }))
    .sort((a, b) => (ORDER[a.nivel] ?? 0) - (ORDER[b.nivel] ?? 0));

  if (data.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[220px] sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="nivel"
            tick={{ fontSize: 10, fill: "#475569" }}
            stroke="#94a3b8"
          />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} stroke="#94a3b8" />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="count"
            name="Candidatos"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.nivel] ?? "#94a3b8"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
