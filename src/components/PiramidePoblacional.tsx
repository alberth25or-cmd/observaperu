"use client";

import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  CartesianGrid,
} from "recharts";

interface CandidatoEdad {
  slug: string;
  nombre: string;
  fecha_nacimiento: string;
  edad: number;
}

interface PiramidePoblacionalProps {
  data: CandidatoEdad[];
}

const RANGOS = [
  { label: "30s", min: 30, max: 39, color: "#6B9BD1" },
  { label: "40s", min: 40, max: 49, color: "#4A90E2" },
  { label: "50s", min: 50, max: 59, color: "#2E7D8F" },
  { label: "60s", min: 60, max: 69, color: "#1b2b5a" },
  { label: "70s", min: 70, max: 79, color: "#0f1d46" },
  { label: "80+", min: 80, max: 100, color: "#8B9DC3" },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
        <p className="font-semibold text-[#0b1b3b]">{data.rango}</p>
        <p className="text-sm text-slate-600">{data.count} candidatos</p>
        <p className="text-xs text-slate-500 mt-1">{data.percentage}% del total</p>
      </div>
    );
  }
  return null;
};

export default function PiramidePoblacional({ data }: PiramidePoblacionalProps) {
  const chartData = useMemo(() => {
    const total = data.length;
    const rangos = RANGOS.map((rango) => {
      const count = data.filter(
        (c) => c.edad >= rango.min && c.edad <= rango.max
      ).length;
      return {
        rango: rango.label,
        count,
        percentage: ((count / total) * 100).toFixed(1),
        color: rango.color,
      };
    });

    return rangos;
  }, [data]);

  return (
    <div className="w-full bg-white rounded-2xl p-8 shadow-lg border border-slate-100">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-extrabold text-[#0b1b3b] mb-2">
          Distribución por rangos de edad
        </h2>
        <p className="text-base text-slate-600">
          Pirámide poblacional invertida - Estilo INEI
        </p>
      </div>

      {/* Gráfico */}
      <div className="w-full">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis
              type="number"
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              label={{
                value: "Número de candidatos",
                position: "insideBottom",
                offset: -10,
                fill: "#475569",
                fontSize: 14,
                fontWeight: 600,
              }}
              stroke="#e2e8f0"
            />
            <YAxis
              type="category"
              dataKey="rango"
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              stroke="#e2e8f0"
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Leyenda */}
      <div className="mt-6 pt-6 border-t border-slate-200">
        <div className="flex flex-wrap gap-4 justify-center">
          {RANGOS.map((rango) => (
            <div key={rango.label} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: rango.color }}
              />
              <span className="text-sm text-slate-600">
                {rango.label} ({rango.min}-{rango.max === 100 ? "+" : rango.max} años)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

