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
  cargo: string;
  cantidad: number;
}

interface AntecedentesSenadoDiputadoChartProps {
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
      <p className="font-semibold text-[#0b1b3b] text-sm">{p.cargo}</p>
      <p className="text-xs text-slate-600">{p.cantidad} candidatos</p>
    </div>
  );
}

export default function AntecedentesSenadoDiputadoChart({
  data,
}: AntecedentesSenadoDiputadoChartProps) {
  if (!data?.length) {
    return (
      <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[240px] sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="cargo"
            tick={{ fontSize: 11, fill: "#475569" }}
            stroke="#94a3b8"
          />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} stroke="#94a3b8" />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="cantidad"
            name="Candidatos"
            fill="#1b2b5a"
            radius={[4, 4, 0, 0]}
            maxBarSize={48}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
