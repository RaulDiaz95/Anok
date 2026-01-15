import { useCallback, useEffect, useMemo, useState } from "react";
import { notificationService } from "../services/notificationService";
import { Notification } from "../types/notification";
import { useAuth } from "../contexts/AuthContext";

export function useNotifications() {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refreshNotifications = useCallback(
    async (unreadOnly = false, page = 0, size = 20) => {
      if (!isAuthenticated) return [];
      setLoading(true);
      setError("");
      try {
        const data = await notificationService.list(unreadOnly, page, size);
        setNotifications(data);
        return data;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load notifications");
        return [];
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated]
  );

  const refreshUnreadCount = useCallback(async () => {
    if (!isAuthenticated) return 0;
    try {
      const count = await notificationService.unreadCount();
      setUnreadCount(count);
      return count;
    } catch {
      return 0;
    }
  }, [isAuthenticated]);

  const markRead = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return;
      await notificationService.markRead(id);
      await refreshUnreadCount();
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    },
    [isAuthenticated, refreshUnreadCount]
  );

  const markAllRead = useCallback(async () => {
    if (!isAuthenticated) return;
    await notificationService.markAllRead();
    await refreshUnreadCount();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, [isAuthenticated, refreshUnreadCount]);

  const archive = useCallback(
    async (id: string) => {
      if (!isAuthenticated) return;
      await notificationService.archive(id);
      await refreshUnreadCount();
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    },
    [isAuthenticated, refreshUnreadCount]
  );

  useEffect(() => {
    refreshUnreadCount();
    const interval = setInterval(() => {
      refreshUnreadCount();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshUnreadCount]);

  const latest = useMemo(() => notifications.slice(0, 10), [notifications]);

  return {
    notifications,
    latest,
    unreadCount,
    loading,
    error,
    refreshNotifications,
    refreshUnreadCount,
    markRead,
    markAllRead,
    archive,
  };
}
