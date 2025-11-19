import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const events = [
  {
    id: 1,
    title: "Imagine Dragons",
    location: "New York, NY",
    date: "Dec 10, 2025",
    img: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80",
    description:
      "Experience an electrifying night with Imagine Dragons — a fusion of rock, pop, and pure emotion.",
    map: "https://www.google.com/maps?q=New+York,+NY&output=embed",
  },
  {
    id: 2,
    title: "Billie Eilish",
    location: "Chicago, IL",
    date: "Jan 15, 2026",
    img: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=1400&q=80",
    description:
      "Billie returns with her most intimate performance yet — dark pop, cinematic visuals, and raw energy.",
    map: "https://www.google.com/maps?q=Chicago,+IL&output=embed",
  },
  {
    id: 3,
    title: "The Weeknd",
    location: "Los Angeles, CA",
    date: "Feb 22, 2026",
    img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1400&q=80",
    description:
      "Dive into The Weeknd’s world of neon lights and hypnotic beats — a once-in-a-lifetime show.",
    map: "https://www.google.com/maps?q=Los+Angeles,+CA&output=embed",
  },
  {
    id: 4,
    title: "Coldplay",
    location: "London, UK",
    date: "Mar 30, 2026",
    img: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1400&q=80",
    description:
      "A colorful celebration of sound and emotion — Coldplay’s most immersive world tour yet.",
    map: "https://www.google.com/maps?q=London,+UK&output=embed",
  },
];

export default function EventDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const event = events.find((e) => e.id === parseInt(id || "0"));

  const [gallery, setGallery] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (!event) return;
    // Usa imágenes de respaldo tipo Unsplash
    setGallery([
      "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4",
      "https://images.unsplash.com/photo-1525186402429-b4ff38bedec6",
    ]);
  }, [event]);

  if (!event) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-white bg-[#0f0f1a]">
        <h1 className="text-3xl font-bold text-[#b11226] mb-4">Event not found</h1>
        <button
          onClick={() => navigate("/")}
          className="text-[#b11226] underline hover:text-[#d31a33] transition-all"
        >
          ← Back to Events
        </button>
      </div>
    );
  }

  return (
    <section className="min-h-screen text-white bg-[#0f0f1a] relative overflow-hidden py-16">
      {/* Fondo cinematográfico */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center blur-3xl opacity-30 scale-110"
        style={{ backgroundImage: `url(${event.img})` }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      ></motion.div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-12">
        {/* Botón volver */}
        <button
          onClick={() => navigate("/")}
          className="text-[#b11226] hover:text-[#d31a33] mb-8 font-semibold transition-all flex items-center gap-2"
        >
          ← Back to Events
        </button>

        {/* Contenido principal */}
        <div className="flex flex-col lg:flex-row items-center gap-12 bg-black/30 backdrop-blur-lg rounded-2xl p-8 border border-[#b11226]/20 shadow-2xl">
          {/* Imagen del evento */}
          <motion.img
            src={event.img}
            alt={event.title}
            className="w-full lg:w-[460px] h-[400px] object-cover rounded-xl border border-[#b11226]/30 shadow-lg"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          />

          {/* Detalles */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <h1 className="text-5xl font-extrabold text-[#b11226] mb-4 drop-shadow-[0_0_10px_rgba(177,18,38,0.6)]">
              {event.title}
            </h1>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#b11226]">
                  Date and Time
                </h3>
                <p className="text-gray-300">{event.date}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#b11226]">
                  Location
                </h3>
                <p className="text-gray-300">{event.location}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-[#b11226]">
                  About this event
                </h3>
                <p className="text-gray-300">{event.description}</p>
              </div>
            </div>

            {/* Mapa */}
            <div className="rounded-xl overflow-hidden border border-[#b11226]/30 shadow-lg mt-8 mb-8">
              <iframe
                title="event-map"
                src={event.map}
                width="100%"
                height="250"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
             {/*
            <button className="px-8 py-3 bg-[#b11226] hover:bg-[#d31a33] rounded-md text-white font-semibold transition-all shadow-lg hover:shadow-[#b11226]/50">
              Buy Tickets
            </button>*/}
          </motion.div>
        </div>

        {/* Galería */}
        <div className="mt-16">
          <h3 className="text-2xl font-semibold text-[#b11226] mb-6">
            Gallery
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {gallery.map((img, index) => (
              <motion.img
                key={index}
                src={img}
                alt="Concert"
                onClick={() => setSelectedImage(img)}
                className="rounded-xl border border-[#b11226]/30 object-cover w-full h-48 cursor-pointer hover:scale-105 transition-transform duration-300 shadow-lg hover:shadow-[#b11226]/30"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.15 }}
              />
            ))}
          </div>
        </div>

        {/* Modal de imagen ampliada */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.img
                src={selectedImage}
                alt="Full view"
                className="max-w-4xl max-h-[80vh] rounded-xl border border-[#b11226]/50 shadow-2xl"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-10 right-10 text-white text-2xl bg-[#b11226] hover:bg-[#d31a33] px-4 py-2 rounded-lg"
              >
                ✕
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
