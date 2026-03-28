import React, { useEffect, useRef } from "react";

export default function MatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ$¥€£";
    const fontSize = 14;
    const columns = width / fontSize;
    const drops = new Array(Math.floor(columns)).fill(1);

    const draw = () => {
      ctx.fillStyle = "rgba(8, 8, 8, 0.05)"; // Fades old frames
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "#4182ff"; // Your QueryFlow Blue
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-20 pointer-events-none" />;
}