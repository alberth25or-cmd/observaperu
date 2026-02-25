"use client";

import { useMemo } from "react";
import { ALL_CANDIDATES } from "@/data/candidatos";
import { computeAntecedentesKPIs, type AntecedentesRow } from "@/lib/antecedentesElectorales";
import AntecedentesKPICards from "./AntecedentesKPICards";
import AntecedentesTipoPostulacionChart from "./AntecedentesTipoPostulacionChart";
import AntecedentesDonutChart from "./AntecedentesDonutChart";
import AntecedentesSenadoDiputadoChart from "./AntecedentesSenadoDiputadoChart";
import AntecedentesHeatmap from "./AntecedentesHeatmap";
import AntecedentesInsights from "./AntecedentesInsights";

interface AntecedentesElectoralesSectionProps {
  data: AntecedentesRow[] | null;
}

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

export default function AntecedentesElectoralesSection({
  data,
}: AntecedentesElectoralesSectionProps) {
  const kpis = useMemo(() => {
    if (!data?.length) return null;
    return computeAntecedentesKPIs(data);
  }, [data]);

  const nombreToSlug = useMemo(() => {
    const map: Record<string, string> = {};
    const byNormalized = new Map<string, string>();
    for (const c of ALL_CANDIDATES) {
      byNormalized.set(normalizeName(c.name), c.key);
    }
    if (!data?.length) return map;
    for (const row of data) {
      const slug = byNormalized.get(normalizeName(row.candidato));
      if (slug) map[row.candidato] = slug;
    }
    return map;
  }, [data]);

  if (!data?.length) {
    return (
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
        <p className="text-center text-slate-500 text-sm py-6">
          No hay datos de antecedentes electorales disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0b1b3b] mb-1 sm:mb-2">
          ¿A cuántos cargos postulan?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Multipostulación: cuántos candidatos presidenciales postulan además a Senado o Diputado.
          Datos basados en declaraciones de candidaturas.
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <AntecedentesKPICards kpis={kpis} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Cantidad por tipo de postulación
          </h3>
          <AntecedentesTipoPostulacionChart
            data={kpis?.barrasTipoPostulacion ?? []}
          />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Solo Presidencia vs también otro cargo
          </h3>
          <AntecedentesDonutChart data={kpis?.donutSoloVsDoble ?? []} />
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
          Postulaciones a Senado y Diputado
        </h3>
        <div className="max-w-md">
          <AntecedentesSenadoDiputadoChart
            data={kpis?.senadoVsDiputado ?? []}
          />
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
          Matriz candidato × cargo
        </h3>
        <AntecedentesHeatmap
          filas={kpis?.filas ?? []}
          maxRows={kpis?.filas?.length ?? 50}
          nombreToSlug={nombreToSlug}
        />
      </div>

      <AntecedentesInsights kpis={kpis} />
    </div>
  );
}
