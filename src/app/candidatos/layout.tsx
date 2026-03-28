import type { Metadata } from "next";

const BASE_URL = "https://www.observaperu.com";
const PAGE_URL = `${BASE_URL}/candidatos`;

export const metadata: Metadata = {
  title: "Candidatos presidenciales Perú 2026",
  description:
    "Directorio completo de candidatos presidenciales de las elecciones generales del Perú 2026: biografía, partido político, propuestas, ideología y trayectoria. Más de 30 perfiles detallados.",
  keywords: [
    "candidatos presidenciales Perú 2026",
    "elecciones presidenciales Perú 2026",
    "Keiko Fujimori candidato",
    "López Aliaga candidato",
    "partidos políticos Perú 2026",
    "propuestas presidenciales Perú",
    "JNE candidatos inscritos 2026",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: PAGE_URL,
    siteName: "Observa Perú",
    title: "Candidatos presidenciales Perú 2026 | Observa Perú",
    description:
      "Perfiles completos de los candidatos presidenciales: partido, ideología, propuestas y trayectoria política.",
    images: [{ url: "/LogoObserva.png", width: 1200, height: 630, alt: "Candidatos presidenciales Perú 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Candidatos presidenciales Perú 2026 | Observa Perú",
    description:
      "Perfiles detallados de todos los candidatos: partido, propuestas e ideología.",
  },
  alternates: { canonical: PAGE_URL },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Candidatos presidenciales Perú 2026",
  description: "Directorio de candidatos presidenciales inscritos para las elecciones generales del Perú 2026.",
  url: PAGE_URL,
  inLanguage: "es-PE",
  isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Observa Perú" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Candidatos", item: PAGE_URL },
    ],
  },
};

export default function CandidatosLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
