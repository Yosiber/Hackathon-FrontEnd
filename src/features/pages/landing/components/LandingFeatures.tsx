import { HandPlatter, ClipboardList, TrendingUp } from "lucide-react";

export default function LandingFeatures() {
  return (
    <section className="pb-32 pt-24 bg-blue-900 relative overflow-hidden">
      {/* Decorative background shapes for the dark section */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[120px] opacity-20 transform translate-x-1/2 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-400 rounded-full blur-[120px] opacity-20 transform -translate-x-1/3 translate-y-1/3"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-12">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Potenciales Ilimitados</h2>
          <p className="mt-6 text-xl text-blue-200">Herramientas diseñadas específicamente para maximizar el rendimiento.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Feature 1 */}
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 hover:bg-white/20 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 text-white shadow-lg shadow-blue-500/50">
              <ClipboardList size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Inventario Inteligente</h3>
            <p className="text-blue-100/90 leading-relaxed text-lg">Controla tus suministros de medicamentos con alertas de stock mínimo, gestión de entregas y estados en tiempo real.</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 hover:bg-white/20 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 text-white shadow-lg shadow-emerald-500/50">
              <HandPlatter size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Atención de Tickets</h3>
            <p className="text-blue-100/90 leading-relaxed text-lg">Registra, atiende y programa citas para pacientes. Módulo dedicado a una gestión eficiente de requerimientos médicos.</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 hover:bg-white/20 hover:-translate-y-2 transition-all duration-300 group">
            <div className="w-16 h-16 bg-cyan-500 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300 text-white shadow-lg shadow-cyan-500/50">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Dashboard Ejecutivo</h3>
            <p className="text-blue-100/90 leading-relaxed text-lg">Visualiza el rendimiento de tu centro con métricas avanzadas, notificaciones al instante y reportes consolidados.</p>
          </div>
        </div>
      </div>

      {/* Bottom Wave to Transition back to White (Carousel Section) */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
        <svg
          className="relative block w-[calc(100%+1.3px)] h-[80px] md:h-[120px]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 24 150 28"
          preserveAspectRatio="none"
          shapeRendering="auto"
        >
          <g className="animate-wave-parallax">
            <use href="#gentle-wave" x="48" y="0" fill="rgba(255, 255, 255, 0.7)" />
            <use href="#gentle-wave" x="48" y="3" fill="rgba(255, 255, 255, 0.5)" />
            <use href="#gentle-wave" x="48" y="5" fill="rgba(255, 255, 255, 0.3)" />
            <use href="#gentle-wave" x="48" y="7" fill="#ffffff" />
          </g>
        </svg>
      </div>
    </section>
  );
}
