import { useState, useEffect } from "react";
import { tenureEvents2026_27 } from "../../data/tenureEvents2026_27";
import { tenureEvents2025_26 } from "../../data/tenureEvents2025_26";
import {
  FaCalendarAlt,
  FaClock,
  FaUser,
  FaMapMarkerAlt,
  FaArrowRight,
  FaImages,
  FaTimes,
  FaInfoCircle,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaSpinner,
} from "react-icons/fa";

// --- COLORS & UTILS ---
const colors = {
  blue: "#4285f4",
  green: "#34a853",
  yellow: "#f9ab00",
  red: "#ea4335",
};

const getEventTypeColor = (type) => {
  switch (type) {
    case "workshop":
      return colors.blue;
    case "seminar":
      return colors.green;
    case "hackathon":
      return colors.yellow;
    case "bootcamp":
      return colors.red;
    default:
      return colors.blue;
  }
};

const getEventTypeIcon = (type) => {
  switch (type) {
    case "workshop":
      return "🔧";
    case "seminar":
      return "🎤";
    case "hackathon":
      return "⚡";
    case "bootcamp":
      return "🔥";
    default:
      return "🎯";
  }
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
const formatTime = (date) =>
  new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
const formatLongDate = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

// --- MODAL COMPONENT ---
const EventModal = ({ event, isOpen, onClose, onRegisterSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  if (!isOpen || !event) return null;
  const isUpcoming = new Date(event.date_from) > new Date();
  const themeColor = getEventTypeColor(event.type);
  const dateLabel = event.date_to
    ? `${formatLongDate(event.date_from)} – ${formatLongDate(event.date_to)}`
    : formatLongDate(event.date_from);

  const handleRegistration = async () => {
    setIsRegistering(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/event/enroll/${event._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok) {
        onRegisterSuccess(event._id);
        if (event.gdgUrl) window.open(event.gdgUrl, "_blank");
      } else {
        if (
          data.statusCode === 401 &&
          data.message === "Authentication token is missing"
        ) {
          alert("Please log in to register for the event.");
        } else {
          alert(data.message || "Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("An error occurred during registration.");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <button
        type="button"
        aria-label="Close event details"
        className="absolute inset-0 cursor-default bg-slate-950/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="event-modal-title"
        className="animate-scale-up relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close event details"
          className="absolute right-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full bg-white text-slate-500 shadow-md transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <FaTimes />
        </button>

        <div className="custom-scrollbar flex-1 overflow-y-auto p-5 sm:p-8">
          <header className="mb-7 pr-12">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span
                className="rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: themeColor }}
              >
                {event.type || "Event"}
              </span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {isUpcoming ? "Upcoming event" : "Past event"}
              </span>
              {event.tenure && (
                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  Tenure {event.tenure}
                </span>
              )}
            </div>
            <h2
              id="event-modal-title"
              className="text-2xl font-bold leading-tight text-slate-900 sm:text-3xl"
            >
              {event.title}
            </h2>
          </header>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-[minmax(220px,0.9fr)_minmax(0,1.1fr)] md:gap-10">
            <div className="space-y-7">
              <div className="flex justify-center md:justify-start">
                <div className="h-48 w-48 overflow-hidden rounded-full bg-slate-50 ring-4 ring-slate-100 shadow-lg sm:h-56 sm:w-56">
                  <img
                    src={event.cover}
                    alt={`${event.title} poster`}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <section>
                <h3 className="mb-2 flex items-center gap-2 text-lg font-bold text-slate-900">
                  <FaInfoCircle style={{ color: themeColor }} /> About this event
                </h3>
                <p className="text-sm leading-6 text-slate-600 sm:text-base">
                  {event.description || "More event information will be shared soon."}
                </p>
              </section>

              {!isUpcoming && event.photos?.length > 0 && (
                <section className="border-t border-slate-100 pt-5">
                  <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900">
                    <FaImages style={{ color: themeColor }} /> Event gallery
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {event.photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="aspect-square overflow-hidden rounded-xl bg-slate-100"
                      >
                        <img
                          src={photo}
                          alt={`${event.title} gallery image ${idx + 1}`}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6">
              <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-slate-500">
                Event details
              </h3>
              <dl className="space-y-5">
                <div className="flex gap-3">
                  <FaCalendarAlt className="mt-1 shrink-0 text-blue-600" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Date and time
                    </dt>
                    <dd className="mt-1 font-medium leading-6 text-slate-800">
                      {dateLabel}
                      <br />
                      {formatTime(event.date_from)}
                      {event.date_to && ` – ${formatTime(event.date_to)}`}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <FaMapMarkerAlt className="mt-1 shrink-0 text-red-500" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Venue
                    </dt>
                    <dd className="mt-1 font-medium leading-6 text-slate-800">
                      {event.venue || "Venue to be announced"}
                    </dd>
                  </div>
                </div>
                <div className="flex gap-3">
                  <FaUser className="mt-1 shrink-0 text-green-600" />
                  <div>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Speakers and hosts
                    </dt>
                    <dd className="mt-1 font-medium leading-6 text-slate-800">
                      {(event.speakers || []).join(", ") ||
                        "GDG on Campus Quantum University"}
                    </dd>
                  </div>
                </div>
              </dl>

              <div className="mt-7 space-y-3 border-t border-slate-200 pt-5">
                {isUpcoming &&
                  (event.isEnrolled ? (
                    <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 py-3 font-bold text-green-700">
                      <FaCheckCircle /> You are registered
                    </div>
                  ) : (
                    <button
                      onClick={handleRegistration}
                      disabled={isRegistering}
                      className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold text-white shadow-sm transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
                      style={{ backgroundColor: themeColor }}
                    >
                      {isRegistering && <FaSpinner className="animate-spin" />}
                      {isRegistering ? "Registering…" : "Register now"}
                    </button>
                  ))}
                {event.gdgUrl && (
                  <a
                    href={event.gdgUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white py-3 font-bold text-blue-700 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    View on GDG Community
                    <FaExternalLinkAlt className="text-sm" />
                  </a>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes scale-up {
          0% {
            transform: scale(0.95);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scale-up {
          animation: scale-up 0.3s ease-out forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};

// --- CARD COMPONENT ---
const EventCard = ({ event, onClick }) => {
  const isUpcoming = new Date(event.date_from) > new Date();
  const themeColor = getEventTypeColor(event.type);
  const percentFilled = Math.min(
    100,
    Math.round((event.participantCount / event.maxParticipants) * 100)
  );

  if (event.source === "gdg-community") {
    const communityDate = new Date(event.date_from).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Kolkata" }
    );

    return (
      <article
        onClick={() => onClick(event)}
        className="group flex flex-[0_0_88%] snap-start cursor-pointer flex-col items-center px-2 text-center md:flex-[0_0_47%] xl:flex-[0_0_calc(25%_-_18px)]"
      >
        <div className="aspect-square w-full max-w-[180px] overflow-hidden rounded-full bg-white">
          <img
            src={event.cover}
            alt={`${event.title} event poster`}
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="mt-4 text-base font-normal text-[#686868] md:text-lg">
          {communityDate}
        </div>
        <div className="mt-2 text-base font-semibold text-black md:text-lg">
          {event.registrationLabel || "Free registration"}
        </div>
        <a
          href={event.gdgUrl}
          target="_blank"
          rel="noreferrer"
          onClick={(clickEvent) => clickEvent.stopPropagation()}
          className="mt-3 text-lg leading-tight text-[#686868] underline decoration-1 underline-offset-2 transition-colors hover:text-blue-700 md:text-xl"
        >
          {event.title}
        </a>
        <div className="mt-3 text-base leading-tight text-[#686868] md:text-lg">
          {event.communityName || "GDG on Campus Quantum University - Roorkee, India"}
        </div>
      </article>
    );
  }

  return (
    <div
      onClick={() => onClick(event)}
      className="group relative flex-[0_0_88%] snap-start h-full cursor-pointer flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-2xl md:flex-[0_0_47%] xl:flex-[0_0_31%]"
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0 bg-gray-200">
        <img
          src={event.cover}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            !isUpcoming && event.source !== "gdg-community"
              ? "grayscale-[0.8] group-hover:grayscale-0"
            : event.source === "gdg-community"
              ? "object-contain bg-white"
              : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Type Badge */}
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-semibold backdrop-blur-sm shadow-sm"
          style={{ backgroundColor: isUpcoming ? themeColor : "#6b7280" }}
        >
          {getEventTypeIcon(event.type)}{" "}
          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
        </div>

        {/* Date Badge */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 text-center shadow-lg">
          <div className="text-sm font-bold text-gray-900">
            {new Date(event.date_from).getDate()}
          </div>
          <div className="text-xs text-gray-600">
            {new Date(event.date_from).toLocaleString("default", {
              month: "short",
            })}
          </div>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>

        {event.tenure && (
          <span className="w-fit mb-3 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            Tenure {event.tenure}
          </span>
        )}

        <div className="flex items-center space-x-2 mb-3">
          <FaUser className="text-gray-400 text-sm" />
          <span className="text-sm text-gray-600 truncate">
            By {(event.speakers || ["GDG on Campus Quantum University"])[0]}
          </span>
        </div>

        <div className="space-y-2 mb-4 flex-grow">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaCalendarAlt /> <span>{formatDate(event.date_from)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaClock /> <span>{formatTime(event.date_from)}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FaMapMarkerAlt /> <span className="truncate">{event.venue}</span>
          </div>
        </div>

        {/* Stats / Gallery Indicator */}
        <div className="mb-4 h-10 flex flex-col justify-center">
          {isUpcoming ? (
            <>
              <div className="flex justify-between text-xs text-gray-600 mb-1">
                <span>Seats filled</span>
                <span>
                  {event.participantCount}/{event.maxParticipants}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: `${percentFilled}%`,
                    backgroundColor: themeColor,
                  }}
                ></div>
              </div>
            </>
          ) : (
            event.photos &&
            event.photos.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium bg-blue-50 px-3 py-2 rounded-lg w-fit">
                <FaImages /> Gallery Available
              </div>
            )
          )}
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-md ${
            isUpcoming && event.isEnrolled
              ? "bg-green-100 text-green-700 shadow-none hover:scale-100 cursor-default"
              : ""
          }`}
          style={
            isUpcoming && event.isEnrolled
              ? {}
              : {
                  backgroundColor:
                    event.source === "gdg-community"
                      ? colors.blue
                      : isUpcoming
                        ? themeColor
                        : "#e5e7eb",
                  color:
                    event.source === "gdg-community" || isUpcoming
                      ? "white"
                      : "#6b7280",
                }
          }
        >
          {event.source === "gdg-community" ? (
            <>
              <span>Event details</span>
              <FaArrowRight className="text-sm" />
            </>
          ) : isUpcoming ? (
            event.isEnrolled ? (
              <>
                <span>Registered</span>
                <FaCheckCircle className="text-sm" />
              </>
            ) : (
              <>
                <span>Register Now</span>
                <FaArrowRight className="text-sm" />
              </>
            )
          ) : (
            <>
              <span>View Recap</span>
              <FaExternalLinkAlt className="text-sm" />
            </>
          )}
        </button>
      </div>

      <div
        className="absolute inset-0 border-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ borderColor: isUpcoming ? themeColor : "#9ca3af" }}
      ></div>
    </div>
  );
};

// --- PAGINATION ---
const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    }
    return rangeWithDots;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-12 flex-wrap">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        className={`flex items-center px-4 py-2 rounded-lg border font-medium transition-all ${
          currentPage === 1 || isLoading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
        }`}
      >
        <FaChevronLeft className="mr-1 text-xs" /> Prev
      </button>

      <div className="flex items-center gap-1 sm:gap-2">
        {getPageNumbers().map((pageNumber, index) => {
          if (pageNumber === "...") {
            return (
              <span key={`dots-${index}`} className="px-2 text-gray-400">
                ...
              </span>
            );
          }
          return (
            <button
              key={pageNumber}
              onClick={() => onPageChange(pageNumber)}
              disabled={isLoading}
              className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-sm sm:text-base font-bold transition-all ${
                currentPage === pageNumber
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 transform scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-blue-300"
              }`}
            >
              {pageNumber}
            </button>
          );
        })}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        className={`flex items-center px-4 py-2 rounded-lg border font-medium transition-all ${
          currentPage === totalPages || isLoading
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-500 hover:text-blue-600"
        }`}
      >
        Next <FaChevronRight className="ml-1 text-xs" />
      </button>
    </div>
  );
};

// --- MAIN SECTION ---
const EventsSection = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const ITEMS_PER_PAGE = 9;

  const fetchAllEvents = async () => {
    setIsLoading(true);
    let backendEvents = [];
    try {
      if (!import.meta.env.VITE_BACKEND_URL) {
        throw new Error("VITE_BACKEND_URL is not configured");
      }
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/event?limit=1000`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (!response.ok) throw new Error(`Event API returned ${response.status}`);
      const data = await response.json();
      backendEvents = Array.isArray(data.data) ? data.data : [];
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
      const eventMap = new Map();
      [...backendEvents, ...tenureEvents2026_27].forEach((event) => {
        eventMap.set(event.gdgUrl || event._id, event);
      });
      const fullList = [...eventMap.values()].sort(
        (a, b) => new Date(b.date_from) - new Date(a.date_from)
      );
      setAllEvents(fullList);
      setTotalPages(Math.max(1, Math.ceil(fullList.length / ITEMS_PER_PAGE)));
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  useEffect(() => {
    if (allEvents.length > 0) {
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const endIndex = startIndex + ITEMS_PER_PAGE;
      setDisplayedEvents(allEvents.slice(startIndex, endIndex));
      if (page > 1) {
        document
          .getElementById("events-grid")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [page, allEvents]);

  // --- LOCAL STATE UPDATE ---
  const handleRegistrationUpdate = (eventId) => {
    const updatedEvents = allEvents.map((evt) => {
      if (evt._id === eventId) {
        return {
          ...evt,
          isEnrolled: true,
          participantCount: evt.participantCount + 1,
        };
      }
      return evt;
    });

    setAllEvents(updatedEvents);

    if (selectedEvent && selectedEvent._id === eventId) {
      setSelectedEvent((prev) => ({ ...prev, isEnrolled: true }));
    }
  };

  return (
    <>
      <section className="bg-gray-50 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-50 px-6 py-3 rounded-full border border-green-200 mb-6">
            <FaCalendarAlt className="text-green-500" />
            <span className="text-lg font-semibold text-green-600">
              Tenure 2026–27 Events
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover{" "}
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Tenure Events
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore events from the GDG on Campus Quantum University 2026–27 tenure.
          </p>
        </div>

        {/* Events Grid */}
        <div
          id="events-grid"
          className={`mb-8 flex min-h-[400px] snap-x snap-mandatory gap-6 overflow-x-auto pb-4 ${
            displayedEvents.length <= 3 ? "xl:justify-center" : ""
          }`}
        >
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl shadow-lg h-96 animate-pulse border border-gray-100 p-4"
                >
                  <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))
            : displayedEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  onClick={setSelectedEvent}
                />
              ))}
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            isLoading={isLoading}
          />
        )}
        <div className="mt-14 border-t border-gray-200 pt-10">
          <div className="mb-10 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-5 py-2 text-blue-700">
              <FaCalendarAlt />
              <span className="font-semibold">Tenure 2025–26</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Tenure 2025–26 Event
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 xl:grid-cols-4">
            {tenureEvents2025_26.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onClick={setSelectedEvent}
              />
            ))}
          </div>
        </div>
      </div>
    </section>

      <EventModal
        event={selectedEvent}
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onRegisterSuccess={handleRegistrationUpdate}
      />

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default EventsSection;
