export type NotificationType =
  | "TICKET_READY"
  | "MEDICINE_ACTIVE"
  | "MEDICINE_OUT_OF_STOCK"
  | "MEDICINE_LOW_STOCK"
  | "STOCK_ACTIVE_ALERT"
  | "STOCK_EMPTY_ALERT"
  | "STOCK_LOW_ALERT";

  export interface Notification {
  _id: string;
  userId: string;
  recipientName?: string;  // ← agregado
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  readAt?: string;
  createdAt?: string;
  metadata?: {
    medicineId?: string;
    ticketId?: string;
  };
}