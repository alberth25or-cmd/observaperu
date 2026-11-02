"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import type { CampoHandle } from "./CampoParticulas";

// three.js fuera del bundle crítico: pesa más que todo el resto de la página
// junta y no hace falta para el primer pintado. El velo de carga cubre el
// intervalo, así que el hero nunca se ve a medio construir.
const CampoParticulas = dynamic(() => import("./CampoParticulas"), {
  ssr: false,
});
import { TITULOS } from "@/lib/etapas";

const HeroRuidoSenal = () => {
  const seccion = useRef<HTMLElement>(null);
  const campo = useRef<CampoHandle>(null);
  const titulos = useRef<(HTMLDivElement | null)[]>([]);
  const atmosferas = useRef<(HTMLDivElement | null)[]>([]);
  const [listo, setListo] = useState(false);

  const alListo = useCallback(() => setListo(true), []);

  // La atmósfera pesa en razón inversa a la densidad del campo: en el caos
  // estorbaría, en el resultado —tres barras y mucho aire— es la que
  // sostiene el encuadre.
  const ATM = [0.3, 0.62, 0.66, 0.8, 0.9];

  /** Funde los planos atmosféricos según la etapa en curso. */
  const pintarAtmosfera = (p: number) => {
    atmosferas.current.forEach((a, i) => {
      if (!a) return;
      const d = Math.abs(p - i);
      a.style.opacity = String(Math.max(0, 1 - d) * ATM[i]);
      // Plano más profundo: se mueve menos que todo lo demás.
      a.style.transform = `scale(${(1.08 - Math.min(1, d) * 0.05).toFixed(3)})`;
    });
  };

  useEffect(() => {
    const el = seccion.current;
    if (!el) return;

    // ?etapa=0..4 congela una etapa concreta. Sirve para revisar cada una
    // aislada sin tener que scrollear hasta ella.
    const forzada = new URLSearchParams(window.location.search).get("etapa");
    if (forzada !== null) {
      const p = Math.max(0, Math.min(4, Number(forzada) || 0));
      campo.current?.setProgreso(p);
      pintarAtmosfera(p);
      titulos.current.forEach((t, i) => {
        if (t) t.style.opacity = String(Math.max(0, 1 - Math.abs(p - i) * 1.8));
      });
      return;
    }

    const reducido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Sin movimiento: mostramos la última etapa y su titular, sin fijar
    // la sección ni secuestrar el scroll.
    if (reducido) {
      campo.current?.setProgreso(4);
      pintarAtmosfera(4);
      titulos.current.forEach((t, i) => {
        if (t) t.style.opacity = i === TITULOS.length - 1 ? "1" : "0";
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ultima = TITULOS.length - 1;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: `+=${ultima * 100}%`,
      pin: true,
      scrub: 0.6,
      onUpdate: ({ progress }) => {
        const p = progress * ultima;
        campo.current?.setProgreso(p);
        pintarAtmosfera(p);

        // Los titulares se cruzan alrededor de cada etapa entera.
        titulos.current.forEach((t, i) => {
          if (!t) return;
          const d = Math.abs(p - i);
          const o = Math.max(0, 1 - d * 1.8);
          t.style.opacity = String(o);
          t.style.transform = `translateY(${(p - i) * -18}px)`;
        });
      },
    });

    return () => {
      st.kill();
    };
  }, [listo]);

  return (
    <section
      ref={seccion}
      className="relative h-svh w-full overflow-hidden bg-navy text-white"
    >
      {/* Plano más profundo: atmósfera propia de cada etapa, fundiéndose.
          Va detrás del campo de partículas y a media opacidad. */}
      {TITULOS.map((t, i) => (
        <div
          key={`atm-${t.eyebrow}`}
          ref={(n) => {
            atmosferas.current[i] = n;
          }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-500 will-change-transform"
          style={{
            backgroundImage: `url('/images/atmosfera/${i}.webp')`,
            opacity: i === 0 ? 0.3 : 0,
          }}
        />
      ))}

      <CampoParticulas ref={campo} onListo={alListo} />

      {/* Viñeta suave: oscurece el pie para que el texto agarre, sin
          apagar el campo. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(15,30,74,.55) 0%, transparent 26%, transparent 52%, rgba(10,21,51,.88) 100%)",
        }}
      />

      {/* Todo el texto vive abajo: el centro es del campo de partículas. */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-10 lg:px-12 lg:pb-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          {/* Los cinco titulares se relevan en el mismo sitio. */}
          <div className="relative h-[150px] sm:h-[132px]">
            {TITULOS.map((t, i) => (
              <div
                key={t.eyebrow}
                ref={(n) => {
                  titulos.current[i] = n;
                }}
                className="absolute inset-x-0 bottom-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <p className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
                  {t.eyebrow}
                </p>
                <h2 className="mt-4 max-w-[19ch] font-display font-bold leading-[0.98] tracking-[-0.035em] text-white [font-size:clamp(2.1rem,6vw,4.6rem)]">
                  {t.titulo}
                </h2>
              </div>
            ))}
          </div>

          {/* El CTA no se va nunca: quien ya se convenció no debería tener
              que recorrer las cinco etapas para poder escribirnos. */}
          <div className="flex flex-wrap items-end justify-between gap-6 border-t border-white/12 pt-6">
            <p className="max-w-[34ch] text-[13.5px] leading-relaxed text-white/50">
              Encuestas y estudios de mercado con rigor estadístico, en todo el
              Perú.
            </p>
            <Link
              href="/contactanos"
              className="inline-flex items-center rounded-lg bg-gold px-6 py-3 font-display text-[15px] font-semibold text-navy transition-colors hover:bg-[#d8b95e]"
            >
              Cuéntanos tu proyecto
            </Link>
          </div>
        </div>
      </div>

      {/* Velo de carga: el campo aparece resuelto, no a medio construir. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-navy transition-opacity duration-[1200ms]"
        style={{ opacity: listo ? 0 : 1 }}
      />
    </section>
  );
};

export default HeroRuidoSenal;
