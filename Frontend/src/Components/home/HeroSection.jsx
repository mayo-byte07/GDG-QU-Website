import { useState, useEffect, useRef } from "react";
import {
  FaRocket,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaYoutube,
  FaArrowRight,
  FaCode,
  FaUsers,
  FaBrain,
  FaCloud,
  FaMobile,
  FaServer,
  FaRobot,
  FaStar,
  FaInstagram,
} from "react-icons/fa";
import gdg_icon from "../../assets/logos/gdg_icon.jpg";
import { homeStats as stats, colors } from "../../data/homeData";

const AnimatedIllustration = () => {
  const [isVisible, setIsVisible] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);

    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");

      const setCanvasSize = () => {
        const parent = canvas.parentElement;
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      };

      setCanvasSize();
      window.addEventListener("resize", setCanvasSize);

      const particles = [];
      const particleCount = 35;

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 4 + 2,
          speedX: (Math.random() - 0.5) * 1,
          speedY: (Math.random() - 0.5) * 1,
          color: Object.values(colors)[Math.floor(Math.random() * 4)],
          opacity: Math.random() * 0.6 + 0.4,
        });
      }

      const animate = () => {
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach((particle) => {
          particle.x += particle.speedX;
          particle.y += particle.speedY;

          if (particle.x < 0 || particle.x > canvas.width)
            particle.speedX *= -1;
          if (particle.y < 0 || particle.y > canvas.height)
            particle.speedY *= -1;

          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

          const gradient = ctx.createRadialGradient(
            particle.x,
            particle.y,
            0,
            particle.x,
            particle.y,
            particle.size
          );
          gradient.addColorStop(
            0,
            `${particle.color}${Math.round(particle.opacity * 255)
              .toString(16)
              .padStart(2, "0")}`
          );
          gradient.addColorStop(1, `${particle.color}00`);

          ctx.fillStyle = gradient;
          ctx.fill();

          ctx.shadowColor = particle.color;
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        requestAnimationFrame(animate);
      };

      animate();

      return () => {
        window.removeEventListener("resize", setCanvasSize);
      };
    }
  }, []);

  return (
    <div
      className={`relative hidden lg:flex w-full h-full transform transition-all duration-1000 delay-300 ${
        isVisible ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
      }`}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-100"
        style={{
          background: "transparent",
          zIndex: 1,
        }}
      />

      <div className="relative w-full h-full min-h-[500px] flex items-center justify-center z-10 -mt-50">
        <div className="relative w-64 h-64 md:w-80 md:h-80 z-20">
          <div
            className="absolute inset-0 rounded-full border-4 animate-spin-slow"
            style={{
              borderImage: `linear-gradient(45deg, ${colors.blue}, ${colors.green}, ${colors.yellow}, ${colors.red}) 1`,
              animationDuration: "20s",
            }}
          />
          <div
            className="absolute inset-4 rounded-full border-4 animate-spin-medium"
            style={{
              borderImage: `linear-gradient(135deg, ${colors.red}, ${colors.yellow}, ${colors.green}, ${colors.blue}) 1`,
              animationDuration: "15s",
              animationDirection: "reverse",
            }}
          />
          <div
            className="absolute inset-8 rounded-full border-4 animate-pulse"
            style={{ borderColor: colors.blue, opacity: 0.5 }}
          />
          <div
            className="absolute inset-12 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-500 z-30 border border-white/30"
            style={{
              background:
                "linear-gradient(135deg, rgba(66,133,244,0.12), rgba(52,168,83,0.12), rgba(234,67,53,0.12))",
            }}
          >
            <img
              src={gdg_icon}
              alt="GDG Logo"
              className="w-16 h-16 md:w-32 md:h-32 drop-shadow-md"
            />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500/70 rounded-full animate-bounce"></div>
            <div
              className="absolute -bottom-2 -left-2 w-6 h-6 bg-red-500/70 rounded-full animate-bounce"
              style={{ animationDelay: "0.5s" }}
            ></div>
          </div>
          <div
            className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-float-slow group cursor-pointer z-30"
            style={{ animationDuration: "6s" }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"
              style={{ backgroundColor: colors.green }}
            >
              <FaBrain className="text-2xl" />
            </div>
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              AI/ML
            </div>
          </div>
          <div
            className="absolute top-1/2 -right-4 transform -translate-y-1/2 animate-float-medium group cursor-pointer z-30"
            style={{
              animationDuration: "5s",
              animationDelay: "1s",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"
              style={{ backgroundColor: colors.blue }}
            >
              <FaCode className="text-xl" />
            </div>
            <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Web Dev
            </div>
          </div>
          <div
            className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 animate-float-slow group cursor-pointer z-30"
            style={{
              animationDuration: "7s",
              animationDelay: "2s",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"
              style={{ backgroundColor: colors.yellow }}
            >
              <FaCloud className="text-2xl" />
            </div>
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Cloud
            </div>
          </div>
          <div
            className="absolute top-1/2 -left-4 transform -translate-y-1/2 animate-float-medium group cursor-pointer z-30"
            style={{
              animationDuration: "6s",
              animationDelay: "1.5s",
            }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-2xl transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300"
              style={{ backgroundColor: colors.red }}
            >
              <FaMobile className="text-xl" />
            </div>
            <div className="absolute -bottom-7 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Mobile
            </div>
          </div>
          <div
            className="absolute top-8 left-8 animate-bounce-slow group cursor-pointer z-30"
            style={{ animationDuration: "4s" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-125 transition-all duration-300"
              style={{ backgroundColor: colors.green }}
            >
              <FaServer className="text-sm" />
            </div>
          </div>
          <div
            className="absolute top-8 right-8 animate-bounce-medium group cursor-pointer z-30"
            style={{
              animationDuration: "3s",
              animationDelay: "0.5s",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-125 transition-all duration-300"
              style={{ backgroundColor: colors.blue }}
            >
              <FaRobot className="text-sm" />
            </div>
          </div>
          <div
            className="absolute bottom-8 left-8 animate-bounce-medium group cursor-pointer z-30"
            style={{
              animationDuration: "3s",
              animationDelay: "1s",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-125 transition-all duration-300"
              style={{ backgroundColor: colors.yellow }}
            >
              <FaRocket className="text-sm" />
            </div>
          </div>
          <div
            className="absolute bottom-8 right-8 animate-bounce-slow group cursor-pointer z-30"
            style={{
              animationDuration: "4s",
              animationDelay: "1.5s",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transform group-hover:scale-125 transition-all duration-300"
              style={{ backgroundColor: colors.red }}
            >
              <FaStar className="text-sm" />
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          33% {
            transform: translateY(-10px) rotate(120deg);
          }
          66% {
            transform: translateY(5px) rotate(240deg);
          }
        }

        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-15px) scale(1.1);
          }
        }

        @keyframes bounce-slow {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes bounce-medium {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
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

        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }

        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-bounce-medium {
          animation: bounce-medium 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const rotatingWords = ["Developers", "Innovators", "Creators", "Leaders"];

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const socialLinks = [
    {
      icon: <FaGithub />,
      color: colors.blue,
      href: "https://github.com/GDSCQU",
      label: "GitHub",
    },
    {
      icon: <FaLinkedin />,
      color: colors.green,
      href: "https://www.linkedin.com/company/dsc-quantum-university/posts/?feedView=all",
      label: "LinkedIn",
    },
    {
      icon: <FaTwitter />,
      color: colors.yellow,
      href: "https://x.com/GDG_QuantumUni",
      label: "Twitter",
    },
    {
      icon: <FaYoutube />,
      color: colors.red,
      href: "https://www.youtube.com/@gdscquantumuniversity6559/featured",
      label: "YouTube",
    },
    {
      icon: <FaInstagram />,
      color: colors.yellow,
      href: "https://www.instagram.com/gdgquantumuniversity?igsh=dnBvOHp3ZTV2aWZx",
      label: "Instagram",
    },
  ];

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white to-gray-50 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-green-50/10 to-yellow-50/20 z-0"></div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        <div
          className={`space-y-8 transform transition-all duration-1000 ${
            isVisible
              ? "translate-x-0 opacity-100"
              : "-translate-x-10 opacity-0"
          }`}
        >
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200">
            <span
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: colors.blue }}
            ></span>
            <span
              className="text-sm font-medium"
              style={{ color: colors.blue }}
            >
              Google Developer Groups Community
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="block">Empowering</span>
              <span className="block relative">
                <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                  {rotatingWords[currentWord]}
                </span>
              </span>
              <span className="block">of Tomorrow</span>
            </h1>

            <div className="flex space-x-2 mt-4">
              {rotatingWords.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentWord ? "scale-125" : "scale-100"
                  }`}
                  style={{
                    backgroundColor:
                      index === currentWord ? colors.blue : "#d1d5db",
                  }}
                  onClick={() => setCurrentWord(index)}
                />
              ))}
            </div>
          </div>

          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
            Join our vibrant community of student developers, innovators, and
            creators. Learn, collaborate, and build amazing projects with Google
            technologies. Let's shape the future together!
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://gdg.community.dev/gdg-on-campus-quantum-university-roorkee-india/"
              target="_blank"
              className="group relative px-8 py-4 rounded-full font-semibold text-white overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95"
              style={{ backgroundColor: colors.green }}
            >
              <span className="flex items-center space-x-2 relative z-10">
                <FaRocket className="group-hover:animate-bounce" />
                <span>Join Community</span>
                <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
              </span>

              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            </a>
          </div>

          <div className="pt-8">
            <p className="text-gray-500 mb-4">Follow us on social media</p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="group relative w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1 transform"
                  style={{
                    backgroundColor: `${social.color}15`,
                    border: `2px solid ${social.color}30`,
                  }}
                  aria-label={social.label}
                >
                  <span
                    className="text-xl transition-all duration-300 group-hover:scale-125"
                    style={{ color: social.color }}
                  >
                    {social.icon}
                  </span>
                  <span className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div
                  className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  style={{
                    backgroundColor: `${stat.color}15`,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <AnimatedIllustration />
      </div>
    </section>
  );
};

export default HeroSection;
