import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FeaturesPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-6 pb-40">
      <h1 className="text-6xl md:text-[100px] font-black tracking-tighter mb-20">Precision<br/><span className="text-[#adc7ff]">Architecture</span></h1>
      <div className="bg-[#1c1b1b] p-16 rounded-[4rem] border border-white/5">
        <h3 className="text-5xl font-black mb-6">Real-time Valuation</h3>
        <p className="text-gray-400 text-xl leading-relaxed">SKU Latency: 4ms. Integrity: Absolute.</p>
      </div>
    </div>
    <Footer />
  </div>
);

export default FeaturesPage;