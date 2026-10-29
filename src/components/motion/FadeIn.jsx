"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE, DUR, viewportOnce } from "../../lib/motion";

/** Fade-and-rise wrapper. Reveals on scroll unless `animate` is given for controlled use. */
export default function FadeIn({ children, delay = 0, y = 20, className = "", style, animate, as = "div" }) {
  const reduce = useReducedMotion();
  const Comp = motion[as] || motion.div;

  const variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE, delay: reduce ? 0 : delay } },
  };

  const motionProps = animate
    ? { initial: "hidden", animate }
    : { initial: "hidden", whileInView: "show", viewport: viewportOnce };

  return (
    <Comp className={className} style={style} variants={variants} {...motionProps}>
      {children}
    </Comp>
  );
}
