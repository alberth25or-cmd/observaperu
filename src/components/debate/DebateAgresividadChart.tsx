"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { DebateCandidato } from "@/lib/debateAnalytics";

// Colores armónicos con la paleta de la página (#0b1b3b, #eef2fb)
const COLOR_ATAQUE    = "#c0392b"; // rojo oscuro — agresión
const COLOR_PROPUESTA = "#1a7a6e"; // teal oscuro — propositivo (complemento del navy)
const COLOR_NEUTRO    = "#c8d3e8"; // azul claro — neutro (tono del fondo #eef2fb)

interface Props {
  candidatos: DebateCandidato[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;

  // Buscar datos completos del candidato en el payload
  const ataque   = payload.find((p: any) => p.dataKey === "Ataques")?.value ?? 0;
  const propuesta = payload.find((p: any) => p.dataKey === "Propuestas")?.value ?? 0;
  const neutro   = payload.find((p: any) => p.dataKey === "Neutro")?.value ?? 0;

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-4 text-sm min-w-[180px]">
      <p className="font-bold text-[#1b2b5a] mb-3 border-b border-slate-100 pb-2">{label}</p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: COLOR_ATAQUE }} />
            <span className="text-slate-600">Ataques</span>
          </span>
          <span className="font-bold" style={{ color: COLOR_ATAQUE }}>{ataque.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: COLOR_PROPUESTA }} />
            <span className="text-slate-600">Propuestas</span>
          </span>
          <span className="font-bold" style={{ color: COLOR_PROPUESTA }}>{propuesta.toFixed(1)}%</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ background: "#94a3b8" }} />
            <span className="text-slate-600">Neutro</span>
          </span>
          <span className="font-bold text-slate-500">{neutro.toFixed(1)}%</span>
        </div>
      </div>
    </div>
  );
};

export default function DebateAgresividadChart({ candidatos }: Props) {
  const data = [...candidatos]
    .sort((a, b) => b.porcentajeAtaque - a.porcentajeAtaque)
    .map((c) => ({
      nombre: c.nombre.split(" ").slice(0, 2).join(" "),
      Ataques:    c.porcentajeAtaque,
      Propuestas: c.porcentajePropuesta,
      Neutro:     c.porcentajeNeutro,
    }));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h3 className="text-lg font-bold text-[#1b2b5a]">
          Termometro de tono del discurso
        </h3>
        <span className="text-xs text-slate-500 bg-[#eef2fb] border border-slate-200 px-2.5 py-1 rounded-full">
          % de intervenciones por tipo — ordenado por agresividad
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Cada categoria es <strong>mutuamente exclusiva</strong>: si una intervencion contiene
        lenguaje de ataque, se clasifica como ataque aunque tambien incluya propuestas.
        Ordenado de mayor a menor agresividad.
      </p>

      <ResponsiveContainer width="100%" height={430}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 30, left: 10, bottom: 0 }}
          barCategoryGap="20%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#dde3f0" />
          <XAxis
            type="number"
            domain={[0, 100]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
            axisLine={{ stroke: "#dde3f0" }}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="nombre"
            width={115}
            tick={{ fontSize: 12, fill: "#1b2b5a", fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eef2fb" }} />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            formatter={(value) => (
              <span style={{ color: "#475569", fontWeight: 600 }}>{value}</span>
            )}
          />
          <Bar dataKey="Ataques"    stackId="a" fill={COLOR_ATAQUE}    isAnimationActive={true} />
          <Bar dataKey="Propuestas" stackId="a" fill={COLOR_PROPUESTA} isAnimationActive={true} />
          <Bar dataKey="Neutro"     stackId="a" fill={COLOR_NEUTRO}    radius={[0, 5, 5, 0]} isAnimationActive={true} />
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Clasificación por análisis de palabras clave · Debate JNE 23/03/2026
      </p>
    </div>
  );
}
