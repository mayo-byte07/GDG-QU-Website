import React, { useEffect } from "react";
import Navbar from "./Components/Navbar";
import { Outlet, useLocation } from "react-router-dom";
import Footer from "./Components/FooterSection";

const MainLayout = () => {
  // scroll to top on route change
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div>
      <Navbar />
      <div
        style={{ height: `var(--navbar-height, 70px)` }}
        className="w-full"
      ></div>
      <Outlet />
      <Footer />
    </div>
  );
};

export default MainLayout;
