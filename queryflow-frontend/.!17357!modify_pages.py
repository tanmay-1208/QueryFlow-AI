import os

def update_file(filename, replacement_code):
    filepath = os.path.join("/Users/mac/Downloads/demo/queryflow-frontend/src/pages", filename)
    with open(filepath, "w") as f:
        f.write(replacement_code)

features_code = """import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function FeaturesPage() {
  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden font-['Inter'] relative">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#4182ff]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <Navbar />
      
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 pt-40 pb-20">
        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-[0.85] mb-10 italic"
        >
          PRECISION<br/>
                      ame="text-gradient">ARCHIT                      ame="text-gradient">ARCHIT                      ame="text-gradient">ARCH">
          QueryFlow integrates 50+ AI models designed exclusively for          QueryFlow integrates 50+ AI models a          QueryFimize your institutional          QueryFlow integrates 50+ AI modxi          QueryFlow integrates 50+ AI mod/p>
        
        <div className="grid grid-cols-1 m        <div className="grid grid-cols-1 m        <div className="grid grid-cols-1 m        <div clxing", desc: "Instantly catalog structured and unstructured financial sets dynamically. Unify diverse global accounts into a single synchronized ledger.", color: "#4182ff" },
            { icon: "🧠", title: "CFO AI Advisor", desc: "Predictive cashflow mode            { icon: "🧠", title: "CFO vements. Ask questions in natural language and get board-ready insights.", color: "#66dd8b" },
