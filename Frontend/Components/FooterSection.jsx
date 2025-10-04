import React, { useState, useEffect, useRef } from 'react';
import { 
  FaGoogle, 
  FaGithub, 
  FaLinkedin, 
  FaTwitter, 
  FaYoutube,
  FaDiscord,
  FaInstagram,
  FaHeart,
  FaRocket,
  FaCode,
  FaUsers,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
  FaArrowUp,
  FaRegCopyright
} from 'react-icons/fa';

const Footer = () => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const canvasRef = useRef(null);

  const colors = {
    blue: '#4285f4',
    green: '#34a853',
    yellow: '#f9ab00',
    red: '#ea4335'
  };

  // Particle animation for background
  useEffect(() => {
    setIsVisible(true);
    
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 50;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: Object.values(colors)[Math.floor(Math.random() * 4)],
        opacity: Math.random() * 0.3 + 0.1
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(3, 7, 18, 0.1)'; // Dark background with transparency
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(particle => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        gradient.addColorStop(0, `${particle.color}${Math.round(particle.opacity * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${particle.color}00`);
        
        ctx.fillStyle = gradient;
        ctx.fill();

        // Connect particles with lines
        particles.forEach(otherParticle => {
          const distance = Math.sqrt(
            Math.pow(particle.x - otherParticle.x, 2) + 
            Math.pow(particle.y - otherParticle.y, 2)
          );

          if (distance < 100) {
            ctx.beginPath();
            ctx.strokeStyle = `${particle.color}${Math.round((1 - distance/100) * 10).toString(16)}`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.stroke();
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => window.removeEventListener('resize', setCanvasSize);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const socialLinks = [
    { icon: <FaGithub />, name: 'GitHub', color: colors.blue, link: '#' },
    { icon: <FaLinkedin />, name: 'LinkedIn', color: colors.green, link: '#' },
    { icon: <FaTwitter />, name: 'Twitter', color: colors.yellow, link: '#' },
    { icon: <FaYoutube />, name: 'YouTube', color: colors.red, link: '#' },
    { icon: <FaDiscord />, name: 'Discord', color: colors.blue, link: '#' },
    { icon: <FaInstagram />, name: 'Instagram', color: colors.green, link: '#' }
  ];

  const quickLinks = [
    { name: 'Home', link: '#home' },
    { name: 'About GDG', link: '#about' },
    { name: 'Tech Stack', link: '#tech' },
    { name: 'Roadmaps', link: '#roadmaps' },
    { name: 'Events', link: '#events' },
    { name: 'Team', link: '#team' },
    { name: 'Projects', link: '#projects' },
    { name: 'Contact', link: '#contact' }
  ];

  const techDomains = [
    'Web Development',
    'Mobile Development', 
    'AI/ML',
    'Cloud Computing',
    'Cyber Security',
    'Blockchain',
    'IoT',
    'Graphic Design'
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white overflow-hidden">
      
      {/* Animated Background Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full animate-ping"></div>
                <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-red-500 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  GDG Community
                </h3>
                <p className="text-gray-400 text-sm">Google Developer Groups</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering developers through community, innovation, and Google's technologies. 
              Join us in shaping the future of technology.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social.name}
                  href={social.link}
                  className="group relative w-10 h-10 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-white/10"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <span 
                    className="text-lg transition-all duration-300 group-hover:scale-125"
                    style={{ color: social.color }}
                  >
                    {social.icon}
                  </span>
                  
                  {/* Tooltip */}
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                    {social.name}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2">
              <FaRocket className="text-blue-400" />
              <span>Quick Links</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {quickLinks.map((link, index) => (
                <a
                  key={link.name}
                  href={link.link}
                  className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2"
                >
                  <div className="w-1 h-1 bg-blue-500 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="text-sm">{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Tech Domains */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2">
              <FaCode className="text-green-400" />
              <span>Tech Domains</span>
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {techDomains.map((domain, index) => (
                <div
                  key={domain}
                  className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300"
                >
                  <div 
                    className="w-2 h-2 rounded-full transition-all duration-300 group-hover:scale-150"
                    style={{ backgroundColor: Object.values(colors)[index % 4] }}
                  ></div>
                  <span className="text-sm">{domain}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-1">
            <h4 className="text-lg font-semibold mb-6 flex items-center space-x-2">
              <FaPaperPlane className="text-yellow-400" />
              <span>Stay Updated</span>
            </h4>
            <p className="text-gray-300 text-sm mb-4">
              Get the latest updates on events, workshops, and tech insights.
            </p>
            
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center hover:scale-110 transition-transform duration-300">
                  <FaPaperPlane className="text-white text-sm" />
                </button>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <FaHeart className="text-red-400" />
                <span>Join 500+ developers in our community</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
          
          {/* Copyright */}
          <div className="flex items-center space-x-2 text-gray-400">
            <FaRegCopyright className="text-sm" />
            <span className="text-sm">
              {currentYear} GDG Community. Made with <FaHeart className="inline text-red-400 mx-1" /> for developers
            </span>
          </div>

          {/* Additional Links */}
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors duration-300">Code of Conduct</a>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300"
          >
            <span className="text-sm">Back to Top</span>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <FaArrowUp className="text-white text-sm" />
            </div>
          </button>
        </div>

        {/* Google Developer Badge */}
        <div className="text-center mt-8 pt-8 border-t border-white/10">
          <div className="inline-flex items-center space-x-3 bg-white/5 backdrop-blur-sm px-6 py-3 rounded-full border border-white/10">
            <FaGoogle className="text-blue-400" />
            <span className="text-sm text-gray-300">Google Developer Groups</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{animationDelay: '0.6s'}}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating Icons */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-white/5 text-2xl animate-float"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + Math.sin(i) * 60}%`,
              animationDelay: `${i * 2}s`,
              animationDuration: `${15 + i * 2}s`
            }}
          >
            <FaCode />
          </div>
        ))}
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(120deg); }
          66% { transform: translateY(10px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;