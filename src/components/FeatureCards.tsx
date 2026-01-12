const FeatureCards = () => {
  const cards = [
    {
      title: "Perfiles de candidatos",
      text: "Información detallada sobre cada candidato: biografía, políticas, trayectoria y más.",
    },
    {
      title: "Compara los perfiles",
      text: "Información organizada que te permite visualizar la información de los candidatos en paralelo.",
    },
    {
      title: "Revisa los Planes de Gobierno",
      text: "Repositorio de los Planes de Gobierno presentados ante las instituciones organizadoras.",
    },
  ];

  const sharedBg = "/congreso.jpg";

  return (
    <section id="candidatos" className="bg-[#eef2fb] pb-16 pt-28">
      {/* 
        Menos padding lateral en pantallas grandes para que las cards
        de los lados no queden tan metidas hacia el centro.
      */}
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
        {/* Más separación con la parte de arriba */}
        <div
          id="comparacion"
          className="
            mt-12
            grid
            gap-6
            lg:gap-10
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {cards.map((card) => (
            <article
              key={card.title}
              className="
                group relative overflow-hidden rounded-2xl text-white
                shadow-md transition-all duration-200
                hover:-translate-y-1 hover:shadow-xl
              "
            >
              {/* Fondo compartido */}
              <div
                className="
                  absolute inset-0 bg-cover bg-center
                  transition-transform duration-300
                  group-hover:scale-[1.06]
                "
                style={{ backgroundImage: `url('${sharedBg}')` }}
              />

              {/* Overlay tipo Hero */}
              <div className="absolute inset-0 bg-[#1f2f59]/65 transition-all duration-200 group-hover:bg-[#1f2f59]/50" />

              {/* Contenido */}
              <div className="relative flex min-h-[260px] flex-col items-center justify-center p-6 text-center">
                <h3 className="text-[20px] font-bold leading-[110%] tracking-[-0.02em]">
                  {card.title}
                </h3>

                <p className="mt-3 text-[16px] font-medium leading-[145%] tracking-[-0.005em] text-white/90">
                  {card.text}
                </p>

                <button
                  className="
                    mt-6 inline-flex h-[50px] items-center justify-center
                    rounded-[12px] bg-white px-6 text-[18px] font-medium
                    leading-[145%] tracking-[-0.005em] text-black shadow
                    transition-transform duration-150
                    hover:scale-[1.03]
                    active:scale-[0.99] active:bg-[#6fb6ff]
                  "
                >
                  Ver más
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureCards;
