import { useState } from "react"
import * as Dialog from "@radix-ui/react-dialog"
import { BadgeCheck } from "lucide-react"
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
  
  if (!med || med.incomingStock <= 0) return null;

  const handleSubmit = async (id: string) => {
      setLoading(true);
      try {
        // 1. Ejecutar la petición al backend
        await receiveShipment(id);
        
        // 2. Ejecutar el callback del padre (que es fetchMeds)
        onSubmit(med.incomingStock); 
        
        // 3. Cerrar el modal automáticamente
        setOpen(false);
      } catch (error) {
        console.error("Error al recibir el lote:", error);
        alert("Hubo un error al procesar la llegada física.");
      } finally {
        setLoading(false);
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