"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#2E7D8F", "#4A90E2"];

interface TerritorialMovilidadChartProps {
  mismoDepartamento: number;
  migraron: number;
}

export default function TerritorialMovilidadChart({
  mismoDepartamento,
  migraron,
}: TerritorialMovilidadChartProps) {
  const total = mismoDepartamento + migraron;
  if (total === 0) {
    return (
      <div className="h-[220px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  const data = [
    { name: "Mismo departamento", value: mismoDepartamento },
    { name: "Migraron (otro depto)", value: migraron },
  ];

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
              <Cell key={i} fill={COLORS[i]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} candidatos`, ""]}
            contentStyle={{
              backgroundColor: "white",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
            }}
          />
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
