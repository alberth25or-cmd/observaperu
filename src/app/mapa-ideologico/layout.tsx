import type { Metadata } from "next";

const BASE_URL = "https://www.observaperu.com";
const PAGE_URL = `${BASE_URL}/mapa-ideologico`;

export const metadata: Metadata = {
  title: "Mapa ideológico candidatos presidenciales 2026",
  description:
    "Visualización interactiva de la posición ideológica de los candidatos presidenciales del Perú 2026: eje económico (libre mercado vs. intervencionismo) y eje social (conservador vs. progresista).",
  keywords: [
    "mapa ideológico candidatos Perú 2026",
    "ideología candidatos presidenciales Perú",
    "posición política candidatos Perú 2026",
    "izquierda derecha candidatos Perú",
    "espectro político elecciones Perú 2026",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: PAGE_URL,
    siteName: "Observa Perú",
    title: "Mapa ideológico candidatos presidenciales Perú 2026 | Observa Perú",
    description:
      "Plano político interactivo: posición ideológica de los candidatos presidenciales en ejes económico y social.",
    images: [{ url: "/LogoObserva.png", width: 1200, height: 630, alt: "Mapa ideológico candidatos Perú 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapa ideológico candidatos Perú 2026 | Observa Perú",
    description:
      "¿Dónde están ideológicamente los candidatos presidenciales? Visualización interactiva.",
  },
  alternates: { canonical: PAGE_URL },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Mapa ideológico candidatos presidenciales Perú 2026",
  description: "Visualización de la posición ideológica de los candidatos presidenciales del Perú 2026 en ejes económico y social.",
  url: PAGE_URL,
  inLanguage: "es-PE",
  isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Observa Perú" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Mapa ideológico", item: PAGE_URL },
    ],
  },
};

export default function MapaIdeologicoLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
