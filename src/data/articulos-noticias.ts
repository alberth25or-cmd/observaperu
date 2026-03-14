export type ArticuloNoticia = {
  slug: string;
  title: string;
  /** Bajada o subtítulo del artículo (opcional). Se muestra debajo del H1. */
  bajada?: string;
  /** Fecha de publicación en formato ISO (YYYY-MM-DD). */
  datePublished?: string;
  metaDescription: string;
  keywords: string[];
  sections: {
    h2: string;
    content: Array<
      | { type: "p"; text: string }
      | { type: "h3"; text: string }
      | { type: "ul"; items: string[] }
      | { type: "chart"; chartId: "electorado-2026" | "multas-2026" | "padron-2026" }
      | { type: "link"; href: string; label: string }
      | { type: "pdf"; href: string; label: string }
      | { type: "internalLink"; href: string; label: string }
      | { type: "table"; headers: string[]; rows: string[][] }
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
    datePublished: "2026-01-20",
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

  "multa-por-no-votar-elecciones-2026-peru": {
    slug: "multa-por-no-votar-elecciones-2026-peru",
    title: "¿Cuál es la multa por no votar en las Elecciones 2026 en Perú?",
    datePublished: "2026-02-05",
    metaDescription:
      "Conoce cuánto es la multa por no votar en las Elecciones Generales 2026 en Perú. Los montos dependen del nivel de pobreza del distrito y pueden llegar hasta S/ 110.",
    keywords: [
      "multa por no votar Perú 2026",
      "Elecciones 2026 multa",
      "voto obligatorio Perú",
      "sanción electoral",
      "UIT multa electoral",
    ],
    sections: [
      {
        h2: "",
        content: [
          {
            type: "p",
            text: "A medida que se acerca la jornada electoral del 12 de abril, muchos ciudadanos se preguntan cuál es la multa por no votar en las Elecciones Generales 2026 en Perú y qué consecuencias puede tener no participar en el proceso.",
          },
          {
            type: "p",
            text: "En el país, el voto es obligatorio para los ciudadanos entre 18 y 70 años, de acuerdo con la legislación electoral. Quienes no acudan a votar y no presenten una justificación válida deberán pagar una multa establecida por las autoridades electorales.",
          },
          {
            type: "p",
            text: "Los montos varían según la clasificación socioeconómica del distrito registrado en el Documento Nacional de Identidad (DNI).",
          },
        ],
      },
      {
        h2: "Cuánto es la multa por no votar en Perú en 2026",
        content: [
          {
            type: "p",
            text: "Para las elecciones de 2026, el cálculo de las multas electorales se basa en el valor de la Unidad Impositiva Tributaria (UIT), fijada este año en S/ 5,500.",
          },
          {
            type: "p",
            text: "Los montos establecidos son los siguientes:",
          },
          {
            type: "table",
            headers: ["Clasificación del distrito", "Porcentaje de la UIT", "Multa"],
            rows: [
              ["Distrito no pobre", "2% de la UIT", "S/ 110"],
              ["Distrito pobre", "1% de la UIT", "S/ 55"],
              ["Distrito pobre extremo", "0.5% de la UIT", "S/ 27.50"],
            ],
          },
          {
            type: "p",
            text: "Esto significa que un ciudadano que no vote deberá pagar una multa dependiendo de la condición socioeconómica del distrito donde está registrado.",
          },
          {
            type: "chart",
            chartId: "multas-2026",
          },
        ],
      },
      {
        h2: "Multa para miembros de mesa que no asistan",
        content: [
          {
            type: "p",
            text: "Las sanciones son mayores para quienes fueron designados como miembros de mesa y no cumplen con su función el día de las elecciones.",
          },
          {
            type: "p",
            text: "En ese caso, la multa corresponde al 5% de la UIT, lo que equivale a S/ 275.",
          },
          {
            type: "p",
            text: "Si la persona sorteada como miembro de mesa no asiste y tampoco vota, se aplican ambas sanciones:",
          },
          {
            type: "ul",
            items: [
              "Multa por no ser miembro de mesa: S/ 275",
              "Multa por no votar: hasta S/ 110",
            ],
          },
          {
            type: "p",
            text: "En un distrito no pobre, la sanción total podría alcanzar S/ 385.",
          },
        ],
      },
      {
        h2: "Quiénes no están obligados a votar",
        content: [
          {
            type: "p",
            text: "La legislación peruana establece algunas excepciones al voto obligatorio.",
          },
          {
            type: "p",
            text: "No generan multa electoral:",
          },
          {
            type: "ul",
            items: [
              "Personas mayores de 70 años",
              "Ciudadanos que se encuentren fuera del país",
              "Personas con problemas de salud debidamente acreditados",
              "Electores que presenten una justificación o dispensa válida",
            ],
          },
        ],
      },
      {
        h2: "Información útil antes de ir a votar",
        content: [
          {
            type: "p",
            text: "Antes de acudir a las urnas es recomendable revisar algunos datos importantes para evitar inconvenientes el día de la elección.",
          },
          {
            type: "p",
            text: "Por ejemplo, muchos ciudadanos tienen dudas sobre si su documento de identidad está vigente. Si tienes esa inquietud, puedes revisar este artículo de Observa Perú:",
          },
          {
            type: "internalLink",
            href: "/noticias/votar-dni-vencido-elecciones-2026-peru",
            label: "¿Se puede votar con DNI vencido en las Elecciones 2026 en Perú?",
          },
          {
            type: "p",
            text: "Además, los electores pueden consultar su local de votación, número de mesa y orden dentro de la mesa en la plataforma oficial de la autoridad electoral.",
          },
        ],
      },
      {
        h2: "Qué pasa si no pagas la multa electoral",
        content: [
          {
            type: "p",
            text: "No pagar la multa por omisión al voto puede generar algunas restricciones administrativas temporales.",
          },
          {
            type: "ul",
            items: [
              "No poder realizar ciertos trámites notariales",
              "Dificultades para firmar contratos o actos legales",
              "Restricciones en algunos procesos administrativos",
              "Impedimentos para acceder a determinados servicios del Estado",
            ],
          },
          {
            type: "p",
            text: "Por esta razón, las autoridades recomiendan regularizar la situación electoral lo antes posible.",
          },
        ],
      },
      {
        h2: "Más de 27 millones de peruanos están habilitados para votar",
        content: [
          {
            type: "p",
            text: "De acuerdo con el padrón electoral aprobado para las Elecciones Generales de Perú 2026, más de 27 millones de ciudadanos se encuentran habilitados para participar en los comicios.",
          },
          {
            type: "p",
            text: "Además:",
          },
          {
            type: "ul",
            items: [
              "Más de 2.6 millones de peruanos mayores de 70 años tienen voto facultativo.",
              "Cerca de 2.5 millones de jóvenes votarán por primera vez.",
              "Lima Metropolitana concentra la mayor cantidad de electores del país.",
            ],
          },
          {
            type: "chart",
            chartId: "padron-2026",
          },
        ],
      },
      {
        h2: "Qué se elegirá en las elecciones generales 2026",
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
            text: "El proceso electoral también marcará el retorno del Congreso bicameral en el Perú.",
          },
        ],
      },
      {
        h2: "Consulta tu local de votación",
        content: [
          {
            type: "p",
            text: "Antes del día de la elección, los ciudadanos pueden verificar su local de votación, número de mesa y orden dentro de la mesa a través de la plataforma oficial de la Oficina Nacional de Procesos Electorales.",
          },
          {
            type: "link",
            href: "https://consultaelectoral.onpe.gob.pe/inicio",
            label: "Consultar local de votación (ONPE)",
          },
        ],
      },
    ],
    references: [
      "Jurado Nacional de Elecciones. (2026, 14 de enero). JNE actualiza multas electorales según el nuevo valor de la UIT para las Elecciones 2026. Plataforma Digital Única del Estado Peruano. https://portal.jne.gob.pe/",
      "Oficina Nacional de Procesos Electorales. (2026). Elecciones Generales 2026: Multas y justificaciones. https://eg2026.onpe.gob.pe/",
      "Registro Nacional de Identificación y Estado Civil. (2025, 4 de febrero). Más de 27 millones de peruanos están hábiles para sufragar en las elecciones presidenciales 2026. https://identidad.reniec.gob.pe/",
      "Infogob - Observatorio para la Gobernabilidad. (2026). Reporte N° 5: Padrón Electoral Definitivo para las Elecciones Generales 2026. Jurado Nacional de Elecciones.",
    ],
  },

  "cuanto-pagan-miembro-mesa-peru-2026": {
    slug: "cuanto-pagan-miembro-mesa-peru-2026",
    title: "¿Cuánto pagan por ser miembro de mesa en Perú? Pago, beneficios y multas en las Elecciones 2026",
    datePublished: "2026-02-15",
    metaDescription:
      "Cuánto pagan por ser miembro de mesa en Perú 2026: S/ 165 por jornada. Beneficios, multa por no asistir (S/ 275) y cómo ser voluntario.",
    keywords: [
      "cuánto pagan por ser miembro de mesa",
      "pago miembro de mesa Perú",
      "multa miembro de mesa Perú",
      "miembro de mesa voluntario",
      "elecciones Perú 2026",
    ],
    sections: [
      {
        h2: "",
        content: [
          {
            type: "p",
            text: "En cada proceso electoral, miles de ciudadanos peruanos son designados como miembros de mesa, una función clave para garantizar que la votación se desarrolle con transparencia. Sin embargo, muchas personas se preguntan si este trabajo tiene algún tipo de compensación económica y qué sucede si no se cumple con el cargo.",
          },
          {
            type: "p",
            text: "Para las Elecciones Generales 2026, la Oficina Nacional de Procesos Electorales (ONPE) ha establecido incentivos económicos y beneficios para quienes cumplan esta responsabilidad el día de la jornada electoral.",
          },
          {
            type: "p",
            text: "A continuación, te explicamos cuánto se paga por ser miembro de mesa, qué beneficios existen, si se puede participar como voluntario y cuáles son las multas por no asistir.",
          },
        ],
      },
      {
        h2: "¿Cuánto pagan por ser miembro de mesa en Perú en 2026?",
        content: [
          {
            type: "p",
            text: "Para las Elecciones Generales 2026, los miembros de mesa recibirán una compensación económica de S/ 165 por jornada electoral.",
          },
          {
            type: "p",
            text: "Este monto corresponde aproximadamente al 3% de la Unidad Impositiva Tributaria (UIT) vigente y se entrega a quienes cumplan con todas las funciones asignadas durante el proceso de votación.",
          },
          {
            type: "p",
            text: "Si el proceso electoral se desarrolla en dos etapas, el pago se realiza por cada jornada.",
          },
          {
            type: "table",
            headers: ["Escenario electoral", "Pago total"],
            rows: [
              ["Solo primera vuelta", "S/ 165"],
              ["Primera y segunda vuelta", "S/ 330"],
            ],
          },
          {
            type: "p",
            text: "Es decir, si hay segunda vuelta presidencial, los ciudadanos que vuelvan a ejercer el cargo podrían recibir hasta S/ 330 en total.",
          },
          {
            type: "p",
            text: "También puedes leer:",
          },
          {
            type: "internalLink",
            href: "/noticias/votar-dni-vencido-elecciones-2026-peru",
            label: "¿Se puede votar con DNI vencido en las Elecciones 2026 en Perú?",
          },
        ],
      },
      {
        h2: "Beneficios adicionales para los miembros de mesa",
        content: [
          {
            type: "h3",
            text: "Día de descanso remunerado",
          },
          {
            type: "p",
            text: "Los miembros de mesa tienen derecho a un día de descanso remunerado el lunes siguiente a la elección.",
          },
          {
            type: "p",
            text: "Este beneficio aplica para trabajadores del sector público y del sector privado. Además, el descanso no es recuperable, por lo que el empleador no puede exigir que se repongan esas horas de trabajo.",
          },
          {
            type: "h3",
            text: "Alimentación durante la jornada",
          },
          {
            type: "p",
            text: "La ONPE también proporciona kits de refrigerio para los miembros de mesa, ya que la jornada suele comenzar desde las 7:00 a. m., con la instalación de la mesa, y puede extenderse hasta la noche durante el conteo de votos.",
          },
        ],
      },
      {
        h2: "¿Puedo ser miembro de mesa si no fui sorteado?",
        content: [
          {
            type: "p",
            text: "Sí. Aunque la mayoría de miembros de mesa son designados mediante sorteo, también es posible participar como voluntario.",
          },
          {
            type: "p",
            text: "Esto ocurre cuando los miembros titulares o suplentes no se presentan el día de la elección. En esos casos, el personal de la ONPE solicita voluntarios entre los electores que se encuentran en la fila de votación para poder instalar la mesa y permitir que el proceso electoral continúe.",
          },
        ],
      },
      {
        h2: "Requisito para recibir el pago",
        content: [
          {
            type: "p",
            text: "Para que un voluntario pueda cobrar los S/ 165, es indispensable cumplir con un requisito administrativo. Debe:",
          },
          {
            type: "ul",
            items: [
              "Firmar el acta de instalación.",
              "Firmar la hoja de asistencia de miembros de mesa.",
            ],
          },
          {
            type: "p",
            text: "Si una persona solo ayuda de manera informal pero no figura en las actas oficiales, no existirá registro que permita recibir el pago.",
          },
          {
            type: "p",
            text: "Después de la jornada electoral, la ONPE habilita una plataforma en la que los miembros de mesa deben registrar sus datos y elegir la modalidad de cobro. Las opciones suelen incluir:",
          },
          {
            type: "ul",
            items: [
              "Billeteras digitales como Yape o Plin",
              "Depósito en cuenta bancaria",
              "Cobro presencial en el Banco de la Nación",
            ],
          },
        ],
      },
      {
        h2: "Multa por no asistir si fuiste miembro de mesa",
        content: [
          {
            type: "p",
            text: "Si una persona fue sorteada como miembro de mesa —titular o suplente— y no se presenta a cumplir con la función, se aplica una multa electoral.",
          },
          {
            type: "p",
            text: "La sanción por omisión al cargo de miembro de mesa es de S/ 275. Esta multa es independiente de la sanción por no votar.",
          },
        ],
      },
      {
        h2: "¿Qué pasa si no asisto como miembro de mesa pero sí voy a votar?",
        content: [
          {
            type: "p",
            text: "En ese caso ocurre lo siguiente: no recibirás la multa por omisión al sufragio, pero sí deberás pagar la multa por no cumplir el cargo de miembro de mesa.",
          },
          {
            type: "p",
            text: "Es decir, asistir a votar no elimina la multa por incumplir la función asignada.",
          },
        ],
      },
      {
        h2: "¿Quiénes no pueden ser miembros de mesa?",
        content: [
          {
            type: "p",
            text: "La normativa electoral establece que ciertos grupos no pueden ejercer este cargo. Entre ellos se encuentran:",
          },
          {
            type: "ul",
            items: [
              "Candidatos y personeros de organizaciones políticas",
              "Trabajadores del sistema electoral (ONPE, JNE, RENIEC)",
              "Miembros de las Fuerzas Armadas o la Policía Nacional en actividad",
              "Autoridades políticas como prefectos o subprefectos",
            ],
          },
          {
            type: "p",
            text: "En el caso de las personas mayores de 70 años, el cargo es facultativo. Esto significa que si son sorteadas pueden decidir no asistir sin recibir multa.",
          },
        ],
      },
      {
        h2: "¿Cómo presentar una excusa para no ser miembro de mesa?",
        content: [
          {
            type: "p",
            text: "Si una persona tiene un impedimento válido, puede solicitar una excusa al cargo de miembro de mesa.",
          },
          {
            type: "h3",
            text: "Plazo",
          },
          {
            type: "p",
            text: "El trámite debe realizarse hasta cinco días hábiles después de la publicación definitiva de la lista de miembros de mesa.",
          },
          {
            type: "h3",
            text: "Motivos aceptados",
          },
          {
            type: "p",
            text: "Entre las razones que pueden justificar una excusa se encuentran:",
          },
          {
            type: "ul",
            items: [
              "Enfermedad física o mental",
              "Viaje al extranjero",
              "Maternidad o lactancia",
            ],
          },
          {
            type: "p",
            text: "Para que la solicitud sea aceptada, es necesario presentar documentos que respalden la situación, como certificados médicos o partidas de nacimiento.",
          },
        ],
      },
      {
        h2: "¿Se puede ser miembro de mesa con el DNI vencido?",
        content: [
          {
            type: "p",
            text: "Sí. Tener el DNI vencido no impide votar ni ejercer el cargo de miembro de mesa.",
          },
          {
            type: "p",
            text: "Durante los procesos electorales, el Registro Nacional de Identificación y Estado Civil (RENIEC) y el Jurado Nacional de Elecciones (JNE) suelen emitir disposiciones que permiten que los documentos vencidos mantengan vigencia únicamente para fines electorales.",
          },
          {
            type: "p",
            text: "Esto garantiza que ningún ciudadano pierda su derecho al voto por problemas administrativos con su documento de identidad.",
          },
        ],
      },
      {
        h2: "Consulta si eres miembro de mesa",
        content: [
          {
            type: "p",
            text: "Los ciudadanos pueden verificar si han sido designados como miembros de mesa a través de la plataforma oficial de la Oficina Nacional de Procesos Electorales.",
          },
          {
            type: "p",
            text: "También es recomendable revisar con anticipación el local de votación y la mesa asignada para evitar inconvenientes el día de las elecciones.",
          },
          {
            type: "link",
            href: "https://consultaelectoral.onpe.gob.pe/inicio",
            label: "Consultar local de votación y miembros de mesa (ONPE)",
          },
        ],
      },
    ],
    references: [
      "Diario Oficial El Peruano. (29 de enero de 2026). Elecciones 2026: miembros de mesa recibirán una compensación económica de 165 soles. https://elperuano.pe/noticia/288160-elecciones-2026-miembros-de-mesa-recibiran-una-compensacion-economica-de-165-soles",
      "Oficina Nacional de Procesos Electorales [ONPE]. (2026). Miembros de mesa deben registrarse para recibir compensación económica. Plataforma Digital Única del Estado Peruano. https://www.gob.pe/institucion/onpe/noticias",
      "Jurado Nacional de Elecciones [JNE]. (2026). Ley Orgánica de Elecciones N° 26859 y sus modificatorias. Plataforma Digital Única del Estado Peruano. https://www.jne.gob.pe/portal/normatividad",
      "Oficina Nacional de Procesos Electorales [ONPE]. (10 de febrero de 2026). Manual de instrucciones para el miembro de mesa: Elecciones Generales 2026. https://www.gob.pe/institucion/onpe/informes-publicaciones",
      "Registro Nacional de Identificación y Estado Civil [RENIEC]. (2026). Resolución Jefatural sobre vigencia de DNI para las Elecciones Generales 2026. https://www.gob.pe/reniec",
      "El Comercio. (15 de febrero de 2026). Multas electorales 2026: ¿Cuánto deberás pagar si no votas o si faltas a la mesa? https://elcomercio.pe/politica/elecciones/",
    ],
  },
};

export function getNoticiaBySlug(slug: string): ArticuloNoticia | null {
  return ARTICULOS_NOTICIAS[slug] ?? null;
}

export function getAllNoticiasSlugs(): string[] {
  return Object.keys(ARTICULOS_NOTICIAS);
}
