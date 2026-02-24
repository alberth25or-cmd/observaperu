"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS: Record<string, string> = {
  Pública: "#1b2b5a",
  Privada: "#4A90E2",
  Militar: "#2E7D8F",
  Extranjera: "#8B9DC3",
};

interface Item {
  name: string;
  value: number;
  pct: number;
}

interface TipoUniversidadChartProps {
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
  const d = payload[0].payload;
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg">
      <p className="font-semibold text-[#0b1b3b] text-sm">{d.name}</p>
      <p className="text-xs text-slate-600">{d.value} candidatos</p>
      <p className="text-xs text-slate-500">{d.pct.toFixed(1)}%</p>
    </div>
  );
}

export default function TipoUniversidadChart({ data }: TipoUniversidadChartProps) {
  const filtered = (data || []).filter((d) => d.pct > 0);

  if (filtered.length === 0) {
    return (
      <div className="h-[240px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[260px] sm:h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={filtered}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={56}
            outerRadius={88}
            paddingAngle={2}
            label={({ name, pct }) => `${name} ${pct.toFixed(0)}%`}
          >
            {filtered.map((entry, i) => (
              <Cell key={i} fill={COLORS[entry.name] ?? "#94a3b8"} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs sm:text-sm text-slate-700">{value}</span>
            )}
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
