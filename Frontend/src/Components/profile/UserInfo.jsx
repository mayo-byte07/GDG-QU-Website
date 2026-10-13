import React, { useState, useEffect } from "react";
import {
  FaUser,
  FaIdCard,
  FaUniversity,
  FaCodeBranch,
  FaEdit,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaSpinner,
  FaSave,
  FaSignOutAlt,
  FaCube,
  FaShapes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const authContext = useAuth();

  // Form State
  const [formData, setFormData] = useState({
    realName: "",
    qid: "",
    course: "",
    branch: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/me`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      ).then((res) => res.json());

      setUser(response.data);
      setFormData({
        realName: response.data.realName || "",
        qid: response.data.qid || "",
        course: response.data.course || "",
        branch: response.data.branch || "",
      });
      setLoading(false);
    };
    fetchUserData();
  }, []);

  const validate = () => {
    const newErrors = {};
    if (
      !formData.realName ||
      formData.realName.length < 2 ||
      formData.realName.length > 50
    ) {
      newErrors.realName = "Name must be between 2 and 50 characters";
    }
    const qidNum = parseInt(formData.qid);
    if (
      !formData.qid ||
      isNaN(qidNum) ||
      qidNum < 20000000 ||
      qidNum > 25999999
    ) {
      newErrors.qid = "QID must be between 20000000 and 25999999";
    }
    if (!formData.course) newErrors.course = "Course is required";
    if (!formData.branch) newErrors.branch = "Branch is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSaving(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/update`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }
      setUser((prev) => ({ ...prev, ...formData, isProfileComplete: true }));
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    authContext.logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3 animate-pulse">
          <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
          <div className="w-48 h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-12 flex items-center justify-center overflow-hidden bg-slate-50">
      {/* --- BACKGROUND EFFECTS --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute top-20 left-10 text-blue-500/10 text-9xl animate-float-slow hidden md:block">
          <FaCube />
        </div>
        <div className="absolute bottom-20 right-10 text-yellow-500/10 text-9xl animate-float-delayed hidden md:block">
          <FaShapes />
        </div>
        <div className="absolute top-[-10%] right-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-[100px] animate-pulse-slow" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-gradient-to-tr from-green-400/20 to-yellow-400/20 rounded-full blur-[100px]" />
      </div>

      <div className="container max-w-4xl px-4 relative z-10 w-full">
        {/* --- MAIN PROFILE CARD --- */}
        <div
          className={`w-full bg-white/80 backdrop-blur-2xl rounded-[2rem] md:rounded-[2.5rem] shadow-2xl border transition-all duration-500 overflow-hidden ${user.isProfileComplete ? "border-white/60 shadow-blue-500/10" : "border-red-200 shadow-red-500/20"}`}
        >
          {/* --- HEADER --- */}
          {!user.isProfileComplete ? (
            // INCOMPLETE HEADER
            <div className="min-h-[11rem] pb-14 md:pb-0 bg-red-50/80 border-b border-red-100 relative overflow-hidden group">
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #ef4444 0, #ef4444 10px, transparent 10px, transparent 20px)",
                }}
              ></div>

              <div className="relative z-10 h-full p-6 md:p-8 flex flex-col md:flex-row md:items-start justify-between gap-6 md:gap-4">
                <div className="flex flex-col md:flex-row gap-4 max-w-xl">
                  <div className="w-12 h-12 rounded-xl bg-red-100 text-red-600 flex items-center justify-center text-2xl shadow-sm shrink-0 animate-bounce-subtle mx-auto md:mx-0">
                    <FaExclamationTriangle />
                  </div>
                  <div className="text-center md:text-left">
                    <h3 className="text-xl font-bold text-red-700">
                      Action Required
                    </h3>
                    <p className="text-red-600/80 text-sm mt-1 leading-relaxed">
                      Your profile is missing key details. Complete it now to
                      get your ID completed.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full md:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-500/30 transition-all flex items-center justify-center gap-2 whitespace-nowrap self-start"
                >
                  Complete Setup <FaEdit />
                </button>
              </div>
            </div>
          ) : (
            // COMPLETE HEADER
            <div className="min-h-[11rem] bg-gradient-to-r from-blue-600 to-indigo-600 relative overflow-hidden">
              <div className="absolute inset-0 bg-pattern opacity-20 mix-blend-overlay"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

              <div className="absolute top-6 right-6 md:right-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] md:text-xs font-bold text-white border border-white/20 shadow-sm">
                  <FaCheckCircle className="text-green-300" /> These details
                  will be shown on your certificates
                </span>
              </div>
            </div>
          )}

          <div className="px-6 md:px-12 pb-8 md:pb-12 relative">
            {/* --- LOGOUT BUTTON (Absolute but safe on mobile) --- */}
            <div className="absolute top-4 right-4 md:right-12 z-20">
              <button
                onClick={handleLogout}
                className="group flex items-center gap-2 px-3 md:px-4 py-2 bg-white rounded-full text-gray-600 font-bold text-xs md:text-sm shadow-md border border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300"
              >
                <span className="hidden md:inline">Sign Out</span>
                <span className="md:hidden">Log Out</span>
                <FaSignOutAlt className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* --- PROFILE PIC & NAME ROW --- */}
            {/* Mobile: Flex Column + Centered. Desktop: Flex Row + Aligned Bottom */}
            <div className="flex flex-col items-center text-center md:flex-row md:items-end md:text-left gap-4 md:gap-6 -mt-16 mb-8 md:mb-10 relative z-10 pt-3">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div
                  className={`w-28 h-28 md:w-36 md:h-36 rounded-[2rem] p-1.5 bg-white shadow-2xl transform md:rotate-3 transition-all duration-300 ${!user.isProfileComplete && "ring-4 ring-red-100"}`}
                >
                  <img
                    src={user.photo}
                    alt="Profile"
                    className="w-full h-full rounded-[1.7rem] object-cover bg-gray-100"
                  />
                </div>
              </div>

              {/* Name & Email */}
              <div className="flex-1 pb-0 md:pb-2">
                <h1 className="text-2xl md:text-4xl font-black text-gray-900 flex flex-col md:flex-row items-center gap-2 md:gap-3 tracking-tight leading-tight">
                  {user.realName || user.name}
                </h1>
                <div className="text-gray-500 font-medium text-sm md:text-lg mt-1 break-all">
                  {user.email}
                </div>
              </div>

              {/* Edit Button (Visible when complete) */}
              {user.isProfileComplete && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="w-full md:w-auto mb-0 md:mb-3 px-5 py-2.5 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-600 text-gray-700 font-bold rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <FaEdit /> <span className="md:hidden">Edit</span>{" "}
                  <span className="hidden md:inline">Edit Profile</span>
                </button>
              )}
            </div>

            {/* --- INFO GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* QID Card */}
              <div className="p-5 md:p-6 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] flex items-center gap-4 md:gap-5 hover:border-blue-200 transition-colors">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl shrink-0 ${user.qid ? "bg-blue-50 text-blue-600" : "bg-red-50 text-red-500"}`}
                >
                  <FaIdCard />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Student QID
                  </div>
                  {user.qid ? (
                    <div className="text-lg md:text-xl font-bold text-gray-900 font-mono tracking-wide truncate">
                      {user.qid}
                    </div>
                  ) : (
                    <div className="text-xs md:text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded inline-flex items-center gap-1">
                      Missing <FaExclamationTriangle className="text-[10px]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Course Details */}
              <div className="p-5 md:p-6 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] flex items-center gap-4 md:gap-5 hover:border-green-200 transition-colors">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl shrink-0 ${user.course ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}
                >
                  <FaUniversity />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Course
                  </div>
                  {user.course ? (
                    <div className="text-lg md:text-xl font-bold text-gray-900 truncate">
                      {user.course}
                    </div>
                  ) : (
                    <div className="text-xs md:text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded inline-flex items-center gap-1">
                      Missing <FaExclamationTriangle className="text-[10px]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Branch Details */}
              <div className="md:col-span-2 p-5 md:p-6 bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] flex items-center gap-4 md:gap-5 hover:border-yellow-200 transition-colors">
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center text-xl md:text-2xl shrink-0 ${user.branch ? "bg-yellow-50 text-yellow-600" : "bg-red-50 text-red-500"}`}
                >
                  <FaCodeBranch />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                    Branch/Specialization
                  </div>
                  {user.branch ? (
                    <div className="text-lg md:text-xl font-bold text-gray-900 truncate">
                      {user.branch}
                    </div>
                  ) : (
                    <div className="text-xs md:text-sm font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded inline-flex items-center gap-1">
                      Missing <FaExclamationTriangle className="text-[10px]" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- EDIT MODAL (Responsive) --- */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"
            onClick={() => !isSaving && setIsEditing(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
            <div className="px-6 md:px-8 py-5 md:py-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
              <h2 className="text-lg md:text-xl font-bold text-gray-900">
                {user.isProfileComplete ? "Update Profile" : "Complete Profile"}
              </h2>
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <div className="overflow-y-auto p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    Full Real Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.realName}
                      onChange={(e) =>
                        setFormData({ ...formData, realName: e.target.value })
                      }
                      className={`w-full px-5 py-3.5 rounded-2xl border bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none ${errors.realName ? "border-red-300" : "border-gray-200"}`}
                      placeholder="e.g. John Doe"
                    />
                    <FaUser className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.realName && (
                    <p className="text-xs text-red-500 font-bold ml-1">
                      {errors.realName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">
                    University QID
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={formData.qid}
                      onChange={(e) =>
                        setFormData({ ...formData, qid: e.target.value })
                      }
                      className={`w-full px-5 py-3.5 rounded-2xl border bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none ${errors.qid ? "border-red-300" : "border-gray-200"}`}
                      placeholder="e.g. 24030389"
                    />
                    <FaIdCard className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                  {errors.qid && (
                    <p className="text-xs text-red-500 font-bold ml-1">
                      {errors.qid}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      Course
                    </label>
                    <input
                      type="text"
                      value={formData.course}
                      onChange={(e) =>
                        setFormData({ ...formData, course: e.target.value })
                      }
                      className={`w-full px-5 py-3.5 rounded-2xl border bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none ${errors.course ? "border-red-300" : "border-gray-200"}`}
                      placeholder="B.Tech"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">
                      Branch
                    </label>
                    <input
                      type="text"
                      value={formData.branch}
                      onChange={(e) =>
                        setFormData({ ...formData, branch: e.target.value })
                      }
                      className={`w-full px-5 py-3.5 rounded-2xl border bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none ${errors.branch ? "border-red-300" : "border-gray-200"}`}
                      placeholder="CSE"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full py-4 rounded-2xl bg-gray-900 hover:bg-black text-white font-bold text-lg shadow-xl shadow-gray-500/20 hover:shadow-gray-500/40 hover:scale-[1.01] transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <FaSpinner className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <FaSave /> Save Profile
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0) rotate(0);
          }
          50% {
            transform: translateY(-15px) rotate(-10deg);
          }
        }
        @keyframes scale-up {
          0% {
            transform: scale(0.95) translateY(10px);
            opacity: 0;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }
        @keyframes bounce-subtle {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite 2s;
        }
        .animate-scale-up {
          animation: scale-up 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 3s infinite;
        }
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite;
        }

        .bg-pattern {
          background-image: radial-gradient(
            circle,
            #ffffff 1px,
            transparent 1px
          );
          background-size: 10px 10px;
        }
      `}</style>
    </section>
  );
};

export default ProfileSection;
