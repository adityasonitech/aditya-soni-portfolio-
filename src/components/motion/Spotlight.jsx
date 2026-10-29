"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useMotionTemplate, useReducedMotion } from "framer-motion";

/** Soft radial glow that follows the cursor across the whole page. Hidden on touch devices via CSS. */
export default function Spotlight() {
  const reduce = useReducedMotion();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 120, damping: 24, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 120, damping: 24, mass: 0.4 });

  useEffect(() => {
    if (reduce) return;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => window.removeEventListener("mousemove", move);
  }, [x, y, reduce]);

  const background = useMotionTemplate`radial-gradient(640px circle at ${sx}px ${sy}px, rgba(139, 92, 246, 0.10), transparent 60%)`;

  if (reduce) return null;
  return <motion.div className="spotlight" style={{ background }} aria-hidden="true" />;
}
