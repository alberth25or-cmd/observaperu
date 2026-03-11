import type { MetadataRoute } from "next";
import { ALL_CANDIDATES } from "@/data/candidatos";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.observaperu.com";
  const staticPaths = [
    "",
    "/comparacion",
    "/mapa-ideologico",
    "/candidatos",
    "/estadisticas",
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
  return [...staticUrls, ...candidateUrls];
}
