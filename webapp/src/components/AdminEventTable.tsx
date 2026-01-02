import { format } from "date-fns";
import { Event } from "../types/event";

type Props = {
  events: Event[];
  notesById: Record<string, string>;
  onNoteChange: (id: string, value: string) => void;
  onApprove: (id: string) => void;
  onDisable: (id: string) => void;
  onDelete: (id: string) => void;
  onRequestChanges: (id: string) => void;
  actionId: string | null;
};

const formatDateTime = (event: Event) => {
  const dt = event.eventDateTime || `${event.eventDate}T${event.startTime}`;
  try {
    return format(new Date(dt), "MM/dd/yyyy h:mm a");
  } catch {
    return event.eventDate || "TBD";
  }
};

export default function AdminEventTable({
  events,
  notesById,
  onNoteChange,
  onApprove,
  onDisable,
  onDelete,
  onRequestChanges,
  actionId,
}: Props) {
  return (
    <div className="bg-[#1a1a2e]/70 border border-[#b11226]/10 rounded-2xl shadow-lg w-full overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-white/5 text-gray-300 uppercase text-xs tracking-wide">
          <tr>
            <th className="px-4 py-3 text-left">Flyer</th>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Date</th>
            <th className="px-4 py-3 text-left">Venue</th>
            <th className="px-4 py-3 text-left">Genres</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Admin Notes</th>
            <th className="px-4 py-3 text-left">Submitted By</th>
            <th className="px-4 py-3 text-left">Performers</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#b11226]/10">
          {events.length === 0 && (
            <tr>
              <td className="px-4 py-6 text-gray-400 text-center" colSpan={10}>
                No events found.
              </td>
            </tr>
          )}
          {events.map((event) => (
            <tr key={event.id} className="hover:bg-white/5 transition">
              <td className="px-4 py-3">
                {event.flyerUrl ? (
                  <div className="w-16 h-20 rounded-lg overflow-hidden border border-white/10 bg-white/5">
                    <img
                      src={event.flyerUrl}
                      alt={`${event.title} flyer`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-16 h-20 rounded-lg border border-dashed border-white/15 bg-white/5 text-[10px] text-gray-400 flex items-center justify-center text-center px-1">
                    No flyer
                  </div>
                )}
              </td>
              <td className="px-4 py-3 font-semibold text-white">
                <div>{event.title}</div>
                {event.venueCity && (
                  <div className="text-xs text-gray-400">{event.venueCity}</div>
                )}
              </td>
              <td className="px-4 py-3 text-gray-300">{formatDateTime(event)}</td>
              <td className="px-4 py-3 text-gray-300">
                <div className="font-semibold text-white">{event.venueName}</div>
                <div className="text-xs text-gray-400">{event.venueAddress}</div>
              </td>
              <td className="px-4 py-3 text-gray-300">
                <div className="flex flex-wrap gap-1">
                  {event.genres?.length
                    ? event.genres.map((genre) => (
                        <span
                          key={`${event.id}-${genre}`}
                          className="px-2 py-0.5 text-[11px] rounded-full bg-[#b11226]/15 border border-[#b11226]/30 text-gray-100"
                        >
                          {genre}
                        </span>
                      ))
                    : "-"}
                </div>
              </td>
              <td className="px-4 py-3 text-gray-300 capitalize">
                {event.status?.toLowerCase().replaceAll("_", " ")}
              </td>
              <td className="px-4 py-3 text-gray-300">
                {event.adminNotes || "-"}
              </td>
              <td className="px-4 py-3 text-gray-300">
                {event.submittedByUser || event.ownerName || event.ownerEmail || "-"}
              </td>
              <td className="px-4 py-3 text-gray-300">
                {event.performers?.length
                  ? event.performers.map((p) => p.performerName).join(", ")
                  : "-"}
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex flex-col gap-2 items-end">
                  <div className="flex flex-wrap gap-2 justify-end">
                    <button
                      onClick={() => onApprove(event.id)}
                      disabled={actionId === `${event.id}-approve`}
                      className="px-3 py-1 rounded-lg text-xs bg-green-600 hover:bg-green-700 text-white transition disabled:opacity-50"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onDisable(event.id)}
                      disabled={actionId === `${event.id}-disable`}
                      className="px-3 py-1 rounded-lg text-xs bg-yellow-600 hover:bg-yellow-700 text-white transition disabled:opacity-50"
                    >
                      Disable
                    </button>
                    <button
                      onClick={() => onDelete(event.id)}
                      disabled={actionId === `${event.id}-delete`}
                      className="px-3 py-1 rounded-lg text-xs bg-red-600 hover:bg-red-700 text-white transition disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                  <div className="w-full">
                    <textarea
                      value={notesById[event.id] || ""}
                      onChange={(e) => onNoteChange(event.id, e.target.value)}
                      placeholder="Admin note"
                      rows={2}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#b11226]/60"
                    />
                    <button
                      onClick={() => onRequestChanges(event.id)}
                      disabled={actionId === `${event.id}-request`}
                      className="mt-2 w-full px-3 py-1 rounded-lg text-xs bg-[#b11226] hover:bg-[#d31a33] text-white transition disabled:opacity-50"
                    >
                      Request Changes
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

