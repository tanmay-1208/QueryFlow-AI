import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "./supabaseClient";

// Import Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Vault from "./pages/Vault";
import FeaturesPage from "./pages/FeaturesPage";
import SolutionsPage from "./pages/SolutionsPage";
import PricingPage from "./pages/PricingPage";
import SecurityPage from "./pages/SecurityPage";

// --- CLEAN FADE TRANSITION ---
// This removes the "slideshow" movement (y and rotateX are gone)
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes({ session, handleLogout }) {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
        <Route path="/solutions" element={<PageTransition><SolutionsPage /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
        <Route path="/security" element={<PageTransition><SecurityPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />

        {/* Protected Private Route */}
        <Route 
          path="/vault" 
          element={
            session ? (
              <PageTransition>
                <Vault userId={session.user.id} onLogout={handleLogout} />
              </PageTransition>
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitialLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setSession(null);
    window.location.replace("/");
  };

  if (isInitialLoading) {
    return (
      <div className="h-screen w-screen bg-[#080808] flex items-center justify-center text-[#4182ff] font-black animate-pulse uppercase text-[10px] tracking-[0.5em]">
        Authenticating Node...
      </div>
    );
  }

  return (
    <Router>
      {/* Note: The CustomCursor was removed to eliminate lag. 
        Ensure index.css does NOT have 'cursor: none'.
      */}
      <AnimatedRoutes session={session} handleLogout={handleLogout} />
    </Router>
  );
}