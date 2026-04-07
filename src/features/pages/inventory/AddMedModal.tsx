import { useState } from "react"
import api from "../../api/axios.instance"
import { useEffect } from "react"

type NewMed = {
  name: string
  description: string
  category: string
  status: string
  dose: string
  presentation: string
  stock: number
  minStock: number
  repositionDate: string
  price: number
  laboratory: string
}

type Props = {
  open: boolean
  setOpen: (v: boolean) => void
  onCreated: (med: any) => void
}

const initialForm: NewMed = {
  name: "",
  description: "",
  category: "",
  status: "active",
  dose: "",
  presentation: "",
  stock: 0,
  minStock: 0,
  repositionDate: "",
  price: 0,
  laboratory: "",
}

const mapStatus = (status: string) => {
  switch (status) {
    case "active": return "DISPONIBLE"
    case "low-stock": return "BAJO STOCK"
    case "out-of-stock": return "AGOTADO"
    default: return "DISPONIBLE"
  }
}


export default function AddMedModal({ open, setOpen, onCreated }: Props) {
  const [form, setForm] = useState<NewMed>(initialForm)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof NewMed, string>>>({})

  useEffect(() => {
  let autoStatus = "active"
  if (form.stock === 0) {
    autoStatus = "out-of-stock"
  } else if (form.stock < form.minStock) {
    autoStatus = "low-stock"
  }
  setForm((prev) => ({ ...prev, status: autoStatus }))
}, [form.stock, form.minStock])

  if (!open) return null

  const validate = () => {
    const newErrors: Partial<Record<keyof NewMed, string>> = {}
    if (!form.name.trim()) newErrors.name = "El nombre es obligatorio"
    if (!form.laboratory.trim()) newErrors.laboratory = "El laboratorio es obligatorio"
    if (!form.presentation.trim()) newErrors.presentation = "La presentación es obligatoria"
    if (!form.dose.trim()) newErrors.dose = "La dosis es obligatoria"
    if (form.price < 0) newErrors.price = "El precio no puede ser negativo"
    if (form.stock < 0) newErrors.stock = "El stock no puede ser negativo"
    if (form.minStock < 0) newErrors.minStock = "El stock mínimo no puede ser negativo"
    return newErrors
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: name === "stock" || name === "minStock" || name === "price"
        ? Number(value)
        : value,
    }))
    if (errors[name as keyof NewMed]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async () => {
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...form,
        repositionDate: form.repositionDate || null,
      }
      const res = await api.post("/medications", payload)
      const created = res.data

      onCreated({
        name: created.name,
        brand: created.laboratory,
        presentation: created.presentation,
        stock: created.stock,
        min: created.minStock,
        status: mapStatus(created.status),
        eta: created.repositionDate
          ? new Date(created.repositionDate).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "long",
            })
          : "--",
      })

      setForm(initialForm)
      setOpen(false)
    } catch (err) {
      console.error("Error al crear medicamento:", err)
      alert("No se pudo guardar el medicamento.")
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setForm(initialForm)
    setErrors({})
    setOpen(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-emerald-50 dark:bg-emerald-900/30">
              <span
                className="material-symbols-outlined text-emerald-600 dark:text-emerald-400"
                style={{ fontSize: "20px", fontVariationSettings: "'FILL' 1" }}
              >
                medication
              </span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                Añadir Medicamento
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Complete los campos para registrar un nuevo medicamento
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              close
            </span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Nombre */}
            <Field label="Nombre *" error={errors.name}>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ej: Acetaminofén 500mg"
                className={inputCls(!!errors.name)}
              />
            </Field>

            {/* Laboratorio */}
            <Field label="Laboratorio *" error={errors.laboratory}>
              <input
                name="laboratory"
                value={form.laboratory}
                onChange={handleChange}
                placeholder="Ej: Genfar"
                className={inputCls(!!errors.laboratory)}
              />
            </Field>

            {/* Categoría */}
            <Field label="Categoría">
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Ej: Analgésicos"
                className={inputCls(false)}
              />
            </Field>

            {/* Dosis */}
            <Field label="Dosis *" error={errors.dose}>
              <input
                name="dose"
                value={form.dose}
                onChange={handleChange}
                placeholder="Ej: 500mg"
                className={inputCls(!!errors.dose)}
              />
            </Field>

            {/* Presentación */}
            <Field label="Presentación *" error={errors.presentation}>
              <input
                name="presentation"
                value={form.presentation}
                onChange={handleChange}
                placeholder="Ej: Tabletas, Jarabe"
                className={inputCls(!!errors.presentation)}
              />
            </Field>

            {/* Estado */}
            <Field label="Estado">
              <div className={`${inputCls(false)} flex items-center gap-2 cursor-default`}>
                <span className={`w-2 h-2 rounded-full ${
                  form.status === "active"       ? "bg-emerald-500" :
                  form.status === "low-stock"    ? "bg-amber-500"   :
                                                  "bg-red-500"
                }`} />
                <span className="text-sm">
                  {form.status === "active"    ? "Disponible" :
                  form.status === "low-stock" ? "Bajo stock" :
                                                "Agotado"}
                </span>
              </div>
            </Field>

            {/* Stock Actual */}
            <Field label="Stock Actual *" error={errors.stock}>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                min={0}
                className={inputCls(!!errors.stock)}
              />
            </Field>

            {/* Stock Mínimo */}
            <Field label="Stock Mínimo *" error={errors.minStock}>
              <input
                type="number"
                name="minStock"
                value={form.minStock}
                onChange={handleChange}
                min={0}
                className={inputCls(!!errors.minStock)}
              />
            </Field>

            {/* Precio */}
            <Field label="Precio (COP)" error={errors.price}>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                min={0}
                placeholder="Ej: 1200"
                className={inputCls(!!errors.price)}
              />
            </Field>

            {/* Fecha de reposición */}
            <Field label="Fecha de Reposición">
              <input
                type="date"
                name="repositionDate"
                value={form.repositionDate}
                onChange={handleChange}
                className={inputCls(false)}
              />
            </Field>

            {/* Descripción — full width */}
            <div className="sm:col-span-2">
              <Field label="Descripción">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Descripción del medicamento..."
                  className={`${inputCls(false)} resize-none`}
                />
              </Field>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <span
                className="material-symbols-outlined animate-spin"
                style={{ fontSize: "16px" }}
              >
                progress_activity
              </span>
            )}
            {loading ? "Guardando..." : "Guardar Medicamento"}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── helpers ─── */

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
        {label}
      </label>
      {children}
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}

const inputCls = (hasError: boolean) =>
  `w-full px-3 py-2 text-sm rounded-lg border ${
    hasError
      ? "border-red-400 focus:ring-red-300"
      : "border-gray-200 dark:border-gray-700 focus:ring-blue-300"
  } bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 transition`