"use client";

import { useMemo, useState, useEffect } from "react";
import { ALL_CANDIDATES } from "@/data/candidatos"; // Importación centralizada
import Image from "next/image";
import Link from "next/link";

/** Mini-hero reutilizable */
const Banner = ({
  title,
  bg = "/hero-bg1.jpg",
}: {
  title: string;
  bg?: string;
}) => {
  return (
    <section className="relative w-full overflow-hidden" id="top">
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

type SexFilter = "M" | "F" | "ND" | "ALL";
type CongressFilter = "ALL" | "YES" | "NO";

/** Utilidad para normalizar strings (búsqueda imparcial) */
function normalizeStr(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Partidos con presencia en el Congreso actual */
const CONGRESO_KEYWORDS = [
  "renovacion popular",
  "fuerza popular",
  "alianza para el progreso",
  "somos peru",
  "juntos por el peru",
  "avanza pais",
  "peru libre",
  "accion popular",
  "podemos peru",
];

function hasCongress(party: string) {
  const p = normalizeStr(party);
  return CONGRESO_KEYWORDS.some((k) => p.includes(k));
}

export default function CandidatosPage() {
  const [q, setQ] = useState("");
  const [sex, setSex] = useState<SexFilter>("ALL");
  const [congreso, setCongreso] = useState<CongressFilter>("ALL");

  /** Lógica de filtrado usando la data externa */
  const filtered = useMemo(() => {
    const query = normalizeStr(q);

    return ALL_CANDIDATES.filter((c) => {
      const text = normalizeStr(`${c.name} ${c.party}`);
      const matchText = query ? text.includes(query) : true;

      const matchSex = sex === "ALL" ? true : c.sex === sex;

      const inCongress = hasCongress(c.party);
      const matchCongress =
        congreso === "ALL"
          ? true
          : congreso === "YES"
          ? inCongress
          : !inCongress;

      return matchText && matchSex && matchCongress;
    });
  }, [q, sex, congreso]);

  /** Flecha "volver arriba" */
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      <Banner title="Conoce los perfiles de los candidatos" bg="/hero-bg1.jpg" />

      {/* Barra de búsqueda + filtros */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4">
            <div className="flex w-full items-center gap-3 rounded-full bg-[#0b1b3b] px-4 py-3 shadow-sm">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                🔎
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Busca por candidato o partido..."
                className="w-full bg-transparent text-[14px] text-white placeholder-white/70 outline-none sm:text-[15px]"
              />
              <button
                type="button"
                onClick={() => {
                  setQ("");
                  setSex("ALL");
                  setCongreso("ALL");
                }}
                className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#0b1b3b] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99]"
              >
                Limpiar
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <label className="block text-[12px] font-semibold text-[#0b1b3b]">Sexo</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value as SexFilter)}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] text-[#0b1b3b] outline-none focus:ring-2 focus:ring-[#6fb6ff]"
                >
                  <option value="ALL">Ambos</option>
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <label className="block text-[12px] font-semibold text-[#0b1b3b]">En el Congreso</label>
                <select
                  value={congreso}
                  onChange={(e) => setCongreso(e.target.value as CongressFilter)}
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-[14px] text-[#0b1b3b] outline-none focus:ring-2 focus:ring-[#6fb6ff]"
                >
                  <option value="ALL">Por defecto</option>
                  <option value="YES">Sí</option>
                  <option value="NO">No</option>
                </select>
              </div>

              <div className="rounded-xl bg-white p-4 shadow-sm text-center">
                <div className="text-[12px] font-semibold text-[#0b1b3b]">Resultados</div>
                <div className="mt-2 text-[34px] font-black leading-none text-[#0b1b3b]">{filtered.length}</div>
                <div className="mt-1 text-[12px] text-slate-500">candidatos mostrados</div>
              </div>
            </div>
          </div>

          {/* Grid de cards */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const sticker = hasCongress(c.party);
              return (
                <article
                  key={c.key}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  {sticker && (
                    <div className="pointer-events-none absolute right-[-52px] top-[18px] z-10 rotate-45 bg-[#c61b1b] px-16 py-1.5 text-center text-[11px] font-extrabold uppercase tracking-[0.06em] text-white shadow">
                      En el Congreso actual
                    </div>
                  )}

                  <div className="p-7">
                    <div className="relative mx-auto h-[140px] w-[140px] overflow-hidden rounded-2xl bg-slate-100">
                      <Image
                        src={c.img}
                        alt={c.name}
                        fill
                        className="object-cover opacity-100 transition-opacity duration-200 group-hover:opacity-0"
                      />
                      <Image
                        src={c.imgHover}
                        alt={`${c.party} logo`}
                        fill
                        className="object-contain p-4 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      />
                    </div>

                    <h3 className="mt-6 text-center text-[20px] font-black leading-[120%] text-[#0b1b3b]">
                      {c.name}
                    </h3>
                    <p className="mt-2 text-center text-[15px] font-medium text-slate-600">
                      {c.party}
                    </p>

                    <div className="mt-4 flex justify-center">
                      <span className="rounded-full bg-[#0b1b3b]/5 px-4 py-1 text-[12px] font-semibold text-[#0b1b3b]">
                        {c.sex === "M" ? "Masculino" : c.sex === "F" ? "Femenino" : "Sin dato"}
                      </span>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <Link
                        href={`/candidatos/${c.key}`}
                        className="inline-flex h-[44px] items-center justify-center rounded-full bg-[#0b1b3b] px-7 text-[13px] font-semibold text-white transition-transform duration-150 hover:scale-[1.03]"
                      >
                        Ver perfil
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Botón volver arriba */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 left-6 z-50 h-12 w-12 rounded-full bg-white shadow-lg border border-slate-200 flex items-center justify-center text-[#0b1b3b] text-[18px] font-black transition-all duration-200 ${
          showTop ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        ↑
      </button>
    </main>
  );
}