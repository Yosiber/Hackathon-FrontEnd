import { Bell, DownloadCloud, Search, Phone, CheckCircle, AlertTriangle, Truck } from "lucide-react"
import { useEffect } from "react";
import { Link } from "react-router-dom"
import { useSearch } from "../context/SearchContext";
import { useState } from "react";
import ModalAtender from "./AttendModal";
import type { Ticket } from "./AttendModal";



const sampleTickets = [
  {
    turno: "A-101",
    paciente: "Carlos Gomez",
    medicamentos: ["Metformina 850mg", "Ibuprofeno 400mg", "Insulina NPH"],
    disponibilidad: "2 de 3 disponibles",
    estado: "PENDIENTE",
  },
  {
    turno: "B-202",
    paciente: "Ana Rosa",
    medicamentos: ["Amoxicilina 500mg", "Paracetamol 1g"],
    disponibilidad: "2 de 2 disponibles",
    estado: "EN ATENCIÓN",
  },
  {
    turno: "C-085",
    paciente: "Luis Mendez",
    medicamentos: ["Loratadina 10mg"],
    disponibilidad: "1 de 1 disponible",
    estado: "COMPLETADO",
  },
]

const contarTicketsPorEstado = (tickets: Ticket[]) => {
  return {
    PENDIENTE: tickets.filter(t => t.estado === "PENDIENTE").length,
    "EN ATENCIÓN": tickets.filter(t => t.estado === "EN ATENCIÓN").length,
    COMPLETADO: tickets.filter(t => t.estado === "COMPLETADO").length,
  };
};

export default function Tickets() {
  
    const { search } = useSearch();
    const { setPlaceholder } = useSearch();
    const [tickets, setTickets] = useState(sampleTickets);
    const [openModal, setOpenModal] = useState(false);
    const [activeTicket, setActiveTicket] = useState<Ticket | null>(null);
    const estadoCounts = contarTicketsPorEstado(tickets);
    const [mensaje, setMensaje] = useState("");


    const stats = [
      { label: "TICKETS PENDIENTES", value: estadoCounts.PENDIENTE, color: "border-blue-400" },
      { label: "EN ATENCIÓN", value: estadoCounts["EN ATENCIÓN"], color: "border-yellow-400" },
      { label: "COMPLETADOS HOY", value: estadoCounts.COMPLETADO, color: "border-green-400" },
    ];

      const filteredTickets = tickets.filter((t) =>
      t.turno.toLowerCase().includes(search.toLowerCase()) ||
      t.paciente.toLowerCase().includes(search.toLowerCase())
    );
    
    useEffect(() => {
     setPlaceholder("Buscar turno o paciente...")
    }, [])

    const handleConfirmAtender = (ticket: Ticket) => {
  setTickets((prev) =>
    prev.map((t) =>
      t.turno === ticket.turno
        ? { ...t, estado: "EN ATENCIÓN" }
        : t
    )
    )
  }

  

  const handleCompletar = (ticket: Ticket) => {
  const match = new RegExp(/(\d+)\s+de\s+(\d+)/).exec(ticket.disponibilidad);
  if (!match) return; 

  const disponibles = Number.parseInt(match[1], 10);
  const requeridos = Number.parseInt(match[2], 10);

  if (disponibles === requeridos) {
    
    setTickets(prev =>
      prev.map(t =>
        t.turno === ticket.turno
          ? { ...t, estado: "COMPLETADO" }
          : t
      )
    );
    } else {
      setMensaje("No se puede completar: no todos los medicamentos están disponibles.");
          setTimeout(() => setMensaje(""), 3000);
        }
    }
  
  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button
            aria-label="Notificaciones"
            className="p-2 rounded-md bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Bell size={20} className="text-gray-600 dark:text-gray-200" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
              Tickets de hoy — Sede Centro
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lunes, 24 de Mayo · Turno Mañana
            </p>
          </div>
        </div>
        
        {mensaje && (
          <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
            {mensaje}
          </div>
        )}
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700">
            <DownloadCloud size={16} />
            Descargar Reporte
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border-l-4 ${s.color}`}
          >
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table / Queue */}
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
              <th className="py-3">ACCIÓN</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-center">
            {filteredTickets.map((t) => (
              <tr
                key={t.turno}
                className="border-b last:border-b-0 border-gray-100 dark:border-gray-700"
              >
                <td className="py-4 text-blue-600 dark:text-blue-400 font-semibold">{t.turno}</td>
                <td className="py-4">
                  <div className="font-medium text-gray-800 dark:text-gray-100">{t.paciente}</div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">ID: 4.392.102</div>
                </td>
                <td className="py-4">
                  <div className="flex flex-col gap-1">
                    {t.medicamentos.map((m) => (
                      <span
                        key={m}
                        className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-xs rounded-full"
                      >
                        {m}
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
                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      t.estado === "PENDIENTE"
                        ? "bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-400"
                        : t.estado === "EN ATENCIÓN"
                        ? "bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400"
                        : "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400"
                    }`}
                  >
                    {t.estado}
                  </span>
                </td>
               <td className="py-4">
                  <div className="flex items-center gap-2">

                    {/* LLAMAR */}
                    <a
                      href={`tel:+573001234567`}
                      className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center gap-2"
                    >
                      <Phone size={14} /> Llamar
                    </a>
                  </div>
                </td>
                <td>
                  <button
                      onClick={() => {
                        setActiveTicket(t);
                        setOpenModal(true);
                      }}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md text-sm flex items-center gap-2"
                    >
                      <CheckCircle size={14} /> Atender
                    </button>
                </td>
                <td>
                  {t.estado === "EN ATENCIÓN" && (
                    <button
                      onClick={() => handleCompletar(t)}
                      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm flex items-center gap-2"
                    >
                      <CheckCircle size={14} /> Completar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          Mostrando 4 de 24 tickets registrados hoy
        </div>
      </section>

      {/* Bottom section */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Inventory alerts */}
        <div className="md:col-span-2 space-y-4">
          <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
            Alertas de Inventario Crítico
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex gap-4 items-start bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                <AlertTriangle size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 dark:text-gray-100">Insulina NPH</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Quedan solo 5 unidades en stock.
                </div>
                <div className="mt-3">
      
                  <Link to="/inventory" className="text-sm text-blue-600 dark:text-blue-400 font-medium cursor-pointer">
                    VER INVENTARIO
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-start bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                <Truck size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 dark:text-gray-100">Metformina 850mg</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Pedido en camino (ETA: 14:00h).
                </div>
                <div className="mt-3">
                  <a className="text-sm text-blue-600 dark:text-blue-400 font-medium cursor-pointer">
                    VER TRACKING
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming shifts */}
        <aside className="bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-700 p-4 rounded-xl shadow-sm">
          <h4 className="font-semibold text-gray-700 dark:text-gray-100">Próximos Turnos</h4>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="text-xs bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-full font-medium">
                  URGENTE
                </div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">A-104 • Rosa Mendez</div>
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">10:45</div>
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                  REGULAR
                </div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">B-205 • Pedro Pablo</div>
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">10:52</div>
            </div>

            <div className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                  REGULAR
                </div>
                <div className="font-semibold text-gray-800 dark:text-gray-100">B-206 • Julia Sans</div>
              </div>
              <div className="text-sm text-gray-400 dark:text-gray-500">11:05</div>
            </div>
          </div>

          <div className="mt-4">
            <button className="w-full text-sm py-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              Ver Agenda Completa
            </button>
          </div>
        </aside>
      </section>

       <ModalAtender
          open={openModal}
          onClose={() => setOpenModal(false)}
          ticket={activeTicket}
          onConfirm={handleConfirmAtender}
        />
    </main>
  )

}