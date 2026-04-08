import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  // Raw instantaneous hardware cursor location
  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  // Smooth, weighted outer ring 
  const ringX = useSpring(mx, { stiffness: 150, damping: 22, mass: 0.4 });
  const ringY = useSpring(my, { stiffness: 150, damping: 22, mass: 0.4 });

  // Dedicated spring trailing sparks (avoids horrible array setStates on mouse Move)
  const trail1X = useSpring(mx, { stiffness: 110, damping: 20, mass: 0.6 });
  const trail1Y = useSpring(my, { stiffness: 110, damping: 20, mass: 0.6 });

  const trail2X = useSpring(mx, { stiffness: 70, damping: 25, mass: 0.8 });
  const trail2Y = useSpring(my, { stiffness: 70, damping: 25, mass: 0.8 });

  useEffect(() => {
    // Detect mobile touch devices immediately to abort DOM overhead
    const mobile = window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768;
    setIsMobile(mobile);
    if (mobile) return;

    let isVisibleLocal = false;

    // Fast, React-State-Free Mouse Move Update
    const onMove = (e) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      
      if (!isVisibleLocal) {
        setVisible(true);
        isVisibleLocal = true;
      }
    };

    const onLeaveWindow = () => {
      setVisible(false);
      isVisibleLocal = false;
    };

    const onDown = () => setClicking(true);
    const onUp = () => setClicking(false);

    // Event Delegation: Check hover states efficiently using mouseover/out
    // This avoids per-pixel DOM tree traversal during mousemove
    const onMouseOver = (e) => {
      if (e.target.closest("button, a, [role='button'], input, textarea, select, label, [data-hover]")) {
        setHovering(true);
      }
    };
    const onMouseOut = (e) => {
      if (e.target.closest("button, a, [role='button'], input, textarea, select, label, [data-hover]")) {
        setHovering(false);
      }
    };

    // Add passive listeners for maximum performance
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    window.addEventListener("mouseout", onMouseOut, { passive: true });
    document.addEventListener("mouseleave", onLeaveWindow);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("mouseup", onUp);

    

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("mouseleave", onLeaveWindow);
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseup", onUp);

    };
  }, [mx, my]);

  if (isMobile) return null;

  return (
    <div 
      style={{ 
        opacity: visible ? 1 : 0, 
        transition: "opacity 0.3s ease", 
        pointerEvents: "none", 
        zIndex: 9999, 
        position: "fixed", 
        inset: 0 
      }}
    >
      <style>{`
        * {
          cursor: none !important;
        }
      `}</style>
      {/* Sparkle Trail 2 */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{ x: trail2X, y: trail2Y }}
      >
        <div
          className="rounded-full mix-blend-screen"
          style={{
            width: 5,
            height: 5,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, #8b5cf6, #4182ff)",
            opacity: hovering ? 0 : 0.4,
            transition: "opacity 0.2s ease",
          }}
        />
      </motion.div>
      {/* Sparkle Trail 1 */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{ x: trail1X, y: trail1Y }}
      >
        <div
          className="rounded-full mix-blend-screen"
          style={{
            width: 8,
            height: 8,
            transform: "translate(-50%, -50%)",
            background: "radial-gradient(circle, #8b5cf6, #4182ff)",
            opacity: hovering ? 0 : 0.7,
            transition: "opacity 0.2s ease",
          }}
        />
      </motion.div>

      {/* Outer Ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{ x: ringX, y: ringY }}
      >
        <div
          className="rounded-full flex items-center justify-center mix-blend-screen"
          style={{
            width: hovering ? 60 : clicking ? 30 : 45,
            height: hovering ? 60 : clicking ? 30 : 45,
            transform: "translate(-50%, -50%)",
            border: hovering
              ? "1.5px solid rgba(139,92,246,0.9)"
              : clicking 
              ? "1.5px solid rgba(0,255,136,0.8)"
              : "1.5px solid rgba(65,130,255,0.4)",
            background: hovering ? "rgba(139,92,246,0.05)" : clicking ? "rgba(0,255,136,0.1)" : "transparent",
            boxShadow: hovering ? "0 0 20px rgba(139,92,246,0.3)" : "none",
            transition: "width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), border 0.2s ease, background 0.2s ease, box-shadow 0.2s ease",
          }}
        />
      </motion.div>

      {/* True-center hardware dot (Zero lag) */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none"
        style={{ x: mx, y: my }}
      >
        <div
          className="rounded-full backdrop-blur-sm"
          style={{
            width: clicking ? 4 : hovering ? 8 : 6,
            height: clicking ? 4 : hovering ? 8 : 6,
            transform: "translate(-50%, -50%)",
            background: hovering ? "#8b5cf6" : clicking ? "#00ff88" : "#4182ff",
            boxShadow: hovering ? "0 0 15px rgba(139,92,246,0.8)" : clicking ? "0 0 15px rgba(0,255,136,0.8)" : "0 0 10px rgba(65,130,255,0.8)",
            transition: "width 0.15s ease, height 0.15s ease, background 0.15s ease, box-shadow 0.15s ease",
          }}
        />
      </motion.div>
    </div>
  );
}