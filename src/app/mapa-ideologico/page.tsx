"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

/** Mini-hero reutilizable (misma lógica que Contactanos) */
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

      {/* Contenido: CENTRADO */}
      <div className="relative mx-auto flex h-[90px] max-w-6xl items-center justify-center px-4 lg:px-16">
        <h1 className="text-center text-[28px] font-extrabold leading-[110%] tracking-[-0.02em] text-white sm:text-[36px]">
          {title}
        </h1>
      </div>
    </section>
  );
};

type CandidateIdeology = {
  key: string;
  name: string;
  party: string;
  img: string; // cara del candidato
  econ: number; // -5 .. +5
  social: number; // -5 .. +5
  econLabel: string; // "Centro-derecha", etc.
  socialLabel: string; // "Moderado-conservador", etc.
  confidence: "Alta" | "Media" | "Baja";
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

function keyOf(c: Pick<CandidateIdeology, "name" | "party">) {
  return `${normalizeStr(c.name)}__${normalizeStr(c.party)}`;
}

/** Mapea (-5..+5) a porcentaje, con padding interno para que no se corten los puntos en bordes */
function toPercent(econ: number, social: number) {
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const x = clamp(econ, -5, 5);
  const y = clamp(social, -5, 5);

  // padding en % para que un punto en -5/+5 no se recorte
  const PAD = 7; // (sube/baja si quieres más “aire”)
  const span = 100 - 2 * PAD;

  // econ: -5 izquierda, +5 derecha
  const px = ((x + 5) / 10) * span + PAD;

  // social: -5 progresista (abajo), +5 conservador (arriba)
  const py = (1 - (y + 5) / 10) * span + PAD;

  return { x: px, y: py };
}

export default function MapaIdeologicoPage() {
  /** Flecha “volver arriba” */
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Data completa (nombres de imágenes provisionales; cámbialas luego en /public/candidatos/) */
  const ALL: CandidateIdeology[] = useMemo(
    () => []);

  /** Estado del mapa */
  const [mapCandidates, setMapCandidates] = useState<CandidateIdeology[]>([
    // si quieres que arranque vacío, deja []
    ALL.find((c) => c.key === "roberto-helbert-sanchez-palomino")!,
    ALL.find((c) => c.key === "alvaro-gonzalo-paz-de-la-barra-freigeiro")!,
  ]);

  /** Modal “Agregar” */
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  const inMap = useMemo(() => new Set(mapCandidates.map((c) => c.key)), [mapCandidates]);
  const effectiveSelectedKeys = useMemo(() => {
  const next = new Set<string>();
  selectedKeys.forEach((k) => {
    if (!inMap.has(k)) next.add(k);
  });
    return next;
    }, [selectedKeys, inMap]);

  const listFiltered = useMemo(() => {
  const query = normalizeStr(q);

  const available: CandidateIdeology[] = [];
  const alreadyAdded: CandidateIdeology[] = [];

  for (const c of ALL) {
    if (query && !normalizeStr(`${c.name} ${c.party}`).includes(query)) continue;

    if (inMap.has(c.key)) alreadyAdded.push(c);
    else available.push(c);
  }

  // Disponibles primero, ya agregados al final
  return [...available, ...alreadyAdded];
    }, [q, ALL, inMap]);

  /** Grupos para resolver colisiones (jitter controlado) */
  const groups = useMemo(() => {
    const m = new Map<string, CandidateIdeology[]>();
    mapCandidates.forEach((c) => {
      const k = `${c.econ}|${c.social}`;
      const arr = m.get(k) ?? [];
      arr.push(c);
      m.set(k, arr);
    });
    return Array.from(m.entries()).map(([posKey, items]) => {
      const [econStr, socialStr] = posKey.split("|");
      return { econ: Number(econStr), social: Number(socialStr), items };
    });
  }, [mapCandidates]);

  function removeFromMap(candidateKey: string) {
    setMapCandidates((prev) => prev.filter((c) => c.key !== candidateKey));
  }

  function clearMap() {
    setMapCandidates([]);
    setSelectedKeys(new Set());
  }

  function addSelected() {
  const toAdd = ALL.filter((c) => effectiveSelectedKeys.has(c.key) && !inMap.has(c.key));
  if (!toAdd.length) return;

  setMapCandidates((prev) => [...prev, ...toAdd]);
  setSelectedKeys(new Set());
  setOpen(false);
}

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      <Banner title="Mapa Ideológico" bg="/hero-bg1.jpg" />

      {/* Hero a la mitad (centrado) — SOLO 2 botones (sin Agregar/Limpiar) */}
      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <div className="relative overflow-hidden rounded-3xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/congreso.jpg')" }}
            />
            <div className="absolute inset-0 bg-[#0b1b3b]/65" />

            <div className="relative px-6 py-10 text-center sm:px-10">
              <p className="mx-auto max-w-4xl text-pretty text-[14px] leading-[175%] text-white/90 sm:text-[16px]">
                Explora la posición de cada figura en dimensiones económicas y sociales clave.
                Agrega candidatos al mapa para comparar su orientación y elimina los que no necesites.
                Si quieres revisar perfiles o planes, usa los accesos directos.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a
                  href="/candidatos"
                  className="inline-flex h-[46px] items-center justify-center rounded-full bg-white px-7 text-[13px] font-semibold text-[#0b1b3b] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99]"
                >
                  Revisar perfil de tu candidato
                </a>

                <a
                  href="#"
                  className="inline-flex h-[46px] items-center justify-center rounded-full border border-white/25 bg-white/0 px-7 text-[13px] font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99]"
                >
                  Revisa el plan de Gobierno
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plano ideológico */}
      <section className="pb-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            {/* Header del plano: título centrado + botones a la derecha */}
            <div className="relative flex items-center justify-end">
              <h2 className="absolute left-1/2 -translate-x-1/2 text-center text-[22px] font-black tracking-[-0.02em] text-[#0b1b3b] sm:text-[26px]">
                Plano ideológico
              </h2>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex h-[40px] items-center justify-center rounded-full bg-[#0b1b3b] px-6 text-[13px] font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99]"
                >
                  Agregar candidatos
                </button>
                <button
                  type="button"
                  onClick={clearMap}
                  className="inline-flex h-[40px] items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-[13px] font-semibold text-[#0b1b3b] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99]"
                >
                  Limpiar mapa
                </button>
              </div>
            </div>

            {/* Mapa */}
            <div className="mt-6">
              <div className="relative h-[520px] w-full overflow-visible rounded-2xl bg-[#d9d9d9]">
                {/* Ejes */}
                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[#0b1b3b]/30" />
                <div className="absolute left-0 top-1/2 h-[1px] w-full bg-[#0b1b3b]/30" />

                {/* Labels ejes */}
                <div className="pointer-events-none absolute left-1/2 top-3 -translate-x-1/2 text-[11px] font-semibold text-[#0b1b3b]">
                  Conservador
                </div>
                <div className="pointer-events-none absolute left-1/2 bottom-3 -translate-x-1/2 text-[11px] font-semibold text-[#0b1b3b]">
                  Progresista
                </div>
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#0b1b3b]">
                  Izquierda
                </div>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#0b1b3b]">
                  Derecha
                </div>

                {/* Puntos (con jitter para evitar colisiones) */}
                {groups.map((g) => {
                  const center = toPercent(g.econ, g.social);
                  const n = g.items.length;

                  // radio del “jitter” para separar puntos que colisionan
                  const R = 18;

                  return (
                    <div
                      key={`${g.econ}|${g.social}`}
                      className="absolute"
                      style={{
                        left: `${center.x}%`,
                        top: `${center.y}%`,
                      }}
                    >
                      {g.items.map((c, idx) => {
                        const angle = (2 * Math.PI * idx) / Math.max(n, 1);
                        const dx = n === 1 ? 0 : Math.round(R * Math.cos(angle));
                        const dy = n === 1 ? 0 : Math.round(R * Math.sin(angle));

                        return (
                         <div
                                key={c.key}
                                className="group absolute z-[60] hover:z-[2000] focus-within:z-[2000]"
                                style={{ transform: `translate(${dx}px, ${dy}px)` }}
                          >

                            {/* Tooltip: por delante del círculo */}
                            <div className="pointer-events-none absolute bottom-[54px] left-1/2 z-[999] hidden w-[240px] -translate-x-1/2 rounded-xl bg-[#0b1b3b] px-3 py-2 text-left text-[12px] text-white shadow-lg group-hover:block">
                              <div className="font-extrabold leading-[120%]">{c.name}</div>
                              <div className="mt-0.5 text-white/85">{c.party}</div>
                            </div>

                            {/* Punto */}
                            <div className="relative z-10 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative h-[44px] w-[44px] overflow-hidden rounded-full border-[3px] border-white bg-slate-200 shadow-md">
                              <Image src={c.img} alt={c.name} fill className="rounded-full object-cover" />
                             </div>
                              {/* Eliminar (botón rojo con raya blanca) */}
                            <button
                            type="button"
                            onClick={() => removeFromMap(c.key)}
                            className="absolute -right-[8px] -bottom-[8px] z-[80] grid h-[20px] w-[20px] place-items-center rounded-full bg-[#c61b1b] shadow-lg ring-2 ring-white"
                            aria-label={`Eliminar a ${c.name} del mapa`}
                        >
                            <span className="block h-[2px] w-[11px] rounded bg-white" />
                        </button>
                          </div>
                          </div>
                        );
                      })}

                      {/* Badge central si hay varios en la misma coordenada */}
                      {n > 1 && (
                            <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-extrabold text-[#0b1b3b] shadow">
                                {n}
                            </div>
                            )}

                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-[12px] text-slate-600">
                Tip: pasa el mouse sobre un punto para ver el nombre y partido. Usa “Limpiar mapa”
                para borrar todo de una vez.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ¿Cómo leer el mapa? (final) */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <h2 className="text-center text-[30px] font-black leading-[110%] tracking-[-0.03em] text-[#0b1b3b] sm:text-[40px]">
            ¿Cómo leer el mapa?
          </h2>

          <div className="mx-auto mt-8 max-w-4xl text-left">
            <ul className="list-disc space-y-3 pl-6 text-[15px] leading-[175%] text-[#0b1b3b] sm:text-[16px]">
              <li>
                <span className="font-extrabold">Izquierda Económica:</span> Representa propuestas donde
                el Estado tiene un rol activo en la economía: regulación de mercados, programas sociales,
                redistribución del ingreso y mayor presencia pública en sectores estratégicos.
              </li>
              <li>
                <span className="font-extrabold">Derecha Económica:</span> Agrupa posturas que priorizan el
                libre mercado, la iniciativa privada, la reducción de impuestos y un Estado con intervención
                limitada en la economía.
              </li>
              <li>
                <span className="font-extrabold">Progresista (Social):</span> Incluye posiciones que promueven
                derechos civiles, libertades individuales, igualdad de género, diversidad y una sociedad más
                abierta al cambio.
              </li>
              <li>
                <span className="font-extrabold">Conservador (Social):</span> Refleja posturas orientadas a
                preservar tradiciones, valores culturales y religiosos, y un enfoque más restrictivo frente a
                cambios sociales.
              </li>
            </ul>

            <p className="mx-auto mt-10 max-w-4xl text-center text-[18px] font-extrabold leading-[140%] text-[#0b1b3b] sm:text-[22px]">
              Las posiciones no representan afinidad política, sino una herramienta visual para comprender la
              orientación ideológica de cada candidatura.
            </p>
          </div>
        </div>
      </section>

      {/* Modal: Agregar candidatos al mapa */}
      {open && (
        <div className="fixed inset-0 z-[100]">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />

          <div className="absolute left-1/2 top-1/2 w-[94vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <div>
                <div className="text-[18px] font-black text-[#0b1b3b]">
                  Agregar candidatos al mapa
                </div>
                <div className="mt-1 text-[12px] text-slate-600">
                  Busca y selecciona varios. Luego presiona “Añadir”.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-[38px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-[12px] font-semibold text-[#0b1b3b] hover:bg-slate-50"
              >
                Cerrar
              </button>
            </div>

            <div className="p-6">
              {/* Search */}
              <div className="flex w-full items-center gap-3 rounded-full bg-[#0b1b3b] px-4 py-3 shadow-sm">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
                  🔎
                </span>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar por candidato o partido..."
                  className="w-full bg-transparent text-[14px] text-white placeholder-white/70 outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setQ("");
                    setSelectedKeys(new Set());
                  }}
                  className="rounded-full bg-white px-4 py-2 text-[12px] font-semibold text-[#0b1b3b] transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99]"
                >
                  Limpiar
                </button>
              </div>

              {/* List */}
              <div className="mt-5 max-h-[420px] overflow-auto rounded-2xl border border-slate-200">
                {listFiltered.map((c) => {
                     const already = inMap.has(c.key);
                    const checked = effectiveSelectedKeys.has(c.key);

                  return (
                    <label
                        key={c.key}
                        className={`flex items-center gap-4 border-b border-slate-100 px-4 py-3 last:border-b-0 ${
                            already
                            ? "bg-slate-50 opacity-60 cursor-not-allowed"
                            : "bg-white hover:bg-slate-50"
                        }`}
                        >
                        <input
                        type="checkbox"
                        disabled={already}
                        checked={checked}
                        onChange={(e) => {
                            setSelectedKeys((prev) => {
                            const next = new Set(prev);
                            if (e.target.checked) next.add(c.key);
                            else next.delete(c.key);
                            return next;
                            });
                            }}
                            className="h-4 w-4"
                        />

                        <div className="relative h-[42px] w-[42px] overflow-hidden rounded-full bg-slate-200">
                            <Image src={c.img} alt={c.name} fill className="object-cover" />
                        </div>

                        <div className="min-w-0 flex-1">
                        <div
                        className={`truncate text-[14px] font-extrabold ${
                            already ? "text-slate-400" : "text-[#0b1b3b]"
                        }`}
                        >
                        {c.name}
                        </div>

                        <div className={`truncate text-[12px] ${already ? "text-slate-400" : "text-slate-600"}`}>
                        {c.party}
                        </div>
                        </div>

                        {/* Solo etiquetas (sin números) */}
                        <div className="hidden text-right text-[11px] text-slate-600 sm:block">
                            <div className="font-semibold">{c.econLabel}</div>
                            <div className="mt-0.5">{c.socialLabel}</div>
                        </div>

                        {already && (
                            <div className="ml-2 rounded-full bg-[#0b1b3b]/10 px-3 py-1 text-[11px] font-extrabold text-[#0b1b3b]">
                            Ya en el mapa
                            </div>
                        )}
                        </label>
                    );
                    })}
                </div>

              {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-[12px] text-slate-600">
                    Seleccionados:{" "}
                    <span className="font-extrabold text-[#0b1b3b]">
                        {effectiveSelectedKeys.size}
                    </span>
                    </div>

                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setSelectedKeys(new Set())}
                        className="inline-flex h-[40px] items-center justify-center rounded-full border border-slate-200 bg-white px-6 text-[12px] font-semibold text-[#0b1b3b] hover:bg-slate-50"
                    >
                        Quitar selección
                    </button>

                    <button
                        type="button"
                        onClick={addSelected}
                        className="inline-flex h-[40px] items-center justify-center rounded-full bg-[#0b1b3b] px-6 text-[12px] font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99]"
                    >
                        Añadir
                    </button>
                    </div>
                </div>
                </div>
            </div>
            </div>
        )}

      {/* Flecha volver arriba */}
        <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Volver arriba"
            className={`fixed bottom-6 right-6 z-[90] grid h-12 w-12 place-items-center rounded-full bg-[#0b1b3b] text-white shadow-lg transition-all duration-200 ${
            showTop ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-2"
            }`}
        >
            <span className="text-[18px] leading-none">↑</span>
        </button>
        </main>
    );
    }
