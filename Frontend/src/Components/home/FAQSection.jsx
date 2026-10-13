import React, { useState } from "react";
import {
  FaChevronDown,
  FaChevronUp,
  FaQuestionCircle,
  FaLightbulb,
  FaUsers,
  FaCalendarAlt,
  FaCode,
  FaRocket,
  FaGraduationCap,
  FaHandshake,
  FaStar,
  FaHeart,
} from "react-icons/fa";
import { faqCategories, colors, homeStats as stats } from "../../data/homeData";
import { Link } from "react-router-dom";

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  // Floating animation elements
  const FloatingElement = ({ icon, color, position }) => (
    <div
      className={`absolute ${position} w-8 h-8 rounded-full flex items-center justify-center text-white opacity-20 animate-float`}
      style={{
        backgroundColor: color,
        animationDelay: `${Math.random() * 2}s`,
      }}
    >
      {icon}
    </div>
  );

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement
          icon={<FaCode />}
          color={colors.blue}
          position="top-10 left-10"
        />
        <FloatingElement
          icon={<FaRocket />}
          color={colors.green}
          position="top-20 right-20"
        />
        <FloatingElement
          icon={<FaStar />}
          color={colors.yellow}
          position="bottom-20 left-20"
        />
        <FloatingElement
          icon={<FaHeart />}
          color={colors.red}
          position="bottom-10 right-10"
        />

        {/* Animated Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${colors.blue} 1px, transparent 1px), linear-gradient(90deg, ${colors.blue} 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          ></div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full border border-blue-200 mb-6">
            <FaLightbulb className="text-yellow-500" />
            <span className="text-lg font-semibold text-blue-600">
              Frequently Asked Questions
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Got Questions?{" "}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              We've Got Answers!
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Everything you need to know about GDG community. Can't find an
            answer? Reach out to our team.
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {faqCategories.map((category, categoryIndex) => (
            <div
              key={category.id}
              className="bg-white rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
            >
              {/* Category Header */}
              <div
                className="p-6 rounded-t-3xl text-white flex items-center space-x-4"
                style={{ backgroundColor: category.color }}
              >
                <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-2xl">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                  <p className="text-white/80 text-sm">
                    {category.questions.length} questions
                  </p>
                </div>
              </div>

              {/* Questions List */}
              <div className="p-6 space-y-4">
                {category.questions.map((item, questionIndex) => {
                  const index = categoryIndex * 3 + questionIndex;
                  const isActive = activeIndex === index;

                  return (
                    <div
                      key={questionIndex}
                      className="border border-gray-200 rounded-2xl transition-all duration-300 hover:border-gray-300"
                    >
                      <button
                        onClick={() => toggleQuestion(index)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between focus:outline-none"
                      >
                        <span className="font-semibold text-gray-800 pr-4">
                          {item.question}
                        </span>
                        <div
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300"
                          style={{
                            backgroundColor: isActive
                              ? category.color
                              : "#f3f4f6",
                            color: isActive ? "white" : category.color,
                          }}
                        >
                          {isActive ? (
                            <FaChevronUp size={12} />
                          ) : (
                            <FaChevronDown size={12} />
                          )}
                        </div>
                      </button>

                      <div
                        className={`px-6 transition-all duration-500 overflow-hidden ${
                          isActive
                            ? "max-h-48 pb-4 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="border-t border-gray-100 pt-4">
                          <p className="text-gray-600 leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center transform hover:scale-105 transition-all duration-300"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white text-xl mx-auto mb-3"
                style={{ backgroundColor: stat.color }}
              >
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-8 text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle, white 1px, transparent 1px)`,
                  backgroundSize: "50px 50px",
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">
                Still have questions?
              </h3>
              <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
                Our community leads are here to help you get started and answer
                any questions you might have.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://chat.whatsapp.com/ITrLWCTUV9lEshoRxOwixf"
                  target="_blank"
                  className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:scale-105 transition-transform duration-300 flex items-center justify-center space-x-2"
                >
                  <FaUsers />
                  <span>Join Community Chat</span>
                </a>

                <Link
                  to="/contact"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <FaHandshake />
                  <span>Contact Organizers</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-10px) rotate(120deg); }
          66% { transform: translateY(5px) rotate(240deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default FAQSection;
