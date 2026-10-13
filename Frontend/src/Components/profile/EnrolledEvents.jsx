import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaClock,
  FaTicketAlt,
  FaTrashAlt,
  FaCheckCircle,
  FaExternalLinkAlt,
  FaHistory,
  FaSpinner,
  FaExclamationCircle,
} from "react-icons/fa";

const getEventTypeColor = (type) => {
  const normalizeType = type?.toLowerCase() || "";
  switch (normalizeType) {
    case "workshop":
      return "#4285f4"; // Blue
    case "seminar":
      return "#34a853"; // Green
    case "hackathon":
      return "#f9ab00"; // Yellow
    case "bootcamp":
      return "#ea4335"; // Red
    default:
      return "#4285f4";
  }
};

const EnrolledEventsSection = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unenrollLoading, setUnenrollLoading] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledEvents = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/event/enrolled`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include", // Important for passing cookies/session
          }
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setEvents(result.data);
        } else {
          setError(result.message || "Failed to fetch events");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not load your enrollments. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledEvents();
  }, []);

  const handleUnenroll = async (eventId) => {
    if (!window.confirm("Are you sure you want to cancel your registration?"))
      return;

    setUnenrollLoading(eventId);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/event/unenroll/${eventId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (result.success) {
        // Optimistically remove event from state
        setEvents((prev) => prev.filter((e) => e._id !== eventId));
      } else {
        alert(result.message || "Failed to unenroll.");
      }
    } catch (err) {
      console.error("Unenroll error:", err);
      alert("Something went wrong. Please check your connection.");
    } finally {
      setUnenrollLoading(null);
    }
  };

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date_from);
    const now = new Date();
    const isFuture = eventDate > now;
    return activeTab === "upcoming" ? isFuture : !isFuture;
  });

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  if (error) {
    return (
      <div className="py-20 text-center text-red-500 bg-slate-50 min-h-[400px] flex flex-col items-center justify-center">
        <FaExclamationCircle className="text-4xl mb-4" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-12 md:py-20 bg-slate-50 min-h-[500px] relative border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* --- SECTION HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaTicketAlt className="text-blue-500" /> My Enrollments
            </h2>
            <p className="text-gray-500 mt-2">
              Manage your registrations and view event history.
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex p-1 bg-white rounded-xl border border-gray-200 shadow-sm self-start md:self-auto">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === "upcoming"
                  ? "bg-blue-50 text-blue-600 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveTab("past")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === "past"
                  ? "bg-gray-100 text-gray-800 shadow-sm"
                  : "text-gray-500 hover:bg-gray-50"
              }`}
            >
              Past Events
            </button>
          </div>
        </div>

        {/* --- CONTENT GRID --- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          // EMPTY STATE
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 text-3xl mx-auto mb-4">
              {activeTab === "upcoming" ? <FaCalendarAlt /> : <FaHistory />}
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              No {activeTab} events found
            </h3>
            <p className="text-gray-500 mb-6">
              You haven't enrolled in any {activeTab} events yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const themeColor = getEventTypeColor(event.type);
              return (
                <div
                  key={event._id}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  {/* Card Image */}
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    <img
                      src={
                        event.cover ||
                        "https://via.placeholder.com/400x200?text=Event"
                      }
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div
                      className="absolute top-3 left-3 px-2 py-1 rounded-md text-xs font-bold text-white uppercase tracking-wider backdrop-blur-md shadow-sm"
                      style={{ backgroundColor: themeColor }}
                    >
                      {event.type}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-3 leading-snug">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-6 flex-1">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaCalendarAlt className="text-gray-400 shrink-0" />{" "}
                        {formatDate(event.date_from)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaClock className="text-gray-400 shrink-0" />{" "}
                        {formatTime(event.date_from)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaMapMarkerAlt className="text-gray-400 shrink-0" />{" "}
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-4 border-t border-gray-100">
                      {activeTab === "upcoming" ? (
                        <button
                          onClick={() => handleUnenroll(event._id)}
                          disabled={unenrollLoading === event._id}
                          className="w-full py-2.5 rounded-lg border border-red-200 text-red-600 font-bold text-sm hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {unenrollLoading === event._id ? (
                            <>
                              <FaSpinner className="animate-spin" />{" "}
                              Processing...
                            </>
                          ) : (
                            <>
                              <FaTrashAlt /> Cancel Registration
                            </>
                          )}
                        </button>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-green-600 font-bold text-sm bg-green-50 px-3 py-1.5 rounded-lg">
                            <FaCheckCircle /> Attended
                          </div>
                          {event.gdgUrl && (
                            <a
                              href={event.gdgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-gray-400 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors"
                            >
                              Details <FaExternalLinkAlt className="text-xs" />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default EnrolledEventsSection;
