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

export default function Debate3Section({ data }: Props) {
  const topSpeaker = [...data.candidatos].sort((a, b) => b.tiempoSegundos - a.tiempoSegundos)[0];
  const mostAggressive = [...data.candidatos].sort((a, b) => b.porcentajeAtaque - a.porcentajeAtaque)[0];
  const totalAtaques = data.redAtaques.reduce((sum, e) => sum + e.count, 0);

  return (
    <section>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b2b5a] leading-tight">
            Debate JNE Perú 2026 — Tercera Jornada (25 mar)
          </h2>
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Tercera jornada
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Análisis estadístico del{" "}
          <strong>debate presidencial JNE del 25 de marzo de 2026</strong> &mdash;{" "}
          {data.metadata.candidatos} candidatos, {data.metadata.duracionLabel} de debate,{" "}
          {data.metadata.segmentos} segmentos transcritos y clasificados automáticamente.
        </p>
      </div>

      {/* KPIs */}
      <DebateKPICards data={data} jornada="Tercera jornada" />

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

      {/* Resumen textual SEO */}
      <div className="bg-[#eef2fb] rounded-xl px-4 py-3 text-sm text-slate-700 mb-4">
        <p>
          En la tercera jornada del debate JNE 2026,{" "}
          <strong className="text-[#1b2b5a]">{topSpeaker?.nombre}</strong> lideró el tiempo de
          habla con {topSpeaker?.tiempoLabel}, mientras{" "}
          <strong className="text-[#1b2b5a]">{mostAggressive?.nombre}</strong> registró el mayor
          índice de agresividad ({mostAggressive?.porcentajeAtaque}% de su discurso en ataques).
          Se contabilizaron {totalAtaques} ataques directos entre candidatos a lo largo del debate.
        </p>
      </div>

      {/* Footer */}
      <p className="text-xs text-slate-400 mt-4 text-center">
        Debate JNE/TV Perú 25/03/2026.{" "}
        <strong>Metodología:</strong> Tiempo de habla e intervenciones medidos sobre transcripción
        completa. Clasificación de tono (ataque / propuesta / neutro) por análisis de palabras clave.
        Margen de error en clasificación automática ±5%. Datos para uso periodístico e investigación.
      </p>
    </section>
  );
}
