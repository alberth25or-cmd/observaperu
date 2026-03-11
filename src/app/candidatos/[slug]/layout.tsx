import type { Metadata } from "next";
import { ALL_CANDIDATES } from "@/data/candidatos";
import { getCandidateDetail } from "@/data/candidatos-detalle";
import type { Candidate } from "@/data/candidatos";

const BASE_URL = "https://www.observaperu.com";

function getCandidateBySlug(slug: string): Candidate | undefined {
  return ALL_CANDIDATES.find((c) => c.key === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const candidate = getCandidateBySlug(slug);
  const detail = candidate ? getCandidateDetail(slug, candidate) : null;

  if (!detail) {
    return { title: "Candidato no encontrado" };
  }

  const title = detail.name;
  const description = `Conoce a ${detail.name}, candidato por ${detail.party}. Biografía, propuestas, ideología y plan de gobierno.`;
  const url = `${BASE_URL}/candidatos/${slug}`;
  const image = detail.img.startsWith("http") ? detail.img : `${BASE_URL}${detail.img}`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Observa Perú`,
      description,
      url,
      siteName: "Observa Perú",
      type: "profile",
      images: [{ url: image, width: 800, height: 800, alt: detail.name }],
      locale: "es_PE",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Observa Perú`,
      description,
      images: [image],
    },
    alternates: { canonical: url },
  };
}

export default async function CandidateLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const candidate = getCandidateBySlug(slug);
  const detail = candidate ? getCandidateDetail(slug, candidate) : null;

  if (!detail) {
    return <>{children}</>;
  }

  const url = `${BASE_URL}/candidatos/${slug}`;
  const imageUrl = detail.img.startsWith("http") ? detail.img : `${BASE_URL}${detail.img}`;

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: detail.name,
    jobTitle: "Candidato presidencial",
    worksFor: {
      "@type": "Organization",
      name: detail.party,
    },
    image: imageUrl,
    url,
    description: `Candidato presidencial por ${detail.party}. Conoce su biografía, propuestas y plan de gobierno.`,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Candidatos", item: `${BASE_URL}/candidatos` },
      { "@type": "ListItem", position: 3, name: detail.name, item: url },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {children}
    </>
  );
}
