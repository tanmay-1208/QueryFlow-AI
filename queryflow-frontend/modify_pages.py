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
            { icon: "🏦", title: "Tax Provisioning", de        om            { icon: "�y             { icon: "🏦", title: "Tax Provisioning", de        om            { icon: "�y             { icon: "🏦", title: "Tax Provisionin "🔗", title: "API Ecosystem", desc: "Integrate with Plaid, Stripe, and 500+ global financial institutions. Bi-directional sync guarantees zero manual entry.", color: "#8b5cf6" },
            { icon: "🛡", title: "Quantum Secure", desc: "Encrypted memory enclaves, AES-256, and zero-knowledge storage.", color: "#22d3ee" },
            { icon: "📊", title: "Dynamic Reporting", desc: "Custom dashboards bridging compliance and strategic growth.", color: "#f472b6" }
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 hover-glow group cursor-default relative overflow-hidden"
            >
               <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[50px] opacity-20 transition-opacity group-hover:opacity-50" style={{background: f.color}}></div>
               <div className="text-4xl mb-6 float-element">{f.icon}</div>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4" style={{color: f.color}}>{f.title}</h3>
               <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
                                                                                                                                                                                  }}
          className="g          className=la          className="g          className=la    <div className="relative z-10 grid grid-cols-1           className="g          classN            className="g          className=l"te          className="g          className=la          className="g 6">
                Deep <s            e=                Deep <s            e=                Deep <s            e=                Deep <s            e=                Deep <s            e=                Deep <s           da                Deep <s            e=                Deep <s            eit against localized tax laws, vendor history, and your specific budgetary constraints within 4 milliseconds.
              </p>
              <ul className="space-y-4 text-gray-300">
                <li className                <li cla-3"          ssNa                <li className                <li cla-3"          ssNa                <li className                <li cla-3"          ssNa                <li className            -f                <li className                <li cla-3"          ssNa                <li className                <li cla-3"          ssNa                <li className                <li cla-3"          ssNa                <li className            -f                <li className                  <span className="text-xs font-mono text-gray-500 uppercase">Live Stream</span>
                <span className="flex items-center gap-2 text-xs font-mono text-[#66dd8b] uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#66dd8b] animate-pulse"></span> Synced
                </span>
              </div>
              <div className="space-y-3 font-mono text-xs text-gray-400">
                <div className="flex justify-between"><span>> INGEST TXN_8921</span> <span className="text-[#4182ff]">1.2ms</span></div>
                <div className="flex justify-between"><span>> CLASSIFY VENDOR_AWS</span> <span className="text-[#4182ff]">0.8ms</span></div>
                <div className="flex justify-between font-bold text-white border-t border-white/10 pt-3"><span>> CYCLE COMPLETE</span> <span className="text-[#66dd8b]">3.9ms</span></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
"""

security_code = """import React from "react";
import { motion } from "framer-motion";
import Navbar from ".import Navbar from ".import Navbar from ".import Navbar from ".import Navbar from ".import Navbar frgeimport Navbar from ".import Navbar from ".import Navbar from ".import Navbar from ".import Navba['Iimport Navbar from ".i  import Navbar from olimport Navbar right-[-10%] w-[50%] h-[50%] bg-[#22d3ee]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-40 pb-20">
                                                                                                                                                  assName="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic mb-6">
            MILITARY-GRADE<br/>
            <span className="text-gradient">ENCRYPTION</span>
          </h1>
                       "text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            At QueryFlow, security             At QueryFlow, security       om en            At QueryFlow, security  zero-trust architecture, your financial ledgers and predictive metadata remain strictly in your control.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {[
            { tag: "01", title: "Zero-Knowledge Architecture", desc: "We cannot see your data. Our servers only route encrypted blobs, requiring your localized node key to decrypt and compile insights. Your keys never leave your device." },            { tag: "01", title: "Zero-Knowledge Architecture", desc: "We cannot see your data. Our servers only route encrypted blobs, requiring your localized node key to decrypt and compile insights. Your keys never leave your device." } {            { tag: "01", titigation Pipeline", desc: "Multi-layered network filtering via Cloudflare Enterprise mitigates 99.9% of volumetric and application-layer attacks before they even ping our perimeter." },
            { tag: "04", title: "Continuous Audits", desc: "Routine penetrative testing by independent cybersecurity firms ensures our codebase is fortified against zero-day exploits and evolving attac            },
          ].map((item, i) => (
          ].map((item, i) => (
 "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Aud{{ "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Continuous Audits", desc: "Routine  h "Continuouve "Cont"text-xl font-black uppercase tracking-[0.3em] text-gray-500">Global Compliance Standards</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-50">
             {["SOC 2 TYPE II", "ISO 27001", "GDPR", "CCPA", "PCI DSS"].map((cert, idx) => (
                <div key={idx} className="text-xl md:text-3xl font-black tracking-tighter">{cert}</div>
             ))}
          </div>
        </motion.div>

        {/* Bug Bounty */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass p-10 md:p-16 text-center hover-glow"
        >
           <h2 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-white">Security <span className="text-[#66dd8b]">Bounty Program</span></h2>
           <p className="text-gray-400 max-w-2xl mx-auto mb-8">
             We work with top-tier security researchers worldwide. If you identify a vulnerability in QueryFlow's infrastructure, we reward responsible disclosure with bounties up to $150,000.
           </p>
           <button className="px-8 py-3 rounded-full bg-white/5 border border-white/20 hover:bg-white/10 hover:border-white/40 transition-colors font-black uppercase tracking-widest text-sm">
             View Program Details
           </button>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
"""

solutions_code = """import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SolutionsPage() {
  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden font-['Inter'] relative">
      <div className="absolute top-[10%] left-[20%] w-[60%] h-[60%] bg-[#8b5cf6]/10 blur-[150px] roun      <div className="absolute top-[10%] left-[20%] w-[60%] h-iv className="max-w-[1400px] mx-auto px-6 md:px-10 pt-40 pb-20 relative z-10">
        
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-10">
          <motio                  initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic"
          >          >          >                      >        am          >         LU  ONS</span>
          >    ion.h1>
          <motion.p 
            initial={{ opacity: 0, x: 40 }}            initial={{ opacity: 0, x:  0            initial={{ opacity: 0, x: 00 max-w-sm text-left md:text-right text-lg"
                                            ,           reconciliation, and bespoke AI models built directly for your workflow scale.
          </motion.p>
        </div>
        
        <div className="space-y-8 mb-32">
          {[
            { title: "Hedge Funds & PE", details: "Real-time portfolio analytics, decentralized liquidity tracking, and macro-economic forecasting powered by bespoke      des. Instantly consolidate limited partner reporting.", metric: "$20B+ Managed", color: "#4182            { title: "Hedge Funds & PE", details: "Real-time portd             { title: "Hedge Funds & PE",g, expense categorization, and seamless vendor invoice parsing. End the month-end close nightmare forever.            { title: "Hedge Funds & PE", details: "Real-time portfolio analytics, decentralized liq"Estate synchronization, multi-generational ta            { title: "Hedge Funds & PE", details: "Real-time portfolio analytics, decentralized liquidity tracking, and macro-economic forecasting powered by bespok"#fbbc00" }
          ].map((sol, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              initianV            ty: 1, y: 0               initianV            ty: e }}               transition={{ delay: i * 0.15 }}
              className="glass p-10 md:p-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-10 hover-glow cursor-default relative overflow-hidden"
            >
               <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: sol.color }}></div>
               <div className="max-w-3xl ml-4">
                 <h3 className="text-3xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 text-white">{sol.title}</h3>
                 <p className="text-gray-400 text-lg leading-relaxed">{sol.details}</p>
               </div>
               <div className="flex-shrink-0">
                 <div className="font-black uppercase tracking-widest text-sm md:text-base border px-8 py-4 rounded-2xl whitespace-nowrap bg-black/40 backdrop-blur-md"
                      style={{ color: sol.color, borderColor: sol.color + "40" }}>
                   {sol.metric}
                 </div>
               </div>
            </motion.div>
          ))}
        </div>

        {/* Global Infrastructure Visual */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center py-20 border-t border-white/10"
        >
          <span className="text-[#8b5cf6] font-black uppercase tracking-widest text-sm          <span className="text-[#8b5cf6] font-black uppercase tracking-widest text-sm          <span className="text-[#8b5cf6] foalic mb-8">
            Deploy Anywhere. <span className="text-gray-600">Scale Everywhere.            De    </h2            Deploy Anywhere. <span classNamd:flex-row justify-center items-center gap-10 mt-16">
            <div className="glass p-8 w-full md:w-1/3 text-left">
              <h4 className="text-xl font-bold mb-2">Cloud Hosted</h4>
              <p className="text-gray-400 text-sm">Managed via our high-availability AWS/GCP clusters with 99.99% uptime SLAs.</p>
            </div>
            <div className="text-gray-600 font-bold hidden md:block">OR</div>
            <div className="glass p-8 w-full md:w-1/3 text-left">
                                                       -P                              classN                                                       -P      ly inside yo                                                       -P                              classN                                                       -P      ly inside yo                                                       -rityPage.js", security_code)
update_file("SolutionsPage.js", solutions_code)
print("Updated all 3 pages successfully.")
