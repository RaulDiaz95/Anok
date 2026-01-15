export type NotificationType =
  | "INFO"
  | "WARNING"
  | "EVENT_UPDATE"
  | "ADMIN_ALERT"
  | "FLAGGED_EVENT";

export interface Notification {
  id: string;
  title: string;
  message?: string | null;
  actionUrl?: string | null;
  type: NotificationType;
  isRead: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
