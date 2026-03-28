import React from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function Navbar() {
  const location = useLocation();

  // Navigation Links
  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "Solutions", path: "/solutions" },
    { name: "Pricing", path: "/pricing" },
    { name: "Security", path: "/security" },
  ];

  return (
    <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-6">
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[1200px] bg-black/40 backdrop-blur-xl border border-white/10 py-3 px-8 rounded-full flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-[#4182ff] rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500 flex items-center justify-center">
            <div className="-rotate-45 group-hover:-rotate-90 transition-transform duration-500 text-white font-black text-xs">Q</div>
          </div>
          <span className="font-black text-xl tracking-tighter uppercase text-white">
            Query<span className="text-[#4182ff]">Flow</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-colors hover:text-[#4182ff] ${
                location.pathname === link.path ? "text-[#4182ff]" : "text-gray-400"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-4">
          <Link 
            to="/login" 
            className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#4182ff] transition-colors"
          >
            Sign In
          </Link>
          <Link to="/login">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#4182ff] text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(65,130,255,0.3)] hover:shadow-[0_0_30px_rgba(65,130,255,0.5)] transition-all"
            >
              Deploy Node
            </motion.button>
          </Link>
        </div>
      </motion.nav>
    </div>
  );
}