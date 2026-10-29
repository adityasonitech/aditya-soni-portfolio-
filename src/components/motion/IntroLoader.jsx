"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE, INTRO_EVENT } from "../../lib/motion";

const KEY = "introShown";

function finish() {
  window.__introDone = true;
  window.dispatchEvent(new Event(INTRO_EVENT));
}

/**
 * One-time intro: the name rises out of a mask, then the curtain wipes up.
 * Shows once per browser session. Fires `intro:done` so the hero can start after it.
 */
export default function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let seen = true;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
      if (!seen) sessionStorage.setItem(KEY, "1");
    } catch {
      seen = true;
    }

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      finish();
      return;
    }

    // Deferred one tick (not rAF: rAF never fires in a background tab)
    const start = setTimeout(() => setShow(true), 0);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = "";
      finish();
    }, 1500);
    return () => {
      clearTimeout(start);
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="intro"
          initial={{ y: 0 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: EASE } }}
          aria-hidden="true"
        >
          <span className="intro-mask">
            <motion.span
              className="intro-text"
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
            >
              Aditya Soni
            </motion.span>
          </span>
          <motion.span
            className="intro-bar"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
