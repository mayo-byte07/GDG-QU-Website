import React, { useState, useEffect } from 'react';
import {
    FaCode,
    FaHtml5,
    FaCss3Alt,
    FaJs,
    FaReact,
    FaNodeJs,
    FaDatabase,
    FaRocket,
    FaCheck,
    FaArrowRight,
    FaClock,
    FaBook,
    FaProjectDiagram,
    FaGraduationCap,
    FaStar,
    FaFire,
    FaPalette,
    FaMobile,
    FaServer,
    FaCloud
} from 'react-icons/fa';

const MobileDevRoadmap = () => {
    const [currentStage, setCurrentStage] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [hoveredStage, setHoveredStage] = useState(null);

    const colors = {
        primary: '#4285f4',
        secondary: '#34a853',
        accent: '#f9ab00',
        danger: '#ea4335'
    };

    const stages = [
        {
            id: 1,
            title: "📱 Mobile Fundamentals",
            subtitle: "Platform Basics",
            duration: "1-2 Months",
            icon: <FaMobile />,
            color: "#34D399",
            skills: ["Dart/Java/Kotlin", "Mobile UI Principles", "Basic Layouts", "Git"],
            projects: ["Calculator App", "Weather App", "Notes App"],
            resources: [
                { name: "Flutter Docs", icon: "💙", link: "https://flutter.dev" },
                { name: "React Native", icon: "⚛️", link: "https://reactnative.dev" },
                { name: "Android Developers", icon: "🤖", link: "https://developer.android.com" }
            ],
            tips: ["Choose Flutter or React Native", "Practice mobile UI patterns", "Learn platform guidelines"]
        },
        {
            id: 2,
            title: "🎯 UI/UX Development",
            subtitle: "Mobile Interfaces",
            duration: "2-3 Months",
            icon: <FaPalette />,
            color: "#FBBF24",
            skills: ["Widgets/Components", "Navigation", "State Management", "Animations"],
            projects: ["E-commerce App", "Social Media App", "Fitness Tracker"],
            resources: [
                { name: "Flutter Widgets", icon: "🧩", link: "https://flutter.dev/widgets" },
                { name: "React Native Elements", icon: "🔗", link: "https://reactnativeelements.com" },
                { name: "Material Design", icon: "🎨", link: "https://material.io" }
            ],
            tips: ["Master navigation patterns", "Learn state management", "Practice smooth animations"]
        },
        {
            id: 3,
            title: "🔗 Advanced Features",
            subtitle: "Device Integration",
            duration: "2-3 Months",
            icon: <FaCloud />,
            color: "#60A5FA",
            skills: ["API Integration", "Local Storage", "Camera/GPS", "Push Notifications"],
            projects: ["Ride-sharing App", "Food Delivery", "Photo Editing App"],
            resources: [
                { name: "Firebase", icon: "🔥", link: "https://firebase.google.com" },
                { name: "API Integration", icon: "🔌", link: "https://rapidapi.com" },
                { name: "Device APIs", icon: "📱", link: "https://developer.mozilla.org" }
            ],
            tips: ["Practice API integration", "Learn local database", "Master device features"]
        },
        {
            id: 4,
            title: "🚀 Production Ready",
            subtitle: "App Store Deployment",
            duration: "1-2 Months",
            icon: <FaRocket />,
            color: "#F472B6",
            skills: ["Testing", "Performance", "App Store Deployment", "Monitoring"],
            projects: ["Published App", "App Store Optimization", "User Analytics"],
            resources: [
                { name: "App Store Guide", icon: "🏪", link: "https://developer.apple.com" },
                { name: "Google Play", icon: "▶️", link: "https://play.google.com/console" },
                { name: "App Analytics", icon: "📊", link: "https://analytics.google.com" }
            ],
            tips: ["Learn app store guidelines", "Master testing strategies", "Optimize app performance"]
        }
    ];

    useEffect(() => {
        setIsVisible(true);
        const interval = setInterval(() => {
            setCurrentStage((prev) => (prev + 1) % stages.length);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const ProgressRing = ({ stage, index, isActive }) => {
        const circumference = 2 * Math.PI * 40;
        const strokeDashoffset = circumference - (currentStage >= index ? circumference : 0);

        return (
            <div className="relative">
                <svg className="w-24 h-24 transform rotate-[-90deg]">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        className="text-gray-200"
                    />
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="text-blue-500 transition-all duration-1000 ease-out"
                        style={{ color: stage.color }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className={`w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 ${isActive ? 'scale-110 rotate-12' : 'scale-100'
                            }`}
                        style={{ backgroundColor: stage.color }}
                    >
                        {stage.icon}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Animated Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200 shadow-lg mb-6">
                        <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                            Mobile Development Journey
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
                        From <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Zero</span> to{' '}
                        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Hero</span>
                    </h1>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Your complete path to becoming a full-stack developer with modern technologies and real-world projects
                    </p>
                </div>

                {/* Main Roadmap Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Left Side - Interactive Timeline */}
                    <div className="space-y-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/20">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
                                <FaGraduationCap className="text-blue-500" />
                                <span>Learning Path Timeline</span>
                            </h2>

                            <div className="space-y-6">
                                {stages.map((stage, index) => (
                                    <div
                                        key={stage.id}
                                        className={`group relative p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer ${currentStage === index
                                                ? 'border-blue-500 bg-blue-50/50 scale-105 shadow-lg'
                                                : 'border-gray-200/50 bg-white/50 hover:scale-102'
                                            }`}
                                        onClick={() => setCurrentStage(index)}
                                        onMouseEnter={() => setHoveredStage(index)}
                                        onMouseLeave={() => setHoveredStage(null)}
                                    >
                                        {/* Progress Indicator */}
                                        <div className="flex items-center space-x-4">
                                            <div className="relative">
                                                <div className={`w-3 h-3 rounded-full transition-all duration-300 ${currentStage >= index ? 'scale-150' : 'scale-100'
                                                    }`} style={{
                                                        backgroundColor: currentStage >= index ? stage.color : '#d1d5db'
                                                    }}></div>
                                                {index < stages.length - 1 && (
                                                    <div className={`absolute top-3 left-1 w-0.5 h-8 transition-all duration-500 ${currentStage > index ? 'scale-y-100' : 'scale-y-0'
                                                        }`} style={{
                                                            backgroundColor: stage.color,
                                                            transformOrigin: 'top'
                                                        }}></div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className={`text-lg font-semibold transition-all duration-300 ${currentStage === index ? 'text-gray-900 scale-105' : 'text-gray-700'
                                                        }`}>
                                                        {stage.title}
                                                    </h3>
                                                    <span className="text-sm text-gray-500 flex items-center space-x-1">
                                                        <FaClock className="text-xs" />
                                                        <span>{stage.duration}</span>
                                                    </span>
                                                </div>

                                                <p className="text-sm text-gray-600 mb-3">{stage.subtitle}</p>

                                                <div className="flex flex-wrap gap-2">
                                                    {stage.skills.slice(0, 3).map((skill, i) => (
                                                        <span
                                                            key={i}
                                                            className="px-2 py-1 bg-white/80 rounded-full text-xs font-medium border border-gray-200/50"
                                                            style={{ color: stage.color }}
                                                        >
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    {stage.skills.length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                                            +{stage.skills.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Stage Number */}
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${currentStage === index ? 'scale-110' : 'scale-100'
                                                    }`}
                                                style={{ backgroundColor: stage.color }}
                                            >
                                                {index + 1}
                                            </div>
                                        </div>

                                        {/* Hover Effect */}
                                        {hoveredStage === index && currentStage !== index && (
                                            <div
                                                className="absolute inset-0 rounded-2xl opacity-10 transition-opacity duration-300"
                                                style={{ backgroundColor: stage.color }}
                                            ></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Overall Progress */}
                            <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/10 to-green-500/10 rounded-xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                                    <span className="text-sm font-bold text-blue-600">{Math.round(((currentStage + 1) / stages.length) * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${((currentStage + 1) / stages.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Current Stage Details */}
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-white to-blue-50/30 rounded-3xl p-8 shadow-2xl border border-white/20">
                            {/* Stage Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <div className="flex items-center space-x-3 mb-2">
                                        <div
                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg"
                                            style={{ backgroundColor: stages[currentStage].color }}
                                        >
                                            {stages[currentStage].icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900">{stages[currentStage].title}</h2>
                                            <p className="text-gray-600">{stages[currentStage].subtitle}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Duration</div>
                                    <div className="text-lg font-bold text-gray-900">{stages[currentStage].duration}</div>
                                </div>
                            </div>

                            {/* Skills Grid */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                    <FaStar className="text-yellow-500" />
                                    <span>Skills to Master</span>
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {stages[currentStage].skills.map((skill, index) => (
                                        <div key={index} className="flex items-center space-x-2 p-3 bg-white/50 rounded-lg border border-gray-200/50">
                                            <FaCheck className="text-green-500 text-sm" />
                                            <span className="text-sm font-medium text-gray-700">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Projects */}
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                    <FaProjectDiagram className="text-purple-500" />
                                    <span>Hands-on Projects</span>
                                </h3>
                                <div className="space-y-2">
                                    {stages[currentStage].projects.map((project, index) => (
                                        <div key={index} className="flex items-center space-x-3 p-3 bg-white/30 rounded-lg">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                            <span className="text-gray-700">{project}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Resources */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                    <FaBook className="text-red-500" />
                                    <span>Learning Resources</span>
                                </h3>
                                <div className="space-y-2">
                                    {stages[currentStage].resources.map((resource, index) => (
                                        <a
                                            key={index}
                                            href={resource.link}
                                            className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/80 transition-all duration-300 group border border-gray-200/50"
                                        >
                                            <div className="flex items-center space-x-3">
                                                <span className="text-lg">{resource.icon}</span>
                                                <span className="font-medium text-gray-700">{resource.name}</span>
                                            </div>
                                            <FaArrowRight className="text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all duration-300" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Pro Tips Card */}
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 shadow-lg border border-yellow-200/50">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                <FaFire className="text-orange-500" />
                                <span>Pro Tips for This Stage</span>
                            </h3>
                            <ul className="space-y-2">
                                {stages[currentStage].tips.map((tip, index) => (
                                    <li key={index} className="flex items-center space-x-3 text-sm text-gray-700">
                                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA Button */}
                        <button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-3">
                            <FaRocket />
                            <span>Start {stages[currentStage].title.split(' ')[1]} Stage</span>
                        </button>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <div className="flex justify-center mt-12 space-x-4">
                    {stages.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentStage(index)}
                            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white transition-all duration-500 ${currentStage === index
                                    ? 'scale-110 shadow-lg'
                                    : 'scale-100 opacity-70 hover:opacity-100'
                                }`}
                            style={{
                                backgroundColor: stages[index].color,
                                transform: currentStage === index ? 'rotate(360deg)' : 'rotate(0deg)'
                            }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
            </div>
        </div>
    );
};

export default MobileDevRoadmap;