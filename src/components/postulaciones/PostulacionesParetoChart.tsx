"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

interface Item {
  postulante: string;
  totalPostulaciones: number;
  acumulado: number;
  pctAcumulado: number;
}

function normalizeName(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .trim();
}

interface PostulacionesParetoChartProps {
  data: Item[];
  maxBars?: number;
  /** Mapa nombre postulante → URL de imagen (avatar) para el eje X */
  postulanteToImageUrl?: Record<string, string>;
  /** Mapa nombre normalizado → URL de imagen (fallback) */
  postulanteToImageUrlByNormal?: Record<string, string>;
}

const TICK_SIZE = 18;

function CustomTickAvatar({
  x,
  y,
  payload,
  index = 0,
  data,
  postulanteToImageUrl = {},
  postulanteToImageUrlByNormal = {},
}: {
  x: number;
  y: number;
  payload?: { value?: string } | string;
  index?: number;
  data?: Item[];
  postulanteToImageUrl?: Record<string, string>;
  postulanteToImageUrlByNormal?: Record<string, string>;
}) {
  const nameFromPayload =
    typeof payload === "string"
      ? payload
      : (payload as { value?: string })?.value ?? "";

  const tickIndex =
    typeof index === "number" && index >= 0
      ? index
      : (data?.findIndex(
          (d) => normalizeName(d.postulante) === normalizeName(nameFromPayload)
        ) ?? 0);

  // Prefer data[index] for guaranteed correct name-to-bar mapping
  const name =
    data && data[tickIndex] ? data[tickIndex].postulante : nameFromPayload;

  const imgUrl =
    postulanteToImageUrl[name] ??
    (name ? postulanteToImageUrlByNormal[normalizeName(name)] : undefined);

  const half = TICK_SIZE / 2;
  // Each tick gets its own unique clipPath id to avoid coordinate conflicts
  const clipId = `pareto-clip-${tickIndex}`;

  return (
    <g transform={`translate(${x},${y})`}>
      <defs>
        <clipPath id={clipId}>
          <circle cx={0} cy={half} r={half} />
        </clipPath>
      </defs>
      {imgUrl ? (
        <image
          href={imgUrl}
          x={-half}
          y={0}
          width={TICK_SIZE}
          height={TICK_SIZE}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        >
          <title>{name}</title>
        </image>
      ) : (
        <text x={0} y={TICK_SIZE / 2 + 4} textAnchor="middle" fontSize={9} fill="#475569">
          {name.length > 8 ? name.slice(0, 7) + "…" : name}
        </text>
      )}
    </g>
  );
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: Item }> }) {
  if (!active || !payload?.[0]) return null;
  const raw = payload[0].payload;
  return (
    <div className="bg-white p-2 sm:p-3 border border-slate-200 rounded-lg shadow-lg max-w-[220px]">
      <p className="font-semibold text-[#0b1b3b] text-sm truncate">{raw.postulante}</p>
      <p className="text-xs text-slate-600">Postulaciones: {raw.totalPostulaciones}</p>
      <p className="text-xs text-slate-600">Acumulado: {raw.acumulado} ({raw.pctAcumulado.toFixed(0)}%)</p>
    </div>
  );
}

export default function PostulacionesParetoChart({
  data,
  maxBars,
  postulanteToImageUrl = {},
  postulanteToImageUrlByNormal = {},
}: PostulacionesParetoChartProps) {
  const visible = maxBars != null ? data.slice(0, maxBars) : data;

  if (!visible.length) {
    return (
      <div className="h-[280px] flex items-center justify-center text-slate-500 text-sm">
        No hay datos
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] sm:h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={visible} margin={{ top: 8, right: 48, left: 8, bottom: TICK_SIZE + 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis
            dataKey="postulante"
            stroke="#94a3b8"
            tick={(props) => (
              <CustomTickAvatar
                {...props}
                data={visible}
                postulanteToImageUrl={postulanteToImageUrl}
                postulanteToImageUrlByNormal={postulanteToImageUrlByNormal}
              />
            )}
            tickLine={false}
            label={{
              value: "Candidato",
              position: "insideBottom",
              offset: -4,
              style: { fontSize: 12, fill: "#475569", fontWeight: 500 },
            }}
          />
          <YAxis
            yAxisId="left"
            tick={{ fontSize: 11, fill: "#64748b" }}
            stroke="#94a3b8"
            label={{
              value: "Nº postulaciones",
              angle: -90,
              position: "insideLeft",
              style: { fontSize: 12, fill: "#475569", fontWeight: 500 },
            }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 11, fill: "#64748b" }}
            stroke="#94a3b8"
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
            label={{
              value: "% acumulado",
              angle: 90,
              position: "insideRight",
              style: { fontSize: 12, fill: "#475569", fontWeight: 500 },
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value) => <span className="text-xs sm:text-sm text-slate-700">{value}</span>} />
          <Bar
            yAxisId="left"
            dataKey="totalPostulaciones"
            name="Postulaciones"
            fill="#1b2b5a"
            radius={[4, 4, 0, 0]}
            maxBarSize={visible.length > 20 ? 12 : 28}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="pctAcumulado"
            name="% acumulado"
            stroke="#2E7D8F"
            strokeWidth={2}
            dot={false}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
