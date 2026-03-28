import type { Metadata } from "next";

const BASE_URL = "https://www.observaperu.com";
const PAGE_URL = `${BASE_URL}/analisis`;

export const metadata: Metadata = {
  title: "Análisis electoral Perú 2026",
  description:
    "Análisis independiente sobre las elecciones presidenciales del Perú 2026: candidatos, propuestas, encuestas, debates JNE y coyuntura política con datos verificados.",
  keywords: [
    "análisis electoral Perú 2026",
    "análisis candidatos presidenciales Perú",
    "análisis debate JNE 2026",
    "análisis encuesta presidencial Perú",
    "coyuntura electoral Perú 2026",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: PAGE_URL,
    siteName: "Observa Perú",
    title: "Análisis electoral Perú 2026 | Observa Perú",
    description:
      "Análisis independiente sobre candidatos, encuestas y debates presidenciales en Perú.",
    images: [{ url: "/LogoObserva.png", width: 1200, height: 630, alt: "Análisis electoral Perú 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Análisis electoral Perú 2026 | Observa Perú",
    description:
      "Análisis con datos sobre candidatos, encuestas y debates presidenciales.",
  },
  alternates: { canonical: PAGE_URL },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Análisis electoral Perú 2026",
  description: "Artículos de análisis independiente sobre las elecciones presidenciales del Perú 2026.",
  url: PAGE_URL,
  inLanguage: "es-PE",
  isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Observa Perú" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Análisis", item: PAGE_URL },
    ],
  },
};

export default function AnalisisLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
