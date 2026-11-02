"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { EscenaHandle } from "./EscenaBurbujas";

// three.js fuera del bundle crítico: el velo de carga cubre el intervalo,
// así que la escena nunca se ve a medio construir.
const EscenaBurbujas = dynamic(() => import("./EscenaBurbujas"), {
  ssr: false,
});

/**
 * El concepto: una muestra bien diseñada contiene al país entero. El
 * recorrido atraviesa burbujas con el Perú adentro —el malecón, el
 * Huascarán, el Amazonas, Machu Picchu, el Titicaca…— hasta las líneas de
 * Nazca, que solo se entienden vistas desde arriba, y se zambulle en ellas:
 * adentro, el Perú en cuatro paneles.
 */
const ACTOS = [
  {
    ceja: "Encuestas y estudios de mercado",
    titulo: "Un dato mal medido sale más caro que no medir",
  },
  { ceja: "Muestreo y trabajo de campo", titulo: "Medir bien pide técnica y tiempo" },
  { ceja: "Estadísticos y equipo propio", titulo: "Eso lo ponemos nosotros" },
  { ceja: "Para empresas e investigadores", titulo: "Tú solo cuéntanos qué necesitas saber" },
];

/** La ficha técnica flota en el acto del rigor, cada dato a su profundidad. */
const FICHA = [
  { etiqueta: "Muestra", valor: "n = 800", pos: "left-[6%] top-[15%] sm:left-[56%] sm:top-[20%]", z: 0.7 },
  { etiqueta: "Margen de error", valor: "± 4.2 %", pos: "left-[47%] top-[27%] sm:left-[72%] sm:top-[34%]", z: 1.25 },
  { etiqueta: "Confianza", valor: "95 %", pos: "left-[6%] top-[31%] sm:left-[60%] sm:top-[48%]", z: 0.95 },
  { etiqueta: "Ficha técnica", valor: "Ejemplo", pos: "left-[50%] top-[13%] sm:left-[74%] sm:top-[10%]", z: 1.05 },
];

/** El cierre: cuatro lugares, una letra cada uno. Fotos de Higgsfield. */
const PANELES = [
  { img: "miraflores", letra: "P" },
  { img: "machupicchu", letra: "E" },
  { img: "vinicunca", letra: "R" },
  { img: "titicaca", letra: "U" },
];

const ULTIMO = ACTOS.length - 1;

const limitar = (x: number) => Math.max(0, Math.min(1, x));
const salida3 = (t: number) => 1 - Math.pow(1 - t, 3);
const tramo = (a: number, b: number, x: number) => {
  const t = limitar((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const HeroInmersion = () => {
  const seccion = useRef<HTMLElement>(null);
  const pista = useRef<HTMLDivElement>(null);
  const escena = useRef<EscenaHandle>(null);
  const fondo = useRef<HTMLDivElement>(null);
  const interior = useRef<HTMLDivElement>(null);
  const paneles = useRef<(HTMLDivElement | null)[]>([]);
  const letras = useRef<(HTMLSpanElement | null)[]>([]);
  const fichas = useRef<(HTMLDivElement | null)[]>([]);
  const relleno = useRef<HTMLDivElement>(null);
  const contador = useRef<HTMLSpanElement>(null);
  const indicador = useRef<HTMLDivElement>(null);
  const riel = useRef<HTMLDivElement>(null);
  const [listo, setListo] = useState(false);

  const alListo = useCallback(() => setListo(true), []);

  useEffect(() => {
    const el = seccion.current;
    if (!el || !listo) return;

    const actos = Array.from(el.querySelectorAll<HTMLElement>("[data-acto]")).map(
      (a) => ({
        el: a,
        ceja: a.querySelector<HTMLElement>("[data-ceja]")!,
        palabras: Array.from(a.querySelectorAll<HTMLElement>("[data-palabra]")),
      })
    );

    const estado = { p: 0, intro: 0, rx: 0, ry: 0 };

    /** Pinta todo lo que vive en el DOM a partir del progreso. */
    const pintar = () => {
      const { p, intro } = estado;

      // Titulares: cada palabra sube desde detrás de su máscara y, al
      // relevarse el acto, sigue subiendo y sale por arriba.
      actos.forEach((a, i) => {
        const entrada = i === 0 ? intro : limitar((p - (i - 0.55)) / 0.3);
        const salida = i === ULTIMO ? 0 : limitar((p - (i + 0.2)) / 0.25);
        a.palabras.forEach((s, j) => {
          const e = salida3(limitar(entrada * 1.5 - j * 0.1));
          const x = salida3(limitar(salida * 1.5 - j * 0.1));
          s.style.transform = `translate3d(0, ${((1 - e) * 110 - x * 110).toFixed(1)}%, 0)`;
        });
        const v = Math.min(entrada, 1 - salida);
        a.ceja.style.opacity = v.toFixed(3);
        a.ceja.style.transform = `translate3d(0, ${((1 - entrada) * 10 - salida * 10).toFixed(1)}px, 0)`;
        // Fuera de escena no se lee ni se enfoca.
        a.el.style.visibility = entrada > 0 && salida < 1 ? "visible" : "hidden";
      });

      // Fondo lejano: casi no se mueve. Es el plano más profundo.
      if (fondo.current) {
        const s = 1.04 + p * 0.05;
        fondo.current.style.transform = `translate3d(${(-estado.rx * 10).toFixed(1)}px, ${(estado.ry * 6).toFixed(1)}px, 0) scale(${s.toFixed(3)})`;
      }

      // La zambullida: la burbuja del Perú ya llena la pantalla y su
      // interior la releva. Los paneles llegan alternados —uno de arriba,
      // otro de abajo— y después suben las letras, cada una a su turno.
      const dentro = tramo(2.55, 2.95, p);
      if (interior.current) {
        interior.current.style.opacity = dentro.toFixed(3);
        // Oculto, el navegador no descarga las fotos hasta que hacen falta.
        interior.current.style.display = p > 1.2 ? "block" : "none";
      }
      const asienta = limitar((p - 2.55) / 0.45);
      paneles.current.forEach((n, i) => {
        if (!n) return;
        const t = salida3(limitar(asienta * 1.6 - i * 0.14));
        const lado = i % 2 ? -1 : 1;
        n.style.transform = `translate3d(0, ${((1 - t) * 14 * lado).toFixed(2)}%, 0) scale(${(1.12 - 0.12 * t).toFixed(3)})`;
      });
      letras.current.forEach((n, i) => {
        if (!n) return;
        const t = salida3(limitar(asienta * 2 - 0.9 - i * 0.12));
        n.style.transform = `translate3d(0, ${((1 - t) * 105).toFixed(1)}%, 0)`;
      });

      // Ficha técnica: cruza la pantalla de abajo hacia arriba; las fichas
      // más "cercanas" corren más, como objetos a distinta distancia.
      const fv = tramo(1.45, 1.8, p) * (1 - tramo(2.25, 2.5, p));
      fichas.current.forEach((f, i) => {
        if (!f) return;
        const z = FICHA[i].z;
        f.style.opacity = fv.toFixed(3);
        f.style.transform = `translate3d(${(-estado.rx * 16 * z).toFixed(1)}px, ${((2 - p) * 150 * z + estado.ry * 10 * z).toFixed(1)}px, 0)`;
      });

      if (relleno.current) relleno.current.style.transform = `scaleY(${(p / ULTIMO).toFixed(3)})`;
      if (contador.current)
        contador.current.textContent = `0${Math.min(ULTIMO, Math.round(p)) + 1}`;
      if (indicador.current)
        indicador.current.style.opacity = ((1 - tramo(0.05, 0.3, p)) * intro).toFixed(3);
    };

    // ?etapa=0..3 (admite decimales) congela un punto del recorrido para
    // revisarlo sin tener que scrollear hasta él.
    const forzada = new URLSearchParams(window.location.search).get("etapa");
    if (forzada !== null) {
      estado.p = Math.max(0, Math.min(ULTIMO, Number(forzada) || 0));
      estado.intro = 1;
      escena.current?.setProgreso(estado.p);
      pintar();
      return;
    }

    // Sin movimiento: el primer acto completo, sin fijar la sección ni
    // secuestrar el scroll. Sin recorrido, el riel y el "desliza" mienten.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      estado.intro = 1;
      pintar();
      riel.current?.style.setProperty("display", "none");
      indicador.current?.style.setProperty("display", "none");
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Entrada: la cámara llega desde atrás mientras suben las palabras.
    const entrada = gsap.to(estado, {
      intro: 1,
      duration: 2.2,
      ease: "expo.out",
      onUpdate: () => {
        escena.current?.setProgreso(estado.p - (1 - estado.intro) * 0.4);
        pintar();
      },
    });

    // La sección se fija con CSS (sticky), no con `pin`: en un teléfono el
    // pin corre en el hilo principal y tiembla contra el scroll táctil.
    const st = ScrollTrigger.create({
      trigger: pista.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: ({ progress }) => {
        estado.p = progress * ULTIMO;
        escena.current?.setProgreso(estado.p - (1 - estado.intro) * 0.4);
        pintar();
      },
    });

    // Paralaje del DOM con el mismo retardo que la cámara. Sin cursor no hay
    // nada que seguir: repintar en cada cuadro solo gastaría batería.
    const raton = { x: 0, y: 0 };
    const alMover = (e: PointerEvent) => {
      raton.x = (e.clientX / window.innerWidth) * 2 - 1;
      raton.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    const seguir = () => {
      estado.rx += (raton.x - estado.rx) * 0.06;
      estado.ry += (raton.y - estado.ry) * 0.06;
      pintar();
    };
    const conCursor = window.matchMedia("(hover: hover)").matches;
    if (conCursor) {
      window.addEventListener("pointermove", alMover, { passive: true });
      gsap.ticker.add(seguir);
    }

    pintar();

    return () => {
      entrada.kill();
      st.kill();
      gsap.ticker.remove(seguir);
      window.removeEventListener("pointermove", alMover);
    };
  }, [listo]);

  return (
    <div ref={pista} className="h-[400svh] motion-reduce:h-svh">
    <section
      id="hero"
      ref={seccion}
      className="sticky top-0 h-svh w-full overflow-hidden bg-navy-900 text-white"
    >
      {/* Plano más profundo: el vacío, generado con Higgsfield. */}
      <div
        ref={fondo}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-60 will-change-transform"
        style={{ backgroundImage: "url('/images/hero/fondo.webp')" }}
      />

      <EscenaBurbujas ref={escena} onListo={alListo} />

      {/* Dentro de la burbuja: el Perú. */}
      <div
        ref={interior}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden overflow-hidden opacity-0"
      >
        <div className="absolute inset-0 flex gap-[3px] bg-navy-900 sm:gap-1.5">
          {PANELES.map((pn, i) => (
            <div
              key={pn.img}
              ref={(n) => {
                paneles.current[i] = n;
              }}
              className="relative h-full flex-1 overflow-hidden will-change-transform"
            >
              {/* Deriva lenta, desfasada en cada panel: las fotos respiran. */}
              <div
                className="deriva absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url('/images/peru/panel-${pn.img}.webp')`,
                  animationDelay: `${-i * 4.5}s`,
                }}
              />
              <span className="absolute inset-x-0 top-[30%] flex justify-center overflow-hidden sm:top-[22%]">
                <span
                  ref={(n) => {
                    letras.current[i] = n;
                  }}
                  className="block font-sans font-extralight leading-[0.9] text-white [font-size:clamp(5.5rem,24vw,8rem)] [text-shadow:0_4px_30px_rgba(0,0,0,0.35)] will-change-transform sm:[font-size:clamp(7rem,15vw,14rem)]"
                  style={{ transform: "translate3d(0, 105%, 0)" }}
                >
                  {pn.letra}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Viñeta: oscurece bordes y pie para que el texto agarre. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 18% 82%, rgba(10,21,51,.7) 0%, transparent 100%), radial-gradient(ellipse 80% 70% at 50% 38%, transparent 55%, rgba(10,21,51,.6) 100%), linear-gradient(to bottom, rgba(10,21,51,.6) 0%, transparent 20%, transparent 50%, rgba(10,21,51,.92) 100%)",
        }}
      />

      {/* Ficha técnica en vidrio. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10">
        {FICHA.map((f, i) => (
          <div
            key={f.etiqueta}
            ref={(n) => {
              fichas.current[i] = n;
            }}
            className={`absolute ${f.pos} rounded-2xl border border-white/15 bg-white/[0.06] px-4 py-3 opacity-0 sm:px-5 sm:py-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-md will-change-transform`}
          >
            <p className="font-display text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/55">
              {f.etiqueta}
            </p>
            <p className="tabular mt-1.5 font-display text-[26px] font-bold leading-none text-gold sm:text-[30px]">
              {f.valor}
            </p>
          </div>
        ))}
      </div>

      {/* Riel de progreso. */}
      <div
        ref={riel}
        aria-hidden="true"
        className="pointer-events-none absolute right-6 top-1/2 z-10 hidden -translate-y-1/2 flex-col items-center gap-3 lg:right-10 lg:flex"
      >
        <span
          ref={contador}
          className="tabular font-display text-[11px] font-semibold tracking-[0.2em] text-white/70"
        >
          01
        </span>
        <div className="relative h-36 w-px overflow-hidden bg-white/15">
          <div
            ref={relleno}
            className="absolute inset-0 origin-top bg-gold"
            style={{ transform: "scaleY(0)" }}
          />
        </div>
        <span className="tabular font-display text-[11px] font-semibold tracking-[0.2em] text-white/30">
          0{ACTOS.length}
        </span>
      </div>

      {/* Texto: abajo, el centro es de la escena. */}
      <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-8 sm:pb-10 lg:px-12 lg:pb-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:gap-8">
          <div className="relative h-[150px]">
            {ACTOS.map((a, i) => {
              const Titulo = i === 0 ? "h1" : "h2";
              return (
                <div
                  key={a.titulo}
                  data-acto
                  className="absolute inset-x-0 bottom-0"
                  style={{ visibility: i === 0 ? "visible" : "hidden" }}
                >
                  <p
                    data-ceja
                    className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-gold [text-shadow:0_1px_3px_rgba(5,12,34,.95),0_0_14px_rgba(5,12,34,.9)]"
                    style={{ opacity: 0 }}
                  >
                    {a.ceja}
                  </p>
                  <Titulo className="mt-4 max-w-[17ch] font-display font-bold leading-[1.02] tracking-[-0.035em] text-white [font-size:clamp(2.2rem,6.2vw,4.9rem)] [text-shadow:0_2px_24px_rgba(5,12,34,.55)]">
                    {a.titulo.split(" ").map((p, j) => (
                      <span
                        key={j}
                        className="mr-[0.24em] inline-block overflow-hidden pb-[0.1em] align-bottom last:mr-0"
                      >
                        <span
                          data-palabra
                          className="inline-block will-change-transform"
                          style={{ transform: "translate3d(0, 110%, 0)" }}
                        >
                          {p}
                        </span>{" "}
                      </span>
                    ))}
                  </Titulo>
                </div>
              );
            })}
          </div>

          {/* El CTA no se va nunca: quien ya se convenció no tiene por qué
              recorrer todo el viaje para escribirnos. */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-t border-white/12 pt-5 sm:gap-6 sm:pt-6">
            <p className="max-w-[38ch] text-[14px] leading-relaxed text-white/70 sm:text-[13.5px] sm:text-white/55">
              Diseñamos la muestra, salimos a campo y te entregamos la respuesta.
              Trabajamos en Lima y, según el estudio, en otras regiones.
            </p>
            <div
              ref={indicador}
              aria-hidden="true"
              className="hidden items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50 md:flex"
              style={{ opacity: 0 }}
            >
              <span className="relative h-9 w-px overflow-hidden bg-white/15">
                <span className="gota absolute inset-x-0 top-0 h-[40%] bg-gold" />
              </span>
              Desliza para entrar
            </div>
            <Link
              href="https://wa.me/51931370624?text=Hola%2C%20quiero%20una%20propuesta%20para%20un%20estudio"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-full items-center justify-center rounded-lg bg-gold px-6 py-3.5 font-display text-[15px] font-semibold text-navy transition-colors hover:bg-[#d8b95e] sm:w-auto sm:py-3"
            >
              Recibe una propuesta en 48 horas
            </Link>
          </div>
        </div>
      </div>

      {/* Velo de carga: la escena aparece resuelta, no a medio construir. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-20 bg-navy-900 transition-opacity duration-[1400ms]"
        style={{ opacity: listo ? 0 : 1 }}
      />
    </section>
    </div>
  );
};

export default HeroInmersion;
