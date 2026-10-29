"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, Github, Linkedin, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { EASE, DUR } from "../lib/motion";
import Reveal from "./motion/Reveal";
import RotatingText from "./motion/RotatingText";
import Magnetic from "./motion/Magnetic";
import Marquee from "./motion/Marquee";
import useIntroReady from "./motion/useIntroReady";

const DEFAULT_STACK = ["Next.js", "React", "Node.js", "Express", "MongoDB", "PostgreSQL", "TypeScript", "Firebase", "Tailwind CSS", "Git"];

export default function Hero() {
  const [data, setData] = useState({
    heroName: "Aditya Soni",
    heroTitle: "CSE Student & Developer",
    heroDesc: "I am a driven and curious Computer Engineering student, eager to apply my technical and problem-solving skills to build impactful web applications and digital experiences.",
    contactLinkedin: "aditya-soni-927ab5259",
    contactGithub: "adityajsoni25",
    contactEmail: "adityasoni.tech04@gmail.com"
  });
  const ready = useIntroReady();

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

  const state = ready ? "show" : "hidden";

  // Roles cycle through the main title plus any extra comma-separated roles from the dashboard
  const roles = [data.heroTitle, ...(data.heroRoles ? String(data.heroRoles).split(",") : ["Next.js Engineer", "MERN Stack Developer", "AI-Powered Builder"])]
    .map(r => r.trim())
    .filter(Boolean);

  // Marquee pulls from the skills list when present, otherwise a sensible default stack
  const stack = Array.isArray(data.skills) && data.skills.length
    ? data.skills.flatMap(s => (s.list || "").split(",").map(v => v.trim()).filter(Boolean)).filter(v => !/communication|teamwork|time management|problem solving|leadership/i.test(v))
    : DEFAULT_STACK;

  const fade = {
    hidden: { opacity: 0, y: 18 },
    show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
  };

  return (
    <section id="top" className="hero">
      <div className="aurora" aria-hidden="true">
        <span className="aurora-blob a1" />
        <span className="aurora-blob a2" />
        <span className="aurora-blob a3" />
      </div>
      <div className="grid-pattern" />

      <motion.div
        className="hero-content"
        initial="hidden"
        animate={state}
        variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } } }}
      >
        <motion.div variants={fade}>
          <span className="hero-status">
            <span className="status-dot" />
            Available for new opportunities
          </span>
        </motion.div>

        <Reveal as="h1" className="hero-title" text={data.heroName} animate={state} delay={0.25} />

        <motion.h2 variants={fade} className="hero-subtitle">
          <RotatingText items={roles} />
        </motion.h2>

        <motion.p variants={fade} className="hero-desc">
          {data.heroDesc}
        </motion.p>

        <motion.div variants={fade} className="hero-actions">
          <Magnetic>
            <a href="#projects" className="btn btn-primary btn-shimmer">
              View Projects <ArrowRight size={16} />
            </a>
          </Magnetic>
          <Magnetic>
            <a href="#contact" className="btn btn-ghost">
              Contact Me
            </a>
          </Magnetic>
          {data.resumeLink && (
            <Magnetic>
              <a href={data.resumeLink} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Resume <ArrowDown size={16} />
              </a>
            </Magnetic>
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

      <motion.div
        className="hero-marquee"
        initial={{ opacity: 0 }}
        animate={{ opacity: ready ? 1 : 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.9 }}
      >
        <Marquee items={stack} />
      </motion.div>
    </section>
  );
}
