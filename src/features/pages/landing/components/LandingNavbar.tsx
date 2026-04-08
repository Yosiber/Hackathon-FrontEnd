import { useState } from "react";
import { HeartPulse, User, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import ThemeToggle from "../../../components/themetoggle/ThemeToggle";

export default function LandingNavbar() {
  const { authUser } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="w-full py-4 px-8 flex justify-between items-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm border-b border-gray-100 dark:border-gray-800 fixed top-0 z-50">
      <div 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="text-2xl font-bold tracking-tight text-blue-800 dark:text-gray-100 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <HeartPulse className="text-blue-600 dark:text-blue-500" size={28} />
        Coraje
      </div>
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-6">
        <ThemeToggle />
        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 hidden sm:block"></div>
        {authUser ? (
          <>
            <Link to="/dashboard" className="px-5 py-2.5 text-blue-800 dark:text-gray-200 font-semibold hover:text-blue-600 dark:hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/profile" className="p-2.5 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors flex items-center justify-center">
              <User size={20} />
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="px-5 py-2.5 text-blue-800 dark:text-gray-200 font-semibold hover:text-blue-600 dark:hover:text-white transition-colors">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="px-6 py-2.5 bg-blue-600 dark:bg-blue-500 text-white rounded-full font-bold hover:bg-blue-700 dark:hover:bg-blue-600 transition-all shadow-md shadow-blue-600/20 dark:shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-600/40 dark:hover:shadow-blue-500/40 hover:-translate-y-0.5">
              Registrarse
            </Link>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="relative w-10 h-10 flex items-center justify-center text-blue-800 dark:text-gray-200 focus:outline-none">
          <Menu className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'opacity-0 scale-50 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} size={28} />
          <X className={`absolute transition-all duration-300 ease-in-out ${isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'}`} size={28} />
        </button>
      </div>

      {/* Mobile Dropdown */}
      <div 
        className={`absolute top-[100%] left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden md:hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[500px] opacity-100 border-b' : 'max-h-0 opacity-0 border-b-0'}`}
      >
        <div className={`px-8 flex flex-col gap-5 transition-all duration-300 ${isOpen ? 'py-6 translate-y-0' : 'py-0 -translate-y-4'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Apariencia</span>
            <ThemeToggle />
          </div>
          
          <div className="h-px w-full bg-gray-100 dark:bg-gray-800"></div>
          
          {authUser ? (
            <div className="flex flex-col gap-4 mt-2">
              <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-blue-800 dark:text-gray-200 font-bold text-center py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Dashboard
              </Link>
              <Link to="/profile" onClick={() => setIsOpen(false)} className="bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-xl py-3 text-center font-bold transition-colors flex items-center justify-center gap-2">
                <User size={20} /> Mi Perfil
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4 mt-2">
              <Link to="/login" onClick={() => setIsOpen(false)} className="text-blue-800 dark:text-gray-200 font-bold text-center py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                Iniciar Sesión
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)} className="bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-bold py-3 text-center shadow-md">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
