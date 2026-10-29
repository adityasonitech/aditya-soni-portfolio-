"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DUR, viewportOnce } from "../../lib/motion";

/**
 * Masked word-by-word text reveal.
 * Words rise out of an overflow-hidden mask, staggered left to right.
 *
 * Props:
 *  - as:      element tag (h1, h2, p, span...)
 *  - text:    the string to reveal
 *  - animate: optional controlled state ("hidden" | "show"); when omitted, reveals on scroll into view
 *  - delay:   seconds before the first word starts
 */
export default function Reveal({ as: Tag = "h2", text, className = "", delay = 0, animate, style }) {
  const reduce = useReducedMotion();
  const words = String(text ?? "").split(/\s+/).filter(Boolean);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: reduce ? 0 : delay } },
  };
  const word = {
    hidden: { y: reduce ? 0 : "110%", opacity: reduce ? 1 : 0 },
    show: { y: 0, opacity: 1, transition: { duration: DUR.slow, ease: EASE } },
  };

  const motionProps = animate
    ? { initial: "hidden", animate }
    : { initial: "hidden", whileInView: "show", viewport: viewportOnce };

  return (
    <Tag className={className} style={style} aria-label={text}>
      <motion.span variants={container} {...motionProps} aria-hidden="true">
        {words.map((w, i) => (
          <span key={`${w}-${i}`}>
            <span className="reveal-mask">
              <motion.span className="reveal-word" variants={word}>{w}</motion.span>
            </span>
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </motion.span>
    </Tag>
  );
}
