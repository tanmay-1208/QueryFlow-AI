import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

// 1. ALL IMPORTS MUST BE HERE
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Vault from "./pages/Vault";
import FeaturesPage from "./pages/FeaturesPage";
import SolutionsPage from "./pages/SolutionsPage";
import PricingPage from "./pages/PricingPage";
import SecurityPage from "./pages/SecurityPage";

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
    window.location.replace("/");
  };

  if (isInitialLoading) {
    return (
      <div className="h-screen w-screen bg-[#0e0e0e] flex flex-col items-center justify-center text-[#4182ff] font-black animate-pulse uppercase text-xs tracking-[0.5em]">
        Authenticating Node...
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTES - These tell the app where to go */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/solutions" element={<SolutionsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/security" element={<SecurityPage />} />
        <Route path="/login" element={<Login />} />

        {/* PROTECTED ROUTE */}
        <Route 
          path="/vault" 
          element={
            session ? (
              <Vault userId={session.user.id} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* CATCH-ALL - If you don't add the routes above, this kicks you to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}