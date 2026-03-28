import type { Metadata } from "next";

const BASE_URL = "https://www.observaperu.com";
const PAGE_URL = `${BASE_URL}/comparacion`;

export const metadata: Metadata = {
  title: "Comparar candidatos presidenciales Perú 2026",
  description:
    "Compara lado a lado a los candidatos presidenciales del Perú 2026: propuestas de gobierno, partido político, ideología, trayectoria y posición en temas clave.",
  keywords: [
    "comparar candidatos presidenciales Perú 2026",
    "comparativo candidatos elecciones Perú",
    "propuestas candidatos Perú 2026",
    "diferencias candidatos presidenciales Perú",
    "planes de gobierno Perú 2026",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: PAGE_URL,
    siteName: "Observa Perú",
    title: "Comparar candidatos presidenciales Perú 2026 | Observa Perú",
    description:
      "Compara propuestas, ideología y trayectoria de los candidatos presidenciales peruanos.",
    images: [{ url: "/LogoObserva.png", width: 1200, height: 630, alt: "Comparar candidatos Perú 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Comparar candidatos presidenciales Perú 2026 | Observa Perú",
    description:
      "Compara lado a lado propuestas, partidos e ideología de los candidatos presidenciales.",
  },
  alternates: { canonical: PAGE_URL },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Comparar candidatos presidenciales Perú 2026",
  description: "Herramienta de comparación de candidatos presidenciales de las elecciones generales del Perú 2026.",
  url: PAGE_URL,
  inLanguage: "es-PE",
  isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Observa Perú" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Comparación", item: PAGE_URL },
    ],
  },
};

export default function ComparacionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
