import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getNotificationsByUser,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  createNotification,
} from "../api/requests/notification.request";
import type { Notification, NotificationType } from "../api/types/notification.type";

// ── Tipos UI ──────────────────────────────────────────────────────────────────
export type TipoNotificacion = "stock" | "llegada" | "ticket" | "turno";

export const TIPO_MAP: Record<NotificationType, TipoNotificacion> = {
  STOCK_LOW_ALERT:       "stock",
  STOCK_EMPTY_ALERT:     "stock",
  MEDICINE_OUT_OF_STOCK: "stock",
  MEDICINE_LOW_STOCK:    "stock",
  STOCK_ACTIVE_ALERT:    "llegada",
  MEDICINE_ACTIVE:       "llegada",
  TICKET_READY:          "ticket",
};

// ── Constantes ────────────────────────────────────────────────────────────────
const TIPO_REVERSE: Record<TipoNotificacion, NotificationType> = {
  stock:   "STOCK_LOW_ALERT",
  llegada: "MEDICINE_ACTIVE",
  ticket:  "TICKET_READY",
  turno:   "TICKET_READY",
};

const TIPO_CONFIG_TITLES: Record<TipoNotificacion, string> = {
  stock:   "Alerta de stock crítico",
  llegada: "Llegada de medicamento",
  ticket:  "Ticket atendido / completado",
  turno:   "Recordatorio de turno",
};

// ── Interfaces ────────────────────────────────────────────────────────────────
export interface Notificacion {
  id: string;
  tipo: TipoNotificacion;
  destinatario: string;
  titulo: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
  _raw: Notification;
}

interface NotificationsContextValue {
  notificaciones: Notificacion[];
  noLeidas: number;
  loading: boolean;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
  deleteNotif: (id: string) => Promise<void>;
  addNotif: (n: {
    tipo: TipoNotificacion;
    destinatario: string;
    targetUserId: string;
    mensaje: string;
    metadata: { medicineId?: string; ticketId?: string; };
  }) => Promise<void>;
  refresh: () => Promise<void>;
}

// ── Mapper ────────────────────────────────────────────────────────────────────
function toNotificacion(n: Notification): Notificacion {
  return {
    id: n._id,
    tipo: TIPO_MAP[n.type] ?? "ticket",
    destinatario: n.recipientName ?? n.title,
    titulo: n.title,
    mensaje: n.message,
    tiempo: n.createdAt
      ? new Date(n.createdAt).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })
      : "—",
    leida: n.read,
    _raw: n,
  };
}

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────
export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const { authUser } = useAuth();
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    if (!authUser?._id) return;
    setLoading(true);
    try {
      const data = await getNotificationsByUser(authUser._id, 50);
      setNotificaciones(data.map(toNotificacion));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [authUser?._id]);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const markRead = async (id: string) => {
    if (!authUser?._id) return;
    await markNotificationAsRead(authUser._id, [id]);
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );
  };

  const markAllRead = async () => {
    if (!authUser?._id) return;
    await markAllNotificationsAsRead(authUser._id);
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));
  };

  const deleteNotif = async (id: string) => {
    await deleteNotification(id);
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));
  };

  const addNotif = async ({
    tipo,
    destinatario,
    targetUserId,
    mensaje,
    metadata,
  }: {
    tipo: TipoNotificacion;
    destinatario: string;
    targetUserId: string;
    mensaje: string;
    metadata: { medicineId?: string; ticketId?: string; };
  }) => {
    if (!authUser?._id) return;
    await createNotification(
      targetUserId,
      destinatario,
      TIPO_CONFIG_TITLES[tipo],
      mensaje,
      TIPO_REVERSE[tipo],
      ["IN_APP"],
      metadata,
    );
    await load();
  };

  // ✅ useMemo evita que el objeto cambie referencia en cada render
  const value = useMemo(() => ({
    notificaciones,
    noLeidas,
    loading,
    markRead,
    markAllRead,
    deleteNotif,
    addNotif,
    refresh: load,
  }), [notificaciones, noLeidas, loading, authUser?._id]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────
export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications debe usarse dentro de NotificationsProvider");
  return ctx;
}