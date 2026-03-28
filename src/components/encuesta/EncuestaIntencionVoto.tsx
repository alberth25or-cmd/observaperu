"use client";

import { useState } from "react";

const ME = 2.8;
const SCALE_MAX = 16; // % used as 100% of chart width

const candidates = [
  { name: "Keiko Fujimori",  value: 11 },
  { name: "R. López Aliaga", value: 10 },
  { name: "A. López Chau",   value: 5  },
  { name: "Roberto Sánchez", value: 5  },
  { name: "Carlos Álvarez",  value: 5  },
  { name: "Jorge Nieto",     value: 5  },
  { name: "César Acuña",     value: 3  },
  { name: "Y. Lescano",      value: 2  },
  { name: "M. Vizcarra",     value: 2  },
  { name: "J. Luna Gálvez",  value: 2  },
  { name: "G. Forsyth",      value: 2  },
  { name: "R. Belmont",      value: 2  },
];

// Candidates excluded from chart (< 1% — at or below noise floor)
const EXCLUDED = [
  "Antauro Humala", "Absalón Vásquez", "Luciana León",
  "Otros (< 1% c/u)",
];

function getColor(v: number) {
  if (v >= 8) return { bar: "#185FA5", bg: "#dbeafe", text: "#1e40af" };
  if (v >= 4) return { bar: "#888780", bg: "#f1f5f9", text: "#475569" };
  return { bar: "#D85A30", bg: "#fee2e2", text: "#b91c1c" };
}

function pct(v: number) {
  return `${(Math.max(0, v) / SCALE_MAX) * 100}%`;
}

// Grid lines at these values (%)
const GRID = [0, 4, 8, 12, 16];

function CandidateRow({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  const [hovered, setHovered] = useState(false);
  const colors = getColor(value);
  const lo = Math.max(0, value - ME);
  const hi = value + ME;

  return (
    <div
      className="flex items-center gap-3 group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Name */}
      <span
        className="text-xs font-bold text-right shrink-0 transition-colors"
        style={{
          width: 118,
          color: hovered ? colors.bar : "#1b2b5a",
        }}
      >
        {name}
      </span>

      {/* Chart area */}
      <div className="flex-1 relative h-6">
        {/* Grid lines */}
        {GRID.map((g) => (
          <div
            key={g}
            className="absolute top-0 bottom-0 border-l border-dashed"
            style={{
              left: pct(g),
              borderColor: g === 0 ? "#cbd5e1" : "#e2e8f0",
              borderWidth: g === 0 ? 1 : 1,
            }}
          />
        ))}

        {/* Reference line at ME */}
        <div
          className="absolute top-0 bottom-0"
          style={{
            left: pct(ME),
            borderLeft: "2px dashed #D85A30",
            opacity: 0.7,
          }}
        />

        {/* Bar */}
        <div
          className="absolute top-1 bottom-1 rounded-r-md transition-opacity"
          style={{
            left: 0,
            width: pct(value),
            backgroundColor: colors.bar,
            opacity: hovered ? 1 : 0.85,
          }}
        />

        {/* IC band (lo → hi), clipped at 0 */}
        <div
          className="absolute"
          style={{
            top: "50%",
            left: pct(lo),
            width: `calc(${pct(hi)} - ${pct(lo)})`,
            transform: "translateY(-50%)",
          }}
        >
          {/* Horizontal whisker line */}
          <div
            className="absolute inset-y-0 left-0 right-0"
            style={{
              top: "50%",
              height: 1.5,
              backgroundColor: "#334155",
              opacity: 0.55,
              transform: "translateY(-50%)",
            }}
          />
          {/* Left cap */}
          {lo > 0 && (
            <div
              className="absolute"
              style={{
                left: 0,
                top: "50%",
                width: 1.5,
                height: 10,
                backgroundColor: "#334155",
                opacity: 0.55,
                transform: "translateY(-50%)",
              }}
            />
          )}
          {/* Right cap */}
          <div
            className="absolute"
            style={{
              right: 0,
              top: "50%",
              width: 1.5,
              height: 10,
              backgroundColor: "#334155",
              opacity: 0.55,
              transform: "translateY(-50%)",
            }}
          />
        </div>

        {/* Tooltip on hover */}
        {hovered && (
          <div
            className="absolute z-10 -top-10 bg-[#0b1b3b] text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap pointer-events-none shadow-lg"
            style={{ left: pct(value), transform: "translateX(-50%)" }}
          >
            <span className="font-bold">{value}%</span>
            <span className="text-slate-300 ml-1.5">
              IC: [{lo.toFixed(1)}–{hi.toFixed(1)}%]
            </span>
          </div>
        )}
      </div>

      {/* Value label */}
      <div
        className="shrink-0 flex items-center gap-1"
        style={{ width: 52 }}
      >
        <span
          className="text-xs font-extrabold tabular-nums"
          style={{ color: colors.bar }}
        >
          {value}%
        </span>
        <span
          className="text-[9px] font-medium rounded px-1 py-0.5 leading-none"
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
          }}
        >
          ±{ME}
        </span>
      </div>
    </div>
  );
}

export default function EncuestaIntencionVoto() {
  return (
    <div>
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-[#1b2b5a] mb-1">
          Intención de voto con intervalos de confianza
        </h3>
        <p className="text-xs text-slate-500">
          Encuesta Ipsos · 22 mar 2026 · n=1,203 · Margen de error ±2.8 pp (IC
          95%). Las barras muestran la estimación puntual; los bigotes, el rango
          estadísticamente posible. La línea punteada roja indica el umbral del
          margen.
        </p>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-x-4 gap-y-1.5 mb-5 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block bg-[#185FA5]" />
          <span className="text-slate-600">
            <strong>≥8%</strong> — Resultado claro
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block bg-[#888780]" />
          <span className="text-slate-600">
            <strong>4–7%</strong> — Zona gris (diferencias dentro del margen)
          </span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block bg-[#D85A30]" />
          <span className="text-slate-600">
            <strong>&lt;4%</strong> — Al límite del margen de error
          </span>
        </span>
      </div>

      {/* Axis labels */}
      <div className="flex items-center gap-3 mb-1 pl-[121px] pr-[55px]">
        <div className="flex-1 relative h-4">
          {GRID.map((g) => (
            <span
              key={g}
              className="absolute text-[10px] text-slate-400 -translate-x-1/2"
              style={{ left: pct(g) }}
            >
              {g}%
            </span>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2">
        {candidates.map((c) => (
          <CandidateRow key={c.name} name={c.name} value={c.value} />
        ))}
      </div>

      {/* Excluded candidates note */}
      <div className="mt-5 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
        <p className="text-xs font-bold text-[#1b2b5a] mb-1.5">
          ¿Por qué no aparecen todos los candidatos?
        </p>
        <p className="text-xs text-slate-500 mb-2">
          Solo se muestran candidatos con intención de voto ≥2%. Los siguientes
          obtuvieron ≤1% (dentro del ruido estadístico — no es posible
          distinguirlos de cero con el margen de ±2.8 pp):
        </p>
        <div className="flex flex-wrap gap-1.5">
          {EXCLUDED.map((name) => (
            <span
              key={name}
              className="text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full"
            >
              {name}
            </span>
          ))}
        </div>
      </div>

      <p className="text-xs text-slate-400 mt-3 text-center">
        Fuente: Ipsos Perú para Perú21 · 21–22 mar 2026 · Hover sobre cada
        barra para ver el IC exacto.
      </p>
    </div>
  );
}
