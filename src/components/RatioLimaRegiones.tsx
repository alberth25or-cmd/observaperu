"use client";

import { useMemo } from "react";

interface LugarNacimiento {
  slug: string;
  nacimiento_pais: string;
  nacimiento_departamento: string;
}

interface RatioLimaRegionesProps {
  data: LugarNacimiento[];
}

export default function RatioLimaRegiones({ data }: RatioLimaRegionesProps) {
  const stats = useMemo(() => {
    const candidatosPeru = data.filter((c) => c.nacimiento_pais === "PERÚ");
    
    // Contar Lima y Callao por separado
    const lima = candidatosPeru.filter((c) => c.nacimiento_departamento === "LIMA").length;
    const callao = candidatosPeru.filter((c) => c.nacimiento_departamento === "CALLAO").length;
    const limaMetropolitana = lima + callao;
    const regiones = candidatosPeru.length - limaMetropolitana;
    
    const total = candidatosPeru.length;
    const ratio = regiones > 0 ? (limaMetropolitana / regiones).toFixed(2) : "0";
    
    return {
      lima: lima,
      callao: callao,
      limaMetropolitana,
      regiones,
      total,
      ratio,
      porcentajeLima: ((limaMetropolitana / total) * 100).toFixed(1),
      porcentajeRegiones: ((regiones / total) * 100).toFixed(1),
    };
  }, [data]);

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100 mb-6 sm:mb-8">
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl p-3 sm:p-4 lg:p-8 shadow-lg border border-slate-100 mb-4 sm:mb-6 lg:mb-8">
      <div className="mb-3 sm:mb-4 lg:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-[#0b1b3b] mb-1 sm:mb-2">
          Lima Metropolitana vs Regiones
        </h2>
        <p className="text-[11px] sm:text-xs lg:text-sm text-slate-600">
          Distribución de candidatos por lugar de nacimiento
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <div className="bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-600 mb-1.5 sm:mb-2">Lima Metropolitana</div>
          <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#1b2b5a] mb-1">{stats.limaMetropolitana}</div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-slate-500">{stats.porcentajeLima}% del total</div>
          <div className="text-[9px] sm:text-[10px] lg:text-xs text-slate-400 mt-1.5 sm:mt-2">
            Lima: {stats.lima} | Callao: {stats.callao}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-600 mb-1.5 sm:mb-2">Regiones</div>
          <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#2E7D8F] mb-1">{stats.regiones}</div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-slate-500">{stats.porcentajeRegiones}% del total</div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-600 mb-1.5 sm:mb-2">Ratio</div>
          <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#4A90E2] mb-1">{stats.ratio}:1</div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-slate-500">Lima:Regiones</div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4 lg:p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-600 mb-1.5 sm:mb-2">Total</div>
          <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#0f1d46] mb-1">{stats.total}</div>
          <div className="text-[10px] sm:text-xs lg:text-sm text-slate-500">Candidatos</div>
        </div>
      </div>
    </div>
  );
}


