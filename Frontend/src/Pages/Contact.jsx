import React, { useState, useEffect, useRef } from "react";
import {
  FaPaperPlane,
  FaMapMarkerAlt,
  FaEnvelope,
  FaTerminal,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaCode,
  FaCircle,
  FaNetworkWired,
  FaSatellite
} from "react-icons/fa";

// --- THEME CONFIG ---
const BRAND_COLORS = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

const ContactPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [serverMessage, setServerMessage] = useState("");
  const canvasRef = useRef(null);

  // --- PARTICLE ANIMATION (Matching your Team Page) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    const nodes = [];
    const nodeCount = window.innerWidth < 768 ? 20 : 45;
    const colors = Object.values(BRAND_COLORS);

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and Draw Nodes
      nodes.forEach((node, i) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();

        // Connections
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = node.x - nodes[j].x;
          const dy = node.y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(100, 116, 139, ${0.15 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- FORM HANDLERS ---
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim() || formData.name.length < 2 || formData.name.length > 100) 
      newErrors.name = "Name must be 2-100 characters.";
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email)) 
      newErrors.email = "Please enter a valid email.";
    
    if (!formData.message.trim() || formData.message.length < 10 || formData.message.length > 1000) 
      newErrors.message = "Message must be 10-1000 characters.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerMessage("");
    if (!validate()) return;
    setStatus("submitting");

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", message: "" });
        setTimeout(() => setStatus("idle"), 5000);
      } else {
        setStatus("error");
        setServerMessage(response.status === 429 ? "Rate limit exceeded. Slow down!" : data.message || "Failed to send.");
      }
    } catch (error) {
      setStatus("error");
      setServerMessage("Network connection failed.");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-white selection:bg-blue-100 selection:text-blue-700 font-sans">
      
      {/* --- BACKGROUND FX --- */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />
      <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-red-400/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-gray-200 shadow-sm animate-fade-in-down">
            <FaNetworkWired className="text-blue-500" />
            <span className="text-xs font-bold text-gray-600 tracking-wider uppercase">Connect With Us</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 animate-fade-in-up">
            Let's Start a <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-red-500 to-yellow-500">
              Conversation.
            </span>
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* --- LEFT COLUMN: INFO & TERMINAL --- */}
          <div className="lg:col-span-5 space-y-8 animate-slide-in-left">
            
            {/* Description */}
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-8 rounded-[2rem] shadow-sm">
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                    Whether you have a question about events, want to partner with GDG, or just want to talk tech – our inbox is open.
                </p>
                
                {/* Contact Pills */}
                <div className="space-y-4">
                    <div className="group flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-blue-200 cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                            <FaEnvelope className="text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs font-bold text-gray-400 uppercase">Email Us</p>
                            <p className="text-gray-900 font-medium">dsc@quantumuniversity.edu.in</p>
                        </div>
                    </div>

                    <div className="group flex items-center p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:border-red-200 cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                            <FaMapMarkerAlt className="text-xl" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs font-bold text-gray-400 uppercase">Visit HQ</p>
                            <p className="text-gray-900 font-medium">Quantum University, India</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* "THE TERMINAL" - Decorative Developer Element */}
            <div className="hidden lg:block bg-[#1e1e1e] rounded-2xl p-4 shadow-2xl border border-gray-800 font-mono text-xs overflow-hidden relative group">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-700">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-500 ml-2 flex items-center gap-2"><FaTerminal /> server-logs — bash</span>
                </div>
                <div className="space-y-1 text-gray-300 h-32 opacity-80">
                    <p><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> init communication_protocol</p>
                    <p className="text-gray-500">Loading modules...</p>
                    <p><span className="text-green-400">✔</span> Modules loaded.</p>
                    <p><span className="text-green-400">➜</span> <span className="text-blue-400">~</span> waiting for user input<span className="animate-pulse">_</span></p>
                    {/* Simulated live typing effect could go here */}
                </div>
                {/* Floating Glow */}
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-blue-500/20 blur-xl rounded-full pointer-events-none"></div>
            </div>
          </div>

          {/* --- RIGHT COLUMN: THE FORM --- */}
          <div className="lg:col-span-7 animate-slide-in-right relative">
            
            {/* Floating Decorative Icons */}
            <div className="absolute -top-6 -right-6 text-4xl text-yellow-400/30 animate-float-slow"><FaSatellite /></div>
            <div className="absolute -bottom-8 -left-8 text-4xl text-blue-400/20 animate-float-delayed"><FaCode /></div>

            <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white p-8 md:p-10 relative overflow-hidden">
               {/* Top Gradient Line */}
               <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500"></div>

               {/* Success Overlay */}
               {status === "success" && (
                 <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-20 flex flex-col items-center justify-center animate-fade-in">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mb-4 shadow-inner">
                        <FaCheckCircle />
                    </div>
                    <h3 className="text-2xl font-extrabold text-gray-900">Message Received!</h3>
                    <p className="text-gray-500 mt-2 font-medium">We'll be in touch shortly.</p>
                    <button onClick={() => setStatus("idle")} className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-black transition-colors">
                        Send Another
                    </button>
                 </div>
               )}

               <form onSubmit={handleSubmit} className="space-y-6 mt-2">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Your Name</label>
                          <input 
                            type="text" 
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            className={`w-full px-5 py-4 bg-gray-50/50 border-2 rounded-xl outline-none transition-all font-medium placeholder:text-gray-400 focus:bg-white ${errors.name ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(66,133,244,0.1)]'}`}
                          />
                          {errors.name && <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1"><FaExclamationCircle /> {errors.name}</p>}
                      </div>

                      <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Address</label>
                          <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="hello@google.com"
                            className={`w-full px-5 py-4 bg-gray-50/50 border-2 rounded-xl outline-none transition-all font-medium placeholder:text-gray-400 focus:bg-white ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(66,133,244,0.1)]'}`}
                          />
                          {errors.email && <p className="text-red-500 text-xs font-bold flex items-center gap-1 mt-1"><FaExclamationCircle /> {errors.email}</p>}
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Message</label>
                      <textarea 
                        rows="5"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your project or query..."
                        className={`w-full px-5 py-4 bg-gray-50/50 border-2 rounded-xl outline-none transition-all font-medium placeholder:text-gray-400 focus:bg-white resize-none ${errors.message ? 'border-red-300 focus:border-red-500' : 'border-gray-100 focus:border-blue-500 focus:shadow-[0_0_0_4px_rgba(66,133,244,0.1)]'}`}
                      ></textarea>
                      <div className="flex justify-between px-1">
                          {errors.message ? <p className="text-red-500 text-xs font-bold flex items-center gap-1"><FaExclamationCircle /> {errors.message}</p> : <span></span>}
                          <span className={`text-xs font-bold ${formData.message.length > 1000 ? 'text-red-500' : 'text-gray-300'}`}>{formData.message.length}/1000</span>
                      </div>
                  </div>

                  {status === "error" && (
                      <div className="p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-sm font-bold animate-shake">
                          <FaExclamationCircle /> {serverMessage}
                      </div>
                  )}

                  <button 
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none group"
                  >
                    {status === "submitting" ? (
                        <><FaSpinner className="animate-spin" /> Sending...</>
                    ) : (
                        <>Send Message <FaPaperPlane className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></>
                    )}
                  </button>

               </form>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float-delayed { animation: float-delayed 5s ease-in-out infinite 2s; }

        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }

        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-left { animation: slide-in-left 0.7s ease-out forwards; }

        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right { animation: slide-in-right 0.7s ease-out forwards 0.2s; } // delayed
      `}</style>
    </div>
  );
};

export default ContactPage;