import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
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
import { useVenueSearch } from "../hooks/useVenueSearch";
import { useAuth } from "../contexts/AuthContext";
import Navbar from "../components/NavBar";
import { PerformerInput } from "../types/event";
import { FlyerFrame } from "../components/FlyerFrame";
import { ALLOWED_GENRES } from "../constants/genres";
import { VenueSearchResult } from "../services/venueService";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { id: eventId } = useParams<{ id: string }>();
  const isEdit = Boolean(eventId);
  const { isAuthenticated, isLoading } = useAuth();

  const [title, setTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [eventLengthHours, setEventLengthHours] = useState<number>(1);
  const [endTime, setEndTime] = useState("");
  const [endTimeEdited, setEndTimeEdited] = useState(false);
  const [flyerPreview, setFlyerPreview] = useState("");
  const [flyerUrl, setFlyerUrl] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [venueName, setVenueName] = useState("");
  const [venueAddress, setVenueAddress] = useState("");
  const [venueZipCode, setVenueZipCode] = useState("");
  const [venueState, setVenueState] = useState("");
  const [venueCountry, setVenueCountry] = useState("");
  const [venueCity, setVenueCity] = useState("");
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);
  const [isNewVenue, setIsNewVenue] = useState(true);
  const [venueSearchOpen, setVenueSearchOpen] = useState(false);
  const venueSearchBoxRef = useRef<HTMLDivElement | null>(null);
  const [venueNameInput, setVenueNameInput] = useState("");
  const [activeVenueIndex, setActiveVenueIndex] = useState<number>(-1);
  const {
    query: venueSearchQuery,
    setQuery: setVenueSearchQuery,
    results: venueResults,
    isLoading: isSearchingVenues,
    error: venueSearchError,
  } = useVenueSearch("");
  const rankedVenueResults = useMemo(() => {
    const query = venueSearchQuery.trim().toLowerCase();
    const score = (v: VenueSearchResult) => {
      let s = 0;
      const usage = v.usageCount ?? 0;
      s += usage * 4;
      if (v.verified) s += 20;
      if (query) {
        const nameLower = v.name.toLowerCase();
        if (nameLower === query) s += 40;
        else if (nameLower.startsWith(query)) s += 20;
        else if (nameLower.includes(query)) s += 10;
        if (v.city.toLowerCase().includes(query) || v.state.toLowerCase().includes(query)) s += 5;
      }
      return s;
    };
    return [...venueResults].sort((a, b) => score(b) - score(a));
  }, [venueResults, venueSearchQuery]);

  const limitedVenueResults = useMemo(() => rankedVenueResults.slice(0, 2), [rankedVenueResults]);

  useEffect(() => {
    setActiveVenueIndex(-1);
  }, [limitedVenueResults.length, venueSearchQuery]);

  const selectVenue = (venue: VenueSearchResult) => {
    setSelectedVenueId(venue.id);
    setIsNewVenue(false);
    setVenueSearchOpen(false);
    setVenueNameInput(venue.name);
    setVenueName(venue.name);
    setVenueAddress(venue.address || "");
    setVenueZipCode(venue.postalCode || "");
    setVenueCity(venue.city);
    setVenueState(venue.state);
    setVenueCountry(venue.country);
    setCapacity(typeof venue.capacity === "number" ? venue.capacity : 0);
    setActiveVenueIndex(-1);
    setVenueSearchQuery(venue.name);
  };
  const canClearVenue =
    Boolean(selectedVenueId) &&
    !isNewVenue &&
    [venueNameInput, venueAddress, venueZipCode, venueCity, venueState, venueCountry].every(
      (value) => value.trim() !== ""
    );
  const clearVenueInputs = () => {
    setSelectedVenueId(null);
    setIsNewVenue(true);
    setVenueNameInput("");
    setVenueName("");
    setVenueAddress("");
    setVenueZipCode("");
    setVenueCity("");
    setVenueState("");
    setVenueCountry("");
    setCapacity(0);
    setVenueSearchQuery("");
    setVenueSearchOpen(false);
    setActiveVenueIndex(-1);
  };
  const [about, setAbout] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [allAges, setAllAges] = useState(true);
  const [alcohol, setAlcohol] = useState(false);
  const [performers, setPerformers] = useState<PerformerInput[]>([
    { performerName: "", genre1: "", genre2: "", genre3: "", performerLink: "" },
  ]);
  const [genres, setGenres] = useState<string[]>([]);
  const [genreError, setGenreError] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingFlyer, setIsUploadingFlyer] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [genreQuery, setGenreQuery] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (venueSearchBoxRef.current && !venueSearchBoxRef.current.contains(e.target as Node)) {
        setVenueSearchOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVenueSearchOpen(false);
        setActiveVenueIndex(-1);
      }
      if (venueSearchOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setActiveVenueIndex((prev) => {
            const max = limitedVenueResults.length - 1;
            return max < 0 ? -1 : Math.min(max, prev + 1);
          });
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setActiveVenueIndex((prev) => Math.max(-1, prev - 1));
        } else if (e.key === "Enter" && activeVenueIndex >= 0) {
          e.preventDefault();
          const venue = limitedVenueResults[activeVenueIndex];
          if (venue) {
            selectVenue(venue);
          }
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

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
      setVenueCity(data.venueCity || "");
      setVenueNameInput(data.venueName || "");
      setVenueSearchQuery(data.venueName || "");
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
                genre3: p.genre3 || "",
                performerLink: p.performerLink || "",
              }))
            : [{ performerName: "", genre1: "", genre2: "", genre3: "", performerLink: "" }]
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
    if (startTime && eventLengthHours >= 1 && !endTimeEdited) {
      const computed = computeEndTime(startTime, eventLengthHours);
      setEndTime(computed);
    }
  }, [startTime, eventLengthHours, endTimeEdited]);

  const validationErrors = useMemo(() => {
    const errors: Record<string, string> = {};
    const hints: string[] = [];
    const trimmedTitle = title.trim();
    const trimmedAbout = about.trim();
    const trimmedVenueName = venueName.trim();
    const trimmedVenueAddress = venueAddress.trim();
    const trimmedCity = venueCity.trim();
    const trimmedState = venueState.trim();
    const trimmedCountry = venueCountry.trim();
    const usingExistingVenue = selectedVenueId !== null && !isNewVenue;

    if (!trimmedTitle) {
      errors.title = "Title is required";
      hints.push("Title (3-100 chars)");
    } else if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
      errors.title = "Title must be 3-100 characters";
      hints.push("Title must be 3-100 characters");
    }
    if (!trimmedAbout) {
      errors.about = "Description is required";
      hints.push("Description (10-2000 chars)");
    } else if (trimmedAbout.length < 10 || trimmedAbout.length > 2000) {
      errors.about = "Description must be 10-2000 characters";
      hints.push("Description must be 10-2000 characters");
    }
    if (!eventDate) {
      errors.eventDate = "Event date is required";
      hints.push("Event date");
    } else {
      const today = new Date();
      const dateValue = new Date(eventDate + "T00:00:00");
      if (dateValue < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        errors.eventDate = "Event date cannot be in the past";
        hints.push("Event date cannot be in the past");
      }
    }
    if (!startTime) {
      errors.startTime = "Start time is required";
      hints.push("Start time");
    } else if (eventDate) {
      const dateValue = new Date(eventDate + "T00:00:00");
      const today = new Date();
      if (
        dateValue.getFullYear() === today.getFullYear() &&
        dateValue.getMonth() === today.getMonth() &&
        dateValue.getDate() === today.getDate()
      ) {
        const [h, m] = startTime.split(":").map((v) => parseInt(v || "0", 10));
        const nowMinutes = today.getHours() * 60 + today.getMinutes();
        const startMinutes = h * 60 + m;
        if (startMinutes < nowMinutes) {
          errors.startTime = "Start time cannot be earlier than current time";
          hints.push("Start time must be in the future");
        }
      }
    }
    if (!eventLengthHours || Number.isNaN(eventLengthHours)) {
      errors.eventLengthHours = "Length is required";
      hints.push("Event length (>= 1 hour)");
    } else if (eventLengthHours < 1) {
      errors.eventLengthHours = "Event must last at least 1 hour";
      hints.push("Event must last at least 1 hour");
    }
    if (startTime) {
      const [sh, sm] = startTime.split(":").map((v) => parseInt(v || "0", 10));
      const startMinutes = sh * 60 + sm;
      let endMinutes = null as number | null;
      if (endTime) {
        const [eh, em] = endTime.split(":").map((v) => parseInt(v || "0", 10));
        endMinutes = eh * 60 + em;
      } else if (eventLengthHours >= 1) {
        endMinutes = startMinutes + eventLengthHours * 60;
      }
      if (endMinutes !== null && endMinutes < startMinutes) {
        errors.endTime = "Invalid time range";
        hints.push("End time must be after start");
      }
    }
    if (!usingExistingVenue) {
      if (!trimmedVenueName) {
        errors.venueName = "Venue name is required";
        hints.push("Venue name (3-150 chars)");
      } else if (trimmedVenueName.length < 3 || trimmedVenueName.length > 150) {
        errors.venueName = "Venue name must be 3-150 characters";
        hints.push("Venue name must be 3-150 characters");
      }
      if (!trimmedVenueAddress) {
        errors.venueAddress = "Address is required";
        hints.push("Address (5-200 chars)");
      } else if (trimmedVenueAddress.length < 5 || trimmedVenueAddress.length > 200) {
        errors.venueAddress = "Address must be 5-200 characters";
        hints.push("Address must be 5-200 characters");
      }
      if (!venueZipCode) {
        errors.venueZipCode = "Postal code is required";
        hints.push("Postal code (3-12 digits)");
      } else if (!/^[0-9]{3,12}$/.test(venueZipCode)) {
        errors.venueZipCode = "Postal code must be 3-12 digits";
        hints.push("Postal code must be 3-12 digits");
      }
      if (!trimmedCity) {
        errors.venueCity = "City is required";
        hints.push("City");
      }
      if (!trimmedState) {
        errors.venueState = "State is required";
        hints.push("State");
      }
      if (!trimmedCountry) {
        errors.venueCountry = "Country is required";
        hints.push("Country");
      }
    }
    if (!genres.length) {
      errors.genres = "Select at least one genre";
      hints.push("At least 1 genre");
    }
    if (!performers.some((p) => p.performerName.trim())) {
      errors.performers = "Add at least one performer";
      hints.push("Performer name");
    }
    return { errors, hints };
  }, [
    title,
    about,
    eventDate,
    startTime,
    eventLengthHours,
    endTime,
    venueName,
    venueAddress,
    venueZipCode,
    venueCity,
    venueState,
    venueCountry,
    genres,
    performers,
  ]);

  useEffect(() => {
    setFieldErrors(validationErrors.errors);
  }, [validationErrors]);

  const isFormReady = useMemo(
    () => Object.keys(validationErrors.errors).length === 0 && !isSubmitting && !isUploadingFlyer,
    [validationErrors, isSubmitting, isUploadingFlyer]
  );

  const handleAddGenre = () => {
    const exact = ALLOWED_GENRES.find(
      (g) => g.toLowerCase() === genreQuery.trim().toLowerCase()
    );
    if (!exact) {
      setGenreError("Select a genre from the list");
      return;
    }
    if (genres.some((g) => g.toLowerCase() === exact.toLowerCase())) {
      setGenreError("Genre already selected");
      return;
    }
    if (genres.length >= 50) {
      setGenreError("You can only add up to 50 genres.");
      return;
    }
    setGenres([...genres, exact]);
    setGenreQuery("");
    setGenreError("");
  };

  const handleGenreQueryChange = (value: string) => {
    setGenreQuery(value);
    setGenreError("");
  };

  const handlePostalChange = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 12);
    setVenueZipCode(digits);
  };

  const handleEventLengthChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    setEventLengthHours(digits ? Math.max(1, parseInt(digits, 10)) : 0);
  };

  const handleCapacityChange = (value: string) => {
    const digits = value.replace(/\D/g, "");
    setCapacity(digits ? parseInt(digits, 10) : 0);
  };

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
      { performerName: "", genre1: "", genre2: "", genre3: "", performerLink: "" },
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

  const removeGenre = (index: number) => {
    setGenres(genres.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setHasSubmitted(true);
    setFieldErrors(validationErrors.errors);
    setIsSubmitting(true);

    try {
      if (Object.keys(validationErrors.errors).length) {
        throw new Error("Please fix the highlighted validation errors.");
      }
      const validPerformers = performers
        .filter((p) => p.performerName.trim())
        .map((p) => ({
          performerName: p.performerName.trim(),
          genre1: p.genre1?.trim() || "",
          genre2: p.genre2?.trim() || "",
          genre3: p.genre3?.trim() || "",
          performerLink: p.performerLink?.trim() || "",
        }));

      if (validPerformers.length === 0) {
        throw new Error("Add at least one performer with a name.");
      }

        const usingExistingVenue = selectedVenueId !== null && !isNewVenue;
        const payload = {
          title: title.trim(),
          flyerUrl: flyerUrl || null,
          eventDate,
          startTime,
          eventLengthHours: Number(eventLengthHours),
          endTime: endTime || null,
          isLive: false,
          selectedVenueId: usingExistingVenue ? selectedVenueId : null,
          venueName: venueName.trim(),
          venueAddress: venueAddress.trim(),
          venueZipCode: venueZipCode.trim(),
          venueState: venueState.trim(),
          venueCountry: venueCountry.trim(),
          venueCity: venueCity.trim(),
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
        <div className="eq-loader">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <span className="ml-3 text-sm text-gray-300">
          {isLoading ? "Checking session..." : "Loading event..."}
        </span>
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
                        <p className="text-sm text-gray-500">Optional — image files only. Or click to browse.</p>
                      </div>
                    }
                  />
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#b11226] hover:bg-[#d31a33] text-white rounded-lg cursor-pointer transition">
                    <Upload size={16} />
                    {isUploadingFlyer ? "Uploading..." : "Upload Flyer (optional)"}
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
                      aria-invalid={Boolean(fieldErrors.title)}
                      className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                      placeholder="Night of Sounds"
                    />
                    {hasSubmitted && fieldErrors.title && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.title}</p>
                    )}
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
                      aria-invalid={Boolean(fieldErrors.eventDate)}
                      className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                    />
                    {hasSubmitted && fieldErrors.eventDate && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.eventDate}</p>
                    )}
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
                      aria-invalid={Boolean(fieldErrors.startTime)}
                      className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                    />
                    {hasSubmitted && fieldErrors.startTime && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.startTime}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-300">
                      Event Length (hours)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={eventLengthHours}
                      onChange={(e) => handleEventLengthChange(e.target.value)}
                      required
                      aria-invalid={Boolean(fieldErrors.eventLengthHours)}
                      className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                    />
                    {hasSubmitted && fieldErrors.eventLengthHours && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.eventLengthHours}</p>
                    )}
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
                    {hasSubmitted && fieldErrors.endTime && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.endTime}</p>
                    )}
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
                              className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition md:col-span-2"
                              required={index === 0}
                            />
                            <input
                              type="text"
                              value={performer.performerLink || ""}
                              onChange={(e) => updatePerformer(index, "performerLink", e.target.value)}
                              placeholder="Performer link"
                              className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition md:col-span-2"
                            />
                          </div>
                          <div className="grid md:grid-cols-2 gap-3">
                            <select
                              value={performer.genre1 || ""}
                              onChange={(e) => updatePerformer(index, "genre1", e.target.value)}
                              className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition md:col-span-2"
                            >
                              <option value="" className="bg-[#0f0f1a] text-gray-400">
                                Select genre
                              </option>
                              {ALLOWED_GENRES.map((option) => (
                                <option key={option} value={option} className="bg-[#0f0f1a] text-white">
                                  {option}
                                </option>
                              ))}
                            </select>
                            <input
                              type="text"
                              value={performer.genre2 || ""}
                              onChange={(e) => updatePerformer(index, "genre2", e.target.value)}
                              placeholder="Genre 2"
                              className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition md:col-span-2"
                            />
                            <input
                              type="text"
                              value={performer.genre3 || ""}
                              onChange={(e) => updatePerformer(index, "genre3", e.target.value)}
                              placeholder="Genre 3"
                              className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition md:col-span-2"
                            />
                          </div>
                        </div>
                      ))}
                      {hasSubmitted && fieldErrors.performers && (
                        <p className="text-xs text-red-400">{fieldErrors.performers}</p>
                      )}
                    </div>
                  </section>

                  <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-semibold text-white">Venue</h2>
                      {selectedVenueId && !isNewVenue && (
                        <a
                          href={`/venue/${selectedVenueId}`}
                          className="text-xs text-[#f7c0c7] underline hover:text-white transition"
                          target="_blank"
                          rel="noreferrer"
                        >
                          View venue profile
                        </a>
                      )}
                      {canClearVenue && (
                        <button
                          type="button"
                          onClick={clearVenueInputs}
                          className="text-xs text-gray-200 border border-white/15 rounded-full px-3 py-1 hover:border-[#b11226]/60 hover:text-white transition inline-flex items-center gap-1"
                        >
                          <Trash2 size={12} />
                          Clear venue
                        </button>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="relative" ref={venueSearchBoxRef}>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Venue name
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={venueNameInput}
                            onChange={(e) => {
                              const value = e.target.value;
                              setVenueNameInput(value);
                              setVenueName(value);
                              setVenueSearchQuery(value);
                              setSelectedVenueId(null);
                              setIsNewVenue(true);
                              setVenueSearchOpen(true);
                            }}
                            onFocus={() => setVenueSearchOpen(true)}
                            aria-invalid={Boolean(fieldErrors.venueName)}
                            className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                            placeholder="Type to search venues..."
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
                            {isSearchingVenues
                              ? "Searching..."
                              : limitedVenueResults.length
                                ? `${limitedVenueResults.length} found`
                                : ""}
                          </div>
                        </div>
                        <AnimatePresence>
                          {venueSearchOpen && venueNameInput.trim() !== "" && (
                            <motion.div
                              initial={{ opacity: 0, y: -4 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -4 }}
                              transition={{ duration: 0.15 }}
                              className="absolute z-20 mt-2 w-full rounded-xl border border-white/10 bg-white/10 backdrop-blur-md shadow-xl overflow-hidden"
                            >
                              <div className="max-h-80 overflow-y-auto p-1 space-y-1">
                                <AnimatePresence>
                                {limitedVenueResults.map((venue, idx) => {
                                    const isSelected = selectedVenueId === venue.id && !isNewVenue;
                                    const isActive = idx === activeVenueIndex;
                                    return (
                                      <motion.button
                                        key={venue.id}
                                        type="button"
                                        layout
                                        onClick={() => selectVenue(venue)}
                                        className={`w-full text-left px-3 py-2 rounded-lg transition bg-white/5 hover:bg-white/10 border ${
                                          isSelected || isActive ? "border-[#b11226]/70" : "border-transparent"
                                        }`}
                                        whileHover={{ scale: 1.01 }}
                                        whileTap={{ scale: 0.99 }}
                                      >
                                        <div className="flex items-center justify-between gap-2">
                                          <p className="text-sm font-semibold text-white">{venue.name}</p>
                                          <div className="flex items-center gap-1">
                                            {typeof venue.usageCount === "number" && (
                                              <span className="text-[10px] text-gray-300">Usage {venue.usageCount}</span>
                                            )}
                                            {venue.verified && (
                                              <span className="text-[10px] px-2 py-1 rounded-full bg-[#b11226]/20 text-[#f7c0c7] border border-[#b11226]/40">
                                                Verified
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                        <p className="text-xs text-gray-300">
                                          {venue.city}, {venue.state}, {venue.country}
                                        </p>
                                      </motion.button>
                                    );
                                  })}
                                </AnimatePresence>
                                {venueSearchError && (
                                  <div className="px-3 py-2 text-xs text-red-300">{venueSearchError}</div>
                                )}
                                {!venueResults.length && venueNameInput.trim().length >= 3 && !venueSearchError && (
                                  <div className="px-3 py-2 text-xs text-gray-300">No venues found</div>
                                )}
                                {(() => {
                                  const trimmed = venueNameInput.trim().toLowerCase();
                                  const hasExact = venueResults.some(
                                    (v) =>
                                      v.name.toLowerCase() === trimmed &&
                                      v.city.toLowerCase() === venueCity.toLowerCase() &&
                                      v.state.toLowerCase() === venueState.toLowerCase() &&
                                      v.country.toLowerCase() === venueCountry.toLowerCase()
                                  );
                                  if (!trimmed || hasExact) return null;
                                  return (
                                    <motion.button
                                      key="create-new-venue"
                                      type="button"
                                      layout
                                      onClick={() => {
                                        setSelectedVenueId(null);
                                        setIsNewVenue(true);
                                        setVenueName(venueNameInput.trim());
                                        setVenueSearchOpen(false);
                                      }}
                                      className="w-full text-left px-3 py-2 rounded-lg transition bg-white/5 hover:bg-white/10 border border-dashed border-white/15 text-sm text-white"
                                      whileHover={{ scale: 1.01 }}
                                      whileTap={{ scale: 0.99 }}
                                    >
                                      ➕ Create new venue: <span className="font-semibold">{venueNameInput.trim()}</span>
                                    </motion.button>
                                  );
                                })()}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        {hasSubmitted && fieldErrors.venueName && (
                          <p className="text-xs text-red-400 mt-1">{fieldErrors.venueName}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Capacity
                        </label>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={capacity}
                          onChange={(e) => handleCapacityChange(e.target.value)}
                          required
                          className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                        />
                      </div>
                    </div>

                    {!isNewVenue && selectedVenueId && (
                      <div className="flex flex-wrap gap-2 text-xs text-gray-200">
                        <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                          Using verified venue
                        </span>
                      </div>
                    )}

                    {isNewVenue ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={venueAddress}
                            onChange={(e) => setVenueAddress(e.target.value)}
                            aria-invalid={Boolean(fieldErrors.venueAddress)}
                            className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                            placeholder="123 Main St"
                          />
                          {hasSubmitted && fieldErrors.venueAddress && (
                            <p className="text-xs text-red-400 mt-1">{fieldErrors.venueAddress}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={venueZipCode}
                            onChange={(e) => handlePostalChange(e.target.value)}
                            inputMode="numeric"
                            aria-invalid={Boolean(fieldErrors.venueZipCode)}
                            className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                            placeholder="e.g. 90210"
                          />
                          {hasSubmitted && fieldErrors.venueZipCode && (
                            <p className="text-xs text-red-400 mt-1">{fieldErrors.venueZipCode}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={venueCity}
                            onChange={(e) => setVenueCity(e.target.value)}
                            aria-invalid={Boolean(fieldErrors.venueCity)}
                            className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                            placeholder="City"
                          />
                          {hasSubmitted && fieldErrors.venueCity && (
                            <p className="text-xs text-red-400 mt-1">{fieldErrors.venueCity}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            State / Province
                          </label>
                          <input
                            type="text"
                            value={venueState}
                            onChange={(e) => setVenueState(e.target.value)}
                            aria-invalid={Boolean(fieldErrors.venueState)}
                            className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                            placeholder="State / Province"
                          />
                          {hasSubmitted && fieldErrors.venueState && (
                            <p className="text-xs text-red-400 mt-1">{fieldErrors.venueState}</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={venueCountry}
                            onChange={(e) => setVenueCountry(e.target.value)}
                            aria-invalid={Boolean(fieldErrors.venueCountry)}
                            className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                            placeholder="Country"
                          />
                          {hasSubmitted && fieldErrors.venueCountry && (
                            <p className="text-xs text-red-400 mt-1">{fieldErrors.venueCountry}</p>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Street Address
                          </label>
                          <input
                            type="text"
                            value={venueAddress}
                            readOnly
                            className="w-full px-4 py-3 bg-[#0f0f1a]/60 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none"
                            placeholder="Venue address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            value={venueZipCode}
                            inputMode="numeric"
                            readOnly
                            className="w-full px-4 py-3 bg-[#0f0f1a]/60 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none"
                            placeholder="Postal code"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            City
                          </label>
                          <input
                            type="text"
                            value={venueCity}
                            readOnly
                            className="w-full px-4 py-3 bg-[#0f0f1a]/60 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none"
                            placeholder="City"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            State / Province
                          </label>
                          <input
                            type="text"
                            value={venueState}
                            readOnly
                            className="w-full px-4 py-3 bg-[#0f0f1a]/60 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none"
                            placeholder="State / Province"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Country
                          </label>
                          <input
                            type="text"
                            value={venueCountry}
                            readOnly
                            className="w-full px-4 py-3 bg-[#0f0f1a]/60 border border-gray-700 rounded-lg text-gray-300 placeholder-gray-500 focus:outline-none"
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    )}
                  </section>

                  <section className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-4">
                    <h2 className="text-lg font-semibold text-white">About the Event</h2>
                    <textarea
                      value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      rows={4}
                      required
                      aria-invalid={Boolean(fieldErrors.about)}
                      className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                      placeholder="Tell attendees about the event..."
                    />
                    {hasSubmitted && fieldErrors.about && (
                      <p className="text-xs text-red-400 mt-1">{fieldErrors.about}</p>
                    )}

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Genres{" "}
                          <span className="text-gray-500 text-xs">
                            (up to 50 tags, 25 chars each)
                          </span>
                        </label>
                        <div className="space-y-3">
                          <div className="flex gap-2 flex-col sm:flex-row">
                            <div className="flex-1">
                              <input
                                type="text"
                                value={genreQuery}
                                onChange={(e) => handleGenreQueryChange(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    handleAddGenre();
                                  }
                                }}
                                aria-invalid={Boolean(fieldErrors.genres) || Boolean(genreError)}
                                className="w-full px-4 py-3 bg-[#0f0f1a]/50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#b11226] focus:border-transparent transition"
                                placeholder="Type a genre (must match allowed list)"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleAddGenre}
                              className="px-4 py-3 bg-[#b11226] hover:bg-[#d31a33] text-white rounded-lg flex items-center gap-2 transition sm:w-auto w-full justify-center"
                            >
                              <Plus size={16} />
                              Add
                            </button>
                          </div>
                          {genreError && <p className="text-sm text-red-400">{genreError}</p>}
                          {hasSubmitted && fieldErrors.genres && !genreError && (
                            <p className="text-sm text-red-400">{fieldErrors.genres}</p>
                          )}
                          {genres.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
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
                <div className="relative group">
                  <button
                    type="button"
                    aria-label="Validation summary"
                    className="flex items-center justify-center h-12 w-12 rounded-full border border-white/20 text-white bg-white/5 hover:bg-white/10 transition"
                  >
                    ?
                  </button>
                  <div className="absolute bottom-full mb-2 right-0 w-72 bg-[#0f0f1a] border border-white/10 rounded-lg shadow-xl p-3 text-sm text-gray-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-150">
                    <p className="font-semibold text-white mb-2">Missing info</p>
                    {validationErrors.hints.length === 0 ? (
                      <p className="text-green-400">All required fields look good.</p>
                    ) : (
                      <ul className="list-disc list-inside space-y-1">
                        {validationErrors.hints.slice(0, 5).map((hint, idx) => (
                          <li key={idx}>{hint}</li>
                        ))}
                        {validationErrors.hints.length > 5 && (
                          <li>+{validationErrors.hints.length - 5} more</li>
                        )}
                      </ul>
                    )}
                  </div>
                </div>
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
