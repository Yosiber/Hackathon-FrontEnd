import { useState } from "react"
import { updateMedication } from "../../api/requests/medication.request"
import { z } from "zod";

export const scheduleArrivalSchema = z.object({
  incomingStock: z.number().min(1, "La cantidad debe ser al menos 1"),
  repositionDate: z.string().refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate > today;
  }, "La fecha debe ser posterior a hoy"),
});

type Props = {
  open: boolean
  setOpen: (v: boolean) => void
  med: any // El medicamento seleccionado
  onUpdated: () => void
}

export default function ScheduleArrivalModal({ open, setOpen, med, onUpdated }: Props) {
  const [form, setForm] = useState({
    incomingStock: 0,
    repositionDate: ""
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<string, string>>>({})

  if (!open || !med) return null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "incomingStock" ? Number(value) : value,
    }))
    // Limpiar error al escribir
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }))
  }

  const handleSubmit = async () => {
    // Validación con Zod
    const result = scheduleArrivalSchema.safeParse(form)
    
    if (!result.success) {
      const formattedErrors: Record<string, string> = {}
      result.error.issues.forEach((issue) => {
        const key = String(issue.path[0]) 
        formattedErrors[key] = issue.message
      })
      setErrors(formattedErrors)
      return
    }

    setLoading(true)
    try {
      await updateMedication(med.id, {
        incomingStock: form.incomingStock,
        repositionDate: new Date(form.repositionDate)
      })
      onUpdated()
      handleClose()
    } catch (err) {
      console.error("Error al programar llegada:", err)
      alert("Error al actualizar el stock entrante.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm({ incomingStock: 0, repositionDate: "" })
    setErrors({})
    setOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-blue-50 dark:bg-blue-900/30">
              <span
                className="material-symbols-outlined text-blue-600 dark:text-blue-400"
                style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
              >
                local_shipping
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Programar Llegada
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {med.name} — {med.brand}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex flex-col gap-4">
            <Field label="Cantidad que llegará *" error={errors.incomingStock}>
              <input
                type="number"
                name="incomingStock"
                value={form.incomingStock}
                onChange={handleChange}
                min={1}
                placeholder="Ej: 100"
                className={inputCls(!!errors.incomingStock)}
              />
            </Field>

            <Field label="Fecha estimada de llegada *" error={errors.repositionDate}>
              <input
                type="date"
                name="repositionDate"
                value={form.repositionDate}
                onChange={handleChange}
                className={inputCls(!!errors.repositionDate)}
              />
            </Field>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 flex items-center gap-2"
          >
            {loading && (
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: "16px" }}>
                progress_activity
              </span>
            )}
            {loading ? "Actualizando..." : "Registrar Pedido"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* Reutilizando tus mismos helpers para mantener consistencia visual */
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  )
}

const inputCls = (hasError: boolean) =>
  `w-full px-3 py-2 text-sm rounded-lg border ${
    hasError
      ? "border-red-400 focus:ring-red-300"
      : "border-gray-200 dark:border-gray-700 focus:ring-blue-300"
  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 transition`