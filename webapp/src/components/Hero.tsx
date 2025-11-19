import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaMapMarkerAlt, FaSlidersH } from "react-icons/fa";
import { DateRange, RangeKeyDict } from "react-date-range";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface HeroProps {
  id?: string;
}

export default function Hero({ id }: HeroProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#0d0d15] to-[#1a1a25] text-center px-6 pt-20"
    >
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-5xl sm:text-6xl font-extrabold text-[#b11226] mb-6"
      >
        Discover the Best Live Music
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="text-gray-300 text-lg max-w-2xl mb-10"
      >
        Find concerts, festivals, and underground shows near you — powered by
        rhythm and passion.
      </motion.p>

      {/* 🔍 Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="bg-[#151520]/70 p-5 rounded-xl shadow-lg border border-[#b11226]/20 backdrop-blur-md flex flex-col sm:flex-row gap-4 w-full max-w-3xl"
      >
        <div className="flex items-center bg-[#1b1b25] rounded-lg border border-[#b11226]/30 flex-1 px-3">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search events..."
            className="bg-transparent w-full py-3 text-gray-200 focus:outline-none"
          />
        </div>

        <div className="flex items-center bg-[#1b1b25] rounded-lg border border-[#b11226]/30 flex-1 px-3">
          <FaMapMarkerAlt className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Location"
            className="bg-transparent w-full py-3 text-gray-200 focus:outline-none"
          />
        </div>

        <button className="bg-[#b11226] hover:bg-[#d0182e] transition text-white font-semibold rounded-lg px-6 py-3">
          Search
        </button>
      </motion.div>

      {/* ⚙️ Advanced Search */}
      <motion.div
        className="flex items-center gap-2 text-gray-400 mt-4 cursor-pointer hover:text-[#b11226] transition"
        onClick={() => setShowAdvanced(!showAdvanced)}
      >
        <FaSlidersH />
        <span>Advanced search</span>
      </motion.div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-[#151520]/70 border border-[#b11226]/30 rounded-xl mt-6 p-6 w-full max-w-3xl shadow-lg text-gray-300"
          >
            <h3 className="text-[#b11226] font-semibold text-lg mb-4">
              Refine your search
            </h3>

            <div className="grid sm:grid-cols-3 gap-4">
              {/* Music Type */}
              <select className="bg-[#1b1b25] text-gray-200 px-4 py-3 rounded-lg border border-[#b11226]/30 focus:border-[#b11226] outline-none transition">
                <option>Music Type</option>
                <option>Rock</option>
                <option>Pop</option>
                <option>Rap</option>
                <option>Jazz</option>
                <option>Hip-hop</option>
                <option>Blues</option>
              </select>

              {/* Vicinity */}
              <select className="bg-[#1b1b25] text-gray-200 px-4 py-3 rounded-lg border border-[#b11226]/30 focus:border-[#b11226] outline-none transition">
                <option>Vicinity to travel</option>
                <option>35 miles</option>
                <option>70 miles</option>
                <option>100 miles</option>
                <option>More than 100 miles</option>
              </select>

              {/* Date Range Picker */}
              <div className="relative">
                <div
                  onClick={() => setShowPicker(!showPicker)}
                  className="bg-[#1b1b25] text-gray-200 px-5 py-4 h-[52px] flex items-center justify-between rounded-lg border border-[#b11226]/30 cursor-pointer"
                >
                  <span>
                    {`${format(range[0].startDate, "MMM d, yyyy")} – ${format(
                      range[0].endDate,
                      "MMM d, yyyy"
                    )}`}
                  </span>
                  <svg
                    className={`w-4 h-4 ml-2 transition-transform ${
                      showPicker ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {showPicker && (
                  <div className="absolute right-0 z-50 mt-2 shadow-lg border border-[#b11226]/40 rounded-xl overflow-hidden bg-[#151520]">
                    <DateRange
                      editableDateInputs={true}
                      onChange={(item: RangeKeyDict) => {
                        const selection = item.selection;
                        if (selection?.startDate && selection?.endDate) {
                          setRange([{
                            startDate: selection.startDate,
                            endDate: selection.endDate,
                            key: "selection"
                          }]);
                        }
                      }}
                      moveRangeOnFirstSelection={false}
                      ranges={range}
                      months={2}
                      direction="horizontal"
                      locale={enUS}
                      showDateDisplay={false}
                      rangeColors={["#b11226"]}
                    />
                    <div className="flex justify-end bg-[#1b1b25] p-3 border-t border-[#b11226]/30">
                      <button
                        onClick={() => setShowPicker(false)}
                        className="bg-[#b11226] hover:bg-[#d0182e] text-white font-semibold rounded-lg px-5 py-2 transition"
                      >
                        Apply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button className="bg-[#b11226] hover:bg-[#d0182e] text-white font-semibold rounded-lg px-6 py-3 transition">
                Apply Filters
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
