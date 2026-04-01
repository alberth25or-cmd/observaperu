import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getArticleBySlug, getAllSlugs } from "@/lib/mdx";
import { mdxComponents } from "@/lib/mdx-components";
import Footer from "@/components/Footer";

// Pre-genera todas las páginas de noticias en build time.
// Esto hace las páginas estáticas (○) en lugar de dinámicas (ƒ),
// evita problemas de fs en Vercel y mejora el SEO/velocidad.
export function generateStaticParams() {
  return getAllSlugs("noticias").map((slug) => ({ slug }));
}

const BASE_URL = "https://www.observaperu.com";

const Banner = ({ title }: { title: string }) => (
  <section className="relative w-full overflow-hidden">
    <div
      className="absolute inset-0 bg-cover bg-center"
      style={{ backgroundImage: "url('/hero-bg1.jpg')" }}
    />
    <div className="absolute inset-0 bg-[#1f2f59]/75" />
    <div className="relative mx-auto flex min-h-[90px] max-w-6xl items-center justify-center px-4 py-8 lg:px-16">
      <h1 className="text-center text-[24px] font-extrabold leading-[120%] tracking-[-0.02em] text-white sm:text-[32px] lg:text-[36px]">
        {title}
      </h1>
    </div>
  </section>
);

function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  const months = [
    "enero", "febrero", "marzo", "abril", "mayo", "junio",
    "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
  ];
  return `${parseInt(d!, 10)} de ${months[parseInt(m!, 10) - 1]} de ${y}`;
}

export default async function NoticiasSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticleBySlug("noticias", slug);

  if (!article) notFound();

  const { frontmatter, content } = article;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: frontmatter.title,
    description: frontmatter.metaDescription,
    url: `${BASE_URL}/noticias/${slug}`,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: {
      "@type": "Organization",
      name: frontmatter.author ?? "Observa Perú",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Observa Perú",
      url: BASE_URL,
    },
    ...(frontmatter.image && { image: `${BASE_URL}${frontmatter.image}` }),
  };

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <Banner title={frontmatter.title} />

      <section className="bg-white py-10 sm:py-14">
        <div className="mx-auto max-w-3xl px-4 lg:px-6">
          {frontmatter.date && (
            <p className={`text-[14px] text-slate-500 ${frontmatter.bajada ? "mb-2" : "mb-6"}`}>
              Publicado el {formatDate(frontmatter.date)}
            </p>
          )}
          {frontmatter.bajada && (
            <p className="mb-8 text-[18px] font-medium leading-relaxed text-slate-600 sm:text-[19px]">
              {frontmatter.bajada}
            </p>
          )}

          <article>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdxComponents}>
              {content}
            </ReactMarkdown>
          </article>

          {frontmatter.references && frontmatter.references.length > 0 && (
            <>
              <hr className="my-12 border-slate-200" />
              <h2 className="mb-4 text-[20px] font-bold text-[#0b1b3b]">Fuentes</h2>
              <p className="mb-4 text-[14px] text-slate-600">
                Información basada en fuentes oficiales.
              </p>
              <ol className="list-decimal space-y-3 pl-5 text-[14px] leading-relaxed text-slate-700">
                {frontmatter.references.map((ref, i) => (
                  <li key={i} className="pl-1">{ref}</li>
                ))}
              </ol>
            </>
          )}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-slate-50 py-8">
        <div className="mx-auto max-w-3xl px-4 lg:px-6">
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
