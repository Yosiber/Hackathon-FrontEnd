import type { Ticket, TicketStatus, CreateTicketDto, PatchTicketDto } from '../types/tickets.type';
import http from '../axios.instance';

// api/requests/ticket.request.ts

export async function getTickets(params: {
  page?: number;
  limit?: number;
  status?: TicketStatus;
  customerId?: string;
}) {
  try {
    const query = new URLSearchParams();
    if (params.page)   query.append("page", params.page.toString());
    if (params.limit)  query.append("limit", params.limit.toString());
    if (params.status) query.append("status", params.status);
    if (params.customerId) query.append("customerId", params.customerId);

    const response = await http.get(`/tickets?${query.toString()}`);
    return response.data;  
  } catch (error) {
    console.error("Error en getTickets:", error);
    throw error;
  }
}

export async function getTicketById(id: string) {
  try {
    const response = await http.get(`/tickets/${id}`);
    return response.data as Ticket;
  } catch (error) {
    throw error;
  }
}

// getTicketsByCustomer eliminada porque ahora se une con getTickets

export async function createTicket(body: CreateTicketDto) {
  try {
    const response = await http.post('/tickets', body);
    return response.data as Ticket;
  } catch (error) {
    throw error;
  }
}

export async function patchTicket(id: string, body: PatchTicketDto) {
  try {
    const response = await http.patch(`/tickets/${id}/cancel-items`, body);
    return response.data as Ticket;
  } catch (error) {
    throw error;
  }
}

export async function deleteTicket(id: string) {
  try {
    const response = await http.delete(`/tickets/${id}/purge`);
    return response.data;
  } catch (error) {
    throw error;
  }
}