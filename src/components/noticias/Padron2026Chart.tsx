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

const TOTAL = 27.3;
const MAYORES_70 = 2.6;
const NUEVOS = 2.5;

const data = [
  { name: "Total electores", value: TOTAL, fill: "#1b2b5a" },
  { name: "Mayores de 70 años", value: MAYORES_70, fill: "#2E7D8F" },
  { name: "Nuevos votantes", value: NUEVOS, fill: "#4A90E2" },
];

function formatMillions(n: number): string {
  return `${n} M`;
}

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { name: string; value: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  const num = p.value * 1_000_000;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="font-semibold text-[#0b1b3b]">{p.name}</p>
      <p className="text-sm text-slate-600">
        {num.toLocaleString("es-PE")} personas
      </p>
    </div>
  );
}

export default function Padron2026Chart() {
  return (
    <div className="my-8 w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#f5f7fb] p-4 sm:p-6">
      <p className="mb-4 text-sm font-semibold text-slate-600">
        Padrón electoral Elecciones 2026
      </p>
      <div className="h-[220px] w-full sm:h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 32, left: 8, bottom: 8 }}
          >
            <XAxis
              type="number"
              tickFormatter={(v) => `${v} M`}
              domain={[0, 30]}
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              tick={{ fontSize: 12, fill: "#0b1b3b", fontWeight: 600 }}
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
