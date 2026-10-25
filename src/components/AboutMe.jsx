"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import Reveal from "./motion/Reveal";
import FadeIn from "./motion/FadeIn";

const AnimatedNumber = ({ value }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (inView) {
      let start = 0;
      const duration = 1400;
      const stepTime = Math.max(16, Math.abs(Math.floor(duration / value)));
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= value) clearInterval(timer);
      }, stepTime);
      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return <span ref={ref}>{count}</span>;
};

export default function AboutMe() {
  const [data, setData] = useState({
    aboutText: "Driven and curious Computer Engineering student with a solid grasp of programming, web technologies, and databases. Eager to learn, adapt, and apply my technical and soft skills in dynamic, team-oriented environments to create meaningful impact.",
    cgpa: "8",
    cgpaDecimals: ".56",
    projectsCount: "3",
    certCount: "5"
  });

  useEffect(() => {
    const docRef = doc(db, "portfolio", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().aboutText) {
        setData(prev => ({ ...prev, ...docSnap.data() }));
      }
    }, (error) => {
      console.error("Error fetching About data:", error);
    });

    return () => unsubscribe();
  }, []);

  const stats = [
    { label: "CGPA", value: Number(data.cgpa) || 8, suffix: data.cgpaDecimals || ".56" },
    { label: "Projects", value: Number(data.projectsCount) || 3, suffix: "+" },
    { label: "Certifications", value: Number(data.certCount) || 5, suffix: "+" }
  ];

  return (
    <section id="about" className="section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="split"
      >
        <div className="section-header">
          <FadeIn as="span" className="eyebrow">About me</FadeIn>
          <Reveal as="h2" className="section-title" text="Building for the web, one problem at a time." />
          <FadeIn as="p" className="section-lead" delay={0.25}>{data.aboutText}</FadeIn>
        </div>

        <div className="stats">
          {stats.map((stat, i) => (
            <motion.article
              key={stat.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="card"
            >
              <div className="stat-value">
                <AnimatedNumber value={stat.value} />{stat.suffix}
              </div>
              <p className="stat-label">{stat.label}</p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
