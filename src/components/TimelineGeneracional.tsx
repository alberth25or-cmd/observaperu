"use client";

import { useMemo, useState, useEffect } from "react";
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
      <div className="bg-white p-2 sm:p-3 lg:p-4 border border-slate-200 rounded-lg shadow-xl z-50">
        <p className="font-bold text-[#0b1b3b] text-xs sm:text-sm lg:text-base mb-1">{data.nombre}</p>
        <p className="text-[10px] sm:text-xs lg:text-sm text-slate-600">Nacido en {data.year}</p>
        <p className="text-[10px] sm:text-xs lg:text-sm text-slate-600">{data.edad} años</p>
        <p className="text-[10px] sm:text-xs lg:text-sm font-semibold mt-1" style={{ color: GENERATIONS[data.generacion as keyof typeof GENERATIONS]?.color }}>
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
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

  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No hay datos disponibles</p>
        </div>
      </div>
    );
  }

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
    <div className="w-full bg-white rounded-2xl p-3 sm:p-4 lg:p-8 shadow-lg border border-slate-100">
      {/* Header */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0b1b3b] mb-1 sm:mb-2">
          ¿De qué generaciones vienen?
        </h2>
        <p className="text-[11px] sm:text-sm lg:text-base text-slate-600">
          Distribución de candidatos por año de nacimiento. Cada punto representa un candidato.
        </p>
      </div>

      {/* Estadísticas por generación */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6 lg:mb-8">
        {stats.map((stat) => (
          <div
            key={stat.generacion}
            className="bg-gradient-to-br from-slate-50 to-white p-3 sm:p-4 lg:p-5 rounded-xl border border-slate-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 mb-1.5 sm:mb-2">
              <div
                className="w-2.5 sm:w-3 lg:w-4 h-2.5 sm:h-3 lg:h-4 rounded-full"
                style={{ backgroundColor: stat.color }}
              />
              <span className="text-[10px] sm:text-xs lg:text-sm font-semibold text-slate-700">
                {stat.generacion}
              </span>
            </div>
            <div className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1" style={{ color: stat.color }}>
              {stat.count}
            </div>
            <div className="text-[10px] sm:text-xs lg:text-sm text-slate-500">
              {stat.percentage}% del total
            </div>
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="w-full">
        <div style={{ height: isMobile ? '300px' : '450px', width: '100%' }} className="lg:h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
          <ScatterChart
            margin={isMobile ? { top: 10, right: 5, bottom: 40, left: 5 } : { top: 20, right: 10, bottom: 50, left: 10 }}
          >
            {/* Líneas de referencia para generaciones */}
            {!isMobile && referenceLines.map((line, idx) => (
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
              tick={{ fill: "#64748b", fontSize: isMobile ? 8 : 10, fontWeight: 500 }}
              tickFormatter={(value) => value.toString()}
              label={!isMobile ? {
                value: "Año de nacimiento",
                position: "insideBottom",
                offset: -10,
                fill: "#475569",
                fontSize: 12,
                fontWeight: 600,
              } : {
                value: "Año",
                position: "insideBottom",
                offset: -5,
                fill: "#475569",
                fontSize: 10,
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
                    r={isMobile ? (isHovered ? 6 : 4) : (isHovered ? 8 : 6)}
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
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:gap-4 justify-center mb-2 sm:mb-3 lg:mb-4">
          {Object.entries(GENERATIONS).map(([name, config]) => (
            <div key={name} className="flex items-center gap-1.5 sm:gap-2">
              <div
                className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full"
                style={{ backgroundColor: config.color }}
              />
              <span className="text-[10px] sm:text-xs lg:text-sm text-slate-600">{name}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] sm:text-xs text-center text-slate-500 px-2">
          Haz clic en un punto para ver el perfil completo del candidato
        </p>
      </div>
    </div>
  );
}

