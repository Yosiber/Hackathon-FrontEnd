import { Search, Settings } from "lucide-react"
import { useState } from "react"
import ArrivalModal from "./ArrivalModal"
import { useSearch } from "../context/SearchContext";
import { useEffect } from "react";


type Med = {
  name: string
  brand: string
  presentation: string
  stock: number
  min: number
  status: string
  eta: string
}

const initialMeds: Med[] = [
  {
    name: "Metformina 850mg",
    brand: "Laboratorios Generics",
    presentation: "Tabletas",
    stock: 1240,
    min: 200,
    status: "DISPONIBLE",
    eta: "--",
  },
  {
    name: "Ibuprofeno 400mg",
    brand: "FarmaCare Inc.",
    presentation: "Cápsulas blandas",
    stock: 42,
    min: 50,
    status: "BAJO STOCK",
    eta: "15 de Mayo",
  },
  {
    name: "Amoxicilina 500mg",
    brand: "BioPharm",
    presentation: "Jarabe",
    stock: 0,
    min: 15,
    status: "AGOTADO",
    eta: "En camino (12 May)",
  },
  {
    name: "Losartán 50mg",
    brand: "Vitalis",
    presentation: "Tabletas",
    stock: 450,
    min: 100,
    status: "DISPONIBLE",
    eta: "--",
  },
]

function Badge({ status }: { status: string }) {
  if (status === "DISPONIBLE")
    return <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">DISPONIBLE</span>
  if (status === "BAJO STOCK")
    return <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">BAJO STOCK</span>
  return <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">AGOTADO</span>
}

const mapStatus = (status: string) => {
  switch (status) {
    case "active":
      return "DISPONIBLE";
    case "low-stock":
      return "BAJO STOCK";
    case "out-of-stock":
      return "AGOTADO";
    default:
      return "DISPONIBLE";
  }
};

export default function Inventary() {
  const [filter, setFilter] = useState("TODOS")
  const [open, setOpen] = useState(false)
  const [selectedMed, setSelectedMed] = useState<Med | null>(null)
  const [data, setData] = useState<Med[]>(initialMeds)
  const { search } = useSearch();
  const [sort, setSort] = useState("none")
  const [showSort, setShowSort] = useState(false)
  const { setPlaceholder } = useSearch();


    useEffect(() => {
      setPlaceholder("Buscar medicamento...");
    }, []);

  
  const updateStock = (amount: number) => {
    if (!selectedMed) return
    setData((prev) =>
      prev.map((m) => {
        if (m.name !== selectedMed.name) return m
        const newStock = m.stock + amount
        return {
          ...m,
          stock: newStock,
          status:
            newStock === 0
              ? "AGOTADO"
              : newStock < m.min
              ? "BAJO STOCK"
              : "DISPONIBLE",
        }
      })
    )
  }

    let filtered = data.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase())

    let matchesFilter = true
    if (filter === "EN REPOSICIÓN") matchesFilter = m.eta !== "--"
    else if (filter !== "TODOS") matchesFilter = m.status === filter

    return matchesSearch && matchesFilter
  })

  if (sort === "name") {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  }

  if (sort === "stock") {
    filtered.sort((a, b) => b.stock - a.stock)
  }

  if (sort === "min") {
    filtered.sort((a, b) => a.min - b.min)
  }

    if (sort === "status") {
    const order: Record<string, number> = {
      "DISPONIBLE": 1,
      "BAJO STOCK": 2,
      "AGOTADO": 3,
    }

    filtered.sort((a, b) => order[a.status] - order[b.status])
  }

    useEffect(() => {
    const fetchMeds = async () => {
      try {
        const res = await fetch("https://coraje.server.daisyflows.top/medications");
        const json = await res.json();
       
        console.log("BACKEND DATA:", json);

        const mapped = json.items.map((m: any) => ({
                name: m.name,
                brand: m.laboratory,
                presentation: m.presentation,
                stock: m.stock,
                min: m.minStock,
                status: mapStatus(m.status),
                eta: "--"
          }));

        setData(mapped);

      } catch (err) {
        console.error("Error trayendo medicamentos:", err);
      }
    };

    fetchMeds();
  }, []);
  

  const filterBtn = (label: string, value: string) => (
    <button
      key={value}
      onClick={() => setFilter(value)}
      className={`
        px-4 py-2 rounded-full text-sm border
        ${filter === value
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
        }
      `}
    >
      {label}
    </button>
  )

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
           <div className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-200" 
               style={{ fontSize: '20px', fontVariationSettings: "'FILL' 1" }}>
               inventory_2
              </span>
             </div>
          <div>
            <h1 className="text-2xl font-bold">Inventario — Sede Centro</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Control de suministros y gestión de existencias
            </p>
          </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
            <button
              className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm"
              onClick={() => setShowSort(!showSort)}
            >
            <span className="text-gray-600 dark:text-gray-200">
              Filtros avanzados
            </span>
            </button>
                {showSort && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md p-2 text-sm">
                    <div
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                      onClick={() => { setSort("name"); setShowSort(false); }}
                    >
                      Ordenar por nombre
                    </div>
                    <div
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                      onClick={() => { setSort("stock"); setShowSort(false); }}
                    >
                      Ordenar por stock
                    </div>
                    <div
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                      onClick={() => { setSort("min"); setShowSort(false); }}
                    >
                      Ordenar por stock mínimo
                    </div>
                    <div
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
                      onClick={() => { setSort("status"); setShowSort(false); }}
                    >
                      Ordenar por estado
                    </div>
                    <div
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer text-red-600"
                      onClick={() => { setSort("none"); setShowSort(false); }}
                    >
                      Quitar orden
                    </div>
                  </div>
                )}
              </div>
            </div> 
          </div>

        {/* Alert banner */}
        <div className="bg-red-50 dark:bg-gray-800 border border-red-100 dark:border-gray-700 text-red-700 dark:text-gray-200 rounded-lg p-3 flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md font-medium">
              3 medicamentos en stock crítico
            </div>
            <div className="text-sm text-red-700 dark:text-red-300">
              Revisar y reponer inmediatamente
            </div>
          </div>
          <button className="text-sm text-red-600 dark:text-red-400 font-medium">VER DETALLES</button>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {filterBtn("Todos", "TODOS")}
            {filterBtn("Disponible", "DISPONIBLE")}
            {filterBtn("Bajo stock", "BAJO STOCK")}
            {filterBtn("Agotado", "AGOTADO")}
            {filterBtn("En reposición", "EN REPOSICIÓN")}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 dark:text-gray-300 border-b border-gray-100 dark:border-gray-700">
                <th className="text-left p-4">NOMBRE DEL MEDICAMENTO</th>
                <th className="text-left p-4">PRESENTACIÓN</th>
                <th className="text-right p-4">STOCK ACTUAL</th>
                <th className="text-right p-4">STOCK MÍNIMO</th>
                <th className="text-center p-4">ESTADO</th>
                <th className="text-left p-4">FECHA REPOSICIÓN</th>
                <th className="p-4">ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={i} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
                  <td className="p-4">
                    <div className="font-semibold text-gray-800 dark:text-gray-100">{m.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-300">{m.brand}</div>
                  </td>
                  <td className="p-4">{m.presentation}</td>
                  <td className="p-4 text-right font-semibold text-gray-800 dark:text-gray-100">
                    {m.stock.toLocaleString()}
                  </td>
                  <td className="p-4 text-right text-gray-500 dark:text-gray-300">{m.min}</td>
                  <td className="p-4 text-center">
                    <Badge status={m.status} />
                  </td>
                  <td className="p-4 text-blue-600 dark:text-blue-400">{m.eta}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => {
                        setSelectedMed(m)
                        setOpen(true)
                      }}
                      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
                    >
                      Registrar llegada
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

        
          <div className="p-4 text-sm text-gray-500 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700">
            Mostrando {filtered.length} de {data.length} medicamentos registrados
          </div>
        </div>

    
        {selectedMed && (
          <ArrivalModal
            open={open}
            setOpen={setOpen}
            med={selectedMed}
            onSubmit={updateStock}
          />
        )}
      </div>
    </main>
  )
}