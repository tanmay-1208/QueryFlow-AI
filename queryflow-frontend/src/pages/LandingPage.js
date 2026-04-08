import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useInView,
  AnimatePresence,
} from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";

// ─────────────────────────────────────────────────────
// Animated Number Counter
// ─────────────────────────────────────────────────────
function useCounter(end, duration = 2000, active = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    const numeric = parseFloat(String(end).replace(/[^0-9.]/g, ""));
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(Math.floor(eased * numeric));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(numeric);
    };
    requestAnimationFrame(tick);
  }, [active, end, duration]);

  const pre = String(end).startsWith("$") ? "$" : "";
  const suf = String(end).match(/[+%BM]+$/)?.[0] ?? "";
  return `${pre}${val.toLocaleString()}${suf}`;
}

// ─────────────────────────────────────────────────────
// Reveal wrapper  (fade + slide up)
// ─────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 40 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────
// Section Label
// ─────────────────────────────────────────────────────
function SectionLabel({ children, color = "#4182ff" }) {
  return (
    <motion.span
      whileHover={{ scale: 1.04 }}
      className="inline-flex items-center gap-2 text-base font-black uppercase tracking-[0.6em] px-5 py-2 rounded-full cursor-default"
      style={{
        color,
        background: `${color}12`,
        border: `1px solid ${color}30`,
      }}
    >
      <motion.span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: color }}
        animate={{ scale: [1, 1.6, 1], opacity: [1, 0.4, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      {children}
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────
// Stat Card (with counter)
// ─────────────────────────────────────────────────────
function StatCard({ metric, desc, icon, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const count = useCounter(metric, 2000, inView);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group overflow-hidden rounded-3xl p-8 text-center cursor-default"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        style={{ background: "radial-gradient(circle at 50% 50%, rgba(65,130,255,0.08), transparent 70%)" }}
      />
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ border: "1px solid rgba(65,130,255,0.3)" }}
      />

      <div className="relative z-10">
        <div className="text-2xl mb-3">{icon}</div>
        <motion.div
          className="text-4xl sm:text-5xl font-black mb-2 tabular-nums"
          style={{
            background: "linear-gradient(135deg, #4182ff, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
          initial={{ scale: 0.7, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: delay + 0.2, type: "spring", stiffness: 150 }}
        >
          {count}
        </motion.div>
        <p className="text-gray-500 text-sm font-semibold">{desc}</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────
// 3-D Tilt Bento Card
// ─────────────────────────────────────────────────────
function TiltCard({ children, className, delay = 0, style }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-1, 1], [4, -4]), { stiffness: 150, damping: 30 });
  const ry = useSpring(useTransform(mx, [-1, 1], [-4, 4]), { stiffness: 150, damping: 30 });

  const onMove = (e) => {
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - left) / width - 0.5) * 2);
    my.set(((e.clientY - top) / height - 0.5) * 2);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1200, ...style }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={`relative overflow-hidden group ${className}`}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────
// Animated Gradient Border Card
// ─────────────────────────────────────────────────────
function GradBorderCard({ children, className, delay = 0 }) {
  return (
    <Reveal delay={delay}>
      <div className={`relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden group ${className}`}>
        {/* Animated gradient border */}
        <div
          className="absolute inset-0 rounded-[2rem] sm:rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: "linear-gradient(135deg, #4182ff33, #8b5cf633, #22d3ee33)",
            padding: "1px",
          }}
        />
        <div className="absolute inset-[1px] rounded-[calc(2rem-1px)] sm:rounded-[calc(2.5rem-1px)] bg-[#111]" />
        <div className="relative z-10">{children}</div>
      </div>
    </Reveal>
  );
}

// ─────────────────────────────────────────────────────
// Feature Pill (small inline badges)
// ─────────────────────────────────────────────────────
function Pill({ children, color = "#4182ff" }) {
  return (
    <motion.span
      whileHover={{ scale: 1.08, y: -2 }}
      className="inline-block text-base font-black uppercase tracking-widest px-3 py-1.5 rounded-full cursor-default"
      style={{ background: `${color}15`, color, border: `1px solid ${color}25` }}
    >
      {children}
    </motion.span>
  );
}

// ─────────────────────────────────────────────────────
// Scrolling Logos Row
// ─────────────────────────────────────────────────────
function LogoScroll() {
  const logos = ["Goldman Sachs", "BlackRock", "Citadel", "Andreessen", "Sequoia", "Tiger Global", "Point72", "Bridgewater"];
  return (
    <div className="relative overflow-hidden py-4">
      <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to right, #080808, transparent)" }} />
      <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none"
        style={{ background: "linear-gradient(to left, #080808, transparent)" }} />
      <div className="flex gap-0 animate-logos whitespace-nowrap">
        {[...logos, ...logos, ...logos].map((l, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-8 text-lg font-black uppercase tracking-[0.4em] text-gray-700">
            <span className="w-1 h-1 rounded-full bg-gray-800" />
            {l}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────
// Process Step
// ─────────────────────────────────────────────────────
function ProcessStep({ num, title, desc, delay, color = "#4182ff" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative group cursor-default"
    >
      <motion.div
        className="absolute -top-10 -left-4 text-[80px] font-black select-none"
        style={{ color: `${color}08`, lineHeight: 1 }}
        whileHover={{ color: `${color}18` }}
        transition={{ duration: 0.3 }}
      >
        {num}
      </motion.div>

      <motion.div
        className="inline-flex w-10 h-10 rounded-xl items-center justify-center mb-5 relative z-10"
        style={{ background: `${color}15`, border: `1px solid ${color}30` }}
        animate={{ boxShadow: [`0 0 0px ${color}00`, `0 0 20px ${color}40`, `0 0 0px ${color}00`] }}
        transition={{ duration: 3, repeat: Infinity, delay }}
      >
        <span className="text-sm font-black" style={{ color }}>{parseInt(num)}</span>
      </motion.div>

      <h4 className="text-xl sm:text-2xl font-black uppercase italic tracking-tighter mb-3 relative z-10">
        <span className="mr-2" style={{ color }}>//</span>
        {title}
      </h4>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
      <motion.div
        className="mt-4 h-px w-0"
        style={{ background: `linear-gradient(to right, ${color}60, transparent)` }}
        animate={inView ? { width: "100%" } : {}}
        transition={{ delay: delay + 0.5, duration: 0.8 }}
      />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────
// Benefit Card
// ─────────────────────────────────────────────────────
function BenefitCard({ icon, title, desc, color, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="relative group overflow-hidden rounded-2xl sm:rounded-3xl p-6 sm:p-8 cursor-default"
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        transition: "border-color 0.4s, box-shadow 0.4s",
      }}
      onHoverStart={(e) => {
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.boxShadow = `0 20px 60px rgba(0,0,0,0.4), 0 0 30px ${color}15`;
      }}
      onHoverEnd={(e) => {
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: color }} />

      <motion.div
        className="text-4xl mb-4 inline-block"
        animate={inView ? { rotate: [0, -5, 5, 0] } : {}}
        transition={{ delay: delay + 0.4, duration: 0.5 }}
        whileHover={{ scale: 1.2 }}
      >
        {icon}
      </motion.div>
      <h3 className="text-lg sm:text-xl font-black uppercase italic tracking-tighter mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 rounded-b-3xl"
        style={{ background: `linear-gradient(to right, ${color}, transparent)` }} />
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────
// MAIN LANDING PAGE
// ─────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div
      className="text-white overflow-x-hidden"
      style={{ background: "#030308", fontFamily: "'Inter', sans-serif" }}
    >
      <Navbar />
      <Hero />

      {/* ═══════════════════════════════════════════════
          TRUST LOGOS MARQUEE
      ═══════════════════════════════════════════════ */}
      <div className="border-y border-white/[0.04] bg-[#050510]">
        <div className="max-w-[1400px] mx-auto px-5">
          <div className="flex items-center gap-6 py-4">
            <span className="text-base font-black uppercase tracking-widest text-gray-700 whitespace-nowrap flex-shrink-0">
              Trusted by
            </span>
            <div className="flex-1 overflow-hidden">
              <LogoScroll />
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════
          BENTO GRID — CORE INFRASTRUCTURE
      ═══════════════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-5 sm:px-8 py-24 sm:py-40 relative">
        {/* section ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(65,130,255,0.04), transparent 70%)" }} />

        <Reveal className="mb-16 sm:mb-24 text-center">
          <div className="flex flex-col items-center gap-5">
            <SectionLabel color="#4182ff">Core Infrastructure // v4.0.26</SectionLabel>
            <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[-0.04em] italic uppercase leading-[0.85]">
              Automate Your <br />
              <span style={{
                WebkitTextStroke: "1.5px rgba(255,255,255,0.2)",
                color: "transparent",
              }}>
                Fiscal Flow
              </span>
            </h2>
            <p className="text-gray-500 max-w-xl text-sm sm:text-base leading-relaxed">
              QueryFlow merges institutional-grade infrastructure with frontier AI—giving you complete
              control over digital assets, real-time analytics, and predictive fiscal insights.
            </p>
          </div>
        </Reveal>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5">

          {/* Wide card — Predictive Audit */}
          <TiltCard
            delay={0.1}
            className="sm:col-span-8 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 min-h-[280px] sm:min-h-[340px] flex flex-col justify-between"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div>
              <div>
                <div className="flex items-start justify-between mb-5">
                  <Pill color="#4182ff">Predictive AI</Pill>
                  <span className="text-base font-mono text-gray-700 tabular-nums">v4.2.1</span>
                </div>
                <h3 className="text-2xl sm:text-4xl font-black uppercase italic tracking-tighter mb-4">
                  Predictive Audit System
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-md">
                  Our advanced AI nodes scan 10,000+ data points in real-time to predict tax liabilities and
                  identify fiscal leakages before they impact your secondary ledger—99.8% accuracy.
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <motion.span
                  className="h-2 w-2 rounded-full bg-[#66dd8b]"
                  animate={{ scale: [1, 1.6, 1], opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ boxShadow: "0 0 8px #66dd8b" }}
                />
                <span className="text-lg font-mono text-gray-600 uppercase tracking-widest">
                  Node Sync: Stable · Predictions: Active
                </span>
              </div>
            </div>
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(65,130,255,0.08), transparent 70%)" }} />
          </TiltCard>

          {/* Narrow card — 4ms Latency */}
          <TiltCard
            delay={0.2}
            className="sm:col-span-4 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 flex flex-col justify-between min-h-[260px] relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #4182ff 0%, #6366f1 100%)",
              boxShadow: "0 0 60px rgba(65,130,255,0.3)",
            }}
          >
            <div>
              <motion.div
                className="text-5xl sm:text-7xl font-black italic tracking-tighter text-white leading-none"
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                4ms
              </motion.div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tighter italic text-white mb-3">
                  Institutional<br />Latency
                </h3>
                <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
                  Sub-5ms query response with real-time indexing. Zero downtime SLA.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
              <div className="absolute top-5 right-5 text-sm font-black uppercase tracking-widest text-white/50">
                Indexing · ZD
              </div>
            </div>
          </TiltCard>

          {/* Security spec card */}
          <TiltCard
            delay={0.15}
            className="sm:col-span-4 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 flex flex-col justify-between min-h-[240px]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div>
              <div>
                <Pill color="#66dd8b">Security Protocol</Pill>
                <p className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter mt-5 mb-4">
                  AES-256<br />Sharded Vault
                </p>
                <p className="text-gray-500 text-xs leading-relaxed">
                  Military-grade encryption with distributed architecture and zero-knowledge proofs.
                </p>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <motion.span
                  className="h-1 w-1 rounded-full bg-[#66dd8b]"
                  animate={{ scale: [1, 2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="text-base font-black uppercase tracking-widest text-gray-600">FIPS 140-2 Certified</span>
              </div>
            </div>
          </TiltCard>

          {/* Connectivity card */}
          <TiltCard
            delay={0.2}
            className="sm:col-span-4 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 flex flex-col justify-between min-h-[240px]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div>
              <div>
                <Pill color="#fbbc00">Universal API</Pill>
                <h3 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter mt-5 mb-3">
                  Universal Connectivity
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed">
                  500+ financial institutions, crypto exchanges, and banking APIs. REST, GraphQL, WebSocket.
                </p>
              </div>
              <div className="flex items-center gap-2 flex-wrap mt-4">
                {["REST", "GraphQL", "WebSocket"].map(t => (
                  <motion.span key={t} whileHover={{ scale: 1.1 }}
                    className="text-sm font-black uppercase tracking-widest text-gray-600 border border-white/5 px-2 py-0.5 rounded-full">
                    {t}
                  </motion.span>
                ))}
              </div>
            </div>
          </TiltCard>

          {/* AI Features card */}
          <TiltCard
            delay={0.25}
            className="sm:col-span-4 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-10 flex flex-col justify-between min-h-[240px]"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div>
              <div>
                <Pill color="#8b5cf6">AI Engine</Pill>
                <h3 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter mt-5 mb-3">Smart Features</h3>
                <ul className="space-y-3">
                  {[
                    "Automated expense categorization",
                    "Multi-currency real-time conversion",
                    "Custom AI dashboards & reports",
                  ].map((item, i) => (
                    <motion.li key={i}
                      initial={{ x: -10, opacity: 0 }}
                      whileInView={{ x: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.12 + 0.4 }}
                      className="flex items-start gap-2 text-xs text-gray-400"
                    >
                      <motion.span
                        className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1 bg-[#8b5cf6]"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      />
                      {item}
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </TiltCard>

          {/* CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="sm:col-span-12 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(65,130,255,0.1), rgba(139,92,246,0.08))",
              border: "1px solid rgba(65,130,255,0.2)",
            }}
          >
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 20% 50%, rgba(65,130,255,0.08), transparent 60%)" }} />
            <div className="relative z-10">
              <p className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter mb-2
              ">
                Ready to Transform Your Finances?
              </p>
              <p className="text-gray-500 text-sm max-w-lg">
                Join thousands of companies using QueryFlow to automate financial operations.
              </p>
            </div>
            <Link to="/login" className="relative z-10 flex-shrink-0">
              <motion.span
                whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(65,130,255,0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="block text-center font-black uppercase tracking-widest text-lg sm:text-xl px-10 py-4 rounded-2xl text-white whitespace-nowrap"
                style={{ background: "linear-gradient(135deg, #4182ff, #8b5cf6)", boxShadow: "0 0 30px rgba(65,130,255,0.3)" }}
              >
                Start Free Trial
              </motion.span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          STATS SECTION
      ═══════════════════════════════════════════════ */}
      <section className="border-y border-white/[0.04] py-20 sm:py-32 relative overflow-hidden"
        style={{ background: "rgba(5,5,16,0.8)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(65,130,255,0.04), transparent 70%)" }} />

        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Reveal className="mb-16 text-center">
            <div className="flex flex-col items-center gap-5">
              <SectionLabel color="#8b5cf6">By The Numbers</SectionLabel>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] italic uppercase leading-[0.85]">
                Trusted by <span style={{
                  background: "linear-gradient(135deg, #4182ff, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Finance Leaders</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              { metric: "500+", desc: "Financial Integrations", icon: "🔗", delay: 0 },
              { metric: "99.8%", desc: "AI Prediction Accuracy", icon: "🤖", delay: 0.1 },
              { metric: "10000+", desc: "Daily Transactions", icon: "⚡", delay: 0.2 },
              { metric: "$50B+", desc: "Assets Under Management", icon: "🏦", delay: 0.3 },
            ].map((s, i) => <StatCard key={i} {...s} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          PROCESS — HOW IT WORKS
      ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-44 relative overflow-hidden" style={{ background: "#030308" }}>
        <div className="absolute top-0 left-1/2 w-px h-full -translate-x-1/2 bg-white/[0.04] pointer-events-none" />
        <div className="absolute top-1/2 -translate-y-1/2 left-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(65,130,255,0.04), transparent 70%)" }} />

        <div className="max-w-[1200px] mx-auto px-5 sm:px-8">
          <Reveal className="mb-16 sm:mb-24 text-center">
            <div className="flex flex-col items-center gap-5">
              <SectionLabel color="#22d3ee">Process</SectionLabel>
              <h2 className="text-4xl sm:text-6xl font-black tracking-[-0.04em] italic uppercase leading-[0.85]">
                How It <span style={{ color: "#22d3ee" }}>Works</span>
              </h2>
              <p className="text-gray-500 text-sm sm:text-base max-w-xl leading-relaxed">
                Four steps from connection to optimisation. Start in minutes, not months.
              </p>
            </div>
          </Reveal>

          {/* Steps A */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 sm:gap-16 mb-20">
            {[
              { num: "01", title: "Ingestion", desc: "Connect your bank APIs and digital wallets to the QueryFlow Terminal for unified data aggregation.", color: "#4182ff" },
              { num: "02", title: "Synthesis", desc: "Our proprietary AI categorises transactions and calculates real-time P&L with 99.8% precision.", color: "#8b5cf6" },
              { num: "03", title: "Optimization", desc: "Receive automated tax provisions and institutional-grade capital growth suggestions via the vault.", color: "#22d3ee" },
            ].map((s, i) => <ProcessStep key={i} {...s} delay={i * 0.15} />)}
          </div>

          {/* Steps B */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-12">
            {[
              { num: "01", title: "Connect", desc: "Link bank accounts, wallets, and trading platforms. 500+ institutions supported.", color: "#4182ff" },
              { num: "02", title: "Aggregate", desc: "AI normalises data across all sources in real-time with live FX rates.", color: "#8b5cf6" },
              { num: "03", title: "Analyze", desc: "Intelligent insights with predictive analytics and automated compliance reporting.", color: "#fbbc00" },
              { num: "04", title: "Optimize", desc: "Institutional-grade recommendations for capital growth and tax-loss harvesting.", color: "#22d3ee" },
            ].map((s, i) => (
              <div key={i} className="relative">
                <ProcessStep {...s} delay={i * 0.12} />
                {i < 3 && (
                  <motion.div
                    className="hidden sm:block absolute -right-6 top-10 text-xl font-black"
                    style={{ color: "rgba(65,130,255,0.25)" }}
                    animate={{ x: [0, 6, 0], opacity: [0.25, 0.6, 0.25] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
                  >
                    →
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          BENEFITS GRID
      ═══════════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 relative" style={{ background: "rgba(5,5,16,0.95)" }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.04), transparent 70%)" }} />

        <div className="max-w-[1400px] mx-auto px-5 sm:px-8">
          <Reveal className="mb-16 sm:mb-24 text-center">
            <div className="flex flex-col items-center gap-5">
              <SectionLabel color="#fbbc00">Why QueryFlow</SectionLabel>
              <h2 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-[-0.04em] italic uppercase leading-[0.85]">
                Enterprise Features.<br />
                <span style={{
                  background: "linear-gradient(135deg, #fbbc00, #f472b6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>Consumer Simplicity.</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: "⚡", title: "Lightning Fast", color: "#fbbc00", desc: "Sub-5ms query response times with distributed architecture. Thousands of transactions simultaneously." },
              { icon: "🔐", title: "Military Grade", color: "#66dd8b", desc: "AES-256 encryption, zero-knowledge proofs, and FIPS 140-2 certification. Uncompromising security." },
              { icon: "🤖", title: "AI-Powered", color: "#8b5cf6", desc: "ML models predict trends, optimise taxes, and identify opportunities automatically." },
              { icon: "🌍", title: "Global Coverage", color: "#22d3ee", desc: "150+ fiat currencies, crypto assets, DeFi protocols. Trade worldwide seamlessly." },
              { icon: "📊", title: "Analytics Suite", color: "#f472b6", desc: "Custom dashboards, real-time reporting, institutional-grade analytics. Any export format." },
              { icon: "🚀", title: "Instant Setup", color: "#4182ff", desc: "Live in minutes. Comprehensive API docs, SDKs in 5+ languages, dedicated onboarding." },
            ].map((b, i) => <BenefitCard key={i} {...b} delay={i * 0.08} />)}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════ */}
      <section className="py-20 sm:py-32 text-center relative overflow-hidden" style={{ background: "#030308" }}>
        {/* Animated rings */}
        {[400, 650, 900].map((size, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
            style={{
              width: size,
              height: size,
              border: "1px solid rgba(65,130,255,0.06)",
            }}
            animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 5 + i * 2, repeat: Infinity, delay: i * 0.8 }}
          />
        ))}

        {/* Big glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(65,130,255,0.08), transparent 70%)" }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 px-5"
        >
          <h2 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-[-0.04em] italic uppercase leading-[0.78] mb-8">
            Ready to <br />
            <span style={{
              background: "linear-gradient(135deg, #4182ff, #8b5cf6, #22d3ee)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              Take Control?
            </span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Join thousands of finance professionals who've already transformed how they manage assets and analyse finances.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link to="/login">
              <motion.button
                whileHover={{ scale: 1.06, boxShadow: "0 0 70px rgba(65,130,255,0.6)" }}
                whileTap={{ scale: 0.95 }}
                className="px-14 py-5 font-black uppercase tracking-[0.4em] text-xl rounded-full text-white"
                style={{
                  background: "linear-gradient(135deg, #4182ff, #8b5cf6)",
                  boxShadow: "0 0 40px rgba(65,130,255,0.4)",
                }}
              >
                Get Started Free
              </motion.button>
            </Link>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="px-14 py-5 font-black uppercase tracking-[0.4em] text-xl rounded-full text-gray-400 hover:text-white transition-colors"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Book a Demo
            </motion.button>
          </div>

          <p className="text-gray-700 text-base font-black uppercase tracking-[1.2em]">
            No Credit Card · 14-Day Free Trial · Cancel Anytime
          </p>

          <div className="mt-16 flex justify-center gap-10 sm:gap-16 flex-wrap">
            {[
              { val: "1M+", label: "Transactions Tracked" },
              { val: "4.9/5", label: "User Rating" },
              { val: "24/7", label: "Customer Support" },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 + 0.3 }}
                whileHover={{ y: -5, scale: 1.05 }}
                className="text-center cursor-default"
              >
                <div className="text-2xl font-black mb-1" style={{
                  background: "linear-gradient(135deg, #4182ff, #8b5cf6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>{s.val}</div>
                <p className="text-gray-700 text-base font-black uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />

      {/* Global animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes logos {
          from { transform: translateX(0); }
          to { transform: translateX(-33.33%); }
        }
        .animate-logos {
          animation: logos 28s linear infinite;
          will-change: transform;
        }
        .animate-logos:hover {
          animation-play-state: paused;
        }
        body::-webkit-scrollbar { width: 4px; }
        body::-webkit-scrollbar-track { background: #030308; }
        body::-webkit-scrollbar-thumb { background: #1a1a2e; border-radius: 10px; }
        body::-webkit-scrollbar-thumb:hover { background: #4182ff; }
        ::selection { background: rgba(65,130,255,0.3); color: white; }
      `}} />
    </div>
  );
}