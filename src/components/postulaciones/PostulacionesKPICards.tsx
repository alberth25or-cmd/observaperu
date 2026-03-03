"use client";

import type { PostulacionesKPIs } from "@/lib/postulacionesAnalytics";

const COLORS = ["#1b2b5a", "#2E7D8F", "#4A90E2", "#8B9DC3", "#0f1d46", "#6B9BD1"];

interface PostulacionesKPICardsProps {
  kpis: PostulacionesKPIs | null;
}

export default function PostulacionesKPICards({ kpis }: PostulacionesKPICardsProps) {
  if (!kpis) {
    return (
      <div className="text-center py-6 text-slate-500 text-sm">
        No hay datos de postulaciones disponibles.
      </div>
    );
  }

  const modaTotalStr = kpis.modaTotal !== null ? String(kpis.modaTotal) : "—";
  const cards = [
    { label: "Media (total postulaciones)", value: kpis.mediaTotal.toFixed(2), sub: "por candidato", color: COLORS[0] },
    { label: "Mediana (total)", value: String(kpis.medianaTotal), sub: "P50", color: COLORS[1] },
    { label: "Moda (total)", value: modaTotalStr, sub: "valor más frecuente", color: COLORS[2] },
    { label: "Desv. estándar", value: kpis.stdTotal.toFixed(2), sub: "total postulaciones", color: COLORS[3] },
    { label: "Coef. variación", value: `${kpis.cvTotal.toFixed(1)}%`, sub: "dispersión", color: COLORS[4] },
    { label: "Mín / Máx", value: `${kpis.minTotal} – ${kpis.maxTotal}`, sub: "total postulaciones", color: COLORS[5] },
    { label: "P25 / P75", value: `${kpis.p25Total} – ${kpis.p75Total}`, sub: "percentiles", color: COLORS[0] },
    { label: "% con ≥1 a presidencia", value: `${kpis.proporcionAlMenosUnaPresidencia.toFixed(0)}%`, sub: `${kpis.n} candidatos`, color: COLORS[1] },
    { label: "Gini (total)", value: kpis.giniTotal.toFixed(3), sub: "0=igualdad, 1=concentración", color: COLORS[2] },
    { label: "Correlación Pearson", value: kpis.correlacionPearson.toFixed(3), sub: "total vs presidencia", color: COLORS[3] },
    { label: "Índice Persistencia (media)", value: kpis.indicePersistenciaMedia.toFixed(2), sub: "total postulaciones por candidato", color: COLORS[4] },
    { label: "Índice Ambición (media)", value: `${(kpis.indiceAmbicionMedia * 100).toFixed(1)}%`, sub: "presidencia / total (quienes postularon)", color: COLORS[5] },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-3 sm:p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="h-1 w-8 rounded-full mb-2" style={{ backgroundColor: card.color }} />
          <p className="text-[10px] sm:text-xs font-semibold text-slate-600 uppercase tracking-wide truncate" title={card.label}>
            {card.label}
          </p>
          <p className="text-lg sm:text-xl font-bold text-[#0b1b3b] mt-0.5">{card.value}</p>
          <p className="text-xs text-slate-500 mt-0.5">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
