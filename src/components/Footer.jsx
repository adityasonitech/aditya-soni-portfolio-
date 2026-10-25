"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Footer() {
  const [name, setName] = useState("Aditya Soni");
  const [links, setLinks] = useState({ github: "adityajsoni25", linkedin: "aditya-soni-927ab5259", resume: "" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const docRef = doc(db, "portfolio", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.heroName) setName(data.heroName);
          setLinks(prev => ({
            github: data.contactGithub || prev.github,
            linkedin: data.contactLinkedin || prev.linkedin,
            resume: data.resumeLink || prev.resume
          }));
        }
      } catch (error) {
        console.error("Error fetching Footer data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-inner">
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", color: "var(--text-muted)" }}>
          <Image src="/logo.png" alt="" width={24} height={24} style={{ borderRadius: "6px", border: "1px solid var(--border)" }} />
          <span>© {new Date().getFullYear()} {name}</span>
        </div>

        <div className="footer-links">
          <a href={`https://github.com/${links.github}`} target="_blank" rel="noopener noreferrer" className="link-muted">GitHub</a>
          <a href={`https://linkedin.com/in/${links.linkedin}`} target="_blank" rel="noopener noreferrer" className="link-muted">LinkedIn</a>
          {links.resume && (
            <a href={links.resume} target="_blank" rel="noopener noreferrer" className="link-muted">Resume</a>
          )}
          <a href="#top" className="link-muted">Back to top</a>
        </div>
      </div>
    </footer>
  );
}
