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

// --- 3D PAGE ENTRANCE WRAPPER ---
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, rotateX: 2 }}
    animate={{ opacity: 1, y: 0, rotateX: 0 }}
    exit={{ opacity: 0, y: -20, rotateX: -2 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

// --- ANIMATED ROUTES COMPONENT ---
// This handles the exit/entry animations when URLs change
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

        {/* Catch-all: Redirects any undefined URL back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

// --- MAIN APP COMPONENT ---
export default function App() {
  const [session, setSession] = useState(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitialLoading(false);
    });

    // 2. Listen for auth changes (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setSession(null);
    // Force a clean redirect to home
    window.location.replace("/");
  };

  // Loading State (Authenticating Node)
  if (isInitialLoading) {
    return (
      <div className="h-screen w-screen bg-[#0e0e0e] flex flex-col items-center justify-center text-[#4182ff] font-black animate-pulse uppercase text-xs tracking-[0.5em]">
        Authenticating Node...
      </div>
    );
  }

  return (
    <Router>
      {/* The CustomCursor was removed from here to fix lag issues. 
          Default system cursor is now restored.
      */}
      <AnimatedRoutes session={session} handleLogout={handleLogout} />
    </Router>
  );
}