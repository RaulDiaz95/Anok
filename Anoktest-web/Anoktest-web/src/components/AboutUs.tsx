import { motion } from "framer-motion";

interface AboutUsProps {
  id?: string;
}

export default function AboutUs({ id }: AboutUsProps) {
  return (
    <section
      id="about"
      className="relative py-32 px-6 md:px-20 lg:px-32 overflow-hidden bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-[#0a0a13]"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,rgba(177,18,38,0.25)_0%,rgba(0,0,0,1)_70%)]"></div>

      <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
        {/* Imagen animada */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 flex justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=900&q=80"
            alt="About our concerts"
            className="rounded-3xl shadow-2xl border border-[#b11226]/30 w-[90%] lg:w-[80%]"
          />
        </motion.div>

        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 text-center lg:text-left"
        >
          <h2 className="text-5xl font-bold mb-6 text-[#b11226] uppercase tracking-wide">
            About Us
          </h2>

          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            We bring people together through the universal language of music.
            From intimate venues to world-class festivals, <span className="text-[#b11226] font-semibold">AnokEvents</span> curates unforgettable experiences for every rhythm lover.
          </p>

          <p className="text-gray-400 text-base leading-relaxed mb-10">
            Our mission is to empower artists, inspire audiences, and create
            spaces where passion, creativity, and community collide in harmony.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
            <button className="bg-[#b11226] hover:bg-[#d31a33] text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-[#b11226]/50">
              Join the Experience
            </button>
            <button className="border border-[#b11226] text-[#b11226] hover:bg-[#b11226]/20 px-6 py-3 rounded-lg font-semibold transition-all duration-300">
              Learn More
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
