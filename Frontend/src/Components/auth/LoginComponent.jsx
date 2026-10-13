import React, { useState, useEffect } from "react";
import {
  LuGithub as Github,
  LuArrowRight as ArrowRight,
  LuCodeXml as Code2,
  LuAtom as Atom,
  LuSparkles as Sparkles,
} from "react-icons/lu";

const LoginComponent = ({ handleGoogleLogin, handleGithubLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Handle subtle parallax effect on mouse move
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX - window.innerWidth / 2) / 50,
        y: (e.clientY - window.innerHeight / 2) / 50,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Custom Google Icon Component since we can't use react-icons
  const GoogleIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );

  return (
    // Main container designed to fit between an existing navbar and footer
    // py-24 md:py-32 provides ample spacing so it doesn't look cramped
    <div className="relative w-full py-24 md:py-32 overflow-hidden bg-gray-50 flex items-center justify-center font-sans selection:bg-blue-100 selection:text-blue-600">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Animated Google Color Blobs */}
        <div
          className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob"
          style={{
            transform: `translate(${mousePosition.x * -1}px, ${
              mousePosition.y * -1
            }px)`,
          }}
        ></div>
        <div
          className="absolute top-0 right-1/4 w-96 h-96 bg-red-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-2000"
          style={{
            transform: `translate(${mousePosition.x}px, ${
              mousePosition.y * -1
            }px)`,
          }}
        ></div>
        <div
          className="absolute -bottom-32 left-1/3 w-96 h-96 bg-green-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-4000"
          style={{
            transform: `translate(${mousePosition.x * -1}px, ${
              mousePosition.y
            }px)`,
          }}
        ></div>
        <div
          className="absolute -bottom-40 right-1/3 w-96 h-96 bg-yellow-400/30 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-blob animation-delay-5000"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
          }}
        ></div>

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Main Glass Card */}
      <div className="relative z-10 w-full max-w-[420px] mx-4 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]">
        {/* Decorative top elements */}
        <div className="absolute -top-12 left-0 right-0 flex justify-center space-x-2 animate-bounce-slow">
          <div className="h-2 w-2 rounded-full bg-blue-500"></div>
          <div className="h-2 w-2 rounded-full bg-red-500"></div>
          <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
          <div className="h-2 w-2 rounded-full bg-green-500"></div>
        </div>

        <div className="bg-white/60 backdrop-blur-2xl border border-white/50 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-white/60">
          {/* Header Section */}
          <div className="text-center mb-10 space-y-4">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/50 border border-white/60 shadow-sm mb-2 group cursor-default hover:scale-105 transition-transform duration-300">
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500 blur-lg opacity-20 rounded-full"></div>
                <Code2 className="w-8 h-8 text-blue-600 relative z-10" />
              </div>
              <span className="mx-2 text-gray-300">|</span>
              <div className="relative">
                <Atom className="w-8 h-8 text-indigo-600 relative z-10 group-hover:rotate-180 transition-transform duration-700" />
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 tracking-tight mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm font-medium tracking-wide">
                GDG QUANTUM UNIVERSITY
              </p>
            </div>
          </div>

          {/* Login Buttons Container */}
          <div className="space-y-4">
            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="group relative w-full flex items-center justify-between px-4 py-4 bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-200 rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute inset-0 w-1 bg-blue-500 h-full left-0 transition-all duration-300 group-hover:w-1.5"></div>
              <div className="flex items-center space-x-4 pl-2">
                {isLoading && activeProvider === "Google" ? (
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <GoogleIcon className="w-6 h-6" />
                )}
                <span className="font-semibold text-gray-700 group-hover:text-gray-900 transition-colors">
                  Continue with Google
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-300" />
            </button>

            {/* GitHub Button */}
            <button
              onClick={handleGithubLogin}
              disabled={isLoading}
              className="group relative w-full flex items-center justify-between px-4 py-4 bg-gray-900 hover:bg-gray-800 text-white rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl shadow-gray-900/10 disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                <Github size={60} strokeWidth={1.5} />
              </div>
              <div className="flex items-center space-x-4 pl-2 relative z-10">
                {isLoading && activeProvider === "GitHub" ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Github className="w-6 h-6" />
                )}
                <span className="font-semibold text-gray-100 group-hover:text-white transition-colors">
                  Continue with GitHub
                </span>
              </div>
              <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Sparkles className="w-4 h-4 text-yellow-300" />
              </div>
            </button>
          </div>

          {/* Footer Area */}
          <div className="mt-10 text-center">
            <p className="text-xs text-gray-400 font-medium">
              By continuing, you agree to GDG QU's <br />
              <a
                href="#"
                className="text-blue-500 hover:text-blue-600 hover:underline"
              >
                Terms of Service
              </a>{" "}
              &{" "}
              <a
                href="#"
                className="text-blue-500 hover:text-blue-600 hover:underline"
              >
                Privacy Policy
              </a>
            </p>

            <div className="mt-8 flex items-center justify-center space-x-2 opacity-50">
              <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
              <div className="text-[10px] text-gray-400 tracking-widest uppercase font-semibold">
                Empowering Developers
              </div>
              <div className="h-1 w-1 bg-gray-400 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Card Reflection/Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-[28px] blur-2xl opacity-10 group-hover:opacity-20 transition duration-500 -z-10"></div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animation-delay-5000 {
          animation-delay: 5s;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
    </div>
  );
};

export default LoginComponent;
