import React from "react";
// Corrected imports: No curly braces for default exports
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

/**
 * LandingPage Component
 * This is the "Brain" of the home screen.
 * It assembles the UI/UX components managed by Vivek.
 */
const LandingPage = () => {
  return (
    <div className="bg-[#0e0e0e] min-h-screen flex flex-col selection:bg-[#4182ff] selection:text-white">
      {/* 1. Global Navigation */}
      <Navbar />

      {/* 2. Main Hero Content (UI handled in components/Hero.js) */}
      <main className="flex-1">
        <Hero />
        
        {/* You can add more sections here later, like <FeaturesOverview /> */}
      </main>

      {/* 3. Global Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;