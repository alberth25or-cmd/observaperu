import type { Metadata } from "next";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";
import AIChatPopup from "@/components/AIChatPopup";

export const metadata: Metadata = {
  title: "Inicio",
  description:
    "Observa Perú: conoce a los candidatos presidenciales, sus propuestas, planes de gobierno y trayectoria. Compara, explora el mapa ideológico y estadísticas.",
  openGraph: {
    title: "Observa Perú | Candidatos y elecciones",
    description:
      "Conoce a los candidatos presidenciales del Perú, propuestas y planes de gobierno.",
    url: "https://www.observaperu.com",
  },
  alternates: { canonical: "https://www.observaperu.com" },
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeatureCards />
      <AboutSection />
      <Footer />
      <AIChatPopup />
    </main>
  );
}
