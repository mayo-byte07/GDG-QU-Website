import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaBook,
  FaBrain,
  FaCode,
  FaMobile,
  FaRocket,
  FaUser,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { techStacks } from "../../data/homeData";

const TechStackSection = () => {
  const [visibleSections, setVisibleSections] = useState([]);

  useEffect(() => {
    const observers = [];
    const options = {
      threshold: 0,
      rootMargin: "0px 0px -100px 0px",
    };

    techStacks.forEach((tech) => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) =>
              prev.includes(tech.id) ? prev : [...prev, tech.id]
            );
          }
        });
      }, options);

      const element = document.getElementById(`tech-${tech.id}`);
      if (element) {
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, []);

  const TechIllustration = ({ tech, isLeft }) => {
    const [isHovered, setIsHovered] = useState(false);

    const getIllustration = () => {
      switch (tech.id) {
        case 1:
          return (
            <div className="relative w-full h-64">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`transform transition-all duration-1000 ${
                    isLeft ? "rotate-12" : "-rotate-12"
                  } ${isHovered ? "scale-110" : "scale-100"}`}
                >
                  <div className="w-32 h-32 bg-blue-100 rounded-2xl rotate-45 flex items-center justify-center">
                    <div className="w-24 h-24 bg-blue-200 rounded-xl -rotate-45 flex items-center justify-center">
                      <FaCode className="text-3xl text-blue-500" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 left-4 w-8 h-8 bg-blue-300 rounded-full animate-bounce"></div>
                <div
                  className="absolute bottom-4 right-4 w-6 h-6 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.5s" }}
                ></div>
              </div>
            </div>
          );
        case 2:
          return (
            <div className="relative w-full h-64">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`transform transition-all duration-1000 ${
                    isHovered ? "scale-105 rotate-3" : "scale-100"
                  }`}
                >
                  <div className="w-28 h-48 bg-green-100 rounded-3xl border-4 border-green-300 flex items-center justify-center">
                    <div className="w-20 h-32 bg-white rounded-lg flex items-center justify-center">
                      <FaMobile className="text-2xl text-green-500" />
                    </div>
                  </div>
                </div>
                <div className="absolute top-8 right-8 w-4 h-4 bg-green-400 rounded animate-pulse"></div>
                <div
                  className="absolute bottom-8 left-8 w-3 h-3 bg-green-500 rounded animate-pulse"
                  style={{ animationDelay: "0.3s" }}
                ></div>
              </div>
            </div>
          );
        case 3:
          return (
            <div className="relative w-full h-64">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`transform transition-all duration-1000 ${
                    isHovered ? "scale-110" : "scale-100"
                  }`}
                >
                  <div className="w-36 h-36 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-24 h-24 bg-yellow-200 rounded-full flex items-center justify-center">
                      <FaBrain className="text-3xl text-yellow-600" />
                    </div>
                  </div>
                </div>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="absolute w-4 h-4 bg-yellow-400 rounded-full animate-pulse"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${30 + (i % 2) * 40}%`,
                      animationDelay: `${i * 0.2}s`,
                    }}
                  ></div>
                ))}
              </div>
            </div>
          );
        default:
          return (
            <div className="relative w-full h-64 flex items-center justify-center">
              <div
                className={`w-32 h-32 rounded-2xl flex items-center justify-center transform transition-all duration-1000 ${
                  isHovered ? "scale-110 rotate-12" : "scale-100"
                }`}
                style={{ backgroundColor: `${tech.color}20` }}
              >
                <span className="text-4xl" style={{ color: tech.color }}>
                  {tech.icon}
                </span>
              </div>
            </div>
          );
      }
    };

    return (
      <div
        className="relative h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {getIllustration()}
      </div>
    );
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 lg:bg-gradient-to-br lg:from-gray-50 lg:to-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full border border-blue-200 mb-4">
            <FaRocket className="text-blue-500" />
            <span className="text-lg font-medium text-blue-600">
              Tech Stack
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
              Tech Domains
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Dive deep into various technology domains with expert guidance and
            comprehensive resources
          </p>
        </div>

        <div className="space-y-32">
          {techStacks.map((tech, index) => {
            const isLeft = index % 2 === 0;
            const isVisible = visibleSections.includes(tech.id);

            return (
              <div
                key={tech.id}
                id={`tech-${tech.id}`}
                className={`shadow-lg p-5 rounded-2xl bg-white lg:shadow-none lg:bg-transparent lg:p-0 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center transition-all duration-1000 ${
                  isVisible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-20 opacity-0"
                }`}
              >
                <div
                  className={`space-y-6 ${
                    isLeft ? "lg:order-1" : "lg:order-2"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white"
                      style={{
                        backgroundColor: tech.color,
                      }}
                    >
                      {tech.icon}
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900">
                      {tech.title}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-600 leading-relaxed">
                    {tech.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tech.cards.map((card, cardIndex) => (
                      <div
                        key={cardIndex}
                        className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
                      >
                        <h4 className="font-semibold text-gray-900 mb-2">
                          {card.title}
                        </h4>
                        <p className="text-sm text-gray-600">{card.desc}</p>
                      </div>
                    ))}
                  </div>

                  <Link
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full font-semibold text-white transition-all duration-300 hover:scale-105"
                    style={{ backgroundColor: tech.color }}
                    to="/team"
                  >
                    <FaUser />
                    <span>{tech.facilitator}</span>
                    <FaArrowRight className="transform group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>

                  <div className="pt-4">
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                      <FaBook />
                      <span>Learning Resources</span>
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {tech.resources.map((resource, resIndex) => (
                        <a
                          key={resIndex}
                          href={resource.link}
                          className="flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-300"
                        >
                          <span
                            style={{
                              color: tech.color,
                            }}
                          >
                            {resource.icon}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {resource.name}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={isLeft ? "lg:order-2" : "lg:order-1"}>
                  <TechIllustration tech={tech} isLeft={isLeft} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-blue-500 to-green-500 rounded-3xl p-8 text-white">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">
              Ready to Start Your Tech Journey?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Join our community and get access to all tech domains with expert
              guidance
            </p>
            <a
              href="https://gdg.community.dev/gdg-on-campus-quantum-university-roorkee-india/"
              target="_blank"
              className="px-8 py-3 bg-white text-blue-600 rounded-full font-semibold hover:scale-105 transition-transform duration-300"
            >
              Join Community Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
