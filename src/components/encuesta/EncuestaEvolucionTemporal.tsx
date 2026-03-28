"use client";

import { useState, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  type ChartOptions,
  type ChartDataset,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

const ME = 2.8;

const LABELS = [
  "Ene-25","Abr-25","Jul-25","Ago-25","Set-25","Oct-25",
  "Nov-25","Dic-25","Ene-26","Feb1-26","Feb2-26","Mar1-26","Mar2-26",
];

const ALL_SERIES = [
  {
    key: "keiko",
    label: "Keiko Fujimori",
    color: "#185FA5",
    data: [12, 11, 9, 8, 8, 6, 8, 8, 7, 8, 9, 11, 11] as (number | null)[],
  },
  {
    key: "aliaga",
    label: "R. López Aliaga",
    color: "#0F6E56",
    data: [4, 6, 7, 10, 10, 10, 9, 10, 10, 12, 10, 10, 10] as (number | null)[],
  },
  {
    key: "alvarez",
    label: "Carlos Álvarez",
    color: "#854F0B",
    data: [4, 6, 6, 6, 4, 5, 4, 4, 4, 4, 3, 6, 5] as (number | null)[],
  },
  {
    key: "acuna",
    label: "César Acuña",
    color: "#7F77DD",
    data: [2, 3, 2, 2, 3, 3, 3, 4, 4, 4, 4, 4, 3] as (number | null)[],
  },
  {
    key: "lopezc",
    label: "A. López Chau",
    color: "#D85A30",
    data: [2, 2, 2, 3, 3, 3, 3, 2, 4, 4, 4, 3, 5] as (number | null)[],
  },
  {
    key: "nieto",
    label: "Jorge Nieto",
    color: "#888780",
    data: [1, 2, 5, 2, 2, 2, 2, 5, null, null, null, 2, 5] as (number | null)[],
  },
];

const DEFAULT_ACTIVE = new Set(["keiko", "aliaga", "alvarez"]);

export default function EncuestaEvolucionTemporal() {
  const [active, setActive] = useState<Set<string>>(new Set(DEFAULT_ACTIVE));

  function toggle(key: string) {
    setActive((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const datasets = useMemo(() => {
    const result: ChartDataset<"line">[] = [];
    ALL_SERIES.filter((s) => active.has(s.key)).forEach((s) => {
      const topData = s.data.map((v) => (v != null ? v + ME : null));
      const botData = s.data.map((v) => (v != null ? Math.max(0, v - ME) : null));

      // Banda superior — fill to next dataset (banda inferior)
      result.push({
        label: `${s.key}_top`,
        data: topData as number[],
        borderWidth: 0,
        pointRadius: 0,
        backgroundColor: s.color + "28",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        fill: "+1" as any,
        spanGaps: true,
        tension: 0.35,
      });

      // Banda inferior — no fill
      result.push({
        label: `${s.key}_bot`,
        data: botData as number[],
        borderWidth: 0,
        pointRadius: 0,
        backgroundColor: "transparent",
        fill: false,
        spanGaps: true,
        tension: 0.35,
      });

      // Línea principal
      result.push({
        label: s.label,
        data: s.data as number[],
        borderColor: s.color,
        backgroundColor: s.color,
        borderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.35,
        spanGaps: true,
        fill: false,
      });
    });
    return result;
  }, [active]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: "#e2e8f0" },
        ticks: {
          color: "#64748b",
          font: { size: 10 },
          maxRotation: 35,
          minRotation: 0,
        },
      },
      y: {
        min: 0,
        max: 18,
        grid: { color: "#e2e8f0" },
        border: { dash: [4, 4] },
        ticks: {
          callback: (v) => `${v}%`,
          color: "#64748b",
          font: { size: 11 },
        },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        filter: (item) => {
          const lbl = item.dataset.label ?? "";
          return !lbl.endsWith("_top") && !lbl.endsWith("_bot");
        },
        callbacks: {
          label: (ctx) => {
            const v = ctx.parsed.y;
            if (v == null) return "";
            const lo = Math.max(0, v - ME).toFixed(1);
            const hi = (v + ME).toFixed(1);
            return `${ctx.dataset.label}: ${v}% [IC: ${lo}–${hi}%]`;
          },
        },
        backgroundColor: "#0b1b3b",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        padding: 10,
        cornerRadius: 8,
        mode: "index",
        intersect: false,
      },
    },
  };

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-base font-bold text-[#1b2b5a] mb-1">
          Evolución temporal con bandas de incertidumbre
        </h3>
        <p className="text-xs text-slate-500">
          Las bandas sombreadas representan el IC 95% (±2.8 pp). Enero 2025 – Marzo 2026.
          Por defecto se muestran los tres candidatos con mayor intención de voto.
        </p>
      </div>

      {/* Toggle buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ALL_SERIES.map((s) => (
          <button
            key={s.key}
            onClick={() => toggle(s.key)}
            className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-semibold transition-all"
            style={{
              backgroundColor: active.has(s.key) ? s.color : "#fff",
              borderColor: s.color,
              color: active.has(s.key) ? "#fff" : "#475569",
            }}
          >
            <span
              className="w-2 h-2 rounded-full inline-block"
              style={{ backgroundColor: active.has(s.key) ? "#fff" : s.color }}
            />
            {s.label}
          </button>
        ))}
      </div>

      <div style={{ height: 340 }}>
        <Line data={{ labels: LABELS, datasets }} options={options} />
      </div>
    </div>
  );
}
