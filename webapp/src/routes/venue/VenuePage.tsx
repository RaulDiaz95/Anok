import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/NavBar";
import { venueService, SimilarVenueResult, VenueSearchResult } from "../../services/venueService";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2, CheckCircle2, MapPin } from "lucide-react";

type VenueProfile = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  verified: boolean;
  usageCount: number;
  description?: string;
  capacity?: number;
  latitude?: number;
  longitude?: number;
  photos: string[];
  upcomingEvents: any[];
  pastEvents: any[];
  similarVenues?: SimilarVenueResult[];
};

type SmartSuggestions = {
  topNearUser?: VenueSearchResult[];
  popularRecently?: VenueSearchResult[];
  userHistory?: VenueSearchResult[];
  verifiedRecommended?: VenueSearchResult[];
};

export default function VenuePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, isLoading, error } = useQuery<VenueProfile>({
    queryKey: ["venue-profile", id],
    queryFn: () => venueService.getVenueProfile(id || ""),
    enabled: Boolean(id),
  });

  const { data: similarVenues, isLoading: loadingSimilar } = useQuery<SimilarVenueResult[]>({
    queryKey: ["venue-similar", id],
    queryFn: () => venueService.getSimilarVenues(id || ""),
    enabled: Boolean(id),
  });

  const { data: smartSuggestions } = useQuery<SmartSuggestions>({
    queryKey: ["venue-suggestions", user?.id],
    queryFn: () => venueService.getSmartSuggestions(user?.id),
    enabled: Boolean(user?.id),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center text-white">
          <Loader2 className="animate-spin mr-2" /> Loading venue...
        </div>
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center text-white px-4">
          <p className="text-xl mb-3">Venue not found</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20"
          >
            Go back
          </button>
        </div>
      </>
    );
  }

  const hero = data.photos?.[0];
  const mapUrl =
    data.latitude && data.longitude
      ? `https://www.google.com/maps?q=${data.latitude},${data.longitude}`
      : `https://www.google.com/maps?q=${encodeURIComponent(`${data.name} ${data.city} ${data.state} ${data.country}`)}`;
  const similarList = similarVenues ?? data.similarVenues ?? [];
  const suggestionGroups = [
    { title: "Top Near You", items: smartSuggestions?.topNearUser ?? [], badge: "Near You" },
    { title: "Popular Recently", items: smartSuggestions?.popularRecently ?? [], badge: "Popular" },
    { title: "Your Previous Venues", items: smartSuggestions?.userHistory ?? [], badge: "Used Before" },
    { title: "Recommended (Verified)", items: smartSuggestions?.verifiedRecommended ?? [], badge: "Verified" },
  ].filter((group) => group.items.length > 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white pt-20 pb-12">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl">
            <AnimatePresence>
              {hero && (
                <motion.img
                  key={hero}
                  src={hero}
                  alt={data.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-64 object-cover"
                />
              )}
            </AnimatePresence>
            <div className="p-5 space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold">{data.name}</h1>
                {data.verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full bg-[#b11226]/15 border border-[#b11226]/30 text-[#f7c0c7]">
                    <CheckCircle2 size={12} /> Verified
                  </span>
                )}
              </div>
              <p className="text-gray-300 flex items-center gap-2 text-sm">
                <MapPin size={14} />
                {data.city}, {data.state}, {data.country}
              </p>
              {data.capacity && <p className="text-sm text-gray-300">Capacity: {data.capacity}</p>}
              {typeof data.usageCount === "number" && (
                <p className="text-sm text-gray-400">Usage count: {data.usageCount}</p>
              )}
            </div>
          </div>

          {data.description && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 backdrop-blur-md shadow-lg">
              <h2 className="text-lg font-semibold">About</h2>
              <p className="text-gray-300 leading-relaxed">{data.description}</p>
            </div>
          )}

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 backdrop-blur-md shadow-lg">
              <h2 className="text-lg font-semibold mb-2">Photos</h2>
              {data.photos?.length ? (
                <div className="columns-2 md:columns-3 gap-3">
                  {data.photos.map((url) => (
                    <motion.img
                      key={url}
                      src={url}
                      alt="Venue"
                      className="mb-3 w-full rounded-lg border border-white/10"
                      whileHover={{ scale: 1.02 }}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No photos yet.</p>
              )}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md shadow-lg">
              <h2 className="text-lg font-semibold">Map</h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10">
                <iframe title="map" src={mapUrl} className="w-full h-full border-0" loading="lazy" />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming Events</h2>
                <span className="text-xs text-gray-400">{data.upcomingEvents?.length || 0}</span>
              </div>
              {data.upcomingEvents?.length ? (
                <div className="space-y-2">
                  {data.upcomingEvents.map((e) => (
                    <div key={e.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-white font-semibold">{e.title}</p>
                      <p className="text-xs text-gray-400">
                        {e.eventDate} — {e.venueCity}, {e.venueState}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No upcoming events.</p>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Past Events</h2>
                <span className="text-xs text-gray-400">{data.pastEvents?.length || 0}</span>
              </div>
              {data.pastEvents?.length ? (
                <div className="space-y-2">
                  {data.pastEvents.map((e) => (
                    <div key={e.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                      <p className="text-white font-semibold">{e.title}</p>
                      <p className="text-xs text-gray-400">
                        {e.eventDate} — {e.venueCity}, {e.venueState}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No past events.</p>
              )}
            </div>
          </div>

          {!loadingSimilar && similarList.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">You may also like</h2>
                <span className="text-xs text-gray-400">{similarList.length}</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <AnimatePresence>
                  {similarList.map((v, idx) => {
                    const heroBg =
                      v.heroPhoto ||
                      `linear-gradient(135deg, rgba(177,18,38,0.35), rgba(255,255,255,0.08) ${40 + (idx % 3) * 10}%)`;
                    return (
                      <motion.button
                        key={v.id}
                        onClick={() => navigate(`/venue/${v.id}`)}
                        className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5 text-left group shadow-md"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        whileHover={{ translateY: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.25)" }}
                        transition={{ duration: 0.18 }}
                      >
                        <div
                          className="h-28 w-full bg-cover bg-center"
                          style={{ backgroundImage: heroBg.startsWith("linear") ? heroBg : `url(${heroBg})` }}
                        />
                        <div className="p-3 space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-semibold text-sm">{v.name}</p>
                            {v.verified && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#b11226]/15 border border-[#b11226]/30 text-[11px] text-[#f7c0c7]">
                                <CheckCircle2 size={12} /> Verified
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-300">
                            {v.city}, {v.state}
                          </p>
                          {typeof v.similarityScore === "number" && (
                            <p className="text-[11px] text-gray-400">Match {Math.round(v.similarityScore)}%</p>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>
            </div>
          )}

          {suggestionGroups.length > 0 && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Suggested venues</h2>
                <span className="text-xs text-gray-400">for you</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {suggestionGroups.map((group) => (
                  <div key={group.title} className="rounded-lg border border-white/10 bg-white/5 p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-white">{group.title}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-gray-300">
                        {group.badge}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {group.items.slice(0, 2).map((v) => (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => navigate(`/venue/${v.id}`)}
                          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-left transition"
                        >
                          <span className="text-sm text-white font-medium truncate">{v.name}</span>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {v.city}, {v.state}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
