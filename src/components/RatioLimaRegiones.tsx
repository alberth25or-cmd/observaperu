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

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100 mb-6 sm:mb-8">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-[#0b1b3b] mb-2">
          Lima Metropolitana vs Regiones
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Distribución de candidatos por lugar de nacimiento
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-slate-50 to-white p-4 sm:p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="text-xs sm:text-sm font-semibold text-slate-600 mb-2">Lima Metropolitana</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1b2b5a] mb-1">{stats.limaMetropolitana}</div>
          <div className="text-xs sm:text-sm text-slate-500">{stats.porcentajeLima}% del total</div>
          <div className="text-[10px] sm:text-xs text-slate-400 mt-2">
            Lima: {stats.lima} | Callao: {stats.callao}
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-white p-4 sm:p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="text-xs sm:text-sm font-semibold text-slate-600 mb-2">Regiones</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2E7D8F] mb-1">{stats.regiones}</div>
          <div className="text-xs sm:text-sm text-slate-500">{stats.porcentajeRegiones}% del total</div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-white p-4 sm:p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="text-xs sm:text-sm font-semibold text-slate-600 mb-2">Ratio</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4A90E2] mb-1">{stats.ratio}:1</div>
          <div className="text-xs sm:text-sm text-slate-500">Lima:Regiones</div>
        </div>
        
        <div className="bg-gradient-to-br from-slate-50 to-white p-4 sm:p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
          <div className="text-xs sm:text-sm font-semibold text-slate-600 mb-2">Total</div>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0f1d46] mb-1">{stats.total}</div>
          <div className="text-xs sm:text-sm text-slate-500">Candidatos</div>
        </div>
      </div>
    </div>
  );
}


