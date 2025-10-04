import React, { useState, useEffect, useRef } from 'react';
import { 
  FaUsers, 
  FaRocket, 
  FaHeart, 
  FaLightbulb, 
  FaCode, 
  FaPalette,
  FaMobile,
  FaCloud,
  FaShieldAlt,
  FaBrain,
  FaLink,
  FaMicrochip,
  FaArrowRight,
  FaStar,
  FaGem,
  FaCrown,
  FaMedal,
  FaTrophy,
  FaUserPlus,
  FaHandshake,
  FaCalendarAlt
} from 'react-icons/fa';

const WelcomeTeamSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef(null);

  const colors = {
    blue: '#4285f4',
    green: '#34a853',
    yellow: '#f9ab00',
    red: '#ea4335'
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Animated background effect - MOBILE OPTIMIZED
  useEffect(() => {
    setIsVisible(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const nodes = [];
    const nodeCount = isMobile ? 6 : 12; // Reduced nodes for mobile

    // Create network nodes
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * (isMobile ? 3 : 6) + (isMobile ? 2 : 4),
        speedX: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
        speedY: (Math.random() - 0.5) * (isMobile ? 0.2 : 0.3),
        color: Object.values(colors)[i % 4],
        opacity: Math.random() * 0.5 + 0.3,
        pulse: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, index) => {
        node.x += node.speedX;
        node.y += node.speedY;
        node.pulse += 0.05;

        // Bounce off walls
        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;

        // Pulsing effect
        const pulseSize = node.size + Math.sin(node.pulse) * (isMobile ? 1 : 2);

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, pulseSize * 2
        );
        gradient.addColorStop(0, `${node.color}${Math.round(node.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${node.color}00`);
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Connect nodes with lines - Reduced distance for mobile
        nodes.forEach((otherNode, otherIndex) => {
          if (index !== otherIndex) {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + 
              Math.pow(node.y - otherNode.y, 2)
            );

            if (distance < (isMobile ? 100 : 150)) {
              ctx.beginPath();
              ctx.strokeStyle = `${node.color}${Math.round((1 - distance/(isMobile ? 100 : 150)) * 20).toString(16)}`;
              ctx.lineWidth = 0.8;
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
            }
          }
        });
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  const teamRoles = [
    { icon: <FaCode />, name: 'Web Dev', color: colors.blue, count: 8 },
    { icon: <FaMobile />, name: 'Mobile Dev', color: colors.green, count: 6 },
    { icon: <FaBrain />, name: 'AI/ML', color: colors.yellow, count: 5 },
    { icon: <FaCloud />, name: 'Cloud', color: colors.red, count: 4 },
    { icon: <FaPalette />, name: 'Design', color: colors.blue, count: 3 },
    { icon: <FaShieldAlt />, name: 'Security', color: colors.green, count: 3 }
  ];

  const stats = [
    { number: '25+', label: 'Team Members', icon: <FaUsers />, color: colors.blue },
    { number: '50+', label: 'Projects', icon: <FaRocket />, color: colors.green },
    { number: '1000+', label: 'Community', icon: <FaHeart />, color: colors.yellow },
    { number: '2+', label: 'Years', icon: <FaMedal />, color: colors.red }
  ];

  // Mobile-optimized illustration
  const MobileIllustration = () => (
    <div className="relative h-64 w-full flex items-center justify-center mb-8">
      {/* Central Team Sphere */}
      <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
        <FaUsers className="text-white text-2xl" />
      </div>

      {/* Floating Elements - Simplified for mobile */}
      {[0, 1, 2, 3].map((i) => {
        const angle = (i * 90) * Math.PI / 180;
        const radius = 80;
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);

        return (
          <div
            key={i}
            className="absolute w-8 h-8 rounded-full bg-white border-2 shadow flex items-center justify-center"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              borderColor: Object.values(colors)[i % 4],
              animation: `float 4s ease-in-out infinite ${i * 0.5}s`
            }}
          >
            <div 
              className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
              style={{ backgroundColor: Object.values(colors)[i % 4] }}
            >
              {i + 1}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Desktop Illustration
  const DesktopIllustration = () => (
    <div className="relative h-96">
      {/* Central Team Sphere */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="relative w-48 h-48 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-2xl">
            <FaUsers className="text-white text-4xl" />
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float">
              <FaRocket className="text-xl" />
            </div>
            
            <div className="absolute -top-4 -right-4 w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float" style={{animationDelay: '1s'}}>
              <FaLightbulb className="text-lg" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float" style={{animationDelay: '2s'}}>
              <FaCode className="text-lg" />
            </div>
            
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float" style={{animationDelay: '3s'}}>
              <FaHeart className="text-xl" />
            </div>
          </div>

          {/* Orbiting Team Members */}
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const angle = (i * 60) * Math.PI / 180;
            const radius = 160;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <div
                key={i}
                className="absolute w-12 h-12 rounded-full bg-white border-4 shadow-lg flex items-center justify-center animate-orbite"
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  borderColor: Object.values(colors)[i % 4],
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '8s'
                }}
              >
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: Object.values(colors)[i % 4] }}
                >
                  {i + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 pt-16 lg:pt-20">
      
      {/* Animated Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-64 lg:h-96 opacity-40"
      />

      {/* Welcome Team Section */}
      <section className="relative py-12 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Main Grid - MOBILE FIXED */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            
            {/* Left Side - Animated Illustration */}
            <div className={`transform transition-all duration-1000 order-2 lg:order-1 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              {isMobile ? <MobileIllustration /> : <DesktopIllustration />}
            </div>

            {/* Right Side - Content - MOBILE FIXED */}
            <div className={`space-y-6 lg:space-y-8 transform transition-all duration-1000 delay-300 order-1 lg:order-2 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              
              {/* Header */}
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 mb-12">
                  <FaUsers className="text-blue-500 text-sm lg:text-base" />
                  <span className="text-sm font-semibold text-blue-600">Meet Our Team</span>
                </div>
                
                <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight">
                  Welcome to Our{' '} <br />
                  <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                    Dream Team
                  </span>
                </h1>

                <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                  A passionate group of developers, designers, and innovators working together 
                  to create amazing experiences with Google technologies.
                </p>
              </div>

              {/* Team Stats - MOBILE FIXED */}
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                {stats.map((stat, index) => (
                  <div key={stat.label} className="flex items-center space-x-2 lg:space-x-3 p-3 lg:p-4 bg-white rounded-xl shadow-lg">
                    <div 
                      className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl flex items-center justify-center text-white text-sm lg:text-base"
                      style={{ backgroundColor: stat.color }}
                    >
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-lg lg:text-xl font-bold text-gray-900">{stat.number}</div>
                      <div className="text-xs lg:text-sm text-gray-600">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Team Roles - MOBILE FIXED */}
              <div className="space-y-3 lg:space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <FaGem className="text-purple-500 text-sm lg:text-base" />
                  <span>Team Specializations</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 lg:gap-3">
                  {teamRoles.map((role, index) => (
                    <div key={role.name} className="flex items-center space-x-2 p-2 lg:p-3 bg-white/50 rounded-lg border border-gray-200">
                      <div 
                        className="w-6 h-6 lg:w-8 lg:h-8 rounded lg:rounded-lg flex items-center justify-center text-white text-xs lg:text-sm"
                        style={{ backgroundColor: role.color }}
                      >
                        {role.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs lg:text-sm font-medium text-gray-900 truncate">{role.name}</div>
                        <div className="text-xs text-gray-600">{role.count} members</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Buttons - MOBILE FIXED */}
              <div className="flex flex-col gap-3 lg:gap-4 pt-4">
                <button className="flex items-center justify-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg lg:rounded-xl font-semibold hover:scale-105 transition-transform duration-300 shadow-lg text-sm lg:text-base">
                  <FaUserPlus className="text-sm lg:text-base" />
                  <span>Join Our Team</span>
                  <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300 text-sm lg:text-base" />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center space-x-2 px-3 lg:px-4 py-2 lg:py-3 bg-white text-gray-700 rounded-lg lg:rounded-xl font-semibold border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-all duration-300 text-xs lg:text-sm">
                    <FaHandshake className="text-xs lg:text-sm" />
                    <span>Meet Team</span>
                  </button>

                  <button className="flex items-center justify-center space-x-2 px-3 lg:px-4 py-2 lg:py-3 bg-white text-gray-700 rounded-lg lg:rounded-xl font-semibold border-2 border-gray-200 hover:border-green-500 hover:text-green-500 transition-all duration-300 text-xs lg:text-sm">
                    <FaCalendarAlt className="text-xs lg:text-sm" />
                    <span>Events</span>
                  </button>
                </div>
              </div>

              {/* Quick Info - MOBILE FIXED */}
              <div className="flex flex-wrap gap-3 lg:gap-4 text-xs lg:text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <FaCrown className="text-yellow-500 text-xs lg:text-sm" />
                  <span>Expert Leads</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaTrophy className="text-blue-500 text-xs lg:text-sm" />
                  <span>Award Winning</span>
                </div>
                <div className="flex items-center space-x-1">
                  <FaStar className="text-green-500 text-xs lg:text-sm" />
                  <span>5★ Mentors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Quotes - MOBILE FIXED */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mt-12 lg:mt-16">
            {[
              {
                text: "Alone we can do so little; together we can do so much.",
                author: "Helen Keller",
                color: colors.blue
              },
              {
                text: "Talent wins games, but teamwork wins championships.",
                author: "Michael Jordan", 
                color: colors.green
              },
              {
                text: "Great things are never done by one person. They're done by a team.",
                author: "Steve Jobs",
                color: colors.yellow
              }
            ].map((quote, index) => (
              <div 
                key={index}
                className="relative p-4 lg:p-6 bg-white rounded-xl lg:rounded-2xl shadow-lg border-l-4 transform hover:scale-105 transition-all duration-300"
                style={{ borderLeftColor: quote.color }}
              >
                <div className="text-sm lg:text-base text-gray-700 italic mb-2 lg:mb-3">"{quote.text}"</div>
                <div className="text-xs lg:text-sm font-semibold text-gray-900">- {quote.author}</div>
                <div 
                  className="absolute top-3 lg:top-4 right-3 lg:right-4 text-xl lg:text-2xl opacity-10"
                  style={{ color: quote.color }}
                >
                  "
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-8px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        @keyframes orbite {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(5px, -5px) rotate(90deg) scale(1.05); }
          50% { transform: translate(0, -10px) rotate(180deg) scale(1); }
          75% { transform: translate(-5px, -5px) rotate(270deg) scale(1.05); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-orbite {
          animation: orbite 8s linear infinite;
        }

        /* Mobile-specific animations */
        @media (max-width: 768px) {
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-5px) rotate(120deg); }
            66% { transform: translateY(3px) rotate(240deg); }
          }
        }
      `}</style>
    </div>
  );
};

export default WelcomeTeamSection;