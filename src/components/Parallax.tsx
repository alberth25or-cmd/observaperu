"use client";

import { useEffect, useRef } from "react";
import { suscribirScroll, movimientoReducido } from "@/lib/scroll";

/**
 * Desplaza su contenido conforme el elemento atraviesa la pantalla.
 * `velocidad` positiva lo hace subir más lento que la página (queda atrás);
 * negativa lo adelanta.
 */
const Parallax = ({
  children,
  velocidad = 0.08,
  className = "",
}: {
  children: React.ReactNode;
  velocidad?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || movimientoReducido()) return;

    return suscribirScroll(() => {
      const caja = el.getBoundingClientRect();
      const alto = window.innerHeight;

      // Fuera de pantalla no gastamos trabajo.
      if (caja.bottom < -200 || caja.top > alto + 200) return;

      // 0 cuando el elemento entra por abajo, 1 cuando sale por arriba.
      const avance = (alto - caja.top) / (alto + caja.height);
      const desplazamiento = (avance - 0.5) * velocidad * 220;

      el.style.transform = `translate3d(0, ${desplazamiento.toFixed(2)}px, 0)`;
    });
  }, [velocidad]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`}>
      {children}
    </div>
  );
};

export default Parallax;
