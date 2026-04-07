import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { BadgeCheck } from "lucide-react"
import api from "../../api/axios.instance"
import { receiveShipment } from "../../api/requests/medication.request"

type Med = {
  id: string
  name: string
  brand: string
  presentation: string
  stock: number
  min: number
  status: string
  incomingStock: number
  reservedIncomingStock: number
  eta: string
}

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
  med: Med | null
  onSubmit: (cantidad: number) => void
}

export default function ArrivalModal({ open, setOpen, med, onSubmit }: Props) {
  const [loading, setLoading] = useState(false)
  // const [error, setError] = useState("")
  
  if (!med || med.incomingStock <= 0) return null;

  // const validate = () => {
  //   const value = Number(amount)
  //   if (!value || value <= 0) {
  //     setError("La cantidad debe ser un número positivo mayor a 0")
  //     return false
  //   }
  //   setError("")
  //   return true
  // }

  const handleSubmit = async (id: string) => {
    try {
      await receiveShipment(id);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>

        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Content
            className="
              w-full max-w-lg rounded-lg bg-white dark:bg-gray-800 shadow-xl
              p-6 outline-none
            "
          >
            <div className="flex items-start gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500/10">
                <BadgeCheck className="w-6 h-6 text-green-400" />
              </div>

              <div>
                <Dialog.Title className="text-lg font-semibold dark:text-white">
                  Registrar llegada — {med.name}
                </Dialog.Title>

                <Dialog.Description className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                  Desea confirmar la llegada de este lote.<br/>
                  Total: {med.incomingStock}<br/>
                  Cantidad comprometida de lote: {med.reservedIncomingStock}<br/>
                  Nuevo inventario: {med.incomingStock - med.reservedIncomingStock + med.stock} 
                </Dialog.Description>
              </div>
            </div>
{/* 
            <div className="mt-4">
              <label className="text-sm text-gray-600 dark:text-gray-300">Cantidad recibida</label>
              <input
                type="number"
                placeholder="Ej: 150"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 mt-1 rounded-md bg-gray-100 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                min={1}
              />
              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div> */}

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close className="px-4 py-2 rounded-md bg-gray-200">
                Cancelar
              </Dialog.Close>

              <button
                onClick={() => handleSubmit(med.id)}
                disabled={loading}
                className="bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <span
                    className="material-symbols-outlined animate-spin"
                    style={{ fontSize: "16px" }}
                  >
                    progress_activity
                  </span>
                )}
                {loading ? "Guardando..." : "Aceptar"}
              </button>
            </div>
          </Dialog.Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}