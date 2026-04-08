import axiosInstance from "../axios.instance";
import type { Notification, NotificationType } from "../types/notification.type";

export const getNotifications = async (params: {
  page?: number;
  limit?: number;
}) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page.toString());
    if (params.limit) query.append("limit", params.limit.toString());
    const response = await axiosInstance.get(`/notifications?${query.toString()}`);
    return response.data as Notification[];
  } catch (error) {
    throw error;
  }
};

export const getNotificationsByUser = async (userId: string, limit: number) => {
  try {
    const query = new URLSearchParams();
    query.append("limit", limit.toString());
    const response = await axiosInstance.get(`/notifications/${userId}?${query.toString()}`);
    return response.data as Notification[];
  } catch (error) {
    throw error;
  }
};

export const getNotificationsByType = async (
  userId: string,
  type: NotificationType
) => {
  try {
    const response = await axiosInstance.get(
      `/notifications/type=${type}`
    );
    return response.data as Notification[];
  } catch (error) {
    throw error;
  }
};

export const markNotificationAsRead = async (userId: string, notificationIds: string[]) => {
  const response = await axiosInstance.patch(`/notifications/${userId}/mark-read`, {
    notificationIds,
  });
  return response.data;
};

export const markAllNotificationsAsRead = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(`/notifications/${userId}/mark-all-read`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await axiosInstance.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createNotification = async (
  userId: string,
  recipientName: string,  // ← parámetro nuevo
  title: string,
  message: string,
  type: NotificationType,
  channels?: string[],
  metadata?: Record<string, any>
) => {
  try {
    const response = await axiosInstance.post(`/notifications`, {
      userId,
      recipientName,  // ← ahora sí se envía al backend
      title,
      message,
      type,
      channels,
      metadata,
    });
    return response.data as Notification;
  } catch (error) {
    throw error;
  }
};

export const getStats = async (userId: string) => {
  try {
    const response = await axiosInstance.get(`/notifications/${userId}/stats`);
    return response.data;
  } catch (error) {
    throw error;
  }
};