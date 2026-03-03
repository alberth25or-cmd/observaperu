"use client";

import { useState } from "react";
import Link from "next/link";
import type { AntecedentesRowTransformada } from "@/lib/antecedentesElectorales";

interface AntecedentesHeatmapProps {
  filas: AntecedentesRowTransformada[];
  /** Cuántas filas mostrar inicialmente (desplegable) */
  initialRows?: number;
  /** Mapa nombre del candidato (tal como en los datos) → slug para /candidatos/[slug] */
  nombreToSlug?: Record<string, string>;
}

const CARGO_LABELS = ["Presidencia", "Diputado", "Senado"];
const DEFAULT_INITIAL_ROWS = 8;

function getCargoKeys(row: AntecedentesRowTransformada): number[] {
  return [row.presidencia, row.diputado, row.senador];
}

export default function AntecedentesHeatmap({
  filas,
  initialRows = DEFAULT_INITIAL_ROWS,
  nombreToSlug = {},
}: AntecedentesHeatmapProps) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? filas : filas.slice(0, initialRows);
  const hasMore = filas.length > initialRows;
  const hiddenCount = filas.length - initialRows;

  if (!filas.length) {
    return (
      <div className="py-8 text-center text-slate-500 text-sm">
        No hay datos para mostrar.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[320px] text-sm">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-2 px-2 font-semibold text-[#0b1b3b]">
              Candidato
            </th>
            {CARGO_LABELS.map((l) => (
              <th
                key={l}
                className="text-center py-2 px-1 font-semibold text-slate-600"
              >
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {visible.map((row, i) => {
            const vals = getCargoKeys(row);
            const slug = nombreToSlug[row.candidato];
            return (
              <tr
                key={row.candidato}
                className={`border-b border-slate-100 ${i % 2 === 0 ? "bg-slate-50/50" : ""}`}
              >
                <td className="py-2 px-2 text-slate-700 truncate max-w-[180px] sm:max-w-none">
                  {slug ? (
                    <Link
                      href={`/candidatos/${slug}`}
                      className="text-[#0b1b3b] font-medium underline decoration-[#0b1b3b]/30 underline-offset-2 hover:decoration-[#0b1b3b] transition-colors"
                    >
                      {row.candidato}
                    </Link>
                  ) : (
                    row.candidato
                  )}
                </td>
                {vals.map((v, j) => (
                  <td key={j} className="py-2 px-1 text-center">
                    <span
                      className={`inline-block h-5 w-5 sm:h-6 sm:w-6 rounded ${
                        v === 1 ? "bg-[#1b2b5a]" : "bg-slate-200"
                      }`}
                      title={v === 1 ? "Sí" : "No"}
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {hasMore && (
        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((e) => !e)}
            className="text-sm font-medium text-[#0b1b3b] hover:text-[#1b2b5a] underline decoration-[#0b1b3b]/40 underline-offset-2 hover:decoration-[#0b1b3b] transition-colors py-1 px-3 rounded-md hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0b1b3b]/20"
          >
            {expanded
              ? "Ver menos"
              : `Ver más (${hiddenCount} candidato${hiddenCount !== 1 ? "s" : ""} más)`}
          </button>
        </div>
      )}
    </div>
  );
}
