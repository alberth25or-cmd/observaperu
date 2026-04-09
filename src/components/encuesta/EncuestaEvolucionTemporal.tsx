"use client";

import { useState, useMemo } from "react";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ME = 2.8;

const LABELS = [
  "Ene-25", "Abr-25", "Jul-25", "Ago-25", "Set-25", "Oct-25",
  "Nov-25", "Dic-25", "Ene-26", "Feb1-26", "Feb2-26", "Mar1-26", "Mar2-26", "02abr-26",
];

const ALL_SERIES = [
  {
    key: "keiko",
    label: "Keiko Fujimori",
    color: "#185FA5",
    data: [12, 11, 9, 8, 8, 6, 8, 8, 7, 8, 9, 10, 11, 13] as (number | null)[],
  },
  {
    key: "aliaga",
    label: "R. López Aliaga",
    color: "#0F6E56",
    data: [4, 6, 7, 10, 10, 10, 9, 10, 10, 12, 10, 11, 10, 8] as (number | null)[],
  },
  {
    key: "alvarez",
    label: "Carlos Álvarez",
    color: "#854F0B",
    data: [4, 6, 6, 6, 4, 5, 4, 4, 4, 4, 3, 6, 5, 9] as (number | null)[],
  },
  {
    key: "acuna",
    label: "César Acuña",
    color: "#7F77DD",
    data: [2, 3, 2, 2, 3, 3, 3, 3, 2, 4, 4, 4, 3, 3] as (number | null)[],
  },
  {
    key: "lopezc",
    label: "A. López Chau",
    color: "#D85A30",
    data: [2, 2, 2, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 4] as (number | null)[],
  },
  {
    key: "nieto",
    label: "Jorge Nieto",
    color: "#888780",
    data: [null, null, null, null, null, 1, 2, 5, 2, 2, 2, 2, 5, 5] as (number | null)[],
  },
  {
    key: "sanchez",
    label: "Roberto Sánchez",
    color: "#993C1D",
    data: [null, null, null, null, null, null, null, null, null, null, null, null, 4, 6] as (number | null)[],
  },
];

const DEFAULT_ACTIVE = new Set(["keiko", "aliaga", "alvarez"]);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  const lines = payload.filter(
    (p: any) =>
      typeof p.dataKey === "string" &&
      p.dataKey.endsWith("_val") &&
      p.value != null
  );
  if (!lines.length) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-xl p-3 text-xs min-w-[200px]">
      <p className="font-bold text-[#1b2b5a] mb-2 pb-1 border-b border-slate-100">
        {label}
      </p>
      {lines.map((p: any) => {
        const v = p.value as number;
        const s = ALL_SERIES.find((s) => `${s.key}_val` === p.dataKey);
        if (!s) return null;
        return (
          <div key={p.dataKey} className="flex justify-between gap-4 py-0.5">
            <span className="flex items-center gap-1.5">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: s.color }}
              />
              <span className="text-slate-600">{s.label}</span>
            </span>
            <span className="font-bold text-[#1b2b5a]">{v}%</span>
          </div>
        );
      })}
    </div>
  );
};

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

  // Build flat data array: one row per label
  const chartData = useMemo(
    () =>
      LABELS.map((label, i) => {
        const row: Record<string, number | null | string> = { label };
        ALL_SERIES.forEach((s) => {
          const v = s.data[i];
          row[`${s.key}_val`] = v ?? null;
          // band: stacked area = transparent base + visible height
          row[`${s.key}_bot`] = v != null ? Math.max(0, v - ME) : null;
          row[`${s.key}_size`] =
            v != null ? v + ME - Math.max(0, v - ME) : null;
        });
        return row;
      }),
    []
  );

  const activeSeries = ALL_SERIES.filter((s) => active.has(s.key));

  return (
    <div>
      <div className="mb-3">
        <h3 className="text-base font-bold text-[#1b2b5a] mb-1">
          Evolución temporal con bandas de incertidumbre
        </h3>
        <p className="text-xs text-slate-500">
          Bandas sombreadas = IC 95% (±2.8 pp) · Enero 2025 – Abril 2026.
          Por defecto se muestran los tres candidatos con mayor intención de
          voto.
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
              style={{
                backgroundColor: active.has(s.key) ? "#fff" : s.color,
              }}
            />
            {s.label}
          </button>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <ComposedChart
          data={chartData}
          margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#dde3f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10, fill: "#64748b" }}
            tickLine={false}
            axisLine={{ stroke: "#dde3f0" }}
          />
          <YAxis
            domain={[0, 18]}
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "#64748b" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          {activeSeries.map((s) => [
            /* Invisible base of the band */
            <Area
              key={`${s.key}_bot`}
              type="monotone"
              dataKey={`${s.key}_bot`}
              stackId={`band_${s.key}`}
              stroke="none"
              fill="transparent"
              fillOpacity={0}
              legendType="none"
              dot={false}
              activeDot={false}
              connectNulls
              isAnimationActive={false}
            />,
            /* Visible band height */
            <Area
              key={`${s.key}_size`}
              type="monotone"
              dataKey={`${s.key}_size`}
              stackId={`band_${s.key}`}
              stroke="none"
              fill={s.color}
              fillOpacity={0.15}
              legendType="none"
              dot={false}
              activeDot={false}
              connectNulls
              isAnimationActive={false}
            />,
            /* Main line */
            <Line
              key={`${s.key}_val`}
              type="monotone"
              dataKey={`${s.key}_val`}
              stroke={s.color}
              strokeWidth={2.5}
              dot={{ fill: s.color, r: 3.5, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              connectNulls
              legendType="none"
            />,
          ])}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
