import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./supabaseClient";

// Import Pages
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Vault from "./pages/Vault";

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
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Private Route */}
        <Route 
          path="/vault" 
          element={
            session ? (
              // CRITICAL: We pass session.user.id (the UUID), NOT the email
              <Vault userId={session.user.id} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}