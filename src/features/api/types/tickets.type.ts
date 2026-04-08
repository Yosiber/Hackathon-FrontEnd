export type TicketStatus = "registered" | "in-progress" | "pending";
export type FulfillmentStatus = "completed" | "partially-completed" | "waiting";
export type DeliveryType = "immediate" | "next-shipment" | "waiting";

export interface TicketItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  deliveryType: DeliveryType;
}

export interface Ticket {
  _id: string;
  ticketNumber: string;
  items: TicketItem[];
  fulfillmentStatus: FulfillmentStatus;
  status: TicketStatus;
  observations: string[];
  totalAmount: number;
  customerId: string;
  createdAt?: string;
  updatedAt?: string;

}

export interface CreateTicketDto {
  customerId: string;
  status: TicketStatus;
  fulfillmentStatus: FulfillmentStatus;
  items: TicketItem[];
  totalAmount: number;
  observations?: string[];
}

export interface PatchTicketDto {
  status?: TicketStatus;
  fulfillmentStatus?: FulfillmentStatus;
  observations?: string[];
  products?: { productId: string }[];
}