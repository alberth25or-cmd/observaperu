import type { Metadata } from "next";
import Script from "next/script";
import { Sora, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Analytics from "@/components/Analytics";
import SuavizarScroll from "@/components/SuavizarScroll";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = "https://www.observaperu.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default:
      "Observa Perú | Encuestas y estudios de mercado con rigor estadístico",
    template: "%s | Observa Perú",
  },
  description:
    "Encuestas, estudios de mercado y asesoría estadística para empresas e investigadores. Trabajo de campo en Lima y, según el estudio, en otras regiones. Cada estudio con su ficha técnica.",
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: BASE_URL,
    siteName: "Observa Perú",
    title: "Observa Perú | Estudios de mercado hechos por estadísticos",
    description:
      "Encuestas y estudios de mercado con rigor estadístico. Te mostramos cómo medimos, no solo el resultado.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Observa Perú | Estudios de mercado hechos por estadísticos",
    description:
      "Encuestas, estudios de mercado y asesoría estadística con rigor. Trabajo de campo en Lima y, según el estudio, en otras regiones.",
  },
  alternates: { canonical: BASE_URL },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Observa Perú",
  url: BASE_URL,
  description:
    "Encuestas, estudios de mercado y asesoría estadística en el Perú",
  inLanguage: "es-PE",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${sora.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
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
        <SuavizarScroll />
        <Analytics />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
