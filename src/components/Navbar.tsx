"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="flex h-[110px] w-full items-center justify-between px-6 lg:px-16">
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

        {/* Menú Desktop */}
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
            <Link href="/comparacion" className="text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]">
              Comparación
            </Link>
            <Link href="/conocenos" className="text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]">
              Conócenos
            </Link>
            <Link href="/contactanos" className="text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]">
              Contáctanos
            </Link>
          </div>
        </nav>

        {/* Botón Menú Hamburguesa (Móvil) */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`h-0.5 w-6 bg-[#1b2b5a] transition-all duration-300 ${
              isMenuOpen ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-[#1b2b5a] transition-all duration-300 ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-6 bg-[#1b2b5a] transition-all duration-300 ${
              isMenuOpen ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Menú Desplegable (Móvil) */}
      {isMenuOpen && (
        <nav className="border-t border-slate-200 bg-white md:hidden">
          <div className="flex flex-col px-6 py-4">
            <Link
              href="/#inicio"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]"
            >
              Inicio
            </Link>
            <Link
              href="/candidatos"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]"
            >
              Candidatos
            </Link>
            <Link
              href="/mapa-ideologico"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]"
            >
              Mapa ideológico
            </Link>
            <Link
              href="/comparacion"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]"
            >
              Comparación
            </Link>
            <Link
              href="/conocenos"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]"
            >
              Conócenos
            </Link>
            <Link
              href="/contactanos"
              onClick={() => setIsMenuOpen(false)}
              className="py-3 text-[16px] font-semibold text-[#1b2b5a] hover:text-[#0f1d46]"
            >
              Contáctanos
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
