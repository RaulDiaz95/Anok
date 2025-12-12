import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { EventFlyerCard } from "../components/EventFlyerCard";
import { AnimatedLoader } from "../components/AnimatedLoader";
import { useInfiniteEvents } from "../hooks/useEvents";

export default function Events() {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error
  } = useInfiniteEvents();

  const events = data?.pages.flatMap((page) => page.content) ?? [];
  const hasEvents = events.length > 0;
  const isInitialLoading = isLoading && !hasEvents && !error;

  useEffect(() => {
    const loader = loaderRef.current;
    if (!loader || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "1500px",
        threshold: 0,
      }
    );

    observer.observe(loader);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white pt-32 pb-16 fade-in-up">
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
              className="px-6 py-3 bg-[#b11226] hover:bg-[#d31a33] rounded-xl text-white font-semibold transition-all shadow-lg shadow-[#b11226]/30 btn-animated pulse-soft"
            >
              Create Event
            </Link>
          </div>

          {isInitialLoading && (
            <div className="py-12 flex justify-center">
              <AnimatedLoader label="Loading events..." />
            </div>
          )}

          {error && (
            <div className="text-center text-red-400 mb-6">
              {error instanceof Error ? error.message : "Failed to load events"}
            </div>
          )}

          {!isLoading && !hasEvents && !error && (
            <div className="text-center text-gray-400">
              No events yet. Be the first to register one!
            </div>
          )}

          {hasEvents && (
            <div className="flex flex-wrap gap-5 md:gap-6 justify-center">
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

          {isFetchingNextPage && hasNextPage && (
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
