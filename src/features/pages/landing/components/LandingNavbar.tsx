import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <nav className="w-full py-4 px-8 flex justify-between items-center bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 fixed top-0 z-50">
      <div className="text-2xl font-bold tracking-tight text-blue-800 flex items-center gap-2">
        <HeartPulse className="text-blue-600" size={28} />
        Coraje
      </div>
      <div className="flex gap-4">
        <Link to="/login" className="px-5 py-2.5 text-blue-800 font-semibold hover:text-blue-600 transition-colors">
          Iniciar Sesión
        </Link>
        <Link to="/register" className="px-6 py-2.5 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20 hover:shadow-lg hover:shadow-blue-600/40 hover:-translate-y-0.5">
          Registrarse
        </Link>
      </div>
    </nav>
  );
}
