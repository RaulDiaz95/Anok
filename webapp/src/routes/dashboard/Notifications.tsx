import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { useNotifications } from "../../hooks/useNotifications";
import { Notification } from "../../types/notification";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 20;

const typeStyles: Record<string, string> = {
  INFO: "bg-white/10 border-white/20 text-gray-200",
  WARNING: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
  EVENT_UPDATE: "bg-[#b11226]/15 border-[#b11226]/40 text-[#f7c0c7]",
  ADMIN_ALERT: "bg-blue-500/10 border-blue-500/30 text-blue-200",
  FLAGGED_EVENT: "bg-red-500/10 border-red-500/30 text-red-200",
};

export default function Notifications() {
  const [tab, setTab] = useState<"unread" | "all">("unread");
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const {
    notifications,
    loading,
    error,
    refreshNotifications,
    markRead,
    markAllRead,
    archive,
  } = useNotifications();

  useEffect(() => {
    refreshNotifications(tab === "unread", page, PAGE_SIZE);
  }, [tab, page, refreshNotifications]);

  const hasNextPage = useMemo(() => notifications.length === PAGE_SIZE, [notifications.length]);

  const list = notifications;

  const renderItem = (notification: Notification) => {
    const timeAgo = formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true });
    return (
      <div
        key={notification.id}
        className={`border border-white/10 rounded-xl p-4 flex flex-col gap-3 bg-white/5 ${
          notification.isRead ? "opacity-80" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] uppercase tracking-wide px-2 py-0.5 rounded-full border ${
                  typeStyles[notification.type] || "bg-white/10 border-white/20 text-gray-200"
                }`}
              >
                {notification.type.replace("_", " ")}
              </span>
              {!notification.isRead && <span className="h-2 w-2 rounded-full bg-[#b11226]" />}
            </div>
            <h3 className="text-lg font-semibold text-white mt-2">{notification.title}</h3>
            {notification.message && (
              <p className="text-gray-300 mt-1 max-w-3xl">{notification.message}</p>
            )}
          </div>
          <div className="text-xs text-gray-400 whitespace-nowrap">{timeAgo}</div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          {!notification.isRead && (
            <button
              onClick={() => markRead(notification.id)}
              className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
            >
              Mark as read
            </button>
          )}
          <button
            onClick={() => archive(notification.id)}
            className="px-3 py-1 rounded-lg bg-white/10 border border-white/10 hover:bg-white/20 transition"
          >
            Archive
          </button>
          {notification.actionUrl && (
            <button
              onClick={() => navigate(notification.actionUrl!)}
              className="px-3 py-1 rounded-lg bg-[#b11226]/20 border border-[#b11226]/40 text-white hover:bg-[#b11226]/30 transition"
            >
              UPDATE INFORMATION
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-gray-400">Stay updated on event activity and admin actions.</p>
        </div>
        <button
          onClick={markAllRead}
          className="px-4 py-2 rounded-lg bg-[#b11226] hover:bg-[#d31a33] text-white text-sm transition"
        >
          Mark all as read
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            setTab("unread");
            setPage(0);
          }}
          className={`px-4 py-2 rounded-lg text-sm border transition ${
            tab === "unread"
              ? "bg-[#b11226]/20 border-[#b11226]/40 text-white"
              : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
          }`}
        >
          Unread
        </button>
        <button
          onClick={() => {
            setTab("all");
            setPage(0);
          }}
          className={`px-4 py-2 rounded-lg text-sm border transition ${
            tab === "all"
              ? "bg-[#b11226]/20 border-[#b11226]/40 text-white"
              : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"
          }`}
        >
          All
        </button>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && list.length === 0 && (
        <div className="text-gray-400">No notifications yet.</div>
      )}

      <div className="space-y-4">
        {list.map(renderItem)}
      </div>

      {list.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-300">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Prev
          </button>
          <span>Page {page + 1}</span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={!hasNextPage}
            className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
