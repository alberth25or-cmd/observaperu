"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "@/components/Logo";

const enlaces = [
  { href: "/#servicios", label: "Servicios" },
  { href: "/#como-trabajamos", label: "Cómo trabajamos" },
  { href: "/#metodologia", label: "Metodología" },
  { href: "/elecciones", label: "Nuestro trabajo" },
  { href: "/conocenos", label: "Conócenos" },
];

const Navbar = () => {
  const [abierto, setAbierto] = useState(false);
  const [bajado, setBajado] = useState(false);
  const ruta = usePathname();

  // En la portada la barra flota sobre el hero: un recuadro claro encima
  // del campo de partículas rompería la entrada. En el resto del sitio se
  // comporta como una barra normal.
  const sobreHero = ruta === "/";

  useEffect(() => {
    if (!sobreHero) return;
    // El hero se queda fijado durante todo su recorrido: la barra sigue
    // transparente hasta que de verdad sale de pantalla.
    const alScroll = () => {
      const hero = document.getElementById("hero");
      setBajado(
        hero ? hero.getBoundingClientRect().bottom < 80 : window.scrollY > 80
      );
    };
    alScroll();
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, [sobreHero]);

  const transparente = sobreHero && !bajado && !abierto;

  return (
    <header
      className={`z-50 w-full transition-colors duration-500 ${
        sobreHero ? "fixed top-0" : "sticky top-0"
      } ${
        transparente
          ? "border-b border-transparent bg-transparent"
          : "border-b border-gris bg-hueso/95 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between px-6 lg:px-10">
        <Link href="/" aria-label="Inicio">
          <Logo light={transparente} />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {enlaces.map((e) => (
            <Link
              key={e.href}
              href={e.href}
              className={`text-[15px] font-medium transition-colors ${
                transparente
                  ? "text-white/70 hover:text-white"
                  : "text-navy/75 hover:text-navy"
              }`}
            >
              {e.label}
            </Link>
          ))}
          <Link
            href="https://wa.me/51931370624?text=Hola%2C%20quiero%20una%20propuesta%20para%20un%20estudio"
            target="_blank"
            rel="noopener noreferrer"
            className={`rounded-lg px-5 py-2.5 font-display text-[14px] font-semibold transition-colors ${
              transparente
                ? "bg-white/10 text-white ring-1 ring-white/25 backdrop-blur hover:bg-white/20"
                : "bg-navy text-white hover:bg-navy-900"
            }`}
          >
            Cuéntanos tu proyecto
          </Link>
        </nav>

        <button
          onClick={() => setAbierto(!abierto)}
          className="-mr-2 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-label="Abrir menú"
          aria-expanded={abierto}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-0.5 w-6 transition-all duration-300 ${
                transparente ? "bg-white" : "bg-navy"
              } ${
                abierto && i === 0 ? "translate-y-2 rotate-45" : ""
              } ${abierto && i === 1 ? "opacity-0" : ""} ${
                abierto && i === 2 ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          ))}
        </button>
      </div>

      {abierto && (
        <nav className="border-t border-gris bg-hueso lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-6 py-4">
            {enlaces.map((e) => (
              <Link
                key={e.href}
                href={e.href}
                onClick={() => setAbierto(false)}
                className="py-3 text-[16px] font-medium text-navy/75"
              >
                {e.label}
              </Link>
            ))}
            <Link
              href="https://wa.me/51931370624?text=Hola%2C%20quiero%20una%20propuesta%20para%20un%20estudio"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setAbierto(false)}
              className="mt-3 rounded-lg bg-navy px-5 py-3 text-center font-display text-[15px] font-semibold text-white"
            >
              Cuéntanos tu proyecto
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
