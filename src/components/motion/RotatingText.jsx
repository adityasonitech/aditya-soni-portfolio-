"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { EASE } from "../../lib/motion";

/** Cycles through phrases with a vertical slide. */
export default function RotatingText({ items = [], interval = 2600, className = "" }) {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const list = items.filter(Boolean);

  useEffect(() => {
    if (list.length <= 1 || reduce) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % list.length), interval);
    return () => clearInterval(t);
  }, [list.length, interval, reduce]);

  if (list.length === 0) return null;
  const current = list[index % list.length];

  return (
    <span className={`rotating ${className}`}>
      <AnimatePresence initial={false}>
        <motion.span
          key={current}
          className="rotating-item"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "-100%", opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
