"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const data = [
  { name: "No pobre", value: 110, fill: "#1b2b5a" },
  { name: "Pobre", value: 55, fill: "#4A90E2" },
  { name: "Pobre extremo", value: 27.5, fill: "#2E7D8F" },
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="font-semibold text-[#0b1b3b]">{p.name}</p>
      <p className="text-sm text-slate-600">S/ {p.value} (multa en soles)</p>
    </div>
  );
}

export default function Multas2026Chart() {
  return (
    <div className="my-8 w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#f5f7fb] p-4 sm:p-6">
      <p className="mb-4 text-sm font-semibold text-slate-600">
        Multas por no votar según tipo de distrito (Elecciones 2026)
      </p>
      <div className="h-[220px] w-full sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 24, left: 8, bottom: 8 }}
          >
            <XAxis
              type="number"
              tickFormatter={(v) => `S/ ${v}`}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 13, fill: "#0b1b3b", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={36} isAnimationActive>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
