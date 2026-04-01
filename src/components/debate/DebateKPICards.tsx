"use client";

import { DebateStats } from "@/lib/debateAnalytics";

interface Props {
  data: DebateStats;
  jornada?: string;
}

export default function DebateKPICards({ data, jornada = "Primera jornada" }: Props) {
  const { metadata, candidatos } = data;

  const masAgresivo = [...candidatos].sort(
    (a, b) => b.porcentajeAtaque - a.porcentajeAtaque
  )[0];

  const masProspositivo = [...candidatos].sort(
    (a, b) => b.porcentajePropuesta - a.porcentajePropuesta
  )[0];

  const masHablo = [...candidatos].sort(
    (a, b) => b.tiempoSegundos - a.tiempoSegundos
  )[0];

  const cards = [
    {
      label: "Candidatos",
      value: `${metadata.candidatos}`,
      sub: jornada,
      color: "#1b2b5a",
    },
    {
      label: "Duración total",
      value: metadata.duracionLabel,
      sub: metadata.fecha,
      color: "#2E7D8F",
    },
    {
      label: "Más tiempo de habla",
      value: masHablo.nombre.split(" ").slice(0, 2).join(" "),
      sub: masHablo.tiempoLabel,
      color: "#4A90E2",
    },
    {
      label: "Más agresivo",
      value: masAgresivo.nombre.split(" ").slice(0, 2).join(" "),
      sub: `${masAgresivo.porcentajeAtaque}% ataques`,
      color: "#C0392B",
    },
    {
      label: "Más propositivo",
      value: masProspositivo.nombre.split(" ").slice(0, 2).join(" "),
      sub: `${masProspositivo.porcentajePropuesta}% propuestas`,
      color: "#27AE60",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
      {cards.map((card, i) => (
        <div
          key={i}
          className="bg-white rounded-xl p-3 sm:p-4 lg:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <div className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-500 mb-1.5 sm:mb-2 uppercase tracking-wide">
            {card.label}
          </div>
          <div
            className="text-base sm:text-lg lg:text-xl xl:text-2xl font-extrabold leading-tight"
            style={{ color: card.color }}
          >
            {card.value}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-400 mt-1">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
