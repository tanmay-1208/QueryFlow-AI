import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SolutionsPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-[#080A0F] min-h-screen text-white pt-32 md:pt-40 overflow-x-hidden">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-20"
        >
          <h1 className="text-[14vw] md:text-[9vw] leading-[0.85] md:leading-[0.8] font-black uppercase italic tracking-tighter w-full break-words">
            Enterprise <br className="block md:hidden" /><span className="text-[#C9A84C]">Nodes</span>
          </h1>
          <p className="text-gray-500 mt-6 md:mt-4 max-w-xl text-sm md:text-base">
            Scaled solutions for high-net-worth entities and digital asset managers.
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-6 md:p-10 pb-20"
        >
          {[
            { title: "Institutional Vaults", desc: "Multi-signature corporate treasury management with automated sweeps. Safely manage liquidity across fiat and digital assets with instant sub-millisecond execution.", metric: "$4B+ Secued", color: "#4182ff" },
            { title: "Node Management", desc: "Dedicated high-throughput indexing nodes isolated completely for your organization. Ensures 99.999% uptime and zero rate-limiting during high-volatility events.", metric: "128 Nodes", color: "#66dd8b" },
            { title: "Liquidity Analysis", desc: "Real-time macro-economic forecasting and predictive cashflow models powered by our proprietary financial AI. Maximize yield while minimizing counterparty risk.", metric: "Real-time AI", color: "#fbbc00" },
            { title: "Compliance API", desc: "Direct reporting bridges to global regulators. Automatically parse, categorize, and export transaction histories in SEC and FINRA compliant formats instantly.", metric: "0 Reporting Errors", color: "#8b5cf6" }
          ].map((solution, i) => (
             <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02, backgroundColor: "#1a1a1a" }}
              className="p-8 md:p-12 bg-[#0D1117] border border-white/5 rounded-[2rem] md:rounded-[3rem] transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500" style={{backgroundColor: solution.color}}></div>
              <div className="flex justify-between items-start mb-8 gap-4">
                <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight italic" style={{color: solution.color}}>{solution.title}</h3>
                <span className="text-xs md:text-sm font-mono px-4 py-2 rounded-full border border-white/10 bg-black/50 backdrop-blur-md">
                  {solution.metric}
                </span>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">{solution.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Use Cases Section */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="pb-40"
        >
           <h2 className="text-3xl md:text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-12 text-center">Industry <span className="text-gray-500">Applications</span></h2>
           
           <div className="flex flex-col gap-6">
              {[
                { industry: "Hedge Funds & PE", details: "Consolidate limited partner reporting, real-time portfolio analytics, and automated tax harvesting rulesets.", active: true },
                { industry: "Fintech Startups", details: "End the month-end close nightmare. Automated burn rate calculation, runaway monitoring, and seamless vendor invoice parsing.", active: false },
                { industry: "Family Offices", details: "Multi-generational wealth tracking, estate synchronization, and comprehensive yield calculations on diverse asset classes.", active: false }
              ].map((caseItem, idx) => (
                 <div key={idx} className={`glass p-8 md:p-6 md:p-10 rounded-[2rem] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer border ${caseItem.active ? 'border-[#C9A84C]/50 bg-[#4182ff]/5' : 'border-white/5 hover:border-white/20'}`}>
                    <div className="flex-1">
                      <h3 className="text-2xl font-black uppercase tracking-tighter mb-2 text-white">{caseItem.industry}</h3>
                      <p className="text-gray-400 text-sm md:text-base">{caseItem.details}</p>
                    </div>
                    <div className="hidden md:block">
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center border ${caseItem.active ? 'border-[#C9A84C] bg-[#4182ff]/20' : 'border-white/10 bg-black/50'}`}>
                          <span className={caseItem.active ? "text-[#C9A84C]" : "text-gray-500"}>→</span>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default SolutionsPage;