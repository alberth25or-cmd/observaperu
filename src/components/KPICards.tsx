"use client";

import { useMemo } from "react";

interface CandidatoEdad {
  slug: string;
  nombre: string;
  fecha_nacimiento: string;
  edad: number;
}

interface KPICardsProps {
  data: CandidatoEdad[];
}

export default function KPICards({ data }: KPICardsProps) {
  const stats = useMemo(() => {
    const edades = data.map((d) => d.edad).sort((a, b) => a - b);
    const promedio = edades.reduce((sum, edad) => sum + edad, 0) / edades.length;
    const mediana = edades.length % 2 === 0
      ? (edades[edades.length / 2 - 1] + edades[edades.length / 2]) / 2
      : edades[Math.floor(edades.length / 2)];
    const masJoven = Math.min(...edades);
    const mayor = Math.max(...edades);
    const rango = mayor - masJoven;

    return {
      promedio: promedio.toFixed(1),
      mediana: mediana.toFixed(1),
      masJoven,
      mayor,
      rango,
    };
  }, [data]);

  const cards = [
    {
      label: "Edad promedio",
      value: `${stats.promedio} años`,
      color: "#1b2b5a",
    },
    {
      label: "Mediana",
      value: `${stats.mediana} años`,
      color: "#2E7D8F",
    },
    {
      label: "Más joven",
      value: `${stats.masJoven} años`,
      color: "#4A90E2",
    },
    {
      label: "Mayor",
      value: `${stats.mayor} años`,
      color: "#8B9DC3",
    },
    {
      label: "Rango",
      value: `${stats.rango} años`,
      color: "#0f1d46",
    },
  ];

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p className="text-sm">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
      {cards.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-600 mb-1.5 sm:mb-2">
            {card.label}
          </div>
          <div
            className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-extrabold leading-tight"
            style={{ color: card.color }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </div>
  );
}


