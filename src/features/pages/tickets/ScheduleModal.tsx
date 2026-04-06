import { Dialog } from "@headlessui/react";
import { X } from "lucide-react";
import type { Ticket } from "./AttendModal";

interface Props {
  open: boolean;
  onClose: () => void;
  tickets: Ticket[];
}

export default function AgendaModal({ open, onClose, tickets }: Props) {
  const upcomingTickets = tickets
    .filter(t => t.estado !== "COMPLETADO")
    .slice(0, 10);

  return (
    <Dialog open={open} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white dark:bg-gray-800 w-full max-w-md rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Agenda Completa
            </Dialog.Title>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
              <X size={20} />
            </button>
          </div>

          {upcomingTickets.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">No hay turnos pendientes.</p>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {upcomingTickets.map((t) => (
                <li key={t.turno} className="flex justify-between py-2">
                  <div>
                    <span className="font-semibold text-gray-800 dark:text-gray-100">{t.turno}</span> 
                    <span className="text-gray-500 dark:text-gray-400">•</span>
                    <span className="text-gray-600 dark:text-gray-300">{t.paciente}</span>
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {t.hora || "—"}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}