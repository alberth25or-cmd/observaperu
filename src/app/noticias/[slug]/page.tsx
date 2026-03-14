import Link from "next/link";
import { notFound } from "next/navigation";
import { getNoticiaBySlug } from "@/data/articulos-noticias";
import Footer from "@/components/Footer";
import Electorado2026Chart from "@/components/noticias/Electorado2026Chart";

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
    <div className="relative mx-auto flex min-h-[90px] max-w-6xl items-center justify-center px-4 py-8 lg:px-16">
      <h1 className="text-center text-[24px] font-extrabold leading-[120%] tracking-[-0.02em] text-white sm:text-[32px] lg:text-[36px]">
        {title}
      </h1>
    </div>
  </section>
);

export default async function NoticiasSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const noticia = getNoticiaBySlug(slug);

  if (!noticia) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      <Banner title={noticia.title} bg="/hero-bg1.jpg" />

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 lg:px-16">
          <article className="prose prose-slate max-w-none">
            {noticia.sections.map((section, idx) => (
              <div key={idx} className="mb-10">
                <h2 className="mb-4 text-[22px] font-extrabold leading-tight text-[#0b1b3b] sm:text-[24px]">
                  {section.h2}
                </h2>
                <div className="space-y-4">
                  {section.content.map((block, blockIdx) => {
                    if (block.type === "p") {
                      return (
                        <p
                          key={blockIdx}
                          className="text-[16px] leading-[175%] text-slate-700 sm:text-[17px]"
                        >
                          {block.text}
                        </p>
                      );
                    }
                    if (block.type === "h3") {
                      return (
                        <h3
                          key={blockIdx}
                          className="mt-6 text-[18px] font-bold text-[#0b1b3b] sm:text-[19px]"
                        >
                          {block.text}
                        </h3>
                      );
                    }
                    if (block.type === "ul") {
                      return (
                        <ul
                          key={blockIdx}
                          className="list-inside list-disc space-y-2 text-[16px] leading-[175%] text-slate-700 sm:text-[17px]"
                        >
                          {block.items.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      );
                    }
                    if (block.type === "chart" && block.chartId === "electorado-2026") {
                      return <Electorado2026Chart key={blockIdx} />;
                    }
                    if (block.type === "link") {
                      return (
                        <p key={blockIdx}>
                          <a
                            href={block.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 rounded-lg bg-[#0b1b3b] px-4 py-2.5 text-[15px] font-semibold text-white transition-colors hover:bg-[#1b2b5a]"
                          >
                            {block.label}
                            <span className="text-white/80" aria-hidden>↗</span>
                          </a>
                        </p>
                      );
                    }
                    if (block.type === "pdf") {
                      return (
                        <p key={blockIdx}>
                          <a
                            href={block.href}
                            download
                            className="inline-flex items-center gap-2 rounded-lg border-2 border-[#0b1b3b] bg-white px-4 py-2.5 text-[15px] font-semibold text-[#0b1b3b] transition-colors hover:bg-[#0b1b3b] hover:text-white"
                          >
                            <span aria-hidden>📄</span>
                            {block.label}
                          </a>
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
            ))}
          </article>

          <hr className="my-12 border-slate-200" />

          <h2 className="mb-4 text-[20px] font-bold text-[#0b1b3b]">
            Fuentes
          </h2>
          <p className="mb-6 text-[14px] text-slate-600">
            Información basada en fuentes oficiales.
          </p>
          <ol className="list-decimal space-y-3 pl-5 text-[14px] leading-relaxed text-slate-700">
            {noticia.references.map((ref, i) => (
              <li key={i} className="pl-1">
                {ref}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-3xl px-4 lg:px-16">
          <Link
            href="/noticias"
            className="inline-flex items-center gap-2 text-[15px] font-semibold text-[#0b1b3b] hover:underline"
          >
            ← Volver a Noticias
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
