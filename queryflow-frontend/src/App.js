import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { supabase } from "./supabaseClient";

// 1. Import your New Component
import CustomCursor from "./components/CustomCursor"; // Adjust path if needed

// Import Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Vault from "./pages/Vault";
import FeaturesPage from "./pages/FeaturesPage";
import SolutionsPage from "./pages/SolutionsPage";
import PricingPage from "./pages/PricingPage";
import SecurityPage from "./pages/SecurityPage";

// Animation Wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

function AnimatedRoutes({ session, handleLogout }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
        <Route path="/features" element={<PageTransition><FeaturesPage /></PageTransition>} />
        <Route path="/solutions" element={<PageTransition><SolutionsPage /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><PricingPage /></PageTransition>} />
        <Route path="/security" element={<PageTransition><SecurityPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route 
          path="/vault" 
          element={
            session ? (
              <PageTransition><Vault userId={session.user.id} onLogout={handleLogout} /></PageTransition>
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
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsInitialLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setSession(null);
  };

  if (isInitialLoading) {
    return <div className="loading">Authenticating Node...</div>;
  }

  return (
    <Router>
      {/* 2. PASTE CURSOR HERE - It sits outside the Routes so it never unmounts */}
      <CustomCursor />
      
      <AnimatedRoutes session={session} handleLogout={handleLogout} />
    </Router>
  );
}