"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import Reveal from "./motion/Reveal";
import FadeIn from "./motion/FadeIn";

export default function Skills() {
  const [data, setData] = useState({
    skills: [
      { id: 1, title: "Languages", list: "C, Java, Python, ABAP" },
      { id: 2, title: "Web Development", list: "HTML, CSS, JavaScript, PHP, React JS" },
      { id: 3, title: "Database Skills", list: "SQL, MySQL, Oracle, PhpMyAdmin" },
      { id: 4, title: "Tools & Others", list: "GitHub, VS Code, Jupyter Notebook, Google Colab, PowerBI" },
      { id: 5, title: "Soft Skills", list: "Communication, Teamwork, Time Management, Problem Solving, Leadership" }
    ]
  });

  useEffect(() => {
    const docRef = doc(db, "portfolio", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const fetchedData = docSnap.data();

        if (!fetchedData.skills && fetchedData.skill1Title) {
          fetchedData.skills = [1, 2, 3, 4, 5].map(i => ({
            id: i,
            title: fetchedData[`skill${i}Title`] || "",
            list: fetchedData[`skill${i}List`] || ""
          })).filter(s => s.title || s.list);
        }

        if (fetchedData.skills) {
          setData(prev => ({ ...prev, ...fetchedData }));
        }
      }
    }, (error) => {
      console.error("Error fetching Skills data:", error);
    });

    return () => unsubscribe();
  }, []);

  const categories = data.skills ? data.skills.map(s => ({
    title: s.title,
    skills: s.list ? s.list.split(",").map(val => val.trim()).filter(Boolean) : []
  })) : [];

  return (
    <section id="skills" className="section">
      <div className="section-header">
        <FadeIn as="span" className="eyebrow">Skills</FadeIn>
        <Reveal as="h2" className="section-title" text="Tools I work with" />
        <FadeIn as="p" className="section-lead" delay={0.25}>The languages, frameworks, and tooling I reach for day to day.</FadeIn>
      </div>

      <div className="grid grid-3">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.title || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="card card-pad card-hover"
          >
            <h3 style={{ fontSize: "0.8rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--text-faint)", marginBottom: "1rem" }}>
              {cat.title}
            </h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {cat.skills.map((skill) => (
                <span key={skill} className="chip chip-hover" style={{ color: "var(--foreground)" }}>{skill}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
