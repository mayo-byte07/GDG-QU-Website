import { useState, useEffect } from "react";
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

// --- MODAL COMPONENT ---
const EventModal = ({ event, isOpen, onClose, onRegisterSuccess }) => {
  if (!isOpen || !event) return null;
  const isUpcoming = new Date(event.date_from) > new Date();
  const themeColor = getEventTypeColor(event.type);
  const [isRegistering, setIsRegistering] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
        {/* Header Image */}
        <div className="relative h-56 flex-shrink-0 bg-gray-200">
          <img
            src={event.cover}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all z-10"
          >
            <FaTimes />
          </button>
          <div className="absolute bottom-6 left-6 right-6 text-white">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20 mb-3 inline-block">
              {event.type}
            </span>
            <h2 className="text-3xl font-bold leading-tight">{event.title}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Col */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <FaInfoCircle style={{ color: themeColor }} /> About
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {event.description}
                </p>
              </div>
              {!isUpcoming && event.photos && event.photos.length > 0 && (
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <FaImages style={{ color: themeColor }} /> Event Gallery
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {event.photos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="aspect-square rounded-lg overflow-hidden shadow-sm bg-gray-100"
                      >
                        <img
                          src={photo}
                          alt="Gallery"
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Col */}
            <div className="space-y-4">
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase">
                    Speakers
                  </div>
                  <div className="font-medium text-gray-800">
                    {event.speakers.join(", ")}
                  </div>
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase">
                    Venue
                  </div>
                  <div className="font-medium text-gray-800">{event.venue}</div>
                </div>

                {isUpcoming &&
                  (event.isEnrolled ? (
                    <div className="w-full py-3 text-center bg-green-100 text-green-700 font-bold rounded-lg border border-green-200 flex items-center justify-center gap-2 cursor-default">
                      <FaCheckCircle /> You are Registered
                    </div>
                  ) : (
                    <button
                      onClick={handleRegistration}
                      disabled={isRegistering}
                      className="w-full py-3 text-center text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      style={{ backgroundColor: themeColor }}
                    >
                      {isRegistering && <FaSpinner className="animate-spin" />}
                      {isRegistering ? "Registering..." : "Register Now"}
                    </button>
                  ))}
              </div>
            </div>
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

  return (
    <div
      onClick={() => onClick(event)}
      className="group relative bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer h-full flex flex-col"
    >
      <div className="relative h-48 overflow-hidden flex-shrink-0 bg-gray-200">
        <img
          src={event.cover}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
            !isUpcoming ? "grayscale-[0.8] group-hover:grayscale-0" : ""
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

        <div className="flex items-center space-x-2 mb-3">
          <FaUser className="text-gray-400 text-sm" />
          <span className="text-sm text-gray-600 truncate">
            By {event.speakers[0]}
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
                  backgroundColor: isUpcoming ? themeColor : "#e5e7eb",
                  color: isUpcoming ? "white" : "#6b7280",
                }
          }
        >
          {isUpcoming ? (
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
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/event?limit=1000`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const data = await response.json();
      const fullList = data.data || [];
      setAllEvents(fullList);
      setTotalPages(Math.ceil(fullList.length / ITEMS_PER_PAGE));
    } catch (error) {
      console.error("Failed to fetch events:", error);
    } finally {
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
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-green-50 px-6 py-3 rounded-full border border-green-200 mb-6">
            <FaCalendarAlt className="text-green-500" />
            <span className="text-lg font-semibold text-green-600">
              Community Calendar
            </span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Discover{" "}
            <span className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
              Amazing Events
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse our upcoming workshops or check out the gallery from past
            sessions.
          </p>
        </div>

        {/* Events Grid */}
        <div
          id="events-grid"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8 min-h-[600px]"
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
      </div>

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
    </section>
  );
};

export default EventsSection;
