"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const REGIONS = ["Lima", "Norte", "Centro", "Sur", "Oriente", "Rural"];
const CANDIDATE_LABELS = ["Keiko", "C. Álvarez", "R. Aliaga", "R. Sánchez", "J. Nieto", "C. Acuña", "A. Chau"];

// votos válidos por región: [Lima, Norte, Centro, Sur, Oriente, Rural]
// Fuente: Simulacro Ipsos · 01–02 abr 2026
const DATA_BY_CANDIDATE = [
  [18.2, 21.3, 20.3, 22.2,  1.3, 17.6],  // Keiko
  [18.6,  2.7, 11.2,  8.3,  5.5, 11.4],  // C. Álvarez
  [15.5,  7.6,  8.4,  8.1,  9.3,  8.8],  // R. Aliaga
  [ 2.8, 20.5,  3.2,  8.8, 27.8,  8.6],  // R. Sánchez
  [ 8.7,  3.0,  3.5,  5.6,  4.8,  4.4],  // J. Nieto
  [ 1.4,  9.1, 11.5,  5.1,  1.1,  6.2],  // C. Acuña
  [ 4.3,  5.0,  4.3,  6.3,  6.4,  4.2],  // A. Chau
];

const CANDIDATE_COLORS = ["#185FA5", "#854F0B", "#0F6E56", "#993C1D", "#888780", "#7F77DD", "#D85A30"];
const REGION_COLORS   = ["#185FA5", "#0F6E56", "#854F0B", "#D85A30", "#7F77DD", "#888780"];

type View = "candidate" | "region";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs min-w-[160px]">
      <p className="font-bold text-[#1b2b5a] mb-2 pb-1 border-b border-slate-100">{label}</p>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex justify-between gap-3 py-0.5">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm inline-block" style={{ backgroundColor: p.fill }} />
            <span className="text-slate-600">{p.name}</span>
          </span>
          <span className="font-bold text-[#1b2b5a]">{(p.value as number).toFixed(1)}%</span>
        </div>
      ))}
    </div>
  );
};

export default function EncuestaSimulacroPorRegionAbril() {
  const [view, setView] = useState<View>("candidate");

  const chartData =
    view === "candidate"
      ? REGIONS.map((r, ri) => {
          const row: Record<string, string | number> = { name: r };
          CANDIDATE_LABELS.forEach((c, ci) => { row[c] = DATA_BY_CANDIDATE[ci][ri]; });
          return row;
        })
      : CANDIDATE_LABELS.map((c, ci) => {
          const row: Record<string, string | number> = { name: c };
          REGIONS.forEach((r, ri) => { row[r] = DATA_BY_CANDIDATE[ci][ri]; });
          return row;
        });

  const keys   = view === "candidate" ? CANDIDATE_LABELS : REGIONS;
  const colors = view === "candidate" ? CANDIDATE_COLORS : REGION_COLORS;

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#1b2b5a] mb-1">
            Simulacro por macrorregión — Votos válidos (%)
          </h3>
          <p className="text-xs text-slate-500">Simulacro Ipsos · 01–02 abr 2026 · n=1,192</p>
        </div>
        <div className="flex gap-2 shrink-0">
          {(["candidate", "region"] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
                view === v
                  ? "bg-[#1b2b5a] text-white border-[#1b2b5a]"
                  : "bg-white text-[#1b2b5a] border-slate-300 hover:border-[#1b2b5a]"
              }`}
            >
              {v === "candidate" ? "Por candidato" : "Por región"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        {keys.map((k, i) => (
          <span key={k} className="flex items-center gap-1.5 text-xs text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: colors[i] }} />
            {k}
          </span>
        ))}
      </div>

      <div className="bg-[#eef2fb] rounded-xl px-4 py-3 text-sm text-slate-700 mb-4">
        <p>
          En Lima,{" "}
          <strong className="text-[#1b2b5a]">Carlos Álvarez (18.6%) y Keiko Fujimori (18.2%) empatan técnicamente</strong>,
          seguidos de López Aliaga (15.5%). En el Norte,{" "}
          <strong className="text-[#1b2b5a]">Keiko lidera con 21.3%</strong> y Roberto Sánchez asciende al 20.5%.
          En el Centro destaca Acuña (11.5%). En el Oriente,{" "}
          <strong className="text-[#1b2b5a]">Roberto Sánchez domina con 27.8%</strong>.
          En el ámbito Rural, Keiko mantiene 17.6%.
        </p>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 8 }} barCategoryGap="22%" barGap={2}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#dde3f0" />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#1b2b5a", fontWeight: 600 }} tickLine={false} axisLine={{ stroke: "#dde3f0" }} />
          <YAxis domain={[0, 35]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "#eef2fb" }} />
          {keys.map((k, i) => (
            <Bar key={k} dataKey={k} name={k} fill={colors[i]} radius={[3, 3, 0, 0]} maxBarSize={18} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
