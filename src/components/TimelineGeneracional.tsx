"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";

interface CandidatoEdad {
  slug: string;
  nombre: string;
  fecha_nacimiento: string;
  edad: number;
}

interface TimelineData {
  year: number;
  nombre: string;
  slug: string;
  edad: number;
  generacion: string;
  y: number; // Posición Y aleatoria para dispersión visual
}

const GENERATIONS = {
  "Baby Boomers": {
    start: 1946,
    end: 1964,
    color: "#1b2b5a",
    lightColor: "#1b2b5a40",
  },
  "Gen X": {
    start: 1965,
    end: 1980,
    color: "#2E7D8F",
    lightColor: "#2E7D8F40",
  },
  "Millennials": {
    start: 1981,
    end: 1996,
    color: "#4A90E2",
    lightColor: "#4A90E240",
  },
  "Silent": {
    start: 1928,
    end: 1945,
    color: "#8B9DC3",
    lightColor: "#8B9DC340",
  },
} as const;

const getGeneration = (year: number): string => {
  if (year >= 1946 && year <= 1964) return "Baby Boomers";
  if (year >= 1965 && year <= 1980) return "Gen X";
  if (year >= 1981 && year <= 1996) return "Millennials";
  return "Silent";
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload?.[0]) {
    const data = payload[0].payload as TimelineData;
    return (
      <div className="bg-white p-4 border border-slate-200 rounded-lg shadow-xl z-50">
        <p className="font-bold text-[#0b1b3b] text-base mb-1">{data.nombre}</p>
        <p className="text-sm text-slate-600">Nacido en {data.year}</p>
        <p className="text-sm text-slate-600">{data.edad} años</p>
        <p className="text-sm font-semibold mt-1" style={{ color: GENERATIONS[data.generacion as keyof typeof GENERATIONS]?.color }}>
          {data.generacion}
        </p>
      </div>
    );
  }
  return null;
};

interface TimelineGeneracionalProps {
  data: CandidatoEdad[];
}

export default function TimelineGeneracional({ data }: TimelineGeneracionalProps) {
  const router = useRouter();
  const [hoveredPoint, setHoveredPoint] = useState<string | null>(null);

  const processedData = useMemo(() => {
    return data.map((candidato, index) => {
      const year = parseInt(candidato.fecha_nacimiento.split("-")[0]);
      // Crear dispersión vertical aleatoria para mejor visualización
      const y = Math.random() * 10 + 40; // Entre 40 y 50
      return {
        year,
        nombre: candidato.nombre,
        slug: candidato.slug,
        edad: candidato.edad,
        generacion: getGeneration(year),
        y,
      };
    });
  }, [data]);

  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    processedData.forEach((d) => {
      counts[d.generacion] = (counts[d.generacion] || 0) + 1;
    });
    const total = processedData.length;
    return Object.entries(counts).map(([gen, count]) => ({
      generacion: gen,
      count,
      percentage: ((count / total) * 100).toFixed(1),
      color: GENERATIONS[gen as keyof typeof GENERATIONS]?.color || "#1b2b5a",
    }));
  }, [processedData]);

  const handlePointClick = (data: TimelineData) => {
    router.push(`/candidatos/${data.slug}`);
  };

  // Líneas de referencia para generaciones
  const referenceLines = [
    { x: 1946, label: "Baby Boomers" },
    { x: 1965, label: "Gen X" },
    { x: 1981, label: "Millennials" },
  ];

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1b3b] mb-2">
          ¿De qué generaciones vienen?
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Distribución de candidatos por año de nacimiento. Cada punto representa un candidato.
        </p>
      </div>

      {/* Estadísticas por generación */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {stats.map((stat) => (
          <div
            key={stat.generacion}
            className="bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <div
                className="w-3 sm:w-4 h-3 sm:h-4 rounded-full"
                style={{ backgroundColor: stat.color }}
              />
              <span className="text-xs sm:text-sm font-semibold text-slate-700">
                {stat.generacion}
              </span>
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1" style={{ color: stat.color }}>
              {stat.count}
            </div>
            <div className="text-xs sm:text-sm text-slate-500">
              {stat.percentage}% del total
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="w-full overflow-x-auto">
        <div className="h-[350px] sm:h-[450px] lg:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={{ top: 20, right: 10, bottom: 50, left: 10 }}
          >
            {/* Líneas de referencia para generaciones */}
            {referenceLines.map((line, idx) => (
              <ReferenceLine
                key={idx}
                x={line.x}
                stroke="#cbd5e1"
                strokeWidth={1}
                strokeDasharray="5 5"
                label={{
                  value: line.label,
                  position: "top",
                  fill: "#64748b",
                  fontSize: 11,
                  fontWeight: 600,
                }}
              />
            ))}

            <XAxis
              type="number"
              dataKey="year"
              domain={[1940, 1990]}
              tick={{ fill: "#64748b", fontSize: 10, fontWeight: 500 }}
              tickFormatter={(value) => value.toString()}
              label={{
                value: "Año de nacimiento",
                position: "insideBottom",
                offset: -10,
                fill: "#475569",
                fontSize: 12,
                fontWeight: 600,
              }}
              stroke="#e2e8f0"
            />
            <YAxis
              type="number"
              dataKey="y"
              domain={[35, 55]}
              hide
            />
            <Tooltip content={<CustomTooltip />} />
            <Scatter
              data={processedData}
              fill="#1b2b5a"
              onClick={(data: any) => handlePointClick(data)}
              onMouseEnter={(data: any) => setHoveredPoint(data.slug)}
              onMouseLeave={() => setHoveredPoint(null)}
            >
              {processedData.map((entry, index) => {
                const gen = GENERATIONS[entry.generacion as keyof typeof GENERATIONS];
                const isHovered = hoveredPoint === entry.slug;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={gen?.color || "#1b2b5a"}
                    r={isHovered ? 8 : 6}
                    style={{
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                      opacity: hoveredPoint && hoveredPoint !== entry.slug ? 0.3 : 1,
                    }}
                  />
                );
              })}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Leyenda y nota */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
        <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-3 sm:mb-4">
          {Object.entries(GENERATIONS).map(([name, config]) => (
            <div key={name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-xs sm:text-sm text-slate-600">{name}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-center text-slate-500 px-2">
          Haz clic en un punto para ver el perfil completo del candidato
        </p>
      </div>
    </div>
  );
}

