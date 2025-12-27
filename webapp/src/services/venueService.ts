import { buildApiUrl } from "../config/env";

export type VenueSearchResult = {
  id: string;
  name: string;
  address?: string;
  postalCode?: string;
  city: string;
  state: string;
  country: string;
  capacity?: number;
  verified?: boolean;
  usageCount?: number;
};

export type SimilarVenueResult = VenueSearchResult & {
  similarityScore?: number;
  heroPhoto?: string | null;
};

const BASE_URL = buildApiUrl("/venues");

export const venueService = {
  async searchVenues(query: string): Promise<VenueSearchResult[]> {
    if (!query.trim()) return [];
    const url = `${BASE_URL}/search?query=${encodeURIComponent(query.trim())}`;
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
      throw new Error("Failed to search venues");
    }
    const data = await response.json();
    return Array.isArray(data)
        ? data.map((v) => ({
          id: v.id,
          name: v.name,
          address: v.address,
          postalCode: v.postalCode,
          city: v.city,
          state: v.state,
          country: v.country,
          capacity: typeof v.capacity === "number" ? v.capacity : undefined,
          verified: Boolean(v.verified),
          usageCount: typeof v.usageCount === "number" ? v.usageCount : undefined,
        }))
      : [];
  },

  async getSmartSuggestions(userId?: string) {
    const params = userId ? `?userId=${encodeURIComponent(userId)}` : "";
    const response = await fetch(`${BASE_URL}/smart-suggestions${params}`, { credentials: "include" });
    if (!response.ok) {
      throw new Error("Failed to load venue suggestions");
    }
    return response.json();
  },

  async getVenueProfile(id: string) {
    const response = await fetch(`${BASE_URL}/${id}`, { credentials: "include" });
    if (!response.ok) {
      throw new Error("Failed to load venue profile");
    }
    return response.json();
  },

  async getSimilarVenues(id: string): Promise<SimilarVenueResult[]> {
    const response = await fetch(`${BASE_URL}/${id}/similar`, { credentials: "include" });
    if (!response.ok) {
      throw new Error("Failed to load similar venues");
    }
    const data = await response.json();
    return Array.isArray(data)
      ? data.map((v) => ({
          id: v.id,
          name: v.name,
          city: v.city,
          state: v.state,
          country: v.country,
          verified: Boolean(v.verified),
          usageCount: typeof v.usageCount === "number" ? v.usageCount : undefined,
          similarityScore: typeof v.similarityScore === "number" ? v.similarityScore : undefined,
          heroPhoto: v.heroPhoto || null,
        }))
      : [];
  },
};
