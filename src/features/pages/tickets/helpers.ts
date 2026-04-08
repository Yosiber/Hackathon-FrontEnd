import type { Ticket } from "../../api/types/tickets.type";
import type { ViewTicket } from "./Tickets";

export const mapTicketToView = (t: Ticket): ViewTicket => {
  const total = t.items.length;
  const ready = t.items.filter(i => i.deliveryType === 'immediate').length;

  // Normalizar tickets antiguos que no tienen fulfillmentStatus
  let fulfillmentStatus = t.fulfillmentStatus;
  if (!fulfillmentStatus) {
    const waitingCount = t.items.filter(i => i.deliveryType === 'waiting').length;
    if (waitingCount === 0) fulfillmentStatus = 'completed';
    else if (waitingCount === total) fulfillmentStatus = 'waiting';
    else fulfillmentStatus = 'partially-completed';
  }

  // Normalizar tickets antiguos que tienen status = 'completed' (legacy)
  let status = t.status;
  if (status === 'completed' as any) {
    status = 'registered';
  }
  
  return {
    ...t,
    status,
    fulfillmentStatus,
    turno: t.ticketNumber.split('-').pop() || t.ticketNumber,
    paciente: t.customerId || "Paciente General",
    hora: t.createdAt 
      ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : '--:--',
    disponibilidad: `${ready} de ${total}`
  };
};