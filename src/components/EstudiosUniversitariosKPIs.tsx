"use client";

import type { EstudiosKPIs } from "@/lib/estudiosUniversitarios";

const COLORS = ["#1b2b5a", "#2E7D8F", "#4A90E2", "#8B9DC3", "#0f1d46"];

function concentracionLabel(hhi: number): string {
  if (hhi < 1000) return "Baja";
  if (hhi < 1800) return "Moderada";
  return "Alta";
}

interface EstudiosUniversitariosKPIsProps {
  kpis: EstudiosKPIs | null;
}

export default function EstudiosUniversitariosKPIs({ kpis }: EstudiosUniversitariosKPIsProps) {
  if (!kpis) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No hay datos de estudios disponibles
      </div>
    );
  }

  const cards = [
    {
      label: "Con estudios concluidos",
      value: `${kpis.pctConcluidos}%`,
      color: COLORS[0],
    },
    {
      label: "Sin información",
      value: `${kpis.pctSinInfo}%`,
      color: COLORS[1],
    },
    {
      label: "Concentración (HHI)",
      value: kpis.hhi.toString(),
      sub: concentracionLabel(kpis.hhi),
      color: COLORS[2],
    },
    {
      label: "Diversidad áreas",
      value: kpis.entropiaAreas.toFixed(2),
      sub: "bits",
      color: COLORS[3],
    },
    {
      label: "Total con datos",
      value: `${kpis.conDatos} / ${kpis.totalCandidatos}`,
      color: COLORS[4],
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-1 sm:mb-2">
            {card.label}
          </div>
          <div
            className="text-base sm:text-lg lg:text-xl font-extrabold leading-tight"
            style={{ color: card.color }}
          >
            {card.value}
          </div>
          {card.sub && (
            <div className="text-[10px] sm:text-xs text-slate-500 mt-0.5">{card.sub}</div>
          )}
        </div>
      ))}
    </div>
  );
}
