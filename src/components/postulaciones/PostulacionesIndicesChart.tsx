"use client";

import type { PostulacionesKPIs } from "@/lib/postulacionesAnalytics";

interface PostulacionesIndicesChartProps {
  kpis: PostulacionesKPIs | null;
}

/** Escala máxima razonable para el índice de persistencia (media de postulaciones) */
const PERSISTENCIA_SCALE = 10;

export default function PostulacionesIndicesChart({
  kpis,
}: PostulacionesIndicesChartProps) {
  if (!kpis) return null;

  const persistencia = kpis.indicePersistenciaMedia;
  const ambicionPct = kpis.indiceAmbicionMedia * 100;
  const persistenciaBarPct = Math.min(
    100,
    (persistencia / PERSISTENCIA_SCALE) * 100
  );

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm">
      <h3 className="text-sm font-bold text-[#0b1b3b] mb-4">
        Indicadores de persistencia y ambición
      </h3>
      <p className="text-xs text-slate-600 mb-4">
        Resumen de cuántas veces en promedio han postulado los candidatos y qué
        proporción de sus postulaciones han sido a la Presidencia.
      </p>
      <div className="space-y-5">
        <div>
          <div className="flex justify-between items-baseline gap-2 mb-1.5">
            <span className="text-xs font-medium text-slate-700">
              Índice de Persistencia Política
            </span>
            <span className="text-sm font-bold text-[#0b1b3b] tabular-nums">
              {persistencia.toFixed(2)}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mb-1">
            Promedio de postulaciones por candidato (escala 0–{PERSISTENCIA_SCALE})
          </p>
          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${persistenciaBarPct}%`,
                backgroundColor: "#1b2b5a",
              }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-baseline gap-2 mb-1.5">
            <span className="text-xs font-medium text-slate-700">
              Índice de Ambición Presidencial
            </span>
            <span className="text-sm font-bold text-[#0b1b3b] tabular-nums">
              {ambicionPct.toFixed(1)}%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mb-1">
            Proporción de postulaciones que fueron a Presidencia (0–100%)
          </p>
          <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${Math.min(100, ambicionPct)}%`,
                backgroundColor: "#2E7D8F",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
