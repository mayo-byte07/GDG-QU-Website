import React from "react";
import { FaWhatsapp, FaGoogle, FaArrowRight, FaBell } from "react-icons/fa";

const JoinCommunity = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-gray-900">
      {/* --- Background Effects --- */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] opacity-50"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px] opacity-50"></div>
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Floating Icon Container */}
        <div className="inline-flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
          {/* The Bell Icon with custom ringing animation */}
          <FaBell className="text-3xl text-yellow-400 animate-bell-ring origin-top" />
        </div>

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
          Don't Miss a{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            Single Update
          </span>
        </h2>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
          Be the first to know about upcoming hackathons, workshops, and speaker
          sessions. Join our vibrant community channels today.
        </p>

        {/* --- Buttons --- */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          {/* WhatsApp Button */}
          <a
            href="https://chat.whatsapp.com/ITrLWCTUV9lEshoRxOwixf"
            target="_blank"
            rel="noreferrer"
            className="group relative w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366] text-white rounded-full font-bold text-lg shadow-lg shadow-green-500/20 hover:shadow-green-500/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
            <FaWhatsapp className="text-2xl" />
            <span>Join WhatsApp Group</span>
          </a>

          {/* GDG Button */}
          <a
            href="https://gdg.community.dev/gdg-on-campus-quantum-university-roorkee-india/"
            target="_blank"
            rel="noreferrer"
            className="group w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-full font-bold text-lg border border-gray-200 shadow-lg hover:shadow-xl hover:border-blue-500 hover:text-blue-600 hover:-translate-y-1 transition-all duration-300"
          >
            <FaGoogle className="text-xl" />
            <span>Join Chapter on GDG</span>
            <FaArrowRight className="text-sm transform group-hover:translate-x-1 transition-transform" />
          </a>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Join 500+ developers already in the community.
        </p>
      </div>

      {/* --- Custom CSS for the Bell Ring --- */}
      <style jsx>{`
        @keyframes ring {
          0% {
            transform: rotate(0);
          }
          5% {
            transform: rotate(20deg);
          }
          10% {
            transform: rotate(-20deg);
          }
          15% {
            transform: rotate(10deg);
          }
          20% {
            transform: rotate(-10deg);
          }
          25% {
            transform: rotate(5deg);
          }
          30% {
            transform: rotate(-5deg);
          }
          35% {
            transform: rotate(0);
          }
          100% {
            transform: rotate(0);
          }
        }

        .animate-bell-ring {
          /* Runs the ring animation every 3 seconds */
          animation: ring 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default JoinCommunity;
