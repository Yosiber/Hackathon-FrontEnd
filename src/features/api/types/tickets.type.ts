export const TicketDeliveryType = {
  IMMEDIATE: 'immediate',
  NEXT_SHIPMENT: 'next-shipment',
  WAITING: 'waiting',
} as const;

export type TicketDeliveryType = typeof TicketDeliveryType[keyof typeof TicketDeliveryType];

export const TicketFulfillmentStatus = {
  COMPLETED: 'completed',
  PARTIALLY_COMPLETED: 'partially-completed',
  WAITING: 'waiting',
} as const;

export type TicketFulfillmentStatus = typeof TicketFulfillmentStatus[keyof typeof TicketFulfillmentStatus];

export const TicketStatus = {
  REGISTERED: 'registered',
  IN_PROGRESS: 'in-progress',
  PENDING: 'pending',
} as const;

export type TicketStatus = typeof TicketStatus[keyof typeof TicketStatus];

export interface TicketItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  deliveryType: TicketDeliveryType;
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  items: TicketItem[];
  fulfillmentStatus: TicketFulfillmentStatus;
  status: TicketStatus;
  observations: string[];
  totalAmount: number;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketDto {
  customerId: string;
  items: {
    productId: string;
    quantity: number;
  }[];
}

export interface PatchTicketDto {
  productIds: string[];
}