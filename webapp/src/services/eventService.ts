import { buildApiUrl } from "../config/env";
import { CreateEventInput, Event, PageResponse } from "../types/event";

class EventService {
  async list(page = 0, size = 20): Promise<PageResponse<Event>> {
    const response = await fetch(buildApiUrl(`/events?page=${page}&size=${size}`), {
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
      throw new Error(await this.extractError(response, "Failed to create event"));
    }

    return response.json();
  }

  async update(id: string, payload: CreateEventInput): Promise<Event> {
    const response = await fetch(buildApiUrl(`/events/${id}`), {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(await this.extractError(response, "Failed to update event"));
    }

    return response.json();
  }

  async listMine(): Promise<Event[]> {
    const response = await fetch(buildApiUrl("/events/mine"), {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Failed to load your events");
    }

    return response.json();
  }

  async get(id: string): Promise<Event> {
    const response = await fetch(buildApiUrl(`/events/${id}`), {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error("Event not found");
    }

    return response.json();
  }

  async toggleLive(id: string, isLive: boolean): Promise<Event> {
    const response = await fetch(buildApiUrl(`/events/${id}/live`), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ isLive }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || "Failed to update live status");
    }

    return response.json();
  }

  async uploadFlyer(file: File): Promise<string> {
    // Step 1: Get presigned URL from backend
    const formData = new FormData();
    formData.append("filename", file.name);
    formData.append("contentType", file.type);

    const presignResponse = await fetch(buildApiUrl("/upload-flyer"), {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!presignResponse.ok) {
      const error = await presignResponse.text();
      throw new Error(error || "Failed to get upload URL");
    }

    const { uploadUrl, bucket, key } = await presignResponse.json();

    // Step 2: Upload file directly to S3 using presigned URL
    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload file to S3");
    }

    // Step 3: Return permanent S3 URL (standard format)
    return `https://${bucket}.s3.amazonaws.com/${key}`;
  }

  private async extractError(response: Response, fallback: string): Promise<string> {
    try {
      const text = await response.text();
      if (!text) return fallback;
      const maybeJson = JSON.parse(text);
      if (maybeJson?.message) return maybeJson.message;
      return text;
    } catch (_e) {
      return fallback;
    }
  }
}

export const eventService = new EventService();
