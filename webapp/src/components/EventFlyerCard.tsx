import { motion } from "framer-motion";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Event } from "../types/event";

type Props = {
  event: Event;
  size?: "small" | "medium" | "large";
  className?: string;
};

const formatDateTime = (event: Event) => {
  const dt = event.eventDateTime || `${event.eventDate}T${event.startTime}`;
  try {
    return format(new Date(dt), "MM/dd/yyyy h:mm a");
  } catch {
    return "Date to be confirmed";
  }
};

export function EventFlyerCard({ event, size = "medium", className }: Props) {
  const navigate = useNavigate();
  const dateLabel = useMemo(() => formatDateTime(event), [event]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const sizeClasses = useMemo(() => {
    switch (size) {
      case "small":
        return "text-sm";
      case "large":
        return "text-base";
      case "medium":
      default:
        return "text-sm";
    }
  }, [size]);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const rect = (e.currentTarget as HTMLButtonElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 4;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 4;
    setTilt({ x, y });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.button
      type="button"
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/events/${event.id}`)}
      className={`group relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-gradient-to-br from-[#1a1a2e] via-[#101018] to-[#0b0b12] border border-white/5 shadow-lg focus:outline-none focus:ring-2 focus:ring-[#b11226]/60 card-enter glow-outline transform-gpu outline outline-1 outline-red-500 ${sizeClasses} ${className ?? ""}`}
      style={{ rotateX: tilt.y, rotateY: tilt.x, transition: "transform 0.25s ease" }}
    >
      <div className="absolute inset-0">
        {event.flyerUrl ? (
          <div className="aspect-[2/3] w-full h-full rounded-xl overflow-hidden relative">
            <img
              src={event.flyerUrl}
              alt={`${event.title} flyer`}
              className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-300 ease-out group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-[2/3] w-full h-full rounded-xl bg-black/40 border border-white/10 flex items-center justify-center text-sm text-gray-400">
            No flyer
          </div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/60 to-black/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          boxShadow: "0 0 25px rgba(177, 18, 38, 0.45)",
        }}
      />

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
