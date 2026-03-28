"use client";

import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const REGIONS = ["Lima", "Norte", "Centro", "Sur", "Oriente", "Rural"];
const CANDIDATES = [
  "Keiko Fujimori",
  "R. López Aliaga",
  "A. López Chau",
  "Roberto Sánchez",
  "Carlos Álvarez",
  "Jorge Nieto",
  "César Acuña",
];

// rows = candidatos, cols = regiones [Lima, Norte, Centro, Sur, Oriente, Rural]
const DATA_BY_CANDIDATE = [
  [17.6, 19.6, 17.1,  1.0, 35.1, 16.6], // Keiko
  [28.2,  9.8, 14.4, 14.1,  8.4, 14.0], // López Aliaga
  [ 4.5,  3.0, 11.8, 24.2,  1.5, 12.9], // A. López Chau
  [ 1.7, 15.8,  8.8,  7.4,  5.7, 19.7], // Roberto Sánchez
  [ 6.4, 11.6,  6.5,  3.3,  7.9,  4.8], // Carlos Álvarez
  [ 9.9,  2.2,  4.9,  4.0,  1.6,  1.1], // Jorge Nieto
  [ 2.4, 12.7,  1.9,  1.3,  6.3, 10.8], // César Acuña
];

const CANDIDATE_COLORS = [
  "#185FA5", "#0F6E56", "#854F0B", "#993C1D",
  "#534AB7", "#888780", "#1D9E75",
];
const REGION_COLORS = [
  "#185FA5", "#0F6E56", "#854F0B",
  "#D85A30", "#7F77DD", "#888780",
];

type View = "candidate" | "region";

export default function EncuestaSimulacroPorRegion() {
  const [view, setView] = useState<View>("candidate");

  const chartData =
    view === "candidate"
      ? {
          labels: REGIONS,
          datasets: CANDIDATES.map((c, ci) => ({
            label: c,
            data: DATA_BY_CANDIDATE[ci],
            backgroundColor: CANDIDATE_COLORS[ci],
            borderRadius: 3,
            borderWidth: 0,
          })),
        }
      : {
          labels: CANDIDATES,
          datasets: REGIONS.map((r, ri) => ({
            label: r,
            data: DATA_BY_CANDIDATE.map((row) => row[ri]),
            backgroundColor: REGION_COLORS[ri],
            borderRadius: 3,
            borderWidth: 0,
          })),
        };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#1b2b5a",
          font: { size: 10, weight: "600" },
          maxRotation: 30,
        },
      },
      y: {
        min: 0,
        max: 42,
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
        callbacks: {
          label: (ctx) =>
            `${ctx.dataset.label}: ${(ctx.parsed.y as number).toFixed(1)}%`,
        },
        backgroundColor: "#0b1b3b",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        padding: 10,
        cornerRadius: 8,
      },
    },
  };

  const legendItems =
    view === "candidate"
      ? CANDIDATES.map((c, i) => ({ label: c, color: CANDIDATE_COLORS[i] }))
      : REGIONS.map((r, i) => ({ label: r, color: REGION_COLORS[i] }));

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-[#1b2b5a] mb-1">
            Simulacro por macrorregión — Votos válidos (%)
          </h3>
          <p className="text-xs text-slate-500">
            Simulacro Ipsos · 22 marzo 2026 · n=1,189
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setView("candidate")}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
              view === "candidate"
                ? "bg-[#1b2b5a] text-white border-[#1b2b5a]"
                : "bg-white text-[#1b2b5a] border-slate-300 hover:border-[#1b2b5a]"
            }`}
          >
            Por candidato
          </button>
          <button
            onClick={() => setView("region")}
            className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all ${
              view === "region"
                ? "bg-[#1b2b5a] text-white border-[#1b2b5a]"
                : "bg-white text-[#1b2b5a] border-slate-300 hover:border-[#1b2b5a]"
            }`}
          >
            Por región
          </button>
        </div>
      </div>

      {/* Leyenda dinámica */}
      <div className="flex flex-wrap gap-3 mb-4">
        {legendItems.map((item) => (
          <span
            key={item.label}
            className="flex items-center gap-1.5 text-xs text-slate-600"
          >
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>

      <div style={{ height: 340 }}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
}
