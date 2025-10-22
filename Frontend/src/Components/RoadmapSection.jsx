import React, { useState } from 'react';
import {
    FaCode,
    FaMobile,
    FaBrain,
    FaCloud,
    FaShieldAlt,
    FaGitAlt,
    FaLink,
    FaMicrochip,
    FaPalette,
    FaRocket,
    FaArrowLeft
} from 'react-icons/fa';

// Import all roadmap components
import WebDevRoadmap from './roadmaps/WebDevRoadmap';
import MobileDevRoadmap from './roadmaps/MobileDevRoadmap';
// import AImlRoadmap from './roadmaps/AImlRoadmap';
// import CloudRoadmap from './roadmaps/CloudRoadmap';
// import CyberSecurityRoadmap from './roadmaps/CyberSecurityRoadmap';
// import GitGithubRoadmap from './roadmaps/GitGithubRoadmap';
// import BlockchainRoadmap from './roadmaps/BlockchainRoadmap';
// import IoTRoadmap from './roadmaps/IoTRoadmap';
// import DesignRoadmap from './roadmaps/DesignRoadmap';

const RoadmapSection = () => {
    const [selectedRoadmap, setSelectedRoadmap] = useState(null);

    const roadmaps = [
        {
            id: 'web',
            title: 'Web Development',
            icon: <FaCode />,
            color: 'from-blue-500 to-cyan-500',
            component: <WebDevRoadmap />
        },
        {
            id: 'mobile',
            title: 'Mobile Development',
            icon: <FaMobile />,
            color: 'from-green-500 to-emerald-500',
            component: <MobileDevRoadmap />
        },
        // {
        //   id: 'ai-ml',
        //   title: 'AI & ML',
        //   icon: <FaBrain />,
        //   color: 'from-yellow-500 to-orange-500',
        //   component: <AImlRoadmap />
        // },
        // {
        //   id: 'cloud',
        //   title: 'Cloud Computing',
        //   icon: <FaCloud />,
        //   color: 'from-red-500 to-pink-500',
        //   component: <CloudRoadmap />
        // },
        // {
        //   id: 'cyber',
        //   title: 'Cyber Security',
        //   icon: <FaShieldAlt />,
        //   color: 'from-purple-500 to-indigo-500',
        //   component: <CyberSecurityRoadmap />
        // },
        // {
        //   id: 'git',
        //   title: 'Git & GitHub',
        //   icon: <FaGitAlt />,
        //   color: 'from-gray-600 to-gray-800',
        //   component: <GitGithubRoadmap />
        // },
        // {
        //   id: 'blockchain',
        //   title: 'Blockchain',
        //   icon: <FaLink />,
        //   color: 'from-yellow-600 to-orange-600',
        //   component: <BlockchainRoadmap />
        // },
        // {
        //   id: 'iot',
        //   title: 'IoT',
        //   icon: <FaMicrochip />,
        //   color: 'from-teal-500 to-cyan-500',
        //   component: <IoTRoadmap />
        // },
        // {
        //   id: 'design',
        //   title: 'Graphic Design',
        //   icon: <FaPalette />,
        //   color: 'from-pink-500 to-rose-500',
        //   component: <DesignRoadmap />
        // }
    ];

    if (selectedRoadmap) {
        const roadmap = roadmaps.find(r => r.id === selectedRoadmap);
        return (
            <div>
                {/* Back Button */}
                <button
                    onClick={() => setSelectedRoadmap(null)}
                    className="fixed top-24 left-6 z-50 flex items-center space-x-2 bg-white px-4 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
                >
                    <FaArrowLeft />
                    <span>Back to Roadmaps</span>
                </button>
                {roadmap.component}
            </div>
        );
    }

    return (
        <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center space-x-3 bg-blue-50 px-6 py-3 rounded-full border border-blue-200 mb-6">
                        <FaRocket className="text-2xl text-blue-500" />
                        <span className="text-lg font-semibold text-blue-600">Learning Roadmaps</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                        Master Any <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">Tech Stack</span>
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Choose your path and follow our step-by-step roadmaps to become an expert
                    </p>
                </div>

                {/* Roadmap Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {roadmaps.map((roadmap, index) => (
                        <div
                            key={roadmap.id}
                            onClick={() => setSelectedRoadmap(roadmap.id)}
                            className={`group relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-105 cursor-pointer overflow-hidden`}
                        >
                            {/* Background Gradient */}
                            <div className={`absolute inset-0 bg-gradient-to-br opacity-10 group-hover:opacity-20 transition-opacity duration-500 ${roadmap.color}`}></div>

                            {/* Animated Border */}
                            <div className={`absolute inset-0 rounded-3xl border-2 opacity-0 group-hover:opacity-100 transition-all duration-500 ${roadmap.color.replace('bg-gradient-to-br', 'border-gradient-to-br')}`}></div>

                            {/* Content */}
                            <div className="relative z-10">
                                <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br mb-6 flex items-center justify-center text-white text-3xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 ${roadmap.color}`}>
                                    {roadmap.icon}
                                </div>

                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{roadmap.title}</h3>
                                <p className="text-gray-600 mb-6">Complete learning path with projects and resources</p>

                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-gray-500">Click to explore</span>
                                    <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-gradient-to-br group-hover:text-white transition-all duration-300 flex items-center justify-center">
                                        <FaRocket className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                    </div>
                                </div>
                            </div>

                            {/* Floating Elements */}
                            <div className="absolute top-4 right-4 w-4 h-4 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200"></div>
                            <div className="absolute bottom-4 left-4 w-3 h-3 bg-current rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-300"></div>
                        </div>
                    ))}
                </div>

                {/* Footer CTA */}
                <div className="text-center mt-16">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-8 text-white">
                        <h3 className="text-2xl lg:text-3xl font-bold mb-4">Not Sure Where to Start?</h3>
                        <p className="text-lg mb-6 opacity-90">Take our skill assessment quiz to find your perfect tech path</p>
                        <button className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:scale-105 transition-transform duration-300">
                            Take Skill Assessment
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RoadmapSection;