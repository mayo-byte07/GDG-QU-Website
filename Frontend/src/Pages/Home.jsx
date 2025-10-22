import React from 'react'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HeroSection'
import WhatIsGDGSection from '../Components/WhatisGDGSection'
import TechStackSection from '../Components/TechStackSection'
// import RoadmapSection from '../Components/RoadmapSection'
import FAQSection from '../Components/FAQSection'

const Home = () => {
  return (
    <>
    <Navbar/>
    <HeroSection/>
    <WhatIsGDGSection/>
    <TechStackSection/>
    <FAQSection/>
    </>
  )
}

export default Home