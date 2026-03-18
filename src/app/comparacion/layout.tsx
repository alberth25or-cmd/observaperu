import type { Metadata } from "next";

const BASE_URL = "https://www.observaperu.com";

export const metadata: Metadata = {
  title: "Comparar candidatos",
  description:
    "Compara a los candidatos presidenciales del Perú: propuestas, partidos, ideología y planes de gobierno lado a lado.",
  openGraph: {
    title: "Comparar candidatos | Observa Perú",
    description:
      "Compara candidatos presidenciales: propuestas, partidos e ideología.",
    url: `${BASE_URL}/comparacion`,
  },
  alternates: { canonical: `${BASE_URL}/comparacion` },
};

export default function ComparacionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
