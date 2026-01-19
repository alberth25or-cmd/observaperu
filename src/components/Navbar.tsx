import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="flex h-[110px] w-full items-center px-6 lg:px-16">
        {/* Logo */}
        <Link href="/#inicio" aria-label="Inicio" className="flex h-full items-center">
          <Image
            src="/LogoObserva.png"
            alt="Observa Perú"
            width={1200}
            height={800}
            priority
            className="h-[110px] w-auto object-contain"
          />
        </Link>

        {/* Menú */}
        <nav className="ml-auto hidden items-center md:flex">
          <div className="flex items-center gap-12">
            <Link href="/#inicio" className="text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]">
              Inicio
            </Link>
            <Link href="/candidatos" className="text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]">
              Candidatos
            </Link>
            <Link href="/mapa-ideologico" className="text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]">
              Mapa ideológico
            </Link>
            <Link href="/#comparacion" className="text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]">
              Comparación
            </Link>
            <Link href="/conocenos" className="text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]">
              Conócenos
            </Link>
            {/* Nuevo */}
            <Link href="/contactanos" className="text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]">
              Contáctanos
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
