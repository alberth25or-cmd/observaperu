import type { Metadata } from "next";

const BASE_URL = "https://www.observaperu.com";

export const metadata: Metadata = {
  title: "Mapa ideológico",
  description:
    "Mapa ideológico de los candidatos presidenciales del Perú: posición en ejes económico y social.",
  openGraph: {
    title: "Mapa ideológico | Observa Perú",
    description:
      "Visualiza la posición ideológica de los candidatos presidenciales.",
    url: `${BASE_URL}/mapa-ideologico`,
  },
  alternates: { canonical: `${BASE_URL}/mapa-ideologico` },
};

export default function MapaIdeologicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
