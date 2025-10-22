import React, { useState, useEffect, useRef } from 'react';
import { 
  FaRocket, 
  FaCode, 
  FaGithub, 
  FaGlobe, 
  FaUsers,
  FaStar,
  FaHeart,
  FaArrowRight,
  FaFire,
  FaBolt,
  FaMagic
} from 'react-icons/fa';

const WelcomeProjects = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [launchRocket, setLaunchRocket] = useState(false);
  const canvasRef = useRef(null);

  const colors = {
    blue: '#4285f4',
    green: '#34a853',
    yellow: '#f9ab00',
    red: '#ea4335'
  };

  // Rocket launch animation
  useEffect(() => {
    setIsVisible(true);
    
    // Auto launch rocket after 2 seconds
    const timer = setTimeout(() => {
      setLaunchRocket(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Starfield animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const stars = [];
    const starCount = 100;

    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create stars
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.8 + 0.2,
        twinkle: Math.random() * Math.PI * 2
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.twinkle += 0.05;
        const twinkleOpacity = star.opacity + Math.sin(star.twinkle) * 0.3;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${twinkleOpacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener('resize', setCanvasSize);
  }, []);

  const projectStats = [
    { icon: <FaCode />, number: '50+', label: 'Projects Built', color: colors.blue },
    { icon: <FaGithub />, number: '25k+', label: 'Lines of Code', color: colors.green },
    { icon: <FaUsers />, number: '100+', label: 'Student Developers', color: colors.yellow },
    { icon: <FaStar />, number: '4.8★', label: 'Average Rating', color: colors.red }
  ];

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 relative overflow-hidden">
      
      {/* Animated Starfield */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-60"
      />

      {/* Shooting Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-shooting-star"
            style={{
              top: `${20 + i * 15}%`,
              left: `${-10 + i * 5}%`,
              animationDelay: `${i * 3}s`,
              animationDuration: `${3 + i}s`
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Side - Content */}
        <div className={`space-y-8 transform transition-all duration-1000 ${
          isVisible ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
        }`}>
          
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-500/30">
            <FaRocket className="text-blue-400 animate-pulse" />
            <span className="text-sm font-semibold text-blue-300">Student Projects Gallery</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
            Where{' '}
            <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Ideas
            </span>{' '}
            Become{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-red-400 bg-clip-text text-transparent">
              Reality
            </span>
          </h1>

          {/* Description */}
          <p className="text-xl text-gray-300 leading-relaxed">
            Explore incredible projects built by our talented student developers. 
            From innovative web apps to cutting-edge AI solutions - witness the future of technology.
          </p>

          {/* Project Stats */}
          <div className="grid grid-cols-2 gap-4">
            {projectStats.map((stat, index) => (
              <div key={stat.label} className="flex items-center space-x-3 p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-lg"
                  style={{ backgroundColor: stat.color }}
                >
                  {stat.icon}
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-lg glow-blue">
              <FaCode />
              <span>View All Projects</span>
              <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
            </button>

            <button className="flex items-center justify-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-full font-semibold border border-white/20 hover:bg-white/20 transition-all duration-300">
              <FaGithub />
              <span>Contribute</span>
            </button>
          </div>
        </div>

        {/* Right Side - Rocket Animation */}
        <div className={`relative h-96 transform transition-all duration-1000 delay-300 ${
          isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
        }`}>
          
          {/* Launch Platform */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="w-32 h-4 bg-gray-700 rounded-t-lg"></div>
            <div className="w-48 h-6 bg-gray-600 rounded-t-lg"></div>
            <div className="w-64 h-8 bg-gray-500 rounded-t-lg"></div>
          </div>

          {/* Rocket */}
          <div className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 ${
            launchRocket ? '-translate-y-96 opacity-0' : 'translate-y-0 opacity-100'
          }`}>
            <div className="relative">
              {/* Rocket Body */}
              <div className="w-16 h-32 bg-gradient-to-b from-red-500 to-yellow-500 rounded-t-lg relative">
                {/* Rocket Window */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-400 rounded-full border-4 border-white"></div>
                {/* Rocket Fins */}
                <div className="absolute -bottom-4 -left-4 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[32px] border-l-transparent border-r-transparent border-t-red-600"></div>
                <div className="absolute -bottom-4 -right-4 w-0 h-0 border-l-[16px] border-r-[16px] border-t-[32px] border-l-transparent border-r-transparent border-t-red-600"></div>
              </div>
              
              {/* Rocket Flame */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="w-4 h-12 bg-gradient-to-t from-yellow-400 to-red-500 rounded-b-lg animate-pulse"></div>
                <div className="w-6 h-16 bg-gradient-to-t from-orange-400 to-red-600 rounded-b-lg animate-pulse -ml-1"></div>
                <div className="w-4 h-12 bg-gradient-to-t from-yellow-400 to-red-500 rounded-b-lg animate-pulse"></div>
              </div>
            </div>
          </div>

          {/* Launch Effect */}
          {launchRocket && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-t from-yellow-500 to-red-600 rounded-full animate-ping opacity-75"></div>
          )}

          {/* Floating Project Orbs */}
          {[0, 1, 2, 3].map((i) => {
            const angle = (i * 90) * Math.PI / 180;
            const radius = 120;
            const x = radius * Math.cos(angle);
            const y = radius * Math.sin(angle);

            return (
              <div
                key={i}
                className={`absolute w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transform animate-float ${
                  launchRocket ? 'opacity-0' : 'opacity-100'
                } transition-opacity duration-500`}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  backgroundColor: Object.values(colors)[i],
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '4s'
                }}
              >
                {i === 0 && <FaGlobe className="text-2xl" />}
                {i === 1 && <FaCode className="text-2xl" />}
                {i === 2 && <FaBolt className="text-2xl" />}
                {i === 3 && <FaMagic className="text-2xl" />}
              </div>
            );
          })}

          {/* Project Tags Floating */}
          <div className="absolute inset-0 pointer-events-none">
            {['React.js', 'AI/ML', 'Blockchain', 'Mobile', 'Cloud', 'IoT'].map((tag, i) => (
              <div
                key={tag}
                className="absolute px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium animate-float-slow"
                style={{
                  left: `${10 + (i * 15)}%`,
                  top: `${20 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.7}s`,
                  animationDuration: '6s'
                }}
              >
                {tag}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }

        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-30px) scale(1.1); }
        }

        @keyframes shooting-star {
          0% { transform: translateX(0) translateY(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateX(100vw) translateY(100vh) scale(0); opacity: 0; }
        }

        .glow-blue {
          box-shadow: 0 0 20px rgba(66, 133, 244, 0.5);
        }

        .glow-blue:hover {
          box-shadow: 0 0 30px rgba(66, 133, 244, 0.8);
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-shooting-star {
          animation: shooting-star linear infinite;
        }
      `}</style>
    </section>
  );
};

export default WelcomeProjects;