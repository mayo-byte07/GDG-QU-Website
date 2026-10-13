import { useEffect, useState } from "react";
import {
  FaLinkedin,
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaEnvelope,
  FaCrown,
  FaUserTie,
  FaUserGraduate,
  FaUsers,
  FaShareAlt,
  FaTimes,
  FaCalendarAlt,
  FaStar,
  FaCode,
  FaExternalLinkAlt,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";

import red_frame from "../../assets/frames/square-red.png";
import blue_frame from "../../assets/frames/square-blue.png";
import yellow_frame from "../../assets/frames/square-yellow.png";
import green_frame from "../../assets/frames/square-green.png";

const colors = {
  blue: "#4285f4",
  green: "#34a853",
  yellow: "#f9ab00",
  red: "#ea4335",
};

const categoryStyles = {
  mentors: {
    color: colors.yellow,
    bgColor: "#ffe7a5",
    icon: <FaCrown />,
    label: "Mentor",
    frame: yellow_frame,
  },
  teamLead: {
    color: colors.red,
    bgColor: "#f8d8d8",
    icon: <FaUserTie />,
    label: "Lead",
    frame: red_frame,
  },
  teamHeads: {
    color: colors.blue,
    bgColor: "#c3ecf6",
    icon: <FaUserGraduate />,
    label: "Head",
    frame: blue_frame,
  },
  coreTeam: {
    color: colors.green,
    bgColor: "#ccf6c5",
    icon: <FaUsers />,
    label: "Core",
    frame: green_frame,
  },
  default: {
    color: colors.blue,
    bgColor: "#c3ecf6",
    icon: <FaUsers />,
    label: "Member",
    frame: blue_frame,
  },
};

const socialIcons = {
  linkedin: <FaLinkedin />,
  github: <FaGithub />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  email: <FaEnvelope />,
};

const formatDate = (isoString) => {
  if (!isoString) return "2026";
  const date = new Date(isoString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const getCategory = (position) => {
  const pos = position?.toLowerCase() || "";
  if (pos.includes("mentor")) return "mentors";
  if (pos === "lead" || pos.includes("team lead")) return "teamLead";
  if (pos.includes("head")) return "teamHeads";
  return "coreTeam";
};

const ProfileModal = ({ member, category, onClose }) => {
  if (!member) return null;
  const { color, icon } = categoryStyles[category] || categoryStyles.default;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className="relative bg-white/95 backdrop-blur-2xl w-full max-w-3xl rounded-[2.5rem] shadow-2xl overflow-hidden transform transition-all animate-modalIn max-h-[90vh] flex flex-col">
        {/* Fixed Top Border */}
        <div className="absolute top-0 left-0 right-0 h-2 flex z-50">
          <div className="flex-1 bg-blue-500"></div>
          <div className="flex-1 bg-red-500"></div>
          <div className="flex-1 bg-yellow-500"></div>
          <div className="flex-1 bg-green-500"></div>
        </div>

        {/* Fixed Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all z-50 hover:rotate-90"
        >
          <FaTimes size={20} />
        </button>

        {/* Scrollable Content Wrapper */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col md:flex-row min-h-full">
            {/* Left Side: Identity Card */}
            <div className="md:w-[40%] bg-gray-50/50 p-10 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-gray-100 shrink-0">
              <div className="relative mb-6">
                <div
                  className="absolute -inset-2 rounded-full blur-lg opacity-30 animate-pulse"
                  style={{ backgroundColor: color }}
                ></div>
                <img
                  src={member.image}
                  alt={member.name}
                  className="relative w-44 h-44 object-cover rounded-3xl shadow-2xl border-4 border-white"
                />
              </div>

              <h2 className="text-3xl font-black text-gray-900 leading-tight">
                {member.name}
              </h2>
              <div className="mt-3 flex items-center justify-center space-x-2">
                <span className="text-lg" style={{ color }}>
                  {icon}
                </span>
                <p
                  className="font-bold text-sm tracking-widest uppercase opacity-70"
                  style={{ color }}
                >
                  {member.position}
                </p>
              </div>

              <div className="flex space-x-4 mt-8">
                {Object.entries(member.social).map(
                  ([platform, link]) =>
                    link && (
                      <a
                        key={platform}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-white rounded-2xl shadow-sm text-gray-400 hover:text-gray-900 hover:shadow-md transition-all transform hover:-translate-y-1"
                        title={platform}
                      >
                        {socialIcons[platform]}
                      </a>
                    )
                )}
              </div>
            </div>

            {/* Right Side: Information Content */}
            <div className="md:w-[60%] p-10">
              <div className="space-y-8">
                <section>
                  <div className="flex items-center space-x-2 mb-4">
                    <FaStar style={{ color }} />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                      About Me
                    </h4>
                  </div>
                  <p className="text-gray-600 text-lg leading-relaxed font-medium">
                    {member.fullBio || member.bio}
                  </p>
                </section>

                <section>
                  <div className="flex items-center space-x-2 mb-4">
                    <FaCode style={{ color }} />
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                      Technical Expertise
                    </h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(member.skills || []).map((skill, i) => (
                      <span
                        key={i}
                        className="px-4 py-2 bg-gray-100 rounded-xl text-sm font-bold text-gray-700 border border-gray-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </section>

                <div className="pt-8 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div
                    className="px-5 py-2 rounded-full text-white text-xs font-black uppercase tracking-wider shadow-lg"
                    style={{ backgroundColor: color }}
                  >
                    {member.badge}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TeamMemberCard = ({
  member,
  category,
  index,
  isVisible,
  setActiveMember,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { color, icon, label, frame, bgColor } =
    categoryStyles[category] || categoryStyles.default;

  return (
    <div
      className={`relative group scale-90 transform transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
      }`}
      style={{
        transitionDelay: `${index * 80}ms`,
        willChange: "transform, opacity",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`relative rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-500 ${
          isHovered
            ? "scale-105 shadow-2xl border-opacity-100"
            : "scale-100 border-opacity-0"
        }`}
        style={{
          backgroundColor: bgColor,
          borderColor: color,
        }}
      >
        <div
          className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-semibold z-30 flex items-center space-x-1"
          style={{ backgroundColor: color }}
        >
          {icon}
          <span>{label}</span>
        </div>

        <div className="relative aspect-square overflow-hidden">
          <img
            src={frame}
            alt="frame"
            className="absolute inset-0 w-full h-full object-cover z-10 pointer-events-none"
          />

          <img
            src={member.image}
            alt={member.name}
            className="w-full p-6 h-full object-cover transition-transform duration-500 group-hover:scale-110 relative z-0"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

          <div className="absolute bottom-4 left-4 flex space-x-2 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300 z-20">
            {Object.entries(member.social).map(
              ([platform, link]) =>
                link && (
                  <a
                    key={platform}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                    aria-label={platform}
                  >
                    {socialIcons[platform]}
                  </a>
                )
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="mb-3">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              {member.name}
            </h3>
            <p className="text-sm text-gray-700 flex items-center space-x-1 font-medium">
              <span style={{ color }}>●</span>
              <span>{member.position}</span>
            </p>
          </div>

          <p className="text-gray-800 text-sm leading-relaxed mb-4 line-clamp-3 font-medium">
            {member.bio}
          </p>

          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/60 rounded-full">
            <span className="text-xs font-bold text-gray-800">
              {member.badge}
            </span>
          </div>

          <button
            className="w-full mt-4 py-2 rounded-lg bg-white text-gray-800 font-bold hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group/btn shadow-sm"
            onClick={() => setActiveMember(member)}
          >
            <span>View Profile</span>
            <FaShareAlt className="transform group-hover/btn:translate-x-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </div>
  );
};

const TeamMembersSection = () => {
  const [activeMember, setActiveMember] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [teamData, setTeamData] = useState({
    mentors: [],
    teamLead: [],
    teamHeads: [],
    coreTeam: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        // Fallback URL added to prevent routing to Vite's dev server (5173) if .env is missing
        const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
        const response = await fetch(`${backendUrl}/api/team`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // CRITICAL FIX: Verify the server actually returned JSON to prevent the "Unexpected token '<'" error
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error(
            `Connection failed. The server at ${backendUrl} returned an HTML page instead of JSON. Make sure your backend is running.`
          );
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          const transformedData = {
            mentors: [],
            teamLead: [],
            teamHeads: [],
            coreTeam: [],
          };

          result.data.forEach((member) => {
            const category = getCategory(member.position);

            const frontendMember = {
              id: member._id,
              name: member.name,
              position: member.position,
              bio: member.bio,
              fullBio: member.fullBio,
              image: member.image || "https://via.placeholder.com/300",
              badge: member.badge,
              skills: member.skills,
              social: {
                linkedin: member.linkedinUrl || null,
                github: member.githubUrl || null,
                twitter: member.twitterUrl || null,
                instagram: member.instagramUrl || null,
              },
            };

            if (transformedData[category]) {
              transformedData[category].unshift(frontendMember);
            } else {
              transformedData.coreTeam.unshift(frontendMember);
            }
          });

          setTeamData(transformedData);
        } else {
          throw new Error("Invalid data format received from the database");
        }
      } catch (err) {
        console.error("Failed to fetch team members:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setIsVisible(true);
      }
    };

    fetchTeamMembers();
  }, []);

  const handleOpenModal = (member, category) => {
    setActiveMember(member);
    setActiveCategory(category);
    document.body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    setActiveMember(null);
    setActiveCategory(null);
    document.body.style.overflow = "unset";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
        <p className="text-gray-600 font-medium">Loading our amazing team...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <FaExclamationTriangle className="text-4xl text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Oops! Something went wrong.
        </h2>
        <p className="text-gray-600 max-w-lg mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const renderTeamSection = (category, title, icon, description) => {
    if (!teamData[category] || teamData[category].length === 0) return null;

    return (
      <div className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-full border border-gray-200 shadow-lg mb-4">
            {icon}
            <span className="text-lg font-semibold text-gray-700">{title}</span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
          {teamData[category].map((member, index) => (
            <div
              key={member.id}
              className="w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-2rem)] max-w-[480px]"
            >
              <TeamMemberCard
                member={member}
                category={category}
                index={index}
                isVisible={isVisible}
                setActiveMember={(m) => handleOpenModal(m, category)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white relative min-h-screen">
      {activeMember && (
        <ProfileModal
          member={activeMember}
          category={activeCategory}
          onClose={handleCloseModal}
        />
      )}

      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full border border-blue-200 mb-6">
            <FaUsers className="text-blue-500" />
            <span className="text-lg font-semibold text-blue-600">
              Meet the Team
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Amazing{" "}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Team
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get to know the passionate individuals who make our GDG community
            thrive. From mentors to core members, each bringing unique skills
            and energy.
          </p>
        </div>

        {renderTeamSection(
          "mentors",
          "Mentors",
          <FaCrown className="text-yellow-500" />,
          "Experienced guides who provide direction and mentorship to our community"
        )}

        {renderTeamSection(
          "teamLead",
          "Team Lead",
          <FaUserTie className="text-red-500" />,
          "The visionary leader guiding our community towards excellence and innovation"
        )}

        {renderTeamSection(
          "teamHeads",
          "Team Heads",
          <FaUserGraduate className="text-blue-500" />,
          "Department heads managing various aspects of our community and events"
        )}

        {renderTeamSection(
          "coreTeam",
          "Core Team",
          <FaUsers className="text-green-500" />,
          "The backbone of our community, working tirelessly to make everything happen"
        )}
      </div>

      {/* FIXED: Replaced Next.js <style jsx> with standard React <style> injection */}
      <style>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(40px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-modalIn {
          animation: modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
};

export default TeamMembersSection;