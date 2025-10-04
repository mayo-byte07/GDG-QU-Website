import React, { useState, useEffect, useRef } from 'react';
import {
    FaGraduationCap,
    FaHandshake,
    FaUsers,
    FaRocket,
    FaLightbulb,
    FaGlobe,
    FaCode,
    FaCloud,
    FaAndroid,
    FaChartLine,
    FaCalendarAlt
} from 'react-icons/fa';

const WhatIsGDGSection = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const sectionRef = useRef(null);

    const colors = {
        blue: '#4285f4',
        green: '#34a853',
        yellow: '#f9ab00',
        red: '#ea4335'
    };

    // Window resize handler
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Intersection Observer
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.1 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const isMobile = windowWidth < 768;
    const isTablet = windowWidth >= 768 && windowWidth < 1024;

    const cards = [
        {
            icon: <FaGraduationCap />,
            title: 'Learning',
            description: 'Hands-on workshops and tech talks on Google technologies.',
            color: colors.blue,
        },
        {
            icon: <FaHandshake />,
            title: 'Networking',
            description: 'Connect with peers and build professional relationships.',
            color: colors.green,
        },
        {
            icon: <FaUsers />,
            title: 'Community',
            description: 'Inclusive environment for everyone from beginners to experts.',
            color: colors.yellow,
        }
    ];

    const techStack = [
        { icon: <FaAndroid />, name: 'Android', color: colors.green },
        { icon: <FaCode />, name: 'Web', color: colors.blue },
        { icon: <FaCloud />, name: 'Cloud', color: colors.yellow },
        { icon: <FaLightbulb />, name: 'AI/ML', color: colors.red },
    ];

    // Simplified mobile illustration
    const MobileIllustration = () => (
        <div className="relative h-64 w-full flex items-center justify-center mb-8">
            {/* Central Logo */}
            <div className="relative z-10">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">G</span>
                </div>
            </div>

            {/* Tech Icons Grid */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-2 gap-6">
                    {techStack.map((tech, index) => (
                        <div
                            key={tech.name}
                            className="flex flex-col items-center justify-center animate-fade-in"
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md"
                                style={{ backgroundColor: tech.color }}
                            >
                                {tech.icon}
                            </div>
                            <span className="text-xs mt-1 text-gray-600 font-medium">{tech.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Animated Border */}
            <div className="absolute inset-0 border-4 border-dashed border-blue-200 rounded-3xl animate-pulse"></div>
        </div>
    );

    // Desktop Illustration
    const DesktopIllustration = () => (
        <div className="relative h-96 w-full flex items-center justify-center">
            {/* Orbit Rings */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-64 h-64 rounded-full border-2 border-blue-200 animate-spin-slow"></div>
                <div className="w-80 h-80 rounded-full border-2 border-green-200 animate-spin-medium" style={{ animationDirection: 'reverse' }}></div>
            </div>

            {/* Central Logo */}
            <div className="relative z-10">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-2xl">
                    <span className="text-white font-bold text-4xl">GDG</span>
                </div>
            </div>

            {/* Floating Tech Icons */}
            {techStack.map((tech, index) => {
                const radius = 120;
                const angle = (index * 360) / techStack.length;
                const x = radius * Math.cos((angle * Math.PI) / 180);
                const y = radius * Math.sin((angle * Math.PI) / 180);

                return (
                    <div
                        key={tech.name}
                        className="absolute animate-float"
                        style={{
                            left: `calc(50% + ${x}px)`,
                            top: `calc(50% + ${y}px)`,
                            animationDelay: `${index * 0.5}s`,
                        }}
                    >
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg"
                            style={{ backgroundColor: tech.color }}
                        >
                            {tech.icon}
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <section
            ref={sectionRef}
            className="py-12 px-4 sm:px-6 lg:px-8 bg-white"
            id="what-is-gdg"
        >
            <div className="max-w-6xl mx-auto">

                {/* Header Section */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-200 mb-4">
                        <FaRocket className="text-blue-500" />
                        <span className="text-sm font-medium text-blue-600">About GDG</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        What is{' '}
                        <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                            Google Developer Groups?
                        </span>
                    </h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        A global community of developers passionate about Google's technologies
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Illustration Section */}
                    <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>
                        {isMobile ? <MobileIllustration /> : <DesktopIllustration />}
                    </div>

                    {/* Content Section */}
                    <div className={`space-y-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                        }`}>

                        {/* Description */}
                        <div className="prose prose-lg">
                            <p className="text-gray-600 leading-relaxed">
                                <strong>Google Developer Groups (GDG)</strong> are community-led groups for developers
                                interested in Google's developer technology. From Android to Firebase, Google Cloud
                                to Machine Learning, our community organizes workshops, study jams, and speaker sessions.
                            </p>
                        </div>

                        {/* What We Do Cards */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center space-x-2">
                                <FaLightbulb className="text-yellow-500" />
                                <span>What We Do:</span>
                            </h3>

                            <div className="space-y-4">
                                {cards.map((card, index) => (
                                    <div
                                        key={card.title}
                                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:shadow-md transition-shadow duration-300"
                                    >
                                        <div
                                            className="w-12 h-12 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                                            style={{ backgroundColor: card.color }}
                                        >
                                            {card.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1" style={{ color: card.color }}>
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

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                className="flex items-center justify-center space-x-2 px-6 py-3 bg-green-500 text-white rounded-full font-semibold hover:bg-green-600 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <FaUsers />
                                <span>Join Community</span>
                            </button>

                            <button
                                className="flex items-center justify-center space-x-2 px-6 py-3 border-2 border-blue-500 text-blue-500 rounded-full font-semibold hover:bg-blue-500 hover:text-white transition-all duration-300"
                            >
                                <FaCalendarAlt />
                                <span>View Events</span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                            {[
                                { number: '500+', label: 'Members' },
                                { number: '50+', label: 'Events' },
                                { number: '100+', label: 'Projects' }
                            ].map((stat, index) => (
                                <div key={stat.label} className="text-center">
                                    <div className="text-2xl font-bold text-gray-900">{stat.number}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Custom Animations */}
            <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-medium {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
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

        /* Mobile-specific adjustments */
        @media (max-width: 768px) {
          .prose-lg {
            font-size: 1rem;
            line-height: 1.6;
          }
        }
      `}</style>
        </section>
    );
};

export default WhatIsGDGSection;