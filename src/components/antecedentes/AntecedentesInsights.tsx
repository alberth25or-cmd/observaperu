"use client";

import type { AntecedentesKPIs } from "@/lib/antecedentesElectorales";

interface AntecedentesInsightsProps {
  kpis: AntecedentesKPIs | null;
}

export default function AntecedentesInsights({ kpis }: AntecedentesInsightsProps) {
  if (!kpis) return null;

  const pct = Math.round(kpis.pctTambienOtroCargo);

  return (
    <div className="space-y-6">
      {/* KPI destacado */}
      <div className="rounded-xl bg-[#0b1b3b] text-white p-4 sm:p-6 text-center">
        <p className="text-sm sm:text-base font-medium opacity-90 mb-1">
          Candidatos presidenciales que además postulan a otro cargo
        </p>
        <p className="text-3xl sm:text-4xl font-bold">{pct}%</p>
        <p className="text-xs sm:text-sm opacity-80 mt-1">
          {kpis.doblePostulacion} de {kpis.totalCandidatos} candidatos
        </p>
      </div>

      {/* Análisis interpretativo */}
      <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700">
        <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-2">
          ¿Qué muestra esta información?
        </h3>
        <p>
          La multipostulación ocurre cuando un candidato se presenta a más de un cargo en la misma elección (por ejemplo, Presidencia y Senado, o Presidencia y Diputado). Los datos reflejan cuántos candidatos presidenciales concentran su postulación solo en la presidencia y cuántos suman además una candidatura a Congreso.
        </p>
        <p>
          En esta elección, la mayoría de quienes postulan a la Presidencia también postulan a Senado; un grupo menor lo hace a Diputado. Ningún candidato en la muestra postula a los tres cargos a la vez. Estos patrones permiten a la ciudadanía ver de forma objetiva cómo se distribuye la oferta electoral entre cargos.
        </p>
        <p className="text-slate-600 text-xs sm:text-sm">
          Observa Perú presenta estos datos con fines informativos. La interpretación de su significado político corresponde a la ciudadanía.
        </p>
      </div>
    </div>
  );
}
