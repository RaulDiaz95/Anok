import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CheckCircle2, Edit2, Loader2, MapPin, Save, ShieldCheck, TrendingUp, AlertTriangle, X } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { buildApiUrl } from "../../config/env";
import PageContainer from "../../components/PageContainer";

type VenueInsightItem = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  address: string;
  postalCode: string;
  verified: boolean;
  usageCount: number;
  capacity?: number | null;
  createdByAdmin?: boolean | null;
  description?: string | null;
  latitude?: number | null;
  longitude?: number | null;
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

type VenueEditValues = {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  usageCount: string;
  capacity: string;
  verified: boolean;
  createdByAdmin: boolean;
  description: string;
  latitude: string;
  longitude: string;
};

type VenueUpdatePayload = {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  state: string;
  country: string;
  usageCount: number;
  capacity: number | null;
  verified: boolean;
  createdByAdmin: boolean;
  description: string | null;
  latitude: number | null;
  longitude: number | null;
};

const updateVenue = async ({ venueId, payload }: { venueId: string; payload: VenueUpdatePayload }) => {
  const res = await fetch(buildApiUrl(`/admin/venues/${venueId}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to update venue");
  return res.json();
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

function VenueEditForm({
  values,
  onChange,
  onCancel,
  onSave,
  isSaving,
  error,
}: {
  values: VenueEditValues;
  onChange: (field: keyof VenueEditValues, value: string | boolean) => void;
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
  error?: string | null;
}) {
  return (
    <div className="bg-black/30 border border-white/10 rounded-lg p-3 space-y-3">
      {error && (
        <div className="text-xs text-red-300 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
          {error}
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Name</label>
          <input
            value={values.name}
            onChange={(e) => onChange("name", e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Address</label>
          <input
            value={values.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">City</label>
          <input
            value={values.city}
            onChange={(e) => onChange("city", e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">State</label>
          <input
            value={values.state}
            onChange={(e) => onChange("state", e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Country</label>
          <input
            value={values.country}
            onChange={(e) => onChange("country", e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Postal Code</label>
          <input
            value={values.postalCode}
            onChange={(e) => onChange("postalCode", e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Capacity</label>
          <input
            value={values.capacity}
            onChange={(e) => onChange("capacity", e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
            inputMode="numeric"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Usage Count</label>
          <input
            value={values.usageCount}
            onChange={(e) => onChange("usageCount", e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
            inputMode="numeric"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Latitude</label>
          <input
            value={values.latitude}
            onChange={(e) => onChange("latitude", e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
            inputMode="decimal"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-gray-400">Longitude</label>
          <input
            value={values.longitude}
            onChange={(e) => onChange("longitude", e.target.value)}
            className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
            inputMode="decimal"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-gray-400">Description</label>
        <textarea
          value={values.description}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          className="w-full px-3 py-2 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white text-sm"
        />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            checked={values.verified}
            onChange={(e) => onChange("verified", e.target.checked)}
            className="h-4 w-4 rounded border-gray-700 bg-[#0f0f1a]/50 text-[#b11226] focus:ring-2 focus:ring-[#b11226]"
          />
          Verified
        </label>
        <label className="flex items-center gap-2 text-xs text-gray-300">
          <input
            type="checkbox"
            checked={values.createdByAdmin}
            onChange={(e) => onChange("createdByAdmin", e.target.checked)}
            className="h-4 w-4 rounded border-gray-700 bg-[#0f0f1a]/50 text-[#b11226] focus:ring-2 focus:ring-[#b11226]"
          />
          Created by admin
        </label>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs hover:bg-white/10 transition"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          className="px-3 py-1.5 rounded-lg bg-[#b11226] text-white text-xs hover:bg-[#d31a33] transition flex items-center gap-1"
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
          Save
        </button>
      </div>
    </div>
  );
}

function VenueCard({
  venue,
  action,
  editContent,
}: {
  venue: VenueInsightItem;
  action?: React.ReactNode;
  editContent?: React.ReactNode;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col gap-3 backdrop-blur-md"
    >
      <div className="flex items-start justify-between gap-3">
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
      </div>
      {editContent}
    </motion.div>
  );
}

export default function VenueInsights() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<VenueEditValues | null>(null);
  const [editError, setEditError] = useState<string | null>(null);

  const { data, isLoading: isInsightsLoading, error } = useQuery({
    queryKey: ["venue-insights"],
    queryFn: fetchInsights,
  });

  const verifyMutation = useMutation({
    mutationFn: verifyVenue,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["venue-insights"] }),
  });

  const updateMutation = useMutation({
    mutationFn: updateVenue,
    onSuccess: () => {
      setEditingId(null);
      setEditValues(null);
      setEditError(null);
      queryClient.invalidateQueries({ queryKey: ["venue-insights"] });
    },
  });

  const handleVerify = (id: string) => {
    verifyMutation.mutate(id);
  };

  const startEdit = (venue: VenueInsightItem) => {
    setEditingId(venue.id);
    setEditError(null);
    setEditValues({
      name: venue.name ?? "",
      address: venue.address ?? "",
      postalCode: venue.postalCode ?? "",
      city: venue.city ?? "",
      state: venue.state ?? "",
      country: venue.country ?? "",
      usageCount: String(venue.usageCount ?? 0),
      capacity: venue.capacity != null ? String(venue.capacity) : "",
      verified: Boolean(venue.verified),
      createdByAdmin: Boolean(venue.createdByAdmin),
      description: venue.description ?? "",
      latitude: venue.latitude != null ? String(venue.latitude) : "",
      longitude: venue.longitude != null ? String(venue.longitude) : "",
    });
  };

  const stopEdit = () => {
    setEditingId(null);
    setEditValues(null);
    setEditError(null);
  };

  const parseOptionalNumber = (value: string, field: string) => {
    const trimmed = value.trim();
    if (!trimmed) return { value: null as number | null, error: "" };
    const parsed = Number(trimmed);
    if (Number.isNaN(parsed)) {
      return { value: null as number | null, error: `${field} must be a number` };
    }
    return { value: parsed, error: "" };
  };

  const handleSave = () => {
    if (!editingId || !editValues) return;
    const requiredFields = [
      { key: "name", value: editValues.name },
      { key: "address", value: editValues.address },
      { key: "postalCode", value: editValues.postalCode },
      { key: "city", value: editValues.city },
      { key: "state", value: editValues.state },
      { key: "country", value: editValues.country },
    ];
    const missing = requiredFields.find((field) => !field.value.trim());
    if (missing) {
      setEditError(`${missing.key} is required`);
      return;
    }

    const usageCountValue = editValues.usageCount.trim();
    const usageCount = usageCountValue === "" ? 0 : Number(usageCountValue);
    if (!Number.isFinite(usageCount) || usageCount < 0) {
      setEditError("usageCount must be a non-negative number");
      return;
    }

    const capacityCheck = parseOptionalNumber(editValues.capacity, "capacity");
    if (capacityCheck.error) {
      setEditError(capacityCheck.error);
      return;
    }
    if (capacityCheck.value != null && capacityCheck.value < 0) {
      setEditError("capacity must be a non-negative number");
      return;
    }

    const latitudeCheck = parseOptionalNumber(editValues.latitude, "latitude");
    if (latitudeCheck.error) {
      setEditError(latitudeCheck.error);
      return;
    }

    const longitudeCheck = parseOptionalNumber(editValues.longitude, "longitude");
    if (longitudeCheck.error) {
      setEditError(longitudeCheck.error);
      return;
    }

    const payload: VenueUpdatePayload = {
      name: editValues.name.trim(),
      address: editValues.address.trim(),
      postalCode: editValues.postalCode.trim(),
      city: editValues.city.trim(),
      state: editValues.state.trim(),
      country: editValues.country.trim(),
      usageCount,
      capacity: capacityCheck.value,
      verified: editValues.verified,
      createdByAdmin: editValues.createdByAdmin,
      description: editValues.description.trim() ? editValues.description.trim() : null,
      latitude: latitudeCheck.value,
      longitude: longitudeCheck.value,
    };

    setEditError(null);
    updateMutation.mutate({ venueId: editingId, payload });
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

  const handleEditChange = (field: keyof VenueEditValues, value: string | boolean) => {
    if (!editValues) return;
    setEditValues({ ...editValues, [field]: value });
  };

  const renderEditContent = (venueId: string) => {
    if (editingId !== venueId || !editValues) return null;
    const saveError =
      editError || (updateMutation.isError ? (updateMutation.error as Error).message : null);
    return (
      <VenueEditForm
        values={editValues}
        onChange={handleEditChange}
        onCancel={stopEdit}
        onSave={handleSave}
        isSaving={updateMutation.isPending}
        error={saveError}
      />
    );
  };

  const renderEditButton = (venue: VenueInsightItem) => (
    <button
      type="button"
      onClick={() => (editingId === venue.id ? stopEdit() : startEdit(venue))}
      className="px-3 py-1.5 rounded-lg border border-white/10 text-white text-xs hover:bg-white/10 transition flex items-center gap-1"
      disabled={updateMutation.isPending}
    >
      {editingId === venue.id ? <X size={14} /> : <Edit2 size={14} />}
      {editingId === venue.id ? "Close" : "Edit"}
    </button>
  );

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Checking session...</div>;
  }

  if (!(user?.roles?.includes("ROLE_ADMIN") || user?.roles?.includes("ROLE_SUPERUSER"))) {
    navigate("/login");
    return null;
  }

  return (
    <PageContainer className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-1">Venue Insights</h1>
          <p className="text-gray-400 text-sm">Monitor venue quality, usage, and verification.</p>
        </div>
        {(isInsightsLoading || verifyMutation.isPending) && (
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
              topVenues.map((v) => (
                <VenueCard
                  key={v.id}
                  venue={v}
                  action={renderEditButton(v)}
                  editContent={renderEditContent(v.id)}
                />
              ))
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
              recentVenues.map((v) => (
                <VenueCard
                  key={v.id}
                  venue={v}
                  action={renderEditButton(v)}
                  editContent={renderEditContent(v.id)}
                />
              ))
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
                    <div className="flex flex-col items-end gap-2">
                      <button
                        onClick={() => handleVerify(v.id)}
                        className="px-3 py-1.5 rounded-lg bg-[#b11226] text-white text-xs hover:bg-[#d31a33] transition flex items-center gap-1"
                        disabled={verifyMutation.isPending}
                      >
                        {verifyMutation.isPending ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle2 size={14} />}
                        Verify
                      </button>
                      {renderEditButton(v)}
                    </div>
                  }
                  editContent={renderEditContent(v.id)}
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
              usedLast30Days.map((v) => (
                <VenueCard
                  key={v.id}
                  venue={v}
                  action={renderEditButton(v)}
                  editContent={renderEditContent(v.id)}
                />
              ))
            ) : (
              <p className="text-sm text-gray-400">No usage in the last 30 days.</p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
