"use client";

import { useEffect, useRef, useState } from "react";
import { movimientoReducido } from "@/lib/scroll";

/**
 * Cuenta hasta `hasta` cuando entra en pantalla.
 * Si el valor no es numérico (por ejemplo "Abierto") se muestra tal cual.
 */
const Contador = ({
  valor,
  className = "",
}: {
  valor: string;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const numero = parseFloat(valor);
  const esNumero = !Number.isNaN(numero);
  const sufijo = esNumero ? valor.replace(/^[\d.,]+/, "") : "";

  const [actual, setActual] = useState(esNumero ? 0 : numero);

  useEffect(() => {
    const el = ref.current;
    if (!el || !esNumero) return;

    if (movimientoReducido()) {
      setActual(numero);
      return;
    }

    const observador = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      observador.disconnect();

      const duracion = 1100;
      const inicio = performance.now();

      const paso = (ahora: number) => {
        const t = Math.min((ahora - inicio) / duracion, 1);
        // Desaceleración: rápido al principio, se asienta al final.
        const suave = 1 - Math.pow(1 - t, 3);
        setActual(numero * suave);
        if (t < 1) requestAnimationFrame(paso);
      };

      requestAnimationFrame(paso);
    });

    observador.observe(el);
    return () => observador.disconnect();
  }, [numero, esNumero]);

  if (!esNumero) {
    return <span className={className}>{valor}</span>;
  }

  const entero = Number.isInteger(numero);
  const mostrado = entero
    ? Math.round(actual).toString()
    : actual.toFixed(0);

  return (
    <span ref={ref} className={className}>
      {mostrado}
      {sufijo}
    </span>
  );
};

export default Contador;
