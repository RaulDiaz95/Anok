import { motion } from "framer-motion";
import autoAnimate from "@formkit/auto-animate";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { EventFlyerCard } from "../components/EventFlyerCard";
import { AnimatedLoader } from "../components/AnimatedLoader";
import { useInfiniteEvents } from "../hooks/useEvents";
import { useAuth } from "../contexts/AuthContext";

export default function Events() {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuth();
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error
  } = useInfiniteEvents();
  const sizeKey = useMemo(() => `flyerSize:${user?.email ?? "guest"}`, [user?.email]);
  const [flyerSize, setFlyerSize] = useState<"small" | "medium" | "large">("medium");
  const parentRef = useRef<HTMLDivElement | null>(null);

  const events = data?.pages.flatMap((page) => page.content) ?? [];
  const hasEvents = events.length > 0;
  const isInitialLoading = isLoading && !hasEvents && !error;
  const gridCols =
    flyerSize === "small"
      ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-5"
      : flyerSize === "large"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

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

  useEffect(() => {
    try {
      const saved = localStorage.getItem(sizeKey);
      if (saved === "small" || saved === "medium" || saved === "large") {
        setFlyerSize(saved);
      }
    } catch {
      // ignore
    }
  }, [sizeKey]);

  useEffect(() => {
    try {
      localStorage.setItem(sizeKey, flyerSize);
    } catch {
      // ignore
    }
  }, [flyerSize, sizeKey]);

  useEffect(() => {
    if (parentRef.current) {
      autoAnimate(parentRef.current, {
        duration: 180,
        easing: "ease-out",
      });
    }
  }, [parentRef]);

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
            <div className="flex items-center gap-4 flex-wrap justify-end">
              <div className="bg-white/5 border border-white/10 rounded-full px-2 py-1 flex items-center gap-1 text-sm text-gray-300">
                <span className="px-2 text-xs uppercase tracking-wide text-gray-400">Flyer Size</span>
                {(["small", "medium", "large"] as const).map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setFlyerSize(size)}
                    className={`px-3 py-1 rounded-full capitalize transition ${
                      flyerSize === size
                        ? "bg-[#b11226] text-white shadow-lg shadow-[#b11226]/30"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <Link
                to="/events/new"
                className="shrink-0 inline-flex items-center justify-center px-6 py-3 bg-[#b11226] hover:bg-[#d31a33] rounded-xl text-white font-semibold transition-all shadow-lg shadow-[#b11226]/30 btn-animated pulse-soft"
              >
                Create Event
              </Link>
            </div>
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
            <div ref={parentRef} className={`grid ${gridCols} gap-5 md:gap-6`}>
              {events.map((event) => (
                <div key={event.id}>
                  <EventFlyerCard event={event} size={flyerSize} />
                </div>
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
