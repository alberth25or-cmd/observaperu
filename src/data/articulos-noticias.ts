export type ArticuloNoticia = {
  slug: string;
  title: string;
  /** Bajada o subtítulo del artículo (opcional). Se muestra debajo del H1. */
  bajada?: string;
  metaDescription: string;
  keywords: string[];
  sections: {
    h2: string;
    content: Array<
      | { type: "p"; text: string }
      | { type: "h3"; text: string }
      | { type: "ul"; items: string[] }
      | { type: "chart"; chartId: "electorado-2026" }
      | { type: "link"; href: string; label: string }
      | { type: "pdf"; href: string; label: string }
    >;
  }[];
  references: string[];
};

const SLUG_DNI_VENCIDO = "votar-dni-vencido-elecciones-2026-peru";

export const ARTICULOS_NOTICIAS: Record<string, ArticuloNoticia> = {
  [SLUG_DNI_VENCIDO]: {
    slug: SLUG_DNI_VENCIDO,
    title: "¿Se puede votar con DNI vencido en las Elecciones 2026 en Perú?",
    bajada:
      "Lo que debes saber si tu DNI está vencido antes de acudir a votar en las elecciones del 12 de abril.",
    metaDescription:
      "¿Tu DNI está vencido? Conoce si podrás votar en las Elecciones Generales 2026 en Perú, qué documentos serán válidos y hasta cuándo aplica la medida del Reniec.",
    keywords: [
      "votar con DNI vencido Perú",
      "Elecciones 2026 Perú",
      "Reniec DNI vencido",
      "documentos válidos para votar",
      "padrón electoral Perú 2026",
      "ONPE consulta electoral",
    ],
    sections: [
      {
        h2: "",
        content: [
          {
            type: "p",
            text: "A pocas semanas de las Elecciones Generales de Perú 2026, una de las dudas más frecuentes entre los ciudadanos es si será posible votar con el Documento Nacional de Identidad (DNI) vencido.",
          },
          {
            type: "p",
            text: "El Registro Nacional de Identificación y Estado Civil (Reniec) confirmó que sí será posible sufragar con el DNI vencido durante la jornada electoral del 12 de abril de 2026.",
          },
          {
            type: "p",
            text: "La entidad emitió una resolución que prorroga de manera excepcional la vigencia de estos documentos, con el objetivo de garantizar que todos los ciudadanos puedan ejercer su derecho al voto.",
          },
        ],
      },
      {
        h2: "¿Se puede votar con DNI vencido?",
        content: [
          {
            type: "p",
            text: "Sí. El Reniec aprobó la Resolución N.° 000030-2026/JNAC/RENIEC, mediante la cual se extiende temporalmente la vigencia de los DNI vencidos o próximos a vencer.",
          },
          {
            type: "pdf",
            href: "/pdfs/reniec/resolucion-000030-2026-jnac-reniec.pdf",
            label: "Descargar Resolución N.° 000030-2026/JNAC/RENIEC (PDF)",
          },
          {
            type: "p",
            text: "Esta prórroga solo tendrá efecto hasta el 12 de abril de 2026, fecha en la que se realizarán las elecciones generales en el país.",
          },
          {
            type: "p",
            text: "La medida busca evitar que los ciudadanos queden excluidos del proceso electoral únicamente por el vencimiento de su documento de identidad.",
          },
        ],
      },
      {
        h2: "¿El DNI vencido servirá para otros trámites?",
        content: [
          {
            type: "p",
            text: "No necesariamente.",
          },
          {
            type: "p",
            text: "El Reniec precisó que la extensión de la vigencia del DNI aplica únicamente para el ejercicio del voto durante la jornada electoral.",
          },
          {
            type: "p",
            text: "Esto significa que el documento podrá utilizarse para identificarse en la mesa de sufragio, pero podría no ser válido para otros trámites administrativos que requieran un DNI vigente.",
          },
          {
            type: "p",
            text: "La resolución será publicada en el diario oficial El Peruano y comunicada al Jurado Nacional de Elecciones (JNE) y a la Oficina Nacional de Procesos Electorales (ONPE) para su aplicación dentro del proceso electoral.",
          },
        ],
      },
      {
        h2: "Qué documentos serán válidos para votar",
        content: [
          {
            type: "ul",
            items: [
              "DNI azul",
              "DNI electrónico versión 1.0",
              "DNI electrónico versión 2.0",
              "DNI electrónico versión 3.0",
            ],
          },
          {
            type: "p",
            text: "Estos documentos serán aceptados el día de las elecciones para verificar la identidad del elector.",
          },
        ],
      },
      {
        h2: "Más de 1.8 millones de peruanos tienen el DNI vencido",
        content: [
          {
            type: "p",
            text: "De acuerdo con el padrón electoral cerrado el 14 de octubre de 2025, el Perú cuenta con 27 325 432 ciudadanos habilitados para votar.",
          },
          {
            type: "p",
            text: "Distribución del electorado:",
          },
          {
            type: "ul",
            items: [
              "13 119 593 mujeres",
              "12 995 026 hombres",
            ],
          },
          {
            type: "chart",
            chartId: "electorado-2026",
          },
          {
            type: "p",
            text: "Actualmente, más de 1.8 millones de ciudadanos tienen el DNI vencido, por lo que esta medida busca asegurar que una parte importante del electorado no quede fuera del proceso democrático.",
          },
        ],
      },
      {
        h2: "Qué se elegirá en las Elecciones Generales 2026",
        content: [
          {
            type: "ul",
            items: [
              "Presidente de la República",
              "Vicepresidentes",
              "Senadores",
              "Diputados",
              "Representantes al Parlamento Andino",
            ],
          },
          {
            type: "p",
            text: "Este proceso electoral también marcará el retorno del sistema parlamentario bicameral en el Perú.",
          },
        ],
      },
      {
        h2: "Consulta tu local de votación",
        content: [
          {
            type: "p",
            text: "Antes de acudir a votar, los ciudadanos pueden verificar su local de votación, número de mesa y orden dentro de la mesa en la plataforma oficial habilitada por la ONPE.",
          },
          {
            type: "link",
            href: "https://consultaelectoral.onpe.gob.pe/inicio",
            label: "Consultar local de votación (ONPE)",
          },
          {
            type: "p",
            text: "Se recomienda revisar el local de votación con anticipación para evitar contratiempos el día de los comicios.",
          },
        ],
      },
    ],
    references: [
      "Reniec. (2026). Resolución Jefatural N.° 000030-2026/JNAC/RENIEC. Prórroga excepcional de vigencia del DNI para el proceso electoral 2026.",
    ],
  },
};

export function getNoticiaBySlug(slug: string): ArticuloNoticia | null {
  return ARTICULOS_NOTICIAS[slug] ?? null;
}

export function getAllNoticiasSlugs(): string[] {
  return Object.keys(ARTICULOS_NOTICIAS);
}
