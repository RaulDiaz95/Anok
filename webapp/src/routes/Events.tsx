import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { EventFlyerCard } from "../components/EventFlyerCard";
import { eventService } from "../services/eventService";
import { Event } from "../types/event";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const PAGE_SIZE = 20;

  const loadEvents = useCallback(
    async (pageToLoad: number) => {
      if (loading) return;
      setLoading(true);
      if (pageToLoad === 0) setIsLoading(true);
      setError("");
      try {
        const data = await eventService.list(pageToLoad, PAGE_SIZE);
        const newEvents = data.filter((evt) => evt.isLive);
        setEvents((prev) => (pageToLoad === 0 ? newEvents : [...prev, ...newEvents]));
        if (newEvents.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
        setPage(pageToLoad + 1);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events");
        setHasMore(false);
      } finally {
        setLoading(false);
        setIsLoading(false);
      }
    },
    [loading, PAGE_SIZE]
  );

  useEffect(() => {
    loadEvents(0);
  }, [loadEvents]);

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !loading) {
          loadEvents(page);
        }
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0,
      }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasMore, loadEvents, loading, page]);

  const hasEvents = events.length > 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold mb-3"
              >
                Discover Live Events
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-400 max-w-2xl"
              >
                A visual gallery of what&apos;s happening. Hover to reveal the details, click to dive into the full lineup.
              </motion.p>
            </div>
            <Link
              to="/events/new"
              className="px-6 py-3 bg-[#b11226] hover:bg-[#d31a33] rounded-xl text-white font-semibold transition-all shadow-lg shadow-[#b11226]/30"
            >
              Create Event
            </Link>
          </div>

          {isLoading && (
            <div className="text-center text-gray-400">Loading events...</div>
          )}

          {error && (
            <div className="text-center text-red-400 mb-6">{error}</div>
          )}

          {!isLoading && !hasEvents && !error && (
            <div className="text-center text-gray-400">
              No events yet. Be the first to register one!
            </div>
          )}

          {hasEvents && (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 md:gap-6">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <EventFlyerCard event={event} />
                </motion.div>
              ))}
            </div>
          )}

          {loading && hasMore && (
            <div className="flex justify-center py-8">
              <div className="h-10 w-10 rounded-full border-2 border-white/20 border-t-[#b11226] animate-spin" />
            </div>
          )}

          <div ref={loaderRef} className="h-4" />
        </div>
      </div>
    </>
  );
}
