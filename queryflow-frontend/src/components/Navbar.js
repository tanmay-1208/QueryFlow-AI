import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0e0e0e]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex justify-between items-center px-6 md:px-10 py-6 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-xl font-black tracking-tighter font-['Manrope'] text-white">
            QueryFlow Vault
          </Link>
          <div className="hidden lg:flex gap-8 text-[11px] font-bold text-gray-500 uppercase tracking-[0.2em]">
            <Link to="/features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/solutions" className="hover:text-white transition-colors">Solutions</Link>
            <Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link to="/security" className="hover:text-white transition-colors">Security</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/login" className="hidden sm:block text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Login</Link>
          <Link to="/login" className="bg-[#4182ff] text-white px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em]">Request Demo</Link>
          
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white material-symbols-outlined p-2">
            {isOpen ? 'close' : 'menu'}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-[#0e0e0e] border-b border-white/5 px-6 py-10 flex flex-col gap-6 text-sm font-black uppercase tracking-widest text-gray-400 animate-in slide-in-from-top">
          <Link to="/features" onClick={() => setIsOpen(false)}>Features</Link>
          <Link to="/solutions" onClick={() => setIsOpen(false)}>Solutions</Link>
          <Link to="/pricing" onClick={() => setIsOpen(false)}>Pricing</Link>
          <Link to="/security" onClick={() => setIsOpen(false)}>Security</Link>
          <hr className="border-white/5" />
          <Link to="/login" onClick={() => setIsOpen(false)} className="text-white">Login</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;