"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X } from "lucide-react";
import { EASE } from "../lib/motion";

const links = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  // Close the mobile menu when the viewport grows past the phone breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 769px)");
    const onChange = (e) => { if (e.matches) setOpen(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <motion.header
      className={`nav${scrolled ? " scrolled" : ""}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: EASE, delay: 0.2 }}
    >
      <div className="nav-inner">
        <a href="#top" className="nav-brand" aria-label="Back to top" onClick={() => setOpen(false)}>
          <Image src="/logo.png" alt="" width={30} height={30} priority />
          <span>Aditya Soni</span>
        </a>

        <nav className="nav-links" aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="nav-link">{link.label}</a>
          ))}
        </nav>

        <div className="nav-right">
          <a href="#contact" className="btn btn-primary nav-cta">
            Let&apos;s talk
          </a>
          <button
            type="button"
            className="btn-icon nav-toggle"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      <nav id="mobile-menu" className={`nav-menu${open ? " open" : ""}`} aria-label="Mobile">
        {links.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</a>
        ))}
        <a href="#contact" onClick={() => setOpen(false)} style={{ color: "var(--primary)", fontWeight: 600 }}>
          Let&apos;s talk
        </a>
      </nav>
    </motion.header>
  );
}
