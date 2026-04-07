import { DownloadCloud, CheckCircle, AlertTriangle, Truck, Phone } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useSearch } from "../../context/SearchContext"
import { useAuth } from "../../context/AuthContext"
import ModalAtender from "./AttendModal"
import AgendaModal from "./ScheduleModal"
import CreateTicketModal from "./CreateTicketModal"
import type { Ticket, TicketStatus } from "../../api/types/tickets.type"



type ViewTicket = Ticket & {
  turno: string;
  paciente: string;
  hora: string;
  disponibilidad: string; 
}

// El sampleTicket también necesita disponibilidad
const sampleTickets: ViewTicket[] = [
  {
    _id: "69d2bdd...",
    ticketNumber: "TI-20260405-001",
    items: [
      {
        productId: "med-1",
        productName: "Metformina 850mg",
        quantity: 1,
        unitPrice: 1500,
        deliveryType: "immediate"
      }
    ],
    status: "registered",
    fulfillmentStatus: "waiting",
    totalAmount: 1500,
    customerId: "user-123",
    observations: [],
    turno: "A-101",
    paciente: "Carlos Gomez",
    hora: "08:30",
    disponibilidad: "1 de 1",  // ← añadir
  }
];

const statusLabel: Record<TicketStatus, string> = {
  registered: "POR ATENDER",
  "in-progress": "EN VENTANILLA",
  pending: "FINALIZADO",
};

const statusBadge: Record<TicketStatus, string> = {
  registered: "bg-red-100 text-red-600",
  "in-progress": "bg-sky-100 text-sky-600",
  pending: "bg-green-100 text-green-600",
};
const contarPorEstado = (tickets: ViewTicket[]) => ({
  registered: tickets.filter(t => t.status === "registered").length,
  "in-progress": tickets.filter(t => t.status === "in-progress").length,
  pending: tickets.filter(t => t.status === "pending").length,
})



// ---------- componente ----------
export default function Tickets() {
  const { search, setPlaceholder } = useSearch()
  const { authUser } = useAuth()
  const isAdmin = authUser?.role === "administrador"
  const isEmployee = authUser?.role === "empleado"
  const canManage = isAdmin || isEmployee

  const [tickets, setTickets] = useState<ViewTicket[]>(sampleTickets)
  const [openModal, setOpenModal] = useState(false)
  const [activeTicket, setActiveTicket] = useState<ViewTicket | null>(null)
  const [openAgenda, setOpenAgenda] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)
  const [mensaje, setMensaje] = useState("")

  const counts = contarPorEstado(tickets)

  const stats = [
    { label: "TICKETS PENDIENTES",  value: counts.registered,    color: "border-blue-400"   },
    { label: "EN ATENCIÓN",          value: counts["in-progress"], color: "border-yellow-400" },
    { label: "COMPLETADOS HOY",      value: counts.pending,        color: "border-green-400"  },
  ]

  
  useEffect(() => { setPlaceholder("Buscar turno o paciente...") }, [])

  const filteredTickets = tickets.filter(t =>
    t.turno.toLowerCase().includes(search.toLowerCase()) ||
    t.paciente.toLowerCase().includes(search.toLowerCase())
  )

  const handleConfirmAtender = (ticket: ViewTicket) => {
    setTickets(prev =>
      prev.map(t =>
        t._id === ticket._id ? { ...t, status: "in-progress" as const } : t
      )
    )
  }

  
  const handleCompletar = (ticket: ViewTicket) => {
    const match = /(\d+)\s+de\s+(\d+)/.exec(ticket.disponibilidad)
    if (!match) return
    if (parseInt(match[1]) === parseInt(match[2])) {
      setTickets(prev =>
        prev.map(t =>
          t._id === ticket._id ? { ...t, status: "pending" as const } : t
        )
      )
    } else {
      setMensaje("No se puede completar: no todos los medicamentos están disponibles.")
      setTimeout(() => setMensaje(""), 3000)
    }
  }

  const handleDescargarReporte = async () => {
    const response = await fetch("/api/reporte-pdf")
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "reporte_tickets.pdf"
    a.click()
  }

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">

      {/* Toast */}
      {mensaje && (
        <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg z-50">
          {mensaje}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm">
            <span
              className="material-symbols-outlined text-gray-600 dark:text-gray-200"
              style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
            >
              confirmation_number
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Tickets de hoy — Sede Centro
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lunes, 24 de Mayo · Turno Mañana
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Usuario normal: crear ticket */}
          {!canManage && (
            <button
              onClick={() => setOpenCreate(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm font-medium"
            >
              + Solicitar Ticket
            </button>
          )}

          {/* Admin/empleado: descargar reporte */}
          {canManage && (
            <button
              onClick={handleDescargarReporte}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <DownloadCloud size={16} />
              Descargar Reporte
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border-l-4 ${s.color}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
            Cola de Atención Activa
          </h3>
          <div className="text-sm text-gray-400 dark:text-gray-500">• Pendiente &nbsp; • En Proceso</div>
        </div>

        <table className="w-full table-auto text-left text-sm">
          <thead>
            <tr className="text-xs text-gray-500 text-center dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              <th className="py-3 w-28"># TURNO</th>
              <th className="py-3">PACIENTE</th>
              <th className="py-3">MEDICAMENTOS SOLICITADOS</th>
              <th className="py-3">DISPONIBILIDAD</th>
              <th className="py-3">ESTADO</th>
              <th className="py-3">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-center">
            {filteredTickets.map(t => (
              <tr key={t.turno} className="border-b last:border-b-0 border-gray-100 dark:border-gray-700">
                <td className="py-4 text-blue-600 dark:text-blue-400 font-semibold">{t.turno}</td>
                <td className="py-4">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{t.paciente}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">Hora: {t.hora}</div>
                </td>
                <td className="py-4">
                  <div className="flex flex-col gap-1 items-center">
                    {t.items.map(item => (
                        <span key={item.productId} className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full">
                          {item.productName} ×{item.quantity}
                        </span>
                      ))}
                  </div>
                </td>
                <td className="py-4">
                  <span className="inline-block px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs rounded-md">
                    {t.disponibilidad}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${statusBadge[t.status]}`}>
                    {statusLabel[t.status]}
                  </span>
                </td>

                {/* ── Columna de acciones según rol ── */}
                <td className="py-4">
                  {canManage ? (
                    <div className="flex items-center justify-center gap-2 flex-wrap">
                      {/* Llamar — siempre visible para admins/empleados */}
                      <a
                        href="tel:+573001234567"
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center gap-1"
                      >
                        <Phone size={13} /> Llamar
                      </a>

                      {/* Atender — solo si está en registered */}
                      {t.status === "registered" && (
                        <button
                          onClick={() => { setActiveTicket(t); setOpenModal(true) }}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-sm flex items-center gap-1"
                        >
                          <CheckCircle size={13} /> Atender
                        </button>
                      )}

                      {/* Completar — solo si está in-progress */}
                      {t.status === "in-progress" && (
                        <button
                          onClick={() => handleCompletar(t)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm flex items-center gap-1"
                        >
                          <CheckCircle size={13} /> Completar
                        </button>
                      )}
                    </div>
                  ) : (
                    /* Usuario normal: solo puede ver su propio estado */
                    <span className="text-xs text-gray-400 dark:text-gray-500 italic">
                      Solo lectura
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Mostrando {filteredTickets.length} de {tickets.length} tickets registrados hoy
        </div>
      </section>

      {/* Bottom */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-100">Alertas de Inventario Crítico</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 items-start bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 dark:text-gray-100">Insulina NPH</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Quedan solo 5 unidades en stock.</div>
                <div className="mt-3">
                  <Link to="/inventory" className="text-sm text-blue-600 dark:text-blue-400 font-medium">VER INVENTARIO</Link>
                </div>
              </div>
            </div>
            <div className="flex gap-4 items-start bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                <Truck size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 dark:text-gray-100">Metformina 850mg</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Pedido en camino (ETA: 14:00h).</div>
                <div className="mt-3">
                  <span className="text-sm text-blue-600 dark:text-blue-400 font-medium cursor-pointer">VER TRACKING</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
          <h4 className="font-semibold text-gray-700 dark:text-gray-100">Próximos Turnos</h4>
          <div className="mt-4 space-y-3">
            {[
              { tag: "URGENTE", tagColor: "bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400", name: "A-104 • Rosa Mendez", hora: "10:45" },
              { tag: "REGULAR", tagColor: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300", name: "B-205 • Pedro Pablo", hora: "10:52" },
              { tag: "REGULAR", tagColor: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300", name: "B-206 • Julia Sans", hora: "11:05" },
            ].map(item => (
              <div key={item.name} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                <div className="flex items-start gap-3">
                  <div className={`text-xs px-2 py-1 rounded-full font-medium ${item.tagColor}`}>{item.tag}</div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">{item.name}</div>
                </div>
                <div className="text-sm text-gray-400 dark:text-gray-500">{item.hora}</div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={() => setOpenAgenda(true)}
              className="w-full text-sm py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Ver Agenda Completa
            </button>
          </div>
        </aside>
      </section>

      {/* Modals */}
      <ModalAtender
        open={openModal}
        onClose={() => setOpenModal(false)}
        ticket={activeTicket}
        onConfirm={handleConfirmAtender}
      />
      <AgendaModal
        open={openAgenda}
        onClose={() => setOpenAgenda(false)}
        tickets={tickets}
      />
      <CreateTicketModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
      />
    </main>
  )
}