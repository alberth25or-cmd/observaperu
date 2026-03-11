import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Estadísticas",
  description:
    "Estadísticas de los candidatos presidenciales del Perú: indicadores, perfil generacional y datos comparativos.",
  openGraph: {
    title: "Estadísticas | Observa Perú",
    url: "https://www.observaperu.com/estadisticas",
  },
  alternates: { canonical: "https://www.observaperu.com/estadisticas" },
};

export default function EstadisticasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
