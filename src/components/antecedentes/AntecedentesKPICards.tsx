"use client";

import type { AntecedentesKPIs } from "@/lib/antecedentesElectorales";

const COLORS = [
  "#1b2b5a",
  "#2E7D8F",
  "#4A90E2",
  "#8B9DC3",
  "#0f1d46",
  "#6B9BD1",
];

interface AntecedentesKPICardsProps {
  kpis: AntecedentesKPIs | null;
}

export default function AntecedentesKPICards({
  kpis,
}: AntecedentesKPICardsProps) {
  if (!kpis) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No hay datos de antecedentes disponibles.
      </div>
    );
  }

  const cards = [
    {
      label: "Total candidatos",
      value: String(kpis.totalCandidatos),
      sub: "presidenciales",
      color: COLORS[0],
    },
    {
      label: "Solo Presidencia",
      value: `${kpis.pctSoloPresidencia.toFixed(0)}%`,
      sub: `${kpis.soloPresidencia} candidatos`,
      color: COLORS[1],
    },
    {
      label: "Doble postulación",
      value: `${kpis.pctDoblePostulacion.toFixed(0)}%`,
      sub: `${kpis.doblePostulacion} candidatos`,
      color: COLORS[2],
    },
    {
      label: "Postulan a Senado",
      value: `${kpis.pctPostulanSenado.toFixed(0)}%`,
      sub: `${kpis.postulanSenado} candidatos`,
      color: COLORS[3],
    },
    {
      label: "Postulan a Diputado",
      value: `${kpis.pctPostulanDiputado.toFixed(0)}%`,
      sub: `${kpis.postulanDiputado} candidatos`,
      color: COLORS[4],
    },
    {
      label: "Promedio cargos",
      value: kpis.promedioCargosPorCandidato.toFixed(2),
      sub: "por candidato",
      color: COLORS[5],
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div
            className="h-1 w-8 rounded-full mb-2"
            style={{ backgroundColor: card.color }}
          />
          <p className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wide">
            {card.label}
          </p>
          <p className="text-lg sm:text-xl font-bold text-[#0b1b3b] mt-0.5">
            {card.value}
          </p>
          <p className="text-xs text-slate-500 mt-0.5">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
