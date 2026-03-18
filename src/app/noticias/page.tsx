import Link from "next/link";
import {
  getAllNoticiasSlugs,
  getNoticiaBySlug,
} from "@/data/articulos-noticias";
import Footer from "@/components/Footer";

const Banner = ({
  title,
  bg = "/hero-bg1.jpg",
}: {
  title: string;
  bg?: string;
}) => (
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

export default function NoticiasPage() {
  const slugs = getAllNoticiasSlugs();
  const noticias = slugs
    .map((slug) => getNoticiaBySlug(slug))
    .filter((n): n is NonNullable<typeof n> => n != null);

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      <Banner title="Noticias" bg="/hero-bg1.jpg" />

      <section className="py-10 sm:py-14">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <p className="mx-auto max-w-2xl text-center text-[16px] leading-relaxed text-slate-700 sm:text-[18px]">
            Noticias y coyuntura electoral con contexto: candidatos, partidos,
            JNE, ONPE y elecciones presidenciales.
          </p>

          {noticias.length > 0 && (
            <div className="mt-12">
              <h2 className="mb-6 text-[20px] font-bold text-[#0b1b3b]">
                Últimas noticias
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {noticias.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/noticias/${n.slug}`}
                    className="rounded-2xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <h3 className="text-[18px] font-bold text-[#0b1b3b]">
                      {n.title}
                    </h3>
                    <p className="mt-2 line-clamp-3 text-[14px] text-slate-600">
                      {n.metaDescription}
                    </p>
                    <span className="mt-4 inline-block text-[14px] font-semibold text-[#0b1b3b]">
                      Leer noticia →
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <h2 className="mb-6 mt-12 text-[20px] font-bold text-[#0b1b3b]">
            Explora más
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/candidatos"
              className="rounded-2xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-[18px] font-bold text-[#0b1b3b]">
                Candidatos
              </h2>
              <p className="mt-2 text-[14px] text-slate-600">
                Perfiles, propuestas y planes de gobierno de cada candidato.
              </p>
              <span className="mt-4 inline-block text-[14px] font-semibold text-[#0b1b3b]">
                Ver candidatos →
              </span>
            </Link>
            <Link
              href="/analisis"
              className="rounded-2xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-[18px] font-bold text-[#0b1b3b]">Análisis</h2>
              <p className="mt-2 text-[14px] text-slate-600">
                Análisis y opinión crítica sobre propuestas y coyuntura
                electoral.
              </p>
              <span className="mt-4 inline-block text-[14px] font-semibold text-[#0b1b3b]">
                Ver análisis →
              </span>
            </Link>
            <Link
              href="/estadisticas"
              className="rounded-2xl bg-white p-6 shadow-md transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
            >
              <h2 className="text-[18px] font-bold text-[#0b1b3b]">
                Estadísticas
              </h2>
              <p className="mt-2 text-[14px] text-slate-600">
                Indicadores y datos comparativos de los candidatos.
              </p>
              <span className="mt-4 inline-block text-[14px] font-semibold text-[#0b1b3b]">
                Ver estadísticas →
              </span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
