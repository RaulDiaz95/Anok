import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Loader2, Pencil, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import Navbar from "../components/NavBar";
import { eventService } from "../services/eventService";
import { Event } from "../types/event";
import { useAuth } from "../contexts/AuthContext";

export default function MyEvents() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const fetchMyEvents = async () => {
    if (!isAuthenticated) return;
    setIsFetching(true);
    setError("");
    try {
      const data = await eventService.listMine();
      setEvents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load your events");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchMyEvents();
  }, [isAuthenticated]);

  const buildAddress = (event: Event) =>
    [
      event.venueAddress,
      event.venueState,
      event.venueCountry,
      event.venueZipCode,
    ]
      .filter((part) => part && part.trim() !== "")
      .join(", ");

  const formatDate = (event: Event) => {
    const dt = event.eventDateTime || `${event.eventDate}T${event.startTime}`;
    try {
      return format(new Date(dt), "PPP p");
    } catch {
      try {
        return format(parseISO(event.eventDate), "PPP");
      } catch {
        return "TBD";
      }
    }
  };

  const handleToggleLive = async (event: Event) => {
    setTogglingId(event.id);
    setError("");
    try {
      const updated = await eventService.toggleLive(event.id, !event.isLive);
      setEvents((prev) =>
        prev.map((e) => (e.id === event.id ? { ...e, ...updated } : e))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update live status");
    } finally {
      setTogglingId(null);
    }
  };

  const hasEvents = useMemo(() => events.length > 0, [events]);

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {isLoading ? "Checking session..." : "Redirecting to login..."}
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Events</h1>
              <p className="text-gray-400">
                Manage your submissions, toggle visibility, and edit event details.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={fetchMyEvents}
                className="px-4 py-2 border border-[#b11226]/40 rounded-lg text-white hover:bg-[#b11226]/10 transition flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <Link
                to="/events/new"
                className="px-4 py-2 bg-[#b11226] hover:bg-[#d31a33] text-white rounded-lg font-semibold transition flex items-center gap-2"
              >
                Create Event
              </Link>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-500/10 border border-red-500/40 text-red-200 rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          {isFetching && (
            <div className="flex items-center gap-2 text-gray-300">
              <Loader2 className="animate-spin" size={18} />
              Loading your events...
            </div>
          )}

          {!isFetching && !hasEvents && (
            <div className="text-gray-400">
              You have not created any events yet.{" "}
              <Link to="/events/new" className="text-[#f7c0c7] underline">
                Create your first event
              </Link>
              .
            </div>
          )}

          {hasEvents && (
            <div className="overflow-x-auto bg-[#1a1a2e]/70 border border-[#b11226]/10 rounded-2xl shadow-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-gray-300 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Live</th>
                    <th className="px-4 py-3 text-left">Capacity</th>
                    <th className="px-4 py-3 text-left">Location</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#b11226]/10">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 font-semibold text-white">
                        {event.title}
                      </td>
                      <td className="px-4 py-3 text-gray-300">{formatDate(event)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggleLive(event)}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#b11226]/30 bg-[#b11226]/10 hover:bg-[#b11226]/20 transition"
                          disabled={togglingId === event.id}
                        >
                          {togglingId === event.id ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : event.isLive ? (
                            <ToggleRight size={18} className="text-green-300" />
                          ) : (
                            <ToggleLeft size={18} className="text-gray-300" />
                          )}
                          <span className="text-sm text-white">
                            {event.isLive ? "Live" : "Offline"}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-gray-300">{event.capacity}</td>
                      <td className="px-4 py-3 text-gray-300">
                        <div className="max-w-xs">{buildAddress(event)}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          to={`/events/${event.id}/edit`}
                          className="inline-flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/10 transition"
                        >
                          <Pencil size={16} />
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
