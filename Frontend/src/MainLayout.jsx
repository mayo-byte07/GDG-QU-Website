import React from 'react'
import Navbar from './Components/Navbar'
import { Outlet } from 'react-router-dom'
import Footer from './Components/FooterSection'

const MainLayout = () => {
  return (
    <div>
      <Navbar/>
      <div style={{ height: `var(--navbar-height, 70px)` }} className="w-full"></div>
      <Outlet/>
      <Footer/>
    </div>
  )
}

export default MainLayout