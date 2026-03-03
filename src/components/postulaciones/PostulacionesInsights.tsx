"use client";

import type { PostulacionesKPIs } from "@/lib/postulacionesAnalytics";

interface PostulacionesInsightsProps {
  kpis: PostulacionesKPIs | null;
}

export default function PostulacionesInsights({ kpis }: PostulacionesInsightsProps) {
  if (!kpis) return null;

  const modaTotalStr = kpis.modaTotal !== null ? String(kpis.modaTotal) : "—";
  const modaPresStr = kpis.modaPresidencia !== null ? String(kpis.modaPresidencia) : "—";

  return (
    <div className="space-y-6">
      <div className="rounded-xl bg-[#0b1b3b] text-white p-4 sm:p-6">
        <p className="text-sm sm:text-base font-medium opacity-90 mb-1">
          Proporción de candidatos que han postulado al menos una vez a la Presidencia
        </p>
        <p className="text-3xl sm:text-4xl font-bold">
          {kpis.proporcionAlMenosUnaPresidencia.toFixed(1)}%
        </p>
        <p className="text-xs sm:text-sm opacity-80 mt-1">
          Datos referidos a procesos electorales anteriores a las elecciones actuales.
        </p>
      </div>

      <div className="prose prose-slate max-w-none text-sm sm:text-base text-slate-700">
        <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-2">
          Interpretación estadística
        </h3>
        <p>
          La <strong>persistencia política</strong> (número total de postulaciones) presenta una
          media de {kpis.mediaTotal.toFixed(2)} y una mediana de {kpis.medianaTotal}, con una
          dispersión alta (coeficiente de variación {kpis.cvTotal.toFixed(1)}%). La moda en total
          de postulaciones es {modaTotalStr}. El coeficiente de Gini ({kpis.giniTotal.toFixed(3)})
          indica una concentración moderada: un subconjunto de candidatos acumula una proporción
          relevante de las postulaciones totales (curva de Pareto).
        </p>
        <p>
          La <strong>ambición presidencial</strong> (veces que postularon a la Presidencia) tiene
          media {kpis.mediaPresidencia.toFixed(2)} y mediana {kpis.medianaPresidencia}; moda {modaPresStr}.
          La correlación de Pearson entre total de postulaciones y postulaciones a presidencia es{" "}
          {kpis.correlacionPearson.toFixed(3)}: existe una relación lineal positiva entre ambas
          variables; a mayor persistencia en postulaciones, tiende a ser mayor el número de
          intentos a la Presidencia en este grupo.
        </p>
        <p>
          El <strong>Índice de Ambición Presidencial</strong> (postulaciones a presidencia / total
          de postulaciones) permite comparar, entre quienes han postulado más de una vez, qué
          fracción de su trayectoria electoral se ha dirigido a la Presidencia. Los gráficos de
          dispersión y Pareto facilitan identificar candidatos con alta persistencia y
          concentración de la oferta electoral en pocos nombres.
        </p>
        <p className="text-slate-600 text-xs sm:text-sm">
          Observa Perú presenta este análisis con fines informativos. Los datos no incluyen las
          postulaciones de las elecciones actuales. La interpretación política corresponde a la
          ciudadanía.
        </p>
      </div>
    </div>
  );
}
