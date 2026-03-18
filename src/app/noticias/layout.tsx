import type { Metadata } from "next";

const BASE_URL = "https://www.observaperu.com";

export const metadata: Metadata = {
  title: "Noticias",
  description:
    "Noticias y coyuntura electoral del Perú: candidatos, partidos, JNE y elecciones presidenciales con contexto y análisis.",
  openGraph: {
    title: "Noticias | Observa Perú",
    description:
      "Noticias y coyuntura sobre elecciones y candidatos presidenciales en Perú.",
    url: `${BASE_URL}/noticias`,
  },
  alternates: { canonical: `${BASE_URL}/noticias` },
};

export default function NoticiasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
