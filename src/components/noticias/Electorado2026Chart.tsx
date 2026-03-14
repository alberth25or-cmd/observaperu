"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const TOTAL = 27325432;
const DNI_VENCIDO = 1800000;
const DNI_VIGENTE = TOTAL - DNI_VENCIDO;

const data = [
  { name: "Con DNI vigente", value: DNI_VIGENTE, fill: "#1b2b5a" },
  { name: "Con DNI vencido", value: DNI_VENCIDO, fill: "#d97706" },
];

type Item = (typeof data)[0];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: Item }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  const pct = ((p.value / TOTAL) * 100).toFixed(1);
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="font-semibold text-[#0b1b3b]">{p.name}</p>
      <p className="text-sm text-slate-600">
        {p.value.toLocaleString("es-PE")} electores ({pct}%)
      </p>
    </div>
  );
}

export default function Electorado2026Chart() {
  return (
    <div className="my-8 w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#f5f7fb] p-4 sm:p-6">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-slate-600">
          Padrón electoral (octubre 2025)
        </p>
        <p className="text-lg font-bold text-[#0b1b3b]">
          {TOTAL.toLocaleString("es-PE")} habilitados
        </p>
      </div>
      <div className="flex flex-col items-center sm:flex-row sm:items-stretch sm:gap-6">
        <div className="h-[260px] w-full min-w-[240px] sm:h-[280px] sm:max-w-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={64}
                outerRadius={100}
                paddingAngle={2}
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(value, entry: { payload?: Item }) => (
                  <span className="text-sm text-slate-700">
                    {value}:{" "}
                    <strong>
                      {(entry.payload?.value ?? 0).toLocaleString("es-PE")}
                    </strong>
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-1 flex-col justify-center rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 sm:py-4">
          <p className="text-sm font-bold text-amber-900">
            Más de 1.8 millones con DNI vencido
          </p>
          <p className="mt-1 text-xs text-amber-800">
            La prórroga del Reniec permite que puedan votar el 12 de abril de
            2026.
          </p>
        </div>
      </div>
    </div>
  );
}
