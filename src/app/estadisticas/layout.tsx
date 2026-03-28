import type { Metadata } from "next";

const BASE = "https://www.observaperu.com";
const PAGE_URL = `${BASE}/estadisticas`;

export const metadata: Metadata = {
  title: {
    absolute: "Estadísticas electorales Perú 2026 | Observa Perú",
  },
  description:
    "Datos actualizados de las elecciones presidenciales Perú 2026: encuesta Ipsos (22 mar, n=1 203), intención de voto por NSE y región, simulacro de votación, análisis de debates JNE y perfil demográfico de los candidatos.",
  keywords: [
    "estadísticas elecciones Perú 2026",
    "encuesta presidencial Perú 2026",
    "intención de voto Perú 2026",
    "Keiko Fujimori encuesta 2026",
    "López Aliaga encuesta 2026",
    "debate JNE 2026 estadísticas",
    "simulacro votación Perú 2026",
    "Ipsos Perú encuesta presidencial",
    "candidatos presidenciales Perú 2026",
    "análisis debate presidencial Perú",
  ],
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: PAGE_URL,
    siteName: "Observa Perú",
    title:
      "Estadísticas electorales Perú 2026 — encuestas, debates y candidatos",
    description:
      "Encuesta Ipsos (22 mar 2026): Keiko 11%, López Aliaga 10%. Simulacro por regiones, análisis de los 3 debates JNE y perfil demográfico de candidatos.",
    images: [
      {
        url: "/LogoObserva.png",
        width: 1200,
        height: 630,
        alt: "Estadísticas electorales Perú 2026 — Observa Perú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Estadísticas electorales Perú 2026 — Observa Perú",
    description:
      "Encuesta Ipsos, simulacro regional, análisis de debates JNE y datos de los candidatos presidenciales.",
  },
  alternates: { canonical: PAGE_URL },
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Estadísticas electorales Perú 2026",
  description:
    "Análisis estadístico de candidatos, encuestas de intención de voto y debates presidenciales de las elecciones generales del Perú 2026.",
  url: PAGE_URL,
  inLanguage: "es-PE",
  isPartOf: { "@type": "WebSite", url: BASE, name: "Observa Perú" },
  about: {
    "@type": "Event",
    name: "Elecciones Generales del Perú 2026",
    startDate: "2026-04-05",
    location: { "@type": "Country", name: "Perú" },
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: BASE,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Estadísticas",
        item: PAGE_URL,
      },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Quién lidera las encuestas presidenciales Perú 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Según la encuesta Ipsos de marzo 2026 (n=1,203), Keiko Fujimori lidera con 11% de intención de voto, seguida de Rafael López Aliaga con 10%. Ambos se encuentran dentro del margen de error de ±2.8 pp, lo que configura un empate técnico.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuándo son las elecciones presidenciales en Perú 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Las elecciones generales del Perú 2026 están programadas para el 11 de abril de 2026. Si ningún candidato supera el 50% de los votos válidos, se realizará una segunda vuelta el 7 de junio de 2026.",
      },
    },
    {
      "@type": "Question",
      name: "¿Quiénes son los candidatos presidenciales del Perú 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Entre los principales candidatos inscritos ante el JNE se encuentran Keiko Fujimori (Fuerza Popular), Rafael López Aliaga (Renovación Popular), César Acuña (Alianza para el Progreso), entre otros.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuántos debates presidenciales JNE hubo en 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El JNE organizó tres jornadas de debate presidencial los días 23, 24 y 25 de marzo de 2026, transmitidas por TV Perú.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se mide el tiempo de habla en los debates JNE?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "El tiempo de habla se calcula a partir de la transcripción completa del debate. Cada intervención se clasifica automáticamente como ataque, propuesta o discurso neutro mediante análisis de palabras clave. El margen de error en la clasificación automática es de aproximadamente ±5%.",
      },
    },
  ],
};

const datasetSchema = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  name: "Encuesta y Simulacro Nacional Urbano Rural — Elecciones Presidenciales Perú 2026",
  description:
    "Encuesta de intención de voto (n=1,203) y simulacro de votación (n=1,189) realizada por Ipsos Perú para Perú21 los días 21 y 22 de marzo de 2026. Margen de error ±2.8 puntos porcentuales, IC 95%. Registro JNE 001-REE/JNE.",
  url: PAGE_URL,
  creator: {
    "@type": "Organization",
    name: "Ipsos Perú",
    url: "https://www.ipsos.com/es-pe",
  },
  publisher: {
    "@type": "Organization",
    name: "Observa Perú",
    url: BASE,
  },
  datePublished: "2026-03-22",
  dateModified: "2026-03-28",
  inLanguage: "es-PE",
  spatialCoverage: "Perú",
  temporalCoverage: "2026-03-22",
  variableMeasured: "Intención de voto presidencial — Elecciones Generales Perú 2026",
};

export default function EstadisticasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {children}
    </>
  );
}
