import { format, parseISO } from "date-fns";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { FlyerFrame } from "../components/FlyerFrame";
import { AnimatedLoader } from "../components/AnimatedLoader";
import { eventService } from "../services/eventService";
import { Event } from "../types/event";

const formatDate = (event?: Event | null) => {
  if (!event) return "";
  const dt = event.eventDateTime || `${event.eventDate}T${event.startTime}`;
  try {
    return format(new Date(dt), "MM/dd/yyyy");
  } catch {
    try {
      return format(parseISO(event.eventDate), "MM/dd/yyyy");
    } catch {
      return "Date to be confirmed";
    }
  }
};

const formatTime = (time?: string | null) => {
  if (!time) return "";
  try {
    return format(parseISO(`1970-01-01T${time}`), "h:mm a");
  } catch {
    return time;
  }
};

const buildAddress = (event?: Event | null) =>
  [
    event?.venueAddress,
    event?.venueCity,
    event?.venueState,
    event?.venueCountry,
    event?.venueZipCode,
  ]
    .filter((part) => part && part.trim() !== "")
    .join(", ");

export default function EventDetail() {
  const { id, eventId } = useParams<{ id?: string; eventId?: string }>();
  const resolvedId = eventId ?? id;
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!resolvedId) {
        setError("Event not found");
        setLoading(false);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const data = await eventService.get(resolvedId);
        setEvent(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [resolvedId]);

  const dateLabel = useMemo(() => formatDate(event), [event]);
  const timeRange = useMemo(() => {
    if (!event) return "";
    const start = formatTime(event.startTime);
    const end = formatTime(event.endTime);
    if (start && end) return `${start} \u2013 ${end}`;
    if (start) return start;
    return "";
  }, [event]);

  const ageLabel = useMemo(() => {
    if (!event) return "";
    if (event.allAges) return "All Ages";
    return event.ageRestriction || "18+";
  }, [event]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] text-white">
          <AnimatedLoader label="Loading event..." />
        </div>
      </>
    );
  }

  if (error || !event) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f1a] text-white px-4">
          <p className="text-2xl font-semibold mb-4">{error || "Event not found"}</p>
          <button
            onClick={() => navigate("/events")}
            className="px-4 py-2 rounded-lg border border-white/20 text-white hover:bg-white/10 transition"
          >
            Go back to events
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white pt-28 pb-16 fade-in-up">
        <div className="max-w-6xl mx-auto px-4 space-y-8">
          <button
            onClick={() => navigate(-1)}
            className="text-sm text-gray-300 hover:text-white transition flex items-center gap-2"
          >
            <span className="text-lg">&#8592;</span> Back to Events
          </button>

          <div className="grid lg:grid-cols-[1.1fr_1.2fr] gap-8 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col gap-4">
              <FlyerFrame src={event.flyerUrl} alt={event.title} size="xl" className="w-full" />
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-3 py-1 rounded-full bg-[#b11226]/15 border border-[#b11226]/40 text-[#f7c0c7] font-semibold">
                  {event.isLive ? "Live" : "Offline"}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-gray-100 font-semibold">
                  {ageLabel}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-gray-100 font-semibold">
                  Capacity: {event.capacity}
                </span>
              </div>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-400 uppercase tracking-wide">Event</p>
                  <h1 className="text-4xl font-bold">{event.title}</h1>
                  {event.ownerName && (
                    <p className="text-gray-300 text-sm">Hosted by {event.ownerName}</p>
                  )}
                  {event.selectedVenueId && (
                    <a
                      href={`/venue/${event.selectedVenueId}`}
                      className="text-sm text-[#f7c0c7] underline hover:text-white transition"
                    >
                      View venue
                    </a>
                  )}
                </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="text-[#b11226]" size={18} />
                    <div>
                      <p className="text-xs text-gray-400">Date</p>
                      <p className="font-semibold text-white">{dateLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="text-[#b11226]" size={18} />
                    <div>
                      <p className="text-xs text-gray-400">Time</p>
                      <p className="font-semibold text-white">
                        {timeRange || "Time to be confirmed"} ({event.eventLengthHours}h)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-[#b11226]" size={18} />
                    <div>
                      <p className="text-xs text-gray-400">Venue</p>
                      <p className="font-semibold text-white">{event.venueName}</p>
                      <p className="text-gray-300 text-sm leading-snug">
                        {buildAddress(event) || "Address to be confirmed"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="text-[#b11226]" size={18} />
                    <div>
                      <p className="text-xs text-gray-400">Attendance</p>
                      <p className="font-semibold text-white">{event.capacity} capacity</p>
                      <p className="text-gray-300 text-sm">{event.alcohol ? "Alcohol served" : "No alcohol"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {event.genres && event.genres.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {event.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-3 py-1 rounded-full bg-[#b11226]/15 border border-[#b11226]/30 text-sm text-gray-100"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {event.about && (
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">About</h2>
                  <p className="text-gray-200 leading-relaxed">{event.about}</p>
                </div>
              )}

              {event.performers && event.performers.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold">Performers</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {event.performers.map((perf) => (
                      <div
                        key={perf.id || perf.performerName}
                        className="bg-white/5 border border-white/10 rounded-lg p-3 shadow-inner space-y-1"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-white leading-tight">{perf.performerName}</p>
                          {perf.performerLink && (
                            <a
                              href={perf.performerLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#f7c0c7] underline hover:text-white"
                            >
                              Link
                            </a>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {[perf.genre1, perf.genre2, perf.genre3]
                            .filter(Boolean)
                            .map((g) => (
                              <span
                                key={`${perf.performerName}-${g}`}
                                className="px-2 py-0.5 text-[11px] rounded-full bg-[#b11226]/15 border border-[#b11226]/30 text-gray-100"
                              >
                                {g}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
