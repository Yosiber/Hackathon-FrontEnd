import { ArrowRight, ShieldCheck, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-gray-900 pt-32 pb-48 min-h-[85vh] flex items-center">
      {/* Richer Background patterns */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-200 via-indigo-50 to-white dark:from-blue-900/40 dark:via-gray-900 dark:to-gray-900 z-0"></div>
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-48 -left-24 w-72 h-72 bg-emerald-400/20 dark:bg-emerald-400/10 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center w-full">
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white dark:bg-gray-800 text-blue-800 dark:text-blue-300 font-bold text-sm mb-8 border border-blue-200 dark:border-blue-800/50 shadow-lg shadow-blue-500/10">
          <Activity size={18} className="text-blue-600 dark:text-blue-400" />
          <span>Centro de Servicio Médico Inteligente</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8 leading-tight">
          La gestión de tu salud, <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-emerald-500 dark:from-blue-400 dark:to-emerald-400">
            con el Coraje que necesitas
          </span>
        </h1>
        
        <p className="mt-4 max-w-2xl text-lg md:text-xl text-gray-700 dark:text-gray-300 font-medium mx-auto mb-12 leading-relaxed">
          Optimiza el control de inventario de medicamentos, la gestión de tickets de atención y mantén a tu personal conectado en tiempo real. 
          Todo en una sola plataforma en la nube.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <Link to="/register" className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-full bg-blue-600 dark:bg-blue-500 text-white hover:bg-blue-700 dark:hover:bg-blue-600 shadow-xl shadow-blue-600/40 dark:shadow-blue-500/20 transition-all transform hover:-translate-y-1">
            Comenzar Ahora <ArrowRight size={20}/>
          </Link>
          <Link to="/login" className="flex items-center justify-center gap-2 px-8 py-4 text-lg font-bold rounded-full bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100 border-2 border-blue-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-gray-600 hover:bg-blue-50 dark:hover:bg-gray-750 shadow-md transition-all focus:ring-4 focus:ring-blue-100 dark:focus:ring-gray-700 focus:outline-none">
            Acceder al Dashboard
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-20 flex justify-center items-center gap-8 text-gray-500 dark:text-gray-400 opacity-80 flex-wrap">
           <div className="flex items-center gap-2 font-bold text-lg md:text-xl"><ShieldCheck size={28} className="text-emerald-500 dark:text-emerald-400"/> Seguridad Integral</div>
           <div className="w-2 h-2 rounded-full bg-blue-300 dark:bg-blue-600 hidden md:block"></div>
           <div className="flex items-center gap-2 font-bold text-lg md:text-xl"><Activity size={28} className="text-blue-500 dark:text-blue-400"/> Datos en Tiempo Real</div>
        </div>
      </div>

      {/* Animated Waves Parallax Divider */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[100px] md:h-[150px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <defs>
            <path
              id="gentle-wave"
              d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
            />
          </defs>
          <g className="animate-wave-parallax text-[#1e3a8a] dark:text-gray-800">
            <use href="#gentle-wave" x="48" y="0" fill="currentColor" fillOpacity="0.7" />
            <use href="#gentle-wave" x="48" y="3" fill="currentColor" fillOpacity="0.5" />
            <use href="#gentle-wave" x="48" y="5" fill="currentColor" fillOpacity="0.3" />
            <use href="#gentle-wave" x="48" y="7" fill="currentColor" />
          </g>
        </svg>
        <style>
          {`
            .animate-wave-parallax > use {
              animation: move-forever 10s linear infinite;
              will-change: transform;
            }
            .animate-wave-parallax > use:nth-child(1) {
              animation-delay: -2s;
              animation-duration: 3s;
            }
            .animate-wave-parallax > use:nth-child(2) {
              animation-delay: -3s;
              animation-duration: 5s;
            }
            .animate-wave-parallax > use:nth-child(3) {
              animation-delay: -4s;
              animation-duration: 7s;
            }
            .animate-wave-parallax > use:nth-child(4) {
              animation-delay: -5s;
              animation-duration: 9s;
            }
            @keyframes move-forever {
              0% { transform: translate3d(-90px, 0, 0); }
              100% { transform: translate3d(85px, 0, 0); }
            }
          `}
        </style>
      </div>
    </section>
  );
}
