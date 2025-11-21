import { buildApiUrl } from "../config/env";
import { CreateEventInput, Event } from "../types/event";

class EventService {
  async list(): Promise<Event[]> {
    const response = await fetch(buildApiUrl("/events"), {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to load events");
    }

    return response.json();
  }

  async create(payload: CreateEventInput): Promise<Event> {
    const response = await fetch(buildApiUrl("/events"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to create event");
    }

    return response.json();
  }

  async uploadFlyer(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(buildApiUrl("/upload-flyer"), {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to upload flyer");
    }

    const data = await response.json();
    return data.url;
  }
}

export const eventService = new EventService();
