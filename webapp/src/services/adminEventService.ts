import { buildApiUrl } from "../config/env";
import { Event } from "../types/event";

export const adminEventService = {
  async listAll(): Promise<Event[]> {
    const res = await fetch(buildApiUrl("/admin/events/all"), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load events");
    return res.json();
  },
  async listPending(): Promise<Event[]> {
    const res = await fetch(buildApiUrl("/admin/events/pending"), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load pending events");
    return res.json();
  },
  async listLive(): Promise<Event[]> {
    const res = await fetch(buildApiUrl("/admin/events/live"), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load live events");
    return res.json();
  },
  async listDisabled(): Promise<Event[]> {
    const res = await fetch(buildApiUrl("/admin/events/disabled"), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load disabled events");
    return res.json();
  },
  async listDeleted(): Promise<Event[]> {
    const res = await fetch(buildApiUrl("/admin/events/deleted"), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load deleted events");
    return res.json();
  },
  async get(id: string): Promise<Event> {
    const res = await fetch(buildApiUrl(`/admin/events/${id}`), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load event");
    return res.json();
  },
  async approve(id: string): Promise<Event> {
    const res = await fetch(buildApiUrl(`/admin/events/${id}/approve`), {
      method: "PATCH",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to approve event");
    return res.json();
  },
  async disable(id: string): Promise<Event> {
    const res = await fetch(buildApiUrl(`/admin/events/${id}/disable`), {
      method: "PATCH",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to disable event");
    return res.json();
  },
  async delete(id: string, adminNotes: string): Promise<Event> {
    const res = await fetch(buildApiUrl(`/admin/events/${id}/delete`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ adminNotes }),
    });
    if (!res.ok) throw new Error("Failed to delete event");
    return res.json();
  },
  async requestChanges(id: string, adminNotes: string): Promise<Event> {
    const res = await fetch(buildApiUrl(`/admin/events/${id}/request-changes`), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ adminNotes }),
    });
    if (!res.ok) throw new Error("Failed to request changes");
    return res.json();
  },
};
