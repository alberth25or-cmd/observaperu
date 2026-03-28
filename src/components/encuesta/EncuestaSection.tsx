"use client";

import Link from "next/link";
import EncuestaIntencionVoto from "./EncuestaIntencionVoto";
import EncuestaEvolucionTemporal from "./EncuestaEvolucionTemporal";
import EncuestaSimulacroPorRegion from "./EncuestaSimulacroPorRegion";
import EncuestaEmpateEstadistico from "./EncuestaEmpateEstadistico";

export default function EncuestaSection() {
  return (
    <section>
      {/* Header con keywords SEO */}
      <div className="mb-6 sm:mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b2b5a] leading-tight">
            Estadísticas electorales Perú 2026
          </h2>
          <span className="bg-[#eef2fb] text-[#1b2b5a] text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border border-[#1b2b5a]/20">
            Encuesta &amp; Simulacro · Ipsos · 22 mar 2026
          </span>
        </div>

        <p className="text-sm text-slate-600 leading-relaxed max-w-4xl mb-5">
          Seguimiento estadístico de las{" "}
          <strong className="text-[#1b2b5a]">elecciones presidenciales del Perú 2026</strong>.
          Según la{" "}
          <strong className="text-[#1b2b5a]">encuesta Ipsos</strong> (21–22 mar 2026, n=1,203),{" "}
          <Link href="/candidatos/keiko-sofia-fujimori-higuchi" className="font-bold text-[#1b2b5a] underline decoration-[#1b2b5a]/30 hover:decoration-[#1b2b5a]">
            Keiko Fujimori lidera con 11%
          </Link>{" "}
          seguida de{" "}
          <Link href="/candidatos/rafael-bernardo-lopez-aliaga" className="font-bold text-[#1b2b5a] underline decoration-[#1b2b5a]/30 hover:decoration-[#1b2b5a]">
            Rafael López Aliaga con 10%
          </Link>
          , ambos dentro del margen de error (±2.8 pp). Un segundo grupo de cuatro candidatos —{" "}
          <Link href="/candidatos/alfonso-lopez-chau-nava" className="font-bold text-[#1b2b5a] underline decoration-[#1b2b5a]/30 hover:decoration-[#1b2b5a]">A. López Chau</Link>,{" "}
          <Link href="/candidatos/roberto-helbert-sanchez-palomino" className="font-bold text-[#1b2b5a] underline decoration-[#1b2b5a]/30 hover:decoration-[#1b2b5a]">R. Sánchez</Link>,{" "}
          <Link href="/candidatos/carlos-gonzalo-alvarez-loayza" className="font-bold text-[#1b2b5a] underline decoration-[#1b2b5a]/30 hover:decoration-[#1b2b5a]">C. Álvarez</Link> y{" "}
          <Link href="/candidatos/jorge-nieto-montesinos" className="font-bold text-[#1b2b5a] underline decoration-[#1b2b5a]/30 hover:decoration-[#1b2b5a]">J. Nieto</Link>{" "}
          — se ubica en torno al 5%, también dentro del margen de error. En el simulacro, López
          Aliaga concentra el 28% de votos válidos en Lima frente al 18% de Keiko. Análisis completo
          de los tres{" "}
          <strong className="text-[#1b2b5a]">debates JNE 2026</strong> (23, 24 y 25 de marzo) y
          comparativo por macrorregiones.
        </p>

        {/* Datos destacados */}
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Keiko Fujimori",    value: "11% intención de voto" },
            { label: "R. López Aliaga",   value: "10% intención de voto" },
            { label: "Margen de error",   value: "±2.8 pp · IC 95%" },
            { label: "Debates analizados", value: "3 jornadas JNE 2026" },
          ].map((item) => (
            <li
              key={item.label}
              className="bg-[#eef2fb] border border-[#1b2b5a]/10 rounded-xl px-3 py-2.5"
            >
              <span className="block text-xs font-bold text-[#1b2b5a]">{item.label}</span>
              <span className="text-xs text-slate-500">{item.value}</span>
            </li>
          ))}
        </ul>
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

      {/* Fila 2: evolución temporal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7 mb-6">
        <EncuestaEvolucionTemporal />
      </div>

      {/* Fila 3: simulacro por región */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 sm:p-7">
        <EncuestaSimulacroPorRegion />
      </div>

      <p className="text-xs text-slate-400 mt-4 text-center">
        Fuente: Ipsos Perú para Perú21 · 21–22 de marzo de 2026 · n=1,203 (encuesta) / n=1,189
        (simulacro) · Muestreo por conglomerados estratificado · Entrevista presencial.{" "}
        <strong>Última actualización: 28 de marzo de 2026.</strong>
      </p>
    </section>
  );
}
