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
import DebateSection from "@/components/debate/DebateSection";
import Debate2Section from "@/components/debate/Debate2Section";
import Debate3Section from "@/components/debate/Debate3Section";
import Debate4Section from "@/components/debate/Debate4Section";
import Debate5Section from "@/components/debate/Debate5Section";
import Debate6Section from "@/components/debate/Debate6Section";
import { DebateStats } from "@/lib/debateAnalytics";
import EncuestaSection from "@/components/encuesta/EncuestaSection";

interface CandidatoEdad {
  slug: string;
  nombre: string;
  fecha_nacimiento: string;
  edad: number;
}

export default function EstadisticasClient() {
  const [edadesData, setEdadesData] = useState<CandidatoEdad[]>([]);
  const [lugaresData, setLugaresData] = useState<any[]>([]);
  const [estudiosData, setEstudiosData] = useState<any[]>([]);
  const [antecedentesData, setAntecedentesData] = useState<any[]>([]);
  const [postulacionesData, setPostulacionesData] = useState<any[]>([]);
  const [debateData, setDebateData] = useState<DebateStats | null>(null);
  const [debate2Data, setDebate2Data] = useState<DebateStats | null>(null);
  const [debate3Data, setDebate3Data] = useState<DebateStats | null>(null);
  const [debate4Data, setDebate4Data] = useState<DebateStats | null>(null);
  const [debate5Data, setDebate5Data] = useState<DebateStats | null>(null);
  const [debate6Data, setDebate6Data] = useState<DebateStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [
          edadesRes, lugaresRes, estudiosRes, antecedentesRes,
          postulacionesRes, debateRes, debate2Res, debate3Res, debate4Res, debate5Res, debate6Res,
        ] = await Promise.all([
          fetch("/data/candidatos_edades.json"),
          fetch("/data/candidatos_lugares_detalle.json"),
          fetch("/data/candidatos_estudios_universitarios.json"),
          fetch("/data/candidatos_antecedentes_electorales.json"),
          fetch("/data/numerode_postulaciones.json"),
          fetch("/data/debate_stats.json"),
          fetch("/data/debate2_stats.json"),
          fetch("/data/debate3_stats.json"),
          fetch("/data/debate4_stats.json"),
          fetch("/data/debate5_stats.json"),
          fetch("/data/debate6_stats.json"),
        ]);

        if (!edadesRes.ok)
          throw new Error(`Error al cargar edades: ${edadesRes.status}`);
        if (!lugaresRes.ok)
          throw new Error(`Error al cargar lugares: ${lugaresRes.status}`);

        const [edades, lugares] = await Promise.all([
          edadesRes.json(),
          lugaresRes.json(),
        ]);

        if (!Array.isArray(edades))
          throw new Error("Los datos de edades no son un array válido");
        if (!Array.isArray(lugares))
          throw new Error("Los datos de lugares no son un array válido");

        setEdadesData(edades);
        setLugaresData(lugares);

        if (estudiosRes.ok) {
          const e = await estudiosRes.json();
          setEstudiosData(Array.isArray(e) ? e : []);
        }
        if (antecedentesRes.ok) {
          const a = await antecedentesRes.json();
          setAntecedentesData(Array.isArray(a?.candidatos) ? a.candidatos : []);
        }
        if (postulacionesRes.ok) {
          const p = await postulacionesRes.json();
          setPostulacionesData(Array.isArray(p?.candidatos) ? p.candidatos : []);
        }
        if (debateRes.ok)   setDebateData(await debateRes.json());
        if (debate2Res.ok)  setDebate2Data(await debate2Res.json());
        if (debate3Res.ok)  setDebate3Data(await debate3Res.json());
        if (debate4Res.ok)  setDebate4Data(await debate4Res.json());
        if (debate5Res.ok)  setDebate5Data(await debate5Res.json());
        if (debate6Res.ok)  setDebate6Data(await debate6Res.json());

        setLoading(false);
      } catch (err) {
        console.error("Error cargando datos:", err);
        setError(
          err instanceof Error ? err.message : "Error desconocido al cargar los datos"
        );
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-600">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 font-semibold mb-2">Error al cargar los datos</p>
        <p className="text-sm text-slate-600 mb-4">{error}</p>
        <p className="text-xs text-slate-500">
          Verifica que los archivos JSON estén en /public/data/
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-12">
      {debate6Data && <Debate6Section data={debate6Data} />}

      {debate5Data && (
        <div className="pt-6 border-t border-slate-200">
          <Debate5Section data={debate5Data} />
        </div>
      )}

      {debate4Data && (
        <div className="pt-6 border-t border-slate-200">
          <Debate4Section data={debate4Data} />
        </div>
      )}

      {debate3Data && (
        <div className="pt-6 border-t border-slate-200">
          <Debate3Section data={debate3Data} />
        </div>
      )}

      {debate2Data && (
        <div className="pt-6 border-t border-slate-200">
          <Debate2Section data={debate2Data} />
        </div>
      )}

      {debateData && (
        <div className="pt-6 border-t border-slate-200">
          <DebateSection data={debateData} />
        </div>
      )}


      <div className="pt-6 border-t border-slate-200">
        <EncuestaSection />
      </div>

      <div className="pt-6 border-t border-slate-200">
        <div className="mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1b2b5a] leading-tight mb-2">
            Perfil demográfico de los candidatos presidenciales Perú 2026
          </h2>
          <p className="text-sm text-slate-600 max-w-4xl">
            Análisis de edad, lugar de nacimiento, formación académica, trayectoria electoral y
            número de postulaciones de los candidatos presidenciales inscritos ante el JNE para las{" "}
            <strong className="text-[#1b2b5a]">elecciones generales del Perú 2026</strong>. Los
            datos permiten comparar perfiles y evaluar la experiencia previa de quienes aspiran a
            la presidencia.
          </p>
        </div>
        <KPICards data={edadesData} />
      </div>

      <PiramidePoblacional data={edadesData} />
      <TimelineGeneracional data={edadesData} />
      <RatioLimaRegiones data={lugaresData} />
      <TerritorialDashboardSection data={lugaresData} />
      <MapaBurbujasPeru data={lugaresData} />
      <PerfilAcademicoSection data={estudiosData} />
      <AntecedentesElectoralesSection data={antecedentesData} />
      <PostulacionesSection data={postulacionesData} />

      {/* FAQ SEO — item 1 */}
      <div className="pt-6 border-t border-slate-200">
        <h2 className="text-xl font-extrabold text-[#1b2b5a] mb-4">
          Preguntas frecuentes sobre las elecciones presidenciales Perú 2026
        </h2>
        <div className="space-y-4">
          {[
            {
              q: "¿Quién lidera las encuestas presidenciales Perú 2026?",
              a: "Según la encuesta Ipsos de marzo 2026 (n=1,203), Keiko Fujimori lidera con 11% de intención de voto, seguida de Rafael López Aliaga con 10%. Ambos se encuentran dentro del margen de error de ±2.8 pp, lo que configura un empate técnico.",
            },
            {
              q: "¿Cuándo son las elecciones presidenciales en Perú 2026?",
              a: "Las elecciones generales del Perú 2026 están programadas para el 11 de abril de 2026. Si ningún candidato supera el 50% de los votos válidos, se realizará una segunda vuelta el 7 de junio de 2026.",
            },
            {
              q: "¿Quiénes son los candidatos presidenciales del Perú 2026?",
              a: "Entre los principales candidatos inscritos ante el JNE se encuentran Keiko Fujimori (Fuerza Popular), Rafael López Aliaga (Renovación Popular), César Acuña (Alianza para el Progreso), entre otros. Consulta la sección de candidatos para ver el listado completo con perfiles y propuestas.",
            },
            {
              q: "¿Cuántos debates presidenciales JNE hubo en 2026?",
              a: "El JNE organizó tres jornadas de debate presidencial los días 23, 24 y 25 de marzo de 2026, transmitidas por TV Perú. Participaron candidatos inscritos con partido político y cumplimiento de los requisitos del JNE.",
            },
            {
              q: "¿Cómo se mide el tiempo de habla en los debates JNE?",
              a: "El tiempo de habla se calcula a partir de la transcripción completa del debate. Cada intervención se clasifica automáticamente como ataque, propuesta o discurso neutro mediante análisis de palabras clave. El margen de error en la clasificación automática es de aproximadamente ±5%.",
            },
          ].map(({ q, a }) => (
            <details
              key={q}
              className="bg-white rounded-xl border border-slate-200 shadow-sm px-5 py-4 group"
            >
              <summary className="font-bold text-[#1b2b5a] text-sm cursor-pointer list-none flex justify-between items-center gap-3">
                {q}
                <span className="text-slate-400 group-open:rotate-180 transition-transform shrink-0">▾</span>
              </summary>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
