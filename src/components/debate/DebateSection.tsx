"use client";

import { DebateStats } from "@/lib/debateAnalytics";
import DebateKPICards from "./DebateKPICards";
import DebateTiempoChart from "./DebateTiempoChart";
import DebateAgresividadChart from "./DebateAgresividadChart";
import DebateAtaquesNetwork from "./DebateAtaquesNetwork";
import DebateRadarTemas from "./DebateRadarTemas";
import DebateEstiloChart from "./DebateEstiloChart";

interface Props {
  data: DebateStats;
}

export default function DebateSection({ data }: Props) {
  return (
    <section>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b2b5a] leading-tight">
            Debate Presidencial 2026
          </h2>
          <span className="bg-red-100 text-red-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Primera jornada
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Análisis estadístico del debate del{" "}
          <strong>23 de marzo de 2026</strong> &mdash; 11 candidatos,{" "}
          {data.metadata.duracionLabel} de debate, {data.metadata.segmentos} segmentos
          transcritos y clasificados automáticamente.
        </p>
      </div>

      {/* KPIs */}
      <DebateKPICards data={data} />

      {/* Tiempo de habla — quién dominó el debate */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
        <DebateTiempoChart candidatos={data.candidatos} />
      </div>

      {/* Termómetro de agresividad */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
        <DebateAgresividadChart candidatos={data.candidatos} />
      </div>

      {/* Red de ataques + Radar de temas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          <DebateAtaquesNetwork
            candidatos={data.candidatos}
            redAtaques={data.redAtaques}
          />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          <DebateRadarTemas candidatos={data.candidatos} />
        </div>
      </div>

      {/* Estilo del discurso — scatter quadrant */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
        <DebateEstiloChart candidatos={data.candidatos} />
      </div>

      {/* Footer note */}
      <p className="text-xs text-slate-400 mt-4 text-center">
        Debate JNE/TV Perú 23/03/2026. Clasificación de tono mediante análisis de palabras clave.
        Los porcentajes son aproximaciones basadas en el contenido transcrito.
      </p>
    </section>
  );
}
