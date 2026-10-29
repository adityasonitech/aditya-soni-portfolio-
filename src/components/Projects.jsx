"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, FolderGit2 } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import Reveal from "./motion/Reveal";
import FadeIn from "./motion/FadeIn";
import TiltCard from "./motion/TiltCard";

export default function Projects() {
  const [data, setData] = useState({
    projects: [
      { id: 1, title: "Scan2Health", description: "A health-aware barcode scanner web app enabling users to access comprehensive nutritional data, ingredient lists, and health impact assessments.", image: "", tech: "Web App, Frontend, Backend", github: "", showGithub: true, live: "", showLive: true },
      { id: 2, title: "Customer Order Tracking System", description: "A cloud-ready SAP ABAP application built using RAP. Integrates customer, product, and order data with CDS views and OData services supporting complete CRUD operations.", image: "", tech: "SAP ABAP, RAP, OData", github: "", showGithub: true, live: "", showLive: true },
      { id: 3, title: "Database Administration", description: "Designed and normalized relational databases in Oracle/MySQL with constraints, indexes, and triggers to ensure secure and efficient operations.", image: "", tech: "Oracle, MySQL, DB Design", github: "", showGithub: true, live: "", showLive: true }
    ]
  });

  useEffect(() => {
    const docRef = doc(db, "portfolio", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const fetchedData = docSnap.data();

        if (!fetchedData.projects && fetchedData.proj1Title) {
          fetchedData.projects = [1, 2, 3].map(i => ({
            id: i,
            title: fetchedData[`proj${i}Title`] || "",
            description: fetchedData[`proj${i}Desc`] || "",
            image: "",
            tech: "",
            github: "",
            showGithub: true,
            live: "",
            showLive: true
          })).filter(p => p.title || p.description);
        }

        if (fetchedData.projects) {
          setData(prev => ({ ...prev, ...fetchedData }));
        }
      }
    }, (error) => {
      console.error("Error fetching Projects data:", error);
    });

    return () => unsubscribe();
  }, []);

  const projects = data.projects || [];

  // A link is only shown when it points somewhere real (not empty, not the "#" placeholder)
  const isRealUrl = (url) => typeof url === "string" && /^https?:\/\//i.test(url.trim());

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const card = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="projects" className="section">
      <div className="section-header">
        <FadeIn as="span" className="eyebrow">Projects</FadeIn>
        <Reveal as="h2" className="section-title" text="Selected work" />
        <FadeIn as="p" className="section-lead" delay={0.25}>A few things I have built recently.</FadeIn>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-3"
      >
        {projects.map((project, idx) => {
          const tags = project.tech ? project.tech.split(",").map(t => t.trim()).filter(Boolean) : [];
          const showGithub = project.showGithub !== false && isRealUrl(project.github);
          const showLive = project.showLive !== false && isRealUrl(project.live);

          return (
            <motion.div key={project.id || idx} variants={card} style={{ display: "flex" }}>
            <TiltCard
              className="card project-card"
              style={{ display: "flex", flexDirection: "column", overflow: "hidden", width: "100%" }}
            >
              <div style={{
                position: "relative",
                height: "180px",
                background: "linear-gradient(160deg, rgba(139, 92, 246, 0.18), rgba(99, 102, 241, 0.06) 60%, transparent)",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "rgba(167, 139, 250, 0.45)"
              }}>
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="project-img"
                    style={{ objectFit: "cover" }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <FolderGit2 size={40} strokeWidth={1.25} />
                )}
              </div>

              <div className="card-pad" style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flexGrow: 1 }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 600, letterSpacing: "-0.01em" }}>{project.title}</h3>
                <p style={{ color: "var(--text-muted)", lineHeight: 1.65, fontSize: "0.92rem", flexGrow: 1 }}>
                  {project.description}
                </p>

                {tags.length > 0 && (
                  <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
                    {tags.map((tag) => (
                      <span key={tag} className="chip">{tag}</span>
                    ))}
                  </div>
                )}

                {(showGithub || showLive) && (
                  <div style={{ display: "flex", gap: "1.25rem", paddingTop: "1rem", marginTop: "0.25rem", borderTop: "1px solid var(--border)" }}>
                    {showGithub && (
                      <a
                        href={project.github.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-muted"
                        aria-label={`View ${project.title} code on GitHub`}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}
                      >
                        <Github size={15} /> Code
                      </a>
                    )}
                    {showLive && (
                      <a
                        href={project.live.trim()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-muted"
                        aria-label={`View live demo of ${project.title}`}
                        style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.85rem", fontWeight: 500 }}
                      >
                        <ExternalLink size={15} /> Live demo
                      </a>
                    )}
                  </div>
                )}
              </div>
            </TiltCard>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
