import { useState } from "react";
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
  FaTimes,
  FaStar,
  FaCode,
} from "react-icons/fa";

import teamMembers from "../../data/teamMembers";

const colors = {
  blue: "#4285f4",
  green: "#34a853",
  yellow: "#f9ab00",
  red: "#ea4335",
};

const categoryStyles = {
  mentors: {
    color: colors.yellow,
    icon: <FaCrown />,
  },
  teamLead: {
    color: colors.red,
    icon: <FaUserTie />,
  },
  teamHeads: {
    color: colors.blue,
    icon: <FaUserGraduate />,
  },
  coreTeam: {
    color: colors.green,
    icon: <FaUsers />,
  },
  default: {
    color: colors.blue,
    icon: <FaUsers />,
  },
};

const socialIcons = {
  linkedin: <FaLinkedin />,
  github: <FaGithub />,
  twitter: <FaTwitter />,
  instagram: <FaInstagram />,
  email: <FaEnvelope />,
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

const TeamMemberCard = ({ member, setActiveMember }) => (
  <div className="flex flex-col items-center text-center">
    <img
      src={member.image}
      alt={member.name}
      loading="lazy"
      className="h-40 w-40 rounded-full object-cover shadow-sm sm:h-44 sm:w-44"
    />
    <h3 className="mt-4 text-lg font-semibold text-gray-800">{member.name}</h3>
    <p className="text-sm text-gray-700">{member.position}</p>
    <p className="mt-0.5 text-xs text-gray-600">{member.university}</p>
    <button
      className="mt-2 font-semibold text-blue-600 transition-colors hover:text-blue-800"
      onClick={() => setActiveMember(member)}
    >
      View profile
    </button>
  </div>
);

const organizerMembers = teamMembers.filter(
  (member) => member.badge === "Organizer"
);
const coreTeamMembers = teamMembers.filter(
  (member) => member.badge !== "Organizer"
);

const TeamMembersSection = () => {
  const [activeMember, setActiveMember] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);

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

  const renderTeamSection = (title, icon, description, members, category) => {
    if (members.length === 0) return null;

    return (
      <div className="mb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-full border border-gray-200 shadow-lg mb-4">
            {icon}
            <span className="text-lg font-semibold text-gray-700">{title}</span>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-12">
          {members.map((member) => (
            <div
              key={member.id}
              className="w-full max-w-[220px] sm:w-[calc(50%-1rem)] sm:max-w-none lg:w-[calc(25%-1.5rem)]"
            >
              <TeamMemberCard
                member={member}
                setActiveMember={(m) => handleOpenModal(m, category)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section
      id="team-members"
      className="scroll-mt-24 py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white relative min-h-screen"
    >
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
            Meet the student organizers and core team members building our GDG
            on Campus community.
          </p>
        </div>

        {renderTeamSection(
          "Organizers",
          <FaCrown className="text-yellow-500" />,
          "Leading GDG on Campus at Quantum University.",
          organizerMembers,
          "teamLead"
        )}
        {renderTeamSection(
          "Core Team",
          <FaUsers className="text-green-500" />,
          "The team members who help our campus developer community thrive.",
          coreTeamMembers,
          "coreTeam"
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

      `}</style>
    </section>
  );
};

export default TeamMembersSection;
