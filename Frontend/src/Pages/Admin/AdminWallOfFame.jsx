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
    FaTrophy,
} from "react-icons/fa";

// --- CONFIG ---
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/wof`;

const COLOR_OPTIONS = [
    { value: "blue", label: "Blue", className: "bg-blue-500" },
    { value: "red", label: "Red", className: "bg-red-500" },
    { value: "yellow", label: "Yellow", className: "bg-yellow-500" },
    { value: "green", label: "Green", className: "bg-green-500" },
];

const BRAND_COLORS = {
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    red: "text-red-600 bg-red-50 border-red-200",
    green: "text-green-600 bg-green-50 border-green-200",
    yellow: "text-yellow-600 bg-yellow-50 border-yellow-200",
};

// --- UTILS ---
const getBadgeStyle = (color) => {
    return BRAND_COLORS[color] || BRAND_COLORS.blue;
};

// --- MODAL COMPONENT ---
const WallOfFameModal = ({ isOpen, onClose, onSubmit, initialData, isSubmitting }) => {
    if (!isOpen) return null;

    const [formData, setFormData] = useState({
        name: "",
        position: "",
        bio: "",
        image: "",
        badge: "",
        skills: "",
        linkedinUrl: "",
        githubUrl: "",
        twitterUrl: "",
        instagramUrl: "",
        color: "blue",
        year: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                position: initialData.position || "",
                bio: initialData.bio || "",
                image: initialData.image || "",
                badge: initialData.badge || "",
                skills: initialData.skills ? initialData.skills.join(", ") : "",
                linkedinUrl: initialData.social?.linkedin || "",
                githubUrl: initialData.social?.github || "",
                twitterUrl: initialData.social?.twitter || "",
                instagramUrl: initialData.social?.instagram || "",
                color: initialData.color || "blue",
                year: initialData.year || "",
            });
        } else {
            setFormData({
                name: "",
                position: "",
                bio: "",
                image: "",
                badge: "Core Contributor",
                skills: "",
                linkedinUrl: "",
                githubUrl: "",
                twitterUrl: "",
                instagramUrl: "",
                color: "blue",
                year: "",
            });
        }
    }, [initialData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const cleanData = {
            name: formData.name,
            position: formData.position,
            bio: formData.bio,
            image: formData.image || undefined,
            badge: formData.badge || undefined,
            skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
            social: {
                linkedin: formData.linkedinUrl || null,
                github: formData.githubUrl || null,
                twitter: formData.twitterUrl || null,
                instagram: formData.instagramUrl || null,
            },
            color: formData.color,
            year: formData.year,
        };

        onSubmit(cleanData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-scale-up">
                <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <FaTrophy className="text-yellow-500" />
                        {initialData ? "Edit Entry" : "Add Wall of Fame Entry"}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Row 1: Name & Position */}
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
                                placeholder="e.g. Tech Lead"
                            />
                        </div>
                    </div>

                    {/* Row 2: Year & Badge */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Year</label>
                            <input
                                required
                                name="year"
                                value={formData.year}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. 2024-2025"
                            />
                            <p className="text-xs text-gray-400 mt-1">Format: YYYY-YYYY</p>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Badge (Optional)</label>
                            <input
                                name="badge"
                                value={formData.badge}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Chapter Lead, Core Contributor"
                            />
                        </div>
                    </div>

                    {/* Row 3: Image URL & Color */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Theme Color</label>
                            <div className="flex gap-3 mt-2">
                                {COLOR_OPTIONS.map((opt) => (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => setFormData((prev) => ({ ...prev, color: opt.value }))}
                                        className={`w-10 h-10 rounded-full ${opt.className} transition-all ${formData.color === opt.value
                                                ? "ring-4 ring-offset-2 ring-gray-400 scale-110"
                                                : "opacity-60 hover:opacity-100"
                                            }`}
                                        title={opt.label}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Row 4: Bio */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Bio</label>
                        <textarea
                            required
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="Brief introduction about this member..."
                        />
                        <p className="text-xs text-gray-400 mt-1">Min 10 chars, Max 500 chars.</p>
                    </div>

                    {/* Row 5: Skills */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Skills (Comma Separated)</label>
                        <input
                            name="skills"
                            value={formData.skills}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="React, Flutter, Leadership, UI/UX"
                        />
                    </div>

                    {/* Row 6: Socials */}
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                            Social Links <span className="text-xs font-normal text-gray-400">(Optional)</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <FaLinkedin className="absolute left-3 top-3 text-blue-700" />
                                <input
                                    name="linkedinUrl"
                                    value={formData.linkedinUrl}
                                    onChange={handleChange}
                                    placeholder="LinkedIn URL"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaGithub className="absolute left-3 top-3 text-gray-800" />
                                <input
                                    name="githubUrl"
                                    value={formData.githubUrl}
                                    onChange={handleChange}
                                    placeholder="GitHub URL"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaTwitter className="absolute left-3 top-3 text-blue-400" />
                                <input
                                    name="twitterUrl"
                                    value={formData.twitterUrl}
                                    onChange={handleChange}
                                    placeholder="Twitter/X URL"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <div className="relative">
                                <FaInstagram className="absolute left-3 top-3 text-pink-600" />
                                <input
                                    name="instagramUrl"
                                    value={formData.instagramUrl}
                                    onChange={handleChange}
                                    placeholder="Instagram URL"
                                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                />
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
                            {initialData ? "Update Entry" : "Add Entry"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

// --- MAIN PAGE ---
const AdminWallOfFamePage = () => {
    const [entries, setEntries] = useState([]);
    const [filteredEntries, setFilteredEntries] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [yearFilter, setYearFilter] = useState("all");
    const [availableYears, setAvailableYears] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1. Fetch
    const fetchEntries = async () => {
        setLoading(true);
        try {
            const res = await fetch(API_URL, { credentials: "include" });
            const data = await res.json();
            if (data.success && data.data) {
                const { grouped, availableYears: years } = data.data;
                // Flatten grouped data into a flat array for table display
                const flatEntries = [];
                for (const year of years) {
                    if (grouped[year]) {
                        for (const entry of grouped[year]) {
                            flatEntries.push(entry);
                        }
                    }
                }
                setEntries(flatEntries);
                setFilteredEntries(flatEntries);
                setAvailableYears(years || []);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to load Wall of Fame entries");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    // 2. Search & Filter
    useEffect(() => {
        const lower = searchQuery.toLowerCase();
        const filtered = entries.filter((e) => {
            const matchesSearch =
                e.name.toLowerCase().includes(lower) ||
                e.position.toLowerCase().includes(lower) ||
                (e.year && e.year.toLowerCase().includes(lower));
            const matchesYear = yearFilter === "all" || e.year === yearFilter;
            return matchesSearch && matchesYear;
        });
        setFilteredEntries(filtered);
    }, [searchQuery, yearFilter, entries]);

    // 3. Actions
    const handleCreate = () => {
        setEditingEntry(null);
        setIsModalOpen(true);
    };

    const handleEdit = (entry) => {
        setEditingEntry(entry);
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this entry?")) return;
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                setEntries((prev) => prev.filter((e) => e._id !== id));
            } else {
                const data = await res.json();
                alert(data.message || "Failed to delete");
            }
        } catch (err) {
            alert("Error deleting entry");
        }
    };

    const handleFormSubmit = async (payload) => {
        setIsSubmitting(true);
        try {
            const url = editingEntry ? `${API_URL}/${editingEntry._id}` : API_URL;
            const method = editingEntry ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            const data = await res.json();

            if (res.ok) {
                setIsModalOpen(false);
                fetchEntries();
            } else {
                if (data.errors) {
                    const msgs = data.errors.map((e) => `${e.path}: ${e.msg}`).join("\n");
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
                        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Wall of Fame</h1>
                        <p className="text-gray-500 mt-2">Manage alumni and past team member entries.</p>
                    </div>
                    <button
                        onClick={handleCreate}
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/30 flex items-center gap-2 transition-all transform hover:scale-105 font-medium"
                    >
                        <FaPlus className="text-sm" /> Add Entry
                    </button>
                </div>

                {/* Search & Year Filter */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by name, position, or year..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all"
                        />
                    </div>
                    <select
                        value={yearFilter}
                        onChange={(e) => setYearFilter(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-gray-700 min-w-[160px]"
                    >
                        <option value="all">All Years</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>

                {/* List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                            <FaSpinner className="animate-spin text-3xl mb-3 text-blue-500" />
                            <p>Loading entries...</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider">
                                        <th className="p-6">Member</th>
                                        <th className="p-6">Role & Badge</th>
                                        <th className="p-6">Year</th>
                                        <th className="p-6">Details</th>
                                        <th className="p-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredEntries.length > 0 ? (
                                        filteredEntries.map((entry) => (
                                            <tr key={entry._id} className="hover:bg-blue-50/30 transition-colors group">
                                                {/* Avatar & Name */}
                                                <td className="p-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden border border-gray-100 shadow-sm flex-shrink-0">
                                                            {entry.image ? (
                                                                <img src={entry.image} alt={entry.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <FaTrophy />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900">{entry.name}</div>
                                                            <div className="flex gap-2 text-gray-400 text-xs mt-1">
                                                                {entry.social?.linkedin && <FaLinkedin className="hover:text-blue-700" />}
                                                                {entry.social?.github && <FaGithub className="hover:text-black" />}
                                                                {entry.social?.twitter && <FaTwitter className="hover:text-blue-400" />}
                                                                {entry.social?.instagram && <FaInstagram className="hover:text-pink-600" />}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>

                                                {/* Position & Badge */}
                                                <td className="p-6">
                                                    <div className="text-sm font-semibold text-gray-800">{entry.position}</div>
                                                    {entry.badge && (
                                                        <span
                                                            className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded ${getBadgeStyle(
                                                                entry.color
                                                            )}`}
                                                        >
                                                            {entry.badge}
                                                        </span>
                                                    )}
                                                </td>

                                                {/* Year */}
                                                <td className="p-6">
                                                    <span className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full">
                                                        {entry.year}
                                                    </span>
                                                </td>

                                                {/* Skills */}
                                                <td className="p-6 max-w-xs">
                                                    <div className="text-sm text-gray-600 line-clamp-2" title={entry.bio}>
                                                        {entry.bio}
                                                    </div>
                                                    {entry.skills && entry.skills.length > 0 && (
                                                        <div className="mt-2 text-xs text-gray-400">
                                                            {entry.skills.slice(0, 3).join(", ")}
                                                            {entry.skills.length > 3 && ` +${entry.skills.length - 3}`}
                                                        </div>
                                                    )}
                                                </td>

                                                {/* Actions */}
                                                <td className="p-6">
                                                    <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleEdit(entry)}
                                                            className="p-2.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(entry._id)}
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
                                            <td colSpan="5" className="p-12 text-center text-gray-500">
                                                No entries found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <WallOfFameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleFormSubmit}
                initialData={editingEntry}
                isSubmitting={isSubmitting}
            />

            <style>{`
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

export default AdminWallOfFamePage;
