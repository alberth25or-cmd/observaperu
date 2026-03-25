import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Asegura que los archivos MDX en /content/ se incluyan
  // en el bundle de Vercel (serverless functions).
  outputFileTracingIncludes: {
    "/noticias/[slug]": ["./content/noticias/**/*.mdx"],
    "/analisis/[slug]": ["./content/analisis/**/*.mdx"],
  },
};

export default nextConfig;
