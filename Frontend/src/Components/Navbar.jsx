import React, { useState, useEffect } from "react";
import {
  FaHome,
  FaUsers,
  FaCalendarAlt,
  FaTrophy,
  FaEnvelope,
  FaUser,
  FaUserPlus,
  FaBars,
  FaTimes,
  FaProjectDiagram,
} from "react-icons/fa";
import gdg_long from "../assets/logos/gdg_long.png";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const colors = {
  blue: "#4285f4",
  green: "#34a853",
  yellow: "#f9ab00",
  red: "#ea4335",
};

const navLinks = [
  { name: "Home", icon: <FaHome />, color: colors.blue, href: "/" },
  { name: "Team", icon: <FaUsers />, color: colors.green, href: "/team" },
  {
    name: "Events",
    icon: <FaCalendarAlt />,
    color: colors.yellow,
    href: "/events",
  },
  {
    name: "Contributions",
    icon: <FaProjectDiagram />,
    color: colors.red,
    href: "/contributions",
  },
  {
    name: "Wall of Fame",
    icon: <FaTrophy />,
    color: colors.blue,
    href: "/wall-of-fame",
  },
  {
    name: "Contact Us",
    icon: <FaEnvelope />,
    color: colors.green,
    href: "/contact",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // Hook to get current URL path

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper to determine if link is active based on current path
  const isActive = (path) => location.pathname === path;

  const authContext = useAuth();

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/60 backdrop-blur-md shadow-lg py-2"
          : "bg-white/90 backdrop-blur-sm py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            to="/"
            className="cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <img
              src={gdg_long}
              alt="GDG Logo"
              className="h-10 lg:h-12 w-auto"
            />
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                  isActive(link.href)
                    ? "text-white"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                {/* Active/Hover Background */}
                <div
                  className={`absolute inset-0 rounded-lg transition-all duration-300 z-0 ${
                    isActive(link.href)
                      ? "scale-100 opacity-100 shadow-md"
                      : "scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-10 group-hover:shadow-sm"
                  }`}
                  style={{ backgroundColor: link.color }}
                />

                <span className="flex items-center space-x-2 relative z-10">
                  <span
                    className={`transition-all duration-300 ${
                      isActive(link.href)
                        ? "scale-110"
                        : "group-hover:scale-110"
                    }`}
                    style={{
                      color: isActive(link.href) ? "white" : link.color,
                    }}
                  >
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                </span>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {authContext.user ? (
              <ProfileIcon profilePic={authContext.user.photo} />
            ) : (
              <Link
                to="/login"
                className="group relative p-[2px] rounded-full overflow-hidden active:scale-95 transition-transform duration-200 cursor-pointer"
              >
                {/* Gradient Background (Acts as border) */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 opacity-70 group-hover:opacity-100 animate-gradient-xy transition-opacity duration-300" />

                {/* Inner Content */}
                <div className="relative flex items-center gap-2 px-6 py-2 bg-white rounded-full transition-colors duration-300 group-hover:bg-opacity-95">
                  <FaUser className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                  <span className="font-bold text-gray-700 group-hover:text-gray-900">
                    Login
                  </span>
                </div>
              </Link>
            )}
          </div>

          {/* Mobile / Tablet Hamburger */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              style={{ color: colors.blue }}
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out ${
            isOpen
              ? "max-h-screen opacity-100 py-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center space-x-4 p-4 rounded-xl font-bold transition-all duration-300 ${
                  isActive(link.href)
                    ? "text-white shadow-lg translate-x-2"
                    : "text-gray-700 hover:bg-gray-50 active:scale-95"
                }`}
                style={{
                  backgroundColor: isActive(link.href)
                    ? link.color
                    : "transparent",
                }}
                onClick={() => setIsOpen(false)}
              >
                <span
                  className="text-xl"
                  style={{
                    color: isActive(link.href) ? "white" : link.color,
                  }}
                >
                  {link.icon}
                </span>
                <span>{link.name}</span>
              </Link>
            ))}

            <div className="pt-4 mt-2 border-t border-gray-100 flex flex-col space-y-3">
              {authContext.user ? (
                <ProfileIcon profilePic={authContext.user.photo} />
              ) : (
                <Link
                  to="/login"
                  className="group relative p-[2px] rounded-full overflow-hidden active:scale-95 transition-transform duration-200 cursor-pointer"
                >
                  {/* Gradient Background (Acts as border) */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-red-500 to-yellow-500 opacity-70 group-hover:opacity-100 animate-gradient-xy transition-opacity duration-300" />

                  {/* Inner Content */}
                  <div className="relative flex items-center gap-2 px-6 py-2 bg-white rounded-full transition-colors duration-300 group-hover:bg-opacity-95">
                    <FaUser className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                    <span className="font-bold text-gray-700 group-hover:text-gray-900">
                      Login
                    </span>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

const ProfileIcon = ({ profilePic }) => {
  return (
    <Link
      to="/profile"
      className="group relative flex items-center justify-center w-12 h-12"
    >
      {/* Gradient Border Ring */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-red-500 to-yellow-500 p-[2px] opacity-80 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-700 ease-out">
        <div className="bg-white w-full h-full rounded-full"></div>
        {/* The bg-white div creates the gap between image and border */}
      </div>

      {/* Image Container */}
      <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white">
        <img
          src={
            profilePic ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
          alt="Profile"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </Link>
  );
};

export default Navbar;
