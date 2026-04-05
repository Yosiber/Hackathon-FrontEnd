import DoughnutChart from "../../components/charts/DoughnutChart";
import usersMock from "../../data/mock/users";
import productsMock from "../../data/mock/products";

export default function Dashboard() {

  const imageSrc = `data:image/png;base64,${usersMock[0].imageProfile}`;
  const [ availableProducts, waitingProducts, closeProductIndex, daysForShipment ] = calculateProductStatus(productsMock);

  function calculateProductStatus(products: typeof productsMock) {
    let available = 0;
    let waiting = 0;
    let closeProductIndex: number | null = null;
    let daysForShipment: number | null = null;

    products.forEach(product => {
      if (product.status === "active") {
        available++;
        } else {
            waiting++;
            if (product.repositionDate !== null) {
                if (closeProductIndex === null) {
                    closeProductIndex = products.indexOf(product);
                } else {
                    const actualCloseDate = new Date(products[closeProductIndex]!.repositionDate!);
                    const newCloseDate = new Date(product.repositionDate!);
                    if (newCloseDate < actualCloseDate) {
                        closeProductIndex = products.indexOf(product);
                    }
                }
            }
        }
    });

    if (closeProductIndex !== null) {
        const closeDate = new Date(products[closeProductIndex]!.repositionDate!);
        const today = new Date();
        const timeDiff = closeDate.getTime() - today.getTime();
        daysForShipment = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    }

    return [available, waiting, closeProductIndex, daysForShipment] as const;
  }

  return (
    <div className="overflow-hidden fixed top-0 left-64 right-0">
      <header
          className="h-16 z-0 bg-white/80 backdrop-blur-xl
          shadow-[0_10px_10px_-5px] shadow-blue-900/20 flex justify-between items-center px-12
          dark:bg-gray-800"
      >
        <div className="flex-1 max-w-md">
          <div className="relative group">
            <span className="material-symbols-outlined absolute text-gray-600 dark:text-gray-100/50 left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"> search </span>
            <input
              className="w-full bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-100 border-none rounded-full py-2 pl-10 pr-4 text-sm hover:ring-2 hover:ring-blue-400/50 dark:hover:ring-blue-600/50
              focus:outline-none focus:ring-2 focus:ring-blue-200 dark:focus:ring-green-600 focus:ring-opacity-75 transition-all placeholder:text-on-surface-variant/50"
              placeholder="Buscar medicamento..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
              <button className="relative p-1.5 flex items-center">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-100/80 text-on-surface-variant hover:cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }}> notifications </span>
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 dark:bg-green-500 rounded-full"></span>
              </button>
              <button className="p-1.5 flex items-center">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-100/80 text-on-surface-variant hover:cursor-pointer" style={{ fontVariationSettings: "'FILL' 1" }}> help_outline </span>
              </button>
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img className="rounded-full" src={imageSrc} alt="Profile Image" />
          </div>
        </div>
      </header>
      <main className="ml-8 pt-5 pl-8 pr-8 pb-12 h-[calc(100vh-64px)] overflow-y-auto">
        <section className="mb-10">
            <h2 className="text-4xl font-black text-on-surface mb-2 dark:text-gray-100 text-center md:text-left">¡Hola, {usersMock[0].name}! 👋</h2>
            <p className="text-on-surface-variant text-lg text-gray-500 dark:text-gray-400 font-medium text-center md:text-left">
                Bienvenido de nuevo a tu santuario clínico. Todo está bajo control.
            </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div className="md:col-span-12 lg:col-span-6 bg-white/80 dark:bg-gray-800 dark:text-gray-100 rounded-[2rem]
            p-8 shadow-[0_0_10px_0px_rgba(0,0,0,0.2)] relative overflow-hidden group text-center md:text-left">
                <span className="material-symbols-outlined border-gray-400 absolute -right-10 -bottom-10 m-auto !text-[300px] opacity-10 dark:opacity-20 pointer-events-none select-none text-blue-800 dark:text-gray-100" style={{ fontVariationSettings: "'FILL' 1" }}>
                    monitoring
                </span>
                <div className="grid grid-cols-12 relative z-10">
                  <div className="md:col-span-8 col-span-12">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-center md:text-left justify-center md:justify-start">
                        <span className="w-2 h-8 bg-blue-900 rounded-full"></span>
                        Resumen de Seguimiento
                    </h3>
                    <p className="text-2xl font-extrabold text-on-surface mb-8"> Tienes <span className="text-blue-800 font-extrabold">3 medicamentos</span> en seguimiento</p>
                    <div className="flex gap-4 justify-center md:justify-start">
                        <div className="bg-green-400/20 px-4 py-3 rounded-2xl flex items-center gap-3">
                            <span className="w-3 h-3 bg-green-700 rounded-full"></span>
                            <p className="text-xs text-green-700 font-bold uppercase tracking-tighter">
                                {availableProducts} {availableProducts > 1 ? 'Disponibles' : 'Disponible'}
                            </p>
                        </div>
                        <div className="bg-orange-400/20 px-4 py-3 rounded-2xl flex items-center gap-3">
                            <span className="w-3 h-3 bg-orange-600 rounded-full"></span>
                            <p className="text-xs text-orange-600 font-bold uppercase tracking-tighter">
                                {waitingProducts} En Espera
                            </p>
                        </div>
                    </div>
                  </div>
                  <div className="col-span-12 md:col-span-4 mt-5 md:mt-0">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className=" flex items-center justify-center w-full h-full">
                        <DoughnutChart data={[
                          { label: "Disponible", value: availableProducts},
                          { label: "En Espera", value: waitingProducts}
                        ]} colors={['#05df72','#ff8904']} />
                      </div>
                    </div>
                  </div>
                </div>
            </div>

            <div className="md:col-span-12 lg:col-span-5 bg-linear-to-r from-[#0d47a1] to-[#1976D2] rounded-[2rem] p-8 shadow-[0_0_10px_0px_rgba(0,0,0,0.2)]
            text-on-primary flex flex-col justify-between dark:bg-gray-800 dark:text-gray-100">
                {(closeProductIndex !== null) ? (
                    <>
                        <div>
                            <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-2">Próxima entrega</p>
                            <h3 className="text-3xl text-gray-100 font-black mb-1">{productsMock[closeProductIndex].name}</h3>
                            <p className="text-lg text-gray-300">{productsMock[closeProductIndex].dose} • {productsMock[closeProductIndex].presentation}</p>
                        </div>
                        <div className="flex items-end justify-between mt-8">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-gray-100 !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
                                <div className="text-gray-100">
                                    <p className="text-sm font-bold">Llegada estimada</p>
                                    <p className="text-2xl font-black">en {daysForShipment} días</p>
                                </div>
                            </div>
                            <span className="material-symbols-outlined text-gray-100 !text-6xl opacity-50">
                                event
                            </span>
                        </div>
                    </>
                ) : (
                    <>
                        <div>
                            <p className="text-gray-300 text-xs font-bold uppercase tracking-widest mb-2">Próxima entrega</p>
                            <h3 className="text-3xl text-gray-100 font-black mb-1">Kike Tanga</h3>
                            <p className="text-lg text-gray-300">850mg • 2 cápsulas</p>
                        </div>
                    </>
                )}
            </div>
        </div>

        <section className="md:pr-25">
            <div className="flex justify-between items-end mb-8 px-2">
                <div>
                    <h3 className="text-2xl font-black dark:text-gray-100">Mis medicamentos activos</h3>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Gestiona tus recetas y disponibilidad en tiempo real.</p>
                </div>
                <button className="text-blue-600 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all">
                    Ver historial completo <span className="material-symbols-outlined">chevron_right</span>
                </button>
            </div>
            <div className="space-y-4">
                {Array.isArray(productsMock) && productsMock.length > 0 ? (
                    productsMock.map((product, index) => {
                        const repositionDate = product.repositionDate ? new Date(product.repositionDate) : null;
                        const today = new Date();
                        const hasShipmentDate = repositionDate !== null && !Number.isNaN(repositionDate.getTime());
                        const daysForShipment = hasShipmentDate
                            ? Math.ceil((repositionDate.getTime() - today.getTime()) / (1000 * 3600 * 24)) + 1
                            : null;
                            console.log(product.name, hasShipmentDate, daysForShipment);

                        return (
                            <div className={`rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-lg transition-all duration-300 group border-l-4 shadow-sm bg-white/80 dark:bg-gray-800
                                ${product.status === "active" ? "border-green-600" : (hasShipmentDate ? "border-orange-400/80" : "border-gray-500")}`}>
                                <div className="flex items-center gap-6 flex-1">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-secondary
                                        ${product.status === "active" ? "bg-green-400/20 text-green-700" : (hasShipmentDate ? "bg-orange-400/20 text-orange-400" : "bg-gray-400/20 text-gray-700 dark:text-gray-400")}`}>
                                        <span className="material-symbols-outlined !text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>pill</span>
                                    </div>
                                    <div>
                                        <h4 className={`text-xl font-bold dark:text-gray-100 transition duration-300
                                            ${product.status === "active" ? "group-hover:text-green-700" : (hasShipmentDate ? "group-hover:text-orange-400" : "group-hover:text-gray-600 dark:group-hover:text-gray-400")}`}>
                                            {product.name}
                                        </h4>
                                        <p className="font-medium text-gray-500 dark:text-gray-400">{product.dose} • {product.presentation}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12 flex-[2]">
                                    <div className="min-w-[140px]">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase
                                            ${product.status === "active" ? "bg-green-400/20 text-green-700" : (hasShipmentDate ? "bg-orange-400/20 text-orange-400" : "bg-gray-400/20 text-gray-700 dark:text-gray-300")}`}>
                                            {product.status === "active" ? "Disponible" : "En Reposición"}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-tighter text-gray-600 dark:text-gray-500">Farmacia</p>
                                        <p className="font-bold dark:text-gray-100">Sucursal Autorizada</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-tighter text-gray-600 dark:text-gray-500">Próximo Stock</p>
                                        <p className="font-medium dark:text-gray-100">
                                            {daysForShipment === null ? "Información No Disponible" : (daysForShipment === 1 ? "Mañana" : (daysForShipment === 0 ? "Hoy mismo" : `En ${daysForShipment} días`))}
                                        </p>
                                    </div>
                                </div>
                                <button className={`px-6 py-3 rounded-2xl bg-gray-200 font-bold text-sm hover:cursor-pointer  transition-all duration-300
                                    ${product.status === "active" ? "hover:bg-green-400/20 hover:text-green-700" : (hasShipmentDate ? "hover:bg-orange-400/20 hover:text-orange-400" : "hover:bg-gray-400/20 hover:text-gray-700 dark:hover:bg-gray-400/20 dark:hover:text-gray-400")}`}>
                                    Ver detalles
                                </button>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No tienes medicamentos activos en este momento.</p>
                )}
            </div>
        </section>
      </main>
    </div>
  );
}
