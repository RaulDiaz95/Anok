import { buildApiUrl } from "../config/env";
import { Notification } from "../types/notification";

class NotificationService {
  async list(unreadOnly = false, page = 0, size = 20): Promise<Notification[]> {
    const params = new URLSearchParams({
      unreadOnly: String(unreadOnly),
      page: String(page),
      size: String(size),
    });
    const response = await fetch(buildApiUrl(`/notifications?${params.toString()}`), {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to load notifications");
    }
    return response.json();
  }

  async unreadCount(): Promise<number> {
    const response = await fetch(buildApiUrl("/notifications/unread-count"), {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to load unread count");
    }
    return response.json();
  }

  async markRead(id: string): Promise<Notification> {
    const response = await fetch(buildApiUrl(`/notifications/mark-read/${id}`), {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to mark notification as read");
    }
    return response.json();
  }

  async markAllRead(): Promise<void> {
    const response = await fetch(buildApiUrl("/notifications/mark-all-read"), {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to mark all notifications as read");
    }
  }

  async archive(id: string): Promise<Notification> {
    const response = await fetch(buildApiUrl(`/notifications/archive/${id}`), {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to archive notification");
    }
    return response.json();
  }
}

export const notificationService = new NotificationService();
