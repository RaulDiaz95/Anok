import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { eventService } from "../services/eventService";
import { Event } from "../types/event";
import { format, parseISO } from "date-fns";
import Navbar from "../components/NavBar";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin, Users } from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await eventService.list();
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

const formatDateTime = (event: Event) => {
  const dt = event.eventDateTime || `${event.eventDate}T${event.startTime}`;
  try {
    return format(new Date(dt), "PPP • p");
  } catch {
    return "Date to be confirmed";
  }
};
  const formatTimeOnly = (time?: string | null) => {
    if (!time) return "—";
    try {
      return format(parseISO(`1970-01-01T${time}`), "p");
    } catch {
      return time;
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-3"
              >
                Community & Official Submissions
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 max-w-2xl"
              >
                Browse showcases sourced by the community plus official
                organizers. Want to see your event here? Submit it—it only takes
                a minute.
              </motion.p>
            </div>
            <Link
              to="/events/new"
              className="px-6 py-3 bg-[#b11226] hover:bg-[#d31a33] rounded-xl text-white font-semibold transition-all shadow-lg shadow-[#b11226]/30"
            >
              Create Event
            </Link>
          </div>

          {isLoading && (
            <div className="text-center text-gray-400">Loading events...</div>
          )}

          {error && (
            <div className="text-center text-red-400 mb-6">{error}</div>
          )}

          {!isLoading && events.length === 0 && !error && (
            <div className="text-center text-gray-400">
              No events yet. Be the first to register one!
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event, index) => (
              <motion.article
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-br from-[#1a1a2e] via-[#171728] to-[#12121f] border border-[#b11226]/10 rounded-2xl p-6 flex flex-col gap-4 shadow-lg shadow-black/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold text-white mb-1">
                      {event.title}
                    </h2>
                    <p className="text-sm text-gray-400 flex items-center gap-2">
                      <CalendarDays size={16} className="text-[#b11226]" />
                      {formatDateTime(event)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Duration: {event.eventLengthHours}h • Starts {formatTimeOnly(event.startTime)}{" "}
                      {event.endTime ? `• Ends ${formatTimeOnly(event.endTime)}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-xs font-semibold uppercase tracking-wide bg-[#b11226]/20 text-[#f7c0c7] px-3 py-1 rounded-full">
                      {event.isLive ? "Live" : "Offline"}
                    </span>
                    <span className="text-xs font-semibold uppercase tracking-wide bg-[#1f6f1f]/20 text-[#b6f0b6] px-3 py-1 rounded-full">
                      {event.allAges ? "All Ages" : "18+"}
                    </span>
                  </div>
                </div>

                {event.flyerUrl && event.flyerUrl.trim() !== "" && (
                  <div className="w-full overflow-hidden rounded-xl border border-[#b11226]/20">
                    <img
                      src={event.flyerUrl}
                      alt={`${event.title} flyer`}
                      className="w-full h-56 object-cover"
                    />
                  </div>
                )}

                {event.genres && event.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-gray-200">
                    {event.genres.map((genre) => (
                      <span
                        key={`${event.id}-${genre}`}
                        className="px-3 py-1 font-semibold rounded-full border border-[#b11226]/30 text-gray-200 bg-[#b11226]/10"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {event.about && (
                  <p className="text-gray-300 text-sm">
                    {event.about}
                  </p>
                )}

                <div className="text-sm text-gray-300 space-y-1">
                  <p className="font-medium text-white flex items-center gap-2">
                    <MapPin size={16} className="text-[#b11226]" />
                    {event.venueName}
                  </p>
                  <p className="text-gray-400 ml-6">{event.venueAddress}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center gap-2">
                    <Users size={16} className="text-[#b11226]" />
                    Capacity: {event.capacity}
                  </span>
                  {event.ownerName && (
                    <span className="text-xs uppercase tracking-wide">
                      Host: {event.ownerName}
                    </span>
                  )}
                </div>

                {event.performers && event.performers.length > 0 && (
                  <div className="text-sm text-gray-200 space-y-2">
                    <p className="font-semibold text-white">Performers</p>
                    <div className="space-y-1">
                      {event.performers.map((perf) => (
                        <div key={perf.id || perf.performerName} className="border border-[#b11226]/20 rounded-lg px-3 py-2 bg-white/5">
                          <p className="font-semibold text-white">{perf.performerName}</p>
                          <p className="text-xs text-gray-400">
                            {[perf.genre1, perf.genre2].filter(Boolean).join(", ")}
                          </p>
                          {perf.performerLink && (
                            <a
                              className="text-xs text-[#f7c0c7] underline hover:text-white"
                              href={perf.performerLink}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {perf.performerLink}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
