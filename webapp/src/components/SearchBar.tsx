import { useState } from "react";
import { Search, MapPin, SlidersHorizontal } from "lucide-react";

export default function SearchBar() {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="search-section mx-auto text-center">
      {/* === Primary Search Row === */}
      <div className="flex justify-center items-center space-x-3 flex-wrap">
        <div className="flex items-center bg-[#2a2a34] px-4 py-2 rounded-lg w-72 shadow-md">
          <Search size={18} className="text-[#b11226] mr-2" />
          <input
            type="text"
            placeholder="Search events..."
            className="bg-transparent outline-none w-full text-sm text-gray-200"
          />
        </div>

        <div className="flex items-center bg-[#2a2a34] px-4 py-2 rounded-lg w-60 shadow-md">
          <MapPin size={18} className="text-[#b11226] mr-2" />
          <input
            type="text"
            placeholder="Location"
            className="bg-transparent outline-none w-full text-sm text-gray-200"
          />
        </div>

        <button className="bg-[#b11226] hover:bg-[#c61b31] transition px-5 py-2 rounded-lg font-semibold text-sm shadow-lg">
          Search
        </button>
      </div>

      {/* === Toggle Advanced Filters === */}
      <div className="mt-4 text-gray-400 text-sm flex justify-center items-center gap-2">
        <SlidersHorizontal size={16} />
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="hover:text-[#b11226] transition"
        >
          Advanced search
        </button>
      </div>

      {/* === Advanced Filters Section === */}
      {showAdvanced && (
        <div
          className="mt-6 mx-auto max-w-2xl bg-[#1c1c24] border border-[#2a2a34] rounded-2xl p-6 shadow-xl text-left animate-fade-in"
        >
          <h3 className="text-[#b11226] text-lg font-semibold mb-4 text-center">
            Advanced Filters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Music Type */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Music Type
              </label>
              <select className="w-full bg-[#2a2a34] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b11226]">
                <option>Rock</option>
                <option>Pop</option>
                <option>Jazz</option>
                <option>EDM</option>
                <option>Classical</option>
              </select>
            </div>

            {/* Vicinity */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Vicinity to Travel
              </label>
              <input
                type="text"
                placeholder="e.g. 50 km"
                className="w-full bg-[#2a2a34] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b11226]"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Date
              </label>
              <input
                type="date"
                className="w-full bg-[#2a2a34] text-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#b11226]"
              />
            </div>
          </div>

            {/* Apply Button */}
            <div className="flex justify-center mt-6">
            <button
                onClick={() => console.log("Filters applied ✅")}
                className="bg-[#b11226] hover:bg-[#c61b31] transition px-6 py-2 rounded-lg font-semibold shadow-md active:scale-95"
            >
                Apply Filters
            </button>
            </div>
        </div>
      )}
    </div>
  );
}
