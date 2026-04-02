import { Bell, DownloadCloud, Search, Phone, CheckCircle } from "lucide-react"

const stats = [
  { label: "TICKETS PENDIENTES", value: 12, color: "border-blue-200" },
  { label: "EN ATENCIÓN", value: 4, color: "border-yellow-200" },
  { label: "COMPLETADOS HOY", value: 8, color: "border-green-200" },
]

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

export default function Tickets() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          {/* Campanita arriba a la izquierda */}
          <button
            aria-label="Notificaciones"
            className="p-2 rounded-md bg-white shadow-sm hover:bg-gray-100"
          >
            <Bell size={20} className="text-gray-600" />
          </button>

          <div>
            <h2 className="text-2xl font-bold text-gray-800">Tickets de hoy — Sede Centro</h2>
            <p className="text-sm text-gray-500">Lunes, 24 de Mayo · Turno Mañana</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              placeholder="Buscar ticket o paciente..."
              className="pl-10 pr-4 py-2 rounded-full border bg-white text-sm w-72"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-md shadow-sm">
            <DownloadCloud size={16} />
            Descargar Reporte
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white p-4 rounded-md shadow-sm border-l-4 ${s.color}`}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table / Queue */}
      <section className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Cola de Atención Activa</h3>
          <div className="text-sm text-gray-400">• Pendiente &nbsp; • En Proceso</div>
        </div>

        <table className="w-full table-auto text-left text-sm">
          <thead>
            <tr className="text-xs text-gray-500 border-b">
              <th className="py-3 w-28"># TURNO</th>
              <th className="py-3">PACIENTE</th>
              <th className="py-3">MEDICAMENTOS SOLICITADOS</th>
              <th className="py-3">DISPONIBILIDAD</th>
              <th className="py-3">ESTADO</th>
              <th className="py-3">ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {sampleTickets.map((t) => (
              <tr key={t.turno} className="border-b last:border-b-0">
                <td className="py-4 text-blue-600 font-semibold">{t.turno}</td>
                <td className="py-4">
                  <div className="font-medium">{t.paciente}</div>
                  <div className="text-xs text-gray-400">ID: 4.392.102</div>
                </td>
                <td className="py-4">
                  <div className="flex flex-col gap-1">
                    {t.medicamentos.map((m) => (
                      <span key={m} className="inline-block px-3 py-1 bg-gray-100 text-xs rounded-full">
                        {m}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4">
                  <span className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs rounded-md">{t.disponibilidad}</span>
                </td>
                <td className="py-4">
                  <span className={`text-xs px-3 py-1 rounded-full ${t.estado === "PENDIENTE" ? "bg-red-100 text-red-600" : t.estado === "EN ATENCIÓN" ? "bg-sky-100 text-sky-600" : "bg-green-100 text-green-600"}`}>
                    {t.estado}
                  </span>
                </td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center gap-2">
                      <Phone size={14} /> Llamar
                    </button>
                    <button className="px-3 py-1 bg-gray-100 rounded-md text-sm flex items-center gap-2">
                      <CheckCircle size={14} /> Atender
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 text-sm text-gray-500">Mostrando 4 de 24 tickets registrados hoy</div>
      </section>
    </main>
  )
}
