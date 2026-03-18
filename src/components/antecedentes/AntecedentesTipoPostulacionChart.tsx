"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

interface Item {
  tipo: string;
  cantidad: number;
}

interface AntecedentesTipoPostulacionChartProps {
  data: Item[];
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
      <p className="font-semibold text-[#0b1b3b] text-sm">{p.tipo}</p>
      <p className="text-xs text-slate-600">{p.cantidad} candidatos</p>
    </div>
  );
}

const BAR_COLORS = ["#1b2b5a", "#2E7D8F", "#4A90E2", "#8B9DC3"];

export default function AntecedentesTipoPostulacionChart({
  data,
}: AntecedentesTipoPostulacionChartProps) {
  if (!data?.length) {
    return (
      <div className="h-[260px] flex items-center justify-center text-slate-500 text-sm">
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
          margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#64748b" }}
            stroke="#94a3b8"
          />
          <YAxis
            type="category"
            dataKey="tipo"
            width={140}
            tick={{ fontSize: 11, fill: "#475569" }}
            stroke="#94a3b8"
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="cantidad"
            name="Candidatos"
            radius={[0, 4, 4, 0]}
            maxBarSize={28}
            fill="#1b2b5a"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
