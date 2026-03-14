import type { Metadata } from "next";
import { getNoticiaBySlug } from "@/data/articulos-noticias";

const BASE_URL = "https://www.observaperu.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const noticia = getNoticiaBySlug(slug);

  if (!noticia) {
    return { title: "Noticia no encontrada" };
  }

  const title = noticia.title;
  const description = noticia.metaDescription;
  const url = `${BASE_URL}/noticias/${slug}`;

  return {
    title,
    description,
    keywords: noticia.keywords,
    openGraph: {
      title: `${title} | Observa Perú`,
      description,
      url,
      siteName: "Observa Perú",
      type: "article",
      locale: "es_PE",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Observa Perú`,
      description,
    },
    alternates: { canonical: url },
  };
}

export default function NoticiasSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
