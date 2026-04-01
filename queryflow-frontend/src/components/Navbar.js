import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { name: "Features", path: "/features" },
    { name: "Solutions", path: "/solutions" },
    { name: "Pricing", path: "/pricing" },
    { name: "Security", path: "/security" },
  ];

  // Close drawer on route change
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {/* ── NAVBAR BAR ── */}
      <div className="fixed top-6 left-0 right-0 z-[100] flex justify-center px-4 sm:px-6">
        <motion.nav
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[1200px] bg-black/40 backdrop-blur-xl border border-white/10 py-3 px-5 sm:px-8 rounded-full flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
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

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Sign In — hidden on small screens */}
            <Link
              to="/login"
              className="hidden sm:block text-[10px] font-black uppercase tracking-[0.2em] text-white hover:text-[#4182ff] transition-colors"
            >
              Sign In
            </Link>

            {/* Deploy Node button — hidden on mobile to save space */}
            <Link to="/login" className="hidden sm:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-[#4182ff] text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(65,130,255,0.3)] hover:shadow-[0_0_30px_rgba(65,130,255,0.5)] transition-all"
              >
                Deploy Node
              </motion.button>
            </Link>

            {/* Hamburger — only on mobile */}
            <button
              onClick={() => setMenuOpen(true)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-white/5 text-white"
              aria-label="Open menu"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
                <rect y="2" width="18" height="2" rx="1" />
                <rect y="8" width="18" height="2" rx="1" />
                <rect y="14" width="18" height="2" rx="1" />
              </svg>
            </button>
          </div>
        </motion.nav>
      </div>

      {/* ── MOBILE DRAWER ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 z-[201] w-72 bg-[#0e0e0e] border-l border-white/10 flex flex-col"
              style={{ paddingTop: "env(safe-area-inset-top, 0px)", paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
                <span className="font-black text-lg tracking-tighter uppercase text-white">
                  Query<span className="text-[#4182ff]">Flow</span>
                </span>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M1 1l12 12M13 1L1 13" />
                  </svg>
                </button>
              </div>

              {/* Nav Links */}
              <nav className="flex flex-col px-4 py-6 gap-1 flex-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 + 0.1 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center px-4 py-3 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${
                        location.pathname === link.path
                          ? "bg-[#4182ff]/10 text-[#4182ff]"
                          : "text-gray-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer Footer CTA */}
              <div className="px-4 pb-8 flex flex-col gap-3">
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    className="w-full bg-[#4182ff] text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(65,130,255,0.3)]"
                  >
                    Deploy Node
                  </motion.button>
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors py-2"
                >
                  Sign In
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}