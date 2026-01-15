import { motion } from "framer-motion";

export default function SupportResources() {
  const faqs = [
    { q: "How do I make my event live?", a: "Toggle Live in My Events after approval." },
    { q: "Where can I upload flyers?", a: "Use the Create Event flow or edit an existing event." },
    { q: "Need admin support?", a: "Email support@anokevents.com with your event ID." },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Support & Resources</h1>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg space-y-4"
      >
        <h2 className="text-lg font-semibold">Contact</h2>
        <p className="text-gray-300">
          Reach us at <a href="mailto:support@anokevents.com" className="text-[#f25f6b] underline">support@anokevents.com</a>
        </p>
        <form className="grid md:grid-cols-2 gap-4">
          <input className="px-3 py-2 bg-[#0f0f1a]/60 border border-white/10 rounded-lg text-white" placeholder="Your email" />
          <input className="px-3 py-2 bg-[#0f0f1a]/60 border border-white/10 rounded-lg text-white md:col-span-1" placeholder="Topic" />
          <textarea className="px-3 py-2 bg-[#0f0f1a]/60 border border-white/10 rounded-lg text-white md:col-span-2" rows={3} placeholder="How can we help?" />
          <button className="btn-animated px-4 py-2 bg-[#b11226] hover:bg-[#d31a33] text-white rounded-lg shadow-lg shadow-[#b11226]/30 md:col-span-2 text-left w-full md:w-auto">
            Send message
          </button>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-xl p-6 shadow-lg space-y-4"
      >
        <h2 className="text-lg font-semibold">FAQs</h2>
        <div className="space-y-3">
          {faqs.map((item) => (
            <div key={item.q} className="p-3 bg-white/5 rounded-lg border border-white/5">
              <p className="font-semibold text-white">{item.q}</p>
              <p className="text-gray-300 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
