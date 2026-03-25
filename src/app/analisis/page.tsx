import Link from "next/link";
import { getAllArticles } from "@/lib/mdx";
import Footer from "@/components/Footer";

const Banner = ({ title, bg = "/hero-bg1.jpg" }: { title: string; bg?: string }) => (
  <section className="relative w-full overflow-hidden">
    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${bg}')` }} />
    <div className="absolute inset-0 bg-[#1f2f59]/75" />
    <div className="relative mx-auto flex h-[90px] max-w-6xl items-center justify-center px-4 lg:px-16">
      <h1 className="text-center text-[28px] font-extrabold leading-[110%] tracking-[-0.02em] text-white sm:text-[36px]">
        {title}
      </h1>
    </div>
  </section>
);

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  return `${parseInt(d!, 10)} ${months[parseInt(m!, 10) - 1]} ${y}`;
}

export default function AnalisisPage() {
  const articulos = getAllArticles("analisis");

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      <Banner title="Análisis" bg="/hero-bg1.jpg" />

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <p className="mx-auto max-w-2xl text-center text-[16px] leading-relaxed text-slate-700 sm:text-[18px]">
            Análisis y opinión crítica sobre candidatos presidenciales, propuestas de gobierno, encuestas y coyuntura electoral.
          </p>

          {articulos.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-[20px] font-bold text-[#0b1b3b]">
                Artículos
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {articulos.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/analisis/${a.slug}`}
                    className="group flex flex-col rounded-2xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <div className="flex items-center justify-between mb-3">
                      {a.tags && a.tags[0] && (
                        <span className="rounded-full bg-[#eef2fb] px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#0b1b3b]">
                          {a.tags[0]}
                        </span>
                      )}
                      {a.date && (
                        <span className="text-[12px] text-slate-400 ml-auto">
                          {formatDate(a.date)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-[18px] font-bold text-[#0b1b3b] leading-snug group-hover:text-[#1b2b5a]">
                      {a.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[14px] text-slate-600 flex-1">
                      {a.metaDescription}
                    </p>
                    <span className="mt-4 inline-block text-[14px] font-semibold text-[#0b1b3b]">
                      Leer análisis →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {articulos.length === 0 && (
            <p className="mt-12 text-center text-[16px] text-slate-500">
              Próximamente nuevos artículos de análisis.
            </p>
          )}

          <h2 className="mb-6 mt-14 text-[20px] font-bold text-[#0b1b3b]">
            Explora más
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link href="/candidatos" className="rounded-2xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-[18px] font-bold text-[#0b1b3b]">Candidatos</h2>
              <p className="mt-2 text-[14px] text-slate-600">Conoce los perfiles, propuestas y planes de gobierno de cada candidato.</p>
              <span className="mt-4 inline-block text-[14px] font-semibold text-[#0b1b3b]">Ver candidatos →</span>
            </Link>
            <Link href="/mapa-ideologico" className="rounded-2xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-[18px] font-bold text-[#0b1b3b]">Mapa ideológico</h2>
              <p className="mt-2 text-[14px] text-slate-600">Explora la posición de los candidatos en los ejes económico y social.</p>
              <span className="mt-4 inline-block text-[14px] font-semibold text-[#0b1b3b]">Ver mapa →</span>
            </Link>
            <Link href="/comparacion" className="rounded-2xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
              <h2 className="text-[18px] font-bold text-[#0b1b3b]">Comparación</h2>
              <p className="mt-2 text-[14px] text-slate-600">Compara candidatos lado a lado por partido, propuestas e ideología.</p>
              <span className="mt-4 inline-block text-[14px] font-semibold text-[#0b1b3b]">Comparar →</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
