import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/NavBar";
import { FlyerFrame } from "../components/FlyerFrame";
import { adminEventService } from "../services/adminEventService";
import { Event } from "../types/event";
import { useAuth } from "../contexts/AuthContext";

export default function AdminReviewEventDetail() {
  const { eventId } = useParams<{ eventId: string }>();
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || !user.roles?.includes("ROLE_SUPERUSER"))) {
      navigate("/login");
    }
  }, [isLoading, user, navigate]);

  const load = async () => {
    if (!eventId) return;
    setLoading(true);
    setError("");
    try {
      const data = await adminEventService.get(eventId);
      setEvent(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [eventId]);

  const act = async (action: "approve" | "reject") => {
    if (!eventId) return;
    setError("");
    try {
      if (action === "approve") await adminEventService.approve(eventId);
      else await adminEventService.reject(eventId);
      navigate("/admin/review-events");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Action failed");
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white pt-28 pb-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-400 hover:text-white">
            Back
          </button>
          {loading && <p className="text-gray-400">Loading...</p>}
          {error && <p className="text-red-400">{error}</p>}
          {event && (
            <div className="grid md:grid-cols-[1fr_1.5fr] gap-6 bg-[#0f0f1a]/60 border border-white/10 rounded-xl p-6">
              <div className="flex justify-center">
                <FlyerFrame src={event.flyerUrl} alt={event.title} size="lg" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <p className="text-gray-300">
                  {event.eventDate} {event.startTime && `at ${event.startTime}`}
                </p>
                <p className="text-gray-300">{event.venueName}</p>
                <p className="text-gray-400">{event.venueAddress}</p>
                <p className="text-gray-300">{event.about}</p>
                <div className="flex flex-wrap gap-2">
                  {event.genres?.map((g) => (
                    <span
                      key={g}
                      className="px-3 py-1 rounded-full bg-[#b11226]/10 border border-[#b11226]/30 text-xs"
                    >
                      {g}
                    </span>
                  ))}
                </div>
                <div className="text-sm text-gray-200 space-y-2">
                  <p className="font-semibold">Performers</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {event.performers?.map((p) => (
                      <div key={p.performerName} className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 shadow-inner">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-white font-semibold leading-tight">{p.performerName}</span>
                          {p.performerLink && (
                            <a
                              href={p.performerLink}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[11px] text-[#f7c0c7] underline hover:text-white"
                            >
                              Link
                            </a>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {[p.genre1, p.genre2, p.genre3]
                            .filter(Boolean)
                            .map((g) => (
                              <span
                                key={`${p.performerName}-${g}`}
                                className="px-2 py-0.5 text-[11px] rounded-full bg-[#b11226]/15 border border-[#b11226]/30 text-gray-100"
                              >
                                {g}
                              </span>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                    {event.allAges ? "All Ages" : "18+"}
                  </span>
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10">
                    {event.alcohol ? "Alcohol" : "No Alcohol"}
                  </span>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => act("approve")}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => act("reject")}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
