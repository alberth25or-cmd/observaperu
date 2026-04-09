"use client";

import Link from "next/link";
import EncuestaIntencionVotoAbril from "./EncuestaIntencionVotoAbril";
import EncuestaEmpateEstadisticoAbril from "./EncuestaEmpateEstadisticoAbril";
import EncuestaEvolucionTemporal from "./EncuestaEvolucionTemporal";
import EncuestaSimulacroPorRegionAbril from "./EncuestaSimulacroPorRegionAbril";

export default function EncuestaAbril2026Section() {
  return (
    <section>
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b2b5a] leading-tight">
            Encuesta &amp; Simulacro — 2 de abril 2026
          </h2>
          <span className="bg-green-50 text-green-800 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border border-green-200">
            Más reciente · Ipsos · 2 abr 2026
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl mb-5">
          Según la{" "}
          <strong className="text-[#1b2b5a]">encuesta Ipsos</strong> (01–02 abr 2026, n=1,217),{" "}
          <Link href="/candidatos/keiko-sofia-fujimori-higuchi" className="font-bold text-[#1b2b5a] underline decoration-[#1b2b5a]/30 hover:decoration-[#1b2b5a]">
            Keiko Fujimori sube a 13%
          </Link>
          , seguida de{" "}
          <Link href="/candidatos/carlos-gonzalo-alvarez-loayza" className="font-bold text-[#1b2b5a] underline decoration-[#1b2b5a]/30 hover:decoration-[#1b2b5a]">
            Carlos Álvarez con 9% (+4 pp)
          </Link>{" "}
          y{" "}
          <Link href="/candidatos/rafael-bernardo-lopez-aliaga" className="font-bold text-[#1b2b5a] underline decoration-[#1b2b5a]/30 hover:decoration-[#1b2b5a]">
            Rafael López Aliaga con 8% (−2 pp)
          </Link>
          . El gran movimiento del período es Álvarez, que salta cuatro puntos desde marzo y pasa a
          segundo lugar. En el simulacro presidencial, Keiko encabeza votos válidos nacionales con
          18.6%, mientras Roberto Sánchez domina el Oriente con 27.8%.
        </p>

        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Keiko Fujimori",  value: "13% (+2 pp vs mar)" },
            { label: "Carlos Álvarez",  value: "9% (+4 pp vs mar)"  },
            { label: "R. López Aliaga", value: "8% (−2 pp vs mar)"  },
            { label: "Margen de error", value: "±2.8 pp · IC 95%"   },
          ].map((item) => (
            <li key={item.label} className="bg-[#eef2fb] border border-[#1b2b5a]/10 rounded-xl px-3 py-2.5">
              <span className="block text-xs font-bold text-[#1b2b5a]">{item.label}</span>
              <span className="text-xs text-slate-500">{item.value}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Fila 1: intención de voto + detector de empate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          <EncuestaIntencionVotoAbril />
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
          <EncuestaEmpateEstadisticoAbril />
        </div>
      </div>

      {/* Fila 2: evolución temporal (incluye punto de abril) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
        <EncuestaEvolucionTemporal />
      </div>

      {/* Fila 3: simulacro por región */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
        <EncuestaSimulacroPorRegionAbril />
      </div>

      <p className="text-xs text-slate-400 mt-4 text-center">
        Fuente: Ipsos Perú para Perú21 · 01–02 de abril de 2026 · n=1,217 (encuesta) / n=1,192
        (simulacro) · Muestreo por conglomerados estratificado · Entrevista presencial.{" "}
        <strong>Última actualización: 9 de abril de 2026.</strong>
      </p>
    </section>
  );
}
