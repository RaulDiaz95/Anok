import { motion } from "framer-motion";

const latestEvents = [
  {
    title: "Electric Paradise",
    location: "Miami, FL",
    date: "Nov 20, 2025",
    img: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Lollapalooza 2025",
    location: "Chicago, IL",
    date: "Aug 3, 2025",
    img: "https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Tomorrowland",
    location: "Boom, Belgium",
    date: "Jul 25, 2025",
    img: "https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Rock in Rio",
    location: "Rio de Janeiro, BR",
    date: "Sep 10, 2025",
    img: "https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Coachella 2026",
    location: "Indio, CA",
    date: "Apr 16, 2026",
    img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=80",
  },
  {
    title: "Soundwave Fest",
    location: "Melbourne, AU",
    date: "Jan 30, 2026",
    img: "https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1400&q=80",
  },
];

export default function LatestEvents() {
  return (
    <section className="relative w-full py-24 bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-[#0f0f1a] text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center text-[#b11226] mb-16 uppercase tracking-wide"
        >
          Latest Events
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestEvents.map((event, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="relative group overflow-hidden rounded-2xl shadow-lg cursor-pointer"
            >
              <img
                src={event.img}
                alt={event.title}
                className="w-full h-[380px] object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 transition duration-500 group-hover:opacity-90" />
              <div className="absolute bottom-0 p-6">
                <h3 className="text-2xl font-bold mb-2 text-[#b11226]">{event.title}</h3>
                <p className="text-gray-300 text-sm mb-1">{event.location}</p>
                <p className="text-gray-400 text-sm mb-4">{event.date}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="px-4 py-2 bg-[#b11226] text-white text-sm font-semibold rounded-md shadow-md hover:bg-[#d31a33] transition"
                >
                  More Info
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
