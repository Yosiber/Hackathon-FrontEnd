import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingNavbar() {
  return (
    <nav className="w-full py-4 px-8 flex justify-between items-center bg-white shadow-sm border-b border-gray-100">
      <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center gap-2">
        <Activity className="text-blue-600" />
        Sistema
      </div>
      <div className="flex gap-4">
        <Link to="/login" className="px-5 py-2 text-gray-600 font-medium hover:text-blue-600 transition-colors">
          Iniciar Sesión
        </Link>
        <Link to="/register" className="px-5 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
          Registrarse
        </Link>
      </div>
    </nav>
  );
}
