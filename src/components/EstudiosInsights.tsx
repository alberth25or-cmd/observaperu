"use client";

import type { EstudiosKPIs } from "@/lib/estudiosUniversitarios";

function concentracionLabel(hhi: number): string {
  if (hhi < 1000) return "baja";
  if (hhi < 1800) return "moderada";
  return "alta";
}

interface EstudiosInsightsProps {
  kpis: EstudiosKPIs | null;
}

export default function EstudiosInsights({ kpis }: EstudiosInsightsProps) {
  if (!kpis || kpis.totalCandidatos === 0) return null;

  const topTipo = Object.entries(kpis.pctPorTipo).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const topArea = Object.entries(kpis.pctPorArea).sort(
    (a, b) => b[1] - a[1],
  )[0];
  const privada = kpis.pctPorTipo["Privada"] ?? 0;
  const publica = kpis.pctPorTipo["Pública"] ?? 0;
  const conc = concentracionLabel(kpis.hhi);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
      <h4 className="text-sm font-bold text-[#0b1b3b] mb-3">
        Qué muestran los datos
      </h4>
      <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
        <li>
          <strong>Estudios concluidos:</strong> {kpis.pctConcluidos}% de los
          candidatos declaran al menos un estudio universitario concluido.
        </li>
        <li>
          <strong>Concentración:</strong> La concentración en pocas
          universidades es {conc} (índice HHI: {kpis.hhi}).
          {kpis.top10Universidades[0] && (
            <>
              {" "}
              La universidad con más candidatos es{" "}
              {kpis.top10Universidades[0].nombre}, con{" "}
              {kpis.top10Universidades[0].count} candidatos.
            </>
          )}
        </li>
        <li>
          <strong>Área predominante:</strong>{" "}
          {topArea ? `${topArea[0]} (${topArea[1].toFixed(1)}%)` : "—"}.
        </li>
        <li>
          <strong>Tipo de universidad:</strong>{" "}
          {topTipo ? `${topTipo[0]} (${topTipo[1].toFixed(1)}%)` : "—"}.{" "}
          {privada >= publica
            ? "Hay predominancia de instituciones privadas entre quienes tienen datos."
            : "Hay predominancia de instituciones públicas."}
        </li>
        <li>
          <strong>Transparencia:</strong> {kpis.pctSinInfo}% de los candidatos
          no tienen información pública de estudios universitarios.
        </li>
      </ul>
    </div>
  );
}
