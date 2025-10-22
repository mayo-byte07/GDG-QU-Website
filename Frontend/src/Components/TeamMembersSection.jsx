import React, { useState, useEffect } from 'react';
import { 
  FaLinkedin, 
  FaGithub, 
  FaTwitter, 
  FaInstagram,
  FaEnvelope,
  FaGlobe,
  FaCrown,
  FaUserTie,
  FaUserGraduate,
  FaUsers,
  FaStar,
  FaRocket,
  FaHeart,
  FaShareAlt
} from 'react-icons/fa';

const TeamMembersSection = () => {
  const [activeMember, setActiveMember] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  const colors = {
    blue: '#4285f4',
    green: '#34a853',
    yellow: '#f9ab00',
    red: '#ea4335'
  };

  const teamData = {
    mentors: [
      {
        id: 1,
        name: "Ashu Ayush",
        position: "Mentor",
        bio: "Experienced tech mentor with 5+ years in software development and team leadership.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "👑 Senior Mentor"
      },
      {
        id: 2,
        name: "Himanshu Halder",
        position: "Mentor", 
        bio: "AI/ML expert passionate about mentoring students in cutting-edge technologies.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#", 
          twitter: "#",
          email: "#"
        },
        badge: "🚀 Tech Evangelist"
      }
    ],
    teamLead: [
      {
        id: 3,
        name: "Rahul Kumar",
        position: "Team Lead",
        bio: "Leading the GDG community with vision and passion for technology innovation.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "🎯 Visionary Leader"
      }
    ],
    teamHeads: [
      {
        id: 4,
        name: "Abhiranjan Tiwari",
        position: "Management Head",
        bio: "Expert in project management and community organization with excellent leadership skills.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "📊 Management Pro"
      },
      {
        id: 5,
        name: "Ansh Batla",
        position: "Media Head",
        bio: "Creative media strategist with expertise in digital marketing and brand building.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#", 
          email: "#"
        },
        badge: "🎥 Media Maestro"
      },
      {
        id: 6,
        name: "Debjit Das",
        position: "Technical Head",
        bio: "Full-stack developer with deep expertise in modern web technologies and system architecture.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "💻 Tech Wizard"
      }
    ],
    coreTeam: [
      {
        id: 7,
        name: "Astha Singh",
        position: "Core Team Member",
        bio: "Passionate about UI/UX design and creating beautiful user experiences.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "🎨 Design Expert"
      },
      {
        id: 8,
        name: "Mehek Saxena",
        position: "Core Team Member",
        bio: "Backend developer specializing in cloud technologies and scalable systems.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "☁️ Cloud Specialist"
      },
      {
        id: 9,
        name: "Kanisha Kumari",
        position: "Core Team Member",
        bio: "Mobile app developer with expertise in Flutter and React Native.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "📱 App Developer"
      },
      {
        id: 10,
        name: "Kaushik Sarkar",
        position: "Core Team Member",
        bio: "Data scientist passionate about machine learning and artificial intelligence.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "🧠 AI Engineer"
      },
      {
        id: 11,
        name: "Pravash Kumar Shaw",
        position: "Core Team Member",
        bio: "Cyber security expert focused on ethical hacking and system protection.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "🛡️ Security Guru"
      },
      {
        id: 12,
        name: "Rituraj",
        position: "Core Team Member",
        bio: "Frontend developer with expertise in React.js and modern web technologies.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "⚛️ React Expert"
      },
      {
        id: 13,
        name: "Ashis Kumar Jha",
        position: "Core Team Member",
        bio: "DevOps engineer passionate about automation and cloud infrastructure.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "⚙️ DevOps Pro"
      },
      {
        id: 14,
        name: "Debarghya",
        position: "Core Team Member",
        bio: "Blockchain developer exploring decentralized applications and smart contracts.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "⛓️ Blockchain Dev"
      },
      {
        id: 15,
        name: "Harshit Pundir",
        position: "Core Team Member",
        bio: "Full-stack developer with passion for open-source contributions.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "🔧 Full-Stack Dev"
      },
      {
        id: 16,
        name: "Piyush Kumar",
        position: "Core Team Member",
        bio: "UI/UX designer focused on creating intuitive and beautiful interfaces.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "✨ UI/UX Designer"
      },
      {
        id: 17,
        name: "Priyanshu Srivastava",
        position: "Core Team Member",
        bio: "Game developer passionate about interactive experiences and 3D graphics.",
        image: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        social: {
          linkedin: "#",
          github: "#",
          twitter: "#",
          email: "#"
        },
        badge: "🎮 Game Developer"
      }
    ]
  };

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const TeamMemberCard = ({ member, category, index }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getCategoryColor = () => {
      switch(category) {
        case 'mentors': return colors.yellow;
        case 'teamLead': return colors.red;
        case 'teamHeads': return colors.blue;
        case 'coreTeam': return colors.green;
        default: return colors.blue;
      }
    };

    const getCategoryIcon = () => {
      switch(category) {
        case 'mentors': return <FaCrown />;
        case 'teamLead': return <FaUserTie />;
        case 'teamHeads': return <FaUserGraduate />;
        case 'coreTeam': return <FaUsers />;
        default: return <FaUsers />;
      }
    };

    return (
      <div 
        className={`relative group transform transition-all duration-500 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}
        style={{ animationDelay: `${index * 100}ms` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Card */}
        <div className={`relative bg-white rounded-2xl shadow-lg border-2 overflow-hidden transition-all duration-500 ${
          isHovered ? 'scale-105 shadow-2xl border-opacity-100' : 'scale-100 border-opacity-0'
        }`} style={{ borderColor: getCategoryColor() }}>
          
          {/* Category Ribbon */}
          <div 
            className="absolute top-4 right-4 px-3 py-1 rounded-full text-white text-xs font-semibold z-10 flex items-center space-x-1"
            style={{ backgroundColor: getCategoryColor() }}
          >
            {getCategoryIcon()}
            <span>{category === 'teamLead' ? 'Lead' : category === 'teamHeads' ? 'Head' : category === 'mentors' ? 'Mentor' : 'Core'}</span>
          </div>

          {/* Member Image */}
          <div className="relative h-48 overflow-hidden">
            <img 
              src={member.image} 
              alt={member.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Social Links - Appear on Hover */}
            <div className="absolute bottom-4 left-4 flex space-x-2 transform translate-y-10 group-hover:translate-y-0 transition-transform duration-300">
              {Object.entries(member.social).map(([platform, link]) => (
                <a
                  key={platform}
                  href={link}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
                >
                  {platform === 'linkedin' && <FaLinkedin />}
                  {platform === 'github' && <FaGithub />}
                  {platform === 'twitter' && <FaTwitter />}
                  {platform === 'instagram' && <FaInstagram />}
                  {platform === 'email' && <FaEnvelope />}
                </a>
              ))}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            {/* Name and Position */}
            <div className="mb-3">
              <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
              <p className="text-sm text-gray-600 flex items-center space-x-1">
                <span style={{ color: getCategoryColor() }}>●</span>
                <span>{member.position}</span>
              </p>
            </div>

            {/* Bio */}
            <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
              {member.bio}
            </p>

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-gray-100 rounded-full">
              <span className="text-xs font-medium text-gray-700">{member.badge}</span>
            </div>

            {/* Interactive Button */}
            <button 
              className="w-full mt-4 py-2 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 group/btn"
              onClick={() => setActiveMember(activeMember === member.id ? null : member.id)}
            >
              <span>View Profile</span>
              <FaShareAlt className="transform group-hover/btn:translate-x-1 transition-transform duration-300" />
            </button>
          </div>

          {/* Hover Effect Border */}
          <div 
            className="absolute inset-0 border-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ borderColor: getCategoryColor() }}
          ></div>
        </div>

        {/* Floating Elements */}
        {isHovered && (
          <>
            <div 
              className="absolute -top-2 -left-2 w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: getCategoryColor(), animation: 'float 3s ease-in-out infinite' }}
            ></div>
            <div 
              className="absolute -bottom-2 -right-2 w-3 h-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ backgroundColor: getCategoryColor(), animation: 'float 3s ease-in-out infinite 1.5s' }}
            ></div>
          </>
        )}
      </div>
    );
  };

  const renderTeamSection = (category, title, icon, description) => (
    <div className="mb-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-3 bg-white px-6 py-3 rounded-full border border-gray-200 shadow-lg mb-4">
          {icon}
          <span className="text-lg font-semibold text-gray-700">{title}</span>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {teamData[category].map((member, index) => (
          <TeamMemberCard 
            key={member.id}
            member={member}
            category={category}
            index={index}
          />
        ))}
      </div>
    </div>
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full border border-blue-200 mb-6">
            <FaUsers className="text-blue-500" />
            <span className="text-lg font-semibold text-blue-600">Meet the Team</span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Our Amazing <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Team</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get to know the passionate individuals who make our GDG community thrive. 
            From mentors to core members, each bringing unique skills and energy.
          </p>
        </div>

        {/* Team Hierarchy */}
        {renderTeamSection(
          'mentors',
          'Mentors',
          <FaCrown className="text-yellow-500" />,
          'Experienced guides who provide direction and mentorship to our community'
        )}

        {renderTeamSection(
          'teamLead', 
          'Team Lead',
          <FaUserTie className="text-red-500" />,
          'The visionary leader guiding our community towards excellence and innovation'
        )}

        {renderTeamSection(
          'teamHeads',
          'Team Heads', 
          <FaUserGraduate className="text-blue-500" />,
          'Department heads managing various aspects of our community and events'
        )}

        {renderTeamSection(
          'coreTeam',
          'Core Team',
          <FaUsers className="text-green-500" />,
          'The backbone of our community, working tirelessly to make everything happen'
        )}

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">Want to Join Our Team?</h3>
              <p className="text-lg mb-6 opacity-90">We're always looking for passionate developers and designers</p>
              <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
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