"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { ALL_CANDIDATES, Candidate } from "@/data/candidatos"; // Importación unificada

/** Mini-hero reutilizable */
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

/** Utilidad para normalizar strings */
function normalizeStr(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[–—-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Mapea coordenadas (-5..+5) a porcentaje para el plano */
function toPercent(econ: number, social: number) {
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
  const x = clamp(econ, -5, 5);
  const y = clamp(social, -5, 5);

  const PAD = 7; 
  const span = 100 - 2 * PAD;

  const px = ((x + 5) / 10) * span + PAD;
  const py = (1 - (y + 5) / 10) * span + PAD;

  return { x: px, y: py };
}

export default function MapaIdeologicoPage() {
  const [showTop, setShowTop] = useState(false);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set());

  // Estado inicial con candidatos sugeridos (usando la data real)
  const [mapCandidates, setMapCandidates] = useState<Candidate[]>(() => {
    return ALL_CANDIDATES.filter(c => 
      c.key === "roberto-helbert-sanchez-palomino" || 
      c.key === "alvaro-gonzalo-paz-de-la-barra-freigeiro"
    );
  });

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    const available: Candidate[] = [];
    const alreadyAdded: Candidate[] = [];

    for (const c of ALL_CANDIDATES) {
      if (query && !normalizeStr(`${c.name} ${c.party}`).includes(query)) continue;
      if (inMap.has(c.key)) alreadyAdded.push(c);
      else available.push(c);
    }
    return [...available, ...alreadyAdded];
  }, [q, inMap]);

  /** Agrupa candidatos en la misma coordenada para evitar que se tapen */
  const groups = useMemo(() => {
    const m = new Map<string, Candidate[]>();
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

  const removeFromMap = (candidateKey: string) => {
    setMapCandidates((prev) => prev.filter((c) => c.key !== candidateKey));
  };

  const clearMap = () => {
    setMapCandidates([]);
    setSelectedKeys(new Set());
  };

  const addSelected = () => {
    const toAdd = ALL_CANDIDATES.filter((c) => effectiveSelectedKeys.has(c.key));
    setMapCandidates((prev) => [...prev, ...toAdd]);
    setSelectedKeys(new Set());
    setOpen(false);
  };

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      <Banner title="Mapa Ideológico" />

      <section className="py-10 sm:py-12">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <div className="relative overflow-hidden rounded-3xl">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/congreso.jpg')" }} />
            <div className="absolute inset-0 bg-[#0b1b3b]/65" />
            <div className="relative px-6 py-10 text-center text-white/90">
              <p className="mx-auto max-w-4xl text-sm leading-[175%] sm:text-base">
                Explora la posición de cada figura en dimensiones económicas y sociales.
                Agrega candidatos para comparar su orientación y elimina los que no necesites.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <a href="/candidatos" className="rounded-full bg-white px-7 py-3 text-xs font-bold text-[#0b1b3b] transition hover:scale-105">
                  Revisar perfiles
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-8">
            <div className="relative flex items-center justify-between">
              <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-black text-[#0b1b3b] sm:text-2xl">
                Plano ideológico
              </h2>
              <div className="ml-auto flex gap-3">
                <button onClick={() => setOpen(true)} className="rounded-full bg-[#0b1b3b] px-6 py-2 text-xs font-bold text-white transition hover:scale-105">
                  Agregar
                </button>
                <button onClick={clearMap} className="rounded-full border border-slate-200 px-6 py-2 text-xs font-bold text-[#0b1b3b] transition hover:scale-105">
                  Limpiar
                </button>
              </div>
            </div>

            <div className="mt-6">
              <div className="relative h-[520px] w-full rounded-2xl bg-[#d9d9d9]">
                {/* Ejes */}
                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-[#0b1b3b]/20" />
                <div className="absolute left-0 top-1/2 h-[1px] w-full bg-[#0b1b3b]/20" />

                {/* Etiquetas de los cuadrantes */}
                <span className="absolute left-1/2 top-3 -translate-x-1/2 text-[10px] font-bold text-[#0b1b3b] uppercase">Conservador</span>
                <span className="absolute left-1/2 bottom-3 -translate-x-1/2 text-[10px] font-bold text-[#0b1b3b] uppercase">Progresista</span>
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#0b1b3b] uppercase">Izquierda</span>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[#0b1b3b] uppercase">Derecha</span>

                {groups.map((g) => {
                  const center = toPercent(g.econ, g.social);
                  const R = 20; // Espaciado para colisiones

                  return (
                    <div key={`${g.econ}|${g.social}`} className="absolute" style={{ left: `${center.x}%`, top: `${center.y}%` }}>
                      {g.items.map((c, idx) => {
                        const angle = (2 * Math.PI * idx) / Math.max(g.items.length, 1);
                        const dx = g.items.length === 1 ? 0 : Math.round(R * Math.cos(angle));
                        const dy = g.items.length === 1 ? 0 : Math.round(R * Math.sin(angle));

                        return (
                          <div key={c.key} className="group absolute z-10 hover:z-[100]" style={{ transform: `translate(${dx}px, ${dy}px)` }}>
                            <div className="pointer-events-none absolute bottom-12 left-1/2 hidden w-40 -translate-x-1/2 rounded-lg bg-[#0b1b3b] p-2 text-[10px] text-white shadow-xl group-hover:block">
                              <p className="font-bold">{c.name}</p>
                              <p className="opacity-80">{c.party}</p>
                            </div>
                            <div className="relative -translate-x-1/2 -translate-y-1/2">
                              <div className="h-10 w-10 overflow-hidden rounded-full border-2 border-white bg-slate-200 shadow-md">
                                <Image src={c.img} alt={c.name} fill className="object-cover" />
                              </div>
                              <button onClick={() => removeFromMap(c.key)} className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white ring-2 ring-white">
                                <span className="block h-0.5 w-2.5 bg-white" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
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

      {/* Modal de Selección */}
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-black text-[#0b1b3b]">Añadir candidatos</h3>
              <button onClick={() => setOpen(false)} className="text-sm font-bold text-slate-400">Cerrar</button>
            </div>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar candidato..."
              className="mb-4 w-full rounded-full bg-slate-100 px-5 py-3 text-sm outline-none focus:ring-2 focus:ring-[#0b1b3b]"
            />
            <div className="max-h-60 overflow-y-auto rounded-xl border border-slate-100">
              {listFiltered.map((c) => (
                <label key={c.key} className={`flex items-center gap-3 p-3 transition ${inMap.has(c.key) ? 'bg-slate-50 opacity-50' : 'hover:bg-slate-50'}`}>
                  <input
                    type="checkbox"
                    disabled={inMap.has(c.key)}
                    checked={effectiveSelectedKeys.has(c.key)}
                    onChange={(e) => {
                      const next = new Set(selectedKeys);
                      if (e.target.checked) next.add(c.key);
                      else next.delete(c.key);
                      setSelectedKeys(next);
                    }}
                  />
                  <div className="h-8 w-8 overflow-hidden rounded-full relative">
                    <Image src={c.img} alt={c.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-bold text-[#0b1b3b]">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.party}</p>
                  </div>
                </label>
              ))}
            </div>
            <button onClick={addSelected} className="mt-6 w-full rounded-full bg-[#0b1b3b] py-3 text-sm font-bold text-white transition hover:scale-105">
              Añadir seleccionados ({effectiveSelectedKeys.size})
            </button>
          </div>
        </div>
      )}

      {/* Botón flotante para subir */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#0b1b3b] text-white shadow-lg transition-all ${showTop ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
      >
      </button>
    </main>
  );
}