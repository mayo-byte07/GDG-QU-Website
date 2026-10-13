import React, { useEffect, useRef, useState } from "react";
import {
  FaGraduationCap,
  FaHandshake,
  FaUsers,
  FaRocket,
  FaLightbulb,
  FaCode,
  FaCloud,
  FaAndroid,
  FaCalendarAlt,
} from "react-icons/fa";
import { colors, homeStats as stats } from "../../data/homeData";
import gdg_icon from "../../assets/logos/gdg_icon.jpg";
import { Link } from "react-router-dom";

const cards = [
  {
    icon: <FaGraduationCap />,
    title: "Learning",
    description: "Hands-on workshops and tech talks on Google technologies.",
    color: colors.blue,
  },
  {
    icon: <FaHandshake />,
    title: "Networking",
    description: "Connect with peers and build professional relationships.",
    color: colors.green,
  },
  {
    icon: <FaUsers />,
    title: "Community",
    description:
      "Inclusive environment for everyone from beginners to experts.",
    color: colors.yellow,
  },
];

const techStack = [
  { icon: <FaAndroid />, name: "Android", color: colors.green },
  { icon: <FaCode />, name: "Web", color: colors.blue },
  { icon: <FaCloud />, name: "Cloud", color: colors.yellow },
  { icon: <FaLightbulb />, name: "AI/ML", color: colors.red },
];

const MobileIllustration = () => (
  <div className="relative h-72 w-full rounded-3xl overflow-hidden">
    <div className="absolute -top-20 -left-20 w-72 h-72 bg-blue-400 rounded-full blur-3xl opacity-30 glow" />
    <div className="absolute bottom-0 -right-20 w-72 h-72 bg-green-400 rounded-full blur-3xl opacity-30 glow" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="glass rounded-2xl px-6 py-5 shadow-xl floating">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold">
            GDG
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">
              Google Developer Groups
            </p>
            <p className="text-xs text-gray-500">Learn • Build • Connect</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70"
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
                style={{ backgroundColor: tech.color }}
              >
                {tech.icon}
              </div>
              <span className="text-xs font-medium text-gray-700">
                {tech.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const DesktopIllustration = () => (
  <div className="relative w-full rounded-3xl overflow-hidden p-10">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50" />
    <div className="absolute inset-0 bg-gradient-to-br from-blue-100/40 via-transparent to-green-100/40" />
    <div className="absolute -top-40 -left-40 w-[32rem] h-[32rem] bg-gradient-to-br from-blue-400/20 to-blue-300/20 rounded-full blur-[140px]" />
    <div className="absolute -bottom-40 -right-40 w-[32rem] h-[32rem] bg-gradient-to-br from-green-400/20 to-green-300/20 rounded-full blur-[140px]" />
    <div className="relative grid grid-cols-1 xl:grid-cols-2 gap-12 items-center">
      <div className="floating">
        <div className="glass rounded-3xl p-8 shadow-2xl max-w-sm">
          <img src={gdg_icon} alt="GDG" className="h-14" />
          <h4 className="font-bold text-gray-900 text-lg mb-1">
            Google Developer Groups
          </h4>
          <p className="text-sm text-gray-600">Learn. Build. Share.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {techStack.map((tech, i) => (
          <div
            key={tech.name}
            className="glass rounded-2xl p-4 shadow-lg floating hover:scale-105 transition-transform"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white mb-2"
              style={{ backgroundColor: tech.color }}
            >
              {tech.icon}
            </div>
            <p className="font-semibold text-gray-800">{tech.name}</p>
            <p className="text-xs text-gray-500">Track</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const WhatIsGDGSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const sectionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const handleResize = () => setWindowWidth(window.innerWidth);

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return undefined;
    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const isMobile = windowWidth < 768;

  return (
    <section
      ref={sectionRef}
      className="py-12 px-4 sm:px-6 lg:px-8 bg-white"
      id="what-is-gdg"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 mb-4">
            <FaRocket className="text-blue-500" />
            <span className="text-sm font-medium text-blue-600">About GDG</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            What is{" "}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Google Developer Groups?
            </span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A global community of developers passionate about Google&apos;s
            technologies
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div
            className={`transform transition-all duration-1000 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            {isMobile ? <MobileIllustration /> : <DesktopIllustration />}
          </div>

          <div
            className={`space-y-8 transform transition-all duration-1000 delay-300 ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-10 opacity-0"
            }`}
          >
            <div className="prose prose-lg">
              <p className="text-gray-600 leading-relaxed">
                <strong>Google Developer Groups (GDG)</strong> are community-led
                groups for developers interested in Google&apos;s developer
                technology. From Android to Firebase, Google Cloud to Machine
                Learning, our community organizes workshops, study jams, and
                speaker sessions.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                <FaLightbulb className="text-yellow-500" />
                <span>What We Do:</span>
              </h3>

              <div className="space-y-4">
                {cards.map((card) => (
                  <div
                    key={card.title}
                    className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-300"
                  >
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                      style={{
                        backgroundColor: card.color,
                      }}
                    >
                      {card.icon}
                    </div>
                    <div>
                      <h4
                        className="font-semibold text-gray-900 mb-1"
                        style={{ color: card.color }}
                      >
                        {card.title}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {card.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="https://gdg.community.dev/gdg-on-campus-quantum-university-roorkee-india/"
                target="_blank"
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FaUsers />
                <span>Join Community</span>
              </a>

              <Link
                to="/events"
                className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                <FaCalendarAlt />
                <span>View Events</span>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
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

                @keyframes spin-slow {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes spin-medium {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }

                .animate-spin-medium {
                    animation: spin-medium 15s linear infinite;
                }

                @media (max-width: 768px) {
                    .prose-lg {
                        font-size: 1rem;
                        line-height: 1.6;
                    }
                }

                @keyframes float-slow {
                    0%,
                    100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-12px);
                    }
                }

                @keyframes glow {
                    0% {
                        opacity: 0.4;
                    }
                    50% {
                        opacity: 0.8;
                    }
                    100% {
                        opacity: 0.4;
                    }
                }

                .glass {
                    background: rgba(255, 255, 255, 0.65);
                    backdrop-filter: blur(18px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                }

                .floating {
                    animation: float-slow 6s ease-in-out infinite;
                }

                .glow {
                    animation: glow 5s ease-in-out infinite;
                }
            `}</style>
    </section>
  );
};

export default WhatIsGDGSection;
