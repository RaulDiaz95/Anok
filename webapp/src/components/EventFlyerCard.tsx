import { motion } from "framer-motion";
import { format } from "date-fns";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../types/event";

type Props = {
  event: Event;
};

const formatDateTime = (event: Event) => {
  const dt = event.eventDateTime || `${event.eventDate}T${event.startTime}`;
  try {
    return format(new Date(dt), "PPP p");
  } catch {
    return "Date to be confirmed";
  }
};

export function EventFlyerCard({ event }: Props) {
  const navigate = useNavigate();
  const dateLabel = useMemo(() => formatDateTime(event), [event]);

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/events/${event.id}`)}
      className="group relative w-full aspect-[2/3] overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1a2e] via-[#101018] to-[#0b0b12] border border-white/5 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#b11226]/60"
    >
      <div className="absolute inset-0">
        {event.flyerUrl ? (
          <img
            src={event.flyerUrl}
            alt={`${event.title} flyer`}
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#b11226]/40 via-[#0f0f1a] to-black flex items-center justify-center text-sm text-gray-200">
            No flyer
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <div className="space-y-1 transform translate-y-3 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <p className="text-xs uppercase tracking-wide text-gray-300">{dateLabel}</p>
          <h3
            className="text-lg font-semibold text-white leading-tight overflow-hidden"
            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
          >
            {event.title}
          </h3>
        </div>
      </div>
    </motion.button>
  );
}
