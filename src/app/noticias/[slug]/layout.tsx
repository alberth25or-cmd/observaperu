import type { Metadata } from "next";
import { getArticleBySlug } from "@/lib/mdx";

const BASE_URL = "https://www.observaperu.com";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug("noticias", slug);

  if (!article) {
    return { title: "Noticia no encontrada" };
  }

  const { frontmatter } = article;
  const url = `${BASE_URL}/noticias/${slug}`;

  return {
    title: frontmatter.title,
    description: frontmatter.metaDescription,
    keywords: frontmatter.keywords,
    openGraph: {
      title: `${frontmatter.title} | Observa Perú`,
      description: frontmatter.metaDescription,
      url,
      siteName: "Observa Perú",
      type: "article",
      locale: "es_PE",
      ...(frontmatter.date && { publishedTime: frontmatter.date }),
      ...(frontmatter.image && { images: [{ url: `${BASE_URL}${frontmatter.image}` }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${frontmatter.title} | Observa Perú`,
      description: frontmatter.metaDescription,
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
