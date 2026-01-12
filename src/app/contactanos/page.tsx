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

export default function ContactanosPage() {
  return (
    <main className="min-h-screen bg-[#eef2fb]">
      {/* Mini-hero: Contáctanos */}
      <Banner title="Contáctanos" bg="/hero-bg1.jpg" />

      {/* Bloque formulario */}
      <section className="py-14 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 lg:px-16">
          <h2 className="mx-auto max-w-4xl text-center text-[20px] font-extrabold leading-[140%] text-[#0b1b3b] sm:text-[24px]">
            Valoramos tus comentarios y consultas. Por favor, utiliza el
            formulario a continuación para ponerte en contacto.
          </h2>

          <div className="mx-auto mt-10 max-w-[560px] rounded-2xl bg-[#d9d9d9]/70 p-8 shadow-sm">
            <form className="space-y-5">
              <div>
                <label className="block text-[14px] font-semibold text-[#0b1b3b]">
                  Nombre Completo
                </label>
                <input
                  className="mt-2 w-full rounded-full bg-[#0b1b3b] px-4 py-2.5 text-white placeholder-white/60 outline-none ring-0 focus:ring-2 focus:ring-[#6fb6ff]"
                  placeholder="Tu nombre"
                  name="name"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#0b1b3b]">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  className="mt-2 w-full rounded-full bg-[#0b1b3b] px-4 py-2.5 text-white placeholder-white/60 outline-none ring-0 focus:ring-2 focus:ring-[#6fb6ff]"
                  placeholder="tucorreo@ejemplo.com"
                  name="email"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#0b1b3b]">
                  Asunto
                </label>
                <input
                  className="mt-2 w-full rounded-full bg-[#0b1b3b] px-4 py-2.5 text-white placeholder-white/60 outline-none ring-0 focus:ring-2 focus:ring-[#6fb6ff]"
                  placeholder="Motivo del mensaje"
                  name="subject"
                />
              </div>

              <div>
                <label className="block text-[14px] font-semibold text-[#0b1b3b]">
                  Mensaje
                </label>
                <textarea
                  className="mt-2 w-full resize-none rounded-2xl bg-[#0b1b3b] px-4 py-3 text-white placeholder-white/60 outline-none ring-0 focus:ring-2 focus:ring-[#6fb6ff]"
                  placeholder="Escribe tu mensaje aquí..."
                  rows={6}
                  name="message"
                />
              </div>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  className="inline-flex h-[38px] items-center justify-center rounded-full bg-[#0b1b3b] px-8 text-[12px] font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99]"
                >
                  ENVIAR
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Colaboración */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
          <h2 className="text-[26px] font-extrabold leading-[120%] text-[#0b1b3b] sm:text-[34px]">
            ¿Quieres colaborar con Observa Perú?
          </h2>

         <p className="mx-auto mt-5 max-w-3xl text-pretty text-[16px] leading-[175%] text-slate-700 sm:text-[18px]">
            Somos una iniciativa independiente impulsada por un grupo de estudiantes
            comprometidos con el acceso a información clara y responsable sobre el proceso
            electoral peruano. Si eres estudiante, investigador, comunicador, analista de
            datos o simplemente una persona interesada en aportar con información verificable,
            análisis, visualización de datos o revisión de contenidos, nos encantará leerte.
        </p>

          <a
            href="mailto:contactanos@observaperu.com"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#0b1b3b] px-8 py-3 text-[13px] font-semibold text-white transition-transform duration-150 hover:scale-[1.03] active:scale-[0.99]"
          >
            contactanos@observaperu.com
          </a>
        </div>
      </section>

      {/* Mini-hero: Donativo */}
      <Banner title="Donativo" bg="/hero-bg1.jpg" />

      {/* Donación */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4 text-center lg:px-16">
          <h2 className="text-[44px] font-black leading-[105%] tracking-[-0.03em] text-[#0b1b3b] sm:text-[56px]">
            APOYA A
          </h2>

          {/* LOGO MÁS GRANDE */}
          <div className="mt-3 flex justify-center">
            <Image
              src="/LogoObserva.png"
              alt="Observa Perú"
              width={1200}
              height={800}
              priority
              className="h-[110px] w-auto object-contain sm:h-[130px]"
            />
          </div>

         <ul className="mx-auto mt-6 max-w-3xl list-disc space-y-2 pl-5 text-left text-[16px] font-medium leading-[175%] text-slate-700 sm:text-[18px]">
            <li>Una iniciativa independiente impulsada por estudiantes.</li>
            <li>No recibimos financiamiento de partidos políticos, instituciones públicas ni organizaciones privadas.</li>
            <li>El proyecto se sostiene gracias al tiempo, trabajo y compromiso de quienes creemos en el acceso libre a información electoral clara y verificable.</li>
            <li>Tu apoyo nos permite mantener la plataforma activa, actualizada y accesible para todos.</li>
        </ul>

          <div className="mx-auto mt-10 max-w-[520px] rounded-2xl bg-[#d9d9d9]/70 p-8">
            <h3 className="text-[18px] font-extrabold text-[#0b1b3b]">
              Realiza tu donativo
            </h3>

            {/* Placeholder QR */}
            <div className="mt-6 flex justify-center">
              <div className="relative flex h-[320px] w-[320px] items-center justify-center rounded-xl bg-white/70">
                <span className="text-[12px] font-medium text-slate-500">
                  Coloca tu QR en /public/qr-yape.png
                </span>
              </div>
            </div>

            <div className="mt-6 inline-flex rounded-full bg-[#0b1b3b] px-6 py-2 text-[12px] font-semibold text-white">
              Luis Albert Ortiz Huamantalla
            </div>
          </div>

          <p className="mx-auto mt-10 max-w-4xl text-[18px] font-extrabold leading-[140%] text-[#0b1b3b] sm:text-[22px]">
            ¿No puedes donar? También puedes apoyar compartiendo el proyecto o
            colaborando con contenido verificado.
          </p>
        </div>
      </section>
    </main>
  );
}
