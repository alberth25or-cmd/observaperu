"use client";

import { useEffect, useRef } from "react";
import { movimientoReducido } from "@/lib/scroll";

/**
 * Revela su contenido al entrar en pantalla.
 * `retraso` sirve para escalonar varios elementos hermanos.
 */
const Revelar = ({
  children,
  className = "",
  retraso = 0,
}: {
  children: React.ReactNode;
  className?: string;
  retraso?: number;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (movimientoReducido()) {
      el.classList.add("visible");
      return;
    }

    const mostrar = () => {
      el.style.transitionDelay = `${retraso}ms`;
      el.classList.add("visible");
    };

    // Si ya está a la vista al montar, se revela de inmediato. Evita que un
    // bloque dentro del margen negativo se quede oculto para siempre.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      mostrar();
      return;
    }

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          mostrar();
          observador.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" }
    );

    observador.observe(el);

    // Red de seguridad: si algo impide que el observador dispare —una carga
    // anclada con #hash, por ejemplo— el contenido se muestra igual. Un
    // efecto decorativo nunca debe poder dejar texto invisible.
    const rescate = window.setTimeout(() => {
      if (el.getBoundingClientRect().top < window.innerHeight) mostrar();
    }, 1200);

    return () => {
      observador.disconnect();
      window.clearTimeout(rescate);
    };
  }, [retraso]);

  return (
    <div ref={ref} className={`revelar ${className}`}>
      {children}
    </div>
  );
};

export default Revelar;
