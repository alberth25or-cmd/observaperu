import type { Candidate } from "./candidatos";

export type CandidateDetail = {
  key: string;
  name: string;
  party: string;
  birthDate: string; // Formato: "YYYY-MM-DD" para calcular edad
  age: number;
  img: string;
  imgHover: string;
  planGobiernoUrl: string; // URL a Google Drive
  hojaVidaUrl: string; // URL a Google Drive
  // Contenido de las pestañas
  biografia: string;
  historialAcademico: string[];
  controversias: string[];
  ideologiaPolitica: string;
  financiamiento: {
    total: string;
    sources: string[];
  };
  experiencia: string[];
  logros: string[];
  propuestas: string[];
};

// Función para calcular edad desde fecha de nacimiento
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// Datos de ejemplo - FÁCIL DE MODIFICAR DESPUÉS
// Cada candidato tiene datos inventados que puedes reemplazar fácilmente
// Ordenados alfabéticamente por nombre
export const CANDIDATES_DETAIL: Record<string, Omit<CandidateDetail, "age">> = {
  "alfonso-lopez-chau-nava": {
    key: "alfonso-lopez-chau-nava",
    name: "Alfonso López Chau Nava",
    party: "Ahora Nación",
    birthDate: "1950-07-17", // Ejemplo: basado en la imagen que viste
    img: "/candidatos/alfonso-lopez-chau-nava.webp",
    imgHover: "/partidos/ahora-nacion.webp",
    planGobiernoUrl: "https://drive.google.com/file/d/PLACEHOLDER/view", // Reemplazar con URL real
    hojaVidaUrl: "https://drive.google.com/file/d/PLACEHOLDER/view", // Reemplazar con URL real
    biografia: "Pablo Alfonso López-Chau Nava (Callao, 17 de julio de 1950) es un académico, economista y político peruano. Fue uno de los directores del Banco Central de Reserva del Perú, presidido por Julio Velarde, al ser nombrado por el congreso peruano para el período de 2006 a 2012 y rector de la Universidad Nacional de Ingeniería de 2021 a 2025. Es el fundador y líder del partido político Ahora Nación que participará en las elecciones generales de Perú de 2026.",
    historialAcademico: [
      "Licenciatura en Economía - Universidad Nacional Mayor de San Marcos",
      "Maestría en Economía - Universidad de Chicago",
      "Doctorado en Economía - Universidad de Harvard",
      "Profesor Principal de la Universidad Nacional de Ingeniería",
    ],
    controversias: [
      "Controversia 1: [Descripción de controversia relacionada con su gestión]",
      "Controversia 2: [Descripción de controversia relacionada con declaraciones públicas]",
    ],
    ideologiaPolitica: "Su posición ideológica se ubica en el centro-izquierda con tendencias moderadas y progresistas. Ha manifestado apoyo a políticas de intervención estatal en sectores estratégicos, mientras promueve la inversión privada en otros ámbitos. En temas sociales, se muestra abierto a reformas progresistas.",
    financiamiento: {
      total: "S/ 2,500,000",
      sources: [
        "Aportes propios",
        "Donaciones de simpatizantes",
        "Financiamiento del partido político",
      ],
    },
    experiencia: [
      "Director del Banco Central de Reserva del Perú (2006-2012)",
      "Rector de la Universidad Nacional de Ingeniería (2021-2025)",
      "Profesor de Economía en diversas universidades",
      "Consultor económico en organismos internacionales",
    ],
    logros: [
      "Logro 1: [Descripción de logro importante en su carrera]",
      "Logro 2: [Descripción de logro en gestión pública]",
      "Logro 3: [Descripción de logro académico o profesional]",
    ],
    propuestas: [
      "[Propuesta 1: Descripción de propuesta]",
      "[Propuesta 2: Descripción de propuesta]",
      "[Propuesta 3: Descripción de propuesta]",
    ],
  },
  "cesar-acuna-peralta": {
    key: "cesar-acuna-peralta",
    name: "César Acuña Peralta",
    party: "Alianza para el Progreso",
    birthDate: "1952-08-11",
    img: "/candidatos/cesar-acuna-peralta.webp",
    imgHover: "/partidos/alianza-para-el-progreso.webp",
    planGobiernoUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    hojaVidaUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    biografia: "César Acuña Peralta es un empresario, educador y político peruano. Fundador de la Universidad César Vallejo y líder del partido Alianza para el Progreso. Ha sido alcalde de Trujillo y congresista de la República. Su trayectoria combina el ámbito empresarial, educativo y político.",
    historialAcademico: [
      "Licenciatura en Educación - Universidad Nacional de Trujillo",
      "Maestría en Administración de Empresas",
      "Doctorado en Educación",
    ],
    controversias: [
      "Controversias relacionadas con su gestión como alcalde",
      "Controversias sobre financiamiento de campañas",
    ],
    ideologiaPolitica: "Su posición ideológica se ubica en el centro-derecha, con enfoques conservadores en temas sociales. Promueve la iniciativa privada y políticas de desarrollo económico.",
    financiamiento: {
      total: "S/ 5,000,000",
      sources: [
        "Aportes propios",
        "Financiamiento del partido",
        "Donaciones de empresarios",
      ],
    },
    experiencia: [
      "Alcalde de Trujillo (2007-2010)",
      "Congresista de la República",
      "Fundador y rector de Universidad César Vallejo",
      "Empresario en sector educativo",
    ],
    logros: [
      "Fundación de universidad privada",
      "Gestión municipal en Trujillo",
      "Desarrollo de infraestructura educativa",
    ],
    propuestas: [
      "[Propuesta 1: Descripción de propuesta]",
      "[Propuesta 2: Descripción de propuesta]",
      "[Propuesta 3: Descripción de propuesta]",
    ],
  },
  "ronald-darwin-atencio-sotomayor": {
    key: "ronald-darwin-atencio-sotomayor",
    name: "Ronald Darwin Atencio Sotomayor",
    party: "Alianza Electoral Venceremos",
    birthDate: "1981-09-30",
    img: "/candidatos/ronald-darwin-atencio-sotomayor.webp",
    imgHover: "/partidos/alianza-electoral-venceremos.webp",
    planGobiernoUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    hojaVidaUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    biografia: "Ronald Darwin Atencio Sotomayor nació el 30 de septiembre de 1981 en el departamento de Huánuco. Es abogado de profesión y reside actualmente en el distrito de San Martín de Porres, Lima. Su trayectoria ha ganado notoriedad pública principalmente por su rol en la defensa legal de figuras políticas de alto perfil. En el ámbito empresarial, fue fundador del Centro Jurídico Athena en el año 2010, entidad de la cual se desempeñó como gerente.",
    historialAcademico: [
      "Su formación profesional se centra en el ámbito jurídico, donde ostenta el grado de abogado",
      "Ha complementado su carrera con la docencia universitaria, registrando experiencia en instituciones como la Universidad Privada del Norte entre los años 2022 y 2025",
      "Asimismo, ha brindado asesorías académicas a estudiantes de derecho que buscaban obtener títulos profesionales",
    ],
    controversias: [
      "Denuncias periodísticas han vinculado a la empresa que fundó, el Centro Jurídico Athena, con la presunta venta de servicios de elaboración de tesis para obtener grados académicos. Atencio ha negado cualquier responsabilidad actual, alegando que se desvinculó de la entidad hace años",
      "Su cercanía política y legal con figuras sentenciadas o investigadas por delitos de corrupción y contra los poderes del Estado ha generado debates sobre su idoneidad para el cargo presidencial",
      "En el marco de su defensa legal al expresidente Castillo, fue cuestionado por las estrategias utilizadas durante las audiencias de prisión preventiva",
    ],
    ideologiaPolitica: "Atencio postula a la presidencia por la Alianza Electoral Venceremos, una coalición que agrupa movimientos como Voces del Pueblo. Su postura política se enmarca en el socialismo democrático y el progresismo. Entre sus planteamientos ideológicos fundamentales destaca la propuesta de convocar a un referéndum para una Asamblea Constituyente que redacte una nueva Constitución Política para el Perú.",
    financiamiento: {
      total: "S/ 204,290.00",
      sources: [
        "De acuerdo con su declaración de bienes y rentas, registra un total de bienes muebles valorizados en S/ 204,290.00, que incluye vehículos de las marcas Honda y Kia",
        "Asimismo, declara poseer el 95% de acciones en la empresa Grupo Jurídico Athena S.A.C. y ser propietario de una marca registrada ante Indecopi",
      ],
    },
    experiencia: [
      "Se desempeñó como Asesor 1 en el Congreso de la República del Perú",
      "Ha ejercido la docencia universitaria en facultades de derecho",
      "Es reconocido por su práctica privada en defensa penal, habiendo asumido la defensa del expresidente Pedro Castillo Terrones en investigaciones por el presunto delito de rebelión tras el intento de golpe de Estado de 2022",
      "Representó legalmente al congresista Guillermo Bermejo en procesos judiciales",
      "Lideró denuncias constitucionales contra altos funcionarios del sistema de justicia, como la presentada contra la ex Fiscal de la Nación, Patricia Benavides",
      "Fue fundador del Centro Jurídico Athena en el año 2010, entidad de la cual se desempeñó como gerente",
    ],
    logros: [
      "Es reconocido por su práctica privada en defensa penal, habiendo asumido la defensa del expresidente Pedro Castillo Terrones en investigaciones por el presunto delito de rebelión tras el intento de golpe de Estado de 2022",
      "Representó legalmente al congresista Guillermo Bermejo en procesos judiciales",
      "Lideró denuncias constitucionales contra altos funcionarios del sistema de justicia, como la presentada contra la ex Fiscal de la Nación, Patricia Benavides",
      "Fundador del Centro Jurídico Athena en el año 2010, entidad de la cual se desempeñó como gerente",
    ],
    propuestas: [
      "Reforma Constitucional en Salud: Propone modificar la Constitución para reconocer la salud y la seguridad social como derechos fundamentales, universales y gratuitos, garantizados por el Estado",
      "Sistema Único de Salud: Creación de un sistema público de salud único que unifique los diversos subsistemas actuales (como EsSalud y el MINSA) para eliminar la segmentación por niveles de ingreso",
      "Nueva Gobernanza Descentralizada: Reorganización del Ministerio de Salud (MINSA) para fortalecer sus funciones de dirección política y planificación, otorgando mayores capacidades de gestión a los gobiernos regionales (DIRESA/GERESA)",
      "Control Ciudadano: Implementación de comités ciudadanos y mecanismos de participación social vinculante en las redes integrales de salud para garantizar la rendición de cuentas",
    ],
  },
  "rosario-del-pilar-fernandez-bazan": {
    key: "rosario-del-pilar-fernandez-bazan",
    name: "Rosario del Pilar Fernández Bazán",
    party: "Un Camino Diferente",
    birthDate: "1975-01-19",
    img: "/candidatos/rosario-del-pilar-fernandez-bazan.webp",
    imgHover: "/partidos/un-camino-diferente.webp",
    planGobiernoUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    hojaVidaUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    biografia: "Rosario del Pilar Fernández Bazán nació el 19 de enero de 1975 en el distrito y provincia de Trujillo, departamento de La Libertad. Actualmente reside en su ciudad natal y es una figura clave dentro de la organización política que representa. Se identifica como fundadora del partido Un Camino Diferente, ocupando cargos de alta responsabilidad desde el año 2024, incluyendo la presidencia fundadora y el rol de personero legal alterno.",
    historialAcademico: [
      "Bachiller en Educación por la Universidad Privada César Vallejo, grado obtenido en el año 2001",
      "Estudios técnicos en Educación Inicial en el Instituto Pedagógico Indoamérica",
      "Estudios primarios y secundarios concluidos en instituciones locales",
    ],
    controversias: [
      "En su declaración jurada oficial de hoja de vida, la candidata no registra sentencias condenatorias firmes por delitos dolosos ni demandas fundadas por incumplimiento de obligaciones familiares, laborales o violencia familiar. No obstante, a nivel organizacional, el partido ha enfrentado cuestionamientos públicos por denuncias de ciudadanos que alegaron haber sido afiliados sin su consentimiento durante el proceso de inscripción. Además, se han reportado disputas internas con otros fundadores que acusaron intentos de apropiación de la estructura partidaria.",
    ],
    ideologiaPolitica: "La candidata lidera una organización que se define formalmente como un partido de centro. Su doctrina se fundamenta en la defensa de la igualdad, la libertad y el estado de derecho. Promueven una economía social de mercado con justicia social y una visión de Estado gestor que garantice servicios básicos de calidad en salud, educación y justicia. Aunque se asocia al partido con posturas populistas en algunos análisis externos, su estatuto oficial enfatiza el fortalecimiento de la democracia y la lucha contra la corrupción.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Respecto a su patrimonio personal declarado ante el sistema electoral, la candidata registra bienes inmuebles por un valor de autovaluo que supera los 100,000 soles, incluyendo predios en la urbanización Santa María en Trujillo. Asimismo, declara la propiedad de un vehículo valorado en 35,000 soles.",
        "El financiamiento de la organización política, de acuerdo con sus estatutos, debe regirse por un sistema de control interno conforme a la Ley de Organizaciones Políticas para garantizar la transparencia en el uso de recursos.",
      ],
    },
    experiencia: [
      "Docente en la Institución Educativa Particular (IEP) Jan Komesky en Trujillo durante dos décadas, desde el año 2005 hasta el 2025",
      "Fundadora y líder del partido Un Camino Diferente, ocupando cargos de alta responsabilidad desde el año 2024, incluyendo la presidencia fundadora y el rol de personero legal alterno",
    ],
    logros: [
      "Ha ejercido como docente en la Institución Educativa Particular (IEP) Jan Komesky en Trujillo durante dos décadas, desde el año 2005 hasta el 2025",
      "Su principal logro es haber liderado la fundación y el proceso de inscripción formal del partido Un Camino Diferente ante el Registro de Organizaciones Políticas (ROP)",
    ],
    propuestas: [
      "Seguridad y Orden Interno: La propuesta más disruptiva es el restablecimiento del orden mediante la creación de 10 escuadrones de la vida a nivel nacional. Cada unidad contaría con 1,000 efectivos de las fuerzas armadas para reducir la delincuencia en un plazo proyectado de tres meses",
      "Reforma del Estado: Propone una optimización del aparato estatal mediante la reducción y fusión de ministerios para disminuir el gasto administrativo ineficiente. Además, busca la digitalización total de los procesos públicos para reducir los tiempos de trámites para el ciudadano",
      "Salud y Educación: En salud, la meta es alcanzar una cobertura preventiva superior al 90% de la población. En educación, plantea la modernización curricular orientada a la empleabilidad juvenil y técnica, buscando una vinculación directa entre la formación académica y el mercado laboral",
      "Crecimiento Económico: Su enfoque se centra en la reducción de la informalidad laboral mediante incentivos para la generación de empleo formal y la atracción de inversión privada sostenida",
    ],
  },
  "mario-enrique-vizcarra-cornejo": {
    key: "mario-enrique-vizcarra-cornejo",
    name: "Mario Enrique Vizcarra Cornejo",
    party: "Perú Primero",
    birthDate: "1954-07-12",
    img: "/candidatos/mario-vizcarra.webp",
    imgHover: "/partidos/peru-primero.webp",
    planGobiernoUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    hojaVidaUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    biografia: "Mario Enrique Vizcarra Cornejo nació el 12 de julio de 1954 en la provincia de Mariscal Nieto, Moquegua. Hermano mayor del expresidente Martín Vizcarra, su figura ha cobrado relevancia política nacional tras la inhabilitación de este último. Reside actualmente en su ciudad natal y es identificado en el ámbito político como el \"Plan B\" o sucesor natural del liderazgo de su hermano dentro de la organización Perú Primero.",
    historialAcademico: [
      "Pregrado: Ingeniero Industrial por la Universidad Nacional de Ingeniería (UNI), graduado en 1978",
      "Posgrado: Magíster en Administración por la Universidad ESAN, título obtenido en el año 2003",
    ],
    controversias: [
      "Condena por Peculado: Registra una sentencia por el delito de peculado que data de años anteriores. Esta condena fue el fundamento para que el Jurado Electoral Especial (JEE) de Lima Centro 1 declarara improcedente su candidatura en enero de 2026, basándose en el artículo 107 de la Ley Orgánica de Elecciones, que impide postular a personas con sentencias firmes por delitos contra la administración pública.",
      "Vínculo Familiar y Prisión de su Hermano: Su candidatura es percibida por críticos como una vía para buscar el indulto de Martín Vizcarra, quien se encuentra cumpliendo condena en el penal de Barbadillo. Mario Vizcarra ha declarado públicamente que indultaría no solo a su hermano, sino a todos los expresidentes recluidos.",
    ],
    ideologiaPolitica: "El candidato representa al partido Perú Primero, cuya base ideológica se define bajo los siguientes pilares: Humanismo y Democracia: Se posicionan como una organización con vocación democrática representativa, centrada en el servicio al pueblo y el respeto al Estado de derecho. Economía Social de Mercado: Defienden la propiedad privada y la inversión como motores de desarrollo, pero con una regulación estatal que busque reducir las desigualdades. Posturas Progresistas: En declaraciones públicas, Mario Vizcarra ha manifestado estar a favor de la legalización del aborto, el matrimonio LGBT y, en términos de política de drogas, ha mencionado posturas abiertas sobre la regulación de la cocaína.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Recursos Propios y Aportes: De acuerdo con los estatutos del partido, el financiamiento se basa en cuotas de afiliados y aportaciones permitidas por la ONPE. Sin embargo, la organización ha enfrentado cuestionamientos por la procedencia de fondos vinculados a las redes políticas previas de su fundador.",
      ],
    },
    experiencia: [
      "Gerente Administrativo en Agrotécnica Estuquiña S.A.: Cargo que desempeña desde 1998 hasta la actualidad (2025)",
      "Gerente Administrativo en C&M Vizcarra SAC: Empresa familiar donde laboró entre los años 1993 y 2017",
      "Miembro de la Comisión Política Nacional de Perú Primero: Cargo que ocupa desde 2025",
      "Vocero Oficial: Ha actuado como el principal representante y defensor de la plataforma política de su hermano durante los procesos judiciales de este",
    ],
    logros: [
      "Aunque su perfil ha sido predominantemente técnico-privado, destaca su rol actual como Miembro de la Comisión Política Nacional de Perú Primero: Cargo que ocupa desde 2025",
      "Vocero Oficial: Ha actuado como el principal representante y defensor de la plataforma política de su hermano durante los procesos judiciales de este",
    ],
    propuestas: [
      "Educación Digital: Meta de lograr que el 100% de las instituciones educativas de primaria y secundaria tengan acceso a internet de calidad para 2031",
      "Salud Infantil: Reducción de la anemia infantil a menos del 20% y de la desnutrición crónica a menos del 10% mediante programas de prevención y vigilancia",
      "Reactivación Económica: Fomento del empleo mediante el desarrollo productivo y el impulso a la inversión privada para enfrentar la crisis social",
      "Lucha contra la Pobreza: Ampliación de la cobertura de programas sociales para identificar y atender al 100% de los hogares en situación de vulnerabilidad extrema",
    ],
  },
  "yonhy-lescano-ancieta": {
    key: "yonhy-lescano-ancieta",
    name: "Yonhy Lescano Ancieta",
    party: "Partido Político Cooperación Popular",
    birthDate: "1959-02-15",
    img: "/candidatos/yonhy-lescano-ancieta.webp",
    imgHover: "/partidos/cooperacion-popular.webp",
    planGobiernoUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    hojaVidaUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    biografia: "Yonhy Lescano Ancieta nació el 15 de febrero de 1959 en la ciudad de Puno. Es hijo de Pablo Lescano Marín y Teresa Ancieta Hurtado. Su formación primaria se desarrolló en un núcleo educativo campesino en Ccota, distrito de Platería. Actualmente reside en el distrito de Santiago de Surco, en Lima.",
    historialAcademico: [
      "Pregrado: Se graduó como Bachiller en Derecho en 1999 y obtuvo el título de Abogado en el mismo año, ambos grados otorgados por la Universidad Católica de Santa María",
      "Posgrado: Ostenta el grado de Magíster en Derecho por la Universidad de Chile, obtenido en el año 2022. Además, registra estudios de posgrado en la Universidad Nacional del Altiplano",
    ],
    controversias: [
      "Denuncia por Acoso Sexual: En 2019, enfrentó una denuncia por presunto acoso sexual tras la difusión de mensajes de WhatsApp por parte de una periodista. El Congreso lo suspendió por 120 días. El candidato negó los cargos, alegando una manipulación de su teléfono. El caso fue archivado definitivamente por la Fiscalía en marzo de 2020 al no hallarse elementos de convicción suficientes.",
      "Sanción Administrativa Reciente: En mayo de 2025, durante su desempeño como asesor en el Congreso, recibió una sanción de suspensión de 15 días sin goce de haber por declaraciones públicas que, según el órgano disciplinario, afectaron la imagen de la institución.",
    ],
    ideologiaPolitica: "Lescano se define políticamente dentro del espectro de la centro-izquierda. Tras una extensa militancia en el partido Acción Popular (2000-2023), del cual fue Secretario General, actualmente postula por el Partido Político Cooperación Popular. Su postura se centra en lo que denomina la recuperación de valores éticos en el gobierno y el fortalecimiento de la justicia social.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Para las elecciones generales de 2026, el financiamiento de las organizaciones políticas incluye la asignación de fondos por parte del Estado para la franja electoral. El candidato promueve en su plan la transparencia total mediante la fiscalización ciudadana a través de datos abiertos para verificar el uso de recursos.",
      ],
    },
    experiencia: [
      "Sector Público: Se desempeñó como congresista de la República durante cuatro periodos consecutivos entre los años 2001 y 2019. Recientemente, entre 2021 y 2025, laboró como asesor en el Congreso de la República",
      "Sector Académico: Ha ejercido como profesor principal en la Universidad Nacional del Altiplano en Puno",
    ],
    logros: [
      "Durante su trayectoria legislativa, destacó por presidir la Comisión de Defensa del Consumidor y Organismos Reguladores de los Servicios Públicos",
      "Ha sido ponente en diversos eventos académicos y es autor de trabajos de investigación jurídica en derecho privado",
    ],
    propuestas: [
      "Educación: Propone una declaratoria de emergencia en el sector para incrementar el presupuesto al 10% del PBI. Incluye la reconstrucción de 27,000 instituciones educativas, la capacitación del magisterio y la adquisición de un satélite de telecomunicaciones para garantizar acceso a internet",
      "Reforma Constitucional: Impulsa la aprobación de una nueva Constitución Política a través de una Asamblea Constituyente o mediante reformas en el Congreso, con el fin de establecer un nuevo marco para la justicia social",
      "Salud: Plantea asegurar el suministro total de medicinas y equipar centros de salud primarios con atención en tres turnos (mañana, tarde y noche)",
      "Infraestructura: Licitación y construcción de la autopista Tumbes-Tacna, además de la instalación de trenes de cercanía y servicios interprovinciales",
      "Seguridad y Justicia: Propone la creación de una plataforma digital con inteligencia artificial para la vigilancia ciudadana del gasto público y obras en tiempo real",
    ],
  },
  "vladimir-roy-cerron-rojas": {
    key: "vladimir-roy-cerron-rojas",
    name: "Vladimir Roy Cerrón Rojas",
    party: "Partido Político Nacional Perú Libre",
    birthDate: "1970-12-16",
    img: "/candidatos/vladimir-roy-cerron-rojas.webp",
    imgHover: "/partidos/peru-libre.webp",
    planGobiernoUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    hojaVidaUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    biografia: "Vladimir Roy Cerrón Rojas nació el 16 de diciembre de 1970 en el distrito de Chupaca, provincia de Chupaca, departamento de Junín. Con 55 años de edad a la fecha de la elección, se presenta como la figura central y fundador de Perú Libre. Su trayectoria combina el ejercicio de la medicina con una activa y persistente carrera política en su región natal y, posteriormente, a nivel nacional.",
    historialAcademico: [
      "Médico neurocirujano asistente en el Hospital Nacional Essalud de Huancayo desde el año 2003 hasta el 2019",
      "Profesor auxiliar nombrado en la Universidad Nacional del Centro del Perú",
    ],
    controversias: [
      "Credenciales Revocadas: Mediante la Resolución N.° 4165-2022-JNE, el Jurado Nacional de Elecciones dejó sin efecto de modo definitivo su credencial como Gobernador Regional de Junín en diciembre de 2022",
      "Antecedentes Partidarios: Previo a la fundación de su actual partido, registró su renuncia al Partido Nacionalista Peruano",
    ],
    ideologiaPolitica: "La ideología de Cerrón y Perú Libre se define por un rechazo frontal al modelo económico actual, calificándolo de \"neoliberal\" y \"mercantilista\". Su propuesta se basa en: Estado de Bienestar y Justicia Social: Busca que el Estado asuma la responsabilidad directa y gratuita de servicios básicos como salud y educación. Plurinacionalismo: Propone reconocer constitucionalmente al Perú como un Estado plurinacional, integrando formalmente la justicia y los derechos de los pueblos originarios. Soberanía y Nacionalización: Aboga por la recuperación de la capacidad estatal para intervenir y nacionalizar sectores estratégicos de la economía.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "[Información de financiamiento no especificada en los datos proporcionados]",
      ],
    },
    experiencia: [
      "Gobernador Regional de Junín: Ejerció el cargo desde enero de 2019, aunque su mandato fue interrumpido por decisiones judiciales y resoluciones del Jurado Nacional de Elecciones",
      "Liderazgo Partidario: Es el Secretario General Nacional del Partido Político Nacional Perú Libre, cargo que ostenta desde la inscripción oficial del partido en 2019 y en el cual ha sido reelecto continuamente",
      "Representación Regional: Fue designado director del Consejo Directivo de la Superintendencia Nacional de Salud (SUSALUD) en representación de la Asamblea Nacional de Gobiernos Regionales en 2019",
    ],
    logros: [
      "Gobernador Regional de Junín: Ejerció el cargo desde enero de 2019, aunque su mandato fue interrumpido por decisiones judiciales y resoluciones del Jurado Nacional de Elecciones",
      "Liderazgo Partidario: Es el Secretario General Nacional del Partido Político Nacional Perú Libre, cargo que ostenta desde la inscripción oficial del partido en 2019 y en el cual ha sido reelecto continuamente",
      "Representación Regional: Fue designado director del Consejo Directivo de la Superintendencia Nacional de Salud (SUSALUD) en representación de la Asamblea Nacional de Gobiernos Regionales en 2019",
    ],
    propuestas: [
      "Sistema Único de Salud: Propone un modelo universal, gratuito y preventivo, buscando eliminar las prácticas \"oligopólicas\" en el sector salud y alcanzar un gasto público del 10% del PBI",
      "Expansión Universitaria: Meta de crear entre 40 y 50 nuevas universidades públicas regionales para descentralizar el acceso a la educación superior",
      "Nueva Constitución: Desmontar el marco legal de la Constitución de 1993 mediante la eliminación de \"candados\" constitucionales y la revisión total de contratos-ley estratégicos",
      "Descentralización Fiscal: Transferir competencias estratégicas y asegurar que al menos el 95% del presupuesto de inversión pública sea ejecutado por regiones y municipalidades",
      "Derechos Laborales: Aprobación de una Nueva Ley General del Trabajo para restituir derechos que consideran recortados y fortalecer la negociación colectiva",
      "Titulación Masiva: Otorgar 500,000 títulos de propiedad urbana al año 2030 para familias de sectores populares",
      "Sistema Previsional: Implementar un sistema de pensiones universal, solidario y público, garantizando una pensión básica para todos los adultos mayores",
    ],
  },
  "walter-gilmer-chirinos-purizaga": {
    key: "walter-gilmer-chirinos-purizaga",
    name: "Walter Gilmer Chirinos Purizaga",
    party: "Partido Político PRIN",
    birthDate: "1968-06-27",
    img: "/candidatos/walter-gilmer-chirinos-purizaga.webp",
    imgHover: "/partidos/partido-regionalista-de-integracion-nacional.webp",
    planGobiernoUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    hojaVidaUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    biografia: "Walter Gilmer Chirinos Purizaga nació el 27 de junio de 1968 en Paiján, Ascope, en el departamento de La Libertad. Actualmente registra su domicilio en el distrito de La Molina, en Lima. Es el fundador de su actual organización política y se presenta como la figura principal de este movimiento de alcance nacional.",
    historialAcademico: [
      "Estudios Técnicos: Es egresado de la carrera de Mercadotecnia por el instituto Computron",
      "Pregrado: Posee el título profesional de Contador Público (2016) y el grado de Bachiller en Contabilidad y Finanzas (2013), ambos obtenidos en la Universidad Privada Telesup",
      "Posgrado: Cursó estudios de Maestría en Gestión Pública en la Universidad Nacional Enrique Guzmán y Valle, los cuales figuran en su registro como no concluidos",
    ],
    controversias: [
      "En su hoja de vida oficial presentada ante los entes electorales, el candidato no registra sentencias condenatorias firmes por delitos dolosos, ni demandas fundadas por incumplimiento de obligaciones alimentarias, contractuales o laborales. Sin embargo, registra una renuncia previa al partido Renovación Popular en el año 2014.",
    ],
    ideologiaPolitica: "La postura del candidato y su partido se fundamenta en un regionalismo integrador que busca descentralizar el poder y los recursos del Estado. Su enfoque combina la eficiencia de la gestión privada con el fortalecimiento institucional, promoviendo la meritocracia en la administración pública y la defensa de la inversión privada como motor económico.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Ingresos Anuales: Según su última declaración jurada (correspondiente al año fiscal 2024), reportó un ingreso total de 24,000 soles, provenientes exclusivamente del sector privado bajo la modalidad de ejercicio individual de su profesión (rentas de cuarta categoría)",
        "Patrimonio Inmueble: Registra una propiedad (casa habitación) en Trujillo valorizada en 200,000 soles",
        "Patrimonio Mueble: Declaró la posesión de un vehículo valorizado en 45,000 soles",
      ],
    },
    experiencia: [
      "Sector Público: Se desempeñó como Director General de Gobierno del Interior en el Ministerio del Interior (MININTER) durante el año 2018",
      "Ámbito Político: Ha ejercido roles directivos dentro de su partido, actuando como Apoderado Legal y Fundador del PRIN desde el año 2022 hasta la actualidad",
    ],
    logros: [
      "Fundación Partidaria: Logró la inscripción y consolidación del Partido Regionalista de Integración Nacional (PRIN) ante el Jurado Nacional de Elecciones, posicionándolo como una alternativa para los comicios generales",
      "Gestión en el Ejecutivo: Alcanzó un cargo de confianza de nivel nacional como Director General en el MININTER, supervisando aspectos de gobierno interior en el país",
    ],
    propuestas: [
      "Seguridad Ciudadana: Implementar una lucha frontal con la meta de reducir la tasa de delitos denunciados en un 40% al año 2031 e incrementar la capacidad operativa de la Policía Nacional en un 50%",
      "Reforma del Estado y Corrupción: Propone una reingeniería para reducir el aparato estatal en un 25% y asegurar que el 90% de las contrataciones públicas se basen estrictamente en la meritocracia",
      "Economía y Empleo: Buscar un crecimiento promedio del PBI del 5% anual, reduciendo la informalidad laboral del 70% al 50% mediante incentivos para la formalización de MIPYMES",
      "Ambiente y Recursos: Reducir la deforestación en un 60% y asegurar que el 95% de la población tenga acceso a agua potable segura para el final del quinquenio",
      "Transparencia: El compromiso de rendición de cuentas incluye informes trimestrales de avance y audiencias públicas regionales para informar sobre el cumplimiento del plan",
    ],
  },
  // Agregar más candidatos aquí siguiendo el mismo patrón
  // Ordenados alfabéticamente por nombre
};

// Función para generar datos por defecto cuando no existen
function generateDefaultDetail(candidate: Candidate): Omit<CandidateDetail, "age"> {
  // Generar fecha de nacimiento aleatoria (entre 1950 y 1980)
  const year = 1950 + Math.floor(Math.random() * 30);
  const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
  const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, "0");
  const birthDate = `${year}-${month}-${day}`;

  return {
    key: candidate.key,
    name: candidate.name,
    party: candidate.party,
    birthDate,
    img: candidate.img,
    imgHover: candidate.imgHover,
    planGobiernoUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    hojaVidaUrl: "https://drive.google.com/file/d/PLACEHOLDER/view",
    biografia: `${candidate.name} es un político peruano afiliado al partido ${candidate.party}. [Información biográfica pendiente de actualizar con datos reales.]`,
    historialAcademico: [
      "Educación secundaria completa",
      "[Información académica pendiente de actualizar]",
    ],
    controversias: [
      "[Información de controversias pendiente de actualizar]",
    ],
    ideologiaPolitica: `Su posición ideológica se ubica en ${candidate.econLabel} en temas económicos y ${candidate.socialLabel} en temas sociales. [Descripción detallada pendiente de actualizar.]`,
    financiamiento: {
      total: "S/ 0,000,000",
      sources: [
        "[Fuentes de financiamiento pendientes de actualizar]",
      ],
    },
    experiencia: [
      "[Experiencia profesional pendiente de actualizar]",
    ],
    logros: [
      "[Logros pendientes de actualizar]",
    ],
    propuestas: [
      "[Propuestas pendientes de actualizar]",
    ],
  };
}

// Función helper para obtener datos completos de un candidato
export function getCandidateDetail(key: string, candidate?: Candidate): CandidateDetail | null {
  let detail = CANDIDATES_DETAIL[key];
  
  // Si no existe, generar datos por defecto si tenemos el candidato
  if (!detail && candidate) {
    detail = generateDefaultDetail(candidate);
  } else if (!detail) {
    return null;
  }
  
  return {
    ...detail,
    age: calculateAge(detail.birthDate),
  };
}

// Función para obtener todos los detalles (para inicializar datos faltantes)
export function getAllCandidateDetails(): CandidateDetail[] {
  return Object.values(CANDIDATES_DETAIL).map((detail) => ({
    ...detail,
    age: calculateAge(detail.birthDate),
  }));
}

