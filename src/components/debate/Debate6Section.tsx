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

export default function Debate6Section({ data }: Props) {
  const topSpeaker = [...data.candidatos].sort((a, b) => b.tiempoSegundos - a.tiempoSegundos)[0];
  const mostAggressive = [...data.candidatos].sort((a, b) => b.porcentajeAtaque - a.porcentajeAtaque)[0];
  const totalAtaques = data.redAtaques.reduce((sum, e) => sum + e.count, 0);

  return (
    <section>
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b2b5a] leading-tight">
            Debate JNE Perú 2026 — Sexta Jornada (1 abr)
          </h2>
          <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
            Sexta jornada
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Análisis estadístico del{" "}
          <strong>debate presidencial JNE del 1 de abril de 2026</strong> &mdash;{" "}
          {data.metadata.candidatos} candidatos, {data.metadata.duracionLabel} de debate,{" "}
          {data.metadata.segmentos} segmentos transcritos y clasificados automáticamente.
          Temas: <strong>educación, innovación, empleo y desarrollo</strong>.
        </p>
      </div>

      <DebateKPICards data={data} jornada="Sexta jornada" />

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
        <DebateTiempoChart candidatos={data.candidatos} />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
        <DebateAgresividadChart candidatos={data.candidatos} />
      </div>

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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
        <DebateEstiloChart candidatos={data.candidatos} />
      </div>

      <div className="bg-[#eef2fb] rounded-xl px-4 py-3 text-sm text-slate-700 mb-4">
        <p>
          En la sexta jornada del debate JNE 2026 (temas: educación, innovación y empleo),{" "}
          <strong className="text-[#1b2b5a]">{topSpeaker?.nombre}</strong> lideró el tiempo de
          habla con {topSpeaker?.tiempoLabel}, mientras{" "}
          <strong className="text-[#1b2b5a]">{mostAggressive?.nombre}</strong> registró el mayor
          índice de agresividad ({mostAggressive?.porcentajeAtaque}% de su discurso en ataques).
          Se contabilizaron {totalAtaques} ataques directos entre candidatos.
        </p>
      </div>

      <p className="text-xs text-slate-400 mt-4 text-center">
        Debate JNE/TV Perú 01/04/2026.{" "}
        <strong>Metodología:</strong> Tiempo de habla e intervenciones medidos sobre transcripción
        completa. Clasificación de tono por análisis de palabras clave. Margen de error ±5%.
      </p>
    </section>
  );
}
