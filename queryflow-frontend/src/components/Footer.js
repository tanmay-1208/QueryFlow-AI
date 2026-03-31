import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // System logs for the scrolling marquee
  const systemLogs = [
    "GATEWAY_READY", 
    "NODE_01_ACTIVE", 
    "ENCRYPTION_LAYER_AES256", 
    "SSL_HANDSHAKE_COMPLETE", 
    "QUERY_ENGINE_IDLE", 
    "VAULT_SYNC_100%",
    "DB_LATENCY_3MS",
    "AUTH_PROTOCOL_ESTABLISHED"
  ];

  return (
    <footer className="w-full bg-[#080808] border-t border-white/5 pt-24 pb-12 px-6 md:px-12 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        
        {/* --- TOP SECTION: LIVE SYSTEM FEED --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-24">
          <div className="w-full md:w-auto">
            <h4 className="text-[10px] font-black uppercase tracking-[0.5em] text-[#4182ff] mb-6">
              Live System Status
            </h4>
            {/* The scrolling marquee container */}
            <div className="relative w-full md:w-[400px] bg-white/5 p-5 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm">
              <div className="flex gap-12 animate-marquee whitespace-nowrap">
                {/* Double the array to make the loop seamless */}
                {[...systemLogs, ...systemLogs].map((log, i) => (
                  <span key={i} className="text-[9px] font-mono text-gray-500 tracking-tighter">
                    [{log}]
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="md:text-right">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[6vw] md:text-[4vw] font-black tracking-tighter text-white leading-none uppercase italic"
            >
              Terminal <span className="text-[#4182ff]">Active</span>
            </motion.p>
            <p className="font-mono text-[10px] md:text-xs text-gray-600 mt-4 tracking-[0.3em] uppercase">
              {time} // BHARTHIA_NODE_PRIMARY
            </p>
          </div>
        </div>

        {/* --- BOTTOM SECTION: BRUTALIST LINKS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/5 pt-12">
          {/* Column 1 */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-4">Navigation</span>
            <Link to="/features" className="text-[11px] uppercase font-black text-white hover:text-[#4182ff] transition-colors tracking-widest italic">Features</Link>
            <Link to="/solutions" className="text-[11px] uppercase font-black text-white hover:text-[#4182ff] transition-colors tracking-widest italic">Solutions</Link>
            <Link to="/pricing" className="text-[11px] uppercase font-black text-white hover:text-[#4182ff] transition-colors tracking-widest italic">Pricing</Link>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-3">
            <span className="text-[10px] font-black text-gray-700 uppercase tracking-[0.4em] mb-4">Security</span>
            <Link to="/security" className="text-[11px] uppercase font-black text-white hover:text-[#4182ff] transition-colors tracking-widest italic">Vault Protocol</Link>
            <a href="https://github.com/tanmay-1208" target="_blank" rel="noreferrer" className="text-[11px] uppercase font-black text-white hover:text-[#4182ff] transition-colors tracking-widest italic">Source Code</a>
          </div>

          {/* Column 3 & 4: Copyright & Branding */}
          <div className="col-span-2 flex flex-col md:items-end justify-end">
            <div className="text-right">
               <h2 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">
                 Query<span className="text-[#4182ff]">Flow</span>
               </h2>
               <p className="text-[9px] font-black text-gray-700 uppercase tracking-[0.5em] leading-relaxed">
                 © 2026 // Institutional Fiscal Synthesis <br/> 
                 All Rights Reserved
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* --- INLINE STYLES FOR MARQUEE ANIMATION --- */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </footer>
  );
}