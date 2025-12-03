import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  X,
  Image as ImageIcon,
  Upload,
  Plus,
  Trash2,
  Radio,
} from "lucide-react";
import { eventService } from "../services/eventService";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/NavBar";
import { PerformerInput } from "../types/event";
import { FlyerFrame } from "../components/FlyerFrame";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { id: eventId } = useParams<{ id: string }>();
  const isEdit = Boolean(eventId);
  const { isAuthenticated, isLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [eventLengthHours, setEventLengthHours] = useState<number>(0);
  const [endTime, setEndTime] = useState("");
  const [endTimeEdited, setEndTimeEdited] = useState(false);
  const [flyerPreview, setFlyerPreview] = useState("");
  const [flyerUrl, setFlyerUrl] = useState("");
  const [isLive, setIsLive] = useState(true);
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueZipCode, setVenueZipCode] = useState("");
  const [venueState, setVenueState] = useState("");
  const [venueCountry, setVenueCountry] = useState("");
  const [about, setAbout] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [allAges, setAllAges] = useState(true);
  const [alcohol, setAlcohol] = useState(false);
  const [performers, setPerformers] = useState<PerformerInput[]>([
    { performerName: "", genre1: "", genre2: "", performerLink: "" },
  ]);
  const [genreInput, setGenreInput] = useState("");
  const [genres, setGenres] = useState<string[]>([]);
  const [genreError, setGenreError] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFlyer, setIsUploadingFlyer] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (!isEdit || !eventId || !isAuthenticated) return;
    const loadEvent = async () => {
      setIsLoadingEvent(true);
      setError("");
      try {
        const data = await eventService.get(eventId);
        setTitle(data.title || "");
        setEventDate(data.eventDate || "");
        setStartTime(toTimeInput(data.startTime));
        setEventLengthHours(data.eventLengthHours ?? 0);
        setEndTime(toTimeInput(data.endTime));
        setEndTimeEdited(Boolean(data.endTime));
        setFlyerUrl(data.flyerUrl || "");
        setFlyerPreview(data.flyerUrl || "");
        setIsLive(Boolean(data.isLive));
        setVenueName(data.venueName || "");
        setVenueAddress(data.venueAddress || "");
        setVenueZipCode(data.venueZipCode || "");
        setVenueState(data.venueState || "");
        setVenueCountry(data.venueCountry || "");
        setAbout(data.about || "");
        setCapacity(data.capacity ?? 0);
        setAllAges(Boolean(data.allAges));
        setAlcohol(Boolean(data.alcohol));
        setGenres(data.genres || []);
        setPerformers(
          data.performers && data.performers.length
            ? data.performers.map((p) => ({
                performerName: p.performerName || "",
                genre1: p.genre1 || "",
                genre2: p.genre2 || "",
                performerLink: p.performerLink || "",
              }))
            : [{ performerName: "", genre1: "", genre2: "", performerLink: "" }]
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setIsLoadingEvent(false);
      }
    };
    loadEvent();
  }, [eventId, isAuthenticated, isEdit]);

  useEffect(() => {
    if (startTime && eventLengthHours > 0 && !endTimeEdited) {
      const computed = computeEndTime(startTime, eventLengthHours);
      setEndTime(computed);
    }
  }, [startTime, eventLengthHours, endTimeEdited]);

  const isFormReady = useMemo(
    () =>
      title.trim() &&
      eventDate &&
      startTime &&
      eventLengthHours > 0 &&
      venueName.trim() &&
      venueAddress.trim() &&
      venueZipCode.trim() &&
      venueState.trim() &&
      venueCountry.trim() &&
      performers.some((p) => p.performerName.trim()),
    [
      title,
      eventDate,
      startTime,
      eventLengthHours,
      venueName,
      venueAddress,
      venueZipCode,
      venueState,
      venueCountry,
      performers,
    ]
  );

  const handleCancel = () => {
    navigate(isEdit ? "/events/mine" : "/events");
  };

  const handleUploadFlyer = async (file: File) => {
    setError("");
    setIsUploadingFlyer(true);
    try {
      const url = await eventService.uploadFlyer(file);
      setFlyerUrl(url);
      setFlyerPreview(URL.createObjectURL(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload flyer");
    } finally {
      setIsUploadingFlyer(false);
    }
  };

  const handleFileInput = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) {
      setError("Flyer must be an image file.");
      return;
    }
    handleUploadFlyer(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileInput(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const addPerformer = () => {
    setPerformers([
      ...performers,
      { performerName: "", genre1: "", genre2: "", performerLink: "" },
    ]);
  };

  const updatePerformer = (index: number, field: keyof PerformerInput, value: string) => {
    const next = [...performers];
    next[index] = { ...next[index], [field]: value };
    setPerformers(next);
  };

  const removePerformer = (index: number) => {
    if (performers.length === 1) return;
    setPerformers(performers.filter((_, i) => i !== index));
  };

  const addGenre = () => {
    const value = genreInput.trim();
    if (!value) {
      setGenreError("Genre cannot be empty.");
      return;
    }
    if (value.length > 25) {
      setGenreError("Genre must be 25 characters or fewer.");
      return;
    }
    if (genres.length >= 50) {
      setGenreError("You can only add up to 50 genres.");
      return;
    }
    if (genres.some((genre) => genre.toLowerCase() === value.toLowerCase())) {
      setGenreError("Genre already added.");
      return;
    }
    setGenres([...genres, value]);
    setGenreInput("");
    setGenreError("");
  };

  const removeGenre = (index: number) => {
    setGenres(genres.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      const validPerformers = performers
        .filter((p) => p.performerName.trim())
        .map((p) => ({
          performerName: p.performerName.trim(),
          genre1: p.genre1?.trim() || "",
          genre2: p.genre2?.trim() || "",
          performerLink: p.performerLink?.trim() || "",
        }));

      if (validPerformers.length === 0) {
        throw new Error("Add at least one performer with a name.");
      }

      const payload = {
        title: title.trim(),
        flyerUrl,
        eventDate,
        startTime,
        eventLengthHours: Number(eventLengthHours),
        endTime: endTime || null,
        isLive,
        venueName: venueName.trim(),
        venueAddress: venueAddress.trim(),
        venueZipCode: venueZipCode.trim(),
        venueState: venueState.trim(),
        venueCountry: venueCountry.trim(),
        about: about.trim(),
        capacity,
        allAges,
        alcohol,
        performers: validPerformers,
        genres,
      };

      if (isEdit && eventId) {
        await eventService.update(eventId, payload);
        setSuccess("Event updated successfully!");
        setTimeout(() => navigate("/events/mine"), 1200);
      } else {
        await eventService.create(payload);
        setSuccess("Event created successfully!");
        setTimeout(() => navigate("/events"), 1200);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || isLoadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        {isLoading ? "Checking session..." : "Loading event..."}
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
          className="w-full max-w-5xl"
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
                  {isEdit ? "Edit Event" : "Register a New Event"}
                </h1>
                <p className="text-gray-400">
                  Provide the details for your showcase: flyer, performers, timing, venue, and safety notes.
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

            <form onSubmit={handleSubmit} className="space-y-8">
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

              <div className="grid lg:grid-cols-[1fr_1.15fr] gap-6">
                <div
                  onDrop={handleDrop}
                  onDragOver={(e) => e.preventDefault()}
                  className="border-2 border-dashed border-[#b11226]/30 rounded-xl bg-[#0f0f1a]/60 p-6 flex flex-col items-center text-center gap-4"
                >
                  <FlyerFrame
                    src={flyerPreview || undefined}
                    alt="Flyer preview"
                    size="lg"
                    placeholder={
                      <div className="text-gray-400 flex flex-col items-center gap-3">
                        <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                          <ImageIcon className="text-[#b11226]" size={36} />
                        </div>
                        <p className="text-white font-semibold">Drag & Drop Flyer</p>
                        <p className="text-sm text-gray-500">Image files only. Or click to browse.</p>
                      </div>
                    }
                  />
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#b11226] hover:bg-[#d31a33] text-white rounded-lg cursor-pointer transition">
                    <Upload size={16} />
                    {isUploadingFlyer ? "Uploading..." : "Upload Flyer"}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileInput(e.target.files)}
                      disabled={isUploadingFlyer}
                    />
                  </label>
                </div>

                <div className="space-y-6">
                  <section className="bg-white/5 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-white">Event Info</h2>
                      <div className="flex items-center gap-2 bg-black/30 border border-[#b11226]/30 rounded-full px-3 py-1">
                        <Radio
                          size={16}
                          className={isLive ? "text-[#b11226]" : "text-gray-500"}
                        />
                        <button
                          type="button"
                          onClick={() => setIsLive(true)}
                          className={`px-3 py-1 rounded-full text-sm ${isLive ? "bg-[#b11226] text-white" : "text-gray-300"}`}
                        >
                          Live
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsLive(false)}
                          className={`px-3 py-1 rounded-full text-sm ${!isLive ? "bg-[#b11226] text-white" : "text-gray-300"}`}
                        >
                          Offline
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Event Title
                        </label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                          placeholder="Night of Sounds"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Event Date
                        </label>
                        <input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mt-4">
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          Event Length (hours)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={eventLengthHours}
                          onChange={(e) => setEventLengthHours(parseInt(e.target.value, 10) || 0)}
                          required
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-300">
                          End Time (optional)
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => {
                            setEndTime(e.target.value);
                            setEndTimeEdited(e.target.value !== "");
                          }}
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                        />
                      </div>
                    </div>
                  </section>

                  <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-white">Performers</h2>
                      <button
                        type="button"
                        onClick={addPerformer}
                        className="inline-flex items-center gap-2 px-3 py-2 bg-[#b11226] hover:bg-[#d31a33] text-white rounded-lg text-sm transition"
                      >
                        <Plus size={16} />
                        Add Performer
                      </button>
                    </div>

                    <div className="space-y-4">
                      {performers.map((performer, index) => (
                        <div
                          key={`performer-${index}`}
                          className="border border-white/10 rounded-lg p-4 bg-black/20 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-300 font-semibold">
                              Performer #{index + 1}
                            </p>
                            {performers.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removePerformer(index)}
                                className="text-red-300 hover:text-red-200 text-sm inline-flex items-center gap-1"
                              >
                                <Trash2 size={14} />
                                Remove
                              </button>
                            )}
                          </div>

                          <div className="grid md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={performer.performerName}
                              onChange={(e) =>
                                updatePerformer(index, "performerName", e.target.value)
                              }
                              placeholder="Performer name"
                              className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                              required={index === 0}
                            />
                            <input
                              type="text"
                              value={performer.performerLink || ""}
                              onChange={(e) => updatePerformer(index, "performerLink", e.target.value)}
                              placeholder="Performer link"
                              className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={performer.genre1 || ""}
                              onChange={(e) => updatePerformer(index, "genre1", e.target.value)}
                              placeholder="Genre 1"
                              className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                            />
                            <input
                              type="text"
                              value={performer.genre2 || ""}
                              onChange={(e) => updatePerformer(index, "genre2", e.target.value)}
                              placeholder="Genre 2"
                              className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-white">Venue</h2>
                    <div className="grid md:grid-cols-2 gap-4">
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
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Street Address
                        </label>
                        <input
                          type="text"
                          value={venueAddress}
                          onChange={(e) => setVenueAddress(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                          placeholder="123 Main St"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          value={venueZipCode}
                          onChange={(e) => setVenueZipCode(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                          placeholder="90210"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          State / Province
                        </label>
                        <input
                          type="text"
                          value={venueState}
                          onChange={(e) => setVenueState(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                          placeholder="California"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Country
                        </label>
                        <input
                          type="text"
                          value={venueCountry}
                          onChange={(e) => setVenueCountry(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                          placeholder="United States"
                        />
                      </div>
                    </div>
                  </section>

                  <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-white">About the Event</h2>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      rows={4}
                      required
                      className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                      placeholder="Tell attendees about the event..."
                    />

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Genres{" "}
                          <span className="text-gray-500 text-xs">
                            (up to 50 tags, 25 chars each)
                          </span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={25}
                            value={genreInput}
                            onChange={(e) => setGenreInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addGenre();
                              }
                            }}
                            className="flex-1 px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                            placeholder="e.g. Rock, Indie, Jazz"
                          />
                          <button
                            type="button"
                            onClick={addGenre}
                            className="px-4 py-3 bg-[#b11226] hover:bg-[#d31a33] text-white rounded-lg flex items-center gap-2 transition"
                          >
                            <Plus size={16} />
                            Add
                          </button>
                        </div>
                        {genreError && (
                          <p className="text-sm text-red-400 mt-2">{genreError}</p>
                        )}
                        {genres.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {genres.map((genre, index) => (
                              <span
                                key={`${genre}-${index}`}
                                className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#b11226]/10 border border-[#b11226]/30 text-sm text-white"
                              >
                                {genre}
                                <button
                                  type="button"
                                  onClick={() => removeGenre(index)}
                                  className="text-gray-400 hover:text-white transition"
                                  aria-label={`Remove ${genre}`}
                                >
                                  <X size={14} />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-4">
                        <label className="flex items-center gap-3 text-sm text-gray-300">
                          <input
                            type="checkbox"
                            checked={allAges}
                            onChange={(e) => setAllAges(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-700 bg-[#0f0f1a]/50 text-[#b11226] focus:ring-2 focus:ring-[#b11226] focus:outline-none"
                          />
                          All Ages
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-300">
                          <input
                            type="checkbox"
                            checked={alcohol}
                            onChange={(e) => setAlcohol(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-700 bg-[#0f0f1a]/50 text-[#b11226] focus:ring-2 focus:ring-[#b11226] focus:outline-none"
                          />
                          Alcohol
                        </label>
                      </div>
                    </div>
                  </section>
                </div>
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
                  disabled={isSubmitting || isUploadingFlyer || !isFormReady}
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

function computeEndTime(start: string, lengthHours: number): string {
  const [hoursStr, minutesStr] = start.split(":");
  const hours = parseInt(hoursStr || "0", 10);
  const minutes = parseInt(minutesStr || "0", 10);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setHours(date.getHours() + lengthHours);
  const endH = date.getHours().toString().padStart(2, "0");
  const endM = date.getMinutes().toString().padStart(2, "0");
  return `${endH}:${endM}`;
}

function toTimeInput(time?: string | null): string {
  if (!time) return "";
  const [hh, mm] = time.split(":");
  if (!hh || !mm) return time;
  return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}`;
}
