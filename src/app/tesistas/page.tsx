import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Asesoría estadística para tesis",
  description:
    "Te ayudamos con el diseño de tu muestra, el procesamiento de datos y el análisis estadístico de tu tesis. Explicado de forma que puedas defenderlo.",
  alternates: { canonical: "https://www.observaperu.com/tesistas" },
};

const WHATSAPP =
  "https://wa.me/51931370624?text=Hola%2C%20quiero%20ayuda%20con%20mi%20tesis";

const ayudas = [
  {
    titulo: "Diseño de la muestra",
    texto:
      "Cuántas personas necesitas encuestar, cómo seleccionarlas y cómo justificarlo en tu marco metodológico.",
  },
  {
    titulo: "Instrumento de recolección",
    texto:
      "Revisión de tu cuestionario: preguntas que midan lo que dices medir, escalas bien construidas y validación.",
  },
  {
    titulo: "Procesamiento de datos",
    texto:
      "Limpieza de tu base, codificación y tablas de resultados listas para insertar en el documento.",
  },
  {
    titulo: "Análisis estadístico",
    texto:
      "Pruebas de hipótesis, correlaciones, regresiones o el modelo que tu diseño requiera, con la interpretación escrita.",
  },
];

export default function TesistasPage() {
  return (
    <main>
      <section className="relative isolate overflow-hidden bg-navy text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-10 right-0 hidden h-[80%] w-[55%] bg-contain bg-right-bottom bg-no-repeat opacity-45 lg:block"
          style={{ backgroundImage: "url('/images/curva-normal.svg')" }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-gold">
            Para tesistas
          </p>
          <h1 className="mt-5 max-w-3xl font-display text-[38px] font-bold leading-[1.06] sm:text-[48px]">
            La parte estadística de tu tesis, resuelta
          </h1>
          <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-white/75">
            Te acompañamos con la muestra, el procesamiento y el análisis. Y te
            lo explicamos, porque en la sustentación vas a estar tú, no
            nosotros.
          </p>
          <Link
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center rounded-lg bg-gold px-7 py-3.5 font-display text-[16px] font-semibold text-navy transition-colors hover:bg-[#d8b95e]"
          >
            Cuéntanos de tu tesis
          </Link>
        </div>
      </section>

      <section className="bg-hueso">
        <div className="mx-auto max-w-6xl px-6 py-20 lg:px-10">
          <h2 className="font-display text-[30px] font-bold sm:text-[36px]">
            En qué te ayudamos
          </h2>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl bg-gris sm:grid-cols-2">
            {ayudas.map((a) => (
              <article key={a.titulo} className="bg-white p-8">
                <h3 className="font-display text-[19px] font-bold leading-snug">
                  {a.titulo}
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-navy/70">
                  {a.texto}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-14 rounded-2xl border border-gris bg-white p-8 lg:p-10">
            <h2 className="font-display text-[22px] font-bold sm:text-[26px]">
              Lo que no hacemos
            </h2>
            <p className="mt-4 max-w-2xl text-[16.5px] leading-relaxed text-navy/70">
              No redactamos tu tesis ni la sustentamos por ti. Trabajamos la
              parte estadística y te la dejamos entendida, con la metodología
              escrita de forma que puedas defenderla ante tu jurado.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-10">
          <h2 className="font-display text-[30px] font-bold sm:text-[36px]">
            Cuéntanos en qué punto estás
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-navy/70">
            Escríbenos con el tema de tu tesis y en qué etapa vas. Te decimos
            qué necesitas y cuánto cuesta, sin compromiso.
          </p>
          <Link
            href={WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-9 inline-flex items-center rounded-lg bg-navy px-7 py-3.5 font-display text-[16px] font-semibold text-white transition-colors hover:bg-navy-900"
          >
            Escríbenos
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
