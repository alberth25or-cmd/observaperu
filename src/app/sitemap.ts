import type { MetadataRoute } from "next";
import { ALL_CANDIDATES } from "@/data/candidatos";
import { getAllAnalisisSlugs } from "@/data/articulos-analisis";

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
  const analisisUrls = getAllAnalisisSlugs().map((slug) => ({
    url: `${baseUrl}/analisis/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));
  return [...staticUrls, ...candidateUrls, ...analisisUrls];
}
