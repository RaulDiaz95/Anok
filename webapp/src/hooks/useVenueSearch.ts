import { useEffect, useRef, useState } from "react";
import { venueService, VenueSearchResult } from "../services/venueService";

type UseVenueSearchResult = {
  query: string;
  setQuery: (q: string) => void;
  results: VenueSearchResult[];
  isLoading: boolean;
  error: string;
};

const DEBOUNCE_MS = 320;

export function useVenueSearch(initialQuery = ""): UseVenueSearchResult {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<VenueSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const requestId = useRef(0);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setError("");
      return;
    }

    const currentRequest = ++requestId.current;
    const timeout = setTimeout(async () => {
      setIsLoading(true);
      setError("");
      try {
        const data = await venueService.searchVenues(trimmed);
        // Ignore stale responses
        if (currentRequest === requestId.current) {
          setResults(data);
        }
      } catch (e) {
        if (currentRequest === requestId.current) {
          setError(e instanceof Error ? e.message : "Failed to search venues");
          setResults([]);
        }
      } finally {
        if (currentRequest === requestId.current) {
          setIsLoading(false);
        }
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(timeout);
  }, [query]);

  return { query, setQuery, results, isLoading, error };
}
