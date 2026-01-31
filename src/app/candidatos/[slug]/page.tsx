"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ALL_CANDIDATES, Candidate } from "@/data/candidatos";
import { getCandidateDetail } from "@/data/candidatos-detalle";

const Banner = ({ title, bg = "/hero-bg1.jpg" }: { title: string; bg?: string }) => {
  return (
    <section className="relative w-full overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bg}')` }}
      />
      <div className="absolute inset-0 bg-[#1f2f59]/75" />
      <div className="relative mx-auto flex h-[90px] max-w-6xl items-center justify-center px-4 lg:px-16">
        <h1 className="text-center text-[28px] font-extrabold leading-[110%] tracking-[-0.02em] text-white sm:text-[36px]">
          {title}
        </h1>
      </div>
    </section>
  );
};

type TabType = "biografia" | "historial-academico" | "controversias" | "ideologia-politica" | "financiamiento" | "experiencia" | "logros" | "propuestas";

const TABS: { key: TabType; label: string }[] = [
  { key: "biografia", label: "Biografía" },
  { key: "historial-academico", label: "Historial académico" },
  { key: "controversias", label: "Controversias" },
  { key: "ideologia-politica", label: "Ideología política" },
  { key: "financiamiento", label: "Financiamiento" },
  { key: "experiencia", label: "Experiencia" },
  { key: "logros", label: "Logros" },
  { key: "propuestas", label: "Algunas propuestas" },
];

export default function CandidateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [activeTab, setActiveTab] = useState<TabType>("biografia");

  // Buscar candidato por key
  const candidate = useMemo(() => {
    return ALL_CANDIDATES.find((c) => c.key === slug);
  }, [slug]);

  // Obtener datos detallados
  const candidateDetail = useMemo(() => {
    if (!slug || !candidate) return null;
    return getCandidateDetail(slug, candidate);
  }, [slug, candidate]);

  // Si no existe el candidato, mostrar error
  if (!candidate || !candidateDetail) {
    return (
      <main className="min-h-screen bg-[#eef2fb]">
        <Banner title="Candidato no encontrado" />
        <section className="py-14">
          <div className="mx-auto max-w-6xl px-4 text-center">
            <p className="text-[18px] text-slate-700">El candidato que buscas no existe.</p>
            <Link
              href="/candidatos"
              className="mt-6 inline-flex h-[44px] items-center justify-center rounded-full bg-[#0b1b3b] px-7 text-[13px] font-semibold text-white transition-transform duration-150 hover:scale-[1.03]"
            >
              Volver a candidatos
            </Link>
          </div>
        </section>
      </main>
    );
  }

  // Renderizar contenido según la pestaña activa
  const renderTabContent = () => {
    switch (activeTab) {
      case "biografia":
        return (
          <div className="space-y-4">
            <h3 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Biografía de {candidateDetail.name}
            </h3>
            <p className="text-[16px] leading-[175%] text-slate-700 sm:text-[18px]">
              {candidateDetail.biografia}
            </p>
          </div>
        );

      case "historial-academico":
        return (
          <div className="space-y-4">
            <h3 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Historial académico
            </h3>
            <ul className="space-y-3">
              {candidateDetail.historialAcademico.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[16px] leading-[175%] text-slate-700"
                >
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b1b3b]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "controversias":
        return (
          <div className="space-y-4">
            <h3 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Controversias
            </h3>
            <ul className="space-y-3">
              {candidateDetail.controversias.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[16px] leading-[175%] text-slate-700"
                >
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#c61b1b]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "ideologia-politica":
        return (
          <div className="space-y-4">
            <h3 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Ideología política
            </h3>
            <p className="text-[16px] leading-[175%] text-slate-700 sm:text-[18px]">
              {candidateDetail.ideologiaPolitica}
            </p>
          </div>
        );

      case "financiamiento":
        return (
          <div className="space-y-4">
            <h3 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Financiamiento
            </h3>
            <div className="rounded-2xl bg-[#eef2fb] p-6">
              <div className="mb-4">
                <p className="text-[14px] font-semibold text-slate-600">Total</p>
                <p className="mt-1 text-[24px] font-black text-[#0b1b3b]">
                  {candidateDetail.financiamiento.total}
                </p>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-slate-600 mb-2">Fuentes</p>
                <ul className="space-y-2">
                  {candidateDetail.financiamiento.sources.map((source, idx) => (
                    <li key={idx} className="text-[15px] text-slate-700">
                      • {source}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case "experiencia":
        return (
          <div className="space-y-4">
            <h3 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Experiencia
            </h3>
            <ul className="space-y-3">
              {candidateDetail.experiencia.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[16px] leading-[175%] text-slate-700"
                >
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b1b3b]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "logros":
        return (
          <div className="space-y-4">
            <h3 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Logros
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {candidateDetail.logros.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl bg-[#eef2fb] p-5"
                >
                  <p className="text-[15px] leading-[170%] text-slate-700">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "propuestas":
        return (
          <div className="space-y-4">
            <h3 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Algunas propuestas
            </h3>
            <ul className="space-y-3">
              {candidateDetail.propuestas.map((propuesta, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[16px] leading-[175%] text-slate-700"
                >
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b1b3b]" />
                  <span>{propuesta}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      <Banner title="Conoce los perfiles de los candidatos" />

      {/* Botón volver */}
      <section className="bg-white py-6">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-[14px] font-semibold text-[#0b1b3b] hover:text-[#1b2b5a] transition-colors"
          >
            ← Volver
          </button>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <div className="flex flex-col gap-8 lg:flex-row">
            {/* Columna izquierda: Foto e información básica */}
            <div className="flex-shrink-0 lg:w-[350px]">
              {/* Foto del candidato */}
              <div className="relative h-[400px] w-full overflow-hidden rounded-2xl bg-slate-100 lg:h-[450px]">
                <Image
                  src={candidateDetail.img}
                  alt={candidateDetail.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Información básica */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                    NOMBRE
                  </label>
                  <p className="mt-1 text-[18px] font-bold text-[#0b1b3b]">
                    {candidateDetail.name}
                  </p>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                    PARTIDO POLÍTICO
                  </label>
                  <p className="mt-1 text-[18px] font-bold text-[#0b1b3b]">
                    {candidateDetail.party}
                  </p>
                </div>

                <div>
                  <label className="block text-[12px] font-semibold uppercase tracking-wide text-slate-500">
                    EDAD
                  </label>
                  <p className="mt-1 text-[18px] font-bold text-[#0b1b3b]">
                    {candidateDetail.age} años
                  </p>
                </div>

                {/* Botones */}
                <div className="pt-4 space-y-3">
                  <a
                    href={candidateDetail.planGobiernoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#0b1b3b] px-4 py-3 text-[16px] font-semibold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Plan de Gobierno
                  </a>
                  <a
                    href={candidateDetail.hojaVidaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#0b1b3b] px-4 py-3 text-[16px] font-semibold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Hoja de vida
                  </a>
                </div>
              </div>
            </div>

            {/* Columna derecha: Pestañas y contenido */}
            <div className="flex-1">
              {/* Pestañas */}
              <div className="mb-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-4">
                {TABS.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-lg px-4 py-3 text-[13px] font-semibold transition-all duration-200 sm:text-[14px] ${
                      activeTab === tab.key
                        ? "bg-[#0b1b3b] text-white shadow-md"
                        : "bg-[#eef2fb] text-[#0b1b3b] hover:bg-[#d9d9d9]"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Contenido de la pestaña activa */}
              <div className="min-h-[400px] rounded-2xl bg-[#d9d9d9]/45 p-6 sm:p-8">
                {renderTabContent()}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

