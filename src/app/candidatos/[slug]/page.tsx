"use client";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ALL_CANDIDATES, Candidate } from "@/data/candidatos";
import { getCandidateDetail } from "@/data/candidatos-detalle";
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
        <h1 className="text-center text-[28px] font-extrabold leading-[110%] tracking-[-0.02em] text-white sm:text-[36px]">
          {title}
        </h1>
      </div>
    </section>
  );
};

type TabType =
  | "biografia"
  | "historial-academico"
  | "controversias"
  | "ideologia-politica"
  | "ingresos"
  | "experiencia"
  | "logros"
  | "propuestas";

const TABS: { key: TabType; label: string }[] = [
  { key: "biografia", label: "Biografía" },
  { key: "historial-academico", label: "Historial académico" },
  { key: "controversias", label: "Controversias" },
  { key: "ideologia-politica", label: "Ideología política" },
  { key: "ingresos", label: "Ingresos" },
  { key: "experiencia", label: "Experiencia" },
  { key: "logros", label: "Logros" },
  { key: "propuestas", label: "Algunas propuestas" },
];

function conPuntoFinal(s: string | undefined): string {
  if (s == null || typeof s !== "string") return "";
  const t = s.trim();
  if (!t) return t;
  return /[.!?]$/.test(t) ? t : t + ".";
}

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
            <p className="text-[18px] text-slate-700">
              El candidato que buscas no existe.
            </p>
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
            <h2 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Quién es {candidateDetail.name}
            </h2>
            <p className="text-[16px] leading-[175%] text-slate-700 sm:text-[18px]">
              {conPuntoFinal(candidateDetail.biografia)}
            </p>
          </div>
        );

      case "historial-academico":
        return (
          <div className="space-y-4">
            <h2 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Edad y biografía
            </h2>
            <ul className="space-y-3">
              {candidateDetail.historialAcademico.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[16px] leading-[175%] text-slate-700"
                >
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b1b3b]" />
                  <span>{conPuntoFinal(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "controversias":
        return (
          <div className="space-y-4">
            <h2 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Controversias
            </h2>
            <ul className="space-y-3">
              {candidateDetail.controversias.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[16px] leading-[175%] text-slate-700"
                >
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#c61b1b]" />
                  <span>{conPuntoFinal(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "ideologia-politica":
        return (
          <div className="space-y-4">
            <h2 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Ideología política
            </h2>
            <p className="text-[16px] leading-[175%] text-slate-700 sm:text-[18px]">
              {conPuntoFinal(candidateDetail.ideologiaPolitica)}
            </p>
          </div>
        );

      case "ingresos":
        return (
          <div className="space-y-4">
            <h2 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Ingresos y financiamiento
            </h2>
            <div className="rounded-2xl bg-[#eef2fb] p-6">
              <div className="mb-4">
                <p className="text-[14px] font-semibold text-slate-600">
                  Total
                </p>
                <p className="mt-1 text-[24px] font-black text-[#0b1b3b]">
                  {candidateDetail.financiamiento.total}
                </p>
              </div>
              <div>
                <p className="text-[14px] font-semibold text-slate-600 mb-2">
                  Fuentes
                </p>
                <ul className="space-y-2">
                  {candidateDetail.financiamiento.sources.map((source, idx) => (
                    <li key={idx} className="text-[15px] text-slate-700">
                      • {conPuntoFinal(source)}
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
            <h2 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Trayectoria política
            </h2>
            <ul className="space-y-3">
              {candidateDetail.experiencia.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[16px] leading-[175%] text-slate-700"
                >
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b1b3b]" />
                  <span>{conPuntoFinal(item)}</span>
                </li>
              ))}
            </ul>
          </div>
        );

      case "logros":
        return (
          <div className="space-y-4">
            <h2 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Logros
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
              {candidateDetail.logros.map((item, idx) => (
                <div key={idx} className="rounded-xl bg-[#eef2fb] p-5">
                  <p className="text-[15px] leading-[170%] text-slate-700">
                    {conPuntoFinal(item)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case "propuestas":
        return (
          <div className="space-y-4">
            <h2 className="text-[20px] font-extrabold text-[#0b1b3b]">
              Propuestas principales
            </h2>
            <ul className="space-y-3">
              {candidateDetail.propuestas.map((propuesta, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-[16px] leading-[175%] text-slate-700"
                >
                  <span className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-[#0b1b3b]" />
                  <span>{conPuntoFinal(propuesta)}</span>
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
      <Banner title={candidateDetail.name} />

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

      {/* Aviso de fallecimiento */}
      {candidate.fallecido && (
        <section className="bg-slate-100 border-b border-slate-200 py-5">
          <div className="mx-auto max-w-6xl px-4 lg:px-16">
            <div className="flex items-start gap-4 rounded-xl border border-slate-300 bg-white px-5 py-4">
              <span className="text-2xl mt-0.5 select-none">🕊️</span>
              <div>
                <p className="text-[15px] font-bold text-[#0b1b3b]">
                  Napoleón Becerra García — In memoriam
                </p>
                <p className="mt-1 text-[14px] leading-relaxed text-slate-600">
                  El candidato presidencial Napoleón Becerra García falleció el{" "}
                  <strong>15 de marzo de 2026</strong> en un accidente de tránsito
                  en la carretera de Rumichaca, Ayacucho. Observa Perú mantiene
                  esta página como registro histórico de su candidatura y propuestas.
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

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
                  {candidateDetail.planGobiernoUrl &&
                    candidateDetail.planGobiernoUrl !==
                      "https://drive.google.com/file/d/PLACEHOLDER/view" && (
                      <a
                        href={candidateDetail.planGobiernoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-[50px] w-full items-center justify-center rounded-[12px] bg-[#0b1b3b] px-4 py-3 text-[16px] font-semibold text-white transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
                      >
                        Plan de Gobierno
                      </a>
                    )}
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

      {/* Enlaces internos */}
      <section className="border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <h2 className="mb-6 text-[18px] font-bold text-[#0b1b3b]">
            Explora más
          </h2>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/comparacion"
              className="rounded-lg bg-[#eef2fb] px-4 py-2 text-[14px] font-semibold text-[#0b1b3b] transition-colors hover:bg-[#d9d9d9]"
            >
              Comparar candidatos
            </Link>
            <Link
              href="/mapa-ideologico"
              className="rounded-lg bg-[#eef2fb] px-4 py-2 text-[14px] font-semibold text-[#0b1b3b] transition-colors hover:bg-[#d9d9d9]"
            >
              Mapa ideológico
            </Link>
            <Link
              href="/estadisticas"
              className="rounded-lg bg-[#eef2fb] px-4 py-2 text-[14px] font-semibold text-[#0b1b3b] transition-colors hover:bg-[#d9d9d9]"
            >
              Estadísticas
            </Link>
            <Link
              href="/candidatos"
              className="rounded-lg bg-[#eef2fb] px-4 py-2 text-[14px] font-semibold text-[#0b1b3b] transition-colors hover:bg-[#d9d9d9]"
            >
              Ver todos los candidatos
            </Link>
          </div>
          <p className="mt-4 text-[13px] font-semibold text-slate-600">
            Otros candidatos
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {ALL_CANDIDATES.filter((c) => c.key !== slug)
              .slice(0, 8)
              .map((c) => (
                <li key={c.key}>
                  <Link
                    href={`/candidatos/${c.key}`}
                    className="text-[14px] font-medium text-[#0b1b3b] underline decoration-[#0b1b3b]/40 underline-offset-2 hover:decoration-[#0b1b3b]"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      </section>

      {/* Fuentes y referencias (E-E-A-T) */}
      <section className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <h2 className="mb-3 text-[18px] font-bold text-[#0b1b3b]">Fuentes</h2>
          <p className="text-[14px] leading-relaxed text-slate-700">
            Toda la información de esta página (biografía, historial académico,
            declaraciones juradas, experiencia, propuestas y plan de gobierno)
            fue extraída de la plataforma oficial del{" "}
            <a
              href="https://www.jne.gob.pe"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#0b1b3b] underline decoration-[#0b1b3b]/50 underline-offset-2 hover:decoration-[#0b1b3b]"
            >
              Jurado Nacional de Elecciones (JNE)
            </a>
            , organismo constitucional autónomo encargado de la transparencia y
            supervisión de los procesos electorales en el Perú.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}
