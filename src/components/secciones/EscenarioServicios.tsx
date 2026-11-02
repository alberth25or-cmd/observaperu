"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { suscribirScroll, movimientoReducido } from "@/lib/scroll";

const servicios = [
  {
    n: "01",
    nombre: "Encuestas de opinión",
    pregunta: "¿Qué piensa realmente tu público?",
    texto:
      "Diseñamos la muestra, hacemos el campo con nuestro equipo y procesamos las respuestas.",
    recibes: "Resultados claros, con su ficha técnica completa.",
    objeto: "encuesta",
  },
  {
    n: "02",
    nombre: "Estudios de mercado",
    pregunta: "¿Vale la pena lanzar este producto?",
    texto:
      "Medimos demanda, percepción de marca y comportamiento de compra antes de que inviertas.",
    recibes: "La demanda medida y una recomendación clara.",
    objeto: "barras",
  },
  {
    n: "03",
    nombre: "Asesoría estadística",
    pregunta: "¿Tus datos dicen lo que crees que dicen?",
    texto: "Revisamos tu muestra y tus conclusiones antes de que las presentes.",
    recibes: "Un informe de qué puedes afirmar y qué no.",
    objeto: "lupa",
  },
  {
    n: "04",
    nombre: "Procesamiento y análisis",
    pregunta: "¿Tienes datos pero no respuestas?",
    texto:
      "Limpiamos, cruzamos y modelamos la información que ya levantaste, venga de la región que venga.",
    recibes: "Tu base limpia y un reporte que se entiende.",
    objeto: "diana",
  },
];

const enlaceWhatsapp = (pregunta: string) =>
  `https://wa.me/51931370624?text=${encodeURIComponent(`Hola, tengo esta pregunta: ${pregunta}`)}`;

/**
 * Escenario partido: la columna izquierda queda fija mientras las tarjetas
 * avanzan por la derecha y se ocluyen entre sí al pasar. El título responde
 * al cierre del hero ("Tú solo cuéntanos qué necesitas saber"): las tarjetas
 * son preguntas del cliente, y cada una lleva a escribirnos con la suya.
 */
const EscenarioServicios = () => {
  const seccion = useRef<HTMLElement>(null);
  const tarjetas = useRef<(HTMLDivElement | null)[]>([]);
  const indice = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = seccion.current;
    if (!el) return;

    // El desenfoque animado es de lo más caro que hay para un teléfono.
    const conDesenfoque = window.matchMedia("(min-width: 1024px)").matches;

    const pintar = (avance: number) => {
      const total = servicios.length;
      // Empieza y termina con una tarjeta centrada: el escenario nunca entra vacío.
      const pos = 0.5 + avance * (total - 1);

      tarjetas.current.forEach((t, i) => {
        if (!t) return;
        // d < 0: aún por entrar. d > 0: ya pasó.
        const d = pos - i - 0.5;
        const dentro = Math.max(0, 1 - Math.abs(d) * 1.35);

        const y = d * -190;
        const escala = 0.86 + dentro * 0.14;
        // Sin desenfoque que las separe, las tarjetas se relevan más rápido.
        const op = Math.max(0, Math.min(1, 1 - Math.abs(d) * (conDesenfoque ? 1.15 : 1.7)));

        t.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0) scale(${escala.toFixed(3)})`;
        t.style.opacity = op.toFixed(3);
        t.style.zIndex = String(100 - Math.round(Math.abs(d) * 10));
        // Una tarjeta que no se ve tampoco se puede tocar ni enfocar.
        t.style.visibility = op > 0.02 ? "visible" : "hidden";
        if (conDesenfoque) {
          t.style.filter = `blur(${(Math.max(0, Math.abs(d) - 0.55) * 5).toFixed(1)}px)`;
        }
      });

      if (indice.current) {
        const i = Math.min(total, Math.max(1, Math.ceil(pos)));
        indice.current.textContent = String(i).padStart(2, "0");
      }
    };

    if (movimientoReducido()) {
      tarjetas.current.forEach((t) => {
        if (t) {
          t.style.position = "relative";
          t.style.opacity = "1";
          t.style.transform = "none";
          t.style.filter = "none";
        }
      });
      return;
    }

    return suscribirScroll(() => {
      const caja = el.getBoundingClientRect();
      const recorrido = caja.height - window.innerHeight;
      if (recorrido <= 0) return;
      const avance = Math.max(0, Math.min(1, -caja.top / recorrido));
      pintar(avance);
    });
  }, []);

  return (
    <section
      ref={seccion}
      data-escena
      id="servicios"
      className="relative bg-hueso"
      style={{ height: `${servicios.length * 85 + 60}vh` }}
    >
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="mx-auto flex h-full max-w-6xl flex-col justify-center gap-5 px-6 pt-[72px] lg:flex-row lg:items-center lg:justify-start lg:gap-12 lg:px-10 lg:pt-0">
          {/* Columna fija; en celular, el título sobre las tarjetas. */}
          <div className="relative z-[110] w-full shrink-0 bg-hueso pb-2 lg:z-auto lg:w-[34%] lg:bg-transparent lg:pb-0">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-dark">
              Qué hacemos por ti
            </p>
            <h2 className="mt-3 whitespace-nowrap font-display text-[26px] font-bold leading-[1.06] min-[380px]:text-[30px] lg:whitespace-normal tracking-[-0.03em] lg:mt-5 lg:text-[44px] lg:leading-[1.02] lg:tracking-[-0.035em]">
              ¿Qué necesitas saber?
            </h2>
            <p className="mt-6 hidden max-w-[34ch] text-[16px] leading-relaxed text-navy/65 lg:block">
              Cada encargo empieza por definir qué decisión depende del
              resultado. Sin eso, el dato no sirve.
            </p>
            <div className="mt-10 hidden items-baseline gap-2 font-display tabular-nums lg:flex">
              <span ref={indice} className="text-[34px] font-bold text-navy">
                01
              </span>
              <span className="text-[16px] text-navy/35">
                / {String(servicios.length).padStart(2, "0")}
              </span>
            </div>
          </div>

          {/* Escenario de tarjetas */}
          <div className="relative h-[410px] w-full motion-reduce:h-auto motion-reduce:space-y-4 sm:h-[350px] lg:h-[340px]">
            {servicios.map((s, i) => (
              <div
                key={s.n}
                ref={(n) => {
                  tarjetas.current[i] = n;
                }}
                className="absolute inset-x-0 top-1/2 -translate-y-1/2 will-change-transform motion-reduce:top-auto motion-reduce:translate-y-0"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <article
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-navy-900 p-6 text-white shadow-[0_24px_60px_-24px_rgba(10,21,51,.65)] sm:p-8 lg:p-9"
                  style={{
                    backgroundImage:
                      "radial-gradient(70% 90% at 88% 30%, rgba(125,155,224,.34), transparent 70%)",
                  }}
                >
                  <Image
                    src={`/images/objetos/${s.objeto}.webp`}
                    alt=""
                    aria-hidden="true"
                    width={420}
                    height={420}
                    sizes="(min-width: 1024px) 190px, 120px"
                    className="pointer-events-none absolute right-3 top-3 h-[92px] w-[92px] object-contain brightness-125 saturate-110 sm:right-6 sm:top-6 sm:h-[120px] sm:w-[120px] lg:right-7 lg:top-1/2 lg:h-[190px] lg:w-[190px] lg:-translate-y-1/2"
                  />
                  <div className="relative lg:pr-[200px]">
                    <div className="flex items-center gap-3 pr-24 sm:pr-32 lg:pr-0">
                      <span className="font-display text-[12px] font-semibold tabular-nums text-gold">
                        {s.n}
                      </span>
                      <span className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-white/55">
                        {s.nombre}
                      </span>
                    </div>
                    <h3 className="mt-4 pr-20 font-display text-[23px] font-bold leading-snug tracking-[-0.02em] sm:pr-28 sm:text-[26px] lg:mt-5 lg:pr-0 lg:text-[28px]">
                      {s.pregunta}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-white/70 sm:text-[16px]">
                      {s.texto}
                    </p>
                    <p className="mt-3 text-[15px] leading-relaxed sm:text-[16px]">
                      <span className="font-semibold text-gold">Recibes: </span>
                      {s.recibes}
                    </p>
                    <a
                      href={enlaceWhatsapp(s.pregunta)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-gold px-5 font-display text-[15px] font-semibold text-navy transition-colors hover:bg-[#d8b95e]"
                    >
                      Esta es mi pregunta
                    </a>
                  </div>
                </article>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EscenarioServicios;
