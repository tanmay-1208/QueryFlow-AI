import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const SolutionsPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white pt-40">
      <Navbar />
      <div className="max-w-[1400px] mx-auto px-10">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
        >
          <h1 className="text-7xl font-black uppercase italic tracking-tighter">
            Enterprise <span className="text-[#4182ff]">Nodes</span>
          </h1>
          <p className="text-gray-500 mt-4 max-w-xl">Scaled solutions for high-net-worth entities and digital asset managers.</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-10 pb-40"
        >
          {["Institutional Vaults", "Node Management", "Liquidity Analysis", "Compliance API"].map((solution, i) => (
            <motion.div 
              key={i}
              variants={itemVariants}
              whileHover={{ scale: 1.02, borderColor: "#4182ff" }}
              className="p-10 bg-[#131313] border border-white/5 rounded-2xl transition-colors"
            >
              <h3 className="text-2xl font-bold mb-4">{solution}</h3>
              <p className="text-gray-500 text-sm">Professional grade infrastructure built for the next generation of finance.</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      <Footer />
    </div>
  );
};

export default SolutionsPage;