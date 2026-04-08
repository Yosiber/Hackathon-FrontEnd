import type { Ticket } from "../../api/types/tickets.type";
import type { ViewTicket } from "./Tickets";

export const mapTicketToView = (t: Ticket): ViewTicket => {
  const total = t.items.length;
  const ready = t.items.filter(i => i.deliveryType === 'immediate').length;

  // IMPORTANTE: Si el backend envía 'completed' pero el componente usa 'pending', 
  // debemos normalizarlo aquí o actualizar las constantes del componente.
  
  return {
    ...t,
    turno: t.ticketNumber.split('-').pop() || t.ticketNumber,
    paciente: t.customerId || "Paciente General",
    hora: t.createdAt 
      ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : '--:--',
    disponibilidad: `${ready} de ${total}`
  };
};