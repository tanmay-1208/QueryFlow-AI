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
    <div className="bg-[#0e0e0e] min-h-screen text-white pt-32 md:pt-40 overflow-x-hidden">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 md:mb-20"
        >
          <h1 className="text-[14vw] md:text-[9vw] leading-[0.85] md:leading-[0.8] font-black uppercase italic tracking-tighter w-full break-words">
            Enterprise <br className="block md:hidden" /><span className="text-[#4182ff]">Nodes</span>
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
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pb-40"
        >
          {["Institutional Vaults", "Node Management", "Liquidity Analysis", "Compliance API"].map((solution, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02, borderColor: "#4182ff", backgroundColor: "#1a1a1a" }}
              className="p-8 md:p-10 bg-[#131313] border border-white/5 rounded-[2rem] md:rounded-2xl transition-all cursor-pointer"
            >
              <h3 className="text-xl md:text-2xl font-bold mb-4 uppercase tracking-tight">{solution}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">Professional grade infrastructure built for the next generation of global finance.</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default SolutionsPage;