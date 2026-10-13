import React, { useState, useEffect, useRef } from "react";
import {
  FaGithub,
  FaCodeBranch,
  FaArrowRight,
  FaGitAlt,
  FaTerminal,
  FaCheckCircle,
  FaCode,
} from "react-icons/fa";

const ContributionHero = () => {
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef(null);

  // Google Brand Colors
  const googleColors = {
    blue: "#4285F4",
    red: "#EA4335",
    yellow: "#FBBC04",
    green: "#34A853",
  };

  const contributionBubbles = [
    {
      icon: <FaCodeBranch />,
      color: googleColors.blue,
      label: "New Feature PR",
      delay: "0s",
      position: "top-10 left-10",
    },
    {
      icon: <FaGitAlt />,
      color: googleColors.red,
      label: "Bug Fix Commit",
      delay: "2s",
      position: "bottom-20 right-10",
    },
    {
      icon: <FaCode />,
      color: googleColors.green,
      label: "Docs Update",
      delay: "4s",
      position: "top-1/2 right-[-20px]",
    },
  ];

  useEffect(() => {
    setIsVisible(true);
    // --- Canvas Background Animation (Simplified Node Network) ---
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      // Ensure canvas covers the whole section height
      canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", resize);
    // Initial resize needs a small delay to ensure parent container is rendered
    setTimeout(resize, 100);

    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      color: Object.values(googleColors)[Math.floor(Math.random() * 4)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 150) {
            ctx.beginPath();
            // Make lines very faint blue/gray
            ctx.strokeStyle = `rgba(66, 133, 244, ${0.15 - distance / 1000})`;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        // Bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "50"; // 50% opacity
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
    <section className="relative py-12 w-full overflow-hidden bg-gray-50 min-h-[700px] flex items-center">
      {/* --- Background Layers --- */}
      {/* Subtle gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white z-0" />
      {/* Animated Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full z-0 opacity-70 pointer-events-none"
      />

      {/* Decorative Ambient Blobs (The "Glow") */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-10 w-[400px] h-[400px] bg-green-400/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full h-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center h-full">
          {/* --- LEFT SIDE: Content --- */}
          <div
            className={`space-y-8 transition-all duration-1000 ease-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-blue-100 shadow-sm">
              <FaGithub className="text-xl text-gray-700" />
              <span className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Fully Open Source
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900">
              Built by the Community, <br />
              <span className="bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500 bg-clip-text text-transparent">
                Belongs to Everyone.
              </span>
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
              This website isn't just for show, it's a living project living on
              GitHub. Whether it's fixing a typo, optimizing a component, or
              building a new feature, your contributions shape this platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center gap-3 bg-[#24292e] text-white px-8 py-4 rounded-2xl font-bold text-lg overflow-hidden shadow-xl transition-all hover:scale-105 hover:shadow-2xl"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <FaGithub className="text-2xl" /> View Repository
                </span>
                {/* Subtle gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
            </div>
          </div>

          {/* --- RIGHT SIDE: Visual Centerpiece --- */}
          <div
            className={`relative h-[500px] flex items-center justify-center transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            {/* The Central "Main Branch" Glass Hub */}
            <div className="relative z-20 w-80 h-80 bg-white/20 backdrop-blur-2xl border-[1.5px] border-white/50 rounded-full shadow-[0_20px_50px_rgba(8,_112,_184,_0.2)] flex items-center justify-center animate-pulse-slow-subtle">
              {/* Inner glow */}
              <div className="absolute inset-4 bg-gradient-to-tr from-blue-500/5 to-green-500/5 rounded-full blur-md"></div>

              {/* Central Icon */}
              <div className="flex flex-col items-center justify-center">
                <div className="w-24 h-24 bg-gradient-to-tr from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white text-5xl shadow-lg shadow-blue-500/30 mb-4">
                  <FaCodeBranch className="transform rotate-90" />
                </div>
                <div className="text-gray-800 font-bold text-xl">
                  main branch
                </div>
                <div className="text-green-600 text-sm font-medium flex items-center gap-1 mt-1">
                  <FaCheckCircle /> Up to date
                </div>
              </div>
            </div>

            {/* Floating "Contribution Bubbles" orbiting the center */}
            {contributionBubbles.map((bubble, index) => (
              <div
                key={index}
                className={`absolute ${bubble.position} z-30 animate-float-orbit`}
                style={{ animationDelay: bubble.delay }}
              >
                <div className="flex items-center gap-3 bg-white/80 backdrop-blur-xl border border-white/60 pl-3 pr-5 py-3 rounded-2xl shadow-xl">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-lg shadow-md"
                    style={{ backgroundColor: bubble.color }}
                  >
                    {bubble.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 font-medium uppercase">
                      Pull Request
                    </div>
                    <div className="text-sm font-bold text-gray-800">
                      {bubble.label}
                    </div>
                  </div>
                </div>
                {/* Connecting line visualization */}
                <div
                  className="absolute top-1/2 left-1/2 w-32 h-[2px] bg-gradient-to-r from-transparent via-gray-300/50 to-transparent transform -translate-x-1/2 -translate-y-1/2 -z-10 opacity-0 animate-fade-in-out"
                  style={{ animationDelay: bubble.delay }}
                ></div>
              </div>
            ))}

            {/* Floating Terminal Window (Glassmorphism) */}
            <div className="absolute bottom-[-40px] left-[-60px] w-72 z-40 animate-float-gentle-delayed hidden md:block">
              <div className="bg-[#1e1e1ebf] backdrop-blur-xl rounded-xl border border-gray-700/50 shadow-2xl overflow-hidden">
                {/* Terminal Header */}
                <div className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border-b border-gray-700/50">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                </div>
                {/* Terminal Content */}
                <div className="p-4 font-mono text-xs text-gray-300 space-y-2">
                  <div className="flex gap-2">
                    <span className="text-blue-400">➜</span>
                    <span className="text-green-400">~/gdg-site</span>
                    <span className="text-gray-400">
                      git merge feat/new-section
                    </span>
                  </div>
                  <div>Updating b4d1c3e..a1b2c3d</div>
                  <div className="text-green-400">Fast-forward</div>
                  <div className="flex items-center gap-2 text-green-300 pt-1">
                    <FaTerminal /> Merged successfully!
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes float-orbit {
          0%,
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(10px, -15px) rotate(2deg);
          }
          50% {
            transform: translate(-5px, 5px) rotate(-1deg);
          }
          75% {
            transform: translate(-15px, -5px) rotate(1deg);
          }
        }
        @keyframes float-gentle-delayed {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-12px);
          }
        }
        @keyframes pulse-slow-subtle {
          0%,
          100% {
            transform: scale(1);
            box-shadow: 0 20px 50px rgba(8, 112, 184, 0.2);
          }
          50% {
            transform: scale(1.03);
            box-shadow: 0 30px 60px rgba(8, 112, 184, 0.3);
          }
        }
        @keyframes fade-in-out {
          0%,
          100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .animate-float-orbit {
          animation: float-orbit 8s ease-in-out infinite;
        }
        .animate-float-gentle-delayed {
          animation: float-gentle-delayed 6s ease-in-out infinite 2s;
        }
        .animate-pulse-slow-subtle {
          animation: pulse-slow-subtle 5s ease-in-out infinite;
        }
        .animate-fade-in-out {
          animation: fade-in-out 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default ContributionHero;
