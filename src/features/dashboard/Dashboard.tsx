import DoughnutChart from "../../components/charts/DoughnutChart";
import usersMock from "../../data/mock/users";

export default function Dashboard() {

  const imageSrc = `data:image/png;base64,${usersMock[0].imageProfile}`;

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100 ">
      <main className="ml-8 pt-10 px-8 pb-12">
        <section className="mb-10">
            <h2 className="text-4xl font-black text-on-surface mb-2 dark:text-gray-100">¡Hola, {usersMock[0].name}! 👋</h2>
            <p className="text-on-surface-variant text-lg text-gray-500 dark:text-gray-400 font-medium">Bienvenido de nuevo a tu santuario clínico. Todo está bajo control.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-6 bg-white/80 dark:bg-gray-800 dark:text-gray-100 rounded-[2rem] p-8 shadow-[0_0_10px_0px_rgba(0,0,0,0.2)] shadow-bllue-900/20 relative overflow-hidden group">
                <span className="material-symbols-outlined absolute inset-0 m-auto text-[130px] opacity-10 dark:opacity-20 pointer-events-none select-none text-blue-800 dark:text-gray-100" style={{ fontVariationSettings: "'FILL' 1" }}>
                    monitoring
                </span>
                <div className="grid grid-cols-12 relative z-10">
                  <div className="col-span-8">
                    <h3 className="text-xl font-bold text-on-surface mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-blue-900 rounded-full"></span>
                        Resumen de Seguimiento
                    </h3>
                    <p className="text-2xl font-extrabold text-on-surface mb-8"> Tienes <span className="text-blue-800 font-extrabold">3 medicamentos</span> en seguimiento</p>
                    <div className="flex gap-4">
                        <div className="bg-green-400/20 px-4 py-3 rounded-2xl flex items-center gap-3">
                            <span className="w-3 h-3 bg-green-700 rounded-full"></span>
                            <p className="text-xs text-green-700 text-on-secondary-fixed-variant font-bold uppercase tracking-tighter">
                                1 Disponible
                            </p>
                        </div>
                        <div className="bg-orange-400/20 px-4 py-3 rounded-2xl flex items-center gap-3">
                            <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
                            <p className="text-xs text-orange-600 text-on-secondary-fixed-variant font-bold uppercase tracking-tighter">
                                2 En Espera
                            </p>
                        </div>
                    </div>
                  </div>
                  <div className="col-span-4">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="w-full h-full">
                        <DoughnutChart data={[
                          { label: "Disponible", value: 1},
                          { label: "En Espera", value: 2}
                        ]} colors={['#05df72','#ff8904']} />
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}
