"use client";

import { useEffect, useState } from "react";
import { INTRO_EVENT } from "../../lib/motion";

/** True once the intro curtain has finished (or was skipped). Lets the hero start after it. */
export default function useIntroReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const onDone = () => setReady(true);
    if (window.__introDone) {
      const id = setTimeout(onDone, 0);
      return () => clearTimeout(id);
    }
    window.addEventListener(INTRO_EVENT, onDone);
    // Safety net: never leave the hero hidden if the intro component is missing
    const t = setTimeout(onDone, 2500);
    return () => {
      window.removeEventListener(INTRO_EVENT, onDone);
      clearTimeout(t);
    };
  }, []);

  return ready;
}
