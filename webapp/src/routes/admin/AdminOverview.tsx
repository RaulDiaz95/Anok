import { useEffect, useMemo, useState } from "react";
import { adminEventService } from "../../services/adminEventService";
import { Event } from "../../types/event";

export default function AdminOverview() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminEventService.listAll();
        setEvents(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load admin events");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const counts = useMemo(() => {
    return events.reduce(
      (acc, event) => {
        acc.total += 1;
        if (event.status === "PENDING_REVIEW") acc.pending += 1;
        if (event.status === "APPROVED") acc.live += 1;
        if (event.status === "DISABLED") acc.disabled += 1;
        if (event.status === "DELETED") acc.deleted += 1;
        return acc;
      },
      { total: 0, pending: 0, live: 0, disabled: 0, deleted: 0 }
    );
  }, [events]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Overview</h1>
        <p className="text-gray-400">Monitor moderation activity across all events.</p>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { label: "Total", value: counts.total },
            { label: "Pending", value: counts.pending },
            { label: "Live", value: counts.live },
            { label: "Disabled", value: counts.disabled },
            { label: "Deleted", value: counts.deleted },
          ].map((card) => (
            <div
              key={card.label}
              className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-lg"
            >
              <p className="text-xs uppercase tracking-wide text-gray-400">{card.label}</p>
              <p className="text-2xl font-semibold text-white mt-2">{card.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
