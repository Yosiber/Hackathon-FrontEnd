import { useState, useEffect } from "react"
import { X, Plus, Trash2, ShoppingBag } from "lucide-react"
import { useAuth } from "../../context/AuthContext"
import { getMedications } from "../../api/requests/medication.request"
import { createTicket } from "../../api/requests/ticket.request" // Asegúrate de tener esta función en tus requests

// ---------- tipos locales ----------
type MedItem = {
  productId: string
  productName: string
  quantity: number
}

interface Props {
  open: boolean
  onClose: () => void
}

export default function CreateTicketModal({ open, onClose }: Props) {
  const { authUser } = useAuth()
  const [availableMeds, setAvailableMeds] = useState<{ _id: string, name: string }[]>([])
  const [items, setItems] = useState<MedItem[]>([{ productId: "", productName: "", quantity: 1 }])
  const [observations, setObservations] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // 1. Cargar medicamentos reales al abrir el modal
  useEffect(() => {
    if (open) {
      const fetchMeds = async () => {
        try {
          const response = await getMedications({ limit: 1000 })
          // Ajusta esto según si tu API devuelve .items o el array directo
          setAvailableMeds(response.items || response) 
        } catch (error) {
          console.error("Error cargando medicamentos:", error)
        }
      }
      fetchMeds()
    }
  }, [open])

  if (!open) return null

  // ── helpers ──
  const addItem = () =>
    setItems(prev => [...prev, { productId: "", productName: "", quantity: 1 }])

  const removeItem = (idx: number) =>
    setItems(prev => prev.filter((_, i) => i !== idx))

  const updateItem = (idx: number, field: keyof MedItem, value: string | number) => {
    setItems(prev =>
      prev.map((item, i) => {
        if (i !== idx) return item
        if (field === "productId") {
          const found = availableMeds.find(m => m._id === value)
          return { ...item, productId: String(value), productName: found?.name ?? "" }
        }
        return { ...item, [field]: value }
      })
    )
  }

  const isValid = items.every(i => i.productId && i.quantity >= 1)

  const handleSubmit = async () => {
    if (!isValid || !authUser) return
    
    setLoading(true)
    
    // Mapeo exacto al DTO de tu backend
    const bodyParaBackend = {
      customerId: authUser._id,
      products: items.map(item => ({
        productId: item.productId,
        qty: item.quantity
      })),
      observations: observations ? [observations] : []
    }

    try {
      await createTicket(bodyParaBackend as any) 
      
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
        setItems([{ productId: "", productName: "", quantity: 1 }])
        setObservations("")
        onClose()
      }, 1500)
    } catch (err) {
      console.error("Error al crear ticket:", err)
      alert("No se pudo crear el ticket. Verifica el stock o tu conexión.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 dark:text-gray-100">Solicitar Medicamentos</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tu solicitud generará un ticket en cola</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Medicamentos solicitados</label>

            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                <select
                  value={item.productId}
                  onChange={e => updateItem(idx, "productId", e.target.value)}
                  className="flex-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Seleccionar medicamento…</option>
                  {availableMeds.map(m => (
                    <option key={m._id} value={m._id}>{m.name}</option>
                  ))}
                </select>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateItem(idx, "quantity", Math.max(1, item.quantity - 1))}
                    className="w-7 h-7 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 font-bold text-sm"
                  > − </button>
                  <span className="w-8 text-center text-sm font-semibold text-gray-800 dark:text-gray-100">{item.quantity}</span>
                  <button
                    onClick={() => updateItem(idx, "quantity", item.quantity + 1)}
                    className="w-7 h-7 rounded-md bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 font-bold text-sm"
                  > + </button>
                </div>

                {items.length > 1 && (
                  <button onClick={() => removeItem(idx)} className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addItem}
              className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-500 dark:text-gray-400 hover:border-blue-400 hover:text-blue-500 transition-colors"
            >
              <Plus size={15} /> Añadir otro medicamento
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Observaciones</label>
            <textarea
              rows={2}
              value={observations}
              onChange={e => setObservations(e.target.value)}
              placeholder="Ej: Entrega en recepción..."
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid || loading || success}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
              success ? "bg-green-600 text-white" : isValid ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            {success ? "✓ Enviado" : loading ? "Procesando..." : "Confirmar Solicitud"}
          </button>
        </div>
      </div>
    </div>
  )
}