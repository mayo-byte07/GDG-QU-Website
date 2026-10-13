import React, { useState, useEffect, useRef } from "react";
import {
  FaArrowRight,
  FaCode,
  FaCalendarAlt, // Changed icon to be more "schedule" focused
  FaUsers,
  FaMapMarkerAlt,
  FaTerminal,
} from "react-icons/fa";

const GDGEventsSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef(null);

  // Official Google Brand Colors
  const googleColors = {
    blue: "#4285F4",
    red: "#EA4335",
    yellow: "#FBBC04",
    green: "#34A853",
  };

  useEffect(() => {
    setIsVisible(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      // Set width to container width, not window width, to prevent scrollbar issues
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement.offsetHeight; // Match section height
    };
    window.addEventListener("resize", resize);
    resize();

    const particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 6 + 2, // Slightly smaller particles
      dx: (Math.random() - 0.5) * 0.3, // Slower movement
      dy: (Math.random() - 0.5) * 0.3,
      color: Object.values(googleColors)[Math.floor(Math.random() * 4)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw fainter connecting lines
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(150, 150, 150, ${0.1 - distance / 1200})`; // Much fainter lines
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "30";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    // Changed min-h-screen to py-24 to make it a standard section
    <section className="relative py-24 w-full overflow-hidden bg-white">
      {/* Background Layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-blue-50/20 to-white z-0" />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Decorative Blobs - slightly smaller/fainter so they don't scream "Hero" */}
      <div className="absolute top-10 left-[-50px] w-64 h-64 bg-blue-400/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-10 right-[-50px] w-64 h-64 bg-green-400/10 rounded-full blur-[80px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* LEFT SIDE: Updated to look like a Section, not a Home Page */}
          <div
            className={`space-y-6 transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Section Tag - Smaller and functional */}
            <div className="inline-flex items-center gap-2">
              <span className="w-8 h-[2px] bg-blue-500"></span>
              <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
                Exciting Events
              </span>
            </div>

            {/* Heading - Reduced size (H2) and simplified */}
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              What's Happening <br />
              <span className="text-gray-400">in the Community?</span>
            </h2>

            {/* Description - Informational tone */}
            <p className="text-lg text-gray-600 leading-relaxed max-w-md">
              Don't miss out on our upcoming sessions. Whether you're into AI,
              Web, or Cloud, we have a seat saved for you.
            </p>

            {/* Community/Events Metric - Kept as social proof */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex -space-x-3">
                {[1, 2, 3].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center overflow-hidden"
                  >
                    <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 25}`}
                      alt="avatar"
                    />
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-50 flex items-center justify-center text-[10px] font-bold text-gray-500">
                  +50
                </div>
              </div>
              <div className="text-sm font-medium text-gray-500">
                Active participants this month
              </div>
            </div>

            {/* CTA - Functional "View Calendar" */}
            <div className="pt-2">
              <button className="group inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors">
                <span>View All Events</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: PRESERVED EXACTLY AS REQUESTED */}
          <div
            className={`relative h-[450px] flex items-center justify-center transition-all duration-1000 delay-200 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* Main Glass Card */}
            <div className="relative z-20 w-80 h-96 bg-white/10 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl flex flex-col justify-between p-6 animate-float-slow">
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white text-xl shadow-lg shadow-blue-500/30">
                  <FaTerminal />
                </div>
                <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold border border-green-200">
                  ENROLL NOW!
                </div>
              </div>

              {/* Card Body */}
              {/* Put latest event here */}
              <div className="space-y-2">
                <div className="h-2 w-12 bg-gray-400/20 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Explore new events
                </h3>
                <p className="text-sm text-gray-500">
                  Explore a variety of events like workshops, seminars,
                  hackathons, and bootcamps.
                </p>
              </div>

              {/* Card Footer */}
              <div className="pt-4 border-t border-gray-200/20 flex items-center gap-2 text-sm text-gray-600">
                <FaMapMarkerAlt className="text-red-500" />
                <span>Quantum University, Roorkee</span>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            {/* Red Circle */}
            <div className="absolute top-10 right-10 w-24 h-24 bg-gradient-to-br from-red-400 to-red-600 rounded-full opacity-90 shadow-xl blur-sm animate-float-delayed z-10 flex items-center justify-center text-white/20 text-4xl">
              <FaCode />
            </div>

            {/* Yellow Square */}
            <div className="absolute bottom-20 left-0 w-20 h-20 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-2xl transform -rotate-12 shadow-lg z-30 flex items-center justify-center animate-float-reverse">
              <FaUsers className="text-white text-2xl" />
            </div>

            {/* Green Badge */}
            <div className="absolute top-1/2 -right-8 w-16 h-16 bg-white/80 backdrop-blur-md rounded-xl shadow-lg border border-white/50 z-30 flex items-center justify-center animate-pulse-slow">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            </div>

            {/* Blue Abstract Shape (CSS) */}
            <div className="absolute -bottom-4 right-20 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl z-0" />
          </div>
        </div>
      </div>

      {/* Animation Styles */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        @keyframes float-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }
        @keyframes float-reverse {
          0%,
          100% {
            transform: translateY(0px) rotate(-12deg);
          }
          50% {
            transform: translateY(15px) rotate(-6deg);
          }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 7s ease-in-out infinite 1s;
        }
        .animate-float-reverse {
          animation: float-reverse 5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default GDGEventsSection;
