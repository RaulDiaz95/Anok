import { AnimatePresence, motion } from "framer-motion";
import { addDays, isAfter, isBefore, isEqual, isThisWeek, isToday, isWeekend } from "date-fns";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/NavBar";
import { EventFlyerCard } from "../components/EventFlyerCard";
import { AnimatedLoader } from "../components/AnimatedLoader";
import PageContainer from "../components/PageContainer";
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
  const [selectedGenre, setSelectedGenre] = useState("All Genres");
  const [selectedDate, setSelectedDate] = useState("All Dates");
  const [selectedVicinity, setSelectedVicinity] = useState("Vicinity to Travel");
  const [advancedGenre1, setAdvancedGenre1] = useState("Any");
  const [advancedGenre2, setAdvancedGenre2] = useState("Any");
  const [advancedGenre3, setAdvancedGenre3] = useState("Any");
  const [customMode, setCustomMode] = useState<"none" | "specific" | "range">("none");
  const [customDate, setCustomDate] = useState<Date | null>(null);
  const [customStart, setCustomStart] = useState<Date | null>(null);
  const [customEnd, setCustomEnd] = useState<Date | null>(null);

  const resetFilters = () => {
    setSelectedGenre("All Genres");
    setSelectedDate("All Dates");
    setSelectedVicinity("Vicinity to Travel");
    setAdvancedGenre1("Any");
    setAdvancedGenre2("Any");
    setAdvancedGenre3("Any");
    setCustomMode("none");
    setCustomDate(null);
    setCustomStart(null);
    setCustomEnd(null);
  };

  const events = data?.pages.flatMap((page) => page.content) ?? [];
  const approvedEvents = useMemo(
    () => events.filter((event) => event.status === "APPROVED"),
    [events]
  );
  const hasEvents = approvedEvents.length > 0;
  const isInitialLoading = isLoading && !hasEvents && !error;
  const gridCols =
    flyerSize === "small"
      ? "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8"
      : flyerSize === "large"
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7";

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
    if (selectedVicinity !== "Custom") {
      setCustomMode("none");
    }
  }, [selectedVicinity]);

  const baseGenreOptions = useMemo(
    () => [
      "Rock",
      "Pop",
      "Hip-Hop/Rap",
      "Classical",
      "Jazz",
      "Electronic",
      "Country",
      "Blues",
      "Reggae",
      "Folk",
      "R&B/Soul",
      "Gospel",
      "Funk",
      "World Music",
      "Opera",
    ],
    []
  );

  const genreOptions = useMemo(() => ["All Genres", ...baseGenreOptions], [baseGenreOptions]);

  const dateOptions = useMemo(
    () => ["All Dates", "Today", "This Week", "This Weekend", "Next 7 Days", "Next 30 Days"],
    []
  );

  const vicinityOptions = useMemo(
    () => [
      "Vicinity to Travel",
      "35 miles",
      "70 miles",
      "100 miles",
      "more than 100 miles",
      "Custom",
    ],
    []
  );

  const filteredEvents = useMemo(() => {
    const isSameDay = (left: Date, right: Date) =>
      left.getFullYear() === right.getFullYear() &&
      left.getMonth() === right.getMonth() &&
      left.getDate() === right.getDate();

    const parseEventDate = (event: typeof events[number]) => {
      const dt = event.eventDateTime || `${event.eventDate}T${event.startTime}`;
      const eventDate = new Date(dt);
      if (Number.isNaN(eventDate.getTime())) return null;
      return eventDate;
    };

    const matchGenre = (event: typeof events[number]) => {
      const performers = event.performers ?? [];
      const hasAdvancedFilters =
        advancedGenre1 !== "Any" || advancedGenre2 !== "Any" || advancedGenre3 !== "Any";

      return performers.some((performer) => {
        const matchesSimple =
          selectedGenre === "All Genres" || performer.genre1?.trim() === selectedGenre;
        if (!matchesSimple) return false;
        if (!hasAdvancedFilters) return true;

        const matchesAdvanced1 =
          advancedGenre1 === "Any" || performer.genre1?.trim() === advancedGenre1;
        const matchesAdvanced2 =
          advancedGenre2 === "Any" || performer.genre2?.trim() === advancedGenre2;
        const matchesAdvanced3 =
          advancedGenre3 === "Any" || performer.genre3?.trim() === advancedGenre3;

        return matchesAdvanced1 && matchesAdvanced2 && matchesAdvanced3;
      });
    };

    const matchDate = (event: typeof events[number]) => {
      if (selectedDate === "All Dates") return true;
      const dt = event.eventDateTime || `${event.eventDate}T${event.startTime}`;
      const eventDate = new Date(dt);
      if (Number.isNaN(eventDate.getTime())) return false;
      const now = new Date();

      switch (selectedDate) {
        case "Today":
          return isToday(eventDate);
        case "This Week":
          return isThisWeek(eventDate);
        case "This Weekend":
          return isThisWeek(eventDate) && isWeekend(eventDate);
        case "Next 7 Days": {
          const end = addDays(now, 7);
          return (isAfter(eventDate, now) || isEqual(eventDate, now)) &&
            (isBefore(eventDate, end) || isEqual(eventDate, end));
        }
        case "Next 30 Days": {
          const end = addDays(now, 30);
          return (isAfter(eventDate, now) || isEqual(eventDate, now)) &&
            (isBefore(eventDate, end) || isEqual(eventDate, end));
        }
        default:
          return true;
      }
    };

    const matchCustom = (event: typeof events[number]) => {
      if (selectedVicinity !== "Custom") return true;
      if (customMode === "specific" && customDate) {
        const eventDate = parseEventDate(event);
        return eventDate ? isSameDay(eventDate, customDate) : false;
      }
      if (customMode === "range" && customStart && customEnd) {
        const eventDate = parseEventDate(event);
        if (!eventDate) return false;
        return (
          (isAfter(eventDate, customStart) || isEqual(eventDate, customStart)) &&
          (isBefore(eventDate, customEnd) || isEqual(eventDate, customEnd))
        );
      }
      return true;
    };

    return approvedEvents.filter(matchGenre).filter(matchDate).filter(matchCustom);
  }, [
    approvedEvents,
    selectedGenre,
    selectedDate,
    advancedGenre1,
    advancedGenre2,
    advancedGenre3,
    selectedVicinity,
    customMode,
    customDate,
    customStart,
    customEnd,
  ]);

  const hasFilteredEvents = filteredEvents.length > 0;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white pt-32 pb-16 fade-in-up">
        <PageContainer>
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

          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4 mb-4">
            <label className="flex flex-col gap-2 text-sm text-gray-300 w-full md:w-auto">
              <span className="text-xs uppercase tracking-wide text-gray-400">Genre</span>
              <select
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full md:w-56 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b11226]/60"
              >
                {genreOptions.map((option) => (
                  <option key={option} value={option} className="text-black">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-300 w-full md:w-auto">
              <span className="text-xs uppercase tracking-wide text-gray-400">Date</span>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full md:w-48 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b11226]/60"
              >
                {dateOptions.map((option) => (
                  <option key={option} value={option} className="text-black">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm text-gray-300 w-full md:w-auto">
              <span className="text-xs uppercase tracking-wide text-gray-400">Vicinity to Travel</span>
              <select
                value={selectedVicinity}
                onChange={(e) => setSelectedVicinity(e.target.value)}
                className="w-full md:w-52 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b11226]/60"
              >
                {vicinityOptions.map((option) => (
                  <option key={option} value={option} className="text-black">
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="button"
              onClick={resetFilters}
              className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 text-sm rounded-xl border border-white/10 bg-white/5 text-gray-200 hover:bg-white/10 transition"
            >
              Reset Filters
            </button>
          </div>

          <AnimatePresence initial={false}>
            {selectedVicinity === "Custom" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-hidden mb-8"
              >
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="text-xs uppercase tracking-wide text-gray-400 mb-3">Filter type:</div>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <button
                      type="button"
                      onClick={() => setCustomMode("specific")}
                      className={`px-4 py-2 rounded-lg text-sm transition border ${
                        customMode === "specific"
                          ? "bg-[#b11226] text-white border-[#b11226]"
                          : "bg-white/5 text-gray-200 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      Specific date
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomMode("range")}
                      className={`px-4 py-2 rounded-lg text-sm transition border ${
                        customMode === "range"
                          ? "bg-[#b11226] text-white border-[#b11226]"
                          : "bg-white/5 text-gray-200 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      Date range
                    </button>
                  </div>

                  {customMode === "specific" && (
                    <label className="flex flex-col gap-2 text-sm text-gray-300">
                      <span className="text-xs uppercase tracking-wide text-gray-400">Date</span>
                      <input
                        type="date"
                        value={customDate ? customDate.toISOString().slice(0, 10) : ""}
                        onChange={(e) =>
                          setCustomDate(e.target.value ? new Date(e.target.value) : null)
                        }
                        className="w-full md:w-56 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b11226]/60"
                      />
                    </label>
                  )}

                  {customMode === "range" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col gap-2 text-sm text-gray-300">
                        <span className="text-xs uppercase tracking-wide text-gray-400">Start</span>
                        <input
                          type="date"
                          value={customStart ? customStart.toISOString().slice(0, 10) : ""}
                          onChange={(e) =>
                            setCustomStart(e.target.value ? new Date(e.target.value) : null)
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b11226]/60"
                        />
                      </label>
                      <label className="flex flex-col gap-2 text-sm text-gray-300">
                        <span className="text-xs uppercase tracking-wide text-gray-400">End</span>
                        <input
                          type="date"
                          value={customEnd ? customEnd.toISOString().slice(0, 10) : ""}
                          onChange={(e) =>
                            setCustomEnd(e.target.value ? new Date(e.target.value) : null)
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#b11226]/60"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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

          {hasEvents && !hasFilteredEvents && (
            <div className="text-center text-gray-400">
              No events match your filters.
            </div>
          )}

          {hasFilteredEvents && (
            <div className={`grid ${gridCols} gap-5 md:gap-6`}>
              {filteredEvents.map((event) => (
                <motion.div key={event.id} layout>
                  <EventFlyerCard event={event} size={flyerSize} />
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
        </PageContainer>
      </div>
    </>
  );
}
