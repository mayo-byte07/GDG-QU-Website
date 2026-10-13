import React, { useEffect, useRef, useState } from "react";
import {
  FaGoogle,
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaHeart,
  FaRocket,
  FaCode,
  FaUsers,
  FaMapMarkerAlt,
  FaEnvelope,
  FaArrowUp,
  FaRegCopyright,
  FaYoutube,
} from "react-icons/fa";
import gdg_long_white from "../assets/logos/gdg_long_white.png";
import { homeStats } from "../data/homeData";
import { href, Link } from "react-router-dom";

const Footer = () => {
  const [currentYear] = useState(new Date().getFullYear());
  const canvasRef = useRef(null);

  const colors = {
    blue: "#4285f4",
    green: "#34a853",
    yellow: "#f9ab00",
    red: "#ea4335",
  };

  // Improved Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;
    let particles = [];
    const particleCount = 60;
    const connectionDistance = 120;

    // Handle Resize
    const resizeCanvas = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    // Initial size
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Initialize Particles
    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          dx: (Math.random() - 0.5) * 0.5,
          dy: (Math.random() - 0.5) * 0.5,
          color: Object.values(colors)[Math.floor(Math.random() * 4)],
        });
      }
    };

    initParticles();

    // Animation Loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.x += p.dx;
        p.y += p.dy;

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.6;
        ctx.fill();

        // Connect Particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = 1 - dist / connectionDistance;
            ctx.lineWidth = 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

        animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socialLinks = [
    { icon: <FaGithub />, name: "GitHub", color: "#fff", bg: "#333", href: "https://github.com/GDG-QU"},
    { icon: <FaLinkedin />, name: "LinkedIn", color: "#fff", bg: "#0077b5" ,href: "https://www.linkedin.com/company/dsc-quantum-university/posts/?feedView=all"},
    { icon: <FaTwitter />, name: "Twitter", color: "#fff", bg: "#1da1f2",href: "https://x.com/GDG_QuantumUni" },
    { icon: <FaInstagram />, name: "Instagram", color: "#fff", bg: "#e1306c" ,href: "https://www.instagram.com/gdg.qu/"},
    { icon: <FaYoutube />, name: "YouTube", color: "#fff", bg: "#ff0000", href: "https://www.youtube.com/@gdscquantumuniversity6559/featured"},
  ];

  const quickLinks = [
    { name: "Home", link: "/" },
    { name: "Team", link: "/team" },
    { name: "Events", link: "/events" },
    { name: "Roadmaps", link: "/roadmaps" },
    { name: "Contributions", link: "/contributions" },
  ];

  const techDomains = [
    { name: "Web Dev", color: "text-blue-400" },
    { name: "Android", color: "text-green-400" },
    { name: "Cloud", color: "text-red-400" },
    { name: "AI / ML", color: "text-yellow-400" },
    { name: "Design", color: "text-purple-400" },
    { name: "Blockchain", color: "text-cyan-400" },
  ];

  return (
    <footer className="relative bg-[#0a0f1c] text-white overflow-hidden border-t border-white/5">
      {/* --- Background Layers --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-[#0d1221] to-black z-0"></div>

      {/* Canvas Layer */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-30" />

      {/* Radial Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* --- Main Grid Layout --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Column 1: Brand & Socials */}
          <div className="space-y-6">
            <img
              src={gdg_long_white}
              alt="GDG Logo"
              className="h-14 -ml-2 w-auto opacity-90"
            />
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              A community-driven group for developers to learn, share, and
              connect. Powered by Google Developers technology to shape the
              future.
            </p>

            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href="#"
                  className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = social.bg)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      "rgba(255,255,255,0.05)")
                  }
                >
                  <span className="text-lg text-white/80 hover:text-white">
                    {social.icon}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <FaRocket className="text-blue-500" /> Explore
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.link}
                    className="text-gray-400 hover:text-white hover:translate-x-1 transition-all duration-200 flex items-center gap-2 text-sm group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-blue-400 transition-colors"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Tech Domains */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <FaCode className="text-green-500" /> Domains
            </h3>
            <div className="flex flex-wrap gap-2">
              {techDomains.map((tech) => (
                <span
                  key={tech.name}
                  className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-xs text-gray-300 hover:border-white/30 hover:bg-white/10 transition-all cursor-default"
                >
                  <span className={`mr-1.5 ${tech.color}`}>●</span>
                  {tech.name}
                </span>
              ))}
            </div>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <FaEnvelope className="text-yellow-500" /> Contact Us
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 text-sm text-gray-400">
                <FaMapMarkerAlt className="mt-1 text-gray-500 shrink-0" />
                <span>
                  Quantum University,
                  <br />
                  Roorkee, India
                </span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <FaEnvelope className="text-gray-500 shrink-0" />
                <a
                  href="mailto:dsc@quantumuniversity.edu.in"
                  className="hover:text-blue-400 transition-colors"
                >
                  dsc@quantumuniversity.edu.in
                </a>
              </div>
            </div>

            {/* Community Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-full">
              <FaUsers className="text-blue-400" />
              <span className="text-xs font-medium text-blue-200">
                {homeStats[0].number} Community Members
              </span>
            </div>
          </div>
        </div>

        {/* --- Footer Bottom --- */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <FaRegCopyright /> {currentYear} GDG QU.
            </div>
            <div className="hidden md:block w-1 h-1 bg-gray-700 rounded-full"></div>
            <div className="flex gap-4">
              <a href="#" className="hover:text-gray-300 transition-colors">
                Privacy
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Terms
              </a>
              <a href="#" className="hover:text-gray-300 transition-colors">
                Code of Conduct
              </a>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-500 flex items-center gap-1">
              Made with <FaHeart className="text-red-500 animate-pulse" /> by
              GDG Team and Contributors
            </span>
            <button
              onClick={scrollToTop}
              className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-white/10 hover:text-white transition-all"
              title="Back to Top"
            >
              <FaArrowUp className="text-xs" />
            </button>
          </div>
        </div>

        {/* Google Developer Badge with Animated Dots */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-md">
            <FaGoogle className="text-sm text-gray-400" />
            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest border-r border-white/10 pr-3 mr-1">
              Google Developer Groups
            </span>

            {/* The 4 Dots Animation */}
            <div className="flex space-x-1.5">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
              <div
                className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-yellow-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"
                style={{ animationDelay: "0.6s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
