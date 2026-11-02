import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Elecciones Generales 2026",
  description:
    "La plataforma de información electoral que Observa Perú construyó y mantuvo durante las elecciones generales de 2026: perfiles de candidatos, análisis y estadísticas.",
  alternates: { canonical: "https://www.observaperu.com/elecciones" },
};

const secciones = [
  {
    href: "/candidatos",
    titulo: "Perfiles de candidatos",
    texto:
      "36 candidatos presidenciales con biografía, trayectoria, plan de gobierno y antecedentes, con datos del JNE.",
  },
  {
    href: "/estadisticas",
    titulo: "Estadísticas del proceso",
    texto:
      "Edad, origen territorial, formación académica y antecedentes electorales del conjunto de candidaturas.",
  },
  {
    href: "/mapa-ideologico",
    titulo: "Mapa ideológico",
    texto:
      "Ubicación de cada candidatura en el plano político, a partir de sus propias propuestas documentadas.",
  },
  {
    href: "/comparacion",
    titulo: "Comparación",
    texto:
      "Los perfiles puestos lado a lado para contrastar propuestas y trayectorias.",
  },
  {
    href: "/analisis",
    titulo: "Análisis",
    texto:
      "Artículos de fondo sobre el proceso electoral, con referencias citadas.",
  },
  {
    href: "/noticias",
    titulo: "Noticias",
    texto:
      "Cobertura de las reglas del proceso: calendario, multas, miembros de mesa y trámites.",
  },
];

export default function EleccionesPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-cover bg-right opacity-30 lg:opacity-70"
          style={{ backgroundImage: "url('/images/capa-elecciones.webp')" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-navy via-navy/90 to-navy/30"
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            Trabajo realizado
          </p>
          <h1 className="mt-5 max-w-4xl font-display text-[38px] font-bold leading-[1.06] sm:text-[48px]">
            Elecciones Generales 2026
          </h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-white/75">
            Durante el proceso electoral de 2026 construimos y mantuvimos una
            plataforma pública de información sobre las candidaturas
            presidenciales. Todo lo que publicamos sigue disponible, con sus
            fuentes, para quien quiera revisarlo.
          </p>
          <p className="mt-5 max-w-2xl text-[17px] leading-relaxed text-white/55">
            Es el mismo criterio metodológico que aplicamos hoy en los estudios
            que hacemos por encargo.
          </p>
        </div>
      </section>

      <section className="bg-hueso">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <div className="grid gap-px overflow-hidden rounded-2xl bg-gris sm:grid-cols-2 lg:grid-cols-3">
            {secciones.map((s) => (
              <Link
                key={s.href}
                href={s.href}
                className="group bg-white p-8 transition-colors hover:bg-white/60"
              >
                <h2 className="font-display text-[20px] font-bold leading-snug group-hover:text-gold-dark">
                  {s.titulo}
                </h2>
                <p className="mt-3 text-[15.5px] leading-relaxed text-navy/70">
                  {s.texto}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-16 rounded-2xl border border-gris bg-white p-8 text-center lg:p-10">
            <h2 className="font-display text-[24px] font-bold sm:text-[28px]">
              ¿Necesitas un estudio para tu organización?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16.5px] leading-relaxed text-navy/70">
              Hacemos encuestas, estudios de mercado y asesoría estadística con
              el mismo rigor que ves en este trabajo.
            </p>
            <Link
              href="https://wa.me/51931370624?text=Hola%2C%20quiero%20una%20propuesta%20para%20un%20estudio"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center rounded-lg bg-navy px-7 py-3.5 font-display text-[16px] font-semibold text-white transition-colors hover:bg-navy-900"
            >
              Cuéntanos tu proyecto
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
