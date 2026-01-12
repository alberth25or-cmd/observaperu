const Hero = () => {
  return (
    <section id="inicio" className="relative isolate w-full text-white">
      {/* Fondo (imagen) */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg1.jpg')" }}
      />

      {/* Overlay azul más transparente (para que se vea la imagen) */}
      <div className="absolute inset-0 bg-[#1f2f59]/75" />

      {/* Contenedor (Figma: padding 120px 64px 0, gap 120px, height 750, width 1280) */}
      <div className="relative mx-auto flex min-h-[750px] w-full max-w-[1280px] flex-col items-center gap-[120px] px-4 pt-[120px] lg:px-16">
        {/* Bloque texto */}
        <div className="flex w-full flex-col items-center gap-12 text-center">
          <h1 className="max-w-[740px] text-[40px] font-bold leading-[110%] tracking-[-0.02em] sm:text-[52px] lg:text-[64px]">
            Descubre quienes son los candidatos y qué ideas representan
          </h1>

          <div className="flex w-full max-w-[502px] flex-wrap justify-center gap-4">
            <a
              href="#candidatos"
              className="inline-flex h-[50px] w-[225px] items-center justify-center rounded-[12px] bg-white px-4 py-3 text-[18px] font-medium leading-[145%] tracking-[-0.005em] text-black transition-transform duration-150 hover:scale-[1.03] active:bg-[#6fb6ff]"
            >
              Conoce a tu candidato
            </a>

            <a
              href="#mapa-ideologico"
              className="inline-flex h-[50px] w-[261px] items-center justify-center rounded-[12px] border-2 border-white/20 px-4 py-3 text-[18px] font-medium leading-[145%] tracking-[-0.005em] text-white transition-transform duration-150 hover:scale-[1.03] active:border-[#6fb6ff] active:bg-[#6fb6ff] active:text-[#0b1b3b]"
            >
              Explora el mapa ideológico
            </a>
          </div>
        </div>

        {/* Tarjeta flotante (ENCIMA del final del Hero, como Figma) */}
        <div className="pointer-events-none absolute left-1/2 bottom-0 w-full max-w-4xl -translate-x-1/2 translate-y-1/2 px-4 lg:px-0">
          <div className="pointer-events-auto rounded-2xl bg-white p-6 text-center shadow-lg sm:p-8">
            <h2 className="text-[32px] font-black leading-[110%] tracking-[-0.03em] text-[#0F1E4A] sm:text-[40px] lg:text-[45px]">
              ¿Qué es Observa Perú?
            </h2>

            <p className="mx-auto mt-4 max-w-[872px] text-[16px] font-medium leading-[145%] tracking-[-0.005em] text-black sm:text-[18px]">
              Observa Perú es una plataforma web informativa que reúne información
              sobre perfiles políticos, propuestas, antecedentes y etapas del
              proceso electoral, basada en fuentes oficiales y datos contrastados,
              para tomar decisiones informadas, sin promover ni favorecer a ninguna
              candidatura política.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
