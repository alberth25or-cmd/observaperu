"use client";

import { useEffect, useRef } from "react";
import { suscribirScroll, movimientoReducido } from "@/lib/scroll";

const pasos = [
  {
    paso: "Afinamos tu pregunta",
    texto:
      "Nos escribes con tus propias palabras y juntos definimos qué decisión depende del resultado. En menos de 48 horas tienes una propuesta inicial.",
    tuParte: "contarnos qué necesitas saber.",
  },
  {
    paso: "Planeamos cómo medirlo",
    texto:
      "Definimos a quién preguntar, a cuántas personas y cómo elegirlas. Antes de salir a campo ya sabes qué vas a poder afirmar y con qué margen de error.",
    tuParte: "revisar el plan y aprobarlo.",
  },
  {
    paso: "Salimos a campo",
    texto:
      "Nuestro equipo hace las encuestas con supervisión, y luego revisamos y procesamos las respuestas. Si ya tienes los datos, empezamos desde aquí.",
    tuParte: "seguir con tu trabajo.",
  },
  {
    paso: "Te entregamos la respuesta",
    texto:
      "Un informe que tu equipo entiende sin ser estadístico, la ficha técnica completa y la base de datos si la necesitas.",
    tuParte: "decidir.",
  },
];

/**
 * Riel lateral: la sección se fija y el contenido viaja en horizontal.
 *
 * La profundidad está en que tres planos viajan a velocidades distintas —
 * las cifras gigantes del fondo van más rápido que las tarjetas, y la barra
 * de progreso no viaja. Si todo se moviera igual sería una sola imagen
 * desplazándose, que es exactamente lo que no queremos.
 */
const RielProceso = () => {
  const seccion = useRef<HTMLElement>(null);
  const riel = useRef<HTMLDivElement>(null);
  const cifras = useRef<HTMLDivElement>(null);
  const barra = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = seccion.current;
    if (!el) return;

    if (movimientoReducido()) {
      if (riel.current) {
        riel.current.style.flexDirection = "column";
        riel.current.style.transform = "none";
      }
      return;
    }

    return suscribirScroll(() => {
      const caja = el.getBoundingClientRect();
      const recorrido = caja.height - window.innerHeight;
      if (recorrido <= 0) return;
      const avance = Math.max(0, Math.min(1, -caja.top / recorrido));

      if (riel.current) {
        const desplazable = riel.current.scrollWidth - window.innerWidth;
        riel.current.style.transform = `translate3d(${(-avance * Math.max(0, desplazable)).toFixed(1)}px, 0, 0)`;
      }
      // Plano de fondo, más rápido: crea el paralaje.
      if (cifras.current) {
        cifras.current.style.transform = `translate3d(${(-avance * 1600).toFixed(1)}px, 0, 0)`;
      }
      if (barra.current) {
        barra.current.style.transform = `scaleX(${avance.toFixed(3)})`;
      }
    });
  }, []);

  return (
    <section
      ref={seccion}
      data-escena
      id="como-trabajamos"
      className="relative bg-navy text-white"
      style={{ height: "340vh" }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        {/* Plano lejano: cifras enormes viajando más rápido que el riel. */}
        <div
          ref={cifras}
          data-plano
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 flex -translate-y-1/2 select-none gap-[22vw] pl-[12vw] will-change-transform"
        >
          {pasos.map((_, i) => (
            <span
              key={i}
              className="font-display text-[30vw] font-bold leading-none tabular-nums text-white/[0.045]"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          ))}
        </div>

        <div className="absolute inset-x-0 top-0 z-10 px-6 pt-[92px] lg:px-12 lg:pt-24">
          <div className="mx-auto max-w-6xl">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
              Cómo trabajamos
            </p>
            <h2 className="mt-3 max-w-[18ch] font-display text-[28px] font-bold leading-[1.04] tracking-[-0.035em] sm:text-[34px] lg:mt-4 lg:text-[44px]">
              Qué pasa después de que nos escribes
            </h2>
          </div>
        </div>

        {/* Riel de tarjetas */}
        <div className="flex h-full items-center pb-12 pt-[212px] motion-safe:pt-44 motion-safe:sm:pb-0 motion-safe:sm:pt-20 lg:pt-60 motion-safe:lg:pt-0">
          <div
            ref={riel}
            data-riel
            className="flex gap-4 pl-6 pr-6 will-change-transform sm:gap-8 sm:pr-[30vw] lg:gap-12 lg:pl-12"
          >
            {pasos.map((p, i) => (
              <article
                key={p.paso}
                className="w-[84vw] shrink-0 rounded-2xl border border-white/12 bg-white/[0.04] p-6 sm:w-[58vw] sm:p-8 lg:w-[36vw] lg:p-10 lg:backdrop-blur-sm"
              >
                <div className="font-display text-[13px] font-semibold tabular-nums text-gold">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="mt-4 h-px w-full bg-white/15" />
                <h3 className="mt-5 font-display text-[23px] font-bold leading-snug tracking-[-0.02em] sm:mt-7 sm:text-[24px] lg:text-[28px]">
                  {p.paso}
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-white/70 sm:mt-5 sm:text-[16px] sm:text-white/60">
                  {p.texto}
                </p>
                <p className="mt-3 text-[15.5px] leading-relaxed sm:mt-4 sm:text-[16px]">
                  <span className="font-semibold text-gold">Tu parte: </span>
                  {p.tuParte}
                </p>
              </article>
            ))}
          </div>
        </div>

        {/* Barra de progreso: no viaja, mide. */}
        <div className="absolute inset-x-0 bottom-0 px-6 pb-10 lg:px-12">
          <div className="mx-auto max-w-6xl">
            <div className="h-px w-full bg-white/12">
              <span
                ref={barra}
                className="block h-px origin-left bg-gold"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RielProceso;
