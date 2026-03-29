import React, { useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";



export default function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const springConfig = { damping: 25, stiffness: 700 };
  const sx = useSpring(cursorX, springConfig);
  const sy = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e) => {
      cursorX.set(e.clientX - 16);
      cursorY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      style={{ translateX: sx, translateY: sy }}
      className="fixed top-0 left-0 w-8 h-8 border border-[#4182ff] rounded-full pointer-events-none z-[9999] mix-blend-difference"
    />
  );
}