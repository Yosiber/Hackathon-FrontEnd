import { X } from "lucide-react";

export interface Ticket {
  turno: string;
  paciente: string;
  medicamentos: string[];
  disponibilidad: string;
  estado: string;
}

interface ModalAtenderProps {
  open: boolean;
  onClose: () => void;
  ticket: Ticket | null;
  onConfirm: (ticket: Ticket) => void;
}

export default function ModalAtender({
  open,
  onClose,
  ticket,
  onConfirm,
}: ModalAtenderProps) {
  if (!open || !ticket) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-xl shadow-lg animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
            Atender paciente
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Turno:</span> {ticket.turno}
          </p>

          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Paciente:</span> {ticket.paciente}
          </p>

          <div>
            <p className="font-semibold text-gray-700 dark:text-gray-300">
              Medicamentos:
            </p>
            <ul className="list-disc ml-6 text-gray-600 dark:text-gray-400">
              {ticket.medicamentos.map((m) => (
                <li key={m}>{m}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Confirmas que este paciente ha comenzado la atención?
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              onConfirm(ticket);
              onClose();
            }}
            className="px-4 py-2 text-sm rounded-md bg-green-600 hover:bg-green-700 text-white"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
}