import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Observa Perú",
  description:
    "Plataforma para conocer a los candidatos, sus propuestas y trayectoria.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#f5f7fb] text-[#0b1b3b] antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
