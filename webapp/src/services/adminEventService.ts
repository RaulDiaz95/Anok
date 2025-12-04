import { buildApiUrl } from "../config/env";
import { Event } from "../types/event";

export const adminEventService = {
  async listPending(): Promise<Event[]> {
    const res = await fetch(buildApiUrl("/admin/events/pending"), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load pending events");
    return res.json();
  },
  async get(id: string): Promise<Event> {
    const res = await fetch(buildApiUrl(`/admin/events/${id}`), { credentials: "include" });
    if (!res.ok) throw new Error("Failed to load event");
    return res.json();
  },
  async approve(id: string): Promise<Event> {
    const res = await fetch(buildApiUrl(`/admin/events/${id}/approve`), {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to approve event");
    return res.json();
  },
  async reject(id: string): Promise<Event> {
    const res = await fetch(buildApiUrl(`/admin/events/${id}/reject`), {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to reject event");
    return res.json();
  },
};
