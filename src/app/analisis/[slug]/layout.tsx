import type { Metadata } from "next";
import { getArticuloBySlug } from "@/data/articulos-analisis";

const BASE_URL = "https://www.observaperu.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const articulo = getArticuloBySlug(slug);

  if (!articulo) {
    return { title: "Artículo no encontrado" };
  }

  const title = articulo.title;
  const description = articulo.metaDescription;
  const url = `${BASE_URL}/analisis/${slug}`;

  return {
    title,
    description,
    keywords: articulo.keywords,
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

export default function AnalisisSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
