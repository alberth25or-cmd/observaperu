"use client";

import { useState } from "react";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { DebateCandidato, TOPIC_LABELS, CANDIDATE_COLORS } from "@/lib/debateAnalytics";

interface Props {
  candidatos: DebateCandidato[];
}

export default function DebateRadarTemas({ candidatos }: Props) {
  const [selectedKey, setSelectedKey] = useState(candidatos[0]?.key ?? "");

  const topics = Object.keys(TOPIC_LABELS);

  // Average across all candidates per topic
  const avgTemas: Record<string, number> = {};
  topics.forEach((t) => {
    avgTemas[t] =
      candidatos.reduce((sum, c) => sum + (c.temas[t] ?? 0), 0) / candidatos.length;
  });

  const selected = candidatos.find((c) => c.key === selectedKey);

  const radarData = topics.map((t) => ({
    tema: TOPIC_LABELS[t],
    [selected?.nombre.split(" ")[0] ?? "Candidato"]:
      Math.round((selected?.temas[t] ?? 0) * 100),
    Promedio: Math.round(avgTemas[t] * 100),
  }));

  const candidateName = selected?.nombre.split(" ")[0] ?? "Candidato";
  const candidateColor = selected ? CANDIDATE_COLORS[selected.key] ?? "#4A90E2" : "#4A90E2";

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-lg font-bold text-[#1b2b5a]">Cobertura tematica por candidato</h3>
        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
          % de intervenciones por tema
        </span>
      </div>
      <p className="text-sm text-slate-500 mb-5">
        Que temas toco cada candidato vs. el promedio del grupo. Un candidato centrado en un
        solo eje es mas predecible; uno que cubre todos los temas muestra amplitud de agenda.
      </p>

      {/* Chip selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {candidatos.map((c) => {
          const shortName = c.nombre.split(" ").slice(0, 2).join(" ");
          const isSelected = c.key === selectedKey;
          return (
            <button
              key={c.key}
              onClick={() => setSelectedKey(c.key)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all border ${
                isSelected
                  ? "text-white border-transparent shadow-sm"
                  : "text-slate-600 bg-white border-slate-200 hover:border-slate-400"
              }`}
              style={
                isSelected
                  ? { backgroundColor: CANDIDATE_COLORS[c.key] ?? "#1b2b5a", borderColor: "transparent" }
                  : {}
              }
            >
              {shortName}
            </button>
          );
        })}
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <RadarChart data={radarData} margin={{ top: 10, right: 30, bottom: 10, left: 30 }}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="tema"
            tick={{ fontSize: 12, fill: "#475569", fontWeight: 600 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tickCount={4}
            tick={{ fontSize: 9, fill: "#94a3b8" }}
            tickFormatter={(v) => `${v}%`}
          />
          <Radar
            name="Promedio"
            dataKey="Promedio"
            stroke="#cbd5e1"
            fill="#cbd5e1"
            fillOpacity={0.25}
            strokeWidth={1.5}
            strokeDasharray="4 2"
          />
          <Radar
            name={candidateName}
            dataKey={candidateName}
            stroke={candidateColor}
            fill={candidateColor}
            fillOpacity={0.35}
            strokeWidth={2.5}
          />
          <Tooltip
            formatter={(value: any, name: string | undefined) => [`${value}%`, name ?? ""]}
            contentStyle={{
              fontSize: 12,
              borderRadius: 8,
              border: "1px solid #e2e8f0",
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(value) => (
              <span style={{ color: "#475569", fontWeight: 600 }}>{value}</span>
            )}
          />
        </RadarChart>
      </ResponsiveContainer>

      {selected && (
        <p className="text-xs text-slate-400 mt-2 text-center">
          {selected.nombre} ({selected.partido}) &mdash; {selected.tiempoLabel} de habla &mdash;{" "}
          {selected.intervenciones} intervenciones
        </p>
      )}
    </div>
  );
}
