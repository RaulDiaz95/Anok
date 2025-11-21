import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { eventService } from "../services/eventService";
import { Event } from "../types/event";
import { format } from "date-fns";
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

  const formatDate = (value: string) => {
    try {
      return format(new Date(value), "PPP • p");
    } catch {
      return "Date to be confirmed";
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
                      {formatDate(event.eventDateTime)}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide bg-[#b11226]/20 text-[#f7c0c7] px-3 py-1 rounded-full">
                    {event.ageRestriction}
                  </span>
                </div>

                {event.genres && event.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {event.genres.map((genre) => (
                      <span
                        key={`${event.id}-${genre}`}
                        className="px-3 py-1 text-xs font-semibold rounded-full border border-[#b11226]/30 text-gray-200 bg-[#b11226]/10"
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                )}

                {event.description && (
                  <p className="text-gray-300 text-sm line-clamp-3">
                    {event.description}
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

              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
