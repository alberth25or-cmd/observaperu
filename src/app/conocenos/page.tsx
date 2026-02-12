// app/conocenos/page.tsx
import Link from "next/link";
import Image from "next/image";

const Banner = ({
  title,
  bg = "/hero-bg1.jpg",
}: {
  title: string;
  bg?: string;
}) => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Fondo */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${bg}')` }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1f2f59]/75" />

      {/* Contenido: CENTRADO */}
      <div className="relative mx-auto flex h-[90px] max-w-6xl items-center justify-center px-4 lg:px-16">
        <h1 className="text-center text-[32px] font-extrabold leading-[110%] tracking-[-0.02em] text-white sm:text-[40px]">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default function ConocenosPage() {
  // Datos reales del equipo
  const team = [
    {
      name: "Luis Alberth",
      last: "Ortiz Huamantalla",
      linkedin: "https://www.linkedin.com/in/luis-alberth-ortiz-huamantalla-b1236b275",
      key: "team-1",
    },
    {
      name: "Loreley Yesel Audrey",
      last: "Rojas Berrios",
      linkedin: "https://www.linkedin.com/in/loreley-yesel-audrey-rojas-berrios-985372274",
      key: "team-2",
    },
    {
      name: "Patrick Paolo",
      last: "Santa Cruz Moncada",
      linkedin: "https://www.linkedin.com/in/patrick-paolo-santa-cruz-moncada-ba3a86396",
      key: "team-3",
    },
    {
      name: "Gabriela Alessandra",
      last: "Azaña Quispe",
      linkedin: "https://www.linkedin.com/in/gabriela-aza%C3%B1a-quispe-32b304379",
      key: "team-4",
    },
    {
      name: "Sofia Abiel",
      last: "Riojas Concha",
      linkedin: "https://www.linkedin.com/in/sofiariojasc",
      key: "team-5",
    },
    {
      name: "Bryan Daniel",
      last: "Reyna Rodríguez",
      linkedin: "https://www.linkedin.com/in/bryan-reyna-252201275",
      key: "team-6",
    },
  ];

  const services = [
    {
      title: "Reportes estadísticos",
      text: "Análisis de datos utilizando metodologías distintas para identificar tendencias, patrones y relaciones relevantes. Nuestros reportes están diseñados para comunicar resultados de forma clara, comprensible y fundamentada.",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="16" fill="url(#grad1)"/>
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1b2b5a" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#4A90E2" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <path d="M50 60 L150 60 L150 80 L50 80 Z" fill="#1b2b5a" fillOpacity="0.3"/>
          <path d="M50 100 L120 100 L120 120 L50 120 Z" fill="#1b2b5a" fillOpacity="0.3"/>
          <path d="M50 140 L140 140 L140 160 L50 160 Z" fill="#1b2b5a" fillOpacity="0.3"/>
          <circle cx="170" cy="50" r="15" fill="#4A90E2" fillOpacity="0.4"/>
          <path d="M170 35 L170 65 M160 50 L180 50" stroke="#1b2b5a" strokeWidth="2" strokeOpacity="0.5"/>
        </svg>
      ),
    },
    {
      title: "Desarrollo de páginas web",
      text: "Diseñamos y desarrollamos páginas web informativas y funcionales, enfocadas en la organización eficiente de contenidos y una experiencia de usuario intuitiva.",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="16" fill="url(#grad2)"/>
          <defs>
            <linearGradient id="grad2" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2E7D8F" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#1b2b5a" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <rect x="40" y="50" width="120" height="100" rx="8" fill="#2E7D8F" fillOpacity="0.2" stroke="#1b2b5a" strokeWidth="2" strokeOpacity="0.3"/>
          <rect x="50" y="60" width="100" height="15" rx="4" fill="#1b2b5a" fillOpacity="0.3"/>
          <rect x="50" y="85" width="60" height="10" rx="4" fill="#2E7D8F" fillOpacity="0.3"/>
          <rect x="50" y="105" width="80" height="10" rx="4" fill="#2E7D8F" fillOpacity="0.3"/>
          <rect x="50" y="125" width="70" height="10" rx="4" fill="#2E7D8F" fillOpacity="0.3"/>
        </svg>
      ),
    },
    {
      title: "Dashboards estadísticos",
      text: "Creamos dashboards interactivos que permiten explorar datos de forma dinámica, monitorear indicadores y realizar análisis en tiempo real.",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="16" fill="url(#grad3)"/>
          <defs>
            <linearGradient id="grad3" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4A90E2" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#2E7D8F" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <rect x="40" y="50" width="50" height="100" rx="4" fill="#4A90E2" fillOpacity="0.4"/>
          <rect x="100" y="80" width="50" height="70" rx="4" fill="#2E7D8F" fillOpacity="0.4"/>
          <rect x="160" y="60" width="30" height="90" rx="4" fill="#1b2b5a" fillOpacity="0.4"/>
          <circle cx="50" cy="40" r="8" fill="#4A90E2" fillOpacity="0.5"/>
          <circle cx="110" cy="40" r="8" fill="#2E7D8F" fillOpacity="0.5"/>
          <circle cx="170" cy="40" r="8" fill="#1b2b5a" fillOpacity="0.5"/>
        </svg>
      ),
    },
    {
      title: "Visualización de datos",
      text: "Convertimos datos en gráficos, mapas y recursos visuales que facilitan la comprensión de información compleja y mejoran su comunicación.",
      icon: (
        <svg className="w-full h-full" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" rx="16" fill="url(#grad4)"/>
          <defs>
            <linearGradient id="grad4" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1b2b5a" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#4A90E2" stopOpacity="0.1"/>
            </linearGradient>
          </defs>
          <path d="M40 140 L70 120 L100 100 L130 80 L160 60" stroke="#1b2b5a" strokeWidth="3" strokeOpacity="0.5" fill="none"/>
          <circle cx="40" cy="140" r="5" fill="#1b2b5a" fillOpacity="0.6"/>
          <circle cx="70" cy="120" r="5" fill="#2E7D8F" fillOpacity="0.6"/>
          <circle cx="100" cy="100" r="5" fill="#4A90E2" fillOpacity="0.6"/>
          <circle cx="130" cy="80" r="5" fill="#2E7D8F" fillOpacity="0.6"/>
          <circle cx="160" cy="60" r="5" fill="#1b2b5a" fillOpacity="0.6"/>
          <path d="M50 50 L50 150 M50 150 L150 150" stroke="#1b2b5a" strokeWidth="2" strokeOpacity="0.3"/>
        </svg>
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-[#eef2fb]">
      {/* Mini-hero: Sobre nosotros */}
      <Banner title="Sobre nosotros" bg="/hero-bg1.jpg" />

      {/* Sección: logo + texto */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 text-center lg:px-16">
          <div className="mx-auto flex justify-center">
            <Image
              src="/LogoObserva.png"
              alt="Observa Perú"
              width={1200}
              height={800}
              priority
              className="h-[110px] w-auto object-contain sm:h-[140px]"
            />
          </div>

          <p className="mx-auto mt-6 max-w-4xl text-pretty text-[16px] leading-[175%] text-slate-700 sm:text-[18px]">
            En un contexto marcado por la sobreinformación, la desinformación y
            la polarización política, Observa Perú nace como una plataforma de
            referencia para la ciudadanía. Nuestro propósito es brindar
            información clara, verificable y accesible sobre los candidatos y
            organizaciones políticas del país, fortaleciendo la toma de
            decisiones informadas.
          </p>

          <p className="mx-auto mt-4 max-w-4xl text-pretty text-[16px] leading-[175%] text-slate-700 sm:text-[18px]">
            Creemos que una democracia sólida se construye con ciudadanos
            informados. Por ello, presentamos perfiles de candidatos,
            trayectorias, posturas políticas, antecedentes y análisis relevantes
            de manera imparcial y basada en fuentes confiables, permitiendo que
            cada votante forme su propio criterio sin influencias partidarias.
          </p>
        </div>
      </section>

      {/* Mini-hero: Nuestro team */}
      <Banner title="Nuestro team" bg="/hero-bg1.jpg" />

      {/* Equipo */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {team.map((p) => (
              <article key={p.key} className="text-center">
                {/* Avatar con iniciales */}
                <div className="mx-auto aspect-[3/4] w-full max-w-[170px] overflow-hidden rounded-md bg-gradient-to-br from-[#1b2b5a] to-[#4A90E2] shadow-sm flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {p.name.charAt(0)}{p.last.charAt(0)}
                  </span>
                </div>

                <div className="mt-3 text-[14px] font-semibold text-[#0b1b3b]">
                  {p.name} {p.last}
                </div>

                <Link
                  href={p.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-[13px] font-medium text-[#1b2b5a] underline underline-offset-2 hover:text-[#0f1d46]"
                >
                  LinkedIn
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Mini-hero: Nuestros servicios */}
      <Banner title="Nuestros servicios" bg="/hero-bg1.jpg" />

      {/* Servicios */}
      <section className="bg-white py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <p className="mx-auto max-w-4xl text-center text-pretty text-[16px] leading-[175%] text-slate-700 sm:text-[18px]">
            Observa Perú nace en el contexto político y electoral, pero nuestras
            capacidades van mucho más allá de ese ámbito. Somos un equipo con
            formación y habilidades en análisis estadístico, desarrollo web y
            visualización de datos, capaces de aplicar estas herramientas a
            distintos sectores que requieran información clara, estructurada y
            basada en datos.
          </p>

          <h2 className="mt-10 text-center text-[22px] font-extrabold leading-[120%] text-[#0b1b3b] sm:text-[28px]">
            ¿Qué podemos hacer?
          </h2>

          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {services.map((s) => (
              <article
                key={s.title}
                className="rounded-2xl bg-[#d9d9d9]/45 p-6 shadow-sm"
              >
                <h3 className="text-[16px] font-extrabold text-[#0b1b3b] sm:text-[18px]">
                  {s.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[170%] text-slate-700 sm:text-[15px]">
                  {s.text}
                </p>

                {/* Icono SVG */}
                <div className="mt-6 h-[130px] w-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
                  {s.icon}
                </div>
              </article>
            ))}
          </div>

          <p className="mx-auto mt-14 max-w-4xl text-center text-[18px] font-extrabold leading-[140%] text-[#0b1b3b] sm:text-[22px]">
            Datos, análisis y tecnología aplicados donde se necesiten.
          </p>
        </div>
      </section>
    </main>
  );
}
