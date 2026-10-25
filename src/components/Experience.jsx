"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import Reveal from "./motion/Reveal";
import FadeIn from "./motion/FadeIn";

export default function Experience() {
  const [data, setData] = useState({
    experiences: [
      { id: 1, year: "Present", role: "Full Stack Web Developer", company: "Growlity, Inc.", description: "Working as a Full Stack Web Developer leveraging technologies like React, Node.js, Express, MongoDB, and PostgreSQL." },
      { id: 2, year: "Summer Internship", role: "SAP Educate to Employ (E2E)", company: "SAP", description: "Completed hands-on training in ABAP development on SAP BTP, working on real-world backend business scenarios and custom development." },
      { id: 3, year: "2022 - 2026", role: "B.E. Computer Science Engineering (CGPA 8.56)", company: "Gujarat Technological University", description: "R. N. G. PATEL INSTITUTE OF TECHNOLOGY. Gained a solid grasp of programming, web technologies, and databases." }
    ]
  });

  useEffect(() => {
    const docRef = doc(db, "portfolio", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const fetchedData = docSnap.data();

        if (!fetchedData.experiences && fetchedData.exp1Year) {
          fetchedData.experiences = [1, 2, 3].map(i => ({
            id: i,
            year: fetchedData[`exp${i}Year`] || "",
            role: fetchedData[`exp${i}Role`] || "",
            company: fetchedData[`exp${i}Company`] || "",
            description: fetchedData[`exp${i}Desc`] || ""
          })).filter(e => e.year || e.role);
        }

        if (fetchedData.experiences) {
          setData(prev => ({ ...prev, ...fetchedData }));
        }
      }
    }, (error) => {
      console.error("Error fetching Experience data:", error);
    });

    return () => unsubscribe();
  }, []);

  const experiences = [...(data.experiences || [])].reverse();

  // The timeline line draws itself as the list scrolls through the viewport
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: timelineRef, offset: ["start 80%", "end 60%"] });
  const lineScale = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 });

  return (
    <section id="experience" className="section">
      <div className="split">
        <div className="section-header">
          <FadeIn as="span" className="eyebrow">Experience</FadeIn>
          <Reveal as="h2" className="section-title" text="My journey so far" />
          <FadeIn as="p" className="section-lead" delay={0.25}>Where I have worked, trained, and studied.</FadeIn>
        </div>

        <div className="timeline" ref={timelineRef}>
          <motion.div className="timeline-progress" style={{ scaleY: lineScale }} aria-hidden="true" />
          {experiences.map((exp, i) => (
            <motion.article
              key={exp.id || i}
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="timeline-item"
            >
              <div className="card card-pad card-hover">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                  <span className="chip chip-accent">{exp.year}</span>
                  {exp.location && <span style={{ color: "var(--text-faint)", fontSize: "0.85rem" }}>{exp.location}</span>}
                </div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "0.2rem" }}>{exp.role}</h3>
                <p style={{ color: "var(--primary)", fontWeight: 500, fontSize: "0.92rem", marginBottom: "0.75rem" }}>{exp.company}</p>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.65, fontSize: "0.92rem" }}>{exp.description}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
