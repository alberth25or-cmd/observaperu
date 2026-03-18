import type { Metadata } from "next";

const BASE_URL = "https://www.observaperu.com";

export const metadata: Metadata = {
  title: "Candidatos",
  description:
    "Listado de candidatos presidenciales del Perú. Conoce biografía, propuestas, partido e ideología de cada candidato.",
  openGraph: {
    title: "Candidatos presidenciales | Observa Perú",
    description:
      "Listado de candidatos presidenciales con perfiles y propuestas.",
    url: `${BASE_URL}/candidatos`,
  },
  alternates: { canonical: `${BASE_URL}/candidatos` },
};

export default function CandidatosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
