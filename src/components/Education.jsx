"use client";

import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import Reveal from "./motion/Reveal";
import FadeIn from "./motion/FadeIn";

export default function Education() {
  const [data, setData] = useState({
    showEducation: true,
    education: [
      {
        id: 1,
        year: "2022 - 2026",
        degree: "B.E. Computer Science Engineering",
        institution: "Gujarat Technological University",
        details: "R. N. G. PATEL INSTITUTE OF TECHNOLOGY (RNGPIT). Current CGPA: 8.56. Focus on Core CS subjects, Web Development, and Software Engineering."
      },
      {
        id: 2,
        year: "2020 - 2022",
        degree: "Higher Secondary Education (Class XII)",
        institution: "GS&HSEB",
        details: "Completed with Science Stream. Developed strong foundation in Mathematics and Physics."
      },
      {
        id: 3,
        year: "2018 - 2020",
        degree: "Secondary Education (Class X)",
        institution: "GSEB",
        details: "Foundation years focusing on broad academic excellence."
      }
    ]
  });

  useEffect(() => {
    const docRef = doc(db, "portfolio", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const fetchedData = docSnap.data();
        setData(prev => ({
          ...prev,
          showEducation: fetchedData.showEducation !== false,
          education: Array.isArray(fetchedData.education) ? fetchedData.education : prev.education
        }));
      }
    }, (error) => {
      console.error("Error fetching Education data:", error);
    });

    return () => unsubscribe();
  }, []);

  if (data.showEducation === false) {
    return null;
  }

  return (
    <section id="education" className="section">
      <div className="section-header">
        <FadeIn as="span" className="eyebrow">Education</FadeIn>
        <Reveal as="h2" className="section-title" text="Academic background" />
      </div>

      <div className="grid grid-3">
        {data.education.map((edu, i) => (
          <motion.article
            key={edu.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.08 }}
            className="card card-pad card-hover"
            style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}>
              <div className="icon-box"><GraduationCap size={20} /></div>
              <span className="chip">{edu.year}</span>
            </div>
            <div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "0.25rem" }}>{edu.degree}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--primary)", fontWeight: 500 }}>{edu.institution}</p>
            </div>
            <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.65 }}>{edu.details}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
