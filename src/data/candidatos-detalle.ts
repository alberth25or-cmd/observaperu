import type { Candidate } from "./candidatos";

export type CandidateDetail = {
  key: string;
  name: string;
  party: string;
  birthDate: string; // Formato: "YYYY-MM-DD" para calcular edad
  age: number;
  img: string;
  imgHover: string;
  planGobiernoUrl: string | null; // URL a Google Drive o null si no existe
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
    birthDate: "1950-07-17",
    img: "/candidatos/alfonso-lopez-chau-nava.webp",
    imgHover: "/partidos/ahora-nacion.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/alfonso-lopez-chau-nava.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/alfonso-lopez-chau-nava.pdf",
    biografia: "Pablo Alfonso López Chau Nava nació el 17 de julio de 1950 en la ciudad de Lima. Con 75 años de edad al momento de la elección, se presenta como el rostro principal de la organización política Ahora Nación. Su trayectoria profesional ha estado profundamente ligada a la academia y la gestión universitaria, destacando su rol como Rector de la Universidad Nacional de Ingeniería (UNI) entre los años 2021 y 2025. Su vida pública ha estado marcada por un perfil técnico-académico, habiendo desempeñado funciones de docencia principal desde 1990. Su carrera se ha concentrado en el sector público, específicamente en la educación superior. Es fundador de la organización política Ahora Nación y actualmente ejerce como su presidente.",
    historialAcademico: [
      "Pregrado: Es Licenciado en Economía y Bachiller en Ciencias Económicas por la Universidad Nacional del Callao, habiendo obtenido su título profesional en 1981",
      "Posgrado: Cuenta con una Maestría en Economía (2002) obtenida en la Universidad Nacional Autónoma de México (UNAM)",
      "Posgrado: Doctorado en Economía (2005) obtenido en la Universidad Nacional Autónoma de México (UNAM)",
      "Profesor Principal: Ha mantenido su condición de profesor principal en la Universidad Nacional de Ingeniería por más de tres décadas, habiendo desempeñado funciones de docencia principal desde 1990",
    ],
    controversias: [
      "En su declaración oficial ante el Jurado Nacional de Elecciones, el candidato manifiesta no tener sentencias condenatorias por delitos dolosos ni fallos fundados por incumplimiento de obligaciones familiares, laborales o contractuales",
      "Registra una renuncia previa a la agrupación Unión por el Perú en el año 2010",
    ],
    ideologiaPolitica: "López Chau lidera un proyecto que se define bajo la denominación de Ahora Nación (AN). Su postura actual se inclina hacia un enfoque de fortalecimiento de la institucionalidad estatal, con énfasis en la descentralización y la meritocracia dentro del aparato público. El plan de gobierno de Ahora Nación se estructura en dimensiones sociales, institucionales y económicas, con metas específicas para el periodo 2026-2031, priorizando la seguridad, justicia, economía, desarrollo regional, educación, salud, protección social y vivienda.",
    financiamiento: {
      total: "S/ 350,000 (remuneración bruta anual 2024)",
      sources: [
        "Ingresos: Según su declaración jurada de ingresos y bienes correspondiente al año fiscal 2024, reportó una remuneración bruta anual de 350,000 soles proveniente exclusivamente del sector público",
        "Bienes Inmuebles: Declara la propiedad de un departamento y una cochera en el distrito de Miraflores, Lima, con un valor total autovaluado de 295,000 soles",
        "Financiamiento Partidario: El financiamiento de sus actividades políticas se gestiona a través de la organización política Ahora Nación",
      ],
    },
    experiencia: [
      "Gestión Universitaria: Ejerció el cargo de Rector de la Universidad Nacional de Ingeniería (UNI) entre los años 2021 y 2025",
      "Director de la Escuela de Ingeniería Económica: Previamente fue Director de la Escuela de Ingeniería Económica en la misma casa de estudios (2017-2019)",
      "Docencia: Ha mantenido su condición de profesor principal en la Universidad Nacional de Ingeniería por más de tres décadas, habiendo desempeñado funciones de docencia principal desde 1990",
      "Liderazgo Político: Es fundador de la organización política Ahora Nación y actualmente ejerce como su presidente",
      "Militancia Política: En su historial de filiación política, registra una renuncia previa a la agrupación Unión por el Perú en el año 2010",
    ],
    logros: [
      "Obtención del título profesional de Licenciado en Economía y Bachiller en Ciencias Económicas por la Universidad Nacional del Callao (1981)",
      "Obtención de Maestría en Economía en la Universidad Nacional Autónoma de México (UNAM) (2002)",
      "Obtención de Doctorado en Economía en la Universidad Nacional Autónoma de México (UNAM) (2005)",
      "Desempeño como profesor principal en la Universidad Nacional de Ingeniería por más de tres décadas, desde 1990",
      "Dirección de la Escuela de Ingeniería Económica en la Universidad Nacional de Ingeniería (2017-2019)",
      "Ejercicio del cargo de Rector de la Universidad Nacional de Ingeniería (UNI) entre los años 2021 y 2025",
      "Fundación de la organización política Ahora Nación",
      "Liderazgo como presidente de la organización política Ahora Nación",
    ],
    propuestas: [
      "Seguridad y Justicia: Reducción de la victimización por hechos delictivos en zonas urbanas a un 17.2%",
      "Implementación de 5 Complejos Desconcentrados Especializados en Investigación Criminal (CODEIC) en regiones",
      "Creación de un sistema de detección de demanda de agentes de inteligencia para fortalecer las comisarías con mayor incidencia delictiva",
      "Economía y Desarrollo Regional: Alcanzar una tasa de crecimiento económico real promedio anual del 6%",
      "Diversificación de la matriz productiva mediante un nuevo plan nacional que priorice agroindustria, manufactura avanzada y energías renovables",
      "Creación de una entidad autónoma y meritocrática para la ejecución de obras públicas en regiones",
      "Implementación de un sistema comercial denominado \"Made in Peru\" para posicionar productos industriales de alto valor en mercados globales",
      "Educación y Salud: Garantizar el 100% de cobertura en educación inicial para niños de 3 a 5 años",
      "Asegurar que el 100% de los establecimientos de salud del primer nivel cuenten con equipamiento básico y personal capacitado",
      "Implementación de historia clínica electrónica interoperable en el 100% de los centros de salud",
      "Protección Social y Vivienda: Entrega de 50,000 títulos de propiedad urbana y ejecución de 50,000 viviendas sociales mediante inversión público-privada",
      "Implementación de una pensión digna para el 100% de adultos mayores en situación de extrema pobreza",
    ],
  },
  "alex-gonzalez-castillo": {
    key: "alex-gonzalez-castillo",
    name: "Alex Gonzales Castillo",
    party: "Partido Demócrata Verde",
    birthDate: "1961-11-24",
    img: "/candidatos/alex-gonzalez-castillo.webp",
    imgHover: "/partidos/partido-democrata-verde.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/alex-gonzalez-castillo.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/alex-gonzalez-castillo.pdf",
    biografia: "Nacido el 24 de noviembre de 1961 en Lima, Alex Gonzales Castillo es un político con una trayectoria marcada por su vinculación al ecologismo y la gestión municipal. Actualmente reside en el distrito de La Victoria y lidera el Partido Demócrata Verde, organización con la que postula a la Presidencia de la República y simultáneamente al cargo de Senador. Su perfil se ha construido desde la sociedad civil a través de institutos especializados en ecología y derecho antes de saltar a la primera línea de la administración pública.",
    historialAcademico: [
      "Estudios Universitarios: Cursó la carrera de Administración en la Universidad Inca Garcilaso de la Vega, aunque registra dicho grado como no concluido",
      "Formación Técnica/Especializada: Cuenta con estudios concluidos en Conciliación Extrajudicial por la Dirección de Conciliación del Ministerio de Justicia (MINJUS)",
      "Educación Básica: Completó satisfactoriamente sus estudios primarios y secundarios",
    ],
    controversias: [
      "En su declaración de hoja de vida, el candidato menciona situaciones de índole registral: Propiedades No Reconocidas: Reporta múltiples vehículos y predios en registros públicos que él formalmente declara \"no reconocer como suyos\"",
      "Vehículos: Informa que un vehículo (mototaxi) fue entregado en parte de pago en Maynas pero la transferencia no fue formalizada, por lo que aún figura bajo su nombre",
      "Sentencias: El candidato declara no tener sentencias condenatorias por delitos dolosos ni demandas fundadas por obligaciones alimentarias o violencia familiar",
    ],
    ideologiaPolitica: "Su plataforma se define por un enfoque ecologista y social-demócrata, bajo la denominación de \"Demócrata Verde\". El plan de gobierno prioriza la sostenibilidad ambiental, la lucha contra la desigualdad territorial y la reforma de la gobernanza estatal mediante la reducción de la fragmentación del Estado (el llamado \"Estado mosaico\").",
    financiamiento: {
      total: "S/ 36,000.00 (ingresos anuales 2024) + patrimonio inmobiliario y acciones",
      sources: [
        "Ingresos: Declaró ingresos brutos anuales por S/ 36,000.00 provenientes del sector privado durante el año fiscal 2024",
        "Bienes Inmuebles: Reporta siete propiedades, incluyendo inmuebles en San Isidro, La Victoria, Comas y Villa María del Triunfo en Lima, además de un predio en La Libertad. Cabe precisar que el candidato declara no reconocer como propias cuatro de las propiedades que figuran en registros públicos a su nombre",
        "Acciones: Posee titularidad en cuatro empresas: Alex Express Courier SA, Empresa de Comunicaciones y Publicidad Estratégica EIRL, Estratégica Constructora del Sur EIRL y AGC Motors EIRL",
      ],
    },
    experiencia: [
      "El candidato presenta un balance entre la actividad privada, la dirigencia política y la gestión pública",
      "Gestión Pública: Se desempeñó como Alcalde Distrital de San Juan de Lurigancho durante el periodo 2019-2022",
      "Sector Institucional: Ha presidido el Instituto de Ecología Política \"Alternativa Verde\" (2011-2014) y el Instituto de Estudios Jurídicos Derectum en dos periodos (2011-2018 y 2023-2024)",
      "Liderazgo Partidario: Es fundador del Partido Demócrata Verde y actual Presidente del Comité Ejecutivo Nacional de dicha organización",
    ],
    logros: [
      "Además de su gestión como alcalde del distrito más poblado del Perú, Gonzales destaca su participación en organismos de toma de decisiones ambientales y de inversión",
      "Fue miembro del Consejo Directivo del Consejo Nacional del Ambiente entre 2001 y 2007",
      "Integró el Consejo Directivo de INVERMET (Fondo Metropolitano de Inversiones) entre 2019 y 2022",
    ],
    propuestas: [
      "Seguridad Ciudadana y Justicia: Reducción del 30% en delitos violentos (homicidios, extorsión y sicariato) para el año 2030 mediante un modelo integrado de seguridad. Disminución del 50% en el tiempo promedio de los procesos judiciales a través de la digitalización y modernización de expedientes",
      "Salud y Social: Reducción del 50% de las brechas de acceso a servicios de salud física y mental para el año 2030. Reducir en un 40% los índices de violencia contra mujeres, niñas y adolescentes. Disminución del 35% del déficit habitacional nacional promoviendo vivienda social de calidad",
      "Economía y Empleo: Reducción de la informalidad laboral al 55% para el año 2030. Incrementar la inversión nacional en Ciencia, Tecnología e Innovación (I+D) hasta alcanzar al menos el 1% del PBI",
      "Ambiente y Territorio: Reducción del 40% en la tasa de deforestación anual de la Amazonía para el año 2030. Implementación de un sistema de ordenamiento territorial vinculante para frenar la expansión urbana informal",
    ],
  },
  "alvaro-gonzalo-paz-de-la-barra-freigeiro": {
    key: "alvaro-gonzalo-paz-de-la-barra-freigeiro",
    name: "Álvaro Gonzalo Paz de la Barra Freigeiro",
    party: "Partido Político Fe en el Perú",
    birthDate: "1983-07-26",
    img: "/candidatos/alvaro-gonzalo-paz-de-la-barra-freigeiro.webp",
    imgHover: "/partidos/fe-en-el-peru.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/alvaro-gonzalo-paz-de-la-barra-freigeiro.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/alvaro-gonzalo-paz-de-la-barra-freigeiro.pdf",
    biografia: "Álvaro Gonzalo Paz de la Barra Freigeiro nació el 26 de julio de 1983 en el distrito de Miraflores, Lima. Es hijo de Vladimir Paz de la Barra, quien fue un reconocido abogado, juez y exdecano del Colegio de Abogados de Lima. Se ha desempeñado como abogado y empresario, y estuvo casado con la conductora de televisión Sofía Franco. Su carrera política ha estado marcada por un ascenso desde el ámbito municipal hacia la escena nacional, fundando su propia organización política tras su paso por otras filas partidarias.",
    historialAcademico: [
      "Título profesional de Abogado otorgado por la Universidad Nacional Mayor de San Marcos",
      "Estudios de posgrado en EUCIM Business School en España",
    ],
    controversias: [
      "Denuncias cruzadas de violencia familiar con su expareja Sofía Franco en 2021, incidente que incluyó la detención de ambos y declaraciones polémicas del candidato sobre la protección legal al hombre",
      "Investigación fiscal por presunto mal uso de recursos públicos en la Municipalidad de La Molina, específicamente por el supuesto uso de drones y personal de serenazgo para asuntos particulares vinculados a su entonces esposa",
      "Críticas por posturas calificadas de populistas, como su propuesta de condonación total de deudas con la SUNAT y multas de tránsito",
    ],
    ideologiaPolitica: "Su pensamiento político se articula bajo la bandera de \"Fe en el Perú\", organización que él preside. Los pilares de su ideario incluyen: defensa de una economía de libre mercado con responsabilidad social; enfoque en la descentralización efectiva, otorgando mayor poder y autonomía a los gobiernos locales y regionales; postura de \"insurgencia\" frente a lo que denomina un sistema estatal ineficiente y corrupto; rechazo a los monopolios y promoción de la eficiencia en la gestión pública orientada a resultados medibles.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Paz de la Barra ha declarado participaciones en diversas sociedades, lo que constituye parte de su patrimonio personal y base económica: acciones y participaciones en empresas como FBF Abogados SAC, Paz de la Barra Abogados SAC y FBF Obras SAC",
        "Como fundador del partido Fe en el Perú, la organización se financia mediante aportes de afiliados y simpatizantes conforme a la normativa vigente, aunque su campaña presidencial ha sido cuestionada por la procedencia de fondos para su amplia difusión",
      ],
    },
    experiencia: [
      "Su trayectoria laboral se concentra tanto en el sector público como en el privado durante la última década",
      "Gerente Municipal en la Municipalidad Distrital del Rímac entre julio y diciembre de 2023",
      "Alcalde del distrito de La Molina durante el periodo 2019-2022",
      "Presidente de la Asociación de Municipalidades del Perú (AMPE) entre 2019 y 2022",
      "Gerente General en la firma PBF Abogados SAC (2015-2018)",
      "Socio Fundador de Paz de la Barra Abogados SAC (2012-2018)",
    ],
    logros: [
      "Durante su gestión municipal y gremial, destacan los siguientes puntos: liderazgo en la AMPE, donde tuvo una voz activa frente al Ejecutivo durante la crisis sanitaria, llegando a declarar una \"insurgencia civil\" frente a normas que consideraba inadecuadas para los municipios",
      "Implementación de plantas de oxígeno gratuitas en La Molina durante la pandemia de COVID-19, gestión que él afirma fue reconocida internacionalmente",
      "Promoción de la derogación de leyes relacionadas con el monopolio del oxígeno para reducir costos durante la emergencia sanitaria",
    ],
    propuestas: [
      "Salud: Fortalecimiento del primer nivel de atención para alcanzar una cobertura nacional del 90% e implementación de especialidades en todas las regiones",
      "Economía: Condonación masiva de deudas bancarias y tributarias (SUNAT), junto con una reducción sustancial del Impuesto a la Renta y el IGV para dinamizar el mercado",
      "Vivienda: Construcción proyectada de 2.5 millones de viviendas en el quinquenio de gobierno",
      "Seguridad: Acabar con la corrupción en un plazo de 90 días y reformar el sistema penitenciario",
      "Gestión Estatal: Reducción del número de ministerios y descentralización de las sedes ministeriales hacia las regiones del interior del país",
    ],
  },
  "antonio-ortiz-villano": {
    key: "antonio-ortiz-villano",
    name: "Antonio Ortiz Villano",
    party: "Salvemos al Perú",
    birthDate: "1955-05-10",
    img: "/candidatos/antonio-ortiz-villano.webp",
    imgHover: "/partidos/salvemos-al-peru.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/antonio-ortiz-villano.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/antonio-ortiz-villano.pdf",
    biografia: "Antonio Ortiz Villano nació el 10 de mayo de 1955 en el distrito de Talavera, provincia de Andahuaylas, departamento de Apurímac. Actualmente tiene 70 años y reside en el distrito de San Martín de Porres, en la provincia de Lima. Es de sexo masculino y posee el Documento Nacional de Identidad N° 08587486.",
    historialAcademico: [
      "En cuanto a su formación básica, realizó sus estudios primarios en la Institución Educativa 660 en Apurímac y culminó la secundaria en la Institución Educativa José María Arguedas, también en Apurímac",
      "A nivel de educación superior, Antonio Ortiz Villano registra estudios universitarios en la carrera de Administración en la Universidad Particular Inca Garcilaso de la Vega, donde obtuvo el grado de Bachiller y, posteriormente, el Título Profesional de Licenciado en Administración",
    ],
    controversias: [
      "Tras la revisión exhaustiva de la Declaración Jurada de Hoja de Vida presentada ante el Jurado Nacional de Elecciones, no se registran sentencias condenatorias impuestas por delitos dolosos que hayan quedado firmes. Asimismo, el candidato declara no tener sentencias que declaren fundadas demandas por incumplimiento de obligaciones familiares, alimentarias, contractuales, laborales o de violencia familiar",
    ],
    ideologiaPolitica: "Si bien el plan de gobierno no define una etiqueta ideológica única, su enfoque se centra en la \"Dimensión Social\" y el fortalecimiento de la familia como núcleo formativo de la sociedad. El partido promueve una gestión basada en la transparencia, con compromisos de rendición de cuentas cada seis meses. Sus pilares parecen orientarse hacia un modelo de desarrollo humano integral, con énfasis en la educación de calidad, la salud pública descentralizada y la lucha contra la pobreza multidimensional.",
    financiamiento: {
      total: "S/ 215,000.00 (ingresos anuales) + patrimonio inmobiliario y acciones",
      sources: [
        "Ingresos anuales: Reporta una remuneración bruta anual de S/ 215,000.00 proveniente del sector privado",
        "Bienes inmuebles: Declara la propiedad de tres inmuebles, incluyendo una casa en San Martín de Porres y terrenos en Andahuaylas, con un valor total de autovalúo que supera los S/ 300,000.00",
        "Bienes muebles: Registra un vehículo Volkswagen valorado en S/ 10,000.00",
        "Acciones y participaciones: Es titular de acciones en diversas empresas, entre las que destacan Importadora y Distribuidora de Retenes Rodamientos y Afines (IDRE) S.A., con participaciones valoradas en S/ 2,544,000.00",
      ],
    },
    experiencia: [
      "Su trayectoria es predominantemente empresarial en el sector privado, ocupando cargos de alta dirección durante más de dos décadas",
      "Gerente General en Importadora y Distribuidora de Retenes Rodamientos y Afines (IDRE) S.A. desde 1999 hasta la actualidad",
      "Gerente General en KMK Hidráulica y Servicios S.A. desde 2005 hasta la actualidad",
      "Gerente General en Tonsan del Perú S.A.",
    ],
    logros: [
      "Su principal logro es la consolidación y gestión continua de empresas en el sector industrial y de servicios por más de 25 años",
      "En el ámbito político, ha liderado la inscripción de la fórmula presidencial de \"Salvemos al Perú\", estableciendo compromisos de transparencia inéditos, como informes de avance semestrales ante la ciudadanía",
    ],
    propuestas: [
      "Educación: Reducir la deserción escolar permanente en un 50% para el 2031 y lograr que el 90% de los jóvenes con carrera técnica se inserten en el mercado laboral ejerciendo su profesión. También propone implementar laboratorios STEAM y el uso de Inteligencia Artificial en las escuelas",
      "Salud: Alcanzar un 95% de disponibilidad de medicamentos esenciales en los centros de salud para 2031. Implementar la Historia Clínica Electrónica interoperable para el 40% de la población",
      "Seguridad Ciudadana: Lograr que al menos el 80% de los distritos priorizados presenten una reducción sostenida de delitos y aumentar en un 50% el promedio de años de cárcel efectiva por delitos violentos",
      "Desarrollo Infantil: Reducir la desnutrición crónica infantil a menos del 6% para el año 2031 y asegurar que el 90% de las gestantes reciban controles prenatales completos",
      "Lucha contra la pobreza: Adoptar oficialmente el Índice de Pobreza Multidimensional (IPM) y reducir la pobreza bajo este criterio en al menos un 30%",
    ],
  },
  "armando-joaquin-masse-fernandez": {
    key: "armando-joaquin-masse-fernandez",
    name: "Armando Joaquín Masse Fernández",
    party: "Partido Democrático Federal",
    birthDate: "1959-06-13",
    img: "/candidatos/armando-joaquin-masse-fernandez.webp",
    imgHover: "/partidos/partido-democrata-peru-federal.webp",
    planGobiernoUrl: null,
    hojaVidaUrl: "/pdfs/hojas-vida/armando-joaquin-masse-fernandez.pdf",
    biografia: "Armando Joaquín Massé Fernández nació en la ciudad de Lima, Perú, el 13 de junio de 1959. En la actualidad, a sus 66 años, se presenta como una figura que amalgama la experiencia técnica de la medicina con la visión estratégica del derecho y la sensibilidad de las artes. Proveniente de un entorno socioeconómico de clase media, su narrativa biográfica destaca el esfuerzo personal como motor de ascenso profesional. Su desarrollo vital ha estado intrínsecamente ligado a la capital peruana, aunque su ejercicio profesional temprano le permitió conocer las realidades sanitarias de diversas provincias del norte del país, un factor que posteriormente influiría en su discurso político descentralista. Massé ha mantenido una vida pública activa durante más de cuatro décadas, comenzando su notoriedad en la escena musical a principios de los años 80, para luego transicionar hacia roles de gestión corporativa y, finalmente, al activismo político y la comunicación social. Su transición de la gestión cultural a la política activa ha sido gradual, pero se ha acelerado significativamente en el último lustro. A finales de 2025, Armando Massé anunció su retiro de la conducción de Radio Exitosa para lanzar oficialmente su candidatura a la presidencia del Perú para el periodo 2026-2031.",
    historialAcademico: [
      "Médico Cirujano: Graduado en la Facultad de Medicina Humana «San Fernando» de la Universidad Nacional Mayor de San Marcos (UNMSM), la institución médica más antigua y prestigiosa del país. Graduarse en San Marcos implica no solo un rigor académico técnico, sino también una inmersión en la problemática de salud pública nacional",
      "Internado Médico y Especialización en Nefrología (1992-1993): Realizó su internado médico y estudios enfocados en nefrología en el Hospital Nacional Guillermo Almenara Irigoyen, centro de alta complejidad perteneciente al sistema de seguridad social (EsSalud)",
      "Abogado (2010): Obtuvo el título de abogado por la Universidad Inca Garcilaso de la Vega. Esta segunda carrera profesional le permitió ejercer una defensa técnica más robusta de los intereses de la Asociación Peruana de Autores y Compositores (APDAYC) ante organismos reguladores como el INDECOPI",
      "Magíster en Propiedad Intelectual: Cursó una maestría en Propiedad Intelectual en la Pontificia Universidad Católica del Perú (PUCP), consolidando su perfil como un experto en el marco legal de la gestión colectiva de derechos",
    ],
    controversias: [
      "Desinformación durante la Pandemia de COVID-19: Uno de los episodios más controvertidos ocurrió durante la emergencia sanitaria global. Massé fue señalado por diversos medios de verificación de datos (fact-checking) y organizaciones de salud por difundir información falsa o sin respaldo científico sobre tratamientos contra el virus. En junio de 2020, promovió activamente el uso de dióxido de cloro como medida preventiva y terapéutica contra el COVID-19, a pesar de las advertencias de la DIGEMID y la OMS sobre su toxicidad. Promovió el uso masivo de ivermectina, azitromicina e hidroxicloroquina como parte de un \"kit de tratamiento\" temprano, minimizando la necesidad de evidencia clínica rigurosa. Sugirió que los médicos jóvenes no corrían peligro frente al virus debido a su edad, afirmación que fue desmentida por las estadísticas de mortalidad del propio Colegio Médico del Perú. Como resultado de estas acciones, el Colegio Médico del Perú inició una investigación disciplinaria en 2020 contra Massé y otros siete médicos por poner en riesgo la salud pública mediante la recomendación de sustancias peligrosas",
      "Denuncias de Artistas Internacionales por Regalías: Durante su tiempo en APDAYC, figuras de la talla de Rubén Blades, Roberto Blades y Camilo Sesto expresaron públicamente su malestar por las liquidaciones de regalías recibidas en Perú. Rubén Blades llegó a calificar las sumas como \"risibles\" y acusó a la gestión de APDAYC de falta de transparencia. Massé respondió a estas acusaciones sosteniendo que la asociación cumple con los contratos internacionales y que el problema radica en la distribución interna que realizan las sociedades de gestión en los países de residencia de dichos artistas",
      "El Caso Indio Mayta: En 2004, se generó una agria disputa pública con el diario Ajá tras la publicación de noticias que denunciaban que el artista Indio Mayta se encontraba en la miseria y sin apoyo de APDAYC. Massé llevó el caso ante el Tribunal de Ética del Consejo de la Prensa Peruana. Aunque presentó pruebas de que el artista recibía ciertos beneficios, el tribunal declaró infundada su queja al considerar que el diario cumplió con los estándares informativos básicos al recoger las quejas de los familiares",
      "Presunto Conflicto de Intereses en APDAYC: La gestión de Massé en APDAYC fue objeto de investigaciones periodísticas que señalaron un presunto conflicto de intereses. Se identificaron múltiples empresas vinculadas a su círculo familiar directo (específicamente a su esposa Lourdes Pinillos y sus cuñados) que mantenían nexos comerciales con la asociación. Estas empresas participaban en la cadena de valor de la música, desde la edición hasta la distribución y administración de radios, lo que según expertos legales podría haber generado beneficios ilícitos aprovechando la posición dominante de APDAYC en el mercado",
    ],
    ideologiaPolitica: "La plataforma política de Massé se centra en el concepto de federalismo como solución a los problemas de centralismo, ineficiencia y corrupción que afectan al país. Propone transformar la división política del Perú para que las regiones tengan autonomía legislativa y presupuestaria real, similar a los modelos de Suiza o Canadá. Argumenta que el actual proceso de descentralización iniciado en 2002 ha sido \"amañado\" por el gobierno central para mantener el control de los recursos. Su vehículo político es el Partido Democrático Federal (PDF), una organización que promueve un cambio estructural en el modelo de Estado. Bajo el modelo federal, cada estado regional gestionaría sus propios sistemas de salud y educación, permitiendo una respuesta más rápida a las necesidades locales sin esperar la aprobación de los ministerios en Lima.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Gestión en APDAYC: Bajo su mando, APDAYC pasó de ser una entidad con dificultades operativas a una poderosa organización de gestión colectiva con una capacidad de recaudación que se incrementó en varios órdenes de magnitud. Massé implementó sistemas modernos de cobranza basados en el Artículo 147 de la Ley de Derechos de Autor, que establece la legitimación activa de la asociación para cobrar por el uso de música nacional e internacional en cualquier establecimiento público",
        "Red de Empresas Familiares: Se identificaron múltiples empresas vinculadas a su círculo familiar directo que mantenían nexos comerciales con APDAYC, incluyendo IEMPSA (catálogos musicales históricos), Trauni (producción física de discos), ET Music Perú (editora musical y representación), Fundación Autor (administración de frecuencias radiales) y Musz&K Perú (sello discográfico)",
        "Actividad Comunicacional: Su programa \"Médicos en Acción\" se mantuvo al aire por más de 15 años, primero en Radio Nacional y luego en Radio Exitosa y Exitosa TV, lo que le brindó una plataforma única para construir capital político y confianza social",
        "Candidatura Presidencial 2026: Su vehículo político es el Partido Democrático Federal (PDF), encabezando una plancha presidencial que integra a figuras con experiencia previa en el legislativo y el sector privado",
      ],
    },
    experiencia: [
      "Experiencia Clínica y Servicio Rural: En sus primeros años como profesional de la salud, Massé se desplazó al departamento de Lambayeque para realizar su servicio rural en el distrito de Jayanca. Esta etapa formativa se complementó con su labor como médico de guardia en el Hospital Cayaltí y servicios asistenciales en la Parroquia Zaña. Posteriormente, se desempeñó como médico emergentista en el Hospital Almanzor Aguinaga Asenjo en Chiclayo, una de las unidades de emergencia más críticas del norte peruano",
      "Fundador y Director del Policlínico \"Médico de Guardia\" (2014-Presente): Este establecimiento no es solo una unidad de atención clínica, sino el núcleo operativo de su marca personal, donde aplica un enfoque de medicina preventiva y atención primaria. Su labor como director médico ha sido paralela a su actividad como locutor, lo que le ha permitido referenciar casos clínicos reales en su programa radial",
      "Carrera Artística y Contribución Cultural: Armando Massé es una figura central en la música pop y criolla del Perú. Su carrera como cantautor no ha sido un simple pasatiempo, sino una actividad profesional con reconocimiento internacional y éxitos comerciales significativos. Durante la época dorada de los festivales de la canción, Massé representó al Perú en el prestigioso Festival de la Canción de Viña del Mar en Chile en dos oportunidades. Asimismo, fue el representante peruano en el Festival OTI de la Canción en los años 1989 y 1993, eventos que le brindaron una plataforma de visibilidad en toda Iberoamérica",
      "Compositor de Éxitos Internacionales: Como compositor, su logro más destacado es el tema \"No me ames\", canción que alcanzó el número uno en las listas de éxitos mundiales tras ser grabada por Jennifer Lopez y Marc Anthony, lo cual le otorgó un estatus de compositor de élite dentro de la industria musical",
      "Producción Discográfica: Su discografía es extensa y refleja una evolución desde la balada romántica hacia géneros más rítmicos y sociales. Ha colaborado con íconos de la música peruana como Arturo «Zambo» Cavero y Alicia Maguiña. En años recientes, ha compuesto temas con fuerte carga social, como «Oyarce corazón» (2011), en memoria de una víctima de la violencia en los estadios, y «Levántate Perú» (2017), lanzado tras los desastres naturales de El Niño Costero",
      "Presidencia de la Asociación Peruana de Autores y Compositores (APDAYC) (1999-2018): El periodo más influyente y, a la vez, más controvertido de la carrera de Armando Massé fue su presidencia al frente de APDAYC, cargo que ocupó ininterrumpidamente durante 19 años. Bajo su mando, APDAYC pasó de ser una entidad con dificultades operativas a una poderosa organización de gestión colectiva con una capacidad de recaudación que se incrementó en varios órdenes de magnitud. Massé implementó sistemas modernos de cobranza basados en el Artículo 147 de la Ley de Derechos de Autor. Durante su gestión, argumentó que los ingresos permitieron establecer un sistema de previsión social para los autores, incluyendo bonos de salud, seguros de vida y apoyo en gastos funerarios",
      "Presencia Mediática y Comunicación Social: El capital político de Armando Massé se ha construido mayoritariamente a través de su programa Médicos en acción, el cual se mantuvo al aire por más de 15 años. El programa inició sus emisiones en Radio Nacional, la emisora del Estado, pero alcanzó su pico de popularidad tras migrar a Radio Exitosa y Exitosa TV. El formato permitía a la audiencia realizar consultas médicas gratuitas vía telefónica, lo que posicionó a Massé como una autoridad sanitaria cercana a los sectores populares",
      "Producción Intelectual y Divulgación: En 2021 publicó Buenos tiempos, un libro de memorias y anécdotas bajo el sello de la editorial El Virrey. En 2022, lanzó la Guía para comprender y prevenir enfermedades con la editorial Mesa Redonda, texto que sintetiza sus principales recomendaciones de salud preventiva emitidas durante su carrera comunicacional",
      "Antecedentes Electorales: Somos Perú 2020: Su primera incursión formal en la política electoral ocurrió en las elecciones congresales extraordinarias de 2020, donde postuló al Parlamento por la organización política Somos Perú. A pesar de contar con una alta recordación de marca por su programa radial, la candidatura no logró el respaldo necesario para obtener un escaño",
      "Candidatura Presidencial 2026 y el Partido Democrático Federal: A finales de 2025, Armando Massé anunció su retiro de la conducción de Radio Exitosa para lanzar oficialmente su candidatura a la presidencia del Perú para el periodo 2026-2031. Su vehículo político es el Partido Democrático Federal (PDF), una organización que promueve un cambio estructural en el modelo de Estado. Massé encabeza una plancha presidencial que integra a Virgilio Acuña Peralta como Primer Vicepresidente y Lilia Díaz como Segunda Vicepresidenta",
    ],
    logros: [
      "Graduación en la Facultad de Medicina Humana «San Fernando» de la Universidad Nacional Mayor de San Marcos (UNMSM), la institución médica más antigua y prestigiosa del país",
      "Representación del Perú en el Festival de la Canción de Viña del Mar en Chile en dos oportunidades",
      "Representación del Perú en el Festival OTI de la Canción en los años 1989 y 1993, eventos que le brindaron una plataforma de visibilidad en toda Iberoamérica",
      "Como compositor, su logro más destacado es el tema \"No me ames\", canción que alcanzó el número uno en las listas de éxitos mundiales tras ser grabada por Jennifer Lopez y Marc Anthony, lo cual le otorgó un estatus de compositor de élite dentro de la industria musical",
      "Colaboración con íconos de la música peruana como Arturo «Zambo» Cavero y Alicia Maguiña",
      "Composición de temas con fuerte carga social, como «Oyarce corazón» (2011), en memoria de una víctima de la violencia en los estadios, y «Levántate Perú» (2017), lanzado tras los desastres naturales de El Niño Costero",
      "Presidencia de APDAYC durante 19 años (1999-2018), transformando la entidad de una organización con dificultades operativas a una poderosa organización de gestión colectiva con una capacidad de recaudación que se incrementó en varios órdenes de magnitud",
      "Implementación de sistemas modernos de cobranza basados en el Artículo 147 de la Ley de Derechos de Autor, estableciendo un sistema de previsión social para los autores, incluyendo bonos de salud, seguros de vida y apoyo en gastos funerarios",
      "Fundación y dirección del Policlínico \"Médico de Guardia\" desde el año 2014, aplicando un enfoque de medicina preventiva y atención primaria",
      "Programa \"Médicos en Acción\" al aire por más de 15 años, primero en Radio Nacional y luego en Radio Exitosa y Exitosa TV, posicionándolo como una autoridad sanitaria cercana a los sectores populares",
      "Publicación de libros: Buenos tiempos (2021), un libro de memorias y anécdotas bajo el sello de la editorial El Virrey, y la Guía para comprender y prevenir enfermedades (2022) con la editorial Mesa Redonda",
      "Candidato presidencial del Partido Democrático Federal para las Elecciones Generales de 2026",
    ],
    propuestas: [
      "Modelo Federalista Democrático: Propone transformar la división política del Perú para que las regiones tengan autonomía legislativa y presupuestaria real, similar a los modelos de Suiza o Canadá. Argumenta que el actual proceso de descentralización iniciado en 2002 ha sido \"amañado\" por el gobierno central para mantener el control de los recursos",
      "Seguridad Ciudadana y Justicia: Massé propone una postura de \"mano dura\" contra la criminalidad. Ha manifestado su intención de retirar al Perú de la jurisdicción de la Corte Interamericana de Derechos Humanos (Pacto de San José) para que el Estado pueda aplicar leyes más severas, incluyendo la posibilidad de la pena de muerte o cadenas perpetuas efectivas, sin interferencias internacionales",
      "Reforma del Sistema Penitenciario: Plantea la \"descolmatación\" de las cárceles y la creación de un sistema donde los internos realicen trabajos productivos obligatorios para su autosostenimiento",
      "Enfoque en Salud y Educación Regional: Bajo el modelo federal, cada estado regional gestionaría sus propios sistemas de salud y educación, permitiendo una respuesta más rápida a las necesidades locales sin esperar la aprobación de los ministerios en Lima",
      "Autonomía Legislativa y Presupuestaria: Las regiones tendrían capacidad real de legislar y gestionar sus propios presupuestos, similar a los modelos federales de Suiza o Canadá",
    ],
  },
  "cesar-acuna-peralta": {
    key: "cesar-acuna-peralta",
    name: "César Acuña Peralta",
    party: "Alianza para el Progreso",
    birthDate: "1952-08-11",
    img: "/candidatos/cesar-acuna-peralta.webp",
    imgHover: "/partidos/alianza-para-el-progreso.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/cesar-acuna-peralta.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/cesar-acuna-peralta.pdf",
    biografia: "César Acuña Peralta nació el 11 de agosto de 1952 en el distrito de Tacabamba, provincia de Chota, departamento de Cajamarca. Es hijo de una familia dedicada a la agricultura en la sierra norte del Perú. A lo largo de su vida, se trasladó a la región de La Libertad, donde estableció su residencia principal en el distrito de Víctor Larco Herrera, Trujillo. Es reconocido principalmente como un empresario del sector educativo, habiendo fundado instituciones de alcance nacional que forman la base de su patrimonio.",
    historialAcademico: [
      "Pregrado: Su formación profesional se inició en la Universidad Nacional de Trujillo, donde obtuvo el grado de Bachiller en Ingeniería Química y, posteriormente, el título profesional de Ingeniero Químico en 1995",
      "Posgrado: Maestro en Administración de la Educación por la Universidad de Lima (1997)",
      "Posgrado: Magíster en Dirección Universitaria por la Universidad de los Andes, en Colombia (1998)",
      "Posgrado: Doctor por la Universidad Complutense de Madrid, título obtenido en el año 2013",
    ],
    controversias: [
      "En su registro oficial de hoja de vida ante el Jurado Nacional de Elecciones (JNE), el candidato declara una sentencia judicial firme en el ámbito civil: Se registra un fallo fundado en parte sobre una demanda de alimentos (Expediente 02974-2023-0-1801-JR-FC-17), emitido por el 17 Juzgado de Familia. La resolución número 11 confirma la orden para que César Acuña Peralta preste una pensión alimentaria de forma mensual y adelantada",
      "En el rubro de sentencias condenatorias por delitos dolosos, el candidato declaró no tener información que registrar",
    ],
    ideologiaPolitica: "Acuña es el fundador y líder histórico del partido Alianza Para el Progreso (APP), organización que preside formalmente desde el año 2023. Su postura política se define generalmente como de centro o centro-derecha, con un fuerte énfasis en el \"gobierno de gestión\" y la descentralización. Su propuesta institucional para 2026 plantea una reforma radical del Estado, que incluye la reducción de los ministerios actuales de 19 a solo 10, buscando eliminar duplicidades de funciones y fortalecer la rectoría del Poder Ejecutivo.",
    financiamiento: {
      total: "S/ 9,836,766.00 (ingresos anuales 2024)",
      sources: [
        "Ingresos anuales (2024): Declaró un total de S/ 9,836,766.00. De esta cifra, S/ 2,885,101.00 provienen del sector privado por remuneración bruta y S/ 6,798,264.00 corresponden a \"otros ingresos\", específicamente intereses generados por sus acciones",
        "Bienes inmuebles: Reporta 24 propiedades en Perú y el extranjero, incluyendo predios rurales en Cajamarca y La Libertad, así como residencias de alto valor en distritos limeños como La Molina, Miraflores, San Isidro y Santiago de Surco. Destacan un inmueble en Madrid (España) valorado en más de 3 millones de soles y una propiedad en Miraflores valorada en más de 27 millones de soles",
        "Bienes muebles: Registra una flota de más de 30 vehículos a su nombre, que incluye camionetas de alta gama y vehículos de trabajo",
      ],
    },
    experiencia: [
      "Gestión Pública - Gobernador Regional de La Libertad: Periodo actual 2023 – 2026. Periodo previo 2015",
      "Gestión Pública - Alcalde de la Municipalidad Provincial de Trujillo: Dos periodos consecutivos 2007 – 2014",
      "Sector Educativo y Privado - Presidente del Directorio – Universidad César Vallejo: Gestión estratégica durante 20 años (1999 – 2019)",
      "Sector Educativo y Privado - Asesor Institucional: Universidad César Vallejo (Periodo posterior a la presidencia)",
      "Liderazgo Político - Fundador y Presidente Nacional: Partido Político Alianza Para el Progreso (APP)",
    ],
    logros: [
      "Consolidación Educativa: Lideró la expansión y el posicionamiento de la Universidad César Vallejo como una de las instituciones con mayor población estudiantil en el Perú durante su gestión de 20 años",
      "Liderazgo Partidario: Fundó y mantiene la vigencia de Alianza Para el Progreso, logrando convertirlo en una de las fuerzas políticas con mayor representación nacional y presencia en gobiernos regionales y locales",
      "Continuidad Democrática: Es uno de los pocos cuadros políticos en el norte del país que ha logrado el respaldo ciudadano para ocupar los dos cargos ejecutivos más importantes de la región (Alcaldía Provincial y Gobernación Regional) en múltiples ocasiones",
      "Gestión Descentralizada: Durante sus periodos como Alcalde y Gobernador, ha impulsado proyectos de infraestructura y desarrollo urbano en Trujillo y la región La Libertad",
    ],
    propuestas: [
      "Vivienda y Saneamiento: Construcción de 1.25 millones de viviendas nuevas en el quinquenio y centralización de las Empresas Prestadoras de Servicios (EPS) para promover proyectos de desalinización y tratamiento de aguas residuales mediante asociaciones público-privadas (APP)",
      "Salud: Implementación del \"Plan Mil\" para fortalecer la atención primaria y adjudicación de nuevos hospitales bajo modalidades de APP y Obras por Impuestos (OXI)",
      "Educación: Reforma del currículo escolar para incluir obligatoriamente inglés e Inteligencia Artificial (IA), además de la construcción de un COAR (Colegio de Alto Rendimiento) por cada región del país",
      "Seguridad Ciudadana: Creación de un \"Ministerio de Defensa y Seguridad Interna\" que integre a las Fuerzas Armadas y la Policía Nacional, con un enfoque en inteligencia avanzada para combatir el crimen organizado y las extorsiones",
      "Lucha contra la corrupción: Uso de Inteligencia Artificial para monitorear contrataciones públicas y ampliación de los plazos de prescripción para delitos de corrupción",
    ],
  },
  "carlos-gonzalo-alvarez-loayza": {
    key: "carlos-gonzalo-alvarez-loayza",
    name: "Carlos Gonsalo Álvarez Loayza",
    party: "Partido País para Todos",
    birthDate: "1964-01-07",
    img: "/candidatos/carlos-gonzalo-alvarez-loayza.webp",
    imgHover: "/partidos/pais-para-todos.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/carlos-gonzalo-alvarez-loayza.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/carlos-gonzalo-alvarez-loayza.pdf",
    biografia: "Carlos Gonsalo Álvarez Loayza nació el 7 de enero de 1964 en el distrito, provincia y departamento de Lima. Actualmente reside en el distrito de San Isidro, Lima. Es ampliamente conocido en el ámbito público por su trayectoria en el mundo del entretenimiento y la televisión peruana antes de su incursión en la política activa para el proceso de las Elecciones Generales 2026.",
    historialAcademico: [
      "En cuanto a su formación académica, el candidato registra haber concluido satisfactoriamente los estudios de educación básica regular, tanto en el nivel primario como secundario",
      "En el documento oficial de su hoja de vida no declara poseer estudios universitarios, estudios técnicos, ni grados de posgrado",
    ],
    controversias: [
      "En el Formato Único de Declaración Jurada de Hoja de Vida, el candidato no registra sentencias condenatorias firmes por delitos dolosos ni por incumplimiento de obligaciones familiares, alimentarias, contractuales o laborales. Los documentos proporcionados no contienen menciones a investigaciones en curso o polémicas administrativas adicionales",
    ],
    ideologiaPolitica: "El candidato postula por la organización política Partido País para Todos. Según su plan de gobierno, su postura se alinea con una reforma institucional profunda del Estado, con un fuerte énfasis en el orden, la seguridad ciudadana y la eficiencia en la gestión social para reducir brechas de pobreza y salud mediante un enfoque técnico y resultados medibles.",
    financiamiento: {
      total: "S/ 144,000.00 (ingresos anuales)",
      sources: [
        "La documentación analizada no especifica los montos de financiamiento de campaña ni las fuentes de aportes privados para este proceso electoral",
        "En su declaración de bienes y rentas, registra ingresos anuales por su actividad independiente de S/ 144,000.00, además de poseer propiedades inmuebles en San Isidro y un vehículo deportivo valorizado en S/ 102,000.00",
      ],
    },
    experiencia: [
      "Su trayectoria laboral de los últimos diez años se ha centrado exclusivamente en el sector artístico y de comunicaciones. Se desempeña como comediante independiente desde el año 2020 hasta la actualidad",
      "Previamente, trabajó en Andina de Radiodifusión (ATV) durante el año 2019 y en la empresa Willax S.A.C. en el año 2018, realizando programas de televisión en ambos casos",
    ],
    logros: [
      "Dentro de su hoja de vida oficial no se detallan premios o reconocimientos específicos bajo una sección de logros; sin embargo, su relevancia pública se desprende de su prolongada carrera como figura de la televisión y el humor político, lo cual le ha otorgado un alto nivel de recordación entre la ciudadanía antes de postular a la Presidencia de la República por el Partido País para Todos",
    ],
    propuestas: [
      "Seguridad Ciudadana y Lucha contra el Crimen: Propone una reforma integral de la Policía Nacional del Perú, buscando que el 70% de sus componentes operativos sean modernizados. Plantea reducir la tasa de homicidios a 6 por cada 100 mil habitantes y alcanzar el 100% de identificación y desarticulación de organizaciones criminales nacionales y extranjeras",
      "Control Penitenciario: Propone neutralizar el mando criminal desde las cárceles mediante el aislamiento físico y comunicacional efectivo del 100% de los líderes de alta peligrosidad, además de inhabilitar totalmente la señal de telefonía en los penales",
      "Salud y Lucha contra la Anemia: Su meta es \"Cero tolerancia a la anemia\", buscando reducir este indicador en niños de 6 a 35 meses en al menos 5 puntos porcentuales por año. En salud, pretende que el 80% de los centros de primer nivel cuenten con un abastecimiento de medicamentos superior al 85%",
      "Reforma Social y Pobreza: Plantea una focalización dinámica para reducir la pobreza entre 8 y 10 puntos porcentuales al 2031. Esto incluye duplicar la cobertura del programa JUNTOS y triplicar la de CONTIGO, incrementando gradualmente las subvenciones económicas",
      "Justicia y Tecnología: Implementar el uso de inteligencia artificial y tecnología para acelerar los procesos judiciales, reduciendo el tiempo de tramitación en un 30% y convirtiendo los órganos fiscales transitorios en permanentes para eliminar la carga procesal",
    ],
  },
  "carlos-espa-y-garces-alvear": {
    key: "carlos-espa-y-garces-alvear",
    name: "Alfonso Carlos Espá Garcés-Alvear",
    party: "Partido SíCreo",
    birthDate: "1960-09-01",
    img: "/candidatos/carlos-espa-y-garces-alvear.webp",
    imgHover: "/partidos/si-creo.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/carlos-espa-y-garces-alvear.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/carlos-espa-y-garces-alvear.pdf",
    biografia: "Alfonso Carlos Espá Garcés-Alvear nació en Lima, en el distrito de Miraflores, el 1 de septiembre de 1960. Es una figura pública con una trayectoria multifacética que combina el derecho, el periodismo de investigación y la comunicación política. Es conocido por su etapa como conductor del programa dominical Cuarto Poder entre 2002 y 2004. Es el fundador y actual presidente del Partido SíCreo, organización que logró su inscripción oficial en 2024 tras el malestar social generado por la crisis política reciente.",
    historialAcademico: [
      "Se graduó como Bachiller en Derecho y posteriormente como Abogado por la Pontificia Universidad Católica del Perú (PUCP) en 1987",
      "Cuenta con un Máster en Ciencia Política por The American University, en Estados Unidos (1990), grado obtenido como becario del prestigioso programa Fulbright",
      "Es miembro de la sociedad de honor estadounidense Pi Sigma Alpha, especializada en ciencias políticas",
    ],
    controversias: [
      "Críticas a su entorno: Se han difundido cuestionamientos sobre los vínculos empresariales de sus familiares, específicamente de su hermano Fernando Salcedo Espá, relacionado con el sector minero",
      "Relación con el periodismo de los 90: Debido a su presencia en medios durante esa década, algunos críticos cuestionan el rol de los periodistas de la época, aunque Espá defiende su trayectoria como una búsqueda de objetividad y resistencia democrática",
      "Posturas radicales: Sus propuestas de elevar la valla electoral al 20% y construir penales de máxima seguridad han sido señaladas por algunos sectores como medidas extremas para el sistema democrático actual",
    ],
    ideologiaPolitica: "Se define como un liberal clásico y representa una visión de derecha moderna. Su pensamiento político se centra en: defensa de las libertades individuales y reducción de la intervención estatal; un enfoque de \"mano dura\" contra el crimen organizado, diferenciándolo del trato al ciudadano trabajador; conservadurismo en valores sociales, reconociendo a la familia tradicional y el derecho a la vida desde la concepción; oposición frontal a modelos de izquierda autoritaria o antidemocrática.",
    financiamiento: {
      total: "S/ 252,000.00 (ingresos anuales)",
      sources: [
        "En su declaración jurada, el candidato reporta ingresos anuales por un total de S/ 252,000.00 provenientes del sector privado",
        "Además, declara poseer acciones y participaciones en fondos de inversión extranjeros y empresas locales, como Janlis-Global HY Bond Fund y EGA Empresarial S.A.C.",
        "Se ha manifestado públicamente en contra del financiamiento público a los partidos políticos y de las exoneraciones tributarias para estas organizaciones",
      ],
    },
    experiencia: [
      "Director de Comunicaciones en la Embajada de Estados Unidos en el Perú durante 15 años (2008-2023), donde gestionó temas de prensa y cultura",
      "Periodista y conductor de programas de televisión de alto perfil como Buenos Días Perú (1984) y Cuarto Poder (2002-2004)",
      "Columnista de opinión en medios como Perú 21 y el portal Lampadia",
      "En sus años universitarios, fue dirigente estudiantil en la PUCP",
    ],
    logros: [
      "Lideró la conducción de uno de los programas de investigación periodística más influyentes del país tras la caída del régimen de los años 90",
      "Logró la inscripción de su propio partido político, SíCreo, en un contexto de alta fragmentación y exigencias normativas en el Perú",
      "Fue distinguido con la beca Fulbright para sus estudios de posgrado en el extranjero",
    ],
    propuestas: [
      "Seguridad Ciudadana: Implementación de una estrategia integral que incluye la recuperación de espacios públicos en los 20 distritos más peligrosos y la construcción de seis penales de máxima seguridad para cabecillas criminales",
      "Lucha contra la corrupción: Designación de un \"Zar Anticorrupción\" y digitalización total del Gobierno para que la información patrimonial y los procesos estatales sean fiscalizables por la ciudadanía en tiempo real",
      "Educación: Implementación de un programa de \"Bono Educativo\", permitiendo que las familias elijan el centro escolar, condicionando el financiamiento a estándares de rendimiento pedagógico",
      "Salud: Erradicación de la anemia infantil mediante una política de movilización social y atención prioritaria a madres gestantes",
      "Reforma del Estado: Eliminación de 35 impuestos considerados antitécnicos y reducción de trámites burocráticos (licencias y permisos) para disminuir las oportunidades de extorsión y coimas por parte de funcionarios",
    ],
  },
  "carlos-ernesto-jaico-carranza": {
    key: "carlos-ernesto-jaico-carranza",
    name: "Carlos Ernesto Jaico Carranza",
    party: "Perú Moderno",
    birthDate: "1967-04-28",
    img: "/candidatos/carlos-ernesto-jaico-carranza.webp",
    imgHover: "/partidos/peru-moderno.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/carlos-ernesto-jaico-carranza.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/carlos-ernesto-jaico-carranza.pdf",
    biografia: "Carlos Ernesto Jaico Carranza nació el 28 de abril de 1967 en Chimbote, provincia del Santa, departamento de Áncash. Actualmente reside en el distrito de San Isidro, en la ciudad de Lima. Postula a la Presidencia de la República por la organización política Perú Moderno para las Elecciones Generales 2026. Además de su candidatura presidencial, también encabeza la lista para el Senado.",
    historialAcademico: [
      "Derecho: Es abogado titulado por la Universidad de San Martín de Porres (2021)",
      "Posgrado Internacional: Obtuvo el grado de Maestro en Derecho por la University of Fribourg, en Suiza, en el año 2018",
      "Gestión: Cuenta con un MBA otorgado por la Swiss Business School, culminado en el año 2004",
    ],
    controversias: [
      "En la sección correspondiente a sentencias en su hoja de vida oficial, el candidato declaró no tener información por registrar tanto en el ámbito penal (delitos dolosos) como en demandas fundadas por incumplimiento de obligaciones familiares, laborales o violencia familiar",
    ],
    ideologiaPolitica: "Aunque el plan de gobierno no define una etiqueta ideológica cerrada, su plataforma se alinea con la modernización del Estado, la formalización económica y el fortalecimiento institucional. En cuanto a su historial político, Jaico Carranza registra renuncias previas a dos organizaciones: Alianza para el Progreso (renuncia registrada en 2023) y Todos por el Perú (renuncia registrada en 2019).",
    financiamiento: {
      total: "S/ 47,158.00 (año fiscal 2024)",
      sources: [
        "Según su declaración jurada de hoja de vida correspondiente al año fiscal 2024, el candidato reportó ingresos totales de S/ 47,158.00. Desglose: S/ 23,408.00 por remuneración bruta anual (sector privado) y S/ 23,750.00 por ejercicio individual de su profesión (rentas de cuarta categoría)",
        "Patrimonio: Posee el 20% de acciones y derechos de un predio en San Juan de Miraflores y mantiene acciones en las empresas Centrum Iustitia Abogados S.A.C. y Alpaxor S.A.C.",
      ],
    },
    experiencia: [
      "Sector Público: Se desempeñó como Secretario General del Despacho Presidencial entre 2021 y 2022. Previamente, fue asesor parlamentario en el Congreso de la República del Perú (2020-2021)",
      "Sector Privado: Es Gerente General de la empresa Alpaxor S.A.C. desde 2024 y ejerce como abogado independiente desde 2022",
      "Docencia: Fue profesor de cátedra en la Universidad Tecmilenio, en México, entre 2014 y 2018",
    ],
    logros: [
      "Destaca su ascenso a la Secretaría General de Palacio de Gobierno, uno de los cargos de confianza administrativa más altos en el Poder Ejecutivo",
      "Asimismo, su perfil subraya una trayectoria académica y docente internacional que le ha permitido integrar redes profesionales en Suiza y México",
    ],
    propuestas: [
      "Dimensión Social - Violencia de Género: Reducir en un 40% las denuncias atendidas y promover la autonomía económica de las mujeres. Salud Infantil: Reducir la anemia infantil al 15% y la desnutrición crónica al 8% mediante programas alimentarios liderados por mujeres. Educación: Incrementar al 80% el acceso a internet en escuelas públicas mediante un Plan Nacional de Conectividad",
      "Dimensión Institucional y Seguridad - Anticorrupción: Digitalización del 100% de los trámites estatales para eliminar la burocracia física (\"cero papeles\"). Seguridad Ciudadana: Aplicar el Plan Mariano Santos, aumentar a 25,000 los efectivos investigadores y construir 5 nuevos penales regionales de alta tecnología fuera de las ciudades. Crimen Organizado: Reducir en un 30% las denuncias de extorsión y bajar la tasa de homicidios a 2.5 por cada 100,000 habitantes",
      "Dimensión Económica - Formalización: Reducir la informalidad laboral del 85% al 60% mediante incentivos fiscales para PYMES. Crecimiento: Lograr un crecimiento del PBI de entre el 4% y 6% fomentando la industrialización y clústeres de manufactura. Exportaciones: Incrementar el nivel de exportaciones regionales en un 60% utilizando los estándares de INACAL",
      "Dimensión Territorial y Ambiental - Amazonía: Reducir la deforestación a 95,000 hectáreas anuales y reforestar 45,000 hectáreas. Infraestructura: Construcción del Tren Transandino para unir Puno con Cajamarca. Minería: Controlar al 100% la producción nacional de cobre, oro, litio y tierras raras mediante unidades de pesaje y laboratorios en origen para mejorar la recaudación del canon",
    ],
  },
  "charlie-carrasco-salazar": {
    key: "charlie-carrasco-salazar",
    name: "Charlie Carrasco Salazar",
    party: "Partido Demócrata Unido Perú",
    birthDate: "1980-06-02",
    img: "/candidatos/charlie-carrasco-salazar.webp",
    imgHover: "/partidos/unido-peru.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/charlie-carrasco-salazar.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/charlie-carrasco-salazar.pdf",
    biografia: "Charlie Carrasco Salazar nació el 2 de junio de 1980 en el distrito de Huancarama, provincia de Andahuaylas, departamento de Apurímac. Actualmente reside en el distrito del Rímac, en Lima. Es un profesional del derecho con una trayectoria marcada por la actividad académica y la consultoría privada, además de ser el fundador del Partido Demócrata Unido Perú.",
    historialAcademico: [
      "Pregrado: Es Bachiller en Derecho (2007) y Abogado (2009) por la Universidad Tecnológica de los Andes",
      "Posgrado: Ostenta el grado de Maestro en Derecho Constitucional (2011) y Doctor en Derecho (2012), ambos por la Universidad Nacional Federico Villarreal",
      "Gestión Pública: Obtuvo el grado de Maestro en Gestión Pública por la Universidad de San Martín de Porres en 2023",
    ],
    controversias: [
      "En su declaración jurada de hoja de vida, el candidato no registra sentencias condenatorias firmes por delitos dolosos ni sentencias por incumplimiento de obligaciones familiares, alimentarias, contractuales o laborales. Sin embargo, en el apartado de titularidad de acciones, menciona que su empresa \"Estudio Jureco Carrasco & Abogados EIRL\" presenta actualmente una anotación preventiva por presunta prolongada inactividad de oficio",
    ],
    ideologiaPolitica: "Carrasco Salazar lidera el Partido Demócrata Unido Perú. Su plataforma política se caracteriza por un enfoque de reforma estructural del Estado y medidas de corte radical en seguridad y justicia. Propone una reorganización total bajo principios de austeridad extrema, eficiencia administrativa y una postura de \"mano dura\" frente a la criminalidad y la corrupción, alineándose con una visión reformista y de soberanía nacional.",
    financiamiento: {
      total: "S/ 74,118.00 (año fiscal 2024)",
      sources: [
        "Para el año fiscal 2024, el candidato declaró ingresos totales por S/ 74,118.00. Estos se desglosan en: Sector Público: S/ 57,878.00 correspondientes a su labor como catedrático; Sector Privado: S/ 16,240.00 por ejercicio individual de su profesión",
        "Además, declara ser titular o accionista en 8 empresas, principalmente vinculadas a la consultoría jurídica y gestión empresarial",
      ],
    },
    experiencia: [
      "Docencia Universitaria: Es catedrático nombrado en la Universidad Nacional José Faustino Sánchez Carrión desde 2021, aunque labora allí bajo concurso desde 2018",
      "Liderazgo Político: Se desempeña como Presidente y representante legal del Partido Demócrata Unido Perú desde el año 2021 hasta la actualidad",
    ],
    logros: [
      "Más allá de su ascenso en la carrera docente como catedrático nombrado, Carrasco ha logrado consolidar una organización política propia de alcance nacional, logrando su inscripción y la postulación a la presidencia de la República",
      "Asimismo, destaca su producción académica como investigador en derecho y gestión pública, avalada por sus múltiples grados doctorales y de maestría",
    ],
    propuestas: [
      "Seguridad y Justicia: Implementación de la cadena perpetua para corruptos, creación de \"jueces sin rostro\", juzgados de ejecución sumaria en comisarías y tipificación del sicariato y extorsión como terrorismo",
      "Reforma del Estado: Reducción del gasto público al 20% del PBI mediante la fusión de ministerios y la reorganización de organismos autónomos",
      "Educación: Declaratoria de emergencia e incremento de la inversión al 6% del PBI, con una currícula 75% práctica y 25% teórica",
      "Salud y Social: Descentralización de la salud con hospitales de niveles 1, 2 y 3 en cada provincia, y creación de una Pensión 65 de carácter universal",
      "Economía y Agricultura: Segunda reforma agraria con creación del Banco Mypes para créditos de bajo interés y promoción de plantas industrializadoras de recursos estratégicos",
    ],
  },
  "francisco-ernesto-diez-canseco-tavara": {
    key: "francisco-ernesto-diez-canseco-tavara",
    name: "Francisco Ernesto Diez-Canseco Távara",
    party: "Partido Político Perú Acción",
    birthDate: "1946-04-18",
    img: "/candidatos/francisco-ernesto-diez-canseco-tavara.webp",
    imgHover: "/partidos/peru-accion.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/francisco-ernesto-diez-canseco-tavara.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/francisco-ernesto-diez-canseco-tavara.pdf",
    biografia: "Francisco Ernesto Diez-Canseco Távara nació el 18 de abril de 1946 en el distrito de San Isidro, Lima. Proviene de una familia con tradición en la esfera pública, siendo hijo del exdiputado Ernesto Diez-Canseco Yáñez y nieto del ingeniero y político Ernesto Diez-Canseco Masías. Su trayectoria profesional combina el ejercicio del derecho, el periodismo y la actividad empresarial.",
    historialAcademico: [
      "Educación Superior: Se graduó como abogado en la Universidad Nacional Mayor de San Marcos en el año 1972",
      "Educación Básica: Cursó y concluyó satisfactoriamente sus estudios primarios y secundarios",
    ],
    controversias: [
      "Disputas Internas: En procesos electorales pasados, ha enfrentado conflictos internos dentro de sus agrupaciones que llevaron a la renuncia de sus propias candidaturas",
      "Estatutos de Aportes: La exigencia estatutaria de aportes obligatorios de sueldos públicos de sus militantes generó cuestionamientos en medios de comunicación sobre el financiamiento partidario",
      "Posturas sobre DD.HH.: Sus declaraciones respecto a intervenciones militares en centros penitenciarios (como el caso de la masacre de Castro Castro) han sido objeto de debate en entrevistas políticas, donde ha defendido la actuación del Estado frente al terrorismo",
    ],
    ideologiaPolitica: "Se autodefine como un político de principios claros, orientado hacia lo que denomina una revolución pacífica para ordenar el Estado. Su postura ideológica se caracteriza por: Liberalismo Económico: Defiende los principios de libre mercado y libre comercio, oponiéndose a los monopolios y oligopolios, tanto estatales como privados. Postura Anti-corrupción y Conservadora: Propone una lucha frontal contra la delincuencia bajo el lema Mano de Hierro y se presenta como una alternativa opuesta a sectores que él denomina caviares.",
    financiamiento: {
      total: "S/ 1,699,247.11",
      sources: [
        "Franja Electoral: El partido Perú Acción tiene asignado un monto total de S/ 1,699,247.11 para publicidad en medios y redes sociales dentro de la franja electoral reglamentada",
        "Mecanismos Internos: Reportes periodísticos de 2023 señalaron que los estatutos del partido incluían la obligatoriedad de aportes del 10% del salario para aquellos militantes o invitados que accedieran a cargos públicos a través de la organización",
      ],
    },
    experiencia: [
      "Diputado de la República: Ejerció como diputado por Lima durante el periodo 1985-1990, representando al Movimiento de Bases Hayistas",
      "Liderazgo partidario: Es el fundador y actual presidente del partido Perú Acción (anteriormente denominado Perú Nación), inscrito formalmente desde noviembre de 2015",
      "Candidaturas previas: Postuló a la alcaldía de Lima en 1983 y ha intentado retornar al Congreso en procesos electorales más recientes, como las elecciones extraordinarias de 2020",
      "Actividad jurídica y periodística: Se ha desempeñado como abogado independiente desde 1981 hasta la actualidad. En el ámbito de las comunicaciones, ha sido columnista y conductor de programas de televisión como Teléfono Rojo y Trinchera Libre",
    ],
    logros: [
      "Promoción de Derechos Humanos: Ha publicado obras como La tesis peruana sobre los Derechos Humanos (1992) y La nueva opción (1989), enfocadas en la realidad política y social del país",
      "Consejo por la Paz: Fue impulsor y presidente del Consejo por la Paz en la década de los 90, desde donde promovió una postura crítica frente al terrorismo, calificándolo como el principal violador de derechos humanos",
    ],
    propuestas: [
      "Seguridad Ciudadana: Implementación del Plan Mano de Hierro, que incluye la construcción de 12 mega cárceles, la instalación de bases militares en el 100% de las fronteras y la deportación de inmigrantes ilegales",
      "Lucha contra la Corrupción: Creación del Consejo Nacional de Moral Pública (CNMP), con integrantes elegidos por votación popular para supervisar la independencia de poderes y erradicar funcionarios corruptos",
      "Reforma del Estado: Propuesta de retorno a la bicameralidad parlamentaria, eliminación del sueldo de congresistas (reemplazado por estipendios por asistencia) y reducción del número de asesores por legislador",
      "Salud y Educación: Fusión de MINSA y EsSalud para optimizar recursos, construcción de 50 hospitales tipo 1 y aumento del 30% en el sueldo de los profesores",
      "Programas Sociales: Incremento de la pensión para beneficiarios de Pensión 65 y creación de créditos específicos para mujeres emprendedoras",
    ],
  },
  "fiorella-giannina-molinelli-aristondo": {
    key: "fiorella-giannina-molinelli-aristondo",
    name: "Fiorella Giannina Molinelli Aristondo",
    party: "Fuerza y Libertad",
    birthDate: "1974-03-20",
    img: "/candidatos/fiorella-giannina-molinelli-aristondo.webp",
    imgHover: "/partidos/alianza-fuerza-y-libertad.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/fiorella-giannina-molinelli-aristondo.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/fiorella-giannina-molinelli-aristondo.pdf",
    biografia: "Fiorella Giannina Molinelli Aristondo nació en la ciudad de Lima el 20 de marzo de 1974. Es hija de Ángel Molinelli Valle y de Flor de María Aristondo Espinoza. Su formación inicial se desarrolló en el Colegio San Antonio de Mujeres del Callao, una institución educativa de tradición católica dirigida por las religiosas del Inmaculado Corazón de María. Este entorno formativo temprano es citado a menudo como el origen de sus valores de disciplina y vocación de servicio, elementos que posteriormente integrarían su discurso como funcionaria pública. Su identidad personal está fuertemente vinculada a su condición de economista y madre, aspectos que ha utilizado para construir una narrativa de \"mujer empoderada y luchona\" en contraposición a otras figuras políticas contemporáneas. Molinelli ha enfatizado que su incursión en la vida pública no es producto de la improvisación, sino de un proceso de preparación técnica que comenzó a los 22 años.",
    historialAcademico: [
      "Licenciatura en Economía: Pontificia Universidad Católica del Perú (PUCP), periodo 1992-1996 (Titulada). Durante su etapa de pregrado alcanzó el Quinto Superior, lo que facilitó su acceso a oportunidades de posgrado en el extranjero",
      "Maestría en Economía y Políticas Públicas: Instituto Torcuato Di Tella (Argentina), periodo 1997-1998 (Titulada). Su formación fue respaldada por una beca del Banco Interamericano de Desarrollo (BID), lo que le permitió adquirir una visión regional sobre la regulación de mercados y el diseño de intervenciones estatales eficientes",
      "Maestría en Dirección y Gestión de la Salud: Universidad de Alcalá (España), culminada",
      "Doctorado en Gobierno y Políticas Públicas: Universidad de San Martín de Porres (USMP), periodo 2005-2006 (Titulada)",
      "Se encuentra debidamente registrada en el Colegio de Economistas de Lima con el número de colegiatura 08226",
    ],
    controversias: [
      "El Caso Chinchero: Colusión Agravada: Este es el proceso más antiguo que enfrenta Molinelli, originado por su rol como Viceministra de Transportes en 2017. La fiscalía le imputa el presunto delito de colusión agravada por la firma de la adenda del Aeropuerto de Chinchero, alegando que favoreció injustificadamente al consorcio Kuntur Wasi. El Ministerio Público ha solicitado diez años de prisión preventiva en el marco de la investigación preparatoria. Molinelli sostiene que la justicia internacional, a través de un laudo del CIADI en 2024, le ha dado la razón al Estado al señalar que la resolución del contrato fue indebida, lo que a su juicio valida técnicamente la adenda que ella suscribió",
      "El Club de las Farmacéuticas: Compras en Pandemia: En julio de 2021, una investigación fiscal vinculó a Molinelli con una presunta organización criminal denominada \"El Club de las Farmacéuticas\". Se le acusa de liderar una red que direccionó contratos directos durante la pandemia para la compra de implementos médicos sobrevalorados, como lentes de seguridad y tomógrafos. La fiscalía detectó sobrevaloraciones de hasta siete veces el precio de mercado en lentes antisalpicaduras y coordinaciones para el ingreso de productos defectuosos a los almacenes de EsSalud. En febrero de 2022, se dictó una orden de impedimento de salida del país por 12 meses contra la exfuncionaria. Molinelli ha calificado esta denuncia como una \"represalia política\" orquestada por sectores cercanos a Vladimir Cerrón tras los conflictos por el control administrativo de EsSalud",
      "Proceso por difamación contra Edgar Alarcón: Molinelli ha tenido éxito legal en su defensa contra acusaciones de soborno. El excontralor Edgar Alarcón afirmó públicamente que ella le ofreció dos millones de soles para aprobar la adenda de Chinchero. Ante esto, Molinelli inició un juicio por difamación que culminó con una sentencia condenatoria contra Alarcón (un año de prisión suspendida y reparación civil), lo que ella presenta como una prueba de su integridad frente a ataques de adversarios políticos",
    ],
    ideologiaPolitica: "Molinelli se perfila como una candidata que intenta romper la dicotomía entre el técnico de escritorio y el político de masas. Su propuesta para el 2026 se fundamenta en la recuperación de la autoridad presidencial, la meritocracia en el servicio civil y una descentralización basada en la eficiencia presupuestaria. El partido Fuerza Moderna se presenta como una opción de centro, con un fuerte componente técnico y meritocrático, buscando atraer a profesionales de la salud y la gestión pública. Su propuesta se centra en cuatro pilares fundamentales que buscan abordar los problemas estructurales del Perú mediante una gestión orientada a resultados y libre de ideologías extremas.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Molinelli ha declarado que su campaña se apoya en recursos propios acumulados durante su carrera profesional y en aportes voluntarios de simpatizantes que son registrados conforme a ley",
        "Ha sido categórica al señalar que no aceptará financiamiento proveniente de la minería ilegal o empresas involucradas en procesos por lavado de activos, marcando una distancia ética con otras agrupaciones políticas",
        "La información financiera de su partido está sujeta a auditorías semanales y mensuales publicadas por la ONPE, asegurando que cada sol invertido en publicidad o desplazamientos nacionales sea trazable",
        "En sus declaraciones juradas de intereses y rentas, Molinelli ha reportado su patrimonio de manera detallada ante la Contraloría, sosteniendo que sus bienes son el resultado de veinticinco años de trabajo ininterrumpido en el sector público y privado",
      ],
    },
    experiencia: [
      "OSIPTEL (1999-2005): Desempeñó funciones críticas como Analista Económico, Vocal del Tribunal Administrativo de Resolución de Reclamos (TRASU) y Gerente de Usuarios encargado",
      "OSINERGMIN (2006-2013): Como Asesora de la Presidencia en Políticas Públicas Institucionales, participó en el diseño de estrategias para la supervisión de los sectores de energía y minería",
      "INDECOPI (2012): Fue destacada desde OSINERGMIN para ocupar la Dirección de la Autoridad Nacional de Protección del Consumidor entre marzo y junio de 2012",
      "Congreso de la República (2013): Se desempeñó como asesora en la Presidencia del Congreso para el desarrollo del encuentro en Ciencia y Tecnología denominado \"Desafíos del Futuro\"",
      "Ministerio de Economía y Finanzas (2014): Integró el Gabinete de Asesores dentro del Equipo de Seguimiento y Monitoreo a la Inversión",
      "Consultora independiente (noviembre 2014 - julio 2016): Brindó asesoría especializada en regulación y gestión pública a diversos clientes del sector privado y organismos internacionales",
      "Viceministra de Transportes (julio 2016 - junio 2017): Bajo la resolución suprema N° 010-2016-MTC, fue responsable de la gestión del proyecto del Aeropuerto Internacional de Chinchero en Cusco",
      "Viceministra de Construcción y Saneamiento (junio 2017): Designada brevemente antes de dar el salto al gabinete ministerial",
      "Ministra de Desarrollo e Inclusión Social (MIDIS) (27 de julio 2017 - enero 2018): Priorizó el fortalecimiento de los programas sociales bajo un enfoque de meritocracia y eficiencia operativa",
      "Presidencia Ejecutiva de EsSalud (marzo 2018 - agosto 2021): Su mandato estuvo definido por la gestión de la crisis sanitaria global derivada de la pandemia de COVID-19",
      "Fundadora del Partido Fuerza Moderna (mayo 2023): Logró su inscripción oficial ante el Jurado Nacional de Elecciones el 7 de agosto de 2024",
      "Líder de la Alianza Fuerza y Libertad: Conformada con Batalla Perú para las elecciones generales de 2026",
    ],
    logros: [
      "Villa Panamericana: Transformación de la infraestructura de los Juegos Panamericanos en el Centro de Aislamiento COVID-19 más grande de la región, atendiendo a miles de pacientes y evitando el colapso de los hospitales generales",
      "Expansión UCI: Incremento de la capacidad hospitalaria de 392 camas UCI a más de 2,000 en todo el país, reduciendo la tasa de mortalidad institucional por falta de equipamiento crítico",
      "Red Hospitalaria: Instalación de más de 11,500 camas hospitalarias y construcción acelerada de hospitales modulares en regiones, descentralizando la atención de emergencia en zonas críticas como Loreto y Piura",
      "Grado de Inversión: Obtención de calificaciones internacionales de riesgo para EsSalud bajo criterios de transparencia financiera, fortaleciendo la imagen institucional ante organismos multilaterales",
      "Lucha contra la anemia y desnutrición: Durante su gestión en MIDIS, impulsó la vigilancia nutricional y el seguimiento nominal de niños para reducir las brechas de desarrollo infantil temprano",
      "Programa Cuna Más: Expandió la cobertura de este programa para mejorar la atención integral de niños en situación de vulnerabilidad",
      "Articulación territorial: Promovió una mayor coordinación con los gobiernos regionales para asegurar que los recursos sociales llegaran a las zonas más remotas del país",
    ],
    propuestas: [
      "Seguridad Ciudadana: Construcción de cárceles de máxima seguridad para 20,000-30,000 internos; reforma de la policía con enfoque en inteligencia e investigación criminal para recuperar el orden interno y desarticular las bandas de crimen organizado enquistadas en las ciudades",
      "Salud Pública: Reducción de precios de medicamentos mediante competencia tarifaria; independencia de SUSALUD; incentivos salariales del 50% para médicos especialistas en regiones para garantizar el acceso a salud de calidad y medicamentos asequibles sin el centralismo limeño",
      "Reforma del Estado: Creación de un Ministerio de Infraestructura que agrupe funciones de transporte, vivienda y saneamiento para evitar duplicidades, buscando eficiencia en la ejecución de la inversión pública y planificación urbana ordenada. Propone una renovación del Congreso por mitades a mitad del periodo presidencial, la eliminación del transfuguismo y la instauración de una comisión de ética independiente elegida por concurso público",
      "Educación y Empleo: Fortalecimiento de la meritocracia universitaria a través de SUNEDU; incentivos laborales temporales para la inserción de jóvenes en el mercado formal para mejorar la calidad educativa y reducir los índices de delincuencia juvenil mediante oportunidades económicas",
    ],
  },
  "george-patrick-forsyth-sommer": {
    key: "george-patrick-forsyth-sommer",
    name: "George Patrick Forsyth Sommer",
    party: "Partido Democrático Somos Perú",
    birthDate: "1982-06-20",
    img: "/candidatos/george-patrick-forsyth-sommer.webp",
    imgHover: "/partidos/somos-peru.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/george-patrick-forsyth-sommer.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/george-patrick-forsyth-sommer.pdf",
    biografia: "George Patrick Forsyth Sommer nació el 20 de junio de 1982 en Caracas, Venezuela. Es hijo del diplomático peruano Harold Forsyth y de la ciudadana alemana Veronica Sommer. Su trayectoria de vida ha estado marcada por una dualidad entre el deporte de alto rendimiento y la gestión pública. Se desempeñó durante años como futbolista profesional, principalmente en el Club Alianza Lima, donde también ejerció cargos administrativos relacionados con el crédito fiscal. Actualmente postula por el Partido Democrático Somos Perú para las Elecciones Generales 2026. Su plataforma se define por un enfoque en la eficiencia de la gestión pública, el fortalecimiento de la seguridad ciudadana y la formalización económica. Aunque ha transitado por diversas agrupaciones políticas (PPC, Victoria Nacional y ahora Somos Perú), su discurso mantiene una línea de pragmatismo institucional y modernización del Estado mediante tecnología.",
    historialAcademico: [
      "Bachiller en Administración de Empresas: Grado obtenido en la Universidad Peruana de Ciencias Aplicadas (UPC) en el año 2021",
      "Maestría en Administración: Posee el grado de Maestro por la Universidad del Pacífico, obtenido en 2023",
      "Estudios no concluidos: Registra estudios previos de Ingeniería Industrial en la Universidad de San Martín de Porres",
    ],
    controversias: [
      "En su declaración jurada, el candidato no declara sentencias condenatorias firmes por delitos dolosos ni fallos por incumplimiento de obligaciones familiares, alimentarias o laborales",
    ],
    ideologiaPolitica: "Actualmente postula por el Partido Democrático Somos Perú para las Elecciones Generales 2026. Su plataforma se define por un enfoque en la eficiencia de la gestión pública, el fortalecimiento de la seguridad ciudadana y la formalización económica. Aunque ha transitado por diversas agrupaciones políticas (PPC, Victoria Nacional y ahora Somos Perú), su discurso mantiene una línea de pragmatismo institucional y modernización del Estado mediante tecnología. Su plan de gobierno se estructura en dimensiones sociales, institucionales y económicas con metas específicas al 2031, priorizando la seguridad ciudadana, economía y formalización, salud y nutrición, educación tecnológica y lucha contra la corrupción.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Bienes Muebles: En su declaración jurada, el candidato reporta vehículos valorados en un total de 42,000 soles, incluyendo una camioneta y una motocicleta",
        "Participaciones accionarias: Es titular de 500 acciones en Alhambra Inversiones S.R.L.",
        "Financiamiento Partidario: El financiamiento de sus actividades políticas se gestiona a través del Partido Democrático Somos Perú",
      ],
    },
    experiencia: [
      "Gestión Municipal: Fue Alcalde Distrital de La Victoria entre 2019 y 2020. Previamente, ocupó el cargo de regidor en el mismo distrito (2011-2014) por el Partido Popular Cristiano",
      "Sector Privado: Ha desempeñado cargos directivos como Gerente General en Alhambra Inversiones S.R.L. y Los M SAC",
      "Ámbito Deportivo: Fue futbolista profesional del Club Alianza Lima (2008-2016), donde también ejerció cargos administrativos relacionados con el crédito fiscal",
      "Militancia Política: Ha transitado por diversas agrupaciones políticas, incluyendo el Partido Popular Cristiano (PPC), Victoria Nacional y actualmente el Partido Democrático Somos Perú",
      "Candidato Presidencial 2026: Postula por el Partido Democrático Somos Perú para las Elecciones Generales 2026",
    ],
    logros: [
      "Obtención del grado de Bachiller en Administración de Empresas en la Universidad Peruana de Ciencias Aplicadas (UPC) en el año 2021",
      "Obtención del grado de Maestro en Administración por la Universidad del Pacífico en 2023",
      "Carrera como futbolista profesional del Club Alianza Lima (2008-2016)",
      "Ejercicio de cargos administrativos en el Club Alianza Lima relacionados con el crédito fiscal",
      "Elección como Regidor Distrital de La Victoria (2011-2014) por el Partido Popular Cristiano",
      "Elección como Alcalde Distrital de La Victoria (2019-2020)",
      "Desempeño como Gerente General en Alhambra Inversiones S.R.L. y Los M SAC",
      "Candidato presidencial del Partido Democrático Somos Perú para las Elecciones Generales 2026",
    ],
    propuestas: [
      "Seguridad Ciudadana: Propone transformar el Sistema Nacional de Seguridad Ciudadana (SINASEC) en un ente con poder ejecutivo real, reduciendo la victimización por delitos patrimoniales al 18% y aumentando la confianza institucional al 35%",
      "Economía y Formalización: Plantea reducir la informalidad laboral del 70.9% al 62%, formalizando a 1.5 millones de trabajadores mediante la simplificación tributaria y una plataforma única digital",
      "Salud y Nutrición: Busca garantizar el acceso alimentario al 100% de hogares en pobreza extrema y reducir la anemia infantil al 36.5% mediante un Padrón Nominal Digital que haga seguimiento en tiempo real",
      "Educación Tecnológica: Propone que el 70% de los estudiantes de secundaria egresen con competencias en programación y el 60% obtenga certificaciones en lenguajes como Python",
      "Lucha contra la Corrupción: Plantea reducir el costo anual de la corrupción a 6,000 millones de soles utilizando inteligencia artificial para analizar contratos en tiempo real, detectando irregularidades en un plazo máximo de 30 días",
    ],
  },
  "herbert-caller-gutierrez": {
    key: "herbert-caller-gutierrez",
    name: "Herbert Caller Gutiérrez",
    party: "Partido Patriótico del Perú",
    birthDate: "1978-09-19",
    img: "/candidatos/herbert-caller-gutierrez.webp",
    imgHover: "/partidos/partido-patriotico-del-peru.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/herbert-caller-gutierrez.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/herbert-caller-gutierrez.pdf",
    biografia: "Herbert Caller Gutiérrez nació el 19 de septiembre de 1978 en el departamento de Cusco. Su trayectoria personal está marcada por una transición de la disciplina militar hacia el sector empresarial y educativo. Actualmente reside en el distrito de La Molina, Lima. Es el líder fundador del Partido Patriótico del Perú, organización inscrita oficialmente para el presente proceso electoral.",
    historialAcademico: [
      "Ingeniería: Es Bachiller en Ciencias por la Universidad Nacional de Ingeniería (UNI), grado obtenido en 2010",
      "Derecho: Es Bachiller en Derecho (2016) y Abogado (2025) por la Universidad Alas Peruanas",
      "Ciencias Marítimas: Es Bachiller en Ciencias Marítimo Navales por la Escuela Naval del Perú (2025)",
      "Posgrados: Posee un Máster en Gestión y Análisis de Políticas Públicas por la Universidad Carlos III de Madrid, España (2009). Además, cuenta con estudios de posgrado concluidos en Ingeniería de Telecomunicaciones por el INICTEL",
    ],
    controversias: [
      "En su hoja de vida oficial presentada ante el Jurado Nacional de Elecciones, el candidato declara no tener sentencias condenatorias firmes por delitos dolosos, ni sentencias por incumplimiento de obligaciones alimentarias, contractuales o de violencia familiar",
    ],
    ideologiaPolitica: "El candidato se identifica con el \"Patriotismo\", una postura que prioriza la soberanía nacional y la identidad peruana. Su propuesta ideológica se centra en la industrialización de la patria, el fortalecimiento de la seguridad nacional y la meritocracia técnica. El partido que lidera promueve una visión de Estado eficiente y productivo, distanciándose de las etiquetas tradicionales de izquierda o derecha para enfocarse en lo que denominan \"desarrollo nacional\".",
    financiamiento: {
      total: "S/ 861,259.32",
      sources: [
        "Ingresos anuales (2024): Reportó un total de 186,259.32 soles, provenientes tanto del sector público (remuneración bruta) como del sector privado (ejercicio individual de profesión)",
        "Patrimonio empresarial: Posee acciones en sus empresas educativas (Caller Language Center y Caller Colegio Internacional) con un valor nominal total de 75,000 soles",
        "Propiedades: Registra bienes inmuebles en Lima (Pachacámac) y Ucayali (Coronel Portillo) con un valor comercial declarado superior a los 600,000 soles",
      ],
    },
    experiencia: [
      "Carrera Militar: Se desempeñó como Oficial Superior en la Marina de Guerra del Perú durante 21 años, sirviendo desde 1996 hasta su pase al retiro en el año 2017",
      "Sector Empresarial: Es fundador, gerente general y director general de dos instituciones educativas: Caller Language Center SAC (desde 2015) y Caller Colegio Internacional de Super Aprendizaje SAC (desde 2016)",
      "Liderazgo Político: Ejerce como Presidente Fundador del Partido Patriótico del Perú desde el año 2020 hasta la actualidad",
    ],
    logros: [
      "Emprendimiento Educativo: Ha logrado establecer y mantener operativas instituciones especializadas en metodologías de aprendizaje acelerado y enseñanza de idiomas",
      "Ascenso Militar: Alcanzó el grado de Oficial Superior dentro de la Marina de Guerra, una posición que implica mando y gestión de recursos estratégicos del Estado",
      "Institucionalidad Política: Logró la fundación e inscripción de una organización política propia de alcance nacional para participar en las elecciones generales",
    ],
    propuestas: [
      "Seguridad Ciudadana: Propone el uso de inteligencia avanzada para desarticular bandas de extorsión y recuperar el control territorial mediante el binomio policía-comunidad, con el apoyo de licenciados de las Fuerzas Armadas",
      "Reforma Educativa: Implementación masiva de metodologías de \"super aprendizaje\" en el 100% de colegios para el 2031. Plantea descentralizar facultades de la UNI, San Marcos y la Agraria hacia las 25 regiones del país",
      "Cárceles Productivas: Transformar el 100% de los penales en centros de trabajo donde los internos produzcan bienes para autosostenerse y resocializarse",
      "Infraestructura y Soberanía: Impulsar la creación de una línea aérea de bandera nacional, la construcción del mega puerto de Corio y el desarrollo de la red dorsal de fibra óptica en todo el país",
      "Economía e Industria: Meta de lograr que el sector industrial represente más del 20% del PBI para el 2031, junto con un control estricto sobre la transferencia de tierras agrícolas a capitales extranjeros para garantizar la soberanía alimentaria",
    ],
  },
  "roberto-helbert-sanchez-palomino": {
    key: "roberto-helbert-sanchez-palomino",
    name: "Roberto Helbert Sánchez Palomino",
    party: "Juntos por el Perú",
    birthDate: "1969-02-03",
    img: "/candidatos/roberto-helbert-sanchez-palomino.webp",
    imgHover: "/partidos/juntos-por-el-peru.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/roberto-helbert-sanchez-palomino.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/roberto-helbert-sanchez-palomino.pdf",
    biografia: "Roberto Helbert Sánchez Palomino nació el 3 de febrero de 1969 en el distrito y provincia de Huaral, departamento de Lima. Actualmente tiene fijado su domicilio en el distrito de San Borja, en la ciudad de Lima. Es un psicólogo y político peruano que ha desempeñado roles de alta dirección tanto en el Poder Ejecutivo como en el Legislativo.",
    historialAcademico: [
      "Pregrado: Es egresado y titulado en Psicología por la Universidad Nacional Mayor de San Marcos, obteniendo el grado de Bachiller en 1998 y el título profesional en el año 2000",
      "Posgrado: Concluyó estudios de Maestría en Políticas Sociales con mención en Proyectos Sociales en la Pontificia Universidad Católica del Perú (PUCP)",
    ],
    controversias: [
      "Si bien su hoja de vida no registra sentencias condenatorias firmes, su gestión como Ministro de Estado ha estado bajo el escrutinio público debido a la inestabilidad política del periodo 2021-2022. Su plan de gobierno identifica como un problema central la \"criminalización de la protesta social\" y prácticas de \"terruqueo\" como política estatal, proponiendo la revisión y anulación de casos por motivos de persecución política",
    ],
    ideologiaPolitica: "Su postura política se define por una crítica estructural al sistema vigente y la búsqueda de un cambio constitucional. Propugna el retorno a la democracia mediante una Nueva Constitución redactada a través de una Asamblea Constituyente que sea fruto de la voluntad popular. Su visión de Estado es la de un ente garante de derechos, plurinacional y descentralizado, que recupere la soberanía sobre los recursos estratégicos del país.",
    financiamiento: {
      total: "S/ 35,000.00",
      sources: [
        "En su declaración jurada de hoja de vida, el candidato declara la posesión de un predio rural en la Casa Hacienda Huando (Huaral) bajo sociedad conyugal, valorizado en S/ 35,000.00",
        "No se registran aportes de campaña específicos en los documentos del plan de gobierno analizados, los cuales se rigen bajo las normas de transparencia del Jurado Nacional de Elecciones",
      ],
    },
    experiencia: [
      "Poder Legislativo: Congresista de la República desde el año 2021 hasta la actualidad",
      "Poder Ejecutivo: Se desempeñó como Ministro de Comercio Exterior y Turismo entre 2021 y 2022",
      "Gestión Municipal: Ocupó la Gerencia de Desarrollo Social en la Municipalidad Provincial de Huaral (2020), la Gerencia de Capital Humano en la Municipalidad de San Borja (2019-2020) y la Gerencia de Administración y Finanzas en la Municipalidad Provincial de Huaura (2017)",
    ],
    logros: [
      "Ha sido apoderado y representante legal de la organización política Juntos por el Perú desde el año 2024",
      "Como Ministro de Estado, lideró la cartera de Comercio Exterior y Turismo durante un periodo crítico de reactivación económica post-pandemia",
    ],
    propuestas: [
      "Salud: Incrementar el presupuesto al 8% del PBI, reducir el gasto de bolsillo del ciudadano a menos del 15% y garantizar un tiempo máximo de espera de 72 horas para servicios de apoyo al diagnóstico",
      "Educación: Alcanzar \"Analfabetismo Cero\", reducir la deserción escolar a menos del 2% y triplicar el número de docentes a tiempo completo en las universidades",
      "Economía: Prohibir gradualmente la exportación de minerales sin procesamiento, industrializar el país y reducir la informalidad laboral al 60%",
      "Seguridad: Reforma estructural de la Policía Nacional (PNP) con evaluación del 100% del personal en integridad y fomento del servicio militar voluntario con formación técnica para 100 mil personas",
      "Justicia Fiscal: Crear un impuesto a las grandes fortunas en situaciones de crisis e incrementar la presión tributaria al 25% del PBI",
      "Agricultura: Tecnificar la agricultura familiar, orientar la producción hacia la seguridad alimentaria y garantizar la ganancia de los pequeños productores",
    ],
  },
  "ricardo-pablo-belmont-cassinelli": {
    key: "ricardo-pablo-belmont-cassinelli",
    name: "Ricardo Pablo Belmont Cassinelli",
    party: "Partido Cívico Obras",
    birthDate: "1945-08-29",
    img: "/candidatos/ricardo-pablo-belmont-cassinelli.webp",
    imgHover: "/partidos/partido-civico-obras.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/ricardo-pablo-belmont-cassinelli.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/ricardo-pablo-belmont-cassinelli.pdf",
    biografia: "Ricardo Pablo Belmont Cassinelli nació en Lima el 29 de agosto de 1945. Es hijo de Augusto Belmont Bar y Cristina Cassinelli de Belmont. A lo largo de su vida, ha consolidado una carrera multifacética como empresario de medios de comunicación, locutor de radio, conductor de televisión y político. Es reconocido por fundar RBC Televisión (Red Bicolor de Comunicaciones) en 1986 y por ser el principal promotor y conductor de la Teletón Perú entre 1981 y 2005.",
    historialAcademico: [
      "Educación básica: Realizó sus estudios primarios en el Colegio Inmaculado Corazón y la secundaria en el Colegio Santa María",
      "Educación superior: Se graduó como Bachiller en Administración de Empresas por la Universidad de Lima",
    ],
    controversias: [
      "Caso RBC: Ha enfrentado denuncias y procesos legales por parte de accionistas minoritarios de su canal de televisión, quienes lo acusaron de presunta estafa y mala gestión de la empresa",
      "Disputas por medios: En 2022 y 2023, protagonizó un conflicto judicial y físico por el control de la señal de RBC Radio con el comunicador Phillip Butters, lo que derivó en acusaciones fiscales por usurpación agravada",
      "Posturas sanitarias: Durante la pandemia de COVID-19, fue criticado por promover el desacato a medidas restrictivas y cuestionar la eficacia de las vacunas, información calificada como falsa por diversos verificadores de datos",
      "Relación con Pedro Castillo: Su breve designación como asesor del despacho presidencial durante el gobierno de Pedro Castillo generó críticas por la polarización y el perfil del candidato",
    ],
    ideologiaPolitica: "Su pensamiento político se articula a través del Partido Cívico OBRAS, el cual define como una organización nacionalista que promueve valores como la libertad, honestidad, transparencia y solidaridad. Su enfoque se centra en la \"política de las obras\" frente a las ideologías tradicionales, priorizando la ejecución técnica y la descentralización administrativa y económica del Estado. En años recientes, ha mostrado posturas críticas hacia el sistema político establecido y los medios de comunicación tradicionales.",
    financiamiento: {
      total: "S/ 1,043,710.80",
      sources: [
        "Ingresos personales: Declaró ingresos por S/ 742,196.80 durante el año 2024",
        "Aportes recibidos: Informó un aporte de S/ 168,500 enviado por su hermano desde el exterior (España) y aportes voluntarios de personas naturales vía Yape y PayPal que suman aproximadamente S/ 133,014.00",
      ],
    },
    experiencia: [
      "Empresario: Ha sido director del Instituto Peruano de Administración de Empresas (IPAE) entre 1979 y 1981, y es el accionista principal de Red Bicolor de Comunicaciones S.A.A.",
      "Alcalde de Lima: Ejerció el cargo durante dos periodos consecutivos (1990-1992 y 1993-1995) tras fundar el Movimiento Cívico Independiente OBRAS en 1989",
      "Congresista de la República: Se desempeñó como legislador en el periodo 2009-2011, ingresando en reemplazo del fallecido Alberto Andrade",
      "Candidato presidencial: Ha postulado a la presidencia en 1995 y participado en diversos procesos electorales posteriores con diferentes alianzas políticas",
    ],
    logros: [
      "Infraestructura: Construcción del Trébol de Javier Prado, la Avenida Universitaria, el Bypass de Alfonso Ugarte, el Óvalo Higuereta y el Puente El Agustino (Puente Nuevo)",
      "Gestión urbana: Reconstrucción de la Costa Verde en el tramo Magdalena-San Miguel y peatonalización del Jirón de la Unión",
      "Institucional: Creación del Sistema de Administración Tributaria (SAT) y obtención del título de Lima como Patrimonio Cultural de la Humanidad por la Unesco en 1991",
      "Labor social: Lideró múltiples campañas de solidaridad, destacando su rol en la Teletón para el Hogar Clínica San Juan de Dios",
    ],
    propuestas: [
      "Salud y Nutrición: Implementar el plan \"Tu Salud Me Importa\" para asegurar acceso en zonas rurales, reducir la desnutrición infantil al 10% y rehabilitar el 50% de los centros de salud paralizados",
      "Seguridad y Justicia: Reestructurar el sistema de justicia (PNP, Ministerio Público, Poder Judicial) e implementar controles rigurosos para reducir la carga procesal en un plazo de dos años",
      "Obras Sociales: Lanzar el \"Plan Choque de Reactivación de Obras Paralizadas\" para culminar 1,500 proyectos en escuelas y postas médicas",
      "Participación Ciudadana: Crear 5,000 Comités Cívicos de Obra y Vigilancia y el programa \"Plazas Activas\" para recuperar 1,000 espacios públicos",
      "Educación: Revertir brechas de infraestructura y calidad en la educación básica para reducir la deserción escolar en zonas marginales",
    ],
  },
  "roberto-enrique-chiabra-leon": {
    key: "roberto-enrique-chiabra-leon",
    name: "Roberto Enrique Chiabra León",
    party: "Unidad Nacional",
    birthDate: "1949-07-15",
    img: "/candidatos/roberto-enrique-chiabra-leon.webp",
    imgHover: "/partidos/unidad-nacional.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/roberto-enrique-chiabra-leon.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/roberto-enrique-chiabra-leon.pdf",
    biografia: "Roberto Enrique Chiabra León nació el 15 de julio de 1949 en la Provincia Constitucional del Callao. De ascendencia vinculada al deporte y la disciplina, creció en un entorno familiar que le inculcó el valor del esfuerzo físico y la rectitud. Su vida ha estado marcada por una prolongada carrera en el Ejército del Perú, donde alcanzó los más altos grados de la jerarquía militar antes de incursionar en la escena política nacional. Actualmente, se desempeña como Congresista de la República para el periodo 2021-2026, integrando comisiones clave como Defensa Nacional, Inteligencia y Educación.",
    historialAcademico: [
      "Educación Básica: Concluyó sus estudios primarios y secundarios de manera satisfactoria",
      "Formación Superior: Es graduado de la Escuela Militar de Chorrillos, donde se especializó en el arma de infantería",
      "Otros estudios: A lo largo de su carrera militar, ha realizado diversos cursos de especialización y altos estudios en defensa y estrategia nacional",
    ],
    controversias: [
      "Vínculos en los 90: Se le ha señalado por una presunta cercanía con el entorno de Vladimiro Montesinos debido a su designación en el SIN en 1999, aunque él ha negado irregularidades y estos casos han sido archivados en instancias correspondientes",
      "Gestión en la Escuela Militar: En 1998 fue objeto de una inspección por presuntos malos manejos administrativos en dicha institución, situación que en su momento derivó en su pase a retiro temporal",
      "Declaraciones polémicas: Ha sido criticado por comentarios considerados despectivos hacia colegas parlamentarios de regiones y por expresar cierta simpatía histórica hacia las reformas de Velasco Alvarado, lo que genera resistencia en sectores conservadores",
    ],
    ideologiaPolitica: "Su postura se define como humanista y de centroderecha, centrada en los conceptos de \"Orden y Unidad\". Propone un modelo de Economía Social de Mercado y considera que la democracia debe sustentarse en el respeto estricto a la autoridad y la ley. Su visión estratégica busca posicionar al Perú como un país hegemónico en el Pacífico Sur mediante el fortalecimiento del Estado-Nación y la integridad territorial. El plan de gobierno se estructura en metas específicas en seguridad ciudadana, economía y minería, salud social, infraestructura, y educación y juventud.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Para el proceso electoral 2026, el candidato lidera la Alianza Unidad Nacional (integrada por el Partido Popular Cristiano, Unidad y Paz, y Peruanos Unidos Somos Libros)",
        "El financiamiento de su campaña se gestiona bajo las normativas de la ONPE, la cual ha asignado presupuestos para la franja electoral a los partidos participantes",
        "Los detalles específicos de aportaciones privadas se actualizan periódicamente en el portal de transparencia de dicha institución",
      ],
    },
    experiencia: [
      "Director de la Escuela Militar de Chorrillos: Se desempeñó como Director de la Escuela Militar de Chorrillos, donde supervisó el ingreso de la primera promoción de mujeres",
      "Comandante General del Ejército: Ejerció como Comandante General del Ejército (2002-2003) y participó activamente en conflictos operativos, siendo reconocido por su rol en el conflicto del Cenepa",
      "Ministro de Defensa: Ejerció como Ministro de Defensa entre 2003 y 2005 bajo el gobierno de Alejandro Toledo",
      "Congresista de la República: Actualmente, se desempeña como Congresista de la República para el periodo 2021-2026, integrando comisiones clave como Defensa Nacional, Inteligencia y Educación",
      "Carrera Militar: Su trayectoria profesional se divide en dos grandes etapas, siendo la primera su prolongada carrera en el Ejército del Perú, donde alcanzó los más altos grados de la jerarquía militar",
      "Candidato Presidencial 2026: Lidera la Alianza Unidad Nacional para las Elecciones Generales 2026",
    ],
    logros: [
      "Defensa Nacional: Es reconocido como uno de los líderes militares que contribuyó a la victoria operativa en el conflicto con Ecuador",
      "Gestión Pública: Durante su paso por el Ministerio de Defensa, impulsó la modernización de procesos internos y el fortalecimiento de la institucionalidad de las Fuerzas Armadas",
      "Labor Legislativa: En el Congreso, ha mantenido una postura firme en temas de seguridad ciudadana, proponiendo la creación de brigadas de policía militar para enfrentar la criminalidad",
      "Dirección de la Escuela Militar de Chorrillos: Supervisó el ingreso de la primera promoción de mujeres en la Escuela Militar de Chorrillos",
      "Comandante General del Ejército: Alcanzó el cargo de Comandante General del Ejército (2002-2003)",
      "Participación en conflictos operativos: Participó activamente en conflictos operativos, siendo reconocido por su rol en el conflicto del Cenepa",
      "Ministro de Defensa: Ejerció como Ministro de Defensa entre 2003 y 2005 bajo el gobierno de Alejandro Toledo",
      "Congresista de la República: Se desempeña como Congresista de la República para el periodo 2021-2026, integrando comisiones clave como Defensa Nacional, Inteligencia y Educación",
      "Candidato presidencial de la Alianza Unidad Nacional para las Elecciones Generales 2026",
    ],
    propuestas: [
      "Seguridad Ciudadana: Implementación de un plan de \"Terrorismo Urbano\" para endurecer penas, incomunicación total de delincuentes en penales y el uso estratégico de las fuerzas armadas en apoyo a la policía",
      "Economía y Minería: Meta de alcanzar 100 mil millones de dólares en exportaciones y convertir al Perú en el primer productor mundial de cobre, fomentando la inversión privada con seguridad jurídica",
      "Salud Social: Reducción drástica de la anemia y desnutrición crónica infantil (menores de 5 años) mediante un plan multisectorial con énfasis en regiones de menores ingresos como Huancavelica y Loreto",
      "Infraestructura: Cierre de brechas en saneamiento (agua y desagüe) y vivienda mediante un Plan Nacional de Vivienda Social que integre los tres niveles de gobierno",
      "Educación y Juventud: Incremento de la propina/sueldo de los licenciados de las fuerzas armadas al nivel de un sueldo mínimo para evitar que sean captados por economías ilegales",
    ],
  },
  "rafael-bernardo-lopez-aliaga": {
    key: "rafael-bernardo-lopez-aliaga",
    name: "Rafael Bernardo López Aliaga",
    party: "Renovación Popular",
    birthDate: "1961-02-11",
    img: "/candidatos/rafael-bernardo-lopez-aliaga.webp",
    imgHover: "/partidos/renovacion-popular.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/rafael-bernardo-lopez-aliaga.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/rafael-bernardo-lopez-aliaga.pdf",
    biografia: "Rafael Bernardo López Aliaga Cazorla nació en Lima el 11 de febrero de 1961. Pasó gran parte de su infancia en los campos de Pomalca, Chiclayo, donde sus padres trabajaban como ingenieros químicos en la industria azucarera. Su formación temprana estuvo marcada por la disciplina científica de su entorno familiar y un interés precoz por las matemáticas y la cultura anglosajona. Es miembro del grupo católico Opus Dei y ha declarado públicamente su compromiso con el celibato y prácticas de religiosidad profunda.",
    historialAcademico: [
      "Ingeniería Industrial: Bachiller y título profesional obtenidos en la Universidad de Piura",
      "Posgrado: Magíster en Administración de Empresas (MBA) por la Universidad del Pacífico",
      "Docencia: Ha desempeñado el cargo de catedrático en la Universidad Nacional de Ingeniería (UNI) entre los años 2017 y 2020",
    ],
    controversias: [
      "Deudas coactivas: Se le ha vinculado con deudas acumuladas ante la SUNAT por parte de diversas empresas ligadas a su holding, cifras que superarían los 30 millones de soles, aunque él ha negado deudas personales directas",
      "Investigaciones Judiciales: Ha sido incluido en investigaciones preliminares relacionadas con el caso Panama Papers y presunto lavado de activos, procesos en los que ha solicitado su exclusión mediante recursos legales",
      "Contrataciones Municipales: Recientemente, ha enfrentado denuncias por presuntas irregularidades en contratos suscritos por la Municipalidad de Lima con estudios de abogados extranjeros",
    ],
    ideologiaPolitica: "Se autodefine como socialcristiano, aunque analistas políticos clasifican su postura como de derecha conservadora o ultraconservadora. Su ideología se centra en la defensa de la vida desde la concepción, el fortalecimiento de la familia tradicional, el libre mercado con enfoque nacionalista y una postura frontal contra el comunismo y lo que denomina \"mafia caviar\". Propugna un Estado eficiente pero reducido, con fuerte énfasis en la meritocracia y la transparencia.",
    financiamiento: {
      total: "S/ 170,000+ (multas por uso indebido de fondos públicos)",
      sources: [
        "Su partido, Renovación Popular, recibe financiamiento público directo conforme a la normativa electoral peruana. Sin embargo, el partido ha sido sancionado con multas superiores a los 170,000 soles por el uso indebido de estos fondos públicos en gastos no permitidos por la Ley de Organizaciones Políticas",
        "Adicionalmente, durante sus campañas previas, ha declarado que gran parte del soporte económico provino de sus propios recursos como empresario y aportes voluntarios de simpatizantes",
      ],
    },
    experiencia: [
      "Sector Ferroviario: Director de PeruRail S.A. (1999-2022) y Ferrocarril Trasandino S.A. (1990-2022)",
      "Sector Hotelero: Director en Peru Belmond Hotels S.A. durante más de tres décadas (1990-2022)",
      "Gestión Pública: Actualmente ejerce como Alcalde Metropolitano de Lima (2023-2026). Anteriormente, fue regidor de la Municipalidad de Lima entre 2007 y 2010",
    ],
    logros: [
      "Como empresario, destaca la co-fundación de Peruval Corp y la consolidación de cadenas hoteleras de lujo que atrajeron inversión extranjera al sector turismo en Cusco",
      "En su gestión municipal, resalta la implementación del programa \"Hambre Cero\" mediante la entrega de insumos y equipamiento a ollas comunes",
      "Ampliación del Metropolitano hacia el norte de Lima y la puesta en marcha de planes de recuperación de vías metropolitanas en diversos distritos",
    ],
    propuestas: [
      "Seguridad Ciudadana: Expulsión inmediata de extranjeros condenados, uso de grilletes electrónicos para delincuentes primarios y dotación de mayor equipamiento y efectivos a la policía",
      "Lucha contra la Corrupción: Reforma del Poder Judicial y Ministerio Público, creación de una Escuela de Jueces y Fiscales, y propuesta de cadena perpetua para funcionarios corruptos",
      "Salud y Nutrición: Expansión nacional de la red de Hospitales de la Solidaridad y erradicación de la anemia infantil mediante programas de asistencia alimentaria directa",
      "Economía e Infraestructura: Meta de crecimiento del PBI al 7% anual, reducción de ministerios para optimizar el gasto y fomento de la inversión privada mediante zonas francas y proyectos de infraestructura de transporte masivo",
    ],
  },
  "rafael-jorge-belaunde-llosa": {
    key: "rafael-jorge-belaunde-llosa",
    name: "Rafael Jorge Belaunde Llosa",
    party: "Libertad Popular",
    birthDate: "1974-12-26",
    img: "/candidatos/rafael-jorge-belaunde-llosa.webp",
    imgHover: "/partidos/libertad-popular.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/rafael-jorge-belaunde-llosa.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/rafael-jorge-belaunde-llosa.pdf",
    biografia: "Rafael Jorge Belaunde Llosa nació en Lima el 26 de diciembre de 1974. Proviene de una familia con un profundo arraigo en la política peruana: es nieto del dos veces presidente Fernando Belaunde Terry e hijo del exsenador Rafael Belaunde Aubry. Está casado y tiene tres hijos. A pesar de su linaje político, su trayectoria principal se ha desarrollado en el sector privado, especialmente en el ámbito empresarial inmobiliario y de saneamiento. Es el fundador y actual presidente del partido Libertad Popular, inscrito formalmente ante el Jurado Nacional de Elecciones en junio de 2023.",
    historialAcademico: [
      "Formación base: Su formación base es la de economista, grado obtenido en la Universidad de Lima",
      "Columnista de opinión: Además de su formación profesional, ha sido columnista de opinión en medios de comunicación como Perú 21 y La República, donde analiza temas de coyuntura nacional y económica",
    ],
    controversias: [
      "Atentado Reciente: En diciembre de 2025, Belaunde Llosa fue víctima de un atentado con armas de fuego del cual resultó ileso. El candidato ha vinculado este hecho a la situación de inseguridad generalizada y ha denunciado que el Congreso legisla a favor de economías ilegales",
      "Brevedad en el Cargo: Se le ha cuestionado por su corto periodo como ministro (aproximadamente 20 días), lo que sus detractores señalan como una falta de experiencia prolongada en la gestión pública de alto nivel",
      "Postura sobre el Fraude de 2021: En entrevistas pasadas, manifestó su preferencia por la candidatura de Keiko Fujimori en la segunda vuelta de 2021, aunque en ese momento descartó la existencia de un fraude sistemático organizado por las autoridades electorales",
    ],
    ideologiaPolitica: "Belaunde Llosa se define como liberal. Su partido, Libertad Popular, se identifica con la derecha liberal, defendiendo la economía social de mercado como la herramienta principal para la superación de la pobreza. Su ideario sostiene que la persona es anterior y superior al Estado, y promueve la competencia, la meritocracia y la reducción de la intervención estatal innecesaria en la vida económica de los ciudadanos. El plan de gobierno de Libertad Popular para el periodo 2026-2031 se estructura en torno a pilares de seguridad y reforma del Estado: seguridad y lucha contra el crimen, gestión pública y rendición de cuentas, reforma económica, y minería.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Reportes periodísticos han señalado una inversión visible en paneles y publicidad exterior en diversas regiones, lo cual ha generado debates sobre la opacidad y los costos de campaña, aunque el candidato ha sostenido que actúa dentro del marco legal",
        "El financiamiento se gestiona bajo las normativas de la ONPE y el Jurado Nacional de Elecciones",
      ],
    },
    experiencia: [
      "Sector Privado: Se desempeñó como gerente general de un conglomerado inmobiliario enfocado en la gestión de tierras, saneamiento y habilitación urbana. Residió durante siete años en Cerro de Pasco, donde fundó una empresa de saneamiento y negociación de tierras",
      "Sector Público: Su experiencia más destacada fue como Ministro de Energía y Minas durante el gobierno de Martín Vizcarra, cargo que ocupó brevemente entre julio y agosto de 2020",
      "Liderazgo Partidario: Es el fundador y actual presidente del partido Libertad Popular, inscrito formalmente ante el Jurado Nacional de Elecciones en junio de 2023",
      "Columnista: Ha sido columnista de opinión en medios de comunicación como Perú 21 y La República, donde analiza temas de coyuntura nacional y económica",
      "Candidato Presidencial 2026: Postula a la presidencia de la República por el partido Libertad Popular para las Elecciones Generales 2026",
    ],
    logros: [
      "Fundación del partido Libertad Popular, inscrito formalmente ante el Jurado Nacional de Elecciones en junio de 2023",
      "Capacidad para convocar a figuras de peso intelectual y político, como el Nobel Mario Vargas Llosa y el exministro Pedro Cateriano, para la fundación y fortalecimiento de su organización política",
      "Desempeño como gerente general de un conglomerado inmobiliario enfocado en la gestión de tierras, saneamiento y habilitación urbana",
      "Fundación de una empresa de saneamiento y negociación de tierras en Cerro de Pasco, donde residió durante siete años",
      "Designación como Ministro de Energía y Minas durante el gobierno de Martín Vizcarra (julio-agosto 2020)",
      "Ejercicio como columnista de opinión en medios de comunicación como Perú 21 y La República",
      "Candidato presidencial del partido Libertad Popular para las Elecciones Generales 2026",
    ],
    propuestas: [
      "Seguridad y Lucha contra el Crimen: Propone que el Presidente de la República asuma el liderazgo directo de la seguridad nacional. Plantea derogar las denominadas \"leyes procrimen\" que, según su visión, favorecen la impunidad y la minería ilegal",
      "Gestión Pública y Rendición de Cuentas: Creación del Viceministerio de Coordinación y Objetivos de Gobierno (VCO) dentro de la PCM para asegurar el cumplimiento de metas ministeriales basadas en datos verificables",
      "Reforma Económica: Fomento de la inversión privada con respeto ambiental, combate a monopolios y oligopolios, y una reforma del sistema de pensiones basada en la libertad del ciudadano para decidir sobre sus ahorros una vez cumplidas sus obligaciones tributarias",
      "Minería: Propone repensar la distribución del canon minero para que una parte llegue directamente a las poblaciones en las zonas de influencia de los proyectos",
    ],
  },
  "ronald-darwin-atencio-sotomayor": {
    key: "ronald-darwin-atencio-sotomayor",
    name: "Ronald Darwin Atencio Sotomayor",
    party: "Alianza Electoral Venceremos",
    birthDate: "1981-09-30",
    img: "/candidatos/ronald-darwin-atencio-sotomayor.webp",
    imgHover: "/partidos/alianza-electoral-venceremos.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/ronald-darwin-atencio-sotomayor.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/ronald-darwin-atencio-sotomayor.pdf",
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
    planGobiernoUrl: "/pdfs/planes-gobierno/rosario-del-pilar-fernandez-bazan.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/rosario-del-pilar-fernandez-bazan.pdf",
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
  "luis-fernando-olivera-vega": {
    key: "luis-fernando-olivera-vega",
    name: "Luis Fernando Olivera Vega",
    party: "Partido Frente de la Esperanza 2021",
    birthDate: "1958-07-26",
    img: "/candidatos/luis-fernando-olivera-vega.webp",
    imgHover: "/partidos/frente-de-la-esperanza.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/luis-fernando-olivera-vega.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/luis-fernando-olivera-vega.pdf",
    biografia: "Luis Fernando Olivera Vega nació en Lima el 26 de julio de 1958. Es un administrador de empresas de profesión, formado en la Universidad del Pacífico. Conocido popularmente como \"Popy\", su trayectoria se ha caracterizado por un estilo confrontacional y su constante discurso de fiscalización contra la corrupción. Inició su vida política en el Partido Popular Cristiano (PPC) antes de fundar sus propias agrupaciones.",
    historialAcademico: [
      "Pregrado: Bachiller en Ciencias con mención en Administración por la Universidad del Pacífico",
      "Posgrado: Cuenta con un Máster Oficial en Relaciones Internacionales por la Universidad Complutense de Madrid (2008), aunque el título no figura registrado en la SUNEDU según su declaración jurada",
    ],
    controversias: [
      "Caso Interoceánica: Se le imputa el presunto delito de colusión agravada relacionado con la concesión de la carretera Interoceánica durante el gobierno de Toledo. El Poder Judicial ha rechazado en repetidas ocasiones sus pedidos para archivar esta investigación",
      "Asuntos Judiciales Recientes: En enero de 2024, fue detenido brevemente tras ser declarado \"reo contumaz\" por no asistir a las audiencias de un juicio por difamación interpuesto por la gobernadora de Moquegua",
      "Cartas del Vaticano: En 2001, protagonizó un escándalo al presentar cartas supuestamente enviadas por autoridades del Vaticano que resultaron ser apócrifas, con el fin de cuestionar al cardenal Juan Luis Cipriani",
    ],
    ideologiaPolitica: "Su pensamiento se enmarca en una postura reformista con énfasis en la moralización pública. Actualmente lidera el Partido Frente de la Esperanza 2021, cuyo ideario promueve una \"Economía Social de Mercado\" dentro de un Estado de Bienestar. Defiende el rol subsidiario del Estado, pero sostiene que este debe actuar como un árbitro social decidido para garantizar la igualdad de oportunidades en salud, educación y justicia.",
    financiamiento: {
      total: "S/ 225,000.00",
      sources: [
        "En sus declaraciones recientes, figura una participación en la consultora Yorkshire & Benel Asesores y Consultores por un valor de 225,000 soles (2024)",
        "En cuanto a sus bienes, declara un vehículo Volvo del año 2004 valorizado en 15,000 soles y un mutuo hipotecario sobre un departamento en San Isidro",
      ],
    },
    experiencia: [
      "Labor Parlamentaria: Fue el diputado más joven del Congreso en 1985. Se desempeñó como diputado (1985-1992), congresista constituyente (1992-1995) y congresista de la República en dos periodos (1995-2001)",
      "Cargos Ejecutivos: Ejerció como Ministro de Justicia (2001-2002) y Ministro de Relaciones Exteriores (2005) durante el gobierno de Alejandro Toledo",
      "También fue Embajador del Perú en España",
    ],
    logros: [
      "Hito Político: Su logro más recordado fue la difusión del primer \"vladivideo\" en septiembre de 2000, el cual precipitó la caída del régimen de Alberto Fujimori al mostrar al asesor Vladimiro Montesinos sobornando a un congresista",
    ],
    propuestas: [
      "Reforma del Estado: Propone la \"Ley Patriota\" para eliminar la inmunidad de altos funcionarios y refundar las instituciones mediante un referéndum nacional",
      "Salud y Nutrición: Meta de reducir a cero la desnutrición crónica infantil y elevar el presupuesto de salud al 7% del PBI",
      "Educación: Garantizar que el 100% de los estudiantes culminen la primaria y secundaria, con un fuerte enfoque en ciencia y tecnología",
      "Energía y Ambiente: Promover el uso de energías limpias y fortalecer el control estatal sobre la explotación de recursos naturales para combatir el tráfico ilícito",
      "Transparencia: Creación de una Secretaría de Estado de Transparencia para publicar en tiempo real la ejecución del presupuesto público",
    ],
  },
  "keiko-sofia-fujimori-higuchi": {
    key: "keiko-sofia-fujimori-higuchi",
    name: "Keiko Sofía Fujimori Higuchi",
    party: "Fuerza Popular",
    birthDate: "1975-05-25",
    img: "/candidatos/keiko-sofia-fujimori-higuchi.webp",
    imgHover: "/partidos/fuerza-popular.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/keiko-sofia-fujimori-higuchi.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/keiko-sofia-fujimori-higuchi.pdf",
    biografia: "Nacida en Lima el 25 de mayo de 1975, es la hija mayor del expresidente Alberto Fujimori y Susana Higuchi. Su ingreso a la esfera pública ocurrió a los 19 años, cuando asumió el rol de Primera Dama del Perú (1994-2000) tras la separación de sus padres, convirtiéndose en la persona más joven en el continente en ejercer tales funciones protocolares. Está casada con Mark Vito Villanella y es madre de dos hijas.",
    historialAcademico: [
      "Realizó sus estudios de pregrado en Estados Unidos, donde se graduó en Administración de Empresas por la Universidad de Boston en 1997",
      "Posteriormente, consolidó su formación con una Maestría en Administración de Empresas (MBA) en la Columbia University de Nueva York en 2008",
    ],
    controversias: [
      "Caso Cócteles: El caso más mediático es el denominado \"Caso Cócteles\", donde la Fiscalía ha investigado presuntos aportes ilícitos de la constructora Odebrecht y otros grupos empresariales para sus campañas de 2011 y 2016. Estas pesquisas la llevaron a cumplir periodos de prisión preventiva que suman más de 480 días",
      "Investigaciones por presunto financiamiento ilegal y uso indebido de fondos en la campaña de 2021",
      "Otra controversia persistente gira en torno al origen de los fondos utilizados para financiar sus estudios en el extranjero durante la década de los 90",
    ],
    ideologiaPolitica: "Se define bajo la doctrina del fujimorismo, caracterizada por un conservadurismo social y un modelo económico neoliberal. Su ideario promueve la defensa de la vida desde la concepción, la familia como célula fundamental de la sociedad y el derecho de los padres a dirigir la educación de sus hijos. En lo económico, defiende la economía social de mercado con una participación subsidiaria del Estado y la protección de la inversión privada como motor de empleo.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Su carrera ha estado marcada por investigaciones judiciales complejas relacionadas con presuntos aportes ilícitos de la constructora Odebrecht y otros grupos empresariales para sus campañas de 2011 y 2016",
        "Enfrenta investigaciones por presunto financiamiento ilegal y uso indebido de fondos en la campaña de 2021",
        "Controversia persistente gira en torno al origen de los fondos utilizados para financiar sus estudios en el extranjero durante la década de los 90",
      ],
    },
    experiencia: [
      "Elegida congresista de la República para el período 2006–2011",
      "Desempeñó labor legislativa enfocada en políticas de seguridad ciudadana y sistema penitenciario",
      "Impulsó proyectos de ley orientados a la restricción de beneficios penitenciarios para reincidentes y autores de delitos graves",
      "Fundó en 2010 el partido político Fuerza 2011 (posteriormente Fuerza Popular)",
      "Lideró Fuerza Popular como presidenta del partido desde su creación",
      "Candidata presidencial en los procesos electorales de 2011, 2016 y 2021",
      "Asumió el rol de Primera Dama del Perú (1994-2000) tras la separación de sus padres",
    ],
    logros: [
      "Obtuvo la votación más alta registrada en su elección congresal (2006)",
      "Posicionó a su partido en la segunda vuelta presidencial en tres elecciones consecutivas (2011, 2016 y 2021)",
      "Alcanzó una mayoría histórica en el Congreso en 2016, con 73 escaños",
      "Consolidó a Fuerza Popular como una de las principales fuerzas políticas del país",
      "Se convirtió en la persona más joven en el continente en ejercer las funciones protocolares de Primera Dama del Perú",
    ],
    propuestas: [
      "Seguridad Ciudadana: Implementación de un Sistema Nacional de Videovigilancia (C5i) interconectado en las 24 regiones del país para reducir los niveles de victimización",
      "Salud: Despliegue de un sistema nacional de telemedicina operativa en el 100% de los centros del primer nivel de atención para reducir los tiempos de espera hospitalaria en un 30%",
      "Vivienda: Desarrollo de un programa integral que incluye la construcción masiva de viviendas, titulación digital y el programa \"Compra de Vivienda para Jóvenes\"",
      "Lucha contra la Corrupción: Fortalecimiento del sistema nacional de control para reducir en un 30% las pérdidas anuales por inconducta funcional y corrupción",
      "Infraestructura Estratégica: Ejecución de proyectos clave como la Nueva Carretera Central, la modernización de aeropuertos regionales y la Autopista del Sol para reducir costos logísticos",
      "Rendición de Cuentas: Propuesta de presentar informes semestrales de metas al Congreso y la implementación de un Sistema Nacional de Transparencia con datos en tiempo real para el control ciudadano",
    ],
  },
  "jose-williams-zapata": {
    key: "jose-williams-zapata",
    name: "José Williams Zapata",
    party: "Avanza País – Partido de Integración Social",
    birthDate: "1951-11-09",
    img: "/candidatos/jose-williams-zapata.webp",
    imgHover: "/partidos/avanza-pais.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/jose-williams-zapata.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/jose-williams-zapata.pdf",
    biografia: "José Daniel Williams Zapata nació en Lima el 9 de noviembre de 1951. Es un General de División en retiro del Ejército del Perú y actual congresista de la República. Su vida pública ha estado marcada por una carrera de 40 años en las Fuerzas Armadas, donde alcanzó los más altos grados de mando. Su figura cobró relevancia nacional e internacional en 1997, consolidándose años después como una figura política activa dentro del bloque de derecha en el Perú.",
    historialAcademico: [
      "Licenciatura y Bachillerato en Ciencias Militares: Obtenidos en la Escuela Militar de Chorrillos (2009)",
      "Maestría en Desarrollo y Defensa Nacional: Realizada en el Centro de Altos Estudios Nacionales - CAEN (2011)",
    ],
    controversias: [
      "Caso Accomarca: En la década de los 80, fue vinculado a la investigación por la masacre de 69 campesinos en Ayacucho. Tras un largo proceso judicial, el Poder Judicial lo absolvió de responsabilidad directa, aunque el caso sigue siendo citado por sectores de derechos humanos",
      "Cuestionamientos en la Presidencia del Congreso: En 2023, su gestión fue criticada por el aumento en el gasto público destinado a beneficios para congresistas, como el servicio de buffet y la compra de alfombras, lo que generó denuncias por presunta colusión",
    ],
    ideologiaPolitica: "Postula por el partido Avanza País - Partido de Integración Social. Su postura se alinea con el liberalismo económico y el conservadurismo institucional. Defiende el libre mercado, la propiedad privada y la inversión extranjera como motores de desarrollo. En el aspecto social, promueve el principio de \"orden y seguridad\", favoreciendo el fortalecimiento de las fuerzas del orden y una lucha frontal contra la criminalidad y los remanentes subversivos.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "El financiamiento de su campaña y de su partido, Avanza País, proviene principalmente de aportes declarados ante la ONPE por parte de simpatizantes, militantes y recursos propios del partido",
        "En sus declaraciones juradas, registra bienes inmuebles (propiedades y copropiedades) y vehículos que respaldan su patrimonio personal, acumulado tras cuatro décadas de servicio público y pensiones militares",
      ],
    },
    experiencia: [
      "Ámbito Político (2021-Presente): Electo como Congresista de la República por el partido Avanza País. Durante este periodo, asumió la Presidencia del Congreso de la República (2022-2023) y la Presidencia de la Comisión de Defensa Nacional y Orden Interno (2021-2022)",
      "Ámbito Militar (1970-2010): Se desempeñó como Jefe del Comando Conjunto de las Fuerzas Armadas (2006-2007). Previamente, ocupó altos cargos de comando en regiones operativas estratégicas del país",
    ],
    logros: [
      "Liderazgo en la Operación Chavín de Huántar: Es reconocido históricamente por haber sido el jefe de la operación militar que rescató a 72 rehenes de la residencia del embajador de Japón en 1997, considerada una de las operaciones de rescate más exitosas del mundo",
      "Institucionalidad en el Congreso: Durante su gestión como Presidente del Parlamento, se le atribuye haber mantenido una línea de estabilidad institucional en un periodo de alta polarización tras la crisis política de diciembre de 2022",
      "Ascenso al Grado Máximo: Logró el grado de General de División, la jerarquía más alta dentro del escalafón del Ejército del Perú",
    ],
    propuestas: [
      "Salud y Nutrición: Reducción drástica de la anemia infantil a menos del 15% y digitalización del 90% de los servicios hospitalarios para eliminar las colas y la burocracia",
      "Seguridad Ciudadana: Incremento de la presencia policial con 60,000 nuevos efectivos y la modernización tecnológica de las comisarías para una respuesta inmediata al delito",
      "Reforma del Estado: Implementación del sistema de meritocracia de SERVIR en el 80% de las entidades públicas para asegurar que los funcionarios sean elegidos por capacidad y no por confianza política",
      "Infraestructura Hídrica: Construcción de plantas desalinizadoras para resolver la escasez de agua potable en las zonas más vulnerables de la costa peruana",
      "Medio Ambiente: Reducción de la deforestación amazónica en un 50% mediante el uso de incentivos económicos para los agricultores que protejan el bosque y la titulación rural masiva",
    ],
  },
  "jorge-nieto-montesinos": {
    key: "jorge-nieto-montesinos",
    name: "Jorge Nieto Montesinos",
    party: "Partido del Buen Gobierno",
    birthDate: "1951-10-29",
    img: "/candidatos/jorge-nieto-montesinos.webp",
    imgHover: "/partidos/partido-del-buen-gobierno.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/jorge-nieto-montesinos.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/jorge-nieto-montesinos.pdf",
    biografia: "Jorge Nieto Montesinos nació el 29 de octubre de 1951 en Arequipa, Perú. Desarrolló gran parte de su vida profesional en México, país donde consolidó su trayectoria intelectual y académica. Posteriormente retornó al Perú para asumir funciones públicas, participando activamente en el análisis y fortalecimiento de la vida democrática, así como en temas vinculados a la gobernabilidad y la ética política.",
    historialAcademico: [
      "Sociólogo por la Pontificia Universidad Católica del Perú (PUCP)",
      "Magíster en Ciencias Sociales por la Facultad Latinoamericana de Ciencias Sociales (FLACSO), México",
      "Especialización en cultura democrática, gobernabilidad y ética política",
      "Autor de múltiples publicaciones en estas áreas",
    ],
    controversias: [
      "Caso Odebrecht: En 2023, la fiscalía inició investigaciones preliminares que lo mencionan en el marco del caso Odebrecht, debido a su presunto rol como asesor durante la campaña contra la revocatoria de Susana Villarán. Nieto ha negado rotundamente estas acusaciones, calificándolas de calumnias y afirmando que sus asesorías fueron ad honorem",
      "Deuda de Mantenimiento: Se reportó un conflicto privado por una presunta deuda acumulada de aproximadamente 43,000 soles por cuotas de mantenimiento de un terreno en un club de playa. El candidato alegó en su momento que existían cobros indebidos y falta de auditorías sobre sus pagos reales",
    ],
    ideologiaPolitica: "Nieto define su propuesta como un equilibrio entre la justicia social y la eficiencia institucional. Si bien su origen es de izquierda, su visión actual defiende la economía de mercado con una regulación fuerte que evite los monopolios y la corrupción. Aboga por un Estado profesional y meritocrático, distanciándose de los extremos y promoviendo lo que denomina el \"buen gobierno\", centrado en la recuperación de lo público y la integridad ética en el ejercicio del poder.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "Para el actual proceso electoral, el financiamiento se rige por las normas del Jurado Nacional de Elecciones (JNE) y la ONPE para partidos inscritos",
        "Como presidente y fundador del Partido del Buen Gobierno, la organización política es la encargada de canalizar los aportes de militantes y simpatizantes, sujetos a la fiscalización de las autoridades electorales correspondientes",
      ],
    },
    experiencia: [
      "Gestión Pública: Se desempeñó como Ministro de Cultura (2016) y posteriormente como Ministro de Defensa (2016-2018) durante la gestión de Pedro Pablo Kuczynski. En el sector Defensa, lideró las acciones del Estado frente al fenómeno de \"El Niño Costero\" en 2017",
      "Trayectoria Internacional: Ha ocupado cargos directivos en la UNESCO como director de la Unidad para la Cultura Democrática y la Gobernabilidad, y ha presidido el Instituto Internacional para la Cultura Democrática",
      "Orígenes Políticos: En la década de 1970 fue presidente de la Federación de Estudiantes de la PUCP y militó en el Partido Comunista Revolucionario - Trinchera Roja",
    ],
    logros: [
      "Gestión de Desastres: Como Ministro de Defensa, recibió reconocimiento por la articulación de las Fuerzas Armadas en las labores de rescate y asistencia durante las inundaciones de 2017",
      "Defensa del Patrimonio: En el Ministerio de Cultura, impulsó el desarchivamiento de casos emblemáticos de sustracción de documentos históricos y solicitó ampliaciones presupuestales para metas del sector",
      "Producción Intelectual: Autor de libros referentes en la sociología política peruana como \"Izquierda y democracia en el Perú\" e \"Incertidumbre, Cambio y Decisión\"",
    ],
    propuestas: [
      "Salud Unificada: Implementar un sistema de salud único e integrado que unifique el MINSA, EsSalud y las sanidades de las fuerzas del orden, con la meta de que el 90% de la población acceda a servicios de calidad solo con su DNI para el año 2031",
      "Seguridad y Defensa: Instalación de un gabinete de lucha contra la criminalidad liderado diariamente por el Presidente a las 7:00 a.m.. Además, propone profesionalizar a la policía y reenfocar sus funciones hacia la prevención y sanción del crimen organizado",
      "Reforma del Estado y Meritocracia: Lograr que para el 2031 el 70% de los cargos directivos del sector público sean ocupados exclusivamente por mérito mediante el servicio civil profesional",
      "Educación y Juventud: Garantizar trayectorias educativas completas, apuntando a que el 95% de los jóvenes culminen la educación secundaria para el fin del quinquenio",
      "Medio Ambiente y Sostenibilidad: Fomentar una transición energética hacia fuentes renovables y asegurar la certificación ambiental en el 90% de los proyectos de transporte nacional",
    ],
  },
  "jose-leon-luna-galvez": {
    key: "jose-leon-luna-galvez",
    name: "José León Luna Gálvez",
    party: "Podemos Perú",
    birthDate: "1955-07-17",
    img: "/candidatos/jose-leon-luna-galvez.webp",
    imgHover: "/partidos/podemos-peru.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/jose-leon-luna-galvez.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/jose-leon-luna-galvez.pdf",
    biografia: "José León Luna Gálvez nació el 17 de julio de 1955 en el departamento de Lima. Es un empresario y político con una trayectoria de décadas en la esfera pública peruana. Actualmente reside en el distrito de San Isidro, Lima. Es el fundador de la organización política Podemos Perú, la cual preside desde el año 2021. Su trayectoria combina el sector público y privado, habiendo desempeñado funciones legislativas y empresariales a lo largo de su carrera.",
    historialAcademico: [
      "Bachiller en Ciencias Económicas (2000): Su formación profesional se ha desarrollado principalmente en la Universidad de San Martín de Porres",
      "Título profesional de Economista (2000): Obtenido en la Universidad de San Martín de Porres",
      "Maestro en Economía con mención en Comercio y Finanzas Internacionales (2004): Grado obtenido en la Universidad de San Martín de Porres",
      "Doctor en Educación (2005): Grado obtenido en la Universidad de San Martín de Porres",
    ],
    controversias: [
      "En su declaración jurada oficial de hoja de vida (DJHV), el candidato manifiesta no tener información que declarar respecto a sentencias condenatorias firmes por delitos dolosos. Asimismo, declara no tener sentencias firmes por incumplimiento de obligaciones familiares, alimentarias, contractuales, laborales o de violencia familiar",
    ],
    ideologiaPolitica: "La propuesta de Podemos Perú se enmarca en una gestión que busca el ordenamiento del Estado y la eficiencia económica. Su plan de gobierno enfatiza la recuperación de la autoridad estatal, la formalización económica y un enfoque en resultados medibles para la ciudadanía. Se plantea una modernización de la estructura del Ejecutivo mediante la fusión o desactivación de ministerios y programas que dupliquen funciones. El plan estratégico de Podemos Perú para el periodo 2026-2031 se centra en ejes de seguridad ciudadana, salud, economía y empleo, vivienda y saneamiento, educación y reforma del Estado.",
    financiamiento: {
      total: "S/ 11,409,038.64 (ingresos anuales 2024)",
      sources: [
        "Ingresos anuales (2024): Reportó un total de 11,409,038.64 soles, provenientes tanto del sector público como de rentas de acciones en el sector privado",
        "Bienes inmuebles: Posee 15 propiedades registradas, incluyendo predios en San Isidro, Cercado de Lima, San Juan de Lurigancho y San Miguel. Destaca una propiedad en la Av. 28 de Julio valorada en 14,881,500 soles",
        "Bienes muebles: Declara 12 vehículos, entre los que se encuentran camionetas Nissan Patrol y camiones Hyundai, con un valor total de 601,014.20 soles",
        "Titularidad de acciones y participaciones: La declaración jurada presentada detalla la titularidad de acciones y participaciones en empresas del sector educación y servicios, como el Instituto Superior Tecnológico Privado INTUR Perú e Instituto Internacional de Turismo E.I.R.L.. Sus ingresos principales declarados provienen de rentas de capital (acciones) y su remuneración como funcionario público",
      ],
    },
    experiencia: [
      "Experiencia legislativa: Se desempeña como Congresista de la República en el periodo 2021-2025. Previamente, ocupó el mismo cargo entre los años 2011 y 2016 bajo la Alianza Solidaridad Nacional",
      "Trayectoria partidaria: Antes de fundar Podemos Perú, estuvo vinculado a las organizaciones Alianza Electoral Solidaridad Nacional - UPP y Renovación Popular, a las cuales renunció en el año 2016",
      "Fundador y Presidente de Podemos Perú: Es el fundador de la organización política Podemos Perú, la cual preside desde el año 2021",
      "Actividad empresarial: Ha ejercido roles de asesoría en diversas instituciones, incluyendo el Instituto Superior Tecnológico Privado INTUR Perú, el Instituto Sabio Antúnez de Mayolo y la Universidad Privada Telesup",
      "Candidato Presidencial 2026: Postula por Podemos Perú para las Elecciones Generales 2026",
    ],
    logros: [
      "Obtención del título de Bachiller en Ciencias Económicas en la Universidad de San Martín de Porres (2000)",
      "Obtención del título profesional de Economista en la Universidad de San Martín de Porres (2000)",
      "Obtención del grado de Maestro en Economía con mención en Comercio y Finanzas Internacionales en la Universidad de San Martín de Porres (2004)",
      "Obtención del grado de Doctor en Educación en la Universidad de San Martín de Porres (2005)",
      "Elección como Congresista de la República bajo la Alianza Solidaridad Nacional (2011-2016)",
      "Reelección como Congresista de la República (2021-2025)",
      "Fundación de la organización política Podemos Perú",
      "Presidencia de Podemos Perú desde el año 2021",
      "Desarrollo de actividad empresarial en el sector educación y servicios",
      "Candidato presidencial de Podemos Perú para las Elecciones Generales 2026",
    ],
    propuestas: [
      "Seguridad Ciudadana: Implementar acciones estratégicas para recuperar el control de las calles y reducir la victimización urbana al 15% a nivel nacional",
      "Salud: Fortalecer el primer nivel de atención para que el 100% de los establecimientos tengan capacidad resolutiva cerca de la población",
      "Economía y Empleo: Impulsar un crecimiento del PBI entre el 6% y 8% anual, con la meta de generar 1,000,000 de nuevos empleos formales",
      "Vivienda y Saneamiento: Formalizar la propiedad mediante la titulación de 1,000,000 de viviendas y garantizar el acceso al agua potable para un millón de personas adicionales",
      "Educación: Ampliar el acceso a la universidad pública incrementando el número de vacantes en un 100% para el año 2031",
      "Reforma del Estado: Crear la Agencia de Monitoreo y Evaluación de Políticas Públicas, dependiente de la Presidencia, para verificar el cumplimiento periódico de las propuestas del plan de gobierno",
    ],
  },
  "mario-enrique-vizcarra-cornejo": {
    key: "mario-enrique-vizcarra-cornejo",
    name: "Mario Enrique Vizcarra Cornejo",
    party: "Perú Primero",
    birthDate: "1954-07-12",
    img: "/candidatos/mario-vizcarra.webp",
    imgHover: "/partidos/peru-primero.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/mario-enrique-vizcarra-cornejo.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/mario-enrique-vizcarra-cornejo.pdf",
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
  "maria-soledad-perez-tello-de-rodriguez": {
    key: "maria-soledad-perez-tello-de-rodriguez",
    name: "María Soledad Pérez Tello",
    party: "Primero La Gente",
    birthDate: "1969-04-11",
    img: "/candidatos/marisol-tello.webp",
    imgHover: "/partidos/primero-la-gente.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/maria-soledad-perez-tello-de-rodriguez.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/maria-soledad-perez-tello-de-rodriguez.pdf",
    biografia: "María Soledad Pérez Tello nació el 11 de abril de 1969 en el distrito de Ilabaya, provincia de Jorge Basadre, departamento de Tacna. Actualmente reside en el distrito de Santiago de Surco, en Lima. Se identifica con el Partido Político Primero La Gente, organización bajo la cual postula a la Presidencia de la República y al Senado.",
    historialAcademico: [
      "Grados académicos: Es abogada de profesión",
      "Posgrados: Cuenta con el grado de Doctora en Derecho por la Universidad San Martín de Porres",
      "Maestrías: Posee dos maestrías; una en Derecho Constitucional otorgada por la Universidad Católica de Santa María y otra en Derecho Registral y Notarial por la Universidad San Martín de Porres",
    ],
    controversias: [
      "En la documentación oficial presentada ante los organismos electorales, no se registran sentencias condenatorias firmes ni procesos disciplinarios que inhabiliten su postulación. Su historial se mantiene dentro del marco de la declaración jurada de hoja de vida estándar para procesos electorales nacionales",
    ],
    ideologiaPolitica: "La postura política de la candidata y su partido se define bajo los pilares de comunidad, ecología, libertad y progreso. Su propuesta promueve un Estado social activo con enfoque de derechos, igualdad de género e interculturalidad. Defiende la democracia como sistema fundamental y busca el fortalecimiento de la cohesión social mediante la reducción de brechas territoriales.",
    financiamiento: {
      total: "S/ 312,000.00+ (ingresos anuales)",
      sources: [
        "Ingresos anuales: Declara ingresos totales que superan los S/ 312,000.00, provenientes principalmente de su ejercicio profesional independiente y participaciones",
        "Participaciones empresariales: Posee acciones y participaciones en diversas entidades, compartidas bajo régimen de sociedad conyugal, entre las que figuran Rodríguez & Asociados Abogados SRL, Página 11 SAC, Nativas Explorer, Mgmagro SAC y Estrategia & Táctica SAC",
      ],
    },
    experiencia: [
      "Sector Público: Se desempeñó como Ministra de Justicia y Derechos Humanos entre los años 2016 y 2017. Previamente, ejerció el cargo de Congresista de la República en el periodo 2011-2016",
      "Sector Privado: Ejerce como notaria en la Notaría Pérez Tello desde el año 1999 hasta la actualidad",
      "Ámbito Académico: Ha sido docente en la Facultad de Derecho de la Universidad San Martín de Porres por más de dos décadas (1996-2020)",
    ],
    logros: [
      "Gestión ministerial: Liderazgo de la cartera de Justicia y Derechos Humanos, impulsando políticas de integridad y derechos fundamentales",
      "Labor legislativa: Desempeño como parlamentaria durante un periodo constitucional completo, participando en la fiscalización y creación de leyes",
      "Consolidación institucional: Participación activa en la fundación y liderazgo de su actual organización política, Primero La Gente",
    ],
    propuestas: [
      "Seguridad y Justicia: Implementar una política de \"Cero Tolerancia\" a la corrupción y recuperar el control efectivo del sistema penitenciario para reducir el crimen organizado",
      "Salud Unificada: Unificar el sistema nacional de salud con un enfoque descentralizado para garantizar acceso equitativo y reducir el desabastecimiento de medicamentos",
      "Protección Social: Creación de un Sistema Nacional de Cuidados con enfoque de género y la construcción de un sistema previsional integrado y sostenible",
      "Educación de Calidad: Compromiso con el cierre de brechas de aprendizaje en educación básica y el fortalecimiento de la educación técnica-productiva en zonas rurales y amazónicas",
      "Vivienda y Saneamiento: Reducción del déficit habitacional mediante programas de autoconstrucción asistida y garantía de acceso a agua potable segura para toda la población",
      "Economía y Medio Ambiente: Impulso a la economía digital y creativa, junto con una transición energética que reduzca la dependencia de combustibles fósiles",
    ],
  },
  "napoleon-becerra-garcia": {
    key: "napoleon-becerra-garcia",
    name: "Napoleón Becerra García",
    party: "Partido de los Trabajadores y Emprendedores PTE - Perú",
    birthDate: "1964-04-11",
    img: "/candidatos/napoleon-becerra-garcia.webp",
    imgHover: "/partidos/partido-de-los-trabajadores-y-emprendedores.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/napoleon-becerra-garcia.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/napoleon-becerra-garcia.pdf",
    biografia: "Napoleón Becerra García nació el 11 de abril de 1964 en la provincia y departamento de Cajamarca. Actualmente reside en el distrito de San Juan de Lurigancho, en Lima. Se presenta como el líder y presidente del Partido de los Trabajadores y Emprendedores (PTE-PERÚ), organización con la que postula a la Presidencia de la República para el periodo 2026-2031. Su perfil se define como el de un ciudadano proveniente del \"mundo del trabajo y el esfuerzo\", con un enfoque orientado al emprendedurismo y la reivindicación de sectores postergados. Su trayectoria se ha centrado principalmente en el sector educativo y la gestión administrativa.",
    historialAcademico: [
      "Bachiller y Título Profesional en Educación: Con especialidad en Lengua y Literatura, otorgado por la Universidad Nacional Federico Villarreal en el año 1993",
      "Posgrado: Maestría en Educación, con mención en Gestión Educativa, realizados en la Universidad Nacional Federico Villarreal",
    ],
    controversias: [
      "En relación a controversias, la documentación revisada (Declaración Jurada de Hoja de Vida) no registra sentencias condenatorias firmes por delitos dolosos ni deudas alimentarias o contractuales al momento de su inscripción",
      "El candidato utiliza un discurso crítico contra lo que denomina \"corrupción estructural\" y \"el Estado como botín\" de gobiernos anteriores",
    ],
    ideologiaPolitica: "La postura del PTE-PERÚ se define como una alternativa al modelo neoliberal actual, al cual califican de estar en crisis. Su ideario abraza el desarrollo de un \"pensamiento autóctono social andino amazónico costeño\", inspirado en la visión de José Carlos Mariátegui y José María Arguedas. Buscan la \"refundación de la República\" mediante un Estado democrático, social, plurinacional y descentralizado que recupere un rol dirigente en la economía para salir de la dependencia de los recursos naturales. Sus principios fundamentales son la justicia social, la soberanía, la equidad y la solidaridad. El plan de gobierno 2026-2031 prioriza acciones en seguridad ciudadana, lucha contra la corrupción, reforma constitucional, economía y emprendimiento, salud y educación, vivienda e infraestructura, y medio ambiente.",
    financiamiento: {
      total: "No se especifica monto exacto en la información proporcionada",
      sources: [
        "En cuanto al financiamiento de su campaña y partido, los documentos presentados indican que se rigen por las normas de transparencia y rendición de cuentas establecidas por la Ley de Organizaciones Políticas",
        "El partido propone mecanismos de control ciudadano y publicación semestral de sus avances financieros y de gestión a través de plataformas digitales oficiales",
      ],
    },
    experiencia: [
      "Docencia: Ha laborado como docente de aula en instituciones educativas públicas de Lima Metropolitana por más de dos décadas",
      "Fundador y Presidente del PTE-PERÚ: Desde donde ha dirigido la formulación de los lineamientos programáticos del partido y su proceso de inscripción ante los organismos electorales",
      "Gestión Administrativa: Su trayectoria se ha centrado principalmente en el sector educativo y la gestión administrativa",
      "Candidato Presidencial 2026: Postula a la Presidencia de la República para el periodo 2026-2031 por el Partido de los Trabajadores y Emprendedores (PTE-PERÚ)",
    ],
    logros: [
      "Obtención del grado de bachiller y título profesional en educación, con especialidad en Lengua y Literatura, otorgado por la Universidad Nacional Federico Villarreal (1993)",
      "Obtención de maestría en Educación, con mención en Gestión Educativa, en la Universidad Nacional Federico Villarreal",
      "Desempeño como docente de aula en instituciones educativas públicas de Lima Metropolitana por más de dos décadas",
      "Fundación del Partido de los Trabajadores y Emprendedores (PTE-PERÚ)",
      "Presidencia del Partido de los Trabajadores y Emprendedores (PTE-PERÚ)",
      "Consolidación del Partido de los Trabajadores y Emprendedores como una organización de \"interés público\" que busca dar voz a trabajadores y comunidades indígenas",
      "Dirección de la formulación de los lineamientos programáticos del partido y su proceso de inscripción ante los organismos electorales",
      "Candidato presidencial del Partido de los Trabajadores y Emprendedores (PTE-PERÚ) para las Elecciones Generales 2026",
    ],
    propuestas: [
      "Seguridad Ciudadana: Reducción del 40% del índice de criminalidad mediante el fortalecimiento de la justicia comunitaria y la seguridad preventiva",
      "Lucha contra la Corrupción: Propuesta de cadena perpetua para delitos graves de corrupción cometidos por funcionarios públicos y la inhabilitación perpetua de los mismos",
      "Reforma Constitucional: Convocatoria a un nuevo pacto social nacional para redactar una nueva Constitución que reemplace la de 1993",
      "Economía y Emprendimiento: Impulso a la creación de 500,000 nuevas micro y pequeñas empresas (MYPES) y la creación de un banco específico para pequeños productores del campo y la ciudad",
      "Salud y Educación: Garantizar un presupuesto no menor al 6% del PBI para ambos sectores. Implementación de una red nacional de atención médica primaria preventiva con cobertura total en zonas rurales",
      "Vivienda e Infraestructura: Ejecución de un programa de vivienda digna con la meta de beneficiar a un millón de hogares",
      "Medio Ambiente: Creación de un \"impuesto ecológico\" destinado a la recaudación de 500 millones de soles anuales para la protección ambiental",
    ],
  },
  "mesias-antonio-guevara-amasifuen": {
    key: "mesias-antonio-guevara-amasifuen",
    name: "Mesías Antonio Guevara Amasifuen",
    party: "Partido Morado",
    birthDate: "1963-06-13",
    img: "/candidatos/mesias-antonio-guevara-amasifuen.webp",
    imgHover: "/partidos/partido-morado.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/mesias-antonio-guevara-amasifuen.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/mesias-antonio-guevara-amasifuen.pdf",
    biografia: "Mesías Antonio Guevara Amasifuen nació el 13 de junio de 1963 en el distrito de Eten, provincia de Chiclayo, Lambayeque. Su formación técnica se inició en la ESEP Militar Elías Aguirre de Chiclayo, donde estudió Mecánica de Producción. Posteriormente, se trasladó al ámbito universitario, graduándose como Bachiller en Ingeniería Electrónica en 1988 y titulándose como Ingeniero Electrónico en 1990 por la Universidad Ricardo Palma. Complementó su formación con estudios de posgrado, obteniendo el grado de Maestro en Administración de Empresas por la Universidad Peruana de Ciencias Aplicadas (UPC) en el año 2001.",
    historialAcademico: [
      "Formación técnica: Estudió Mecánica de Producción en la ESEP Militar Elías Aguirre de Chiclayo",
      "Pregrado: Se graduó como Bachiller en Ingeniería Electrónica en 1988 y se tituló como Ingeniero Electrónico en 1990 por la Universidad Ricardo Palma",
      "Posgrado: Obtuvo el grado de Maestro en Administración de Empresas por la Universidad Peruana de Ciencias Aplicadas (UPC) en el año 2001",
    ],
    controversias: [
      "En el marco de la transparencia electoral, el candidato ha declarado formalmente que no cuenta con sentencias condenatorias firmes por delitos dolosos ni con fallos relativos al incumplimiento de obligaciones alimentarias, contractuales o de violencia familiar",
    ],
    ideologiaPolitica: "Aunque los documentos no definen una etiqueta ideológica cerrada, su postulación por el Partido Morado sugiere una línea de centro-republicano, enfocada en la institucionalidad, la meritocracia y la modernización del Estado mediante la tecnología.",
    financiamiento: {
      total: "S/ 154,941.00",
      sources: [
        "En su declaración jurada de 2024, Guevara reportó ingresos totales por S/ 154,941.00. Estos provienen principalmente de su ejercicio individual en el sector privado (S/ 118,941.00) y dietas u otros conceptos (S/ 36,000.00)",
        "Declaró poseer cuatro inmuebles con un valor total aproximado de S/ 1,530,560.00, ubicados en Cajamarca y Lima",
        "Asimismo, posee dos vehículos valorados en S/ 25,000.00, uno de los cuales figura con una denuncia por robo",
      ],
    },
    experiencia: [
      "Congresista de la República: Se desempeñó como Congresista de la República entre 2011 y 2016, representando a la Alianza Perú Posible",
      "Gobernador Regional de Cajamarca: Fue elegido Gobernador Regional de Cajamarca para el periodo 2019-2022 por el partido Acción Popular",
      "En el ámbito partidario, fue una figura central en Acción Popular, donde ocupó los cargos de Representante Legal (2011-2013) y Presidente del partido (2014-2018), antes de su renuncia definitiva a dicha organización en el año 2023",
      "Ha integrado el Consejo Directivo del Centro Nacional de Planeamiento Estratégico (CEPLAN) desde 2019 hasta la actualidad",
      "Recientemente, ha prestado servicios profesionales como consultor independiente y locador para el Gobierno Regional de Áncash",
    ],
    logros: [
      "Congresista de la República: Se desempeñó como Congresista de la República entre 2011 y 2016, representando a la Alianza Perú Posible",
      "Gobernador Regional de Cajamarca: Fue elegido Gobernador Regional de Cajamarca para el periodo 2019-2022 por el partido Acción Popular",
      "En el ámbito partidario, fue una figura central en Acción Popular, donde ocupó los cargos de Representante Legal (2011-2013) y Presidente del partido (2014-2018), antes de su renuncia definitiva a dicha organización en el año 2023",
      "Ha integrado el Consejo Directivo del Centro Nacional de Planeamiento Estratégico (CEPLAN) desde 2019 hasta la actualidad",
    ],
    propuestas: [
      "Seguridad Ciudadana: Propone la implementación del Sistema Integrado de Justicia y Seguridad (SIJUSEC) para garantizar la trazabilidad digital de los casos desde la denuncia hasta la sentencia, con la meta de reducir la percepción de inseguridad al 60%",
      "Salud Universal: Plantea la creación de la Historia Clínica Electrónica Nacional Unificada (HCENU) para integrar los sistemas de MINSA, EsSalud y Sanidades, además de garantizar atención primaria gratuita en menos de 30 minutos",
      "Educación y Tecnología: Se compromete a equipar con laboratorios STEM+H al 90% de las escuelas secundarias y universalizar la educación inicial",
      "Economía y Formalización: Busca reducir la informalidad laboral al 50% mediante un sistema de formalización digital con incentivos tributarios y promover la construcción masiva de vivienda social",
      "Transparencia Radical: El plan incluye un sistema de rendición de cuentas basado en un tablero digital público de indicadores, auditorías concurrentes de la Contraloría y una red de 5,000 veedores ciudadanos con facultad de inspección",
      "Justicia y Corrupción: Promete derogar 25 leyes consideradas \"pro-crimen\" y fortalecer la planificación estratégica a largo plazo a través de CEPLAN",
    ],
  },
  "paul-davis-jaimes-blanco": {
    key: "paul-davis-jaimes-blanco",
    name: "Paul Davis Jaimes Blanco",
    party: "Progresemos",
    birthDate: "1979-02-02",
    img: "/candidatos/paul-davis-jaimes-blanco.webp",
    imgHover: "/partidos/partido-progresemos.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/paul-davis-jaimes-blanco.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/paul-davis-jaimes-blanco.pdf",
    biografia: "Paul Davis Jaimes Blanco nació el 2 de febrero de 1979 en el distrito de Jesús María, Lima. Actualmente reside en el distrito del Rímac. Es el fundador y actual presidente del partido político Progresemos, organización con la cual postula a la presidencia de la República para el periodo 2026-2031.",
    historialAcademico: [
      "Bachillerato y Licenciatura: Se graduó como Bachiller en Derecho y Ciencia Política en el año 2004 y obtuvo el título profesional de Abogado en 2009, ambos por la Universidad de San Martín de Porres",
      "Posgrado: Cursó una maestría en Gobierno y Gestión Pública en el Instituto de Gobierno de la misma casa de estudios, concluyendo los estudios correspondientes",
    ],
    controversias: [
      "A nivel judicial, el candidato declaró en su hoja de vida no tener sentencias condenatorias firmes por delitos dolosos, ni fallos por incumplimiento de obligaciones alimentarias, contractuales o de violencia familiar",
      "Políticamente, su postura más controversial es la propuesta de retirar al Perú de la jurisdicción de la Corte Interamericana de Derechos Humanos (Corte IDH), argumentando que ello permitiría mayor autonomía para sancionar delitos graves",
      "También registra renuncias previas a los partidos Avanza País (2023) y al Partido Aprista Peruano (2010)",
    ],
    ideologiaPolitica: "El partido Progresemos define su identidad como humanista, animalista y ambientalista. Su ideario se sustenta en el respeto a la dignidad humana, la defensa de los derechos de los animales y la protección del ecosistema. Se autodefine como una organización de centro que busca la inclusión de las \"clases olvidadas\" y promueve la meritocracia en la administración pública.",
    financiamiento: {
      total: "S/ 168,161.99",
      sources: [
        "En su declaración jurada de ingresos y bienes, Jaimes Blanco registró bienes muebles por un valor total de S/ 168,161.99, incluyendo vehículos y acciones en diversas empresas como Full Logística del Perú SAC y Bioandina Perú SAC",
        "Respecto al financiamiento partidario, el plan de gobierno menciona la meta de reducir un 20% el gasto en asesorías externas del Estado para redirigir recursos a la inversión social",
      ],
    },
    experiencia: [
      "Sector Legislativo: Se desempeñó como asesor principal en el Congreso de la República entre los años 2022 y 2025, específicamente en el despacho del parlamentario Óscar Zea",
      "Sector Ejecutivo: Fue designado como Secretario General del Ministerio de Desarrollo Agrario y Riego (MIDAGRI) durante el año 2022",
      "Sector Privado: Ha ejercido como consultor legal para firmas como M&A Consultora E.I.R.L.",
    ],
    logros: [
      "Dentro de su trayectoria institucional, destaca su rol en la fundación y consolidación del partido Progresemos en 2024, logrando su inscripción ante el Registro de Organizaciones Políticas (ROP) para participar en las elecciones generales de 2026",
      "Su paso por la Secretaría General del MIDAGRI representó su cargo de mayor jerarquía administrativa en el Poder Ejecutivo",
    ],
    propuestas: [
      "Seguridad y Justicia: Ejecutar la salida formal del Perú de la Corte IDH y aumentar en un 50% la desarticulación de bandas criminales",
      "Educación: Implementar una reforma para que los estudiantes de secundaria egresen con una carrera técnica con título a nombre de la nación",
      "Salud: Construir más de 300 establecimientos de salud en zonas rurales y asegurar el 95% de abastecimiento de medicamentos esenciales",
      "Anticorrupción: Uso de Inteligencia Artificial para detectar casos de corrupción en tiempo real y asegurar que el 90% de los cargos públicos sean por concurso de méritos",
      "Economía: Mantener el crecimiento del PBI por encima del 3% anual y establecer una \"regla de inversión social protegida\" para salud y educación",
    ],
  },
  "pitter-enrique-valderrama-pena": {
    key: "pitter-enrique-valderrama-pena",
    name: "Pitter Enrique Valderrama Peña",
    party: "Partido Aprista Peruano",
    birthDate: "1986-04-14",
    img: "/candidatos/pitter-enrique-valderrama-pena.webp",
    imgHover: "/partidos/partido-aprista-peruano.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/pitter-enrique-valderrama-pena.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/pitter-enrique-valderrama-pena.pdf",
    biografia: "Pitter Enrique Valderrama Peña nació el 14 de abril de 1986 en la ciudad de Lima. Actualmente cuenta con 39 años y reside en el distrito de Lima. Es un profesional del derecho cuya trayectoria se ha desarrollado principalmente en el ámbito corporativo y legal de la capital peruana. El candidato está adscrito al Partido Aprista Peruano, organización en la que ocupa el cargo de Miembro de la Comisión Política y de la cual es socio fundador en su etapa de reinscripción actual.",
    historialAcademico: [
      "Bachiller en Derecho (2022): Su formación profesional se concentra en la Universidad de San Martín de Porres, donde obtuvo el grado de Bachiller en Derecho en el año 2022",
      "Maestría en Derecho de los Mercados Financieros: Complementó sus estudios con una Maestría en Derecho de los Mercados Financieros en la Universidad de la Rioja. Según su declaración, los estudios están concluidos, aunque el grado académico no figura como obtenido a la fecha del registro",
    ],
    controversias: [
      "En el ámbito jurisdiccional, el candidato ha declarado formalmente ante el Jurado Nacional de Elecciones no poseer antecedentes penales ni sentencias condenatorias firmes por delitos dolosos. Asimismo, no registra fallos judiciales por incumplimiento de obligaciones alimentarias, contractuales, laborales o por incurrir en violencia familiar",
    ],
    ideologiaPolitica: "El candidato está adscrito al Partido Aprista Peruano, organización en la que ocupa el cargo de Miembro de la Comisión Política y de la cual es socio fundador en su etapa de reinscripción actual. Su postura se alinea con la doctrina histórica de su partido, promoviendo una economía social de mercado con un fuerte énfasis en la formalización y el fortalecimiento de la institucionalidad del Estado. El plan de gobierno que respalda su candidatura presenta metas específicas para el periodo 2026-2031 en seguridad y justicia, salud, economía, reforma del Estado, educación, y conectividad y ambiente.",
    financiamiento: {
      total: "S/ 33,600 (ingresos anuales 2024)",
      sources: [
        "Ingresos anuales (2024): Para el año fiscal 2024, Valderrama reportó ingresos totales por 33,600 soles, provenientes exclusivamente del ejercicio individual de su profesión en el sector privado. No registra ingresos por planillas ni rentas de fuente pública",
        "Acciones: En cuanto a activos, declara poseer 600 acciones en la empresa PS Innova SAC, con un valor nominal de 600 soles",
        "Propiedades: No reporta propiedades inmuebles ni vehículos a su nombre en la declaración oficial",
      ],
    },
    experiencia: [
      "Analista Legal: En la firma Global Security Law S.A.C. desde el año 2023",
      "Subgerente: En la empresa PS Innova SAC durante el periodo 2018-2025",
      "Subgerente: En Contratistas Generales Saalino S.A.C. entre los años 2015 y 2019",
      "Miembro de la Comisión Política del Partido Aprista Peruano: Ascendió a la Comisión Política del Partido Aprista Peruano en 2025, siendo una de las figuras clave en el proceso de mantenimiento de la vigencia partidaria tras su reinscripción",
      "Socio Fundador: Es socio fundador del Partido Aprista Peruano en su etapa de reinscripción actual",
      "Candidato Presidencial 2026: Postula a la presidencia de la República por el Partido Aprista Peruano para las Elecciones Generales 2026",
    ],
    logros: [
      "Obtención del grado de Bachiller en Derecho en la Universidad de San Martín de Porres (2022)",
      "Estudios de Maestría en Derecho de los Mercados Financieros en la Universidad de la Rioja (concluidos, aunque el grado académico no figura como obtenido a la fecha del registro)",
      "Ascenso a la Comisión Política del Partido Aprista Peruano en 2025, siendo una de las figuras clave en el proceso de mantenimiento de la vigencia partidaria tras su reinscripción",
      "Socio fundador del Partido Aprista Peruano en su etapa de reinscripción actual",
      "Estabilidad en cargos de subgerencia por periodos prolongados, sugiriendo una gestión administrativa sostenida en empresas de servicios y construcción",
      "Desempeño como Analista Legal en Global Security Law S.A.C. desde 2023",
      "Candidato presidencial del Partido Aprista Peruano para las Elecciones Generales 2026",
    ],
    propuestas: [
      "Seguridad y Justicia: Reducción del 40% en los tiempos de investigación preliminar para delitos complejos y una disminución del 20% en los índices de violencia sexual",
      "Salud: Disminuir en un 90% las colas y tiempos de espera para citas en el segundo y tercer nivel de atención médica",
      "Economía: Alcanzar un crecimiento del PBI del 5.5% anual hacia el final del quinquenio y elevar la formalidad laboral al 50% de la fuerza de trabajo",
      "Reforma del Estado: Ejecutar una reorganización territorial del país entre 2028 y 2031, previo referéndum ciudadano, para modernizar la estructura administrativa nacional",
      "Educación: Mejorar en un 30% los resultados en pruebas de comprensión lectora y desempeño académico para el año 2031",
      "Conectividad y Ambiente: Lograr una cobertura de internet superior al 95% del territorio nacional y establecer 1 millón de hectáreas de plantaciones forestales comerciales",
    ],
  },
  "yonhy-lescano-ancieta": {
    key: "yonhy-lescano-ancieta",
    name: "Yonhy Lescano Ancieta",
    party: "Partido Político Cooperación Popular",
    birthDate: "1959-02-15",
    img: "/candidatos/yonhy-lescano-ancieta.webp",
    imgHover: "/partidos/cooperacion-popular.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/yonhy-lescano-ancieta.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/yonhy-lescano-ancieta.pdf",
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
    planGobiernoUrl: "/pdfs/planes-gobierno/vladimir-roy-cerron-rojas.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/vladimir-roy-cerron-rojas.pdf",
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
    planGobiernoUrl: "/pdfs/planes-gobierno/walter-gilmer-chirinos-purizaga.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/walter-gilmer-chirinos-purizaga.pdf",
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
  "wolfgang-mario-grozo-costa": {
    key: "wolfgang-mario-grozo-costa",
    name: "Wolfgang Mario Grozo Costa",
    party: "Partido Político Integridad Democrática",
    birthDate: "1967-09-21",
    img: "/candidatos/wolfgang-mario-grozo-costa.webp",
    imgHover: "/partidos/integridad-democratica.webp",
    planGobiernoUrl: "/pdfs/planes-gobierno/wolfgang-mario-grozo-costa.pdf",
    hojaVidaUrl: "/pdfs/hojas-vida/wolfgang-mario-grozo-costa.pdf",
    biografia: "Wolfgang Mario Grozo Costa nació el 21 de septiembre de 1967 en el distrito de Jesús María, Lima. Actualmente reside en el distrito de San Borja. Se presenta como fundador y representante legal del Partido Político Integridad Democrática, organización con la que postula a la presidencia de la República y al Senado en el proceso electoral de 2026. Es un ciudadano peruano con una trayectoria marcada por la formación en el sector aeroespacial y de defensa nacional.",
    historialAcademico: [
      "Grados Universitarios: Es Bachiller (2010) y Licenciado (2012) en Ciencias de la Administración Aeroespacial por la Escuela de Oficiales de la Fuerza Aérea del Perú",
      "Posgrado: Posee el grado de Maestro en Desarrollo y Defensa Nacional (2018) y es Doctor en Desarrollo y Seguridad Estratégica (2020), ambos obtenidos en el Centro de Altos Estudios Nacionales (CAEN)",
      "Estudios adicionales: Cuenta con una especialización en el Curso de Altos Estudios Estratégicos por el CESEDEN en España (2017) y un Programa de Alta Dirección por la Universidad de Piura (2015)",
    ],
    controversias: [
      "En el registro oficial de su hoja de vida, el candidato declara no tener sentencias condenatorias firmes por delitos dolosos. Asimismo, manifiesta no tener sentencias fundadas por incumplimiento de obligaciones familiares, alimentarias, contractuales, laborales o por violencia familiar",
      "En el apartado de información adicional, registra propiedades en sociedad conyugal y terrenos con valores que ascienden a los 280,000 soles en Surco y 40,000 soles en Trujillo",
    ],
    ideologiaPolitica: "Aunque el documento no etiqueta la ideología en una sola palabra, el plan de gobierno del Partido Político Integridad Democrática se centra en el \"restablecimiento del principio de autoridad\" y la \"conducción firme del Estado\". Su enfoque prioriza la seguridad nacional, la lucha frontal contra el crimen organizado y la minería ilegal, así como una política económica basada en la estabilidad monetaria, la autonomía del BCRP y el fomento de la inversión privada como motor del crecimiento. El plan de gobierno se estructura en metas cuantificables hacia el 2031 en seguridad ciudadana, sistema penitenciario, lucha contra la corrupción, control migratorio, salud y educación, y economía.",
    financiamiento: {
      total: "S/ 277,827,000 (ingresos brutos anuales 2024)",
      sources: [
        "Ingresos brutos anuales (2024): El candidato declaró ingresos brutos anuales correspondientes al año fiscal 2024 por un total de 277,827,000 soles",
        "Remuneración bruta anual sector público: 122,220,000 soles",
        "Remuneración bruta anual sector privado: 155,607,000 soles",
        "Bienes inmuebles: Además, registra bienes inmuebles (predios, garajes y viviendas) con valores autovalúos diversos",
        "Vehículo: Un vehículo marca Jeep modelo Grand Cherokee Laredo valorizado en 67,400 soles",
      ],
    },
    experiencia: [
      "Profesor en Gerencia: Su experiencia laboral más reciente en el ámbito civil se registra como profesor en gerencia en la Universidad de Lima, cargo que desempeña desde el año 2022 hasta la actualidad",
      "Trayectoria Militar y Aeroespacial: Su trayectoria previa está ligada a su formación militar y aeroespacial, lo que se refleja en sus grados académicos y especializaciones en defensa",
      "Fundador y Representante Legal: Se presenta como fundador y representante legal del Partido Político Integridad Democrática",
      "Candidato Presidencial y al Senado 2026: Postula a la presidencia de la República y al Senado en el proceso electoral de 2026",
    ],
    logros: [
      "Fundación del Partido Político Integridad Democrática en el año 2023",
      "Obtención de un doctorado en Seguridad Estratégica, posicionándolo como un especialista en temas de inteligencia y gestión de crisis estatales",
      "Rol como representante legal de su organización política, logrando la inscripción de listas para cargos de alta relevancia nacional",
      "Obtención de grados académicos: Bachiller (2010) y Licenciado (2012) en Ciencias de la Administración Aeroespacial por la Escuela de Oficiales de la Fuerza Aérea del Perú",
      "Obtención de Maestro en Desarrollo y Defensa Nacional (2018) y Doctor en Desarrollo y Seguridad Estratégica (2020) en el Centro de Altos Estudios Nacionales (CAEN)",
      "Especialización en el Curso de Altos Estudios Estratégicos por el CESEDEN en España (2017)",
      "Programa de Alta Dirección por la Universidad de Piura (2015)",
      "Desempeño como profesor en gerencia en la Universidad de Lima desde el año 2022",
      "Candidato presidencial y al Senado del Partido Político Integridad Democrática para las Elecciones Generales 2026",
    ],
    propuestas: [
      "Seguridad Ciudadana: Reducir la victimización del 25% al 9% para el año 2031. Propone la creación de un Comando Unificado (CUI) que integre la inteligencia de las Fuerzas Armadas y la Policía Nacional",
      "Sistema Penitenciario: Construcción de megapenales de máxima seguridad (como Challapalca II) para aislar totalmente a los líderes del crimen organizado y reducir el hacinamiento",
      "Lucha contra la Corrupción: Implementar la \"muerte civil\" (inhabilitación perpetua) para funcionarios corruptos y crear la Unidad Nacional de Recuperación de Activos para confiscar bienes ilícitos",
      "Control Migratorio: Expulsión inmediata de extranjeros con antecedentes penales y lograr el 100% de control biométrico en fronteras para eliminar la irregularidad migratoria",
      "Salud y Educación: Alcanzar la cobertura universal de salud mediante un modelo centrado en el primer nivel de atención y reducir la deserción escolar en zonas rurales al 5%, implementando secundaria técnica certificada",
      "Economía: Destrabar una cartera de proyectos de inversión privada por 50,000 millones de dólares y mantener la inflación en un rango del 1% al 2% anual",
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

