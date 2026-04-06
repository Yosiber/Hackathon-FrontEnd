import { useState, useEffect } from "react";
import {
  AlertTriangle, PackageCheck, ClipboardCheck,
  Clock, CheckCheck, Trash2, Plus, X, Check, InboxIcon,
} from "lucide-react";
import { useSearch } from "../../context/SearchContext";
import { useNotifications, type TipoNotificacion, type Notificacion } from "../../context/NotificationsContext";

export type FiltroNotificacion = "todas" | TipoNotificacion | "no_leidas";

const TIPO_CONFIG: Record<TipoNotificacion, {
  label: string; icon: React.ReactNode;
  badgeClass: string; borderClass: string; iconBg: string; iconColor: string;
}> = {
  stock: {
    label: "Stock crítico", icon: <AlertTriangle size={16} />,
    badgeClass: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
    borderClass: "border-l-red-500", iconBg: "bg-red-50 dark:bg-red-900/30", iconColor: "text-red-600 dark:text-red-400",
  },
  llegada: {
    label: "Llegada med.", icon: <PackageCheck size={16} />,
    badgeClass: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    borderClass: "border-l-green-500", iconBg: "bg-green-50 dark:bg-green-900/30", iconColor: "text-green-600 dark:text-green-400",
  },
  ticket: {
    label: "Ticket", icon: <ClipboardCheck size={16} />,
    badgeClass: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
    borderClass: "border-l-blue-500", iconBg: "bg-blue-50 dark:bg-blue-900/30", iconColor: "text-blue-600 dark:text-blue-400",
  },
  turno: {
    label: "Turno próximo", icon: <Clock size={16} />,
    badgeClass: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    borderClass: "border-l-amber-500", iconBg: "bg-amber-50 dark:bg-amber-900/30", iconColor: "text-amber-600 dark:text-amber-400",
  },
};

const FILTROS: { key: FiltroNotificacion; label: string }[] = [
  { key: "todas", label: "Todas" },
  { key: "stock", label: "Stock crítico" },
  { key: "llegada", label: "Llegada med." },
  { key: "ticket", label: "Ticket" },
  { key: "turno", label: "Turno próximo" },
  { key: "no_leidas", label: "No leídas" },
];

function ModalCrear({ open, onClose, onCreate }: {
  open: boolean; onClose: () => void;
  onCreate: (n: Omit<Notificacion, "id" | "tiempo" | "leida">) => void;
}) {
  const [tipo, setTipo] = useState<TipoNotificacion>("stock");
  const [destinatario, setDestinatario] = useState("");
  const [mensaje, setMensaje] = useState("");

  if (!open) return null;

  const handleSubmit = () => {
    if (!destinatario.trim() || !mensaje.trim()) return;
    onCreate({ tipo, destinatario, mensaje });
    setDestinatario(""); setMensaje(""); setTipo("stock");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Nueva notificación</h3>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"><X size={16} /></button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Tipo</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoNotificacion)}
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100">
              <option value="stock">Alerta de stock crítico</option>
              <option value="llegada">Llegada de medicamento</option>
              <option value="ticket">Ticket atendido / completado</option>
              <option value="turno">Recordatorio de turno</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Destinatario</label>
            <input type="text" value={destinatario} onChange={(e) => setDestinatario(e.target.value)}
              placeholder="Ej: Carlos Gómez — Turno A-101"
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1.5">Mensaje</label>
            <textarea value={mensaje} onChange={(e) => setMensaje(e.target.value)}
              placeholder="Describe el detalle de la notificación..." rows={3}
              className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-sm text-gray-800 dark:text-gray-100 placeholder:text-gray-400 resize-none" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-md text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Cancelar</button>
          <button onClick={handleSubmit} disabled={!destinatario.trim() || !mensaje.trim()}
            className="px-4 py-2 rounded-md text-sm bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed">
            Crear notificación
          </button>
        </div>
      </div>
    </div>
  );
}

function NotifCard({ notif, onMarkRead, onDelete }: {
  notif: Notificacion; onMarkRead: (id: number) => void; onDelete: (id: number) => void;
}) {
  const cfg = TIPO_CONFIG[notif.tipo];
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 flex items-start gap-4 transition-opacity
      ${notif.leida ? "opacity-60" : `border-l-4 ${cfg.borderClass}`}`}>
      <div className={`p-2.5 rounded-lg flex-shrink-0 ${cfg.iconBg} ${cfg.iconColor}`}>{cfg.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-1">
          <span className="text-sm font-medium text-gray-800 dark:text-gray-100">{notif.destinatario}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${cfg.badgeClass}`}>{cfg.label}</span>
          {!notif.leida && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed mb-1">{notif.mensaje}</p>
        <span className="text-xs text-gray-400 dark:text-gray-500">{notif.tiempo}</span>
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {!notif.leida && (
          <button onClick={() => onMarkRead(notif.id)} title="Marcar como leída"
            className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400">
            <Check size={13} />
          </button>
        )}
        <button onClick={() => onDelete(notif.id)} title="Eliminar"
          className="p-1.5 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 dark:hover:text-red-400">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default function Notifications() {
  const { search, setPlaceholder } = useSearch();
  const { notificaciones, noLeidas, markRead, markAllRead, deleteNotif, addNotif } = useNotifications();
  const [filtro, setFiltro] = useState<FiltroNotificacion>("todas");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => { setPlaceholder("Buscar notificación o destinatario..."); }, []);

  const filtradas = notificaciones.filter((n) => {
    const matchSearch = n.destinatario.toLowerCase().includes(search.toLowerCase()) || n.mensaje.toLowerCase().includes(search.toLowerCase());
    const matchFiltro = filtro === "todas" ? true : filtro === "no_leidas" ? !n.leida : n.tipo === filtro;
    return matchSearch && matchFiltro;
  });

  const stats = [
    { label: "TOTAL", value: notificaciones.length, color: "border-gray-300 dark:border-gray-600" },
    { label: "NO LEÍDAS", value: noLeidas, color: "border-blue-400" },
    { label: "STOCK CRÍTICO", value: notificaciones.filter((n) => n.tipo === "stock").length, color: "border-red-400" },
    { label: "TICKETS / LLEGADAS", value: notificaciones.filter((n) => n.tipo === "ticket" || n.tipo === "llegada").length, color: "border-green-400" },
  ];

  return (
    <main className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Centro de notificaciones</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Alertas para pacientes, cuidadores y personal de farmacia</p>
        </div>
        <div className="flex items-center gap-3">
          {noLeidas > 0 && (
            <button onClick={markAllRead}
              className="flex items-center gap-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-sm">
              <CheckCheck size={15} /> Marcar todas como leídas
            </button>
          )}
          <button onClick={() => setOpenModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm text-sm font-medium">
            <Plus size={15} /> Nueva notificación
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className={`bg-white dark:bg-gray-800 p-4 rounded-md shadow-sm border-l-4 ${s.color}`}>
            <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {FILTROS.map((f) => (
          <button key={f.key} onClick={() => setFiltro(f.key)}
            className={`px-4 py-1.5 rounded-full text-xs border transition-colors ${filtro === f.key
              ? "bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 border-transparent font-medium"
              : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
            {f.label}
            {f.key === "no_leidas" && noLeidas > 0 && (
              <span className="ml-1.5 bg-blue-500 text-white rounded-full px-1.5 py-0.5 text-[10px]">{noLeidas}</span>
            )}
          </button>
        ))}
      </div>

      <section className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Notificaciones</h3>
          <span className="text-sm text-gray-400 dark:text-gray-500">{filtradas.length} resultado{filtradas.length !== 1 ? "s" : ""}</span>
        </div>
        {filtradas.length === 0 ? (
          <div className="text-center py-16 text-gray-400 dark:text-gray-500">
            <InboxIcon size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No hay notificaciones en esta categoría.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtradas.map((n) => (
              <NotifCard key={n.id} notif={n} onMarkRead={markRead} onDelete={deleteNotif} />
            ))}
          </div>
        )}
      </section>

      <ModalCrear open={openModal} onClose={() => setOpenModal(false)} onCreate={addNotif} />
    </main>
  );
}