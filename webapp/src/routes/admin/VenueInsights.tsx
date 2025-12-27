import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, MapPin, ShieldCheck, TrendingUp, AlertTriangle } from "lucide-react";
import Navbar from "../../components/NavBar";
import { useAuth } from "../../contexts/AuthContext";
import { buildApiUrl } from "../../config/env";

type VenueInsightItem = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  verified: boolean;
  usageCount: number;
};

type VenueInsightsResponse = {
  totalVenues: number;
  verified: number;
  unverified: number;
  topVenues: VenueInsightItem[];
  recentVenues: VenueInsightItem[];
  needsVerification: VenueInsightItem[];
  usedLast30Days: VenueInsightItem[];
};

const fetchInsights = async (): Promise<VenueInsightsResponse> => {
  const res = await fetch(buildApiUrl("/admin/venues/insights"), { credentials: "include" });
  if (!res.ok) throw new Error("Failed to load venue insights");
  return res.json();
};

const verifyVenue = async (venueId: string) => {
  const res = await fetch(buildApiUrl(`/admin/venues/${venueId}/verify`), {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to verify venue");
};

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md shadow-lg flex flex-col gap-1"
    >
      <span className="text-xs uppercase tracking-wide text-gray-400">{label}</span>
      <motion.span
        key={value}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className="text-2xl font-bold text-white"
      >
        {value}
      </motion.span>
    </motion.div>
  );
}

function VenueCard({ venue, action }: { venue: VenueInsightItem; action?: React.ReactNode }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-start justify-between gap-3 backdrop-blur-md"
    >
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <p className="text-white font-semibold">{venue.name}</p>
          {venue.verified && (
            <span className="px-2 py-0.5 rounded-full bg-[#b11226]/15 border border-[#b11226]/30 text-[11px] text-[#f7c0c7]">
              Verified
            </span>
          )}
        </div>
        <p className="text-xs text-gray-300 flex items-center gap-1">
          <MapPin size={12} /> {venue.city}, {venue.state}, {venue.country}
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <TrendingUp size={12} /> Usage: {venue.usageCount}
        </p>
      </div>
      {action}
    </motion.div>
  );
}

export default function VenueInsights() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading: isInsightsLoading, error } = useQuery({
    queryKey: ["venue-insights"],
    queryFn: fetchInsights,
  });

  const verifyMutation = useMutation({
    mutationFn: verifyVenue,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venue-insights"] }),
  });

  const handleVerify = (id: string) => {
    verifyMutation.mutate(id);
  };

  const needsVerification = data?.needsVerification ?? [];
  const topVenues = data?.topVenues ?? [];
  const recentVenues = data?.recentVenues ?? [];
  const usedLast30Days = data?.usedLast30Days ?? [];

  const statItems = useMemo(
    () => [
      { label: "Total venues", value: data?.totalVenues ?? 0 },
      { label: "Verified", value: data?.verified ?? 0 },
      { label: "Unverified", value: data?.unverified ?? 0 },
      { label: "Used in last 30d", value: usedLast30Days.length },
    ],
    [data, usedLast30Days.length]
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Checking session...</div>;
  }

  if (!user?.roles?.includes("ROLE_SUPERUSER")) {
    navigate("/login");
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-[#0f0f1a] via-[#12121c] to-black text-white pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-1">Venue Insights</h1>
              <p className="text-gray-400 text-sm">Monitor venue quality, usage, and verification.</p>
            </div>
            {(isInsightsLoading || verifyMutation.isLoading) && (
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <Loader2 className="animate-spin" size={16} />
                Refreshing...
              </div>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/40 text-red-200 rounded-lg px-4 py-3">
              {(error as Error).message}
            </div>
          )}

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {statItems.map((item) => (
              <StatCard key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Top Venues</h2>
                <TrendingUp size={16} className="text-[#f25f6b]" />
              </div>
              <div className="space-y-2">
                {isInsightsLoading ? (
                  <Loader2 className="animate-spin text-gray-300" />
                ) : topVenues.length ? (
                  topVenues.map((v) => <VenueCard key={v.id} venue={v} />)
                ) : (
                  <p className="text-sm text-gray-400">No venues yet.</p>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Recent Venues</h2>
                <MapPin size={16} className="text-[#f25f6b]" />
              </div>
              <div className="space-y-2">
                {isInsightsLoading ? (
                  <Loader2 className="animate-spin text-gray-300" />
                ) : recentVenues.length ? (
                  recentVenues.map((v) => <VenueCard key={v.id} venue={v} />)
                ) : (
                  <p className="text-sm text-gray-400">No venues yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Needs Verification</h2>
                <AlertTriangle size={16} className="text-yellow-400" />
              </div>
              <div className="space-y-2">
                {isInsightsLoading ? (
                  <Loader2 className="animate-spin text-gray-300" />
                ) : needsVerification.length ? (
                  needsVerification.map((v) => (
                    <VenueCard
                      key={v.id}
                      venue={v}
                      action={
                        <button
                          onClick={() => handleVerify(v.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#b11226] text-white text-xs hover:bg-[#d31a33] transition flex items-center gap-1"
                          disabled={verifyMutation.isLoading}
                        >
                          {verifyMutation.isLoading ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                          Verify
                        </button>
                      }
                    />
                  ))
                ) : (
                  <p className="text-sm text-gray-400">No venues need verification.</p>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 backdrop-blur-md shadow-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Used in last 30 days</h2>
                <ShieldCheck size={16} className="text-green-400" />
              </div>
              <div className="space-y-2">
                {isInsightsLoading ? (
                  <Loader2 className="animate-spin text-gray-300" />
                ) : usedLast30Days.length ? (
                  usedLast30Days.map((v) => <VenueCard key={v.id} venue={v} />)
                ) : (
                  <p className="text-sm text-gray-400">No usage in the last 30 days.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
