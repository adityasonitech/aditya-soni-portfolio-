"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Linkedin, Github, ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Contact() {
  const [data, setData] = useState({
    contactEmail: "adityasoni.tech04@gmail.com",
    contactPhone: "9228127958",
    contactLocation: "Desra road, Bilimora 396321",
    contactLinkedin: "aditya-soni-927ab5259",
    contactGithub: "adityajsoni25"
  });

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  useEffect(() => {
    const docRef = doc(db, "portfolio", "main");
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setData(prev => ({ ...prev, ...docSnap.data() }));
      }
    }, (error) => {
      console.error("Error fetching Contact data:", error);
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const resp = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (resp.ok) {
        setStatus('success');
        setFormData({ name: "", email: "", message: "" });
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error("Submission error:", err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const contactItems = [
    { icon: Mail, label: "Email", value: data.contactEmail, href: `mailto:${data.contactEmail}` },
    { icon: Phone, label: "Phone", value: data.contactPhone, href: `tel:${data.contactPhone}` },
    { icon: MapPin, label: "Location", value: data.contactLocation },
  ];

  return (
    <section id="contact" className="section">
      <div className="split">
        <div>
          <div className="section-header" style={{ marginBottom: "1.75rem" }}>
            <span className="eyebrow">Contact</span>
            <h2 className="section-title">Let&apos;s build something together.</h2>
            <p className="section-lead">Have a project in mind, or just want to say hello? My inbox is always open.</p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {contactItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div className="icon-box" style={{ width: "40px", height: "40px" }}><item.icon size={18} /></div>
                <div>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>{item.label}</p>
                  {item.href ? (
                    <a href={item.href} className="link-muted" style={{ fontSize: "0.98rem", fontWeight: 500, color: "var(--foreground)" }}>{item.value}</a>
                  ) : (
                    <p style={{ fontSize: "0.98rem", fontWeight: 500 }}>{item.value}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1.75rem" }}>
            <a href={`https://github.com/${data.contactGithub}`} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href={`https://linkedin.com/in/${data.contactLinkedin}`} target="_blank" rel="noopener noreferrer" className="btn-icon" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </div>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="card card-pad"
          style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="contact-name" className="label">Name</label>
              <input
                id="contact-name"
                type="text"
                required
                maxLength={100}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="input"
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <label htmlFor="contact-email" className="label">Email</label>
              <input
                id="contact-email"
                type="email"
                required
                maxLength={254}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@example.com"
                className="input"
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
            <label htmlFor="contact-message" className="label">Message</label>
            <textarea
              id="contact-message"
              required
              maxLength={5000}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={5}
              placeholder="Tell me a little about your project..."
              className="input"
              style={{ resize: "vertical", minHeight: "120px" }}
            />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ marginTop: "0.25rem" }}>
            {isSubmitting ? "Sending..." : status === 'success' ? "Message sent" : "Send message"}
            {!isSubmitting && status !== 'success' && <ArrowRight size={16} />}
          </button>

          {status === 'success' && (
            <p style={{ color: '#22c55e', fontSize: '0.85rem', textAlign: 'center' }}>
              Thanks! I&apos;ll get back to you soon.
            </p>
          )}
          {status === 'error' && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', textAlign: 'center' }}>
              Something went wrong. Please try again.
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
}
