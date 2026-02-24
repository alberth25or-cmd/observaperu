"use client";

import { useMemo, useState, useCallback } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  useMapContext,
} from "react-simple-maps";
import {
  buildFlujosTerritoriales,
  flowColor,
  type FlowRow,
  type SameDeptDot,
  type FlujosTerritorialesData,
} from "@/lib/flujosTerritoriales";

// Mapeo datos → GeoJSON (mismo que MapaBurbujasPeru)
const DEPARTAMENTOS_MAP: Record<string, string> = {
  LIMA: "Lima",
  CALLAO: "Callao",
  AREQUIPA: "Arequipa",
  CUSCO: "Cusco",
  "LA LIBERTAD": "LaLibertad",
  PIURA: "Piura",
  LAMBAYEQUE: "Lambayeque",
  CAJAMARCA: "Cajamarca",
  ANCASH: "Ancash",
  JUNIN: "Junín",
  HUANUCO: "Huánuco",
  PUNO: "Puno",
  TACNA: "Tacna",
  MOQUEGUA: "Moquegua",
  APURIMAC: "Apurímac",
  AYACUCHO: "Ayacucho",
  HUANCAVELICA: "Huancavelica",
  ICA: "Ica",
  PASCO: "Pasco",
  "SAN MARTIN": "SanMartín",
  LORETO: "Loreto",
  UCAYALI: "Ucayali",
  "MADRE DE DIOS": "MadredeDios",
  AMAZONAS: "Amazonas",
};

const DEPARTAMENTOS_COORDS: Record<string, [number, number]> = {
  LIMA: [-77.0282, -12.0464],
  CALLAO: [-77.1181, -12.0566],
  AREQUIPA: [-71.535, -16.409],
  CUSCO: [-71.9675, -13.5319],
  "LA LIBERTAD": [-79.0289, -8.1116],
  PIURA: [-80.6328, -5.1945],
  LAMBAYEQUE: [-79.9086, -6.7766],
  CAJAMARCA: [-78.5, -7.1617],
  ANCASH: [-77.5283, -9.53],
  JUNIN: [-75.0152, -11.158],
  HUANUCO: [-76.2042, -9.9297],
  PUNO: [-70.0199, -15.8402],
  TACNA: [-70.2489, -18.0066],
  MOQUEGUA: [-70.9358, -17.1983],
  APURIMAC: [-72.8811, -13.6333],
  AYACUCHO: [-74.2236, -13.1631],
  HUANCAVELICA: [-74.975, -12.7871],
  ICA: [-75.7289, -14.068],
  PASCO: [-76.2562, -10.6886],
  "SAN MARTIN": [-76.125, -6.5083],
  LORETO: [-73.2475, -3.7491],
  UCAYALI: [-73.0877, -8.3791],
  "MADRE DE DIOS": [-69.1833, -12.6],
  AMAZONAS: [-78.1833, -5.2],
};

const GEO_URL = "/maps/peru_departamentos.geojson";
const STROKE_WIDTH = 1.5;
const SAME_DEPT_DOT_FILL = "#475569";
const SAME_DEPT_DOT_R = 4;

export type FlujoFilter = "todos" | "solo_lima" | "excluir_lima" | "top5";

interface MapaFlujosTerritorialesProps {
  data: Array<{
    nacimiento_departamento?: string;
    domicilio_departamento?: string;
  }>;
}

/** Curva tipo arco entre dos puntos (control point desplazado) */
function curvedPath(
  projection: (pos: [number, number]) => [number, number],
  from: [number, number],
  to: [number, number],
  curvature: number = 0.15
): string {
  const [x0, y0] = projection(from);
  const [x2, y2] = projection(to);
  const midLon = (from[0] + to[0]) / 2;
  const midLat = (from[1] + to[1]) / 2;
  const perpLon = (to[1] - from[1]) * curvature;
  const perpLat = (from[0] - to[0]) * curvature;
  const [cx, cy] = projection([midLon + perpLon, midLat + perpLat]);
  return `M ${x0} ${y0} Q ${cx} ${cy} ${x2} ${y2}`;
}

function FlowArcs({
  flows,
  hoveredDept,
  tooltipFlow,
  onFlowEnter,
  onFlowLeave,
}: {
  flows: FlowRow[];
  hoveredDept: string | null;
  tooltipFlow: FlowRow | null;
  onFlowEnter: (f: FlowRow) => void;
  onFlowLeave: () => void;
}) {
  const { projection } = useMapContext();
  const project = (pos: [number, number]): [number, number] => {
    const p = projection(pos);
    return p ?? [0, 0];
  };

  return (
    <g>
      {flows.map((f) => {
        const from = DEPARTAMENTOS_COORDS[f.origen];
        const to = DEPARTAMENTOS_COORDS[f.destino];
        if (!from || !to) return null;

        const isHighlight =
          !hoveredDept ||
          f.origen === hoveredDept ||
          f.destino === hoveredDept;
        const isTooltip = tooltipFlow === f;
        const opacity = isHighlight ? 1 : 0.25;
        const color = flowColor(f.normalized);

        return (
          <path
            key={`${f.origen}-${f.destino}`}
            d={curvedPath(project, from, to)}
            fill="none"
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            strokeOpacity={opacity}
            style={{
              cursor: "pointer",
              transition: "stroke-opacity 0.15s ease",
            }}
            onMouseEnter={() => onFlowEnter(f)}
            onMouseLeave={onFlowLeave}
          />
        );
      })}
    </g>
  );
}

export default function MapaFlujosTerritoriales({ data }: MapaFlujosTerritorialesProps) {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [tooltipFlow, setTooltipFlow] = useState<FlowRow | null>(null);
  const [filter, setFilter] = useState<FlujoFilter>("todos");

  const { flows, sameDept, minCount, maxCount } = useMemo(
    () => buildFlujosTerritoriales(data, 1),
    [data]
  );

  const filteredFlows = useMemo(() => {
    if (filter === "solo_lima")
      return flows.filter((f) => f.destino === "LIMA");
    if (filter === "excluir_lima")
      return flows.filter((f) => f.origen !== "LIMA" && f.destino !== "LIMA");
    if (filter === "top5")
      return [...flows].sort((a, b) => b.count - a.count).slice(0, 5);
    return flows;
  }, [flows, filter]);

  const handleGeographyHover = useCallback(
    (geoDeptName: string) => {
      const match = Object.entries(DEPARTAMENTOS_MAP).find(
        ([_, name]) => name === geoDeptName
      )?.[0];
      setHoveredDept(match ?? null);
    },
    []
  );

  if (!data?.length) {
    return (
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
        <p className="text-center text-slate-500 text-sm py-8">
          No hay datos disponibles
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0b1b3b] mb-1 sm:mb-2">
          Movilidad territorial: nacimiento y residencia
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
          Flujos entre departamento de nacimiento y domicilio. Intensidad por conteo global.
        </p>

        <label className="block text-xs sm:text-sm font-medium text-slate-700 mb-1 sm:mb-2">
          Filtro
        </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as FlujoFilter)}
          className="w-full sm:w-auto min-w-0 text-sm sm:text-base px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          aria-label="Filtrar flujos"
        >
          <option value="todos">Todos los flujos</option>
          <option value="solo_lima">Solo hacia Lima</option>
          <option value="excluir_lima">Excluir Lima</option>
          <option value="top5">Top 5 flujos</option>
        </select>
      </div>

      <div className="relative w-full rounded-xl overflow-hidden bg-slate-50">
        <div
          className="w-full h-[280px] sm:h-[380px] lg:h-[480px] touch-manipulation"
          style={{ minHeight: "280px" }}
        >
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: [-75, -10], scale: 1200 }}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoDeptName = geo.properties.NAME_1 || "";
                  const isLima = geoDeptName === "Lima";
                  const match = Object.entries(DEPARTAMENTOS_MAP).find(
                    ([_, name]) => name === geoDeptName
                  )?.[0];
                  const isHovered = hoveredDept === match;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHovered ? "#cbd5e1" : "#eef2fb"}
                      fillOpacity={isLima && !isHovered ? 0.6 : 1}
                      stroke="#cbd5e1"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#d1d5db", outline: "none" },
                        pressed: { outline: "none" },
                      }}
                      onMouseEnter={() => handleGeographyHover(geoDeptName)}
                      onMouseLeave={() => setHoveredDept(null)}
                    />
                  );
                })
              }
            </Geographies>

            <FlowArcs
              flows={filteredFlows}
              hoveredDept={hoveredDept}
              tooltipFlow={tooltipFlow}
              onFlowEnter={setTooltipFlow}
              onFlowLeave={() => setTooltipFlow(null)}
            />

            {sameDept.map((d) => {
              const coords = DEPARTAMENTOS_COORDS[d.departamento];
              if (!coords) return null;
              const isHighlight =
                !hoveredDept || d.departamento === hoveredDept;
              return (
                <Marker key={d.departamento} coordinates={coords}>
                  <circle
                    r={SAME_DEPT_DOT_R}
                    fill={SAME_DEPT_DOT_FILL}
                    fillOpacity={isHighlight ? 0.9 : 0.35}
                    stroke="#fff"
                    strokeWidth={1}
                    style={{ pointerEvents: "none" }}
                  />
                </Marker>
              );
            })}
          </ComposableMap>
        </div>

        {tooltipFlow && (
          <div
            className="absolute z-50 pointer-events-none bg-white border border-slate-200 rounded-lg shadow-lg p-2 sm:p-3 max-w-[90vw] sm:max-w-[220px] text-left"
            style={{
              left: "50%",
              bottom: "12px",
              transform: "translateX(-50%)",
            }}
          >
            <p className="text-xs sm:text-sm font-semibold text-[#0b1b3b]">
              {tooltipFlow.origen} → {tooltipFlow.destino}
            </p>
            <p className="text-xs text-slate-600">
              {tooltipFlow.count} candidato{tooltipFlow.count !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs sm:text-sm text-slate-600">
        <span className="font-medium">Intensidad:</span>
        <span style={{ color: "#93C5FD" }}>menor conteo</span>
        <span>—</span>
        <span style={{ color: "#3B82F6" }}>medio</span>
        <span>—</span>
        <span style={{ color: "#1E3A8A" }}>mayor conteo</span>
        <span className="ml-2 sm:ml-4">
          (normalización global, min {minCount} – max {maxCount})
        </span>
      </div>
    </div>
  );
}
