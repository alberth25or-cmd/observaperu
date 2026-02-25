"use client";

import type { TerritorialKPIs } from "@/lib/territorialAnalytics";

interface TerritorialInsightsProps {
  kpis: TerritorialKPIs | null;
}

export default function TerritorialInsights({ kpis }: TerritorialInsightsProps) {
  if (!kpis || kpis.total === 0) return null;

  const topNac = kpis.topNacimiento[0];
  const topDom = kpis.topDomicilio[0];
  const topFlujo = kpis.topFlujos[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
      <h4 className="text-sm font-bold text-[#0b1b3b] mb-3">Qué muestran los datos</h4>
      <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
        <li>
          <strong>Centralización:</strong> {kpis.pctLimaNacimiento}% de los candidatos nació en Lima
          Metropolitana; {kpis.pctLimaDomicilio}% declara residir en la capital. La oferta electoral
          sigue concentrada en la capital.
        </li>
        <li>
          <strong>Migración interna:</strong> {kpis.pctMigraron}% nació en un departamento distinto al
          de su domicilio. Flujo neto hacia Lima: {kpis.flujoNetoLima >= 0 ? "+" : ""}
          {kpis.flujoNetoLima} candidatos (más llegan a Lima que se van).
        </li>
        <li>
          <strong>Concentración:</strong> El índice de concentración por nacimiento es{" "}
          {kpis.concentracionNacimiento} (HHI {kpis.hhiNacimiento}); por domicilio,{" "}
          {kpis.concentracionDomicilio}. Solo {kpis.deptosRepresentadosNacimiento} departamentos
          tienen candidatos nacidos allí.
        </li>
        {topFlujo && (
          <li>
            <strong>Flujo principal:</strong> {topFlujo.origen} → {topFlujo.destino} ({topFlujo.count}{" "}
            candidatos).
          </li>
        )}
        {kpis.sinDomicilio > 0 && (
          <li>
            <strong>Datos faltantes:</strong> {kpis.pctSinDomicilio}% de los candidatos no tienen
            domicilio declarado en la fuente.
          </li>
        )}
      </ul>
    </div>
  );
}
