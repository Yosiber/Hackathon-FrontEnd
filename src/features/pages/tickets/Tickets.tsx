import { DownloadCloud, CheckCircle, Phone, X, Trash2, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { useSearch } from "../../context/SearchContext"
import { useAuth } from "../../context/AuthContext"
import ModalAtender from "./AttendModal"
import AgendaModal from "./ScheduleModal"
import CreateTicketModal from "./CreateTicketModal"
import ConfirmCancelModal from "./ConfirmCancelModal"
import type { Ticket } from "../../api/types/tickets.type"
import { getTickets, patchTicket, deleteTicket } from "../../api/requests/ticket.request"
import { mapTicketToView } from "./helpers"

export type ViewTicket = Ticket & {
  turno: string;
  paciente: string;
  hora: string;
  disponibilidad: string; 
}

const statusLabel: Record<string, string> = {
  waiting: "EN ESPERA",
  "partially-completed": "ENTREGA PARCIAL",
  completed: "COMPLETADO"
};

const statusBadge: Record<string, string> = {
  waiting: "bg-red-100 text-red-600",
  "partially-completed": "bg-sky-100 text-sky-600",
  completed: "bg-green-100 text-green-600"
};

export default function Tickets() {
  const { search, setPlaceholder } = useSearch()
  const { authUser } = useAuth()
  const isAdmin = authUser?.role === "administrador"
  const isEmployee = authUser?.role === "empleado"
  const canManage = isAdmin || isEmployee

  const [tickets, setTickets] = useState<ViewTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [mensaje, setMensaje] = useState("")
  
  const [statusFilter, setStatusFilter] = useState<string | "all">("all")
  const [counts, setCounts] = useState({ waiting: 0, partiallyCompleted: 0, completed: 0 })

  // Modales de flujo
  const [openModal, setOpenModal] = useState(false)
  const [activeTicket, setActiveTicket] = useState<ViewTicket | null>(null)
  const [openAgenda, setOpenAgenda] = useState(false)
  const [openCreate, setOpenCreate] = useState(false)

  // Nuevo estado para el modal de confirmación de eliminación
  const [openConfirm, setOpenConfirm] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [confirmData, setConfirmData] = useState<{
    ticketId: string;
    productIds: string[];
    names: string[];
    isFull: boolean;
  } | null>(null)

  const loadTickets = async () => {
    try {
      setLoading(true)
      const response = await getTickets({ 
        limit: 50
      })
      
      const mapped = response.items.map(mapTicketToView)
      setTickets(mapped)
      
    
      setCounts({
        waiting: mapped.filter((t: ViewTicket) => t.fulfillmentStatus === 'waiting').length,
        partiallyCompleted: mapped.filter((t: ViewTicket) => t.fulfillmentStatus === 'partially-completed').length,
        completed: mapped.filter((t: ViewTicket) => t.fulfillmentStatus === 'completed').length
      })
    } catch (error) {
      console.error("Error al obtener tickets:", error)
      setMensaje("Error al conectar con el servidor.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTickets()
  }, [])

  useEffect(() => { 
    setPlaceholder("Buscar turno o paciente...") 
  }, [])

  // Abre el modal de confirmación con los datos necesarios
  const prepareCancel = (ticketId: string, items: {productId: string, productName: string}[], isFull: boolean) => {
    setConfirmData({
      ticketId,
      productIds: items.map(i => i.productId),
      names: items.map(i => i.productName),
      isFull
    })
    setOpenConfirm(true)
  }

  // Ejecuta la petición al backend desde el modal
  const handleExecuteCancel = async () => {
    if (!confirmData) return
    setCancelLoading(true)
    try {
      // Para cancelar todo el ticket de forma segura en el nuevo backend, usamos siempre el patch de cancel-items
      // ya que el endpoint /purge solo permite eliminar si el estado es 'waiting'. El patch si lo vacía lo elimina internamente.
      await patchTicket(confirmData.ticketId, { 
        products: confirmData.productIds.map(id => ({ productId: id })) 
      } as any)
      
      setMensaje(confirmData.isFull ? "Ticket cancelado completamente y stock liberado" : "Medicamento eliminado")
      setOpenConfirm(false)
      loadTickets()
    } catch (error) {
      console.error("Error al cancelar:", error)
      setMensaje("Error al procesar la cancelación.")
    } finally {
      setCancelLoading(false)
      setTimeout(() => setMensaje(""), 3000)
    }
  }

  const filteredTickets = tickets.filter(t =>
    (statusFilter === "all" || t.fulfillmentStatus === statusFilter) &&
    (t.turno.toLowerCase().includes(search.toLowerCase()) ||
     t.paciente.toLowerCase().includes(search.toLowerCase()))
  )

  const stats = [
    { label: "EN ESPERA", value: counts.waiting, color: "border-red-400", key: "waiting" },
    { label: "ENTREGA PARCIAL", value: counts.partiallyCompleted, color: "border-sky-400", key: "partially-completed" },
    { label: "COMPLETADOS", value: counts.completed, color: "border-green-400", key: "completed" },
  ]

  const handleOpenDetails = (ticket: ViewTicket) => {
    setActiveTicket(ticket)
    setOpenModal(true)
  }

  const handleConfirmAtender = (ticket: ViewTicket) => {
    // Aquí el ModalAtender puede llamar a otra función si el backend soportara marcar como entregado definitivamente.
    // Actualmente el backend asume 'registered' como 'completado' si no hay items esperando.
    loadTickets()
    setOpenModal(false)
  }

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {mensaje && (
        <div className="fixed top-4 right-4 bg-gray-800 text-white px-4 py-2 rounded shadow-lg z-50 border-l-4 border-blue-500 animate-bounce">
          {mensaje}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-200">
             <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>confirmation_number</span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Tickets de hoy</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Gestión de inventario y dispensación</p>
          </div>
        </div>
        <div className="flex gap-3">
          {!canManage && (
            <button onClick={() => setOpenCreate(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm font-medium">+ Solicitar Ticket</button>
          )}
          {canManage && (
            <button className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50">
              <DownloadCloud size={16} /> Reporte
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(s => (
          <button 
            key={s.label} 
            onClick={() => setStatusFilter(statusFilter === s.key ? "all" : s.key)}
            className={`text-left bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border-l-4 transition-all ${s.color} ${statusFilter === s.key ? 'ring-2 ring-blue-400 scale-[1.02]' : ''}`}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
          </button>
        ))}
      </div>

      {/* Tabla */}
      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Cola de Atención</h3>
          {statusFilter !== "all" && (
            <button onClick={() => setStatusFilter("all")} className="text-xs text-blue-600 font-bold hover:underline">MOSTRAR TODO</button>
          )}
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="text-xs text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 uppercase text-center">
              <th className="py-3"># Turno</th>
              <th className="py-3 text-left">Paciente</th>
              <th className="py-3">Medicamentos</th>
              <th className="py-3">Disponibilidad</th>
              <th className="py-3">Estado</th>
              <th className="py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-center">
            {loading ? (
              <tr><td colSpan={6} className="py-10 text-gray-400 italic">Cargando tickets...</td></tr>
            ) : filteredTickets.map(t => (
              <tr key={t._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                <td className="py-4 font-bold text-blue-600 dark:text-blue-400">{t.turno}</td>
                <td className="py-4 text-left">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{t.paciente}</div>
                  <div className="text-xs text-gray-400">{t.hora}</div>
                </td>
                
                <td className="py-4 px-2">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {t.items.map((item, idx) => (
                      <span key={idx} className="group flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-[10px] rounded-full dark:text-white border border-transparent hover:border-red-200 transition-all">
                        {item.productName} x{item.quantity}
                        {canManage && (
                          <button 
                            onClick={() => prepareCancel(t._id, [{productId: String(item.productId), productName: item.productName}], false)}
                            className="text-gray-400 hover:text-red-500 transition-colors ml-1"
                            title="Eliminar este item"
                          >
                            <X size={10} strokeWidth={3} />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="py-4">
                  <span className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 text-[11px] rounded font-medium border border-amber-100 dark:border-amber-900/30">
                    {t.disponibilidad}
                  </span>
                </td>
                <td className="py-4">
                  <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${statusBadge[t.fulfillmentStatus]}`}>
                    {statusLabel[t.fulfillmentStatus] || t.fulfillmentStatus}
                  </span>
                </td>
                <td className="py-4">
                  {canManage ? (
                    <div className="flex justify-center gap-2">
                      <a href={`tel:${t.customerId}`} className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100" title="Llamar"><Phone size={14} /></a>
                      
                      {t.fulfillmentStatus === "completed" && (
                        <button onClick={() => handleOpenDetails(t)} className="px-3 py-1 bg-gray-800 text-white rounded text-[11px] font-bold hover:bg-black transition-transform active:scale-95">DETALLES</button>
                      )}
                      
                      {t.fulfillmentStatus !== "completed" && (
                        <button onClick={() => handleOpenDetails(t)} className="px-3 py-1 bg-green-600 text-white rounded text-[11px] font-bold hover:bg-green-700 flex items-center gap-1"><CheckCircle size={12} /> REVISAR</button>
                      )}

                      <button 
                        onClick={() => prepareCancel(t._id, t.items.map(i => ({productId: String(i.productId), productName: i.productName})), true)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
                        title="Cancelar Ticket Completo"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 italic">Vista limitada</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <button
      onClick={() => setOpenCreate(true)}
      className="fixed bottom-8 right-8 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-90 z-40 flex items-center justify-center"
      title="Nuevo Ticket"
      >
        <Plus size={28} strokeWidth={3} />
      </button>

      {/* --- MODALES --- */}
      <ConfirmCancelModal 
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        onConfirm={handleExecuteCancel}
        loading={cancelLoading}
        title={confirmData?.isFull ? "Cancelar Ticket Completo" : "Eliminar Medicamento"}
        message={confirmData?.isFull 
          ? "¿Estás seguro de cancelar todo este ticket? El stock será liberado automáticamente." 
          : "¿Deseas eliminar este medicamento del pedido?"}
        itemsNames={confirmData?.names}
      />

      <ModalAtender open={openModal} onClose={() => setOpenModal(false)} ticket={activeTicket} onConfirm={handleConfirmAtender} />
      <AgendaModal open={openAgenda} onClose={() => setOpenAgenda(false)} tickets={tickets} />
      <CreateTicketModal open={openCreate} onClose={() => setOpenCreate(false)} />
    </main>
  )
}