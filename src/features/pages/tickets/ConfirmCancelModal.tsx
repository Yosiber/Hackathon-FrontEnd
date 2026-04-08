import { AlertTriangle, X } from "lucide-react"

interface Props {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  itemsNames?: string[]
  loading?: boolean
}

export default function ConfirmCancelModal({ 
  open, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  itemsNames, 
  loading 
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" 
        onClick={onClose} 
      />

      <div className="relative z-10 w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header con icono de advertencia */}
        <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-red-50/50 dark:bg-red-900/10">
          <div className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
            <AlertTriangle size={24} />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {message}
          </p>

          {itemsNames && itemsNames.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 border border-gray-100 dark:border-gray-700">
              <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Elementos afectados:</p>
              <ul className="space-y-1">
                {itemsNames.map((name, i) => (
                  <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/30 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
          >
            Volver
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-6 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg shadow-red-200 dark:shadow-none transition-all active:scale-95 flex items-center gap-2"
          >
            {loading ? "Procesando..." : "Confirmar Eliminación"}
          </button>
        </div>
      </div>
    </div>
  )
}