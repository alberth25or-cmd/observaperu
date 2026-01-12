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
  // 10 personas distintas (reemplaza con los datos reales)
  const team = [
    {
      name: "Nombre1",
      last: "Apellido1",
      linkedin: "https://linkedin.com/in/usuario1",
      key: "team-1",
    },
    {
      name: "Nombre2",
      last: "Apellido2",
      linkedin: "https://linkedin.com/in/usuario2",
      key: "team-2",
    },
    {
      name: "Nombre3",
      last: "Apellido3",
      linkedin: "https://linkedin.com/in/usuario3",
      key: "team-3",
    },
    {
      name: "Nombre4",
      last: "Apellido4",
      linkedin: "https://linkedin.com/in/usuario4",
      key: "team-4",
    },
    {
      name: "Nombre5",
      last: "Apellido5",
      linkedin: "https://linkedin.com/in/usuario5",
      key: "team-5",
    },
    {
      name: "Nombre6",
      last: "Apellido6",
      linkedin: "https://linkedin.com/in/usuario6",
      key: "team-6",
    },
    {
      name: "Nombre7",
      last: "Apellido7",
      linkedin: "https://linkedin.com/in/usuario7",
      key: "team-7",
    },
    {
      name: "Nombre8",
      last: "Apellido8",
      linkedin: "https://linkedin.com/in/usuario8",
      key: "team-8",
    },
    {
      name: "Nombre9",
      last: "Apellido9",
      linkedin: "https://linkedin.com/in/usuario9",
      key: "team-9",
    },
    {
      name: "Nombre10",
      last: "Apellido10",
      linkedin: "https://linkedin.com/in/usuario10",
      key: "team-10",
    },
  ];

  const services = [
    {
      title: "Reportes estadísticos",
      text: "Análisis de datos utilizando metodologías distintas para identificar tendencias, patrones y relaciones relevantes. Nuestros reportes están diseñados para comunicar resultados de forma clara, comprensible y fundamentada.",
    },
    {
      title: "Desarrollo de páginas web",
      text: "Diseñamos y desarrollamos páginas web informativas y funcionales, enfocadas en la organización eficiente de contenidos y una experiencia de usuario intuitiva.",
    },
    {
      title: "Dashboards estadísticos",
      text: "Creamos dashboards interactivos que permiten explorar datos de forma dinámica, monitorear indicadores y realizar análisis en tiempo real.",
    },
    {
      title: "Visualización de datos",
      text: "Convertimos datos en gráficos, mapas y recursos visuales que facilitan la comprensión de información compleja y mejoran su comunicación.",
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
                {/* Placeholder de foto */}
                <div className="mx-auto aspect-[3/4] w-full max-w-[170px] overflow-hidden rounded-md bg-slate-200 shadow-sm" />

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

                {/* Placeholder de imagen */}
                <div className="mt-6 h-[130px] w-full rounded-xl bg-white/70" />
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
