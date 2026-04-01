import EstadisticasClient from "@/components/EstadisticasClient";
import Footer from "@/components/Footer";

export default function EstadisticasPage() {
  return (
    <div>
      <main className="min-h-screen bg-[#eef2fb]">

        {/* Banner */}
        <section className="relative w-full overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/hero-bg1.jpg')" }}
          />
          <div className="absolute inset-0 bg-[#1f2f59]/75" />
          <div className="relative mx-auto flex h-[90px] max-w-6xl items-center justify-center px-4 lg:px-16">
            <h1 className="text-center text-[32px] font-extrabold leading-[110%] tracking-[-0.02em] text-white sm:text-[40px]">
              Estadísticas
            </h1>
          </div>
        </section>

        {/* Gráficos */}
        <section className="bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-16">
            <EstadisticasClient />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
