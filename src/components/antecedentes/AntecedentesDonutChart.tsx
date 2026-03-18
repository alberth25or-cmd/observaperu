"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = ["#2E7D8F", "#4A90E2"];

interface Item {
  name: string;
  value: number;
}

interface AntecedentesDonutChartProps {
  data: Item[];
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Item }>;
}) {
  if (!active || !payload?.length) return null;
  const totalVal = payload.reduce((s, x) => s + (x.payload?.value ?? 0), 0);
  const p = payload[0]?.payload;
  if (!p) return null;
  const pct = totalVal > 0 ? ((p.value / totalVal) * 100).toFixed(0) : "0";
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg">
      <p className="font-semibold text-[#0b1b3b] text-sm">{p.name}</p>
      <p className="text-xs text-slate-600">
        {p.value} candidatos ({pct}%)
      </p>
    </div>
  );
}

export default function AntecedentesDonutChart({
  data,
}: AntecedentesDonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[240px] sm:h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            label={({ name, value }) => `${name}: ${value}`}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs sm:text-sm text-slate-700">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
