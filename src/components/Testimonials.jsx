"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import Reveal from "./motion/Reveal";
import FadeIn from "./motion/FadeIn";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";

export default function Testimonials() {
  const [data, setData] = useState({
    showTestimonials: true,
    testimonials: []
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const docRef = doc(db, "portfolio", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(prev => ({ ...prev, ...docSnap.data() }));
      }
    }, (error) => {
      console.error("Error fetching Testimonials:", error);
    });

    return () => unsubscribe();
  }, []);

  const visibleTestimonials = (data.testimonials || []).filter(t => t.show !== false);

  // Auto-play logic
  useEffect(() => {
    if (visibleTestimonials.length <= 1) return;

    const timer = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % visibleTestimonials.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [visibleTestimonials.length]);

  if (!data.showTestimonials || visibleTestimonials.length === 0) return null;

  const safeIndex = currentIndex % visibleTestimonials.length;
  const current = visibleTestimonials[safeIndex];

  const nextTestimonial = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % visibleTestimonials.length);
  };

  const prevTestimonial = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + visibleTestimonials.length) % visibleTestimonials.length);
  };

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 40 : -40, opacity: 0 })
  };

  return (
    <section id="testimonials" className="section">
      <div className="section-header center">
        <FadeIn as="span" className="eyebrow">Testimonials</FadeIn>
        <Reveal as="h2" className="section-title" text="What people say" />
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        <div style={{ position: "relative", minHeight: "240px" }}>
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.article
              key={safeIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="card"
              style={{ padding: "2.25rem", textAlign: "center", display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              <div style={{ display: "flex", justifyContent: "center", color: "var(--primary)", opacity: 0.6 }}>
                <Quote size={28} />
              </div>

              <p style={{ fontSize: "clamp(1rem, 2vw, 1.2rem)", lineHeight: 1.7, color: "var(--foreground)" }}>
                &quot;{current.quote}&quot;
              </p>

              <div>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 600 }}>{current.author}</h4>
                <p style={{ color: "var(--text-faint)", fontSize: "0.82rem", marginTop: "0.2rem", overflowWrap: "anywhere" }}>
                  {current.role}
                </p>
              </div>
            </motion.article>
          </AnimatePresence>
        </div>

        {visibleTestimonials.length > 1 && (
          <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem" }}>
            <button onClick={prevTestimonial} className="btn-icon" aria-label="Previous testimonial">
              <ChevronLeft size={18} />
            </button>

            <div style={{ display: "flex", gap: "0.4rem" }}>
              {visibleTestimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > safeIndex ? 1 : -1); setCurrentIndex(i); }}
                  aria-label={`Go to testimonial ${i + 1}`}
                  style={{
                    width: i === safeIndex ? "18px" : "6px",
                    height: "6px",
                    padding: 0,
                    border: "none",
                    borderRadius: "3px",
                    background: i === safeIndex ? "var(--primary)" : "rgba(255,255,255,0.18)",
                    cursor: "pointer",
                    transition: "0.3s ease"
                  }}
                />
              ))}
            </div>

            <button onClick={nextTestimonial} className="btn-icon" aria-label="Next testimonial">
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
