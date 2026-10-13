import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaTimes,
  FaSpinner,
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaUserTie,
  FaIdBadge,
} from "react-icons/fa";

// --- CONFIG ---
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/team`;

const BRAND_COLORS = {
  blue: "text-blue-600 bg-blue-50 border-blue-200",
  red: "text-red-600 bg-red-50 border-red-200",
  green: "text-green-600 bg-green-50 border-green-200",
  yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
};

// --- UTILS ---
const getBadgeStyle = (position) => {
  const p = position.toLowerCase();
  if (p.includes("lead") || p.includes("organizer")) return BRAND_COLORS.red;
  if (p.includes("tech") || p.includes("dev")) return BRAND_COLORS.blue;
  if (p.includes("design") || p.includes("creative")) return BRAND_COLORS.yellow;
  return BRAND_COLORS.green;
};

// --- MODAL COMPONENT ---
const TeamMemberModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    name: "",
    position: "",
    badge: "", // e.g., "Core Team"
    bio: "", // Short bio
    fullBio: "", // Long bio
    image: "",
    linkedinUrl: "",
    githubUrl: "",
    twitterUrl: "",
    instagramUrl: "",
    skills: "", // Managed as comma-separated string
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        skills: initialData.skills ? initialData.skills.join(", ") : "",
        // Handle potential nulls
        linkedinUrl: initialData.linkedinUrl || "",
        githubUrl: initialData.githubUrl || "",
        twitterUrl: initialData.twitterUrl || "",
        instagramUrl: initialData.instagramUrl || "",
        badge: initialData.badge || "",
      });
    } else {
      setFormData({
        name: "",
        position: "",
        badge: "Core Team",
        bio: "",
        fullBio: "",
        image: "",
        linkedinUrl: "",
        githubUrl: "",
        twitterUrl: "",
        instagramUrl: "",
        skills: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Clean up empty strings for social URLs to avoid validation errors
    // and convert skills string to array
    const cleanData = {
      ...formData,
      skills: formData.skills.split(",").map(s => s.trim()).filter(Boolean),
    };

    // Remove empty social strings if backend validation is strict on isURL
    if (!cleanData.linkedinUrl) delete cleanData.linkedinUrl;
    if (!cleanData.githubUrl) delete cleanData.githubUrl;
    if (!cleanData.twitterUrl) delete cleanData.twitterUrl;
    if (!cleanData.instagramUrl) delete cleanData.instagramUrl;
    if (!cleanData.badge) delete cleanData.badge;

    onSubmit(cleanData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-up">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FaUserTie className="text-blue-600" />
            {initialData ? "Edit Team Member" : "Add Team Member"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Row 1: Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Position / Role</label>
              <input
                required
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Flutter Lead"
              />
            </div>
          </div>

          {/* Row 2: Badge & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Badge (Optional)</label>
              <input
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Core Team, Volunteer"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Profile Image URL</label>
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Row 3: Bios */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Short Bio (Card View)</label>
            <textarea
              required
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Brief introduction..."
            />
            <p className="text-xs text-gray-400 mt-1">Min 10 chars, Max 500 chars.</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Biography (Detail View)</label>
            <textarea
              required
              name="fullBio"
              value={formData.fullBio}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Detailed background and experience..."
            />
          </div>

          {/* Row 4: Skills */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Skills (Comma Separated)</label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="React, Node.js, Public Speaking, UI/UX"
            />
          </div>

          {/* Row 5: Socials */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
             <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                Social Links <span className="text-xs font-normal text-gray-400">(Optional)</span>
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <FaLinkedin className="absolute left-3 top-3 text-blue-700"/>
                    <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder="LinkedIn URL" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"/>
                </div>
                <div className="relative">
                    <FaGithub className="absolute left-3 top-3 text-gray-800"/>
                    <input name="githubUrl" value={formData.githubUrl} onChange={handleChange} placeholder="GitHub URL" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"/>
                </div>
                <div className="relative">
                    <FaTwitter className="absolute left-3 top-3 text-blue-400"/>
                    <input name="twitterUrl" value={formData.twitterUrl} onChange={handleChange} placeholder="Twitter/X URL" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"/>
                </div>
                <div className="relative">
                    <FaInstagram className="absolute left-3 top-3 text-pink-600"/>
                    <input name="instagramUrl" value={formData.instagramUrl} onChange={handleChange} placeholder="Instagram URL" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"/>
                </div>
             </div>
          </div>

          <div className="pt-4 flex justify-end gap-3">
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
              {initialData ? "Update Member" : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- MAIN PAGE ---
const AdminTeamPage = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 1. Fetch
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL, { credentials: "include" });
      const data = await res.json();
      if (data.success || Array.isArray(data.data)) {
        setMembers(data.data);
        setFilteredMembers(data.data);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 2. Search
  useEffect(() => {
    const lower = searchQuery.toLowerCase();
    const filtered = members.filter(
      (m) =>
        m.name.toLowerCase().includes(lower) ||
        m.position.toLowerCase().includes(lower)
    );
    setFilteredMembers(filtered);
  }, [searchQuery, members]);

  // 3. Actions
  const handleCreate = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this team member?")) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete");
      }
    } catch (err) {
      alert("Error deleting member");
    }
  };

  const handleFormSubmit = async (payload) => {
    setIsSubmitting(true);
    try {
      const url = editingMember ? `${API_URL}/${editingMember._id}` : `${API_URL}/create`;
      const method = editingMember ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        fetchMembers();
      } else {
        if (data.errors) {
            const msgs = data.errors.map(e => `${e.path}: ${e.msg}`).join("\n");
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
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Team Management</h1>
            <p className="text-gray-500 mt-2">Manage profiles, roles, and permissions.</p>
          </div>
          <button
            onClick={handleCreate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:scale-105 font-medium"
          >
            <FaPlus className="text-sm" /> Add Member
          </button>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex items-center gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or position..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
            />
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center text-gray-400">
              <FaSpinner className="animate-spin text-3xl mb-3 text-blue-500" />
              <p>Loading team...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <th className="p-6">Member</th>
                    <th className="p-6">Role & Badge</th>
                    <th className="p-6">Details</th>
                    <th className="p-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredMembers.length > 0 ? (
                    filteredMembers.map((member) => (
                      <tr key={member._id} className="hover:bg-blue-50/30 transition-colors group">
                        
                        {/* Avatar & Name */}
                        <td className="p-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                                {member.image ? (
                                    <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <FaUserTie />
                                    </div>
                                )}
                            </div>
                            <div>
                              <div className="font-bold text-gray-900">{member.name}</div>
                              <div className="flex gap-2 text-gray-400 text-xs mt-1">
                                {member.linkedinUrl && <FaLinkedin className="hover:text-blue-700"/>}
                                {member.githubUrl && <FaGithub className="hover:text-black"/>}
                                {member.twitterUrl && <FaTwitter className="hover:text-blue-400"/>}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Position */}
                        <td className="p-6">
                            <div className="text-sm font-semibold text-gray-800">{member.position}</div>
                            {member.badge && (
                                <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${getBadgeStyle(member.position)}`}>
                                    {member.badge}
                                </span>
                            )}
                        </td>

                        {/* Bio/Skills */}
                        <td className="p-6 max-w-xs">
                           <div className="text-sm text-gray-600 line-clamp-2" title={member.bio}>{member.bio}</div>
                           {member.skills && member.skills.length > 0 && (
                               <div className="mt-2 text-xs text-gray-400">
                                   <FaIdBadge className="inline mr-1" />
                                   {member.skills.slice(0, 3).join(", ")}
                                   {member.skills.length > 3 && ` +${member.skills.length - 3}`}
                               </div>
                           )}
                        </td>

                        {/* Actions */}
                        <td className="p-6">
                          <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEdit(member)}
                              className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDelete(member._id)}
                              className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="p-12 text-center text-gray-500">
                        No team members found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingMember}
        isSubmitting={isSubmitting}
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

export default AdminTeamPage;