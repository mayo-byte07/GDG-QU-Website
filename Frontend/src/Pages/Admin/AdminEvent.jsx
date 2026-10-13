import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSync,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaExternalLinkAlt,
  FaUsers,
} from "react-icons/fa";

// --- CONFIG ---
// Ensure this matches your .env setup
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/event`;

const EVENT_TYPES = [
  "conference",
  "meetup",
  "workshop",
  "hackathon",
  "webinar",
  "seminar",
  "bootcamp",
];

// --- UTILITY FUNCTIONS ---
const formatDateForInput = (isoDate) => {
  if (!isoDate) return "";
  // Format: YYYY-MM-DDTHH:mm for <input type="datetime-local" />
  return new Date(isoDate).toISOString().slice(0, 16);
};

const formatDateDisplay = (date) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

// --- SUB-COMPONENT: CREATE/EDIT MODAL ---
const EventFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  // Initialize form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "workshop",
    venue: "",
    date_from: "",
    date_to: "",
    gdgUrl: "",
    maxParticipants: 100,
    speakers: "", // Helper: managed as string, converted to array on submit
    cover: "", // Optional image URL
  });

  // Populate form on edit or reset on create
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date_from: formatDateForInput(initialData.date_from),
        date_to: formatDateForInput(initialData.date_to),
        // Join array to string for input field
        speakers: initialData.speakers ? initialData.speakers.join(", ") : "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        type: "workshop",
        venue: "",
        date_from: "",
        date_to: "",
        gdgUrl: "",
        maxParticipants: 100,
        speakers: "",
        cover: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Transform data to match backend schema
    const payload = {
      ...formData,
      // Split comma-separated string into array and trim whitespace
      speakers: formData.speakers
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s),
      maxParticipants: parseInt(formData.maxParticipants) || 0,
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-up">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900">
            {initialData ? "Edit Event" : "Create New Event"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Row 1: Title & Type */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Title
              </label>
              <input
                required
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="e.g. Google IO Extended"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none capitalize bg-white"
              >
                {EVENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Enter event details..."
            />
          </div>

          {/* Row 3: Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Start Date
              </label>
              <input
                required
                type="datetime-local"
                name="date_from"
                value={formData.date_from}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                End Date
              </label>
              <input
                required
                type="datetime-local"
                name="date_to"
                value={formData.date_to}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Row 4: Venue & Participants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Venue
              </label>
              <input
                required
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Google Meet or Physical Address"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Max Participants
              </label>
              <input
                type="number"
                name="maxParticipants"
                value={formData.maxParticipants}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          {/* Row 5: GDG URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              GDG Community URL
            </label>
            <input
              required
              name="gdgUrl"
              value={formData.gdgUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://gdg.community.dev/events/details/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Required for the backend to sync data via the refresh button.
            </p>
          </div>

          {/* Row 6: Speakers */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Speakers (comma separated)
            </label>
            <input
              required
              name="speakers"
              value={formData.speakers}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. John Doe, Jane Smith"
            />
          </div>

          {/* Row 7: Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Cover Image URL
            </label>
            <input
              name="cover"
              value={formData.cover}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-6 flex justify-end gap-3 border-t border-gray-100 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting && <FaSpinner className="animate-spin" />}
              {initialData ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const AdminEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refresh loading state per item
  const [refreshingIds, setRefreshingIds] = useState(new Set());

  // 1. Fetch Events
  const fetchEvents = async () => {
    setLoading(true);
    try {
      // Fetch all events (limit=1000 ensures we get everything for admin view)
      const res = await fetch(`${API_URL}?limit=1000`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success || Array.isArray(data.data)) {
        setEvents(data.data);
        setFilteredEvents(data.data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      // You might want to use a toast notification library here
      alert("Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // 2. Client-side Search
  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = events.filter(
      (e) =>
        e.title.toLowerCase().includes(lowerQuery) ||
        e.venue.toLowerCase().includes(lowerQuery)
    );
    setFilteredEvents(filtered);
  }, [searchQuery, events]);

  // 3. Actions Handlers
  const handleCreate = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to permanently delete this event?")
    )
      return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e._id !== id));
        // Optional: Toast success
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      alert("Error deleting event");
    }
  };

  // Calls the /refresh/:id endpoint
  const handleRefresh = async (id) => {
    setRefreshingIds((prev) => new Set(prev).add(id));
    try {
      const res = await fetch(`${API_URL}/refresh/${id}`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (res.ok) {
        // Update local state with fresh data from backend
        setEvents((prev) => prev.map((e) => (e._id === id ? data.data : e)));
      } else {
        alert(data.message || "Failed to refresh event");
      }
    } catch (err) {
      console.error(err);
      alert("Error refreshing event");
    } finally {
      setRefreshingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  // Handles Create (POST) and Update (PUT)
  const handleFormSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const url = editingEvent
        ? `${API_URL}/${editingEvent._id}`
        : `${API_URL}/create`;
      const method = editingEvent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        fetchEvents(); // Reload list to sort correctly
      } else {
        // Handle express-validator errors array if present
        if (data.errors) {
          const msgs = data.errors.map((e) => e.msg).join("\n");
          alert("Validation Error:\n" + msgs);
        } else {
          alert(data.message || "Operation failed");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        {/* PAGE HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Events Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              Manage workshops, meetups, and conferences.
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:scale-105 font-medium"
          >
            <FaPlus className="text-sm" /> Create Event
          </button>
        </div>

        {/* SEARCH & STATS BAR */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="relative w-full sm:w-96">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title or venue..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100">
            <span className="font-bold text-gray-900">
              {filteredEvents.length}
            </span>{" "}
            Events Found
          </div>
        </div>

        {/* DATA TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <FaSpinner className="animate-spin text-3xl mb-3 text-blue-500" />
              <p>Loading events...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="p-6">Event Details</th>
                    <th className="p-6">Schedule</th>
                    <th className="p-6 text-center">Enrollment</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <tr
                        key={event._id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        {/* Event Info */}
                        <td className="p-6 max-w-sm">
                          <div
                            className="font-bold text-gray-900 text-base truncate mb-1"
                            title={event.title}
                          >
                            {event.title}
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border
                                ${
                                  event.type === "workshop"
                                    ? "bg-blue-50 text-blue-600 border-blue-100"
                                    : event.type === "hackathon"
                                      ? "bg-yellow-50 text-yellow-600 border-yellow-100"
                                      : "bg-gray-100 text-gray-600 border-gray-200"
                                }`}
                            >
                              {event.type}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-1.5">
                            <FaMapMarkerAlt
                              className="text-gray-400"
                              size={12}
                            />{" "}
                            {event.venue}
                          </div>
                        </td>

                        {/* Date Info */}
                        <td className="p-6 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
                            <FaCalendarAlt className="text-blue-500" />
                            {formatDateDisplay(event.date_from)}
                          </div>
                          <div className="text-xs text-gray-500 ml-6 mt-1">
                            to {formatDateDisplay(event.date_to)}
                          </div>
                        </td>

                        {/* Participants Stats */}
                        <td className="p-6 text-center">
                          <div className="inline-flex flex-col items-center justify-center">
                            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
                              <FaUsers className="text-gray-400 text-sm" />
                              {event.participantCount || 0}
                              <span className="text-gray-400 text-sm font-normal">
                                / {event.maxParticipants}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Actions Toolbar */}
                        <td className="p-6">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() =>
                                window.open(event.gdgUrl, "_blank")
                              }
                              className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="View on GDG Community Dev"
                            >
                              <FaExternalLinkAlt />
                            </button>
                            <button
                              onClick={() => handleRefresh(event._id)}
                              disabled={refreshingIds.has(event._id)}
                              className={`p-2.5 rounded-lg transition-all ${
                                refreshingIds.has(event._id)
                                  ? "text-blue-500 bg-blue-50"
                                  : "text-gray-400 hover:text-green-600 hover:bg-green-50"
                              }`}
                              title="Refresh Data from GDG"
                            >
                              <FaSync
                                className={
                                  refreshingIds.has(event._id)
                                    ? "animate-spin"
                                    : ""
                                }
                              />
                            </button>
                            <button
                              onClick={() => handleEdit(event)}
                              className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                              title="Edit Event"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(event._id)}
                              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete Event"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-12 text-center text-gray-500"
                      >
                        No events found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingEvent}
        isSubmitting={isSubmitting}
      />

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
          animation: scale-up 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminEventsPage;
