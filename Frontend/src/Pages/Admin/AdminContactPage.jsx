import { useState, useEffect } from "react";
import {
  FaSearch,
  FaTrash,
  FaEnvelope,
  FaEnvelopeOpen,
  FaReply,
  FaSpinner,
  FaCalendarAlt,
  FaTimes,
  FaUserCircle,
  FaPaperPlane,
} from "react-icons/fa";

// --- CONFIG ---
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/contact`;

// --- UTILS ---
const formatDate = (isoString) => {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// --- COMPONENT: MESSAGE READING MODAL ---
const MessageModal = ({ message, isOpen, onClose, onDelete }) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-scale-up flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-start bg-gray-50/50">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg shadow-inner">
              {getInitials(message.name)}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{message.name}</h2>
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <span className="font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{message.email}</span>
                <span>•</span>
                <span>{formatDate(message.createdAt)}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-200 rounded-full">
            <FaTimes size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 overflow-y-auto flex-1 text-gray-700 leading-relaxed whitespace-pre-wrap font-sans text-lg">
          {message.message}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
          <button
            onClick={() => onDelete(message._id)}
            className="px-4 py-2.5 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors flex items-center gap-2 border border-transparent hover:border-red-100"
          >
            <FaTrash /> Delete
          </button>
          <a
            href={`mailto:${message.email}?subject=Re: Inquiry from GDG Website&body=Hi ${message.name.split(" ")[0]},\n\nThank you for reaching out...`}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <FaReply /> Reply via Email
          </a>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const AdminContactPage = () => {
  const [messages, setMessages] = useState([]);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [selectedMessage, setSelectedMessage] = useState(null);

  // 1. Fetch Messages
  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      const data = await res.json();
      
      if (res.ok) {
        // Assuming backend returns { data: [...] } or just [...]
        const list = Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
        // Sort by date desc (newest first)
        const sorted = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setMessages(sorted);
        setFilteredMessages(sorted);
      } else {
        console.error("Failed to fetch messages");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // 2. Search Logic
  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = messages.filter(
      (m) =>
        m.name.toLowerCase().includes(lower) ||
        m.email.toLowerCase().includes(lower) ||
        m.message.toLowerCase().includes(lower)
    );
    setFilteredMessages(filtered);
  }, [searchQuery, messages]);

  // 3. Delete Handler
  const handleDelete = async (id) => {
    // If called from modal, close modal first
    if (selectedMessage?._id === id) setSelectedMessage(null);

    if (!window.confirm("Are you sure you want to delete this message?")) return;

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m._id !== id));
      } else {
        alert("Failed to delete message");
      }
    } catch (err) {
      alert("Network error");
    }
  };

  const handleOpen = (msg) => {
    setSelectedMessage(msg);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10 font-sans text-gray-900">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
              Inbox <span className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">{messages.length}</span>
            </h1>
            <p className="text-gray-500 mt-2">Manage inquiries and support requests.</p>
          </div>
          <div className="flex gap-2">
             <button onClick={fetchMessages} className="p-3 bg-white border border-gray-200 text-gray-600 hover:text-blue-600 rounded-xl hover:shadow-md transition-all">
                Refresh
             </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        {/* Message List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center text-gray-400">
              <FaSpinner className="animate-spin text-3xl mb-3 text-blue-500" />
              <p>Loading inbox...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="p-6">Sender</th>
                    <th className="p-6">Message Preview</th>
                    <th className="p-6">Date</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMessages.length > 0 ? (
                    filteredMessages.map((msg) => (
                      <tr 
                        key={msg._id} 
                        onClick={() => handleOpen(msg)}
                        className="hover:bg-blue-50/30 transition-colors group cursor-pointer"
                      >
                        
                        {/* Sender Info */}
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 flex items-center justify-center font-bold text-xs border border-blue-200">
                                {getInitials(msg.name)}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{msg.name}</div>
                              <div className="text-xs text-gray-500 mt-0.5">{msg.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Message Preview */}
                        <td className="p-6 max-w-md">
                           <div className="text-sm text-gray-600 line-clamp-2">
                             {msg.message}
                           </div>
                        </td>

                        {/* Date */}
                        <td className="p-6 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded w-fit">
                                <FaCalendarAlt />
                                {formatDate(msg.createdAt)}
                            </div>
                        </td>

                        {/* Actions */}
                        <td className="p-6 text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpen(msg)}
                              className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Read Message"
                            >
                              <FaEnvelopeOpen />
                            </button>
                            <a
                               href={`mailto:${msg.email}`}
                               className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
                               title="Quick Reply"
                            >
                                <FaReply />
                            </a>
                            <button
                              onClick={() => handleDelete(msg._id)}
                              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-20 text-center text-gray-400 flex flex-col items-center">
                        <FaEnvelope className="text-4xl mb-4 text-gray-200" />
                        No messages found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Message Reading Modal */}
      <MessageModal 
        message={selectedMessage} 
        isOpen={!!selectedMessage} 
        onClose={() => setSelectedMessage(null)}
        onDelete={handleDelete}
      />

      <style jsx>{`
        @keyframes scale-up {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-up {
          animation: scale-up 0.2s ease-out forwards;
        }
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AdminContactPage;