import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Import Pages (The Logic)
import LandingPage from "./pages/LandingPage";
import FeaturesPage from "./pages/FeaturesPage";
import SolutionsPage from "./pages/SolutionsPage";
import PricingPage from "./pages/PricingPage";
import SecurityPage from "./pages/SecurityPage";
import Login from "./pages/Login";
import Vault from "./pages/Vault";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Check for existing session on boot
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        handleLogin(true, session.user.email);
      }
      setIsInitialLoading(false);
    };
    checkSession();
  }, []);

  const handleLogin = (status, id) => { 
    setIsAuthenticated(status); 
    setUserId(id); 
    localStorage.setItem("isLoggedIn", "true"); 
    localStorage.setItem("userId", id); 
  };

  const handleLogout = () => { 
    supabase.auth.signOut(); 
    localStorage.clear(); 
    setIsAuthenticated(false); 
    setUserId(""); 
    window.location.replace("/"); 
  };

  if (isInitialLoading) {
    return (
      <div className="h-screen w-screen bg-[#0e0e0e] flex items-center justify-center text-[#adc7ff] font-black animate-pulse">
        TERMINAL INITIALIZING...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Marketing Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/security" element={<SecurityPage />} />

        {/* Auth Route */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* Protected Private Route */}
        <Route 
          path="/vault" 
          element={
            isAuthenticated ? (
              <Vault userId={userId} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Catch-all Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}