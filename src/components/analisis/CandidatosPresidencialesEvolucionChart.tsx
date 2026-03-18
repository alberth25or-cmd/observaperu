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
  { year: "1980", candidatos: 15 },
  { year: "1985", candidatos: 9 },
  { year: "1990", candidatos: 9 },
  { year: "1995", candidatos: 14 },
  { year: "2000", candidatos: 9 },
  { year: "2001", candidatos: 8 },
  { year: "2006", candidatos: 20 },
  { year: "2011", candidatos: 10 },
  { year: "2016", candidatos: 19 },
  { year: "2021", candidatos: 18 },
  { year: "2026", candidatos: 36 },
];

function CustomTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: { year: string; candidatos: number } }>;
}) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="font-semibold text-[#0b1b3b]">Elecciones {p.year}</p>
      <p className="text-sm text-slate-600">
        {p.candidatos} fórmulas presidenciales
      </p>
    </div>
  );
}

export default function CandidatosPresidencialesEvolucionChart() {
  return (
    <div className="my-8 w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#f5f7fb] p-4 sm:p-6">
      <p className="mb-4 text-sm font-semibold text-slate-600">
        Evolución del número de candidatos presidenciales (1980-2026)
      </p>
      <div className="h-[280px] w-full sm:h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
          >
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              axisLine={{ stroke: "#e2e8f0" }}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="candidatos" radius={[4, 4, 0, 0]} isAnimationActive>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.year === "2026" ? "#1b2b5a" : "#4A90E2"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-2 text-xs text-slate-500">
        * 2026: estimación según solicitudes de inscripción ante el JNE.
      </p>
    </div>
  );
}
