import { useState } from "react"
import ArrivalModal from "./ArrivalModal"
import AddMedModal from "./AddMedModal"           
import { useSearch } from "../../context/SearchContext";
import { useEffect } from "react";
import api from "../../api/axios.instance"
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import ScheduleArrivalModal from "./ScheduleArrivalModal";
import { formatDate } from "./helpers";
import { getMedications } from "../../api/requests/medication.request";

type Med = {
  id: string
  name: string
  brand: string
  presentation: string
  stock: number
  min: number
  status: string
  incomingStock: number
  reservedIncomingStock: number,
  repositionDate: string,
  eta: string
}

const initialMeds: Med[] = [
  {
    id: "1",
    name: "Metformina 850mg",
    brand: "Laboratorios Generics",
    presentation: "Tabletas",
    stock: 1240,
    min: 200,
    status: "DISPONIBLE",
    eta: "--",
    incomingStock: 10,
    repositionDate: "2026-04-08T00:00:00.000Z",
    reservedIncomingStock: 0
  },
  {
    id: "2",
    name: "Ibuprofeno 400mg",
    brand: "FarmaCare Inc.",
    presentation: "Cápsulas blandas",
    stock: 42,
    min: 50,
    status: "BAJO STOCK",
    eta: "15 de Mayo",
    incomingStock: 10,
    repositionDate: "2026-04-08T00:00:00.000Z",
    reservedIncomingStock: 0
  },
  {
    id: "3",
    name: "Amoxicilina 500mg",
    brand: "BioPharm",
    presentation: "Jarabe",
    stock: 0,
    min: 15,
    status: "AGOTADO",
    eta: "En camino (12 May)",
    incomingStock: 10,
    repositionDate: "2026-04-08T00:00:00.000Z",
    reservedIncomingStock: 0
  },
  {
    id: "4",
    name: "Losartán 50mg",
    brand: "Vitalis",
    presentation: "Tabletas",
    stock: 450,
    min: 100,
    status: "DISPONIBLE",
    eta: "--",    
    incomingStock: 10,
    repositionDate: "2026-04-08T00:00:00.000Z",
    reservedIncomingStock: 0
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
    case "active":      return "DISPONIBLE"
    case "low-stock":   return "BAJO STOCK"
    case "out-of-stock":return "AGOTADO"
    default:            return "DISPONIBLE"
  }
}

export default function Inventary() {
  const [filter, setFilter] = useState("TODOS")
  const [open, setOpen] = useState(false)
  const [addOpen, setAddOpen] = useState(false)          
  const [selectedMed, setSelectedMed] = useState<Med | null>(null)
  const [data, setData] = useState<Med[]>(initialMeds)
  const { search } = useSearch()
  const [sort, setSort] = useState("none")
  const [showSort, setShowSort] = useState(false)
  const { setPlaceholder } = useSearch()
  const { authUser } = useAuth();
  const isAdmin = authUser?.role === "administrador";
  const navigate = useNavigate();
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const [scheduleOpen, setScheduleOpen] = useState(false)

  useEffect(() => {
    setPlaceholder("Buscar medicamento...")
  }, [])

  const updateStock = (amount: number) => {
    if (!selectedMed) return
    setData((prev) =>
      prev.map((m) => {
        if (m.id !== selectedMed.id) return m
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

  const handleMedCreated = (mappedMed: Med) => {
    setData((prev) => [...prev, mappedMed])
  }

  let filtered = data.filter((m) => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase())
    let matchesFilter = true
    if (filter === "EN REPOSICIÓN") matchesFilter = m.eta !== "--"
    else if (filter !== "TODOS") matchesFilter = m.status === filter
    return matchesSearch && matchesFilter
  })

  if (sort === "name")   filtered.sort((a, b) => a.name.localeCompare(b.name))
  if (sort === "stock")  filtered.sort((a, b) => b.stock - a.stock)
  if (sort === "min")    filtered.sort((a, b) => a.min - b.min)
  if (sort === "status") {
    const order: Record<string, number> = { "DISPONIBLE": 1, "BAJO STOCK": 2, "AGOTADO": 3 }
    filtered.sort((a, b) => order[a.status] - order[b.status])
  }

  const fetchMeds = async () => {
    try {
      const res = await getMedications({
        page,
        limit: PAGE_SIZE,
        name: search,
        status: filter,
        hasReposition: filter === "EN REPOSICIÓN"
      });

      const mapped = res.items.map((m: any) => ({
        id: m._id,
        name: m.name,
        brand: m.laboratory,
        presentation: m.presentation,
        stock: m.stock,
        min: m.minStock,
        status: mapStatus(m.status),
        eta: formatDate(m.repositionDate),
        repositionDate: m.repositionDate,
        incomingStock: m.incomingStock,
        reservedIncomingStock: m.reservedIncomingStock
      }));

      setData(mapped);
      // setTotalItems(res.total); 
    } catch (err) {
      console.error("Error trayendo medicamentos:", err);
    }
  };

  useEffect(() => {
    fetchMeds();
  }, [page, filter, search]);

  useEffect(() => {
    setPage(1);
  }, [filter, search]);

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

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div>
            {/* Header */}
      <div className="flex items-center justify-between mb-6">
        {/* Izquierda */}
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-white/80 dark:bg-gray-800 shadow-[0_0_10px_0px_rgba(0,0,0,0.15)]">
            <span
              className="material-symbols-outlined text-gray-600 dark:text-gray-200"
              style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
            >
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

        {/* Derecha */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <button
              onClick={() => setAddOpen(true)}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium"
            >
              + Añadir Medicamento
            </button>
          ) : (
            <button
              onClick={() => navigate("/tickets")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Solicitar medicamento
            </button>
          )}

          {/* Filtros */}
          <div className="relative">
            <button
              className="p-2 rounded-xl bg-white/80 dark:bg-gray-800 shadow"
              onClick={() => setShowSort(!showSort)}
            >
              <span className="text-gray-600 dark:text-gray-200">
                Filtros avanzados
              </span>
            </button>

            {showSort && (
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-md p-2 text-sm z-10">
                <div onClick={() => { setSort("name"); setShowSort(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                  Ordenar por nombre
                </div>
                <div onClick={() => { setSort("stock"); setShowSort(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                  Ordenar por stock
                </div>
                <div onClick={() => { setSort("min"); setShowSort(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                  Ordenar por stock mínimo
                </div>
                <div onClick={() => { setSort("status"); setShowSort(false); }} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                  Ordenar por estado
                </div>
                <div onClick={() => { setSort("none"); setShowSort(false); }} className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer">
                  Quitar orden
                </div>
              </div>
            )}
          </div>
        </div>
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
        <div className="p-2 rounded-xl bg-white/80 dark:bg-gray-800 shadow-[0_0_10px_0px_rgba(0,0,0,0.15)] overflow-hidden">
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
              {paginated.map((m) => (
                <tr key={m.id} className="border-b border-gray-100 dark:border-gray-700 last:border-b-0">
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
                  <td className="p-4 flex items-center justify-end gap-2">
                    {isAdmin ? (
                      <>
                        {/* BOTÓN NUEVO: Programar Pedido */}
                        <button
                          onClick={() => {
                            setSelectedMed(m);
                            setScheduleOpen(true);
                          }}
                          className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-200 hover:bg-gray-200 hover:text-gray-500 transition-colors flex items-center"
                          title="Actualizar datos de llegada"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                            edit_calendar
                          </span>
                        </button>

                        {/* BOTÓN EXISTENTE: Registrar llegada física */}
                        <button
                          onClick={() => {
                            if (m.incomingStock > 0) {
                              setSelectedMed(m);
                              setOpen(true);
                            }
                          }}
                          disabled={m.incomingStock <= 0}
                          className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                            m.incomingStock > 0
                              ? "bg-blue-600 text-white hover:bg-blue-700"
                              : "bg-gray-200 text-gray-400 cursor-not-allowed pointer-events-none dark:bg-gray-800"
                          }`}
                        >
                          {m.incomingStock > 0 ? "Recibir" : "Sin pendientes"}
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate("/tickets")}
                        className="px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
                      >
                        Solicitar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100 dark:border-gray-700">
            <span className="text-sm text-gray-500 dark:text-gray-300">
              Mostrando {((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length} medicamentos
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => p - 1)}
                disabled={page === 1}
                className="px-3 py-1 rounded-md text-sm border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                ← Anterior
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`px-3 py-1 rounded-md text-sm border ${
                    page === n
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  {n}
                </button>
              ))}

              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page === totalPages || totalPages === 0}
                className="px-3 py-1 rounded-md text-sm border border-gray-200 dark:border-gray-700 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </div>

        {/* Modal llegada */}
        {selectedMed && (
          <ArrivalModal
            open={open}
            setOpen={setOpen}
            med={selectedMed}
            onSubmit={() => fetchMeds()}
          />
        )}

        {/* Modal añadir medicamento ← nuevo */}
        <AddMedModal
          open={addOpen}
          setOpen={setAddOpen}
          onCreated={handleMedCreated}
        />

        <ScheduleArrivalModal
          open={scheduleOpen}
          setOpen={setScheduleOpen}
          med={selectedMed}
          onUpdated={fetchMeds} // Pasar la función de refresco
        />
      </div>
    </main>
  )
}