import { HeartPulse } from "lucide-react";

export default function LandingFooter() {
  return (
    <footer className="w-full bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-800 dark:text-gray-100 tracking-tight">
            <HeartPulse className="text-blue-600 dark:text-blue-500" size={28} />
            Coraje
          </div>
          <div className="text-sm font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
            Centro de Servicio Médico
          </div>
        </div>
        <div className="border-t border-gray-100 dark:border-gray-800 pt-8 mt-8 flex justify-center text-gray-500 dark:text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Coraje. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
