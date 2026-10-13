import React, { useState } from "react";
import GDG_Logo from "../../assets/images/gdg_logo.webp";
import { MdPerson, MdMenu, MdClose } from "react-icons/md";
import { FaHome, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";
import { FaRoad, FaMessage } from "react-icons/fa6";
import { PiWallFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    {
      Icon: FaHome,
      label: "Home",
      colorClass: "text-google-blue",
      hoverBg: "hover:bg-google-blue/10",
      link: "/admin",
    },
    {
      Icon: FaCalendarAlt,
      label: "Events",
      colorClass: "text-google-red",
      hoverBg: "hover:bg-google-red/10",
      link: "/admin/event",
    },
    {
      Icon: MdPerson,
      label: "Team",
      colorClass: "text-google-green",
      hoverBg: "hover:bg-google-green/10",
      link: "/admin/team",
    },
    {
      Icon: FaGraduationCap,
      label: "Members",
      colorClass: "text-google-yellow",
      hoverBg: "hover:bg-google-yellow/10",
    },
    // {
    //     Icon: FaRoad,
    //     label: "Roadmap",
    //     colorClass: "text-google-blue",
    //     hoverBg: "hover:bg-google-blue/10",
    // },
    {
      Icon: FaMessage,
      label: "Contacts",
      colorClass: "text-google-green",
      hoverBg: "hover:bg-google-green/10",
      link: "/admin/contact",
    },
    {
      Icon: PiWallFill,
      label: "Wall of Fame",
      colorClass: "text-google-red",
      hoverBg: "hover:bg-google-red/10",
      link: "/admin/wall-of-fame",
    },
  ];

  return (
    <>
      {/* --- Mobile Trigger Button --- */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={`
                    fixed top-4 left-4 z-40 p-2 rounded-lg bg-white shadow-md text-slate-600 
                    md:hidden hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-google-blue
                    ${isOpen ? "hidden" : "block"} 
                `}
        aria-label="Open Menu"
      >
        <MdMenu size={24} />
      </button>

      {/* --- Mobile Overlay --- */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* --- Sidebar --- */}
      <aside
        className={`
                    fixed h-screen w-24 bg-white/95 border-r border-slate-200/70 p-3 flex flex-col shadow-lg backdrop-blur-md z-50
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                    md:translate-x-0
                `}
      >
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="md:hidden absolute top-2 right-2 p-1.5 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
        >
          <MdClose size={20} />
        </button>

        <div className="flex items-center justify-center mt-4 md:mt-0">
          <img
            src={GDG_Logo}
            alt="GDG Logo"
            className="h-16 w-16 object-contain select-none"
          />
        </div>

        {/* FIX APPLIED HERE:
                   - overflow-y-auto: Allows scrolling on mobile if menu is tall.
                   - md:overflow-visible: Disables scrolling on desktop so tooltips can float outside the box without being clipped or causing scrollbars.
                */}
        <nav className="mt-6 flex-1 flex flex-col items-center gap-2 overflow-y-auto md:overflow-visible no-scrollbar">
          {navItems.map(({ Icon, label, colorClass, hoverBg, link }) => (
            <button
              key={label}
              type="button"
              onClick={() => {
                setIsOpen(false);
                if (link) navigate(link);
              }}
              className={`group relative w-full h-12 grid place-items-center rounded-xl text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 transition ${hoverBg} disabled:cursor-not-allowed disabled:text-slate-400 disabled:grayscale`}
              disabled={!link}
            >
              <Icon size={22} className={colorClass} />

              {/* Tooltip: 
                                - whitespace-nowrap: Prevents text wrapping 
                                - hidden md:block: Strictly removes it from DOM on mobile
                            */}
              <span className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 z-50 rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white shadow-lg opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 whitespace-nowrap hidden md:block">
                {label}
                {/* Little triangle pointer for the tooltip */}
                <span className="absolute left-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45"></span>
              </span>
            </button>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-center pt-4">
          <button
            type="button"
            onClick={() => navigate("/profile")}
            className="grid place-items-center rounded-full p-1.5 text-google-blue bg-google-blue/10 hover:bg-google-blue/20 transition"
          >
            <MdPerson size={32} />
          </button>
        </div>
      </aside>

      {/* --- Content Spacer --- */}
      <div className="ml-0 md:ml-24 transition-all duration-300"></div>
    </>
  );
};

export default AdminSidebar;
