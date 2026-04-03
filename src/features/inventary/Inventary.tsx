import { Search, Settings } from "lucide-react"
import { useState } from "react"
import ArrivalModal from "../inventary/ArrivalModal"

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

export default function Inventary() {
  const [filter, setFilter] = useState("TODOS")
  const [open, setOpen] = useState(false)
  const [selectedMed, setSelectedMed] = useState<Med | null>(null)
  const [data, setData] = useState<Med[]>(initialMeds)

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

  const filtered = data.filter((m) => {
    if (filter === "TODOS") return true
    if (filter === "EN REPOSICIÓN") return m.eta !== "--"
    return m.status === filter
  })

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
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold">Inventario — Sede Centro</h1>
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Control de suministros y gestión de existencias
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                placeholder="Buscar medicamento..."
                className="pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-200 w-72"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-300" size={16} />
            </div>
            <button className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm">
              <Settings size={16} className="text-gray-600 dark:text-gray-200" />
            </button>
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
          <div className="text-sm text-blue-600 cursor-pointer">Filtros avanzados</div>
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