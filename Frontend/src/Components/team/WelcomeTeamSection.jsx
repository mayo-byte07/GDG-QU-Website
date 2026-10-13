import React, { useState, useEffect, useRef } from "react";
import {
  FaHandshake,
  FaCalendarAlt,
  FaGoogle,
  FaTerminal,
  FaReact,
  FaPython,
  FaAndroid,
  FaCode,
  FaMobile,
  FaBrain,
  FaCloud,
  FaLightbulb,
} from "react-icons/fa";
import gdg_logo from "../../assets/logos/gdg_icon.jpg";

const BRAND_COLORS = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

const DOMAINS = [
  {
    icon: <FaCode />,
    name: "Web & PWA",
    color: "text-blue-500",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    icon: <FaMobile />,
    name: "Android/Flutter",
    color: "text-green-500",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    icon: <FaBrain />,
    name: "AI & ML",
    color: "text-yellow-500",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
  },
  {
    icon: <FaCloud />,
    name: "Cloud & DevOps",
    color: "text-red-500",
    bg: "bg-red-50",
    border: "border-red-200",
  },
];

const STATS = [
  { number: "15", label: "Core Members", color: "text-blue-600" },
  { number: "100%", label: "Committed", color: "text-green-600" },
  { number: "24/7", label: "Dedication", color: "text-red-500" },
];

const ORBIT_ITEMS = [
  { icon: <FaReact />, color: "#61DAFB", bg: "rgba(97, 218, 251, 0.1)" },
  { icon: <FaAndroid />, color: "#3DDC84", bg: "rgba(61, 220, 132, 0.1)" },
  { icon: <FaPython />, color: "#3776AB", bg: "rgba(55, 118, 171, 0.1)" },
  { icon: <FaCloud />, color: "#EA4335", bg: "rgba(234, 67, 53, 0.1)" },
];

const QUOTES = [
  {
    q: "Alone we can do so little; together we can do so much.",
    a: "Helen Keller",
    barClass: "bg-blue-500",
    hoverClass: "group-hover:text-blue-500",
  },
  {
    q: "Talent wins games, but teamwork wins championships.",
    a: "Michael Jordan",
    barClass: "bg-green-500",
    hoverClass: "group-hover:text-green-500",
  },
  {
    q: "Great things in business are never done by one person.",
    a: "Steve Jobs",
    barClass: "bg-yellow-500",
    hoverClass: "group-hover:text-yellow-500",
  },
];

const GDGTeamWelcome = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setIsVisible(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const nodes = [];
    const nodeCount = isMobile ? 25 : 55;
    const connectionDistance = isMobile ? 100 : 180;
    const colorValues = Object.values(BRAND_COLORS);

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: (Math.random() - 0.5) * 0.4,
        color: colorValues[Math.floor(Math.random() * colorValues.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node, index) => {
        node.x += node.speedX;
        node.y += node.speedY;

        if (node.x < 0 || node.x > canvas.width) node.speedX *= -1;
        if (node.y < 0 || node.y > canvas.height) node.speedY *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        nodes.forEach((otherNode, otherIndex) => {
          if (index !== otherIndex) {
            const dx = node.x - otherNode.x;
            const dy = node.y - otherNode.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
              ctx.beginPath();
              ctx.strokeStyle = `${node.color}${Math.floor(
                (1 - distance / connectionDistance) * 40
              )
                .toString(16)
                .padStart(2, "0")}`;
              ctx.lineWidth = 0.5;
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
      window.removeEventListener("resize", setCanvasSize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  return (
    <div className="min-h-screen relative overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-700 font-sans">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-400/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-yellow-400/10 rounded-full blur-[80px]"></div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none opacity-60"
      />

      <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div
            className={`space-y-8 transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-default">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-[#4285F4]"></div>
                <div className="w-2 h-2 rounded-full bg-[#EA4335]"></div>
                <div className="w-2 h-2 rounded-full bg-[#FBBC04]"></div>
                <div className="w-2 h-2 rounded-full bg-[#34A853]"></div>
              </div>
              <span className="text-xs font-semibold text-gray-600 tracking-wide uppercase">
                The Core Team
              </span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.15]">
              The Hearts & Minds
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500">
                Behind the Community.
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Meet the <strong>passionate individuals</strong> who work
              tirelessly to keep the GDG spirit alive. From organizing events to
              mentoring students, we are the architects building the bridge
              between campus and industry.
            </p>

            <div className="grid grid-cols-3 gap-4">
              {STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/40 backdrop-blur-sm border border-white/60 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 group"
                >
                  <div
                    className={`text-2xl lg:text-3xl font-bold ${stat.color} group-hover:scale-105 transition-transform origin-left`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wider mt-1">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <button className="group relative px-6 py-3 rounded-xl bg-[#202124] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                <span className="relative z-10 flex items-center gap-2">
                  <FaHandshake /> View All Members
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button className="px-6 py-3 rounded-xl bg-white text-gray-700 font-medium border border-gray-200 shadow-sm hover:border-blue-400 hover:text-blue-600 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm">
                <FaCalendarAlt /> View Events
              </button>
            </div>
          </div>

          <div
            className={`relative transition-all duration-1000 delay-300 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-10"
            }`}
          >
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[3rem] p-8 shadow-2xl h-[500px] flex flex-col justify-between overflow-hidden">
              <div className="flex space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>

              <div className="absolute -top-12 z-30 scale-90 inset-0 flex items-center justify-center pointer-events-none">
                <div className="relative z-10 w-32 h-32 rounded-full bg-white shadow-xl flex items-center justify-center border-4 border-white/50">
                  <img src={gdg_logo} alt="GDG Logo" className="w-20 h-20" />
                  <div className="absolute inset-0 rounded-full animate-ping duration-[5s] opacity-10 bg-blue-400"></div>
                </div>

                <div className="absolute w-[240px] h-[240px] rounded-full border border-dashed border-gray-300 animate-spin-slow flex items-center justify-center">
                  {ORBIT_ITEMS.map((item, i) => (
                    <div
                      key={i}
                      className="absolute w-14 h-14 rounded-2xl bg-white shadow-lg flex items-center justify-center border border-gray-100"
                      style={{
                        transform: `rotate(${
                          i * 90
                        }deg) translate(140px) rotate(-${i * 90}deg)`,
                      }}
                    >
                      <div
                        className="animate-spin-reverse-slow text-2xl"
                        style={{ color: item.color }}
                      >
                        {item.icon}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto relative z-20 bg-white/60 backdrop-blur-md rounded-2xl p-4 border border-white/50">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 text-center">
                  Our Areas of Expertise
                </div>
                <div className="flex justify-between items-center px-2">
                  {DOMAINS.map((d, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center gap-1 ${d.color}`}
                    >
                      <div className="text-xl">{d.icon}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className="absolute top-4 right-4 bg-[#282a36ed] p-4 rounded-xl shadow-2xl z-40 hidden md:block animate-float-gentle border border-gray-700"
                style={{ width: "220px" }}
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-700">
                  <div className="flex items-center gap-2">
                    <FaTerminal className="text-gray-400 text-xs" />
                    <span className="text-xs text-gray-400 font-mono">
                      bash
                    </span>
                  </div>
                  <div className="text-[10px] text-gray-500">team-check</div>
                </div>
                <div className="font-mono text-xs leading-5">
                  <div className="flex">
                    <div className="flex gap-2">
                      <span className="text-pink-400">$</span>
                      <span className="text-white">git log</span>
                    </div>
                    <div className="flex ml-2">
                      <span className="text-green-400">--author="Team"</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <span className="text-blue-300">Commiting...</span>
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-yellow-300">
                      15 Active Contributors
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {QUOTES.map((item, i) => (
              <div
                key={i}
                className="group relative p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden"
              >
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity ${item.barClass}`}
                ></div>
                <FaLightbulb
                  className={`text-gray-200 text-2xl absolute top-6 right-6 transition-colors ${item.hoverClass}`}
                />
                <p className="text-gray-600 italic mb-3 relative z-10 text-sm">
                  "{item.q}"
                </p>
                <p className="text-xs font-bold text-gray-900 uppercase tracking-wide">
                  — {item.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style>{`
        @keyframes float-gentle {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes spin-reverse-slow {
          from {
            transform: rotate(360deg);
          }
          to {
            transform: rotate(0deg);
          }
        }

        .animate-float-gentle {
          animation: float-gentle 4s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse-slow {
          animation: spin-reverse-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default GDGTeamWelcome;
