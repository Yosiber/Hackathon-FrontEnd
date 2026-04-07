import { ShieldCheck, Zap, Activity } from "lucide-react";

export default function LandingFeatures() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Zap size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Rápido como un Rayo</h3>
            <p className="text-gray-600">Desarrollado con tecnologías modernas para ofrecer actualizaciones instantáneas en todos tus paneles e inventarios.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Seguro y Confiable</h3>
            <p className="text-gray-600">Control de acceso basado en roles y seguridad de nivel empresarial significa que tus datos están protegidos siempre.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <Activity size={28} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Análisis en Tiempo Real</h3>
            <p className="text-gray-600">Toma decisiones informadas con visualizaciones de datos en tiempo real, sistemas de notificaciones e insights inteligentes.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
