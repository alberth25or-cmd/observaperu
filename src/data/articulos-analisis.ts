export type ArticuloAnalisis = {
  slug: string;
  title: string;
  metaDescription: string;
  keywords: string[];
  publishedAt?: string;
  sections: {
    h2: string;
    content: Array<
      | { type: "p"; text: string }
      | { type: "h3"; text: string }
      | { type: "ul"; items: string[] }
      | { type: "table"; headers: string[]; rows: string[][] }
      | { type: "chart"; chartId: "candidatos-presidenciales-evolucion" }
      | { type: "relatedLinks"; links: { href: string; label: string }[] }
    >;
}[];
  references: string[];
};

const SLUG_CIPRIANI = "suheyn-cipriani-crisis-meritocracia-congreso-peruano";

export const ARTICULOS_ANALISIS: Record<string, ArticuloAnalisis> = {
  [SLUG_CIPRIANI]: {
    slug: SLUG_CIPRIANI,
    title: "Suheyn Cipriani y la crisis de meritocracia en el Congreso peruano",
    metaDescription:
      "Un análisis profundo sobre el caso Suheyn Cipriani y cómo el sistema de contrataciones del Congreso peruano refleja una crisis estructural de meritocracia, clientelismo político y uso discrecional del poder público.",
    keywords: [
      "Suheyn Cipriani Congreso",
      "contrataciones en el Congreso del Perú",
      "meritocracia en el Estado peruano",
      "personal de confianza Congreso Perú",
      "corrupción y clientelismo político Perú",
      "crisis institucional Congreso peruano",
    ],
    sections: [
      {
        h2: "Cuando el mérito deja de importar",
        content: [
          {
            type: "p",
            text: "Hay instituciones que se deterioran lentamente. No caen de un día para otro. No colapsan con un escándalo aislado. Se erosionan con decisiones pequeñas, repetidas, normalizadas. El Congreso peruano parece atravesar justamente ese proceso.",
          },
          {
            type: "p",
            text: "El reciente debate público sobre la contratación de Suheyn Cipriani, una figura conocida por su trayectoria en certámenes de belleza, volvió a poner sobre la mesa una pregunta incómoda: ¿Qué criterios se utilizan realmente para acceder a un cargo dentro del Poder Legislativo?",
          },
          {
            type: "p",
            text: "Porque en teoría, el Estado peruano tiene reglas claras. La administración pública se sostiene sobre un principio básico: el acceso a la función pública debe basarse en el mérito. Pero en la práctica, el Congreso parece operar bajo una lógica distinta. Una lógica más antigua. Una lógica donde el poder se reparte como recompensa.",
          },
        ],
      },
      {
        h2: "El caso Suheyn Cipriani: síntoma de un sistema",
        content: [
          {
            type: "p",
            text: "La designación de Suheyn Cipriani en el Congreso no es relevante únicamente por su perfil mediático. Lo importante es lo que el caso revela sobre el funcionamiento interno del Parlamento.",
          },
          {
            type: "p",
            text: "Investigaciones periodísticas señalaron inconsistencias en los documentos presentados para justificar su experiencia laboral, incluyendo un certificado que la acreditaba como administradora sin evidencia verificable. Más allá de la discusión sobre una persona específica, el caso expone un problema mayor: la fragilidad de los filtros institucionales dentro del Congreso.",
          },
          {
            type: "h3",
            text: "Funciones que requieren conocimiento especializado",
          },
          {
            type: "p",
            text: "En teoría, los asesores parlamentarios cumplen funciones técnicas: análisis de proyectos de ley, revisión de expedientes legislativos, elaboración de informes jurídicos y apoyo en procesos de fiscalización. Son tareas que requieren conocimiento especializado. Sin embargo, el sistema de contratación permite que esos puestos se llenen bajo un criterio diferente: la confianza política.",
          },
        ],
      },
      {
        h2: "El régimen de confianza: la puerta abierta del Congreso",
        content: [
          {
            type: "p",
            text: "El Congreso opera con un régimen laboral particular. Muchos de sus trabajadores ingresan bajo la modalidad de personal de confianza, una categoría que permite a los congresistas designar directamente a sus colaboradores. Sin concursos. Sin evaluaciones técnicas. Sin procesos transparentes.",
          },
          {
            type: "p",
            text: "Esta discrecionalidad se amplió aún más con el Acuerdo de Mesa 072-2022-2023, aprobado durante la presidencia de José Williams, que habilitó la contratación de personal de confianza adicional. En la práctica, esto creó una estructura paralela de contratación dentro del Parlamento. Un sistema donde los controles tradicionales del servicio civil pierden peso. Y donde la autonomía institucional del Congreso funciona como un escudo frente a la supervisión externa.",
          },
        ],
      },
      {
        h2: "Cuando el Congreso se convierte en una agencia de empleos políticos",
        content: [
          {
            type: "p",
            text: "La contratación de figuras mediáticas o personas sin trayectoria técnica no es un fenómeno nuevo. A lo largo de los años han aparecido diversos casos que siguen un patrón similar:",
          },
          {
            type: "ul",
            items: [
              "Ingreso al Congreso mediante contratos de confianza o locación de servicios.",
              "Perfiles académicos débiles o inexistentes en áreas relacionadas con la gestión pública.",
              "Remuneraciones elevadas en comparación con el mercado laboral.",
              "Incrementos salariales rápidos dentro del mismo despacho.",
            ],
          },
          {
            type: "p",
            text: "Este patrón revela algo más profundo que simples errores administrativos. Revela una cultura política. Una donde los cargos públicos funcionan como espacios de recompensa política.",
          },
        ],
      },
      {
        h2: "El sistema de botín: una explicación desde la ciencia política",
        content: [
          {
            type: "p",
            text: "En la teoría política, este fenómeno tiene un nombre. Se conoce como spoils system, o sistema de botín. Es un modelo en el que quienes controlan el poder distribuyen los puestos del Estado entre aliados, amigos o colaboradores. No importa tanto la capacidad técnica. Importa la cercanía. La lealtad. La utilidad política.",
          },
          {
            type: "p",
            text: "En democracias con instituciones sólidas, este sistema fue reemplazado hace décadas por servicios civiles profesionales. Pero en contextos donde las instituciones son más débiles, el sistema de botín puede sobrevivir bajo nuevas formas. El Congreso peruano parece ofrecer un ejemplo claro de esta dinámica.",
          },
        ],
      },
      {
        h2: "El costo económico del clientelismo legislativo",
        content: [
          {
            type: "p",
            text: "Este problema no es solo ético o político. También tiene un costo concreto. El Congreso destina más del 65% de su presupuesto al pago de planillas, lo que equivale a cerca de S/ 923 millones anuales. Además, entre 2021 y 2025 se crearon 39 comisiones especiales, cuyo funcionamiento implicó más de S/ 23 millones en gasto público.",
          },
          {
            type: "h3",
            text: "Comisiones que no rinden frutos",
          },
          {
            type: "p",
            text: "Muchas de estas comisiones no concluyen investigaciones relevantes, no logran que sus informes se debatan en el Pleno, o terminan archivadas. Esto sugiere que, en algunos casos, las comisiones funcionan más como espacios administrativos para incorporar personal que como verdaderos instrumentos de fiscalización.",
          },
        ],
      },
      {
        h2: "Cuando la falta de controles se convierte en riesgo institucional",
        content: [
          {
            type: "p",
            text: "El problema se agrava cuando las irregularidades en las contrataciones se vinculan con delitos más graves. Investigaciones sobre la Oficina Legal y Constitucional del Congreso revelaron casos de funcionarios que habrían presentado documentos falsos para acceder a cargos públicos.",
          },
          {
            type: "p",
            text: "Estas situaciones evidencian un punto crítico: cuando el control administrativo falla, la vulnerabilidad institucional aumenta. Y con ella, el riesgo de corrupción.",
          },
        ],
      },
      {
        h2: "El desafío pendiente: construir un servicio parlamentario profesional",
        content: [
          {
            type: "p",
            text: "El debate sobre la meritocracia en el Congreso no es nuevo. Pero sigue sin resolverse. Diversos especialistas han planteado reformas que podrían reducir estos problemas, como:",
          },
          {
            type: "ul",
            items: [
              "Crear un servicio parlamentario de carrera.",
              "Limitar estrictamente el número de trabajadores de confianza.",
              "Exigir verificación obligatoria de títulos y experiencia laboral.",
              "Establecer auditorías externas permanentes sobre el personal del Congreso.",
            ],
          },
          {
            type: "p",
            text: "Estas medidas no eliminarían completamente la discrecionalidad política. Pero podrían restablecer un equilibrio mínimo entre confianza y competencia técnica.",
          },
        ],
      },
      {
        h2: "La pregunta de fondo",
        content: [
          {
            type: "p",
            text: "El caso Suheyn Cipriani, como muchos otros antes, no es únicamente un escándalo mediático. Es un reflejo de algo más profundo. Una pregunta sobre la naturaleza misma de nuestras instituciones.",
          },
          {
            type: "p",
            text: "Porque cuando el mérito deja de ser el criterio para ocupar cargos públicos, el Estado comienza a transformarse. Deja de ser una herramienta al servicio de la ciudadanía. Y empieza a parecerse más a un sistema de favores.",
          },
          {
            type: "p",
            text: "La cuestión no es si este problema existe. La evidencia muestra que sí. La pregunta es otra: ¿está el sistema político peruano dispuesto a corregirlo?",
          },
        ],
      },
    ],
    references: [
      "Acepp33-47. (2025). Planilla legislativa para influencers: La historia del certificado con el que el Congreso contrató a Suheyn Cipriani.",
      "Congreso de la República del Perú. (2025). Reglamento del Congreso de la República del Perú.",
      "Congreso de la República del Perú. (2025). Informe Final sobre el caso: Presuntas Irregularidades en contrataciones laborales de funcionarios y trabajadores del Congreso de la República. Comisión de Fiscalización y Contraloría.",
      "Diario Oficial El Peruano. (2004, 19 de febrero). Ley N° 28175: Ley Marco del Empleo Público.",
      "Diario Oficial El Peruano. (2013, 4 de julio). Ley N° 30057: Ley del Servicio Civil.",
      "Diario Oficial El Peruano. (2022, 15 de febrero). Ley N° 31419: Ley que establece disposiciones para garantizar la idoneidad en el acceso y ejercicio de la función pública de funcionarios y directivos de libre designación y remoción.",
      "Gobierno Regional de Áncash. (2021). Manual de Clasificador de Cargos.",
      "LPDerecho. (2025, 9 de junio). Mesa Directiva del Congreso aprueba norma que permite contratación de personal sin concurso público ni filtros.",
      "LPDerecho. (2025, 27 de noviembre). Ley 32507: Modifican norma que regula requisitos para asumir cargos de confianza.",
      "OjoPúblico. (2025, 14 de septiembre). Congreso: Más de S/23 millones en comisiones investigadoras y especiales sin impacto.",
      "Quinto Poder. (2024, 26 de diciembre). Revelan uso de documentos falsos por Jorge Torres Saravia e Isabel Cajo en el Congreso [Archivo de Video]. YouTube.",
      "YouTube. (2024, 21 de diciembre). Investigación sobre presunta red de prostitución y contrataciones irregulares en la Oficina Legal del Congreso.",
    ],
  },

  "36-candidatos-presidenciales-elecciones-peru-2026": {
    slug: "36-candidatos-presidenciales-elecciones-peru-2026",
    title: "Elecciones Perú 2026 y el fenómeno de los más de 30 candidatos presidenciales",
    publishedAt: "2026-02-21",
    metaDescription:
      "Elecciones Perú 2026: más de 36 fórmulas presidenciales ante el JNE. Por qué hay tantos candidatos, reforma electoral, primarias y crisis de representación.",
    keywords: [
      "elecciones Perú 2026",
      "candidatos presidenciales Perú",
      "JNE fórmulas presidenciales",
      "fragmentación electoral Perú",
      "reforma electoral Perú",
      "valla electoral 5%",
      "primarias Perú",
      "crisis representación política Perú",
    ],
    sections: [
      {
        h2: "",
        content: [
          {
            type: "p",
            text: "Las elecciones generales de Perú 2026 podrían ser las más fragmentadas de la historia: más de 36 fórmulas presidenciales han solicitado su inscripción ante el Jurado Nacional de Elecciones (JNE). La cifra no solo supera todos los registros previos; obliga a preguntar si el país vive una democracia más abierta o un sistema político sin filtros.",
          },
          {
            type: "p",
            text: "Detrás de esta sobreoferta de candidaturas hay cambios legales, incentivos partidarios y una crisis de representación que explican por qué el Perú se acerca a una elección con niveles de fragmentación nunca vistos.",
          },
        ],
      },
      {
        h2: "Evolución de los candidatos presidenciales en Perú",
        content: [
          {
            type: "p",
            text: "Desde el retorno a la democracia en 1980, el número de postulantes ha variado, pero durante décadas se mantuvo en un rango estable. En los últimos procesos la tendencia es clara: cada vez compiten más candidatos por el voto ciudadano.",
          },
          {
            type: "chart",
            chartId: "candidatos-presidenciales-evolucion",
          },
          {
            type: "p",
            text: "*Estimación según solicitudes de inscripción presentadas ante el JNE. Si la cifra se mantiene tras la validación, sería la elección presidencial con más candidaturas en la historia del Perú.",
          },
        ],
      },
      {
        h2: "Reforma electoral: nuevas reglas de inscripción",
        content: [
          {
            type: "p",
            text: "Uno de los factores centrales de la proliferación de candidatos es el cambio en los requisitos para inscribir partidos. Antes, las organizaciones debían reunir cientos de miles de firmas de adherentes: un proceso largo, costoso y complejo.",
          },
          {
            type: "p",
            text: "Las reformas electorales bajaron el listón: el requisito pasó de firmas de adherentes a afiliados partidarios. Hoy un partido puede inscribirse con aproximadamente 25 288 afiliados registrados, según el JNE.",
          },
          {
            type: "p",
            text: "En la práctica, crear un partido se volvió mucho más accesible. El número de organizaciones políticas creció y, con ello, más candidatos en la papeleta.",
          },
        ],
      },
      {
        h2: "El filtro que no llegó: primarias abiertas",
        content: [
          {
            type: "p",
            text: "Durante años se discutió implementar elecciones primarias abiertas, simultáneas y obligatorias, para que la ciudadanía eligiera a los candidatos de cada partido antes de la elección general. Eso habría actuado como un primer filtro democrático.",
          },
          {
            type: "p",
            text: "El sistema se modificó: los partidos pueden elegir a sus candidatos mediante delegados o votaciones internas entre afiliados, sin abrir el proceso a todo el electorado.",
          },
          {
            type: "p",
            text: "El resultado es que muchos candidatos llegan a la cédula electoral sin haber pasado por una competencia nacional previa.",
          },
        ],
      },
      {
        h2: "Cuando el objetivo no es ganar la presidencia",
        content: [
          {
            type: "p",
            text: "En teoría, los partidos compiten para conquistar el poder. En la práctica, la estrategia puede ser otra. En Perú existe una valla electoral del 5% para mantener la inscripción partidaria y acceder a representación en el Congreso.",
          },
          {
            type: "p",
            text: "El nuevo sistema bicameral amplía los cargos a elegir (senadores y diputados). Eso genera un incentivo claro: algunos partidos no compiten solo para ganar la presidencia, sino para mantener inscripción, colocar congresistas, acceder a financiamiento público y fortalecer presencia política.",
          },
          {
            type: "ul",
            items: [
              "Mantener la inscripción del partido.",
              "Obtener escaños en el Congreso.",
              "Acceder a financiamiento público.",
              "Fortalecer la presencia política a futuro.",
            ],
          },
          {
            type: "p",
            text: "La elección presidencial funciona así también como puerta de entrada al poder legislativo.",
          },
        ],
      },
      {
        h2: "Crisis de representación política en Perú",
        content: [
          {
            type: "p",
            text: "Más allá de las normas, un factor recorre todo el sistema: la desconfianza ciudadana. En los últimos años el país ha vivido presidentes destituidos, congresos disueltos, escándalos de corrupción e inestabilidad política constante.",
          },
          {
            type: "p",
            text: "Los partidos tradicionales han perdido legitimidad. Cuando las instituciones pierden confianza, suele aparecer el fenómeno de los outsiders: figuras regionales, líderes locales o nuevos movimientos que intentan llenar el vacío. La pregunta que queda es quién representa realmente a los ciudadanos.",
          },
        ],
      },
      {
        h2: "Democracia fragmentada: ¿más opciones o más confusión?",
        content: [
          {
            type: "p",
            text: "Tener más candidatos puede leerse como pluralismo: más voces, más ideas, más competencia. Pero cuando el voto se reparte entre demasiadas opciones, el ganador de la primera vuelta puede quedar con un apoyo muy bajo.",
          },
          {
            type: "p",
            text: "En 2021, el candidato que pasó en primer lugar a la segunda vuelta obtuvo menos del 19% de los votos válidos. Es decir, más del 80% del electorado votó por otras opciones. La fragmentación no solo afecta el resultado; también la gobernabilidad.",
          },
        ],
      },
      {
        h2: "",
        content: [
          {
            type: "p",
            text: "El proceso de 2026 no solo elegirá presidente; pondrá a prueba al sistema político. Detrás de las cifras y las campañas queda abierta la pregunta: ¿estamos construyendo una democracia con más participación o un sistema que no logra organizar la representación? La respuesta tal vez no esté en el número de candidatos, sino en la relación entre ciudadanía y política, en la confianza perdida y en la sensación de que el poder sigue lejos.",
          },
        ],
      },
      {
        h2: "Preguntas frecuentes",
        content: [
          {
            type: "h3",
            text: "¿Cuántos candidatos presidenciales hay en las elecciones Perú 2026?",
          },
          {
            type: "p",
            text: "Según el JNE, 36 fórmulas presidenciales solicitaron su inscripción para las elecciones generales 2026. La cifra es estimada hasta el cierre del proceso de validación y sería la más alta en la historia republicana.",
          },
          {
            type: "h3",
            text: "¿Por qué hay tantos candidatos presidenciales en Perú?",
          },
          {
            type: "p",
            text: "Influyen la reforma electoral (inscripción con unos 25 288 afiliados en lugar de cientos de miles de firmas), la no implementación de primarias abiertas, la valla del 5% que incentiva competir para mantener partido y lograr escaños, y la crisis de representación que favorece candidaturas outsiders.",
          },
          {
            type: "h3",
            text: "¿Qué es la valla electoral del 5% en Perú?",
          },
          {
            type: "p",
            text: "Es el umbral mínimo de votos que un partido debe alcanzar para mantener su inscripción y acceder a representación en el Congreso. Muchas organizaciones compiten en la elección presidencial también para superar esa valla y asegurar presencia en el Legislativo.",
          },
          {
            type: "h3",
            text: "¿Cómo se eligen los candidatos presidenciales en los partidos peruanos?",
          },
          {
            type: "p",
            text: "Los partidos pueden elegir a sus candidatos mediante delegados o votaciones internas entre afiliados. No están obligados a realizar primarias abiertas ante todo el electorado, por lo que no existe un filtro nacional previo a la elección general.",
          },
          {
            type: "h3",
            text: "¿Qué pasó en las elecciones 2021 con la fragmentación del voto?",
          },
          {
            type: "p",
            text: "El candidato que pasó en primer lugar a la segunda vuelta obtuvo menos del 19% de los votos válidos. Más del 80% del electorado votó por otras opciones, lo que ilustra el alto nivel de fragmentación y sus efectos en la gobernabilidad.",
          },
        ],
      },
      {
        h2: "También te puede interesar",
        content: [
          {
            type: "relatedLinks",
            links: [
              { href: "/noticias/multa-por-no-votar-elecciones-2026-peru", label: "Multa por no votar en las elecciones Perú 2026" },
              { href: "/noticias/votar-dni-vencido-elecciones-2026-peru", label: "¿Se puede votar con DNI vencido en elecciones 2026?" },
              { href: "/noticias/cuanto-pagan-miembro-mesa-peru-2026", label: "Cuánto pagan a los miembros de mesa en Perú 2026" },
              { href: "/analisis/suheyn-cipriani-crisis-meritocracia-congreso-peruano", label: "Suheyn Cipriani y la crisis de meritocracia en el Congreso peruano" },
            ],
          },
        ],
      },
    ],
    references: [
      "Jurado Nacional de Elecciones. (2023, 27 de marzo). Partidos políticos deben acreditar un mínimo de 25 288 afiliados para solicitar inscripción. Portal Institucional del JNE. https://portal.jne.gob.pe/Portal/Pagina/Nota/13787",
      "Jurado Nacional de Elecciones. (2025, 24 de diciembre). JNE confirma que 36 fórmulas presidenciales solicitaron su inscripción. Portal Institucional del JNE. https://portal.jne.gob.pe/portal/Pagina/Nota/19542",
      "Observatorio para la Gobernabilidad [INFOgob]. (2025). Reporte N° 2: Padrón de afiliados y organizaciones políticas para las Elecciones Generales 2026. Jurado Nacional de Elecciones. https://www.jne.gob.pe/dneect/2025/P_JNE_101125.pdf",
      "Oficina Nacional de Procesos Electorales [ONPE]. (2024, 14 de junio). Ley 32058: Ley que modifica la Ley Orgánica de Elecciones y la Ley de Organizaciones Políticas. https://www.onpe.gob.pe/modFinanciamiento/LEY-32058.pdf",
    ],
  },
};

export function getArticuloBySlug(slug: string): ArticuloAnalisis | null {
  return ARTICULOS_ANALISIS[slug] ?? null;
}

export function getAllAnalisisSlugs(): string[] {
  return Object.keys(ARTICULOS_ANALISIS);
}
