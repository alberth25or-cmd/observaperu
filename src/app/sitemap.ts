import type { MetadataRoute } from "next";
import { ALL_CANDIDATES } from "@/data/candidatos";
import { getAllArticles } from "@/lib/mdx";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.observaperu.com";

  const staticPaths = [
    "",
    "/comparacion",
    "/mapa-ideologico",
    "/candidatos",
    "/estadisticas",
    "/analisis",
    "/noticias",
    "/conocenos",
    "/contactanos",
  ];

  const staticUrls = staticPaths.map((path) => ({
    url: path ? `${baseUrl}${path}` : baseUrl,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

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
