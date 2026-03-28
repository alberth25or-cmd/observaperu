"use client";

import EncuestaIntencionVoto from "./EncuestaIntencionVoto";
import EncuestaEvolucionTemporal from "./EncuestaEvolucionTemporal";
import EncuestaSimulacroPorRegion from "./EncuestaSimulacroPorRegion";
import EncuestaEmpateEstadistico from "./EncuestaEmpateEstadistico";

export default function EncuestaSection() {
  return (
    <section>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b2b5a] leading-tight">
            Encuesta &amp; Simulacro Nacional
          </h2>
          <span className="bg-[#eef2fb] text-[#1b2b5a] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border border-[#1b2b5a]/20">
            Ipsos · 22 mar 2026
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          Encuesta nacional urbano-rural (n=1,203) y simulacro de votación
          (n=1,189) realizados por Ipsos para Perú21 los días 21 y 22 de marzo
          de 2026. Margen de error: ±2.8 pp · IC 95% · Registro JNE:
          001-REE/JNE.
        </p>
      </div>

      {/* Fila 1: intención de voto (izq) + detector de empate (der) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          <EncuestaIntencionVoto />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          <EncuestaEmpateEstadistico />
        </div>
      </div>

      {/* Fila 2: evolución temporal (ancho completo) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
        <EncuestaEvolucionTemporal />
      </div>

      {/* Fila 3: simulacro por región (ancho completo) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
        <EncuestaSimulacroPorRegion />
      </div>

      <p className="text-xs text-slate-400 mt-4 text-center">
        Fuente: Ipsos Perú para Perú21 · 21–22 de marzo de 2026 · n=1,203
        (encuesta) / n=1,189 (simulacro) · Muestreo por conglomerados
        estratificado · Entrevista presencial con dispositivos móviles.
      </p>
    </section>
  );
}
