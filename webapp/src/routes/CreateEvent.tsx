import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { eventService } from "../services/eventService";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/NavBar";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [ageRestriction, setAgeRestriction] = useState("ALL");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      await eventService.create({
        title,
        description,
        eventDateTime,
        venueName,
        venueAddress,
        capacity,
        ageRestriction,
      });
      setSuccess("Event created successfully!");
      setTimeout(() => navigate("/"), 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/events");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#0f0f1a] flex items-center justify-center px-4 pt-28 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-3xl"
        >
          <div className="bg-[#1a1a2e]/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-[#b11226]/20 p-8">
            <div className="flex items-start justify-between mb-8">
              <div>
                <p className="flex items-center gap-2 text-sm text-[#f06575] mb-3">
                  <ArrowLeft size={16} />
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="hover:underline"
                  >
                    Back
                  </button>
                </p>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Register a New Event
                </h1>
                <p className="text-gray-400">
                  Provide the basic details for your event. We'll handle additional verification later.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancel}
                aria-label="Close form"
                className="p-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                  {error}
                </div>
              )}

            {success && (
              <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-3 text-green-400 text-sm">
                {success}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Name
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                  placeholder="My Concert"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Event Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={eventDateTime}
                  onChange={(e) => setEventDateTime(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                placeholder="Tell attendees about the event..."
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={venueName}
                  onChange={(e) => setVenueName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                  placeholder="Main Hall"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capacity
                </label>
                <input
                  type="number"
                  min={0}
                  value={capacity}
                  onChange={(e) => setCapacity(parseInt(e.target.value, 10) || 0)}
                  required
                  className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Venue Address
              </label>
              <textarea
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                rows={3}
                required
                className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                placeholder="Street, City, Country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Age Restriction
              </label>
              <select
                value={ageRestriction}
                onChange={(e) => setAgeRestriction(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
              >
                <option value="ALL">All Ages</option>
                <option value="18+">18+</option>
                <option value="21+">21+</option>
              </select>
            </div>

              <div className="flex flex-col md:flex-row gap-4 md:justify-end pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex-1 md:flex-none px-6 py-3 border border-[#b11226]/40 rounded-lg text-white hover:bg-[#b11226]/10 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 md:flex-none px-6 py-3 bg-[#b11226] hover:bg-[#d31a33] text-white font-semibold rounded-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Publish Event"}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}
