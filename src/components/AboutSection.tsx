"use client";
import { useRouter } from "next/navigation";

const AboutSection = () => {

  const router = useRouter();
  return (
    <section id="conocenos" className="bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 text-center lg:px-6">
        {/* Título más grande */}
        <h2 className="text-[32px] font-extrabold leading-[110%] tracking-[-0.02em] text-[#0b1b3b] sm:text-[40px] lg:text-[45px]">
          Sobre nosotros
        </h2>

        {/* Texto más grande */}
        <p className="mt-5 text-[16px] font-medium leading-[165%] tracking-[-0.005em] text-slate-700 sm:text-[18px] lg:text-[20px]">
          Somos un grupo de estudiantes con la misión de proporcionar
          información clara e imparcial para ayudarte a entender a los
          candidatos y sus propuestas. La democracia prospera con la
          participación informada.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          {/* Botón azul (mismo tamaño de letra) */}
          <button  type="button" onClick={() => router.push("/conocenos")} className="rounded-full bg-[#0b1b3b] px-6 py-2.5 text-sm font-semibold text-white shadow transition-transform duration-150 hover:scale-105 active:border active:border-[#0b1b3b] active:bg-white active:text-[#0b1b3b]">
            Saber más sobre nosotros
          </button>

          {/* Botón blanco (mismo tamaño de letra) */}
          <button type="button" onClick={() => router.push("/contactanos")} className="rounded-full border border-[#0b1b3b] px-6 py-2.5 text-sm font-semibold text-[#0b1b3b] transition-transform duration-150 hover:scale-105 active:bg-[#0b1b3b] active:text-white">
            Contáctanos
          </button>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
