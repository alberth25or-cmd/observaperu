"use client";

import type { TerritorialKPIs } from "@/lib/territorialAnalytics";

const COLORS = ["#1b2b5a", "#2E7D8F", "#4A90E2", "#8B9DC3", "#0f1d46", "#6B9BD1"];

interface TerritorialKPICardsProps {
  kpis: TerritorialKPIs | null;
}

export default function TerritorialKPICards({ kpis }: TerritorialKPICardsProps) {
  if (!kpis) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No hay datos territoriales disponibles
      </div>
    );
  }

  const cards = [
    {
      label: "Lima (nacimiento)",
      value: `${kpis.pctLimaNacimiento}%`,
      sub: `${kpis.limaMetroNacimiento} de ${kpis.total} candidatos`,
      color: COLORS[0],
    },
    {
      label: "Lima (domicilio)",
      value: `${kpis.pctLimaDomicilio}%`,
      sub: `${kpis.limaLMetroDomicilio} de ${kpis.totalConDomicilio} con dato`,
      color: COLORS[1],
    },
    {
      label: "Migraron de depto",
      value: `${kpis.pctMigraron}%`,
      sub: `${kpis.migraron} candidatos`,
      color: COLORS[2],
    },
    {
      label: "Flujo neto a Lima",
      value: kpis.flujoNetoLima >= 0 ? `+${kpis.flujoNetoLima}` : `${kpis.flujoNetoLima}`,
      sub: kpis.flujoNetoLima >= 0 ? "Más llegan que se van" : "Más se van que llegan",
      color: COLORS[3],
    },
    {
      label: "Concentración (nac.)",
      value: kpis.concentracionNacimiento,
      sub: `HHI ${kpis.hhiNacimiento}`,
      color: COLORS[4],
    },
    {
      label: "Deptos representados",
      value: `${kpis.deptosRepresentadosNacimiento} nac. / ${kpis.deptosRepresentadosDomicilio} dom.`,
      sub: "Nacimiento vs domicilio",
      color: COLORS[5],
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="text-[10px] sm:text-xs font-semibold text-slate-600 mb-1 sm:mb-2">
            {card.label}
          </div>
          <div
            className="text-base sm:text-lg font-extrabold leading-tight"
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
