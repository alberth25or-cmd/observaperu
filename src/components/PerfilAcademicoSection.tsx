"use client";

import { useMemo } from "react";
import {
  enriquecerEstudios,
  calcularKPIs,
  type EstudiosKPIs,
} from "@/lib/estudiosUniversitarios";
import EstudiosUniversitariosKPIs from "@/components/EstudiosUniversitariosKPIs";
import TopUniversidadesChart from "@/components/TopUniversidadesChart";
import TipoUniversidadChart from "@/components/TipoUniversidadChart";
import AreaProfesionalChart from "@/components/AreaProfesionalChart";
import EstudiosInsights from "@/components/EstudiosInsights";

interface RawEstudio {
  slug?: string;
  tiene_estudios?: string;
  estudio1_universidad?: string;
  estudio1_grado_titulo?: string;
  estudio1_concluidos?: string;
  estudio1_egresado?: string;
  estudio2_universidad?: string;
  estudio2_grado_titulo?: string;
  estudio2_concluidos?: string;
  estudio2_egresado?: string;
}

interface PerfilAcademicoSectionProps {
  data: RawEstudio[] | null;
}

export default function PerfilAcademicoSection({
  data,
}: PerfilAcademicoSectionProps) {
  const { enriquecidos, kpis } = useMemo(() => {
    if (!data?.length) return { enriquecidos: [], kpis: null };
    const enriquecidos = enriquecerEstudios(data);
    const kpis = calcularKPIs(enriquecidos);
    return { enriquecidos, kpis };
  }, [data]);

  const tipoData = useMemo(() => {
    if (!kpis?.conDatos) return [];
    return Object.entries(kpis.pctPorTipo).map(([name, pct]) => ({
      name,
      value: Math.round((pct / 100) * kpis.conDatos),
      pct,
    }));
  }, [kpis]);

  if (!data?.length) {
    return (
      <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
        <p className="text-center text-slate-500 text-sm py-6">
          No hay datos de estudios universitarios disponibles.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg border border-slate-100">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0b1b3b] mb-1 sm:mb-2">
          Perfil académico de los candidatos
        </h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Estudios universitarios declarados. Transparencia electoral — Observa
          Perú.
        </p>
      </div>

      <div className="mb-6 sm:mb-8">
        <EstudiosUniversitariosKPIs kpis={kpis} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Top 10 universidades
          </h3>
          <TopUniversidadesChart data={kpis?.top10Universidades ?? []} />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
            Tipo de universidad
          </h3>
          <TipoUniversidadChart data={tipoData} />
        </div>
      </div>

      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-bold text-[#0b1b3b] mb-3 sm:mb-4">
          Área profesional
        </h3>
        <AreaProfesionalChart
          pctPorArea={kpis?.pctPorArea ?? {}}
          totalConArea={kpis?.totalConArea ?? 0}
        />
      </div>

      <EstudiosInsights kpis={kpis} />
    </div>
  );
}
