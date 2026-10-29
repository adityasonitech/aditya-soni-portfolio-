"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * Card that tilts toward the cursor and carries a light "shine" that follows it.
 * The shine is drawn by CSS using the --mx / --my custom properties set here.
 */
export default function TiltCard({ children, className = "", style, max = 7, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const spring = { stiffness: 220, damping: 22, mass: 0.6 };
  const srx = useSpring(rx, spring);
  const sry = useSpring(ry, spring);

  const onMove = (e) => {
    const el = ref.current;
    if (!el || reduce) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set(-(py - 0.5) * max * 2);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div className="tilt-wrap">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className={`tilt ${className}`}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d", ...style }}
        {...rest}
      >
        {children}
      </motion.div>
    </div>
  );
}
