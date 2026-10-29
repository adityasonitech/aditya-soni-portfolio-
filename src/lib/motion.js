// One easing curve and one timing scale for the whole site.
export const EASE = [0.22, 1, 0.36, 1];

export const DUR = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
};

export const viewportOnce = { once: true, margin: "-80px" };

export const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.base, ease: EASE } },
};

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1, transition: { duration: DUR.base, ease: EASE } },
};

export const stagger = (staggerChildren = 0.08, delayChildren = 0) => ({
  hidden: {},
  show: { transition: { staggerChildren, delayChildren } },
});

export const INTRO_EVENT = "intro:done";
