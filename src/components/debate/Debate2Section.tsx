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

export default function Debate2Section({ data }: Props) {
  return (
    <section>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b2b5a] leading-tight">
            Debate Presidencial 2026
          </h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Segunda jornada
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Análisis estadístico del debate del{" "}
          <strong>24 de marzo de 2026</strong> &mdash; {data.metadata.candidatos} candidatos,{" "}
          {data.metadata.duracionLabel} de debate, {data.metadata.segmentos} segmentos
          transcritos y clasificados automáticamente.
        </p>
      </div>

      {/* KPIs */}
      <DebateKPICards data={data} />

      {/* Tiempo de habla */}
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

      {/* Estilo del discurso */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
        <DebateEstiloChart candidatos={data.candidatos} />
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-400 mt-4 text-center">
        Debate JNE/TV Perú 24/03/2026. Clasificación de tono mediante análisis de palabras clave.
        Los porcentajes son aproximaciones basadas en el contenido transcrito.
      </p>
    </section>
  );
}
