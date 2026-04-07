export const NotificationType = {
  MEDICINE_ACTIVE: 'MEDICINE_ACTIVE',
  MEDICINE_OUT_OF_STOCK: 'MEDICINE_OUT_OF_STOCK',
  MEDICINE_LOW_STOCK: 'MEDICINE_LOW_STOCK',
  STOCK_LOW_ALERT: 'STOCK_LOW_ALERT',
  STOCK_EMPTY_ALERT: 'STOCK_EMPTY_ALERT',
  STOCK_ACTIVE_ALERT: 'STOCK_ACTIVE_ALERT',
  TURN_REMINDER: 'TURN_REMINDER',
  TICKET_READY: 'TICKET_READY',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const NotificationChannel = {
  EMAIL: 'EMAIL',
  WHATSAPP: 'WHATSAPP',
  IN_APP: 'IN_APP',
} as const;

export type NotificationChannel = typeof NotificationChannel[keyof typeof NotificationChannel];

export interface Notification {
  id: string;
  userId: string;
  recipientName: string | null;
  title: string;
  message: string;
  type: NotificationType;
  channels: NotificationChannel[];
  read: boolean;
  readAt: Date | null;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}