"use client";

import { motion } from "framer-motion";
import { Code, Layout, Smartphone, Server, Database } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Services() {
  const [data, setData] = useState({
    services: [
      { id: 1, title: "Web Development", description: "I build fast, interactive, and responsive websites tailored to your brand.", icon: "Layout" },
      { id: 2, title: "UI/UX & Landing Pages", description: "Designing beautiful, conversion-focused landing pages with modern aesthetics.", icon: "Smartphone" },
      { id: 3, title: "Full Stack Apps", description: "End-to-end web application development combining robust backend APIs with fluid frontends.", icon: "Server" },
      { id: 4, title: "Mobile-First Design", description: "Ensuring your website looks incredible and works flawlessly on any device natively.", icon: "Code" }
    ]
  });

  useEffect(() => {
    const docRef = doc(db, "portfolio", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const fetchedData = docSnap.data();

        if (!fetchedData.services && fetchedData.srv1Title) {
          const staticIcons = ["Layout", "Smartphone", "Server", "Code"];
          fetchedData.services = [1, 2, 3, 4].map((i, index) => ({
            id: i,
            title: fetchedData[`srv${i}Title`] || "",
            description: fetchedData[`srv${i}Desc`] || "",
            icon: staticIcons[index]
          })).filter(s => s.title || s.description);
        }

        if (fetchedData.services) {
          setData(prev => ({ ...prev, ...fetchedData }));
        }
      }
    }, (error) => {
      console.error("Error fetching Services data:", error);
    });

    return () => unsubscribe();
  }, []);

  const iconMap = { Layout, Smartphone, Server, Code, Database };

  const services = (data.services || []).map(s => ({
    ...s,
    icon: iconMap[s.icon] || Code
  }));

  return (
    <section id="services" className="section">
      <div className="section-header">
        <span className="eyebrow">Services</span>
        <h2 className="section-title">What I can help with</h2>
      </div>

      <div className="grid grid-2">
        {services.map((service, i) => (
          <motion.article
            key={service.id || i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
            className="card card-pad"
            style={{ display: "flex", gap: "1.25rem", alignItems: "flex-start" }}
          >
            <div className="icon-box"><service.icon size={20} /></div>
            <div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 600, letterSpacing: "-0.01em", marginBottom: "0.4rem" }}>{service.title}</h3>
              <p style={{ color: "var(--text-muted)", lineHeight: 1.65, fontSize: "0.92rem" }}>{service.description}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
