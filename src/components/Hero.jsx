"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Hero() {
  const [data, setData] = useState({
    heroName: "Aditya Soni",
    heroTitle: "CSE Student & Developer",
    heroDesc: "I am a driven and curious Computer Engineering student, eager to apply my technical and problem-solving skills to build impactful web applications and digital experiences.",
    contactLinkedin: "aditya-soni-927ab5259",
    contactGithub: "adityajsoni25",
    contactEmail: "adityasoni.tech04@gmail.com"
  });

  useEffect(() => {
    const docRef = doc(db, "portfolio", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().heroName) {
        setData(prev => ({ ...prev, ...docSnap.data() }));
      }
    }, (error) => {
      console.error("Error fetching Hero data:", error);
    });

    return () => unsubscribe();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const item = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="top" className="hero">
      <div className="hero-glow" />
      <div className="grid-pattern" />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="hero-content"
      >
        <motion.div variants={item}>
          <span className="hero-status">
            <span className="status-dot" />
            Available for new opportunities
          </span>
        </motion.div>

        <motion.h1 variants={item} className="hero-title">
          {data.heroName}
        </motion.h1>

        <motion.h2 variants={item} className="hero-subtitle">
          {data.heroTitle}
        </motion.h2>

        <motion.p variants={item} className="hero-desc">
          {data.heroDesc}
        </motion.p>

        <motion.div variants={item} className="hero-actions">
          <a href="#projects" className="btn btn-primary">
            View Projects <ArrowRight size={16} />
          </a>
          <a href="#contact" className="btn btn-ghost">
            Contact Me
          </a>
          {data.resumeLink && (
            <a href={data.resumeLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              Resume <ArrowDown size={16} />
            </a>
          )}

          <div className="hero-social">
            <a href={`https://github.com/${data.contactGithub}`} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href={`https://linkedin.com/in/${data.contactLinkedin}`} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={`mailto:${data.contactEmail}`} className="btn-icon" aria-label="Email">
              <Mail size={18} />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
