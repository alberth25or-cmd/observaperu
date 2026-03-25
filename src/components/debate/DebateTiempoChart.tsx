"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell, LabelList,
} from "recharts";
import { DebateCandidato, CANDIDATE_COLORS } from "@/lib/debateAnalytics";

const SHORT: Record<string, string> = {
  alex_gonzalez:     "Alex González",
  carlos_alvarez:    "C. Álvarez",
  cesar_acuna:       "César Acuña",
  fernando_oliveira: "F. Oliveira",
  johnny_lescano:    "J. Lescano",
  jose_luna:         "José Luna",
  jose_williams:     "J. Williams",
  marisol_perez:     "M. Pérez",
  pablo_lopez:       "P. López",
  lopez_aliaga:      "L. Aliaga",
  wolfgang_grosso:   "Wolfgang",
};

interface Props {
  candidatos: DebateCandidato[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload;
  if (!d) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-sm min-w-[210px]">
      <p className="font-bold text-[#1b2b5a] mb-2 pb-1.5 border-b border-slate-100">{label}</p>
      <div className="space-y-1 text-xs text-slate-600">
        <div className="flex justify-between gap-4">
          <span>Tiempo de habla</span>
          <span className="font-bold text-[#1b2b5a]">{d.tiempoLabel}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Palabras totales</span>
          <span className="font-bold text-[#1b2b5a]">{d.palabras.toLocaleString()}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Intervenciones</span>
          <span className="font-bold text-[#1b2b5a]">{d.intervenciones}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span>Promedio/intervención</span>
          <span className="font-bold text-[#1b2b5a]">{d.promSegs}s</span>
        </div>
      </div>
    </div>
  );
};

export default function DebateTiempoChart({ candidatos }: Props) {
  const data = [...candidatos]
    .sort((a, b) => b.tiempoSegundos - a.tiempoSegundos)
    .map(c => ({
      nombre: SHORT[c.key] ?? c.nombre.split(" ").slice(0, 2).join(" "),
      key: c.key,
      minutos: Math.round(c.tiempoSegundos / 6) / 10,
      palabras: c.palabrasTotales,
      intervenciones: c.intervenciones,
      promSegs: c.promSegPorInterv,
      tiempoLabel: c.tiempoLabel,
    }));

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <h3 className="text-lg font-bold text-[#1b2b5a]">¿Quién dominó el debate?</h3>
        <span className="text-xs text-slate-500 bg-[#eef2fb] border border-slate-200 px-2.5 py-1 rounded-full">
          Tiempo de habla efectiva
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-6">
        Minutos de habla por candidato, ordenado de mayor a menor. El número a la derecha
        muestra las palabras totales — indicador de densidad informativa del discurso.
        Hover para ver el promedio por intervención.
      </p>

      <ResponsiveContainer width="100%" height={candidatos.length * 46 + 40}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 100, left: 10, bottom: 0 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#dde3f0" />
          <XAxis
            type="number"
            tickFormatter={(v) => `${v}m`}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={{ stroke: "#dde3f0" }}
            domain={[0, 14]}
            tickCount={8}
          />
          <YAxis
            type="category"
            dataKey="nombre"
            width={100}
            tick={{ fontSize: 12, fill: "#1b2b5a", fontWeight: 700 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eef2fb" }} />
          <Bar dataKey="minutos" radius={[0, 6, 6, 0]}>
            {data.map(d => (
              <Cell key={d.key} fill={CANDIDATE_COLORS[d.key] ?? "#94a3b8"} />
            ))}
            <LabelList
              dataKey="palabras"
              position="right"
              formatter={(v: any) => typeof v === "number" ? `${v.toLocaleString()} pal.` : ""}
              style={{ fontSize: 10, fill: "#64748b" }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Debate JNE 23/03/2026 · Solo tiempo efectivo de candidatos
      </p>
    </div>
  );
}
