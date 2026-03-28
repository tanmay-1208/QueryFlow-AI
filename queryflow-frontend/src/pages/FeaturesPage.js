import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const FeaturesPage = () => (
  <div className="bg-[#0e0e0e] min-h-screen pt-40 text-white">
    <Navbar />
    <div className="max-w-[1400px] mx-auto px-10 pb-40">
      <h1 className="text-6xl md:text-[100px] font-black font-['Manrope'] tracking-tighter mb-20">Precision<br/><span className="text-[#adc7ff]">Architecture</span></h1>
      
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Feature 1 */}
        <div className="bg-[#1c1b1b] p-12 rounded-[3rem] border border-white/5">
          <span className="material-symbols-outlined text-[#4182ff] mb-6 text-4xl">analytics</span>
          <h3 className="text-2xl font-black mb-4">Real-time SKU Indexing</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Our proprietary engine calculates asset depreciation and market fluctuations with 4ms latency. Your balance sheet is never more than a second out of sync.</p>
        </div>

        {/* Feature 2 */}
        <div className="bg-[#1c1b1b] p-12 rounded-[3rem] border border-white/5">
          <span className="material-symbols-outlined text-[#66dd8b] mb-6 text-4xl">psychology</span>
          <h3 className="text-2xl font-black mb-4">CFO AI Advisor</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Integrated natural language processing allows you to query your fiscal data. Ask "What is my net profit if I liquidate 20% of Asset X?" and get instant answers.</p>
        </div>

        {/* Feature 3 */}
        <div className="bg-[#1c1b1b] p-12 rounded-[3rem] border border-white/5">
          <span className="material-symbols-outlined text-[#fbbc00] mb-6 text-4xl">account_balance_wallet</span>
          <h3 className="text-2xl font-black mb-4">Automated Tax Provisioning</h3>
          <p className="text-gray-500 text-sm leading-relaxed">Automatically set aside reserves for GST/VAT and capital gains taxes based on regional jurisdiction. No more surprises during fiscal year-end.</p>
        </div>
      </div>
    </div>
    <motion.div 
  initial={{ opacity: 0, x: -50 }}
  whileInView={{ opacity: 1, x: 0 }}
  viewport={{ once: true }} // Only animate once
  transition={{ duration: 0.6 }}
  className="feature-card"
>
  <h3>Audit Intelligence</h3>
  <p>Real-time CA analysis of your stock and assets.</p>
</motion.div>
    <Footer />
  </div>
);

export default FeaturesPage;