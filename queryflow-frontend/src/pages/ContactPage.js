import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ContactPage = () => {
  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white pt-32 md:pt-40 overflow-x-hidden">
      <Navbar />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pb-40">
        {/* Responsive Header */}
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-[15vw] md:text-[9vw] leading-[0.85] md:leading-[0.8] font-black uppercase italic tracking-tighter w-full break-words mb-16 md:mb-20"
        >
          SECURE <br className="block md:hidden" />
          <span className="text-[#4182ff]">COMMS</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-20">
          
          {/* Left Column: The Form */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="lg:col-span-8 bg-[#131313] p-8 md:p-12 rounded-[2.5rem] border border-white/5"
          >
            <h3 className="text-xl md:text-2xl font-bold mb-8 uppercase tracking-widest text-gray-300">
              Initialize Connection
            </h3>
            
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-black">Operator Name</label>
                  <input type="text" className="bg-[#080808] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#4182ff]/50 transition-colors" placeholder="John Doe" />
                </div>
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-black">Entity / Node</label>
                  <input type="text" className="bg-[#080808] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#4182ff]/50 transition-colors" placeholder="Company Name" />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-black">Secure Relay (Email)</label>
                <input type="email" className="bg-[#080808] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#4182ff]/50 transition-colors" placeholder="operator@entity.com" />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2 font-black">Encrypted Payload (Message)</label>
                <textarea rows="5" className="bg-[#080808] border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#4182ff]/50 transition-colors resize-none" placeholder="State your requirements..." />
              </div>

              <button className="w-full mt-4 px-8 py-5 bg-white text-black font-black uppercase tracking-[0.4em] text-[10px] hover:bg-[#4182ff] hover:text-white transition-all duration-500 rounded-xl">
                Transmit Payload
              </button>
            </form>
          </motion.div>

          {/* Right Column: Terminal Info */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="lg:col-span-4 flex flex-col gap-6"
          >
            {/* Location Node */}
            <div className="bg-[#131313] p-8 rounded-[2rem] border border-white/5">
              <span className="text-[#4182ff] material-symbols-outlined text-3xl mb-4">location_on</span>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">Primary Node</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Bharthia HQ<br/>
                Uttar Pradesh, India<br/>
                Global Deployment Active
              </p>
            </div>

            {/* Direct Link (Updated with your email) */}
            <div className="bg-[#131313] p-8 rounded-[2rem] border border-white/5">
              <span className="text-[#66dd8b] material-symbols-outlined text-3xl mb-4">mail</span>
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">Direct Link</h4>
              <p className="text-gray-500 text-sm leading-relaxed flex flex-col items-start">
                <a href="mailto:tanmaysingh1208@gmail.com" className="hover:text-[#66dd8b] transition-colors">
                  tanmaysingh1208@gmail.com
                </a>
              </p>
            </div>

            {/* System Status */}
            <div className="bg-[#4182ff] p-8 rounded-[2rem] text-black">
              <h4 className="text-sm font-black uppercase tracking-widest mb-2">System Status</h4>
              <div className="flex items-center gap-2 mt-4">
                <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest">All Systems Operational</span>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ContactPage;