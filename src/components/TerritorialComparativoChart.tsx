"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface Item {
  departamento: string;
  nacimiento: number;
  domicilio: number;
}

interface TerritorialComparativoChartProps {
  topNacimiento: Array<{ departamento: string; count: number }>;
  topDomicilio: Array<{ departamento: string; count: number }>;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg text-left">
      <p className="font-semibold text-[#0b1b3b] text-sm mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-xs text-slate-600">
          {p.name}: {p.value} candidatos
        </p>
      ))}
    </div>
  );
}

export default function TerritorialComparativoChart({
  topNacimiento,
  topDomicilio,
}: TerritorialComparativoChartProps) {
  const byDepto = new Map<string, { nacimiento: number; domicilio: number }>();
  for (const r of topNacimiento) {
    byDepto.set(r.departamento, { nacimiento: r.count, domicilio: 0 });
  }
  for (const r of topDomicilio) {
    const prev = byDepto.get(r.departamento) ?? { nacimiento: 0, domicilio: 0 };
    prev.domicilio = r.count;
    byDepto.set(r.departamento, prev);
  }
  const data: Item[] = Array.from(byDepto.entries())
    .map(([departamento, v]) => ({ departamento, ...v }))
    .filter((d) => d.nacimiento > 0 || d.domicilio > 0)
    .sort(
      (a, b) =>
        Math.max(b.nacimiento, b.domicilio) -
        Math.max(a.nacimiento, a.domicilio),
    )
    .slice(0, 10);

  if (data.length === 0) {
    return (
      <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 16, left: 8, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="departamento"
            tick={{ fontSize: 10, fill: "#475569" }}
            stroke="#94a3b8"
          />
          <YAxis tick={{ fontSize: 11, fill: "#64748b" }} stroke="#94a3b8" />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => (
              <span className="text-xs sm:text-sm text-slate-700">{value}</span>
            )}
          />
          <Bar
            dataKey="nacimiento"
            name="Nacimiento"
            fill="#1b2b5a"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
          <Bar
            dataKey="domicilio"
            name="Domicilio"
            fill="#4A90E2"
            radius={[4, 4, 0, 0]}
            maxBarSize={32}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
