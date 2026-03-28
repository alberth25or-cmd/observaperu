import type { MetadataRoute } from "next";
import { ALL_CANDIDATES } from "@/data/candidatos";
import { getAllArticles } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.observaperu.com";

  type SitemapEntry = {
    url: string;
    lastModified: Date;
    changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
    priority: number;
  };

  const staticUrls: SitemapEntry[] = [
    { url: baseUrl,                        lastModified: new Date(), changeFrequency: "daily",   priority: 1.0 },
    { url: `${baseUrl}/estadisticas`,      lastModified: new Date(), changeFrequency: "daily",   priority: 0.95 },
    { url: `${baseUrl}/candidatos`,        lastModified: new Date(), changeFrequency: "weekly",  priority: 0.9 },
    { url: `${baseUrl}/noticias`,          lastModified: new Date(), changeFrequency: "daily",   priority: 0.9 },
    { url: `${baseUrl}/analisis`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.85 },
    { url: `${baseUrl}/mapa-ideologico`,   lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/comparacion`,       lastModified: new Date(), changeFrequency: "weekly",  priority: 0.8 },
    { url: `${baseUrl}/conocenos`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contactanos`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  const candidateUrls = ALL_CANDIDATES.map((c) => ({
    url: `${baseUrl}/candidatos/${c.key}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const analisisUrls = getAllArticles("analisis").map((a) => ({
    url: `${baseUrl}/analisis/${a.slug}`,
    lastModified: a.date ? new Date(a.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const noticiasUrls = getAllArticles("noticias").map((n) => ({
    url: `${baseUrl}/noticias/${n.slug}`,
    lastModified: n.date ? new Date(n.date) : new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  return [...staticUrls, ...candidateUrls, ...analisisUrls, ...noticiasUrls];
}
