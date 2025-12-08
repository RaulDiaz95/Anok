import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const events = [
  {
    id: 1,
    title: "Imagine Dragons",
    location: "New York, NY",
    date: "Dec 10, 2025",
    img: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
    description:
      "Experience an electrifying night with Imagine Dragons — a fusion of rock, pop, and pure emotion.",
  },
  {
    id: 2,
    title: "Billie Eilish",
    location: "Chicago, IL",
    date: "Jan 15, 2026",
    img: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=1400&q=80",
    description:
      "Billie returns with her most intimate performance yet — dark pop, cinematic visuals, and raw energy.",
  },
  {
    id: 3,
    title: "The Weeknd",
    location: "Los Angeles, CA",
    date: "Feb 22, 2026",
    img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80",
    description:
      "Dive into The Weeknd's world of neon lights and hypnotic beats — a once-in-a-lifetime show.",
  },
  {
    id: 4,
    title: "Coldplay",
    location: "London, UK",
    date: "Mar 30, 2026",
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
    description:
      "A colorful celebration of sound and emotion — Coldplay's most immersive world tour yet.",
  },
];

interface UpcomingShowsProps {
  id?: string;
}

export default function UpcomingShows({ id }: UpcomingShowsProps) {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [manualSwitch, setManualSwitch] = useState(false);

  useEffect(() => {
    if (manualSwitch) {
      const timeout = setTimeout(() => setManualSwitch(false), 8000);
      return () => clearTimeout(timeout);
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % events.length);
    }, 7000);
    return () => clearInterval(interval);
  }, [manualSwitch]);

  const activeEvent = events[activeIndex];

  return (
    <section
      id={id}
      className="relative w-full min-h-[90vh] overflow-hidden bg-[#0f0f1a] text-white flex flex-col justify-between"
    >
      {/* Fondo difuminado */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeEvent.img}
          className="absolute inset-0 bg-cover bg-center blur-3xl scale-110 opacity-60"
          style={{ backgroundImage: `url(${activeEvent.img})` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

      {/* Título de sección */}
      <div className="relative z-10 pt-10 text-center">
        <h2 className="text-2xl md:text-4xl font-bold text-[#b11226] uppercase tracking-wide">
          Upcoming Shows & Tickets
        </h2>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-6 lg:px-24 mt-6 lg:mt-0 gap-8">
        <motion.div
          key={activeEvent.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left max-w-lg"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#b11226] mb-3">
            {activeEvent.title}
          </h2>
          <p className="text-gray-300 mb-1">{activeEvent.location}</p>
          <p className="text-[#b11226] font-medium mb-5">{activeEvent.date}</p>
          <p className="text-gray-200 mb-6 px-3 lg:px-0">
            {activeEvent.description}
          </p>
          <button
            onClick={() => navigate(`/events/${events[activeIndex]?.id || activeIndex + 1}`)}
            className="px-6 py-3 bg-[#b11226] hover:bg-[#d31a33] rounded-md text-white font-semibold transition-all shadow-lg hover:shadow-[#b11226]/50"
          >
            More Info
          </button>
        </motion.div>

        {/* Imagen */}
        <motion.img
          key={activeEvent.img}
          src={activeEvent.img}
          alt={activeEvent.title}
          className="w-[90%] sm:w-[80%] md:w-[450px] h-[300px] md:h-[600px] object-cover rounded-xl shadow-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Thumbnails */}
      <div className="relative z-10 flex justify-center gap-3 py-6">
        {events.map((event, i) => (
          <button
            key={i}
            onClick={() => {
              setActiveIndex(i);
              setManualSwitch(true);
            }}
            className={`w-16 h-12 md:w-20 md:h-14 rounded-md overflow-hidden border-2 transition-all ${
              i === activeIndex
                ? "border-[#b11226] scale-110"
                : "border-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={event.img}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
