import React, { useState, useEffect, useRef } from 'react';
import { 
  FaCalendarAlt, 
  FaRocket, 
  FaUsers, 
  FaMicrophone, 
  FaCode,
  FaLaptop,
  FaBrain,
  FaCloud,
  FaArrowRight,
  FaPlay,
  FaRegClock,
  FaMapMarkerAlt
} from 'react-icons/fa';

const WelcomeEvents = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(0);
  const canvasRef = useRef(null);

  const colors = {
    blue: '#4285f4',
    green: '#34a853',
    yellow: '#f9ab00',
    red: '#ea4335'
  };

  const eventTypes = [
    {
      icon: <FaCode />,
      title: "Workshops",
      count: "25+",
      color: colors.blue,
      description: "Hands-on coding sessions"
    },
    {
      icon: <FaMicrophone />,
      title: "Tech Talks",
      count: "15+",
      color: colors.green,
      description: "Expert speaker sessions"
    },
    {
      icon: <FaLaptop />,
      title: "Hackathons",
      count: "8+",
      color: colors.yellow,
      description: "24-hour coding challenges"
    },
    {
      icon: <FaUsers />,
      title: "Networking",
      count: "12+",
      color: colors.red,
      description: "Community meetups"
    }
  ];

  // Animated background
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

    const particles = [];
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 2,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: Object.values(colors)[Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.3 + 0.2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        );
        gradient.addColorStop(0, `${particle.color}${Math.round(particle.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${particle.color}00`);
        
        ctx.fillStyle = gradient;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50 relative overflow-hidden">
      
      {/* Animated Background */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Side - Content */}
        <div className={`space-y-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}>
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 shadow-lg">
            <FaCalendarAlt className="text-blue-500" />
            <span className="text-sm font-semibold text-blue-600">Upcoming Events</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Amazing Events{' '}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Await You!
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-600 leading-relaxed">
            Join our vibrant community events featuring workshops, hackathons, tech talks, 
            and networking sessions. Learn from experts, build projects, and grow with us.
          </p>

          {/* Event Stats */}
          <div className="grid grid-cols-2 gap-4">
            {eventTypes.map((event, index) => (
              <div key={event.title} className="flex items-center space-x-3 p-4 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: event.color }}
                >
                  {event.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{event.count}</div>
                  <div className="text-sm text-gray-600">{event.title}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg">
              <FaRocket />
              <span>View All Events</span>
              <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-full font-semibold border-2 border-gray-200 hover:border-blue-500 hover:text-blue-500 transition-all duration-300">
              <FaPlay />
              <span>Watch Highlights</span>
            </button>
          </div>
        </div>

        {/* Right Side - Animated Illustration */}
        <div className={`relative h-96 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}>
          
          {/* Main Event Sphere */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              
              {/* Central Calendar */}
              <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-2xl relative overflow-hidden">
                <div className="text-white text-center">
                  <div className="text-4xl font-bold">24</div>
                  <div className="text-sm">OCT</div>
                </div>
                
                {/* Floating Event Elements */}
                <div className="absolute -top-4 -left-4 w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float">
                  <FaCode className="text-xl" />
                </div>
                
                <div className="absolute -top-4 -right-4 w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float" style={{animationDelay: '1s'}}>
                  <FaMicrophone className="text-lg" />
                </div>
                
                <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float" style={{animationDelay: '2s'}}>
                  <FaLaptop className="text-lg" />
                </div>
                
                <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg animate-float" style={{animationDelay: '3s'}}>
                  <FaUsers className="text-xl" />
                </div>
              </div>

              {/* Rotating Event Types */}
              {[0, 1, 2, 3].map((i) => {
                const angle = (i * 90) * Math.PI / 180;
                const radius = 180;
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);

                return (
                  <div
                    key={i}
                    className="absolute w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center transform animate-orbite"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                      animationDelay: `${i * 1}s`,
                      animationDuration: '12s'
                    }}
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{ backgroundColor: Object.values(colors)[i] }}
                    >
                      {eventTypes[i].icon}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-15px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        @keyframes orbite {
          0% { transform: translate(0, 0) rotate(0deg) scale(1); }
          25% { transform: translate(10px, -10px) rotate(90deg) scale(1.1); }
          50% { transform: translate(0, -20px) rotate(180deg) scale(1); }
          75% { transform: translate(-10px, -10px) rotate(270deg) scale(1.1); }
          100% { transform: translate(0, 0) rotate(360deg) scale(1); }
        }
        
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        
        .animate-orbite {
          animation: orbite 12s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default WelcomeEvents;