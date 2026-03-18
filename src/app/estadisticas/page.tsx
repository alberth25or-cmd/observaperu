"use client";

import { useEffect, useState } from "react";
import TimelineGeneracional from "@/components/TimelineGeneracional";
import KPICards from "@/components/KPICards";
import PiramidePoblacional from "@/components/PiramidePoblacional";
import RatioLimaRegiones from "@/components/RatioLimaRegiones";
import MapaBurbujasPeru from "@/components/MapaBurbujasPeru";
import TerritorialDashboardSection from "@/components/TerritorialDashboardSection";
import PerfilAcademicoSection from "@/components/PerfilAcademicoSection";
import AntecedentesElectoralesSection from "@/components/antecedentes/AntecedentesElectoralesSection";
import PostulacionesSection from "@/components/postulaciones/PostulacionesSection";
import Footer from "@/components/Footer";

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
  const [estudiosData, setEstudiosData] = useState<any[]>([]);
  const [antecedentesData, setAntecedentesData] = useState<any[]>([]);
  const [postulacionesData, setPostulacionesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          edadesResponse,
          lugaresResponse,
          estudiosResponse,
          antecedentesResponse,
          postulacionesResponse,
        ] = await Promise.all([
          fetch("/data/candidatos_edades.json"),
          fetch("/data/candidatos_lugares_detalle.json"),
          fetch("/data/candidatos_estudios_universitarios.json"),
          fetch("/data/candidatos_antecedentes_electorales.json"),
          fetch("/data/numerode_postulaciones.json"),
        ]);

        if (!edadesResponse.ok) {
          throw new Error(
            `Error al cargar edades: ${edadesResponse.status} ${edadesResponse.statusText}`,
          );
        }
        if (!lugaresResponse.ok) {
          throw new Error(
            `Error al cargar lugares: ${lugaresResponse.status} ${lugaresResponse.statusText}`,
          );
        }

        const [edades, lugares] = await Promise.all([
          edadesResponse.json(),
          lugaresResponse.json(),
        ]);

        if (!Array.isArray(edades)) {
          throw new Error("Los datos de edades no son un array válido");
        }
        if (!Array.isArray(lugares)) {
          throw new Error("Los datos de lugares no son un array válido");
        }

        setEdadesData(edades);
        setLugaresData(lugares);

        if (estudiosResponse.ok) {
          const estudios = await estudiosResponse.json();
          setEstudiosData(Array.isArray(estudios) ? estudios : []);
        } else {
          setEstudiosData([]);
        }
        if (antecedentesResponse.ok) {
          const antecedentes = await antecedentesResponse.json();
          const list = antecedentes?.candidatos;
          setAntecedentesData(Array.isArray(list) ? list : []);
        } else {
          setAntecedentesData([]);
        }
        if (postulacionesResponse.ok) {
          const postulaciones = await postulacionesResponse.json();
          const list = postulaciones?.candidatos;
          setPostulacionesData(Array.isArray(list) ? list : []);
        } else {
          setPostulacionesData([]);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Error desconocido al cargar los datos",
        );
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div>
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
            ) : error ? (
              <div className="text-center py-20">
                <p className="text-red-600 font-semibold mb-2">
                  Error al cargar los datos
                </p>
                <p className="text-sm text-slate-600 mb-4">{error}</p>
                <p className="text-xs text-slate-500">
                  Verifica que los archivos JSON estén en /public/data/
                </p>
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

                {/* Geografía de la oferta electoral: KPIs, comparativo, flujos, insights */}
                <TerritorialDashboardSection data={lugaresData} />

                {/* Mapa de burbujas */}
                <MapaBurbujasPeru data={lugaresData} />

                {/* Perfil académico: estudios universitarios, KPIs, concentración */}
                <PerfilAcademicoSection data={estudiosData} />

                {/* Antecedentes electorales: multipostulación, tipo de postulación */}
                <AntecedentesElectoralesSection data={antecedentesData} />

                {/* Persistencia política: KPIs, ranking, Pareto, histogramas, scatter, boxplot, índices */}
                <PostulacionesSection data={postulacionesData} />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
