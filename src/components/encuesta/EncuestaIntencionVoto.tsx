"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  type ChartOptions,
  type Plugin,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const ME = 2.8;

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

function getColor(v: number) {
  if (v >= 8) return "#185FA5";
  if (v >= 4) return "#888780";
  return "#D85A30";
}

const errorBarsPlugin: Plugin<"bar"> = {
  id: "encuestaErrorBars",
  afterDatasetsDraw(chart) {
    const { ctx, scales } = chart;
    chart.data.datasets.forEach((dataset, di) => {
      const meta = chart.getDatasetMeta(di);
      if (meta.hidden) return;
      meta.data.forEach((element, i) => {
        const val = (dataset.data[i] as number) ?? 0;
        const xHi = scales.x.getPixelForValue(val + ME);
        const xLo = scales.x.getPixelForValue(Math.max(0, val - ME));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const y = (element as any).y;
        ctx.save();
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1.5;
        // horizontal span
        ctx.beginPath();
        ctx.moveTo(xLo, y);
        ctx.lineTo(xHi, y);
        ctx.stroke();
        // caps
        const cap = 5;
        ctx.beginPath(); ctx.moveTo(xLo, y - cap); ctx.lineTo(xLo, y + cap); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(xHi, y - cap); ctx.lineTo(xHi, y + cap); ctx.stroke();
        ctx.restore();
      });
    });
  },
};

const thresholdPlugin: Plugin<"bar"> = {
  id: "encuestaThreshold",
  afterDraw(chart) {
    const { ctx, scales, chartArea } = chart;
    const x = scales.x.getPixelForValue(ME);
    ctx.save();
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#D85A30";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, chartArea.top);
    ctx.lineTo(x, chartArea.bottom);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = "#D85A30";
    ctx.font = "bold 10px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`±${ME}pp`, x, chartArea.top - 5);
    ctx.restore();
  },
};

const chartData = {
  labels: candidates.map((c) => c.name),
  datasets: [
    {
      label: "Intención de voto (%)",
      data: candidates.map((c) => c.value),
      backgroundColor: candidates.map((c) => getColor(c.value)),
      borderRadius: 4,
      borderWidth: 0,
      barThickness: 18,
    },
  ],
};

const options: ChartOptions<"bar"> = {
  indexAxis: "y",
  responsive: true,
  maintainAspectRatio: false,
  layout: { padding: { top: 16, right: 8 } },
  scales: {
    x: {
      min: 0,
      max: 17,
      grid: { color: "#e2e8f0" },
      border: { dash: [4, 4] },
      ticks: {
        callback: (v) => `${v}%`,
        color: "#64748b",
        font: { size: 11 },
      },
    },
    y: {
      grid: { display: false },
      ticks: {
        color: "#1b2b5a",
        font: { size: 11, weight: "bold" },
      },
    },
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => {
          const v = ctx.parsed.x;
          const lo = Math.max(0, v - ME).toFixed(1);
          const hi = (v + ME).toFixed(1);
          return [`Estimación: ${v}%`, `IC 95%: [${lo}% – ${hi}%]`];
        },
      },
      backgroundColor: "#0b1b3b",
      titleColor: "#fff",
      bodyColor: "#cbd5e1",
      padding: 10,
      cornerRadius: 8,
    },
  },
};

export default function EncuestaIntencionVoto() {
  return (
    <div>
      <div className="mb-3">
        <h3 className="text-base font-bold text-[#1b2b5a] mb-1">
          Intención de voto con intervalos de confianza
        </h3>
        <p className="text-xs text-slate-500">
          Las líneas de error muestran el IC 95% (±2.8 pp). La línea punteada roja marca el umbral del margen de error.
        </p>
      </div>

      {/* Leyenda */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block bg-[#185FA5]" />
          <span className="text-slate-600">≥8% — Resultado claro</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block bg-[#888780]" />
          <span className="text-slate-600">4–7% — Zona gris estadística</span>
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm inline-block bg-[#D85A30]" />
          <span className="text-slate-600">&lt;4% — Al límite del margen</span>
        </span>
      </div>

      <div style={{ height: 340 }}>
        <Bar
          data={chartData}
          options={options}
          plugins={[errorBarsPlugin, thresholdPlugin]}
        />
      </div>
    </div>
  );
}
