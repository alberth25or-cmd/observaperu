import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";
import HeroInmersion from "@/components/hero/HeroInmersion";
import Revelar from "@/components/Revelar";
import Parallax from "@/components/Parallax";
import Contador from "@/components/Contador";
import EscenarioServicios from "@/components/secciones/EscenarioServicios";
import RielProceso from "@/components/secciones/RielProceso";
import FichaProgresiva from "@/components/secciones/FichaProgresiva";

export const metadata: Metadata = {
  title: "Estudios de mercado hechos por estadísticos",
  description:
    "Encuestas, estudios de mercado y asesoría estadística para empresas e investigadores. Trabajo de campo en Lima y, según el estudio, en otras regiones. Cada estudio con su ficha técnica.",
  alternates: { canonical: "https://www.observaperu.com" },
};




const experiencia: [string, string][] = [
  ["36", "candidatos presidenciales perfilados con datos del JNE"],
  ["35", "planes de gobierno reunidos en un solo lugar"],
  ["22 h", "de debate medidas, en 6 jornadas"],
];

export default function HomePage() {
  return (
    <main>
      <HeroInmersion />

      <EscenarioServicios />

      <RielProceso />

      <FichaProgresiva />

      {/* ── Experiencia ──────────────────────────────────────── */}
      <section id="experiencia" className="overflow-hidden bg-navy text-white">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-28">
          <Revelar>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold">
              Experiencia
            </p>
            <h2 className="mt-5 max-w-3xl font-display text-[32px] font-bold leading-tight sm:text-[40px]">
              Revisa nuestro trabajo antes de contratarnos
            </h2>
            <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/70">
              Para las elecciones generales de 2026 analizamos, por iniciativa
              propia, a todas las candidaturas presidenciales. Medimos en los
              debates quién habló más y a quién atacó, y mostramos qué
              diferencias en las encuestas estaban dentro del margen de error.
              Todo sigue publicado.
            </p>
          </Revelar>

          <dl className="tabular mt-14 grid gap-10 border-t border-white/15 pt-10 sm:grid-cols-3">
            {/* Cada columna sube a distinta velocidad: la fila se desalinea
                y se recompone sola al atravesar la pantalla. */}
            {experiencia.map(([n, t], i) => (
              <Parallax key={t} velocidad={-0.05 - i * 0.07}>
                <Revelar retraso={i * 130}>
                  <dt className="font-display text-[44px] font-bold leading-none text-gold">
                    <Contador valor={n} />
                  </dt>
                  <dd className="mt-3 text-[15.5px] leading-relaxed text-white/65">
                    {t}
                  </dd>
                </Revelar>
              </Parallax>
            ))}
          </dl>

          <Revelar retraso={200}>
            <Link
              href="/elecciones"
              className="mt-12 inline-flex items-center gap-2 font-display text-[16px] font-semibold text-white underline decoration-gold decoration-2 underline-offset-[6px] transition-colors hover:text-gold"
            >
              Ver el trabajo electoral 2026
            </Link>
          </Revelar>
        </div>
      </section>

      {/* ── Equipo ───────────────────────────────────────────── */}
      <section id="equipo" className="overflow-hidden bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 lg:px-10 lg:py-28">
          <Parallax velocidad={-0.08}>
            <Revelar>
              <h2 className="font-display text-[32px] font-bold leading-tight sm:text-[40px]">
                La investigación seria no debería estar reservada a los
                presupuestos grandes
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-navy/75">
                Somos estadísticos formados en la Universidad Nacional Mayor de
                San Marcos. Una agencia de marketing sabe vender una idea; para
                saber si esa idea se sostiene hace falta un estadístico.
              </p>
            </Revelar>
          </Parallax>
        </div>
      </section>

      {/* ── Cuéntanos tu proyecto ────────────────────────────── */}
      <section id="contacto" className="overflow-hidden bg-hueso">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-10 lg:py-28">
          <Revelar>
            <h2 className="font-display text-[32px] font-bold leading-tight sm:text-[40px]">
              Cuéntanos qué decisión tienes que tomar
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-navy/75">
              Escríbenos qué necesitas saber y te respondemos en menos de 48
              horas con una propuesta inicial.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Link
                href="https://wa.me/51931370624?text=Hola%2C%20quiero%20una%20propuesta%20para%20un%20estudio"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full items-center justify-center rounded-lg bg-navy px-7 py-3.5 font-display text-[16px] font-semibold text-white transition-colors hover:bg-navy-900 sm:w-auto"
              >
                Pedir propuesta por WhatsApp
              </Link>
            </div>
            <p className="mt-8 text-[15px] leading-relaxed text-navy/60">
              También trabajamos con instituciones y ONG. Si estás haciendo tu
              tesis, mira la{" "}
              <Link
                href="/tesistas"
                className="font-semibold text-navy underline decoration-gold decoration-2 underline-offset-4"
              >
                asesoría para tesistas
              </Link>
              .
            </p>
          </Revelar>
        </div>
      </section>

      <Footer />
    </main>
  );
}
