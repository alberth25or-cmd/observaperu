"use client";

import { useEffect, useRef } from "react";
import { suscribirScroll, movimientoReducido } from "@/lib/scroll";

const filas: { dato: string; valor: string; aclaracion?: string }[] = [
  { dato: "Población objetivo", valor: "Adultos 18+, Lima Metropolitana" },
  { dato: "Tamaño de muestra", valor: "n = 800" },
  {
    dato: "Método de selección",
    valor: "Probabilístico polietápico",
    aclaracion: "Al azar y por etapas: zonas, hogares y personas.",
  },
  { dato: "Técnica", valor: "Entrevista presencial en hogares" },
  { dato: "Duración del campo", valor: "14 días" },
  {
    dato: "Margen de error",
    // 1.96 · √(0.25 · 1.5 / 800): máxima dispersión con efecto de diseño de 1.5.
    valor: "± 4.2 % (95 % de confianza)",
    aclaracion: "Un 50 % se lee como algo entre 45.8 % y 54.2 %.",
  },
];

// Filas ya visibles al entrar, para que la ficha nunca se vea vacía.
const FILAS_INICIALES = 3;

/**
 * Superficie viva: la ficha técnica se construye fila por fila mientras
 * avanzas. Es el diferencial de la marca —"te mostramos cómo medimos"—
 * así que en vez de contarlo, lo hace delante del visitante.
 *
 * Tres planos: la curva normal al fondo (lenta, escala), el texto (quieto)
 * y las filas (entran escalonadas).
 */
const FichaProgresiva = () => {
  const seccion = useRef<HTMLElement>(null);
  const curva = useRef<HTMLDivElement>(null);
  const refFilas = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const el = seccion.current;
    if (!el) return;

    const mostrarTodo = () =>
      refFilas.current.forEach((f) => {
        if (f) {
          f.style.opacity = "1";
          f.style.transform = "none";
        }
      });

    if (movimientoReducido()) {
      mostrarTodo();
      return;
    }

    // En celular el texto y la ficha no caben en una pantalla: la sección
    // corre normal y la ficha se muestra completa.
    const escritorio = window.matchMedia("(min-width: 1024px)");

    return suscribirScroll(() => {
      if (!escritorio.matches) {
        mostrarTodo();
        return;
      }
      const caja = el.getBoundingClientRect();
      const recorrido = caja.height - window.innerHeight;
      if (recorrido <= 0) return;
      const avance = Math.max(0, Math.min(1, -caja.top / recorrido));

      // Las filas ocupan el tramo central del recorrido; el bloque de lo que
      // se puede afirmar entra al final, como una fila más.
      const t = Math.max(0, Math.min(1, (avance - 0.05) / 0.7));
      const pos = FILAS_INICIALES + t * (filas.length + 1 - FILAS_INICIALES);

      refFilas.current.forEach((f, i) => {
        if (!f) return;
        const d = Math.max(0, Math.min(1, pos - i));
        f.style.opacity = d.toFixed(3);
        f.style.transform = `translate3d(${((1 - d) * 26).toFixed(1)}px, 0, 0)`;
      });

      // Plano lejano: la curva crece y se aclara con el avance.
      if (curva.current) {
        curva.current.style.transform = `translate3d(0, ${(avance * -60).toFixed(1)}px, 0) scale(${(1 + avance * 0.22).toFixed(3)})`;
        curva.current.style.opacity = (0.18 + avance * 0.3).toFixed(3);
      }
    });
  }, []);

  return (
    <section
      ref={seccion}
      data-escena
      id="metodologia"
      className="relative bg-hueso lg:h-[300vh]"
    >
      <div className="relative overflow-hidden lg:sticky lg:top-0 lg:h-svh">
        {/* Plano lejano: la curva normal real, la misma función que en /tesistas */}
        <div
          ref={curva}
          data-plano
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 right-[-6%] h-[62%] w-[62%] bg-contain bg-right-bottom bg-no-repeat will-change-transform"
          style={{
            backgroundImage: "url('/images/curva-normal.svg')",
            opacity: 0.18,
          }}
        />

        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 lg:h-full lg:grid-cols-2 lg:gap-12 lg:px-10 lg:pb-0 lg:pt-[72px]">
          <div>
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.24em] text-gold-dark">
              Metodología
            </p>
            <h2 className="mt-5 max-w-[16ch] font-display text-[34px] font-bold leading-[1.02] tracking-[-0.035em] lg:text-[44px]">
              ¿De dónde salió ese número?
            </h2>
            <p className="mt-7 max-w-[46ch] text-[16.5px] leading-relaxed text-navy/70">
              Te lo va a preguntar tu directorio, quien financia tu proyecto o
              tu jurado de tesis. Cada estudio lleva una ficha técnica con la
              respuesta: a quiénes preguntamos, cuántos eran, cómo los elegimos
              y con qué margen de error se lee cada cifra.
            </p>
            <p className="mt-5 max-w-[46ch] text-[16.5px] leading-relaxed text-navy/70">
              El informe también te dice, en lenguaje simple, qué puedes afirmar
              con esos resultados y qué no.
            </p>
          </div>

          <div className="rounded-2xl border border-gris bg-white/85 p-6 shadow-[0_24px_60px_-30px_rgba(15,30,74,.4)] lg:p-7 lg:backdrop-blur-sm">
            <p className="font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-navy/40">
              Ficha técnica de ejemplo
            </p>
            <dl className="tabular mt-4 text-[15px]">
              {filas.map((f, i) => (
                <div
                  key={f.dato}
                  ref={(n) => {
                    refFilas.current[i] = n;
                  }}
                  className={`grid grid-cols-[auto_1fr] gap-x-6 border-b border-gris py-3 last:border-0 will-change-transform lg:py-2.5 ${
                    i < FILAS_INICIALES ? "" : "lg:opacity-0"
                  }`}
                >
                  <dt className="text-navy/55">{f.dato}</dt>
                  <dd className="text-right font-medium">{f.valor}</dd>
                  {f.aclaracion && (
                    <dd className="col-span-2 mt-1 text-[13.5px] leading-snug text-navy/60">
                      {f.aclaracion}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
            <div
              ref={(n) => {
                refFilas.current[filas.length] = n;
              }}
              className="mt-3 rounded-xl bg-navy-900 p-4 text-[14px] leading-snug text-white/75 will-change-transform lg:opacity-0"
            >
              <p>
                <span className="font-semibold text-gold">Puedes afirmar: </span>
                “Cerca de la mitad de{" "}
                <strong className="font-semibold text-white">
                  los adultos de Lima
                </strong>{" "}
                conoce la marca.”
              </p>
              <p className="mt-2">
                <span className="font-semibold text-gold">
                  No puedes afirmar:{" "}
                </span>
                “Cerca de la mitad de{" "}
                <strong className="font-semibold text-white">
                  los peruanos
                </strong>{" "}
                conoce la marca.”
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FichaProgresiva;
