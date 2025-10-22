import React, { useState, useEffect } from 'react';
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
    FaProjectDiagram
} from 'react-icons/fa';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeLink, setActiveLink] = useState('Home');

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            setScrolled(isScrolled);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const colors = {
        blue: '#4285f4',
        green: '#34a853',
        yellow: '#f9ab00',
        red: '#ea4335'
    };

    const navLinks = [
        { name: 'Home', icon: <FaHome />, color: colors.blue },
        { name: 'Team', icon: <FaUsers />, color: colors.green },
        { name: 'Events', icon: <FaCalendarAlt />, color: colors.yellow },
        { name: 'Projects', icon: <FaProjectDiagram />, color: colors.red },
        { name: 'Wall of Fame', icon: <FaTrophy />, color: colors.blue },
        { name: 'Contact Us', icon: <FaEnvelope />, color: colors.green }
    ];

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/95 backdrop-blur-md shadow-lg py-2'
                : 'bg-white/90 backdrop-blur-sm py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    {/* Logo Section */}
                    <div className="flex items-center space-x-2">
                        <div
                            className="relative group cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                                        <span className="text-white font-bold text-lg">G</span>
                                    </div>
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full transform group-hover:scale-150 transition-transform duration-300"></div>
                                    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-red-500 rounded-full transform group-hover:scale-150 transition-transform duration-300"></div>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-xl bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                                        GDG
                                    </span>
                                    <span className="text-xs text-gray-600 -mt-1">Quantum University</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Navigation Links - ICON COLOR FIXED */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={`#${link.name.toLowerCase().replace(' ', '-')}`}
                                className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${activeLink === link.name
                                    ? 'text-white'
                                    : 'text-gray-700'
                                    }`}
                                onMouseEnter={() => setActiveLink(link.name)}
                                onClick={() => setActiveLink(link.name)}
                            >
                                {/* Background with proper z-index */}
                                <div
                                    className={`absolute inset-0 rounded-lg transition-all duration-300 z-0 ${activeLink === link.name ? 'scale-100 opacity-100' : 'scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100'
                                        }`}
                                    style={{ backgroundColor: link.color }}
                                ></div>

                                {/* Content with higher z-index */}
                                <span className="flex items-center space-x-2 relative z-10">
                                    <span
                                        className={`transition-all duration-300 group-hover:scale-110 ${activeLink === link.name
                                            ? 'text-white'
                                            : ''
                                            }`}
                                        style={{
                                            color: activeLink === link.name ? 'white' : link.color
                                        }}
                                    >
                                        {link.icon}
                                    </span>
                                    <span>{link.name}</span>
                                </span>

                                {/* Animated underline - only show when not active */}
                                {activeLink !== link.name && (
                                    <span
                                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 transition-all duration-300 group-hover:w-3/4"
                                        style={{ backgroundColor: link.color }}
                                    ></span>
                                )}
                            </a>
                        ))}
                    </div>

                    {/* Desktop Auth Buttons - ICON COLOR FIXED */}
                    <div className="hidden md:flex items-center space-x-3">
                        <button
                            className="relative px-5 py-2 rounded-full font-medium border-2 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group"
                            style={{
                                borderColor: colors.blue,
                                color: colors.blue
                            }}
                        >
                            {/* Hover background */}
                            <div
                                className="absolute inset-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                                style={{ backgroundColor: colors.blue }}
                            ></div>

                            <span className="flex items-center space-x-2 relative z-10">
                                <FaUser
                                    className="transition-colors duration-300 group-hover:text-white"
                                    style={{ color: 'inherit' }}
                                />
                                <span className="group-hover:text-white transition-colors duration-300">Login</span>
                            </span>
                        </button>

                        <button
                            className="relative px-5 py-2 rounded-full font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden group"
                            style={{ backgroundColor: colors.green }}
                        >
                            {/* Shine effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>

                            <span className="flex items-center space-x-2 relative z-10">
                                <FaUserPlus className="text-white" />
                                <span>Register</span>
                            </span>
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors duration-300"
                            style={{ color: colors.blue }}
                        >
                            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation Menu - ICON COLOR FIXED */}
                {/* Mobile Navigation Menu */}
                <div
                    className={`lg:hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden'
                        }`}
                >
                    <div className="flex flex-col space-y-2">
                        {navLinks.map((link) => (
                            <a
                                key={link.name}
                                href={`#${link.name.toLowerCase().replace(' ', '-')}`}
                                className={`flex items-center space-x-3 p-3 rounded-lg font-medium transition-all duration-300 ${activeLink === link.name
                                        ? 'text-white scale-105'
                                        : 'text-gray-700 hover:scale-105'
                                    }`}
                                style={{
                                    backgroundColor: activeLink === link.name ? link.color : 'transparent'
                                }}
                                onClick={() => {
                                    setActiveLink(link.name);
                                    setIsOpen(false);
                                }}
                            >
                                <span
                                    className="text-xl"
                                    style={{
                                        color: activeLink === link.name ? 'white' : link.color
                                    }}
                                >
                                    {link.icon}
                                </span>
                                <span>{link.name}</span>
                            </a>
                        ))}

                        {/* Auth Buttons */}
                        <div className="pt-3 border-t border-gray-200 flex flex-col space-y-3">
                            <button
                                className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg font-medium border-2 transition-all duration-300 hover:bg-blue-500 hover:text-white active:scale-95"
                                style={{
                                    borderColor: colors.blue,
                                    color: colors.blue
                                }}
                            >
                                <FaUser />
                                <span>Login</span>
                            </button>

                            <button
                                className="w-full flex items-center justify-center space-x-2 p-3 rounded-lg font-medium text-white transition-all duration-300 hover:scale-105 active:scale-95"
                                style={{ backgroundColor: colors.green }}
                            >
                                <FaUserPlus className="text-white" />
                                <span>Register</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default Navbar;