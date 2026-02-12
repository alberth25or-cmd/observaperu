"use client";

import { useEffect, useState } from "react";
import TimelineGeneracional from "@/components/TimelineGeneracional";
import KPICards from "@/components/KPICards";
import PiramidePoblacional from "@/components/PiramidePoblacional";
import RatioLimaRegiones from "@/components/RatioLimaRegiones";
import MapaBurbujasPeru from "@/components/MapaBurbujasPeru";

const Banner = ({
  title,
  bg = "/hero-bg1.jpg",
}: {
  title: string;
  bg?: string;
}) => {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bg}')` }}
      />
      <div className="absolute inset-0 bg-[#1f2f59]/75" />
      <div className="relative mx-auto flex h-[90px] max-w-6xl items-center justify-center px-4 lg:px-16">
        <h1 className="text-center text-[32px] font-extrabold leading-[110%] tracking-[-0.02em] text-white sm:text-[40px]">
          {title}
        </h1>
      </div>
    </section>
  );
};

interface CandidatoEdad {
  slug: string;
  nombre: string;
  fecha_nacimiento: string;
  edad: number;
}

export default function EstadisticasPage() {
  const [edadesData, setEdadesData] = useState<CandidatoEdad[]>([]);
  const [lugaresData, setLugaresData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/data/candidatos_edades.json").then((res) => res.json()),
      fetch("/data/candidatos_lugares_detalle.json").then((res) => res.json()),
    ])
      .then(([edades, lugares]) => {
        setEdadesData(edades);
        setLugaresData(lugares);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando datos:", err);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      {/* Banner */}
      <Banner title="Estadísticas" bg="/hero-bg1.jpg" />

      {/* Contenido principal */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-16">
          {loading ? (
            <div className="text-center py-20">
              <p className="text-slate-600">Cargando datos...</p>
            </div>
          ) : (
            <div className="space-y-8 sm:space-y-12">
              {/* KPI Cards */}
              <KPICards data={edadesData} />

              {/* Pirámide poblacional */}
              <PiramidePoblacional data={edadesData} />

              {/* Línea de tiempo generacional */}
              <TimelineGeneracional data={edadesData} />
              
              {/* Ratio Lima vs Regiones */}
              <RatioLimaRegiones data={lugaresData} />
              
              {/* Mapa de burbujas */}
              <MapaBurbujasPeru data={lugaresData} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

