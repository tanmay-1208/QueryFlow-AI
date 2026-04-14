import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 1. Google OAuth Logic
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: { 
        redirectTo: window.location.origin + "/vault" 
      }
    });
    if (error) alert(error.message);
  };

  // 2. Manual Login Logic
  const handleManualLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) { 
      onLogin(true, data.user.email); 
      navigate("/vault"); 
    } else { 
      alert(error.message); 
    }
  };

  return (
    <div className="min-h-screen bg-[#0e0e0e] flex items-center justify-center p-4 text-white font-['Inter']">
      <div className="max-w-md w-full bg-[#1c1b1b] p-12 rounded-[4rem] border border-white/5 text-center shadow-2xl relative overflow-hidden">
        {/* Aesthetic Accent Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#adc7ff] to-[#66dd8b]"></div>
        
        <h2 className="text-3xl md:text-5xl font-black mb-10 tracking-tighter font-['Manrope']">Access Terminal</h2>
        
        <form onSubmit={handleManualLogin} className="space-y-4 mb-6">
          <input 
            className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" 
            type="email" 
            placeholder="Email Address" 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            className="w-full bg-[#2a2a2a] border-none text-white rounded-[1.5rem] px-8 py-5 outline-none focus:ring-1 ring-[#adc7ff]" 
            type="password" 
            placeholder="Password" 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="w-full bg-[#adc7ff] text-[#002e68] py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] transition-all">
            SIGN IN
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center gap-4 mb-6">
          <div className="flex-1 h-[1px] bg-white/5"></div>
          <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">OR</span>
          <div className="flex-1 h-[1px] bg-white/5"></div>
        </div>

        {/* RESTORED: Google Sign-In Button */}
        <button 
          onClick={handleGoogleLogin} 
          className="w-full bg-white/5 text-white border border-white/10 py-5 rounded-[1.5rem] font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3"
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            className="w-6 h-6" 
          />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;


//commit"export"