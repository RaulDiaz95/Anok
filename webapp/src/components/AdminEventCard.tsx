import { format, parseISO } from "date-fns";
import { Event } from "../types/event";
import { FlyerFrame } from "./FlyerFrame";

type Props = {
  event: Event;
  onReview: (id: string) => void;
};

export function AdminEventCard({ event, onReview }: Props) {
  const dateLabel = (() => {
    try {
      return format(parseISO(event.eventDate), "MM/dd/yyyy");
    } catch {
      return event.eventDate;
    }
  })();

  return (
    <div className="bg-[#0f0f1a]/80 border border-white/10 rounded-xl p-4 flex gap-4 items-center">
      <FlyerFrame src={event.flyerUrl} alt={event.title} size="sm" />
      <div className="flex-1 space-y-1 min-w-0">
        <p className="text-xs text-gray-400">{dateLabel}</p>
        <h3 className="text-lg font-semibold text-white truncate">{event.title}</h3>
        {event.performers?.length > 0 && (
          <p className="text-xs text-gray-400 truncate">
            {event.performers.map((p) => p.performerName).join(", ")}
          </p>
        )}
      </div>
      <button
        onClick={() => onReview(event.id)}
        className="px-4 py-2 bg-[#b11226] hover:bg-[#d31a33] text-white rounded-lg text-sm shrink-0"
      >
        Review
      </button>
    </div>
  );
}
