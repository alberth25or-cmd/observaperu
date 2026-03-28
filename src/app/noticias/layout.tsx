import type { Metadata } from "next";

const BASE_URL = "https://www.observaperu.com";
const PAGE_URL = `${BASE_URL}/noticias`;

export const metadata: Metadata = {
  title: "Noticias electorales Perú 2026",
  description:
    "Últimas noticias sobre las elecciones presidenciales del Perú 2026: candidatos, partidos políticos, JNE, encuestas y coyuntura electoral con contexto y análisis.",
  keywords: [
    "noticias elecciones Perú 2026",
    "noticias candidatos presidenciales Perú",
    "noticias JNE 2026",
    "últimas noticias elecciones Peru",
    "noticias campaña presidencial Perú 2026",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: PAGE_URL,
    siteName: "Observa Perú",
    title: "Noticias electorales Perú 2026 | Observa Perú",
    description:
      "Últimas noticias sobre candidatos, JNE, encuestas y coyuntura de las elecciones 2026.",
    images: [{ url: "/LogoObserva.png", width: 1200, height: 630, alt: "Noticias electorales Perú 2026" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Noticias electorales Perú 2026 | Observa Perú",
    description:
      "Noticias sobre candidatos, partidos, JNE y coyuntura electoral en Perú.",
  },
  alternates: { canonical: PAGE_URL },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Noticias electorales Perú 2026",
  description: "Noticias y cobertura de las elecciones presidenciales del Perú 2026.",
  url: PAGE_URL,
  inLanguage: "es-PE",
  isPartOf: { "@type": "WebSite", url: BASE_URL, name: "Observa Perú" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Noticias", item: PAGE_URL },
    ],
  },
};

export default function NoticiasLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      {children}
    </>
  );
}
