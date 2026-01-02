import { useEffect, useState } from "react";
import AdminEventTable from "../../components/AdminEventTable";
import { adminEventService } from "../../services/adminEventService";
import { Event } from "../../types/event";

type Mode = "all" | "pending" | "live" | "disabled" | "deleted";

type Props = {
  mode: Mode;
};

const titleMap: Record<Mode, string> = {
  all: "All Events",
  pending: "Pending Approval",
  live: "Live Events",
  disabled: "Disabled Events",
  deleted: "Deleted Events",
};

const fetchByMode = (mode: Mode) => {
  switch (mode) {
    case "pending":
      return adminEventService.listPending;
    case "live":
      return adminEventService.listLive;
    case "disabled":
      return adminEventService.listDisabled;
    case "deleted":
      return adminEventService.listDeleted;
    case "all":
    default:
      return adminEventService.listAll;
  }
};

export default function AdminEventsPage({ mode }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notesById, setNotesById] = useState<Record<string, string>>({});
  const [actionId, setActionId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchByMode(mode)();
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [mode]);

  const updateNote = (id: string, value: string) => {
    setNotesById((prev) => ({ ...prev, [id]: value }));
  };

  const runAction = async (id: string, action: "approve" | "disable" | "delete" | "request") => {
    setActionId(`${id}-${action}`);
    setError("");
    try {
      if (action === "approve") {
        await adminEventService.approve(id);
      } else if (action === "disable") {
        await adminEventService.disable(id);
      } else if (action === "delete") {
        await adminEventService.delete(id);
      } else {
        await adminEventService.requestChanges(id, notesById[id] || "");
      }
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{titleMap[mode]}</h1>
        <p className="text-gray-400">Manage and moderate event submissions.</p>
      </div>

      {loading && <p className="text-gray-400">Loading...</p>}
      {error && <p className="text-red-400">{error}</p>}

      {!loading && (
        <AdminEventTable
          events={events}
          notesById={notesById}
          onNoteChange={updateNote}
          onApprove={(id) => runAction(id, "approve")}
          onDisable={(id) => runAction(id, "disable")}
          onDelete={(id) => runAction(id, "delete")}
          onRequestChanges={(id) => runAction(id, "request")}
          actionId={actionId}
        />
      )}
    </div>
  );
}
