import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { Loader2, Pencil, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import Navbar from "../components/NavBar";
import { eventService } from "../services/eventService";
import { Event } from "../types/event";
import { useAuth } from "../contexts/AuthContext";

type MyEventsProps = {
  embedded?: boolean;
};

export default function MyEvents({ embedded = false }: MyEventsProps) {
  const PAGE_SIZE = 20;
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [showUpcoming, setShowUpcoming] = useState(true);
  const [showToday, setShowToday] = useState(true);
  const [showPast, setShowPast] = useState(true);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [todayPage, setTodayPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

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
      return format(new Date(dt), "MM/dd/yyyy h:mm a");
    } catch {
      try {
        return format(parseISO(event.eventDate), "MM/dd/yyyy");
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
  const canToggle = (event: Event) =>
    event.status === "APPROVED" || event.status === "LIVE" || event.isLive;

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const parseEventDate = (event: Event) => {
    if (!event.eventDate) return null;
    const [year, month, day] = event.eventDate.split("-").map((v) => parseInt(v, 10));
    if (!year || !month || !day) return null;
    const d = new Date(year, month - 1, day);
    d.setHours(0, 0, 0, 0);
    return isNaN(d.getTime()) ? null : d;
  };

  const startTimeValue = (event: Event) => {
    if (!event.startTime) return Number.MAX_SAFE_INTEGER;
    const parsed = parseISO(`1970-01-01T${event.startTime}`);
    return isNaN(parsed.getTime()) ? Number.MAX_SAFE_INTEGER : parsed.getTime();
  };

  const upcomingEvents = useMemo(() => {
    return events
      .filter((evt) => {
        const date = parseEventDate(evt);
        return date !== null && date > today;
      })
      .sort((a, b) => {
        const da = parseEventDate(a)?.getTime() ?? 0;
        const db = parseEventDate(b)?.getTime() ?? 0;
        return da - db;
      });
  }, [events, today]);

  const todayEvents = useMemo(() => {
    return events
      .filter((evt) => {
        const date = parseEventDate(evt);
        return date !== null && date.getTime() === today.getTime();
      })
      .sort((a, b) => startTimeValue(a) - startTimeValue(b));
  }, [events, today]);

  const pastEvents = useMemo(() => {
    return events
      .filter((evt) => {
        const date = parseEventDate(evt);
        return date !== null && date < today;
      })
      .sort((a, b) => {
        const da = parseEventDate(a)?.getTime() ?? 0;
        const db = parseEventDate(b)?.getTime() ?? 0;
        return db - da;
      });
  }, [events, today]);

  const paginate = (list: Event[], page: number) => {
    const start = (page - 1) * PAGE_SIZE;
    return list.slice(start, start + PAGE_SIZE);
  };

  const renderPagination = (
    page: number,
    setPage: (p: number) => void,
    totalItems: number
  ) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    return (
      <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-300">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          « Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page >= totalPages}
          className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Next »
        </button>
      </div>
    );
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-full flex items-center justify-center text-white">
        {isLoading ? "Checking session..." : "Redirecting to login..."}
      </div>
    );
  }

  return (
    <>
      {!embedded && <Navbar />}
      <div className="min-h-full bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white fade-in-up">
        <div className={`max-w-6xl mx-auto px-4 ${embedded ? "pt-10 pb-12" : "pt-28 pb-16"}`}>
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
                className="px-4 py-2 border border-[#b11226]/40 rounded-lg text-white hover:bg-[#b11226]/10 transition flex items-center gap-2 btn-animated"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
              <Link
                to="/events/new"
                className="px-4 py-2 bg-[#b11226] hover:bg-[#d31a33] text-white rounded-lg font-semibold transition flex items-center gap-2 btn-animated pulse-soft"
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
            <div className="flex items-center gap-3 text-gray-300">
              <div className="eq-loader">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>
              <span>Loading your events...</span>
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
            <div className="space-y-10">
              {[
                {
                  title: "Upcoming Events",
                  data: upcomingEvents,
                  show: showUpcoming,
                  setShow: setShowUpcoming,
                  page: upcomingPage,
                  setPage: setUpcomingPage,
                },
                {
                  title: "Today Events",
                  data: todayEvents,
                  show: showToday,
                  setShow: setShowToday,
                  page: todayPage,
                  setPage: setTodayPage,
                },
                {
                  title: "Past Events",
                  data: pastEvents,
                  show: showPast,
                  setShow: setShowPast,
                  page: pastPage,
                  setPage: setPastPage,
                },
              ].map(({ title, data, show, setShow, page, setPage }) => {
                const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
                const currentPage = Math.min(page, totalPages);
                const paged = paginate(data, currentPage);

                return (
                  <div key={title} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-semibold text-white">{title}</h2>
                      <button
                        onClick={() => setShow(!show)}
                        className="text-sm px-3 py-1 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition text-gray-200 inline-flex items-center gap-2"
                      >
                        <span
                          className={`transition-transform duration-300 ${show ? "rotate-180" : ""}`}
                        >
                          ▾
                        </span>
                        {show ? "Hide" : "Show"}
                      </button>
                    </div>
                    <div
                      className={`
                        transition-all duration-300 origin-top overflow-hidden
                        ${show ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 h-0 pointer-events-none"}
                      `}
                    >
                      <div className="bg-[#1a1a2e]/70 border border-[#b11226]/10 rounded-2xl shadow-lg w-full overflow-hidden">
                        <table className="min-w-full text-sm">
                          <thead className="bg-white/5 text-gray-300 uppercase text-xs tracking-wide">
                            <tr>
                              <th className="px-4 py-3 text-left">Flyer</th>
                              <th className="px-4 py-3 text-left">Title</th>
                              <th className="px-4 py-3 text-left">Date</th>
                              <th className="px-4 py-3 text-left">Status</th>
                              <th className="px-4 py-3 text-left">Live</th>
                              <th className="px-4 py-3 text-left">Capacity</th>
                              <th className="px-4 py-3 text-left">Location</th>
                              <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#b11226]/10">
                            {data.length === 0 && (
                              <tr>
                                <td className="px-4 py-6 text-gray-400 text-center" colSpan={8}>
                                  No events in this category
                                </td>
                              </tr>
                            )}
                            {paged.map((event) => (
                              <tr key={event.id} className="hover:bg-white/5 transition card-enter">
                                <td className="px-4 py-3">
                                  {event.flyerUrl ? (
                                    <div className="w-16 h-20 md:w-20 md:h-24 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                                      <img
                                        src={event.flyerUrl}
                                        alt={`${event.title} flyer`}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ) : (
                                    <div className="w-16 h-20 md:w-20 md:h-24 rounded-lg border border-dashed border-white/15 bg-white/5 text-[10px] text-gray-400 flex items-center justify-center text-center px-1">
                                      No flyer
                                    </div>
                                  )}
                                </td>
                                <td className="px-4 py-3 font-semibold text-white">
                                  {event.title}
                                </td>
                                <td className="px-4 py-3 text-gray-300">{formatDate(event)}</td>
                                <td className="px-4 py-3 text-gray-300 capitalize">
                                  {event.status?.toLowerCase().replace("_", " ") || "pending_review"}
                                </td>
                                <td className="px-4 py-3">
                                  <button
                                    onClick={() => handleToggleLive(event)}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#b11226]/30 bg-[#b11226]/10 hover:bg-[#b11226]/20 transition"
                                    disabled={togglingId === event.id || !canToggle(event)}
                                  >
                                    {togglingId === event.id ? (
                                      <Loader2 className="animate-spin" size={16} />
                                    ) : event.isLive ? (
                                      <ToggleRight size={18} className="text-green-300" />
                                    ) : (
                                      <ToggleLeft size={18} className="text-gray-300" />
                                    )}
                                    <span className="text-sm text-white">
                                      {event.isLive ? "Live" : canToggle(event) ? "Offline" : "Locked"}
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
                        {data.length > 0 && renderPagination(currentPage, setPage, data.length)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
