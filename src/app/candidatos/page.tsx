"use client";

import { useMemo, useState, useEffect } from "react";
import Image from "next/image";

/** Mini-hero reutilizable (misma lógica que Contactanos) */
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

type Sex = "M" | "F" | "ND";
type SexFilter = Sex | "ALL";
type CongressFilter = "ALL" | "YES" | "NO";

type Candidate = {
  name: string;
  party: string;
  sex: Sex;
  img: string; // foto del candidato (provisional)
  imgHover: string; // logo/foto del partido (provisional)
};

function normalizeStr(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Partidos con presencia en el Congreso actual (según tu lista) */
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

/** Sexo por partido (según lo que me diste) */
const PARTY_SEX: Record<string, Sex> = {
  "Ahora Nación": "M",
  "Alianza Electoral Venceremos": "M",
  "Alianza para el Progreso": "M",
  "Avanza País – Partido de Integración Social": "M",
  "Fuerza Popular": "F",
  "Fuerza y Libertad": "F",
  "Juntos por el Perú": "M",
  "Libertad Popular": "M",
  "Partido Aprista Peruano": "M",
  "Partido Cívico Obras": "M",
  "Partido de los Trabajadores y Emprendedores PTE - Perú": "M",
  "Partido del Buen Gobierno": "M",
  "Partido Demócrata Unido Perú": "M",
  "Partido Demócrata Verde": "M",
  "Partido Democrático Federal": "M",
  "Partido Democrático Somos Perú": "M",
  "Partido Frente de la Esperanza 2021": "M",
  "Partido Morado": "M",
  "Partido País para Todos": "M",
  "Partido Patriótico del Perú": "M",
  "Partido Político Cooperación Popular": "M",
  "Partido Político Fe en el Perú": "M",
  "Partido Político Integridad Democrática": "M",
  "Partido Político Nacional Perú Libre": "M",
  "Partido Político Perú Acción": "M",
  "Partido Político PRIN": "M",
  "Partido SíCreo": "M",
  "Perú Moderno": "M",
  "Podemos Perú": "M",
  "Progresemos": "M",
  "Renovación Popular": "M",
  "Salvemos al Perú": "M",
  "Un Camino Diferente": "F",
  "Unidad Nacional": "M",
};

function getSexByParty(party: string): Sex {
  if (PARTY_SEX[party]) return PARTY_SEX[party];

  const norm = normalizeStr(party);
  const found = Object.entries(PARTY_SEX).find(
    ([k]) => normalizeStr(k) === norm
  );
  return found ? found[1] : "ND";
}

export default function CandidatosPage() {
  /**
   * IMPORTANTE:
   * - img: foto del candidato (provisional)
   * - imgHover: imagen/logo del partido (provisional)
   *
   * RUTAS PROPUESTAS (cámbialas cuando subas tus archivos):
   * - Candidatos: /public/candidatos/<slug>-foto.jpg
   * - Partidos:   /public/partidos/<slug>-logo.png
   *
   * No hay "constantes de default" para imágenes: cada candidato ya trae sus rutas.
   */

  const candidates: Candidate[] = useMemo(
    () => [ 
    {
      name: "Alfonso López Chau Nava",
      party: "Ahora Nación",
      sex: getSexByParty("Ahora Nación"),
      img: "/candidatos/alfonso-lopez-chau-foto.jpg",
      imgHover: "/partidos/ahora-nacion-logo.png",
    },
    {
      name: "Ronald Darwin Atencio Sotomayor",
      party: "Alianza Electoral Venceremos",
      sex: getSexByParty("Alianza Electoral Venceremos"),
      img: "/candidatos/ronald-atencio-foto.jpg",
      imgHover: "/partidos/alianza-electoral-venceremos-logo.png",
    },
    {
      name: "César Acuña Peralta",
      party: "Alianza para el Progreso",
      sex: getSexByParty("Alianza para el Progreso"),
      img: "/candidatos/cesar-acuna-foto.jpg",
      imgHover: "/partidos/alianza-para-el-progreso-logo.png",
    },
    {
      name: "José Williams Zapata",
      party: "Avanza País – Partido de Integración Social",
      sex: getSexByParty("Avanza País – Partido de Integración Social"),
      img: "/candidatos/jose-williams-foto.jpg",
      imgHover: "/partidos/avanza-pais-logo.png",
    },
    {
      name: "Keiko Sofía Fujimori Higuchi",
      party: "Fuerza Popular",
      sex: getSexByParty("Fuerza Popular"),
      img: "/candidatos/keiko-fujimori-foto.jpg",
      imgHover: "/partidos/fuerza-popular-logo.png",
    },
    {
      name: "Fiorella Giannina Molinelli Aristondo",
      party: "Fuerza y Libertad",
      sex: getSexByParty("Fuerza y Libertad"),
      img: "/candidatos/fiorella-molinelli-foto.jpg",
      imgHover: "/partidos/fuerza-y-libertad-logo.png",
    },
    {
      name: "Roberto Helbert Sánchez Palomino",
      party: "Juntos por el Perú",
      sex: getSexByParty("Juntos por el Perú"),
      img: "/candidatos/roberto-sanchez-foto.jpg",
      imgHover: "/partidos/juntos-por-el-peru-logo.png",
    },
    {
      name: "Rafael Jorge Belaunde Llosa",
      party: "Libertad Popular",
      sex: getSexByParty("Libertad Popular"),
      img: "/candidatos/rafael-belaunde-foto.jpg",
      imgHover: "/partidos/libertad-popular-logo.png",
    },
    {
      name: "Pitter Enrique Valderrama Peña",
      party: "Partido Aprista Peruano",
      sex: getSexByParty("Partido Aprista Peruano"),
      img: "/candidatos/pitter-valderrama-foto.jpg",
      imgHover: "/partidos/partido-aprista-peruano-logo.png",
    },
    {
      name: "Ricardo Pablo Belmont Cassinelli",
      party: "Partido Cívico Obras",
      sex: getSexByParty("Partido Cívico Obras"),
      img: "/candidatos/ricardo-belmont-foto.jpg",
      imgHover: "/partidos/partido-civico-obras-logo.png",
    },
    {
      name: "Napoleón Becerra García",
      party: "Partido de los Trabajadores y Emprendedores PTE - Perú",
      sex: getSexByParty("Partido de los Trabajadores y Emprendedores PTE - Perú"),
      img: "/candidatos/napoleon-becerra-foto.jpg",
      imgHover: "/partidos/pte-peru-logo.png",
    },
    {
      name: "Jorge Nieto Montesinos",
      party: "Partido del Buen Gobierno",
      sex: getSexByParty("Partido del Buen Gobierno"),
      img: "/candidatos/jorge-nieto-foto.jpg",
      imgHover: "/partidos/partido-del-buen-gobierno-logo.png",
    },
    {
      name: "Charlie Carrasco Salazar",
      party: "Partido Demócrata Unido Perú",
      sex: getSexByParty("Partido Demócrata Unido Perú"),
      img: "/candidatos/charlie-carrasco-foto.jpg",
      imgHover: "/partidos/partido-democrata-unido-peru-logo.png",
    },
    {
      name: "Alex González Castillo",
      party: "Partido Demócrata Verde",
      sex: getSexByParty("Partido Demócrata Verde"),
      img: "/candidatos/alex-gonzalez-foto.jpg",
      imgHover: "/partidos/partido-democrata-verde-logo.png",
    },
    {
      name: "Armando Joaquín Masse Fernández",
      party: "Partido Democrático Federal",
      sex: getSexByParty("Partido Democrático Federal"),
      img: "/candidatos/armando-masse-foto.jpg",
      imgHover: "/partidos/partido-democratico-federal-logo.png",
    },
    {
      name: "George Patrick Forsyth Sommer",
      party: "Partido Democrático Somos Perú",
      sex: getSexByParty("Partido Democrático Somos Perú"),
      img: "/candidatos/george-forsyth-foto.jpg",
      imgHover: "/partidos/somos-peru-logo.png",
    },
    {
      name: "Luis Fernando Olivera Vega",
      party: "Partido Frente de la Esperanza 2021",
      sex: getSexByParty("Partido Frente de la Esperanza 2021"),
      img: "/candidatos/luis-fernando-olivera-foto.jpg",
      imgHover: "/partidos/frente-de-la-esperanza-2021-logo.png",
    },
    {
      name: "Mesías Antonio Guevara Amasifuen",
      party: "Partido Morado",
      sex: getSexByParty("Partido Morado"),
      img: "/candidatos/mesias-guevara-foto.jpg",
      imgHover: "/partidos/partido-morado-logo.png",
    },
    {
      name: "Carlos Gonzalo Álvarez Loayza",
      party: "Partido País para Todos",
      sex: getSexByParty("Partido País para Todos"),
      img: "/candidatos/carlos-alvarez-foto.jpg",
      imgHover: "/partidos/pais-para-todos-logo.png",
    },
    {
      name: "Herbert Caller Gutiérrez",
      party: "Partido Patriótico del Perú",
      sex: getSexByParty("Partido Patriótico del Perú"),
      img: "/candidatos/herbert-caller-foto.jpg",
      imgHover: "/partidos/partido-patriotico-del-peru-logo.png",
    },
    {
      name: "Yonhy Lescano Ancieta",
      party: "Partido Político Cooperación Popular",
      sex: getSexByParty("Partido Político Cooperación Popular"),
      img: "/candidatos/yonhy-lescano-foto.jpg",
      imgHover: "/partidos/cooperacion-popular-logo.png",
    },
    {
      name: "Álvaro Gonzalo Paz de la Barra Freigeiro",
      party: "Partido Político Fe en el Perú",
      sex: getSexByParty("Partido Político Fe en el Perú"),
      img: "/candidatos/alvaro-paz-de-la-barra-foto.jpg",
      imgHover: "/partidos/fe-en-el-peru-logo.png",
    },
    {
      name: "Wolfgang Mario Grozo Costa",
      party: "Partido Político Integridad Democrática",
      sex: getSexByParty("Partido Político Integridad Democrática"),
      img: "/candidatos/wolfgang-grozo-foto.jpg",
      imgHover: "/partidos/integridad-democratica-logo.png",
    },
    {
      name: "Vladimir Roy Cerrón Rojas",
      party: "Partido Político Nacional Perú Libre",
      sex: getSexByParty("Partido Político Nacional Perú Libre"),
      img: "/candidatos/vladimir-cerron-foto.jpg",
      imgHover: "/partidos/peru-libre-logo.png",
    },
    {
      name: "Francisco Ernesto Diez-Canseco Távara",
      party: "Partido Político Perú Acción",
      sex: getSexByParty("Partido Político Perú Acción"),
      img: "/candidatos/francisco-diez-canseco-foto.jpg",
      imgHover: "/partidos/accion-popular-logo.png",
    },
    {
      name: "Walter Gilmer Chirinos Purizaga",
      party: "Partido Político PRIN",
      sex: getSexByParty("Partido Político PRIN"),
      img: "/candidatos/walter-chirinos-foto.jpg",
      imgHover: "/partidos/prin-logo.png",
    },
    {
      name: "Carlos Espá y Garcés-Alvear",
      party: "Partido SíCreo",
      sex: getSexByParty("Partido SíCreo"),
      img: "/candidatos/carlos-espa-foto.jpg",
      imgHover: "/partidos/sicreo-logo.png",
    },
    {
      name: "Carlos Ernesto Jaico Carranza",
      party: "Perú Moderno",
      sex: getSexByParty("Perú Moderno"),
      img: "/candidatos/carlos-jaico-foto.jpg",
      imgHover: "/partidos/peru-moderno-logo.png",
    },
    {
      name: "José León Luna Gálvez",
      party: "Podemos Perú",
      sex: getSexByParty("Podemos Perú"),
      img: "/candidatos/jose-leon-luna-foto.jpg",
      imgHover: "/partidos/podemos-peru-logo.png",
    },
    {
      name: "Paul Davis Jaimes Blanco",
      party: "Progresemos",
      sex: getSexByParty("Progresemos"),
      img: "/candidatos/paul-davis-jaimes-foto.jpg",
      imgHover: "/partidos/progresemos-logo.png",
    },
    {
      name: "Rafael Bernardo López Aliaga",
      party: "Renovación Popular",
      sex: getSexByParty("Renovación Popular"),
      img: "/candidatos/rafael-lopez-aliaga-foto.jpg",
      imgHover: "/partidos/renovacion-popular-logo.png",
    },
    {
      name: "Antonio Ortiz Villano",
      party: "Salvemos al Perú",
      sex: getSexByParty("Salvemos al Perú"),
      img: "/candidatos/antonio-ortiz-foto.jpg",
      imgHover: "/partidos/salvemos-al-peru-logo.png",
    },
    {
      name: "Rosario del Pilar Fernández Bazán",
      party: "Un Camino Diferente",
      sex: getSexByParty("Un Camino Diferente"),
      img: "/candidatos/rosario-fernandez-foto.jpg",
      imgHover: "/partidos/un-camino-diferente-logo.png",
    },
    {
      name: "Roberto Enrique Chiabra León",
      party: "Unidad Nacional",
      sex: getSexByParty("Unidad Nacional"),
      img: "/candidatos/roberto-chiabra-foto.jpg",
      imgHover: "/partidos/unidad-nacional-logo.png",
    },
    
     ],
   []
    );

    const [q, setQ] = useState("");
    const [sex, setSex] = useState<SexFilter>("ALL");
    const [congreso, setCongreso] = useState<CongressFilter>("ALL");

    const filtered = useMemo(() => {
        const query = normalizeStr(q);

        return candidates.filter((c) => {
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
    }, [q, sex, congreso, candidates]); // candidates no cambia

  /** Flecha "volver arriba" (aparece al scrollear) */
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
            {/* Search bar estilo pill */}
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

            {/* Filtros */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <label className="block text-[12px] font-semibold text-[#0b1b3b]">
                  Sexo
                </label>
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
                <label className="block text-[12px] font-semibold text-[#0b1b3b]">
                  Partido con presencia en el Congreso
                </label>
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

              <div className="rounded-xl bg-white p-4 shadow-sm">
                <div className="text-[12px] font-semibold text-[#0b1b3b]">
                  Resultados
                </div>
                <div className="mt-2 text-[34px] font-black leading-none text-[#0b1b3b]">
                  {filtered.length}
                </div>
                <div className="mt-1 text-[12px] text-slate-500">
                  candidatos mostrados
                </div>
              </div>
            </div>
          </div>

          {/* Grid de cards */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((c) => {
              const sticker = hasCongress(c.party);

              return (
                <article
                  key={`${c.name}-${c.party}`}
                  className="group relative overflow-hidden rounded-3xl bg-white shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Sticker tipo cinta */}
                  {sticker && (
                    <div className="pointer-events-none absolute right-[-52px] top-[18px] z-10 rotate-45 bg-[#c61b1b] px-16 py-1.5 text-center text-[11px] font-extrabold uppercase tracking-[0.06em] text-white shadow">
                      En el Congreso actual
                    </div>
                  )}

                  <div className="p-7">
                    {/* Imagen que cambia en hover */}
                    <div className="relative mx-auto h-[140px] w-[140px] overflow-hidden rounded-2xl bg-slate-100">
                      {/* normal (candidato) */}
                      <div className="absolute inset-0 opacity-100 transition-opacity duration-200 group-hover:opacity-0">
                        <Image
                          src={c.img}
                          alt={c.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* hover (partido) */}
                      <div className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <Image
                          src={c.imgHover}
                          alt={`${c.party} logo`}
                          fill
                          className="object-contain p-4"
                        />
                      </div>
                    </div>

                    {/* Texto */}
                    <h3 className="mt-6 text-center text-[20px] font-black leading-[120%] text-[#0b1b3b]">
                      {c.name}
                    </h3>

                    <p className="mt-2 text-center text-[15px] font-medium leading-[150%] text-slate-600">
                      {c.party}
                    </p>

                    {/* Chip sexo */}
                    <div className="mt-4 flex justify-center">
                      <span className="rounded-full bg-[#0b1b3b]/5 px-4 py-1 text-[12px] font-semibold text-[#0b1b3b]">
                        {c.sex === "M"
                          ? "Masculino"
                          : c.sex === "F"
                          ? "Femenino"
                          : "Sin dato"}
                      </span>
                    </div>

                    <div className="mt-6 flex justify-center">
                      <button
                        type="button"
                        className="inline-flex h-[44px] items-center justify-center rounded-full bg-[#0b1b3b] px-7 text-[13px] font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99]"
                      >
                        Ver perfil
                      </button>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <div className="absolute inset-0 bg-[#0b1b3b]/[0.03]" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Flecha volver arriba (izquierda) */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Volver arriba"
        className={[
          "fixed bottom-6 left-6 z-50",
          "h-12 w-12 rounded-full bg-white shadow-lg",
          "border border-slate-200",
          "flex items-center justify-center",
          "text-[#0b1b3b] text-[18px] font-black",
          "transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]",
          showTop ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none",
        ].join(" ")}
      >
        ↑
      </button>
    </main>
  );
}
