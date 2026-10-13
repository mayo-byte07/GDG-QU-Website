import React from "react";
import HeroSection from "../Components/home/HeroSection";
import WhatIsGDGSection from "../Components/home/WhatisGDGSection";
import TechStackSection from "../Components/home/TechStackSection";
import FAQSection from "../Components/home/FAQSection";

const Home = () => {
  return (
    <>
      <HeroSection />
      <WhatIsGDGSection />
      <TechStackSection />
      <FAQSection />
    </>
  );
};

export default Home;
