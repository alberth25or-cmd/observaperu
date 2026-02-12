"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

interface LugarNacimiento {
  slug: string;
  nacimiento_pais: string;
  nacimiento_departamento: string;
  nacimiento_provincia: string;
  nacimiento_distrito: string;
}

interface MapaBurbujasPeruProps {
  data: LugarNacimiento[];
}

// Mapeo de nombres de departamentos (datos -> GeoJSON)
const DEPARTAMENTOS_MAP: Record<string, string> = {
  "LIMA": "Lima",
  "CALLAO": "Callao",
  "AREQUIPA": "Arequipa",
  "CUSCO": "Cusco",
  "LA LIBERTAD": "LaLibertad",
  "PIURA": "Piura",
  "LAMBAYEQUE": "Lambayeque",
  "CAJAMARCA": "Cajamarca",
  "ANCASH": "Ancash",
  "JUNIN": "Junín",
  "HUANUCO": "Huánuco",
  "PUNO": "Puno",
  "TACNA": "Tacna",
  "MOQUEGUA": "Moquegua",
  "APURIMAC": "Apurímac",
  "AYACUCHO": "Ayacucho",
  "HUANCAVELICA": "Huancavelica",
  "ICA": "Ica",
  "PASCO": "Pasco",
  "SAN MARTIN": "SanMartín",
  "LORETO": "Loreto",
  "UCAYALI": "Ucayali",
  "MADRE DE DIOS": "MadredeDios",
  "AMAZONAS": "Amazonas",
};

// Coordenadas de los departamentos de Perú [longitud, latitud]
const DEPARTAMENTOS_COORDS: Record<string, [number, number]> = {
  "LIMA": [-77.0282, -12.0464],
  "CALLAO": [-77.1181, -12.0566],
  "AREQUIPA": [-71.5350, -16.4090],
  "CUSCO": [-71.9675, -13.5319],
  "LA LIBERTAD": [-79.0289, -8.1116],
  "PIURA": [-80.6328, -5.1945],
  "LAMBAYEQUE": [-79.9086, -6.7766],
  "CAJAMARCA": [-78.5000, -7.1617],
  "ANCASH": [-77.5283, -9.5300],
  "JUNIN": [-75.0152, -11.1580],
  "HUANUCO": [-76.2042, -9.9297],
  "PUNO": [-70.0199, -15.8402],
  "TACNA": [-70.2489, -18.0066],
  "MOQUEGUA": [-70.9358, -17.1983],
  "APURIMAC": [-72.8811, -13.6333],
  "AYACUCHO": [-74.2236, -13.1631],
  "HUANCAVELICA": [-74.9750, -12.7871],
  "ICA": [-75.7289, -14.0680],
  "PASCO": [-76.2562, -10.6886],
  "SAN MARTIN": [-76.1250, -6.5083],
  "LORETO": [-73.2475, -3.7491],
  "UCAYALI": [-73.0877, -8.3791],
  "MADRE DE DIOS": [-69.1833, -12.6000],
  "AMAZONAS": [-78.1833, -5.2000],
};

export default function MapaBurbujasPeru({ data }: MapaBurbujasPeruProps) {
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);

  // Filtrar solo candidatos nacidos en Perú
  const candidatosPeru = useMemo(() => {
    return data.filter((c) => c.nacimiento_pais === "PERÚ");
  }, [data]);

  // Agrupar por departamento
  const statsPorDepartamento = useMemo(() => {
    const counts: Record<string, number> = {};
    candidatosPeru.forEach((c) => {
      const dept = c.nacimiento_departamento;
      if (dept && dept !== "No se encontró") {
        counts[dept] = (counts[dept] || 0) + 1;
      }
    });

    const total = candidatosPeru.length;
    return Object.entries(counts)
      .map(([dept, count]) => ({
        departamento: dept,
        count,
        percentage: ((count / total) * 100).toFixed(1),
        coords: DEPARTAMENTOS_COORDS[dept] || [-75.0, -10.0],
      }))
      .sort((a, b) => b.count - a.count);
  }, [candidatosPeru]);

  // Calcular tamaño de burbujas
  const maxCount = Math.max(...statsPorDepartamento.map((d) => d.count), 1);
  const minSize = 15;
  const maxSize = 60;

  const getBubbleSize = (count: number) => {
    return minSize + ((count / maxCount) * (maxSize - minSize));
  };

  // GeoJSON local
  const geoUrl = "/maps/peru_departamentos.geojson";

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0b1b3b] mb-2">
          Distribución geográfica de candidatos
        </h2>
        <p className="text-sm sm:text-base text-slate-600">
          Mapa de burbujas por departamento de nacimiento
        </p>
      </div>

      {/* Mapa */}
      <div className="w-full relative">
        <div className="relative w-full bg-slate-50 rounded-xl overflow-hidden h-[400px] sm:h-[500px] lg:h-[600px]">
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{
              center: [-75, -10],
              scale: 1200,
            }}
            style={{ width: "100%", height: "100%" }}
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoDeptName = geo.properties.NAME_1 || "";
                  // Buscar el nombre en nuestros datos que corresponde a este departamento del GeoJSON
                  const matchingDept = Object.entries(DEPARTAMENTOS_MAP).find(
                    ([_, geoName]) => geoName === geoDeptName
                  )?.[0] || geoDeptName.toUpperCase();
                  
                  const isHovered = hoveredDept === matchingDept;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={isHovered ? "#cbd5e1" : "#eef2fb"}
                      stroke="#cbd5e1"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#d1d5db", outline: "none" },
                        pressed: { fill: "#9ca3af", outline: "none" },
                      }}
                      onMouseEnter={() => setHoveredDept(matchingDept)}
                      onMouseLeave={() => setHoveredDept(null)}
                    />
                  );
                })
              }
            </Geographies>
            
            {statsPorDepartamento.map((dept) => {
              const size = getBubbleSize(dept.count);
              const isHovered = hoveredDept === dept.departamento;
              const isLima = dept.departamento === "LIMA";
              const isCallao = dept.departamento === "CALLAO";
              
              return (
                <Marker
                  key={dept.departamento}
                  coordinates={dept.coords}
                >
                  <g
                    onMouseEnter={() => setHoveredDept(dept.departamento)}
                    onMouseLeave={() => setHoveredDept(null)}
                    className="cursor-pointer"
                  >
                    <circle
                      r={isHovered ? size * 1.2 : size}
                      fill={isLima ? "#1b2b5a" : isCallao ? "#2E7D8F" : "#4A90E2"}
                      fillOpacity={isHovered ? 0.9 : 0.7}
                      stroke="#fff"
                      strokeWidth={2}
                      style={{ transition: "all 0.2s ease" }}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="#fff"
                      fontSize={size * 0.4}
                      fontWeight="bold"
                      style={{ pointerEvents: "none" }}
                    >
                      {dept.count}
                    </text>
                  </g>
                </Marker>
              );
            })}
          </ComposableMap>
          
          {/* Tooltip flotante */}
          {hoveredDept && (
            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-50 bg-white p-3 sm:p-4 border border-slate-200 rounded-lg shadow-xl max-w-[150px] sm:max-w-none">
              <p className="font-bold text-[#0b1b3b] text-sm sm:text-base mb-1">
                {statsPorDepartamento.find((d) => d.departamento === hoveredDept)?.departamento || hoveredDept}
              </p>
              <p className="text-xs sm:text-sm text-slate-600">
                {statsPorDepartamento.find((d) => d.departamento === hoveredDept)?.count || 0} candidatos
              </p>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1">
                {statsPorDepartamento.find((d) => d.departamento === hoveredDept)?.percentage || "0"}% del total
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lista de departamentos */}
      <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-slate-200">
        <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">Candidatos por departamento</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
          {statsPorDepartamento.map((dept) => {
            const isLima = dept.departamento === "LIMA";
            const isCallao = dept.departamento === "CALLAO";
            return (
              <div
                key={dept.departamento}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: isLima ? "#1b2b5a" : isCallao ? "#2E7D8F" : "#4A90E2",
                    }}
                  />
                  <span className="text-sm font-medium text-slate-700">{dept.departamento}</span>
                </div>
                <span className="text-sm font-bold text-[#0b1b3b]">{dept.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

