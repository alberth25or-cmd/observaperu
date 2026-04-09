"use client";

const ME = 2.8;
const MAX_VAL = 20;

const pairs = [
  {
    a: { name: "Keiko Fujimori", val: 13, color: "#185FA5" },
    b: { name: "Carlos Álvarez", val: 9,  color: "#854F0B" },
  },
  {
    a: { name: "Carlos Álvarez",  val: 9, color: "#854F0B" },
    b: { name: "R. López Aliaga", val: 8, color: "#0F6E56" },
  },
  {
    a: { name: "Keiko Fujimori",  val: 13, color: "#185FA5" },
    b: { name: "Roberto Sánchez", val: 6,  color: "#993C1D" },
  },
  {
    a: { name: "Jorge Nieto",   val: 5, color: "#888780" },
    b: { name: "A. López Chau", val: 4, color: "#D85A30" },
  },
];

function overlaps(aVal: number, bVal: number, me = ME) {
  return Math.max(aVal - me, 0) <= bVal + me && bVal - me <= aVal + me;
}

function RangeBar({ name, val, color }: { name: string; val: number; color: string }) {
  const lo = Math.max(0, val - ME);
  const hi = val + ME;
  const loP = (lo / MAX_VAL) * 100;
  const hiP = (hi / MAX_VAL) * 100;
  const centerP = (val / MAX_VAL) * 100;

  return (
    <div className="flex items-center gap-2 min-w-0">
      <span className="w-28 shrink-0 text-xs font-semibold text-[#1b2b5a] text-right truncate">{name}</span>
      <div className="flex-1 relative h-5">
        <div className="absolute inset-y-0 left-0 right-0 rounded-full bg-slate-100" />
        <div
          className="absolute inset-y-1.5 rounded-full"
          style={{ left: `${loP}%`, width: `${Math.max(hiP - loP, 0)}%`, backgroundColor: color, opacity: 0.35 }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow"
          style={{ left: `calc(${centerP}% - 6px)`, backgroundColor: color }}
        />
      </div>
      <span className="w-32 shrink-0 text-xs text-slate-500 font-mono whitespace-nowrap">
        {lo.toFixed(1)} — <strong className="text-[#1b2b5a]">{val}</strong> — {hi.toFixed(1)}
      </span>
    </div>
  );
}

export default function EncuestaEmpateEstadisticoAbril() {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-base font-bold text-[#1b2b5a] mb-1">Detector de empate estadístico</h3>
        <p className="text-xs text-slate-500">
          Cuando los intervalos de confianza se superponen, la diferencia observada podría deberse al azar. Margen de error: ±2.8 pp.
        </p>
      </div>

      <div className="space-y-4">
        {pairs.map((pair, i) => {
          const isEmpate = overlaps(pair.a.val, pair.b.val);
          return (
            <div key={i} className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center justify-between mb-3 gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#1b2b5a]">
                  {pair.a.name} vs. {pair.b.name}
                </span>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0 ${isEmpate ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                  {isEmpate ? "Empate técnico" : "Diferencia real"}
                </span>
              </div>
              <div className="space-y-2.5">
                <RangeBar {...pair.a} />
                <RangeBar {...pair.b} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
