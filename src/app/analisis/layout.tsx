import type { Metadata } from "next";

const BASE_URL = "https://www.observaperu.com";

export const metadata: Metadata = {
  title: "Análisis",
  description:
    "Análisis y opinión crítica sobre candidatos presidenciales, propuestas, encuestas y coyuntura electoral en el Perú.",
  openGraph: {
    title: "Análisis | Observa Perú",
    description: "Análisis y opinión sobre candidatos, propuestas y elecciones en Perú.",
    url: `${BASE_URL}/analisis`,
  },
  alternates: { canonical: `${BASE_URL}/analisis` },
};

export default function AnalisisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
