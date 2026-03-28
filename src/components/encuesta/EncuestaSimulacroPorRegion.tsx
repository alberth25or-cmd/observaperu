"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const REGIONS = ["Lima", "Norte", "Centro", "Sur", "Oriente", "Rural"];
const CANDIDATE_LABELS = [
  "Keiko",
  "R. Aliaga",
  "A. Chau",
  "R. Sánchez",
  "C. Álvarez",
  "J. Nieto",
  "C. Acuña",
];
// Same order as CANDIDATE_LABELS: rows = candidatos, cols = [Lima, Norte, Centro, Sur, Oriente, Rural]
const DATA_BY_CANDIDATE = [
  [17.6, 19.6, 17.1,  1.0, 35.1, 16.6],
  [28.2,  9.8, 14.4, 14.1,  8.4, 14.0],
  [ 4.5,  3.0, 11.8, 24.2,  1.5, 12.9],
  [ 1.7, 15.8,  8.8,  7.4,  5.7, 19.7],
  [ 6.4, 11.6,  6.5,  3.3,  7.9,  4.8],
  [ 9.9,  2.2,  4.9,  4.0,  1.6,  1.1],
  [ 2.4, 12.7,  1.9,  1.3,  6.3, 10.8],
];
const CANDIDATE_COLORS = [
  "#185FA5", "#0F6E56", "#854F0B", "#993C1D",
  "#534AB7", "#888780", "#1D9E75",
];
const REGION_COLORS = [
  "#185FA5", "#0F6E56", "#854F0B",
  "#D85A30", "#7F77DD", "#888780",
];

type View = "candidate" | "region";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs min-w-[160px]">
      <p className="font-bold text-[#1b2b5a] mb-2 pb-1 border-b border-slate-100">
        {label}
      </p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-3 py-0.5">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-sm inline-block"
              style={{ backgroundColor: p.fill }}
            />
            <span className="text-slate-600">{p.name}</span>
          </span>
          <span className="font-bold text-[#1b2b5a]">
            {(p.value as number).toFixed(1)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default function EncuestaSimulacroPorRegion() {
  const [view, setView] = useState<View>("candidate");

  // Build Recharts-compatible flat data
  const chartData =
    view === "candidate"
      ? // X = regions, each Bar = one candidate
        REGIONS.map((r, ri) => {
          const row: Record<string, string | number> = { name: r };
          CANDIDATE_LABELS.forEach((c, ci) => {
            row[c] = DATA_BY_CANDIDATE[ci][ri];
          });
          return row;
        })
      : // X = candidates, each Bar = one region
        CANDIDATE_LABELS.map((c, ci) => {
          const row: Record<string, string | number> = { name: c };
          REGIONS.forEach((r, ri) => {
            row[r] = DATA_BY_CANDIDATE[ci][ri];
          });
          return row;
        });

  const keys = view === "candidate" ? CANDIDATE_LABELS : REGIONS;
  const colors = view === "candidate" ? CANDIDATE_COLORS : REGION_COLORS;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#1b2b5a] mb-1">
            Simulacro por macrorregión — Votos válidos (%)
          </h3>
          <p className="text-xs text-slate-500">
            Simulacro Ipsos · 22 marzo 2026 · n=1,189
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setView("candidate")}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
              view === "candidate"
                ? "bg-[#1b2b5a] text-white border-[#1b2b5a]"
                : "bg-white text-[#1b2b5a] border-slate-300 hover:border-[#1b2b5a]"
            }`}
          >
            Por candidato
          </button>
          <button
            onClick={() => setView("region")}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
              view === "region"
                ? "bg-[#1b2b5a] text-white border-[#1b2b5a]"
                : "bg-white text-[#1b2b5a] border-slate-300 hover:border-[#1b2b5a]"
            }`}
          >
            Por región
          </button>
        </div>
      </div>

      {/* Leyenda dinámica */}
      <div className="flex flex-wrap gap-3 mb-4">
        {keys.map((k, i) => (
          <span key={k} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block"
              style={{ backgroundColor: colors[i] }}
            />
            {k}
          </span>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
          barCategoryGap="22%"
          barGap={2}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#dde3f0"
          />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 10, fill: "#1b2b5a", fontWeight: 600 }}
            tickLine={false}
            axisLine={{ stroke: "#dde3f0" }}
          />
          <YAxis
            domain={[0, 42]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eef2fb" }} />
          {keys.map((k, i) => (
            <Bar
              key={k}
              dataKey={k}
              name={k}
              fill={colors[i]}
              radius={[3, 3, 0, 0]}
              maxBarSize={18}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
