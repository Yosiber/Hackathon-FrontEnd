import { createContext, useContext, useState, type ReactNode } from "react";

export type TipoNotificacion = "stock" | "llegada" | "ticket" | "turno";

export interface Notificacion {
  id: number;
  tipo: TipoNotificacion;
  destinatario: string;
  mensaje: string;
  tiempo: string;
  leida: boolean;
}

interface NotificationsContextType {
  notificaciones: Notificacion[];
  noLeidas: number;
  markRead: (id: number) => void;
  markAllRead: () => void;
  deleteNotif: (id: number) => void;
  addNotif: (data: Omit<Notificacion, "id" | "tiempo" | "leida">) => void;
}

const NotificationsContext = createContext<NotificationsContextType | null>(null);

const initialData: Notificacion[] = [
  {
    id: 1,
    tipo: "stock",
    destinatario: "Personal de farmacia",
    mensaje: "Insulina NPH: quedan solo 5 unidades en stock. Se recomienda hacer pedido urgente.",
    tiempo: "Hace 5 min",
    leida: false,
  },
  {
    id: 2,
    tipo: "llegada",
    destinatario: "Carlos Gómez (A-101)",
    mensaje: "Metformina 850mg está en camino. Llegada estimada: 14:00h.",
    tiempo: "Hace 18 min",
    leida: false,
  },
  {
    id: 3,
    tipo: "ticket",
    destinatario: "Ana Rosa (B-202)",
    mensaje: "Su ticket B-202 ha sido atendido. Medicamentos listos para reclamar.",
    tiempo: "Hace 32 min",
    leida: false,
  },
  {
    id: 4,
    tipo: "turno",
    destinatario: "Rosa Mendez (A-104)",
    mensaje: "Recordatorio: su turno A-104 está programado para las 10:45h.",
    tiempo: "Hace 45 min",
    leida: true,
  },
  {
    id: 5,
    tipo: "stock",
    destinatario: "Personal de farmacia",
    mensaje: "Ibuprofeno 400mg: stock bajo (12 unidades). Revisar reposición.",
    tiempo: "Hace 1h",
    leida: true,
  },
  {
    id: 6,
    tipo: "ticket",
    destinatario: "Luis Mendez (C-085)",
    mensaje: "Su reclamación C-085 fue completada. Loratadina 10mg entregada.",
    tiempo: "Hace 2h",
    leida: true,
  },
];

let nextId = initialData.length + 1;

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>(initialData);

  const noLeidas = notificaciones.filter((n) => !n.leida).length;

  const markRead = (id: number) =>
    setNotificaciones((prev) =>
      prev.map((n) => (n.id === id ? { ...n, leida: true } : n))
    );

  const markAllRead = () =>
    setNotificaciones((prev) => prev.map((n) => ({ ...n, leida: true })));

  const deleteNotif = (id: number) =>
    setNotificaciones((prev) => prev.filter((n) => n.id !== id));

  const addNotif = (data: Omit<Notificacion, "id" | "tiempo" | "leida">) => {
    setNotificaciones((prev) => [
      { ...data, id: nextId++, tiempo: "Ahora", leida: false },
      ...prev,
    ]);
  };

  return (
    <NotificationsContext.Provider
      value={{ notificaciones, noLeidas, markRead, markAllRead, deleteNotif, addNotif }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotifications debe usarse dentro de NotificationsProvider");
  return ctx;
}