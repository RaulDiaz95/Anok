import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";
import { adminEventService } from "../services/adminEventService";
import { Event } from "../types/event";
import { AdminEventCard } from "../components/AdminEventCard";
import { useAuth } from "../contexts/AuthContext";

export default function AdminReviewEvents() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || !user.roles?.includes("ROLE_SUPERUSER"))) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await adminEventService.listPending();
        setEvents(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load events");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white pt-28 pb-10 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <h1 className="text-3xl font-bold">Pending Events</h1>
          {loading && <p className="text-gray-400">Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {!loading && events.length === 0 && <p className="text-gray-400">No pending events.</p>}
          <div className="grid gap-4 md:grid-cols-2">
            {events.map((e) => (
              <AdminEventCard key={e.id} event={e} onReview={(id) => navigate(`/admin/review-events/${id}`)} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
