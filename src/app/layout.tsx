import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";

const BASE_URL = "https://www.observaperu.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Observa Perú | Candidatos presidenciales, propuestas y elecciones",
    template: "%s | Observa Perú",
  },
  description:
    "Plataforma independiente para conocer a los candidatos presidenciales del Perú: biografía, propuestas, trayectoria y planes de gobierno.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: BASE_URL,
    siteName: "Observa Perú",
    title: "Observa Perú | Candidatos y elecciones",
    description: "Conoce a los candidatos presidenciales, sus propuestas y planes de gobierno.",
    images: [{ url: "/LogoObserva.png", width: 1200, height: 630, alt: "Observa Perú" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Observa Perú | Candidatos y elecciones",
    description: "Conoce a los candidatos presidenciales, sus propuestas y planes de gobierno.",
  },
  alternates: { canonical: BASE_URL },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Observa Perú",
  url: BASE_URL,
  description: "Plataforma para conocer candidatos presidenciales del Perú, propuestas y planes de gobierno",
  inLanguage: "es-PE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-[#f5f7fb] text-[#0b1b3b] antialiased">
        <Script
          id="gtm"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K76RR546');
            `.trim(),
          }}
        />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K76RR546"
            height={0}
            width={0}
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
