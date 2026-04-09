def update_file(filename, replacement_code):
    with open(filename, "w") as f:
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
          <span className="text-gradient">ARCHITECTURE</span>
        </motion.h1>
        <p class        <p class        <p class        <p ">        <p class        <p clas 50+        <p class        <p classfor financial infrastructure. 
          Track, automate, and optimize your institutional-grade assets with real-time sub-5ms indexing and robust tax provisioning.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {[
            { icon: "⚡", title: "SKU Indexi            { icon: "⚡", title: "SKU Indexi            { icon: "⚡", title: "SKU Indexi            { icon: "⚡", title: "SKU Indexi   ized ledger.", color: "#41            { icon: "⚡", title: "SKU Indexi            { icon: "⚡",ed            {ow models, runway estimations, and margin improvements. Ask questions in natural language and get board-ready insights.", color: "#66dd8b" },
            { icon: "🏦", title: "Tax Provisioning", desc: "Autom            { icon: "�y with real-time audit-ready ledgers. Continuously calculates offsets and prevents reporting penalties.", color: "#fbbc00" },
            { icon: "🔗", title: "API Ecosystem", desc: "Integrate with Plaid, Stripe, and 500+ global financial institutions. Bi-directional sync guarantees zero manual entry.", color: "#8b5cf6" },
            { icon: "🛡", title: "Quantum Secure", desc: "Enc       me            { icon: "🛡", title: "Quantum Secure", desc: "Enc       me           ro           nt            { icon: "🛡", title: "Quantum Secure", desc: "Enc       me            { icon: "🛡", title: "Quantum Secure", desc: "Enc       me           ro           nt            { icon: "🛡", title: "Quantum Secure", desc: "Enc       me            { icon: "🛡", title: "Quantum Secure", desc: "Enc       me           ro           nt            { icon: "🛡", title: "Quantum Secure", desc: "Enc       me            { icon: "�iewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass p-10 hover-glow group cursor-default relative overflow-hidden"
            >
               <div className="absolute                <div className="absolute                <div className="absolute                <div className="absolute                <div className="absolute                <div className="absoluteent">{f.icon}</div>
               <h3 className="text-2xl font-black italic uppercase tracking-tighter mb-4" style={{color: f.color}}>{f.title}</h3>
               <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Deep Dive Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="glass p-10 md:p-16 relative overflow-hidden mb-20"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute top-1/2 left-1/2 -transl             <div className="absolute top-1/2 left-1/2 -transl             <div className="a              assName="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/5 rounded-full" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                                                                                                                          ep                                                                                     <p className="text-gray             l       relaxed mb-6">
                Our synthesis engine doesn't just read data; it understands context. When a transaction occurs, QueryFlow crosses it against localized tax laws, vendor history, and your specific budgetary constraints within 4 milliseconds.
              </p>
              <ul className="space-y-4">
                {["Vendor-Assigned Categorization", "Predictive Churn Alerts", "Multi-Entity Consolidation", "Smart Fraud Detection"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#8b5cf6]"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="glass p-6 md:p-8 bg-black/50 border-white/5">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <span className="text-xs font-mono text-gray-500 uppercase">Live Stream</span>
                <span className="flex items-center gap-2 text-xs font-mono text-[#66dd8b] uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#66dd8b] animate-pulse"></span> Synced
                </span>
              </div>
              <div className="space-y-3 font-mono text-xs text-gray-400">
                <div className="flex justify-between"><span>> INGEST TXN_8921</span> <span className="text-[#4182ff]">1.2ms</span></div>
                <div className="flex justify-between"><span>> CLASSIFY VENDOR_AWS</span> <span className="text-[#4182ff]">0.8ms</span></div>
                <div className="flex justify-between"><span>> CHECK BUDGET_Q3</span> <span className="text-[#4182ff]">0.5ms</span></div>
                <div className="flex justify-between"><span>> ALLOCATE TAX_PROV</span> <span className="text-[#4182ff]">1.4ms</span></div>
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
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SecurityPage() {
  return (
    <div className="bg-[#050505] min-h-screen text-white overflow-x-hidden font-['Inter'] relative">
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-[#22d3ee]/10 blur-[150px] rounded-full pointer-events-none"></div>
      <Navbar />
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 pt-40 pb-20">
        
        <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1}} className="text-center mb-24">
          <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none italic mb-6">
            MILITARY-GRADE<br/>
            <span className="text-gradient">ENCRYPTION</span>
          </h1>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            At QueryFlow, security isn't a feature—it's the foundation. From end-to-end AES-256 data protection to zero-trust architecture, your financial ledgers and predictive metadata remain strictly in your control.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {[
                                                                                                                                                   ur                key to decrypt and compile insights. Your keys never leave your device." },
            { tag: "02", title: "FIPS 140-2 Level 3", desc: "Hardware isolation and redundant HSMs ensure compliance with the strictest international financial security regulations required by central banking institutions." },
            { tag: "03", title: "DDoS Mitigation Pipeline", desc: "Multi-layered network filtering via Cloudflare Enterprise mitigates 99.9% of volumetric and application-layer attacks before they even ping our perimeter." },
            { tag: "04", title: "Continuous Audits", desc: "Routine penetrative testing by independent cybersecurity firms ensures our codebase is fortified against zero-day exploits and evolving attack vectors." },
          ].map((item, i) => (
            <motion.div key={i} className="relative glass p-10 group hover-glow overflow-hidden" whileHover={{ scale: 1.02 }}>
              <div className="absolute top-0 right-0 p-8 text-gray-800 text-7xl font-black opacity-10 group-hover:opacity-20 group-hover:text-[#4182ff] transition-all duration-500 transform group-hover:scale-110">{item.tag}</div>
              <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 text-[#4182ff] relative z-10">{item.title}</h3>
              <p className="text-gray-400 leading-relaxed               <p className="text-gray-400 leading-relaxed               <p className="text-gray-400 leading-relaxed               <p className="text-gray-400 leading-relaxed               <p className="text-gray-400 leading-                <p className="text-gray-400 leading-relaxed               <p className="text-gray-400 leading-relaxed               <p className="text-gray-400 leading-relaxed               <p className="text-gray-40   <h3 className="text-xl font-black uppercase tracking-[0.3em] text-gray-500">Global Compliance Standards</h3>
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
           <button className="px-8 py-3 rounded-full bg-white/5 border borde           <button className="px-8 py-3 rounded-full bg-white/5 border borde           <butracking-widest text-sm">
             View Program Details
           </button>
        </motion.div>
                   <Footer />
    </di    </di    </di  ution    </di    </di    </di from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default export default export default export default export default ex#0expor] minexport default export default export default export default export default ex#0expor] minexport default export default export default export default export default unded-full pointer-events-none"></div>
      <Navbar />
      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div io      <div            <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div      <div >      <div      <div      />
            <span className="text-gradient">SOLUTIONS</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-gray-400 max-w-sm text-left md:text-right text-lg"
          >
            Tailored API systems, automated reconciliation, and bespoke AI models built directly for your workflow scale.
          </motion.p>
        </div>
        
        <div className="space-y-8 mb-32">
          {[
            { title: "Hedge Funds & PE", details: "Real-time portfolio analytics, decentralized liquidity tracking, and macro-economic forecasting powered by bespoke ML nodes. Instantly consolidate limited partner reporting.", metric: "$20B+ Managed", color: "#4182ff" },
            { title: "SMEs & Startups", details: "Automated burn rate calculation, runaway monitoring, expense categorization, and seamless vendor invoice parsing. End the month-end close nightmare forever.", metric: "Save 40hrs/month", color: "#66dd8b" },
            { title: "Family Offices", details: "Estate synchronization,             { titleta            { title: "Family Offices", detea            { title: "Family Offices", deboard for total net worth visibility.", metric: "99.9% Audit Accuracy", color: "#fbbc00" }
          ].map((sol, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInV       opacity:       0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
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
          <span className="text-[#8b5cf6] font-black uppercase tracking-widest text-sm mb-4 block">Deployment Architecture</span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic mb-8">
            Deploy Anywhere. <span className="text-gray-600">Scale Everywhere.</span>
          </h2          </h2          </h2          </h2   flex-row justify-center items-center gap-10 mt-16">
            <div className="glass p-8 w-full md:w-1/3 text-left">
              <h4 className="text-xl font-bold mb-2">Cloud Hosted</h4>
              <p className="text-gray-400 text-sm">Managed via o              <p className="tclu              <p classme SLAs.</p>
            </div>
            <div className="text-gray-600 font-bold hidden md:block">OR</div>
            <div className="glass p-8 w-full md:w-1/3 text-left">
              <h4 className="text-xl font-bold mb-2">On-P              <h4 className="textssName="text-gray-400 text-sm">Deploy via Docker/Kubernetes directly inside your VPC for maximum data sovereignty.</p>
            </div>
          </div>
        </motion.div>
        
      </div>
      <Fo      <Fo      <Fo      <Fo      <Fo      <Fo      <Fo      <Fo      <Fo      <Fo      <Fo      le('src/pages/SecurityPage.js', security_code)
update_file('src/pages/SolutionsPage.js', solutions_code)
