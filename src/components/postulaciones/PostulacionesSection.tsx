"use client";

import { useMemo } from "react";
import { ALL_CANDIDATES } from "@/data/candidatos";
import {
  computePostulacionesKPIs,
  type PostulacionRow,
} from "@/lib/postulacionesAnalytics";
import PostulacionesKPICards from "./PostulacionesKPICards";

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}
import PostulacionesRankingChart from "./PostulacionesRankingChart";
import PostulacionesHistogramChart from "./PostulacionesHistogramChart";
import PostulacionesBoxplotVisual from "./PostulacionesBoxplotVisual";
import PostulacionesScatterChart from "./PostulacionesScatterChart";
import PostulacionesParetoChart from "./PostulacionesParetoChart";
import PostulacionesIndicesChart from "./PostulacionesIndicesChart";
import PostulacionesInsights from "./PostulacionesInsights";

interface PostulacionesSectionProps {
  data: PostulacionRow[] | null;
}

export default function PostulacionesSection({ data }: PostulacionesSectionProps) {
  const kpis = useMemo(() => {
    if (!data?.length) return null;
    return computePostulacionesKPIs(data);
  }, [data]);

  const { postulanteToImageUrl, postulanteToImageUrlByNormal } = useMemo(() => {
    const byNormal = new Map<string, string>();
    for (const c of ALL_CANDIDATES) {
      byNormal.set(normalizeName(c.name), c.img);
    }
    const map: Record<string, string> = {};
    const mapByNormal: Record<string, string> = {};
    if (!data?.length) return { postulanteToImageUrl: map, postulanteToImageUrlByNormal: mapByNormal };
    for (const row of data) {
      const img = byNormal.get(normalizeName(row.postulante));
      if (img) {
        map[row.postulante] = img;
        mapByNormal[normalizeName(row.postulante)] = img;
      }
    }
    return { postulanteToImageUrl: map, postulanteToImageUrlByNormal: mapByNormal };
  }, [data]);

  const paretoSoloConPostulaciones = useMemo(() => {
    const pareto = kpis?.pareto ?? [];
    return pareto.filter((p) => p.totalPostulaciones > 0);
  }, [kpis?.pareto]);

  if (!data?.length) {
    return (
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
        <p className="text-center text-slate-500 text-sm py-6">
          No hay datos de número de postulaciones disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0b1b3b] mb-1 sm:mb-2">
          Persistencia política y postulaciones
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Análisis estadístico del número de veces que los candidatos han postulado a cargos
          (incluye Presidencia y otros). Los datos corresponden únicamente a procesos electorales
          anteriores a las elecciones actuales.
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <PostulacionesKPICards kpis={kpis} />
      </div>

      <div className="mb-6 sm:mb-8 max-w-lg">
        <PostulacionesIndicesChart kpis={kpis} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Ranking por total de postulaciones
          </h3>
          <PostulacionesRankingChart data={kpis?.ranking ?? []} maxBars={14} variant="total" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Ranking por postulaciones a Presidencia
          </h3>
          <PostulacionesRankingChart
            data={(kpis?.rankingPresidencia ?? []).filter((r) => r.postulacionesPresidencia >= 1)}
            maxBars={14}
            variant="presidencia"
          />
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
          Ranking por Índice de Ambición Presidencial
        </h3>
        <p className="text-xs text-slate-600 mb-3">
          Proporción de postulaciones que fueron a Presidencia (solo candidatos con al menos una postulación).
        </p>
        <PostulacionesRankingChart
          data={(kpis?.rankingAmbicion ?? []).filter((r) => r.indiceAmbicion > 0)}
          maxBars={14}
          variant="ambicion"
        />
      </div>

      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
          Curva de Pareto (postulaciones acumuladas)
        </h3>
        <PostulacionesParetoChart
          data={paretoSoloConPostulaciones}
          postulanteToImageUrl={postulanteToImageUrl}
          postulanteToImageUrlByNormal={postulanteToImageUrlByNormal}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Histograma: total de postulaciones
          </h3>
          <PostulacionesHistogramChart
            data={kpis?.histogramTotal ?? []}
            color="#1b2b5a"
          />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Histograma: postulaciones a Presidencia
          </h3>
          <PostulacionesHistogramChart
            data={kpis?.histogramPresidencia ?? []}
            color="#2E7D8F"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Diagrama de dispersión: total vs Presidencia
          </h3>
          <PostulacionesScatterChart data={kpis?.scatterData ?? []} />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Resumen en caja (boxplot)
          </h3>
          <div className="space-y-6">
            <PostulacionesBoxplotVisual
              data={kpis?.boxplotTotal ?? { min: 0, q1: 0, mediana: 0, q3: 0, max: 0 }}
              label="Total de postulaciones"
              color="#1b2b5a"
            />
            <PostulacionesBoxplotVisual
              data={kpis?.boxplotPresidencia ?? { min: 0, q1: 0, mediana: 0, q3: 0, max: 0 }}
              label="Postulaciones a Presidencia"
              color="#2E7D8F"
            />
          </div>
        </div>
      </div>

      <PostulacionesInsights kpis={kpis} />
    </div>
  );
}
