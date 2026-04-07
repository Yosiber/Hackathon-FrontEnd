import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-32">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 z-0"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-8">
          Administra tus sistemas con <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            facilidad sin precedentes
          </span>
        </h1>
        <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto mb-10">
          La plataforma definitiva para tickets, inventario y análisis en tu panel en tiempo real. Acelera tu productividad hoy.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/register" className="flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-full bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all transform hover:-translate-y-1">
            Comenzar <ArrowRight size={20} />
          </Link>
          <Link to="/login" className="flex items-center gap-2 px-8 py-4 text-lg font-semibold rounded-full bg-white text-gray-800 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm transition-all">
            Acceder al Panel
          </Link>
        </div>
      </div>
    </section>
  );
}
