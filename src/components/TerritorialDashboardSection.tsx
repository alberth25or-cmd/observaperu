"use client";

import { useMemo } from "react";
import {
  computeTerritorialKPIs,
  type TerritorialRow,
} from "@/lib/territorialAnalytics";
import TerritorialKPICards from "@/components/TerritorialKPICards";
import TerritorialComparativoChart from "@/components/TerritorialComparativoChart";
import TerritorialMovilidadChart from "@/components/TerritorialMovilidadChart";
import TerritorialInsights from "@/components/TerritorialInsights";
import TopFlujosTable from "@/components/TopFlujosTable";

interface TerritorialDashboardSectionProps {
  data: TerritorialRow[] | null;
}

export default function TerritorialDashboardSection({
  data,
}: TerritorialDashboardSectionProps) {
  const kpis = useMemo(() => {
    if (!data?.length) return null;
    return computeTerritorialKPIs(data);
  }, [data]);

  if (!data?.length) {
    return (
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
        <p className="text-center text-slate-500 text-sm py-6">
          No hay datos territoriales disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0b1b3b] mb-1 sm:mb-2">
          Geografía de la oferta electoral
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Centralización, migración interna y concentración territorial.
          Nacimiento y domicilio por departamento.
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <TerritorialKPICards kpis={kpis} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Nacimiento vs domicilio (top departamentos)
          </h3>
          <TerritorialComparativoChart
            topNacimiento={kpis?.topNacimiento ?? []}
            topDomicilio={kpis?.topDomicilio ?? []}
          />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Mismo departamento vs migraron
          </h3>
          <TerritorialMovilidadChart
            mismoDepartamento={kpis?.mismoDepartamento ?? 0}
            migraron={kpis?.migraron ?? 0}
          />
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
          Principales flujos (origen → destino)
        </h3>
        <TopFlujosTable flujos={kpis?.topFlujos ?? []} />
      </div>

      <TerritorialInsights kpis={kpis} />
    </div>
  );
}
