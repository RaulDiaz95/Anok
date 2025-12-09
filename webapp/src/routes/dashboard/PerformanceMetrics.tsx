import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { eventService } from "../../services/eventService";
import { Event } from "../../types/event";

export default function PerformanceMetrics() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await eventService.listMine();
        setEvents(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const liveCount = useMemo(() => events.filter((e) => e.isLive).length, [events]);
  const offlineCount = useMemo(() => events.length - liveCount, [events, liveCount]);

  const monthly = useMemo(() => {
    const map: Record<string, number> = {};
    events.forEach((evt) => {
      if (!evt.eventDate) return;
      const date = new Date(evt.eventDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      map[key] = (map[key] || 0) + 1;
    });
    return Object.entries(map).sort(([a], [b]) => (a > b ? 1 : -1));
  }, [events]);

  const total = liveCount + offlineCount || 1;
  const livePercent = Math.round((liveCount / total) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Performance Metrics</h1>
        {loading && <span className="text-sm text-gray-400">Loading metrics...</span>}
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg flex flex-col items-center gap-4"
        >
          <p className="text-sm text-gray-400">Live vs Offline</p>
          <div
            className="relative w-40 h-40 rounded-full flex items-center justify-center"
            style={{
              background: `conic-gradient(#b11226 ${livePercent}%, #2f2f45 ${livePercent}% 100%)`,
              boxShadow: "0 0 30px rgba(177, 18, 38, 0.35)",
            }}
          >
            <div className="w-24 h-24 rounded-full bg-[#0f0f1a] border border-white/10 flex items-center justify-center">
              <div className="text-center">
                <p className="text-xl font-bold">{livePercent}%</p>
                <p className="text-xs text-gray-400">Live</p>
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-sm text-gray-300">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#b11226]" /> Live ({liveCount})
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#2f2f45]" /> Offline ({offlineCount})
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg"
        >
          <p className="text-sm text-gray-400 mb-4">Events Created Over Time</p>
          <div className="space-y-3">
            {monthly.length === 0 && <p className="text-gray-500">No data yet</p>}
            {monthly.map(([month, count]) => (
              <div key={month} className="space-y-1">
                <div className="flex items-center justify-between text-sm text-gray-300">
                  <span>{month}</span>
                  <span>{count}</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, count * 20)}%` }}
                    transition={{ duration: 0.4 }}
                    className="h-full bg-gradient-to-r from-[#b11226] to-[#f25f6b]"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
