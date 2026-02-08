"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ALL_CANDIDATES, Candidate } from "@/data/candidatos";
import { getCandidateDetail, CandidateDetail } from "@/data/candidatos-detalle";

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

// Componente para el selector de candidatos con autocompletado
const CandidateSelector = ({
  label,
  value,
  onChange,
  excludeKey,
}: {
  label: string;
  value: Candidate | null;
  onChange: (candidate: Candidate | null) => void;
  excludeKey?: string;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrar candidatos según el término de búsqueda
  const filteredCandidates = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return ALL_CANDIDATES.filter(
      (c) =>
        c.key !== excludeKey &&
        (c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term) ||
          c.party.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(term))
    ).slice(0, 10);
  }, [searchTerm, excludeKey]);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (candidate: Candidate) => {
    onChange(candidate);
    setSearchTerm(candidate.name);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
    setFocusedIndex(-1);
    if (!e.target.value) {
      onChange(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filteredCandidates.length - 1 ? prev + 1 : prev));
      setIsOpen(true);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Enter" && focusedIndex >= 0 && focusedCandidates[focusedIndex]) {
      e.preventDefault();
      handleSelect(filteredCandidates[focusedIndex]);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  const focusedCandidates = filteredCandidates;

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="mb-2 block text-[16px] font-bold text-[#0b1b3b]">{label}</label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value ? value.name : searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Busca el nombre de tu candidato"
          className="w-full rounded-[12px] bg-[#0b1b3b] px-4 py-3 pl-12 text-[16px] font-medium text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-[#6fb6ff]"
        />
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {isOpen && filteredCandidates.length > 0 && (
          <div className="absolute z-50 mt-2 max-h-60 w-full overflow-auto rounded-[12px] bg-white shadow-lg">
            {filteredCandidates.map((candidate, idx) => (
              <button
                key={candidate.key}
                type="button"
                onClick={() => handleSelect(candidate)}
                className={`w-full px-4 py-3 text-left text-[14px] transition-colors ${
                  idx === focusedIndex
                    ? "bg-[#0b1b3b] text-white"
                    : "bg-white text-[#0b1b3b] hover:bg-[#eef2fb]"
                }`}
              >
                <div className="font-semibold">{candidate.name}</div>
                <div className="text-[12px] text-slate-600">{candidate.party}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Componente para renderizar el contenido de una pestaña
const renderTabContent = (candidateDetail: CandidateDetail, tab: TabType) => {
  switch (tab) {
    case "biografia":
      return (
        <div className="space-y-4">
          <p className="text-[14px] leading-[175%] text-slate-700 sm:text-[15px]">
            {candidateDetail.biografia}
          </p>
        </div>
      );

    case "historial-academico":
      return (
        <ul className="space-y-2">
          {candidateDetail.historialAcademico.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-[14px] leading-[175%] text-slate-700"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0b1b3b]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "controversias":
      return (
        <ul className="space-y-2">
          {candidateDetail.controversias.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-[14px] leading-[175%] text-slate-700"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#c61b1b]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "ideologia-politica":
      return (
        <div className="space-y-4">
          <p className="text-[14px] leading-[175%] text-slate-700 sm:text-[15px]">
            {candidateDetail.ideologiaPolitica}
          </p>
        </div>
      );

    case "financiamiento":
      return (
        <div className="space-y-3">
          <div>
            <p className="text-[12px] font-semibold text-slate-600">Total</p>
            <p className="mt-1 text-[18px] font-black text-[#0b1b3b]">
              {candidateDetail.financiamiento.total}
            </p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-slate-600 mb-2">Fuentes</p>
            <ul className="space-y-1">
              {candidateDetail.financiamiento.sources.map((source, idx) => (
                <li key={idx} className="text-[13px] text-slate-700">
                  • {source}
                </li>
              ))}
            </ul>
          </div>
        </div>
      );

    case "experiencia":
      return (
        <ul className="space-y-2">
          {candidateDetail.experiencia.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-[14px] leading-[175%] text-slate-700"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0b1b3b]" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );

    case "logros":
      return (
        <div className="grid gap-3 sm:grid-cols-2">
          {candidateDetail.logros.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-[#eef2fb] p-3"
            >
              <p className="text-[13px] leading-[170%] text-slate-700">
                {item}
              </p>
            </div>
          ))}
        </div>
      );

    case "propuestas":
      return (
        <ul className="space-y-2">
          {candidateDetail.propuestas.map((propuesta, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-[14px] leading-[175%] text-slate-700"
            >
              <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#0b1b3b]" />
              <span>{propuesta}</span>
            </li>
          ))}
        </ul>
      );

    default:
      return null;
  }
};

export default function ComparacionPage() {
  const [candidate1, setCandidate1] = useState<Candidate | null>(null);
  const [candidate2, setCandidate2] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>("biografia");
  const [isComparing, setIsComparing] = useState(false);

  const candidate1Detail = useMemo(() => {
    if (!candidate1) return null;
    return getCandidateDetail(candidate1.key, candidate1);
  }, [candidate1]);

  const candidate2Detail = useMemo(() => {
    if (!candidate2) return null;
    return getCandidateDetail(candidate2.key, candidate2);
  }, [candidate2]);

  const handleCompare = () => {
    if (candidate1 && candidate2) {
      setIsComparing(true);
      setActiveTab("biografia");
      // Scroll suave hacia la sección de comparación
      setTimeout(() => {
        const comparisonSection = document.getElementById("comparison-results");
        if (comparisonSection) {
          comparisonSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  };

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      <Banner title="Comparar candidatos" />

      {/* Sección de selección */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <p className="mb-8 text-center text-[18px] font-semibold text-[#0b1b3b] sm:text-[20px]">
            Selecciona dos candidatos para ver una comparación lado a lado de su información clave.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            <CandidateSelector
              label="Candidato 1"
              value={candidate1}
              onChange={setCandidate1}
              excludeKey={candidate2?.key}
            />
            <CandidateSelector
              label="Candidato 2"
              value={candidate2}
              onChange={setCandidate2}
              excludeKey={candidate1?.key}
            />
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleCompare}
              disabled={!candidate1 || !candidate2}
              className="inline-flex h-[50px] items-center justify-center rounded-[12px] bg-[#0b1b3b] px-8 text-[18px] font-bold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
            >
              Comparar
            </button>
          </div>
        </div>
      </section>

      {/* Sección de comparación */}
      {isComparing && candidate1Detail && candidate2Detail && (
        <section id="comparison-results" className="bg-[#eef2fb] py-14">
          <div className="mx-auto max-w-[1600px] px-4 lg:px-16">
            {/* Pestañas compartidas */}
            <div className="mb-6 flex flex-wrap justify-center gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-lg px-4 py-2 text-[12px] font-semibold transition-all duration-200 sm:px-6 sm:py-3 sm:text-[14px] ${
                    activeTab === tab.key
                      ? "bg-[#0b1b3b] text-white shadow-md"
                      : "bg-white text-[#0b1b3b] hover:bg-[#eef2fb]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Comparación lado a lado */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Candidato 1 */}
              <div className="flex flex-col">
                <div className="mb-4">
                  <h3 className="mb-2 text-[16px] font-bold text-[#0b1b3b]">Candidato 1</h3>
                  <div className="rounded-[12px] bg-[#0b1b3b] px-4 py-2">
                    <p className="text-[16px] font-bold uppercase text-white">
                      {candidate1Detail.name}
                    </p>
                  </div>
                </div>
                <div className="relative mb-4 h-[300px] w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-[350px]">
                  <Image
                    src={candidate1Detail.img}
                    alt={candidate1Detail.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 rounded-2xl bg-[#d9d9d9]/45 p-4 sm:p-6">
                  {renderTabContent(candidate1Detail, activeTab)}
                </div>
              </div>

              {/* Candidato 2 */}
              <div className="flex flex-col">
                <div className="mb-4">
                  <h3 className="mb-2 text-[16px] font-bold text-[#0b1b3b]">Candidato 2</h3>
                  <div className="rounded-[12px] bg-[#0b1b3b] px-4 py-2">
                    <p className="text-[16px] font-bold uppercase text-white">
                      {candidate2Detail.name}
                    </p>
                  </div>
                </div>
                <div className="relative mb-4 h-[300px] w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-[350px]">
                  <Image
                    src={candidate2Detail.img}
                    alt={candidate2Detail.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 rounded-2xl bg-[#d9d9d9]/45 p-4 sm:p-6">
                  {renderTabContent(candidate2Detail, activeTab)}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

