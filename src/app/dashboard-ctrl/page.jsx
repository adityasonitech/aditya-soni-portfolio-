"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, User, Home, BookOpen, Settings, LogOut, ChevronRight } from "lucide-react";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");
  const [data, setData] = useState({
    heroName: "Aditya Soni",
    heroTitle: "CSE Student & Developer",
    heroDesc: "I am a driven and curious Computer Engineering student, eager to apply my technical and problem-solving skills to build impactful web applications and digital experiences.",
    aboutText: "Driven and curious Computer Engineering student with a solid grasp of programming, web technologies, and databases. Eager to learn, adapt, and apply my technical and soft skills in dynamic, team-oriented environments to create meaningful impact.",
    cgpa: "8",
    cgpaDecimals: ".56",
    projectsCount: "3",
    certCount: "5",
    contactEmail: "adityasoni.tech04@gmail.com",
    contactPhone: "9228127958",
    contactLocation: "Desra road, Bilimora 396321",
    contactLinkedin: "aditya-soni-927ab5259",
    contactGithub: "adityajsoni25",
    resumeLink: "",
    projects: [
      { id: 1, title: "Scan2Health", description: "A health-aware barcode scanner web app enabling users to access comprehensive nutritional data, ingredient lists, and health impact assessments.", image: "", tech: "Web App, Frontend, Backend", github: "", showGithub: true, live: "", showLive: true },
      { id: 2, title: "Customer Order Tracking System", description: "A cloud-ready SAP ABAP application built using RAP. Integrates customer, product, and order data with CDS views and OData services supporting complete CRUD operations.", image: "", tech: "SAP ABAP, RAP, OData", github: "", showGithub: true, live: "", showLive: true },
      { id: 3, title: "Database Administration", description: "Designed and normalized relational databases in Oracle/MySQL with constraints, indexes, and triggers to ensure secure and efficient operations.", image: "", tech: "Oracle, MySQL, DB Design", github: "", showGithub: true, live: "", showLive: true }
    ],
    experiences: [
      { id: 1, year: "Present", role: "Full Stack Web Developer", company: "Growlity, Inc.", description: "Working as a Full Stack Web Developer leveraging technologies like React, Node.js, Express, MongoDB, and PostgreSQL." },
      { id: 2, year: "Summer Internship", role: "SAP Educate to Employ (E2E)", company: "SAP", description: "Completed hands-on training in ABAP development on SAP BTP, working on real-world backend business scenarios and custom development." },
      { id: 3, year: "2022 - 2026", role: "B.E. Computer Science Engineering (CGPA 8.56)", company: "Gujarat Technological University", description: "R. N. G. PATEL INSTITUTE OF TECHNOLOGY. Gained a solid grasp of programming, web technologies, and databases." }
    ],
    services: [
      { id: 1, title: "Web Development", description: "I build fast, interactive, and responsive websites tailored to your brand.", icon: "Layout" },
      { id: 2, title: "UI/UX & Landing Pages", description: "Designing beautiful, conversion-focused landing pages with modern aesthetics.", icon: "Smartphone" },
      { id: 3, title: "Full Stack Apps", description: "End-to-end web application development combining robust backend APIs with fluid frontends.", icon: "Server" },
      { id: 4, title: "Mobile-First Design", description: "Ensuring your website looks incredible and works flawlessly on any device natively.", icon: "Code" }
    ],
    skills: [
      { id: 1, title: "Languages", list: "C, Java, Python, ABAP" },
      { id: 2, title: "Web Development", list: "HTML, CSS, JavaScript, PHP, React JS" },
      { id: 3, title: "Database Skills", list: "SQL, MySQL, Oracle, PhpMyAdmin" },
      { id: 4, title: "Tools & Others", list: "GitHub, VS Code, Jupyter Notebook, Google Colab, PowerBI" },
      { id: 5, title: "Soft Skills", list: "Communication, Teamwork, Time Management, Problem Solving, Leadership" }
    ],
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
    ],
    showTestimonials: true,
    testimonials: [
      {
        id: 1,
        quote: "Aditya built our website fast and with remarkable quality. The animations and attention to detail elevated our brand significantly.",
        author: "Sarah J.",
        role: "Startup Founder",
        show: true
      },
      {
        id: 2,
        quote: "An absolute professional. The communication was excellent, and the final Next.js product was incredibly performant.",
        author: "Michael T.",
        role: "Creative Director",
        show: true
      }
    ]
  });
  
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      if (sessionStorage.getItem("isAdminLoggedIn") !== "true") {
        router.push("/portal-access");
        return;
      }

      try {
        const docRef = doc(db, "portfolio", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedData = docSnap.data();
          
          // Migrate old skills if the new format doesn't exist
          if (!fetchedData.skills && fetchedData.skill1Title) {
            fetchedData.skills = [1, 2, 3, 4, 5].map(i => ({
              id: i,
              title: fetchedData[`skill${i}Title`] || "",
              list: fetchedData[`skill${i}List`] || ""
            })).filter(s => s.title || s.list);
          }

          // Migrate old experiences if new format doesn't exist
          if (!fetchedData.experiences && fetchedData.exp1Year) {
            fetchedData.experiences = [1, 2, 3].map(i => ({
              id: i,
              year: fetchedData[`exp${i}Year`] || "",
              role: fetchedData[`exp${i}Role`] || "",
              company: fetchedData[`exp${i}Company`] || "",
              description: fetchedData[`exp${i}Desc`] || ""
            })).filter(e => e.year || e.role);
          }
          
          // Migrate old projects if new format doesn't exist
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
          
          // Migrate old services if new format doesn't exist
          if (!fetchedData.services && fetchedData.srv1Title) {
            const staticIcons = ["Layout", "Smartphone", "Server", "Code"];
            fetchedData.services = [1, 2, 3, 4].map((i, index) => ({
              id: i,
              title: fetchedData[`srv${i}Title`] || "",
              description: fetchedData[`srv${i}Desc`] || "",
              icon: staticIcons[index]
            })).filter(s => s.title || s.description);
          }

          // Migrate old testimonials if new format doesn't exist
          if (!fetchedData.testimonials) {
            fetchedData.showTestimonials = true;
            fetchedData.testimonials = [
              {
                id: 1,
                quote: "Aditya built our website fast and with remarkable quality. The animations and attention to detail elevated our brand significantly.",
                author: "Sarah J.",
                role: "Startup Founder",
                show: true
              },
              {
                id: 2,
                quote: "An absolute professional. The communication was excellent, and the final Next.js product was incredibly performant.",
                author: "Michael T.",
                role: "Creative Director",
                show: true
              }
            ];
          }

          // Education defaults (if missing)
          if (typeof fetchedData.showEducation === "undefined") {
            fetchedData.showEducation = true;
          }

          if (!Array.isArray(fetchedData.education)) {
            fetchedData.education = [
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
            ];
          }
          
          setData((prev) => ({ ...prev, ...fetchedData }));
        } else {
          await setDoc(docRef, data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    checkAuthAndFetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    }
    sessionStorage.removeItem("isAdminLoggedIn");
    router.push("/portal-access");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (id, field, value) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleAddSkill = () => {
    const newId = Date.now();
    setData(prev => ({
      ...prev,
      skills: [...(prev.skills || []), { id: newId, title: "New Category", list: "" }]
    }));
  };

  const handleDeleteSkill = (id) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.id !== id)
    }));
  };

  const handleEducationChange = (id, field, value) => {
    setData(prev => ({
      ...prev,
      education: (prev.education || []).map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const handleAddEducation = () => {
    const newId = Date.now();
    setData(prev => ({
      ...prev,
      education: [...(prev.education || []), { id: newId, year: "", degree: "New Degree", institution: "", details: "" }]
    }));
  };

  const handleDeleteEducation = (id) => {
    setData(prev => ({
      ...prev,
      education: (prev.education || []).filter(e => e.id !== id)
    }));
  };

  const handleExperienceChange = (id, field, value) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.map(e => e.id === id ? { ...e, [field]: value } : e)
    }));
  };

  const handleAddExperience = () => {
    const newId = Date.now();
    // Prepend new experience to array so it appears at top
    setData(prev => ({
      ...prev,
      experiences: [{ id: newId, year: "", role: "New Role", company: "", description: "" }, ...(prev.experiences || [])]
    }));
  };

  const handleDeleteExperience = (id) => {
    setData(prev => ({
      ...prev,
      experiences: prev.experiences.filter(e => e.id !== id)
    }));
  };

  const handleProjectChange = (id, field, value) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === id ? { ...p, [field]: value } : p)
    }));
  };

  const handleAddProject = () => {
    const newId = Date.now();
    setData(prev => ({
      ...prev,
      projects: [{ id: newId, title: "New Project", description: "", image: "", tech: "", github: "", showGithub: true, live: "", showLive: true }, ...(prev.projects || [])]
    }));
  };

  const handleDeleteProject = (id) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id)
    }));
  };

  const handleServiceChange = (id, field, value) => {
    setData(prev => ({
      ...prev,
      services: prev.services.map(s => s.id === id ? { ...s, [field]: value } : s)
    }));
  };

  const handleAddService = () => {
    const newId = Date.now();
    setData(prev => ({
      ...prev,
      services: [...(prev.services || []), { id: newId, title: "New Service", description: "", icon: "Code" }]
    }));
  };

  const handleDeleteService = (id) => {
    setData(prev => ({
      ...prev,
      services: prev.services.filter(s => s.id !== id)
    }));
  };

  const handleTestimonialChange = (id, field, value) => {
    setData(prev => ({
      ...prev,
      testimonials: prev.testimonials.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const handleAddTestimonial = () => {
    const newId = Date.now();
    setData(prev => ({
      ...prev,
      testimonials: [{ id: newId, quote: "New Testimonial", author: "", role: "", show: true }, ...(prev.testimonials || [])]
    }));
  };

  const handleDeleteTestimonial = (id) => {
    setData(prev => ({
      ...prev,
      testimonials: prev.testimonials.filter(t => t.id !== id)
    }));
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const resp = await fetch("/api/update-portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (resp.ok) {
        alert("Changes saved and live!");
      } else if (resp.status === 401) {
        alert("Your session has expired. Please log in again.");
        sessionStorage.removeItem("isAdminLoggedIn");
        router.push("/portal-access");
      } else {
        const errData = await resp.json();
        alert(`Failed to save: ${errData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Failed to save data. Check network.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a0f", color: "white" }}>
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: 40, height: 40, border: "3px solid rgba(255,255,255,0.1)", borderTopColor: "var(--primary)", borderRadius: "50%" }} />
    </div>;
  }

  const navItems = [
    { id: "hero", label: "Hero Content", icon: Home },
    { id: "about", label: "About & Stats", icon: User },
    { id: "skills", label: "Skills", icon: BookOpen },
    { id: "education", label: "Education", icon: BookOpen },
    { id: "experience", label: "Work Experience", icon: BookOpen },
    { id: "projects", label: "Featured Projects", icon: BookOpen },
    { id: "services", label: "Services", icon: BookOpen },
    { id: "testimonials", label: "Testimonials", icon: BookOpen },
    { id: "contact", label: "Contact & Socials", icon: Settings },
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden", background: "#060608", color: "#e4e4e7", fontFamily: "'Inter', sans-serif" }}>
      
      {/* Sidebar */}
      <aside style={{
        width: "280px",
        background: "rgba(15, 15, 20, 0.95)",
        borderRight: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        flexDirection: "column",
        padding: "2rem 1.5rem",
        position: "sticky",
        top: 0,
        height: "100vh",
        overflowY: "auto"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
          <div style={{ background: "var(--gradient-1)", padding: "0.5rem", borderRadius: "8px" }}>
            <LayoutDashboard size={24} color="white" />
          </div>
          <span style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em" }}>SaaS Admin</span>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flexGrow: 1 }}>
          <p style={{ fontSize: "0.75rem", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "1px", marginBottom: "0.5rem" }}>Content Management</p>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1rem", borderRadius: "10px",
                border: "none", cursor: "pointer", fontSize: "0.95rem", fontWeight: 500, transition: "all 0.2s",
                background: activeTab === item.id ? "rgba(255,255,255,0.08)" : "transparent",
                color: activeTab === item.id ? "white" : "rgba(255,255,255,0.6)"
              }}
            >
              <item.icon size={18} color={activeTab === item.id ? "var(--primary)" : "currentColor"} />
              {item.label}
              {activeTab === item.id && <ChevronRight size={16} style={{ marginLeft: "auto", opacity: 0.5 }} />}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          style={{
            display: "flex", alignItems: "center", gap: "1rem", padding: "0.875rem 1rem", borderRadius: "10px",
            border: "none", cursor: "pointer", fontSize: "0.95rem", fontWeight: 500, background: "rgba(239, 68, 68, 0.1)",
            color: "#ef4444", transition: "all 0.2s", marginTop: "auto"
          }}
          onMouseOver={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.15)"}
          onMouseOut={e => e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)"}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100vh", overflowY: "auto" }}>
        
        {/* Top Header */}
        <header style={{
          height: "80px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 3rem", background: "rgba(10, 10, 14, 0.8)", backdropFilter: "blur(10px)", position: "sticky", top: 0, zIndex: 10, flexShrink: 0
        }}>
          <div>
            <h2 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 600 }}>{navItems.find(i => i.id === activeTab)?.label}</h2>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>Manage and update your website content in real-time.</p>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)" }}>Status: <span style={{ color: "#10b981" }}>Live</span></span>
            <button 
              onClick={handleSave}
              disabled={saving}
              style={{
                background: "var(--primary)", color: "white", padding: "0.6rem 1.5rem", borderRadius: "30px", fontSize: "0.875rem", fontWeight: 600, border: "none", cursor: saving ? "not-allowed" : "pointer", transition: "transform 0.2s",
                opacity: saving ? 0.7 : 1, boxShadow: "0 4px 14px rgba(139, 92, 246, 0.3)"
              }}
              onMouseOver={e => !saving && (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseOut={e => !saving && (e.currentTarget.style.transform = "translateY(0)")}
            >
              {saving ? "Deploying..." : "Publish Changes"}
            </button>
          </div>
        </header>

        {/* Form Content Area */}
        <div style={{ padding: "3rem", maxWidth: "900px", width: "100%" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "hero" && (
                <div className="glass-panel" style={{ padding: "2.5rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={labelStyle}>Hero Name</label>
                    <input name="heroName" value={data.heroName} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={labelStyle}>Hero Title</label>
                    <input name="heroTitle" value={data.heroTitle} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={labelStyle}>Hero Description</label>
                    <textarea name="heroDesc" value={data.heroDesc} onChange={handleChange} style={{...inputStyle, minHeight: "100px"}} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={labelStyle}>Resume Drive Link</label>
                    <input name="resumeLink" value={data.resumeLink || ""} onChange={handleChange} style={inputStyle} placeholder="https://drive.google.com/..." />
                    <span style={hintStyle}>Link to your resume (e.g. Google Drive link). Ensure it&apos;s shared as &apos;Anyone with the link&apos;.</span>
                  </div>
                </div>
              )}

              {activeTab === "about" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div className="glass-panel" style={{ padding: "2.5rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.125rem" }}>Detailed Background</h3>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      <label style={labelStyle}>About Text</label>
                      <textarea name="aboutText" value={data.aboutText} onChange={handleChange} style={{...inputStyle, minHeight: "150px"}} />
                      <span style={hintStyle}>Tell your story to potential clients and recruiters.</span>
                    </div>
                  </div>

                  <div className="glass-panel" style={{ padding: "2.5rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.125rem" }}>Key Statistics</h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", pading: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={labelStyle}>CGPA (Whole Number)</label>
                          <input name="cgpa" value={data.cgpa} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={labelStyle}>CGPA (Decimals)</label>
                          <input name="cgpaDecimals" value={data.cgpaDecimals} onChange={handleChange} style={inputStyle} />
                        </div>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", pading: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "12px", padding: "1.5rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={labelStyle}>Projects Completed</label>
                          <input name="projectsCount" value={data.projectsCount} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={labelStyle}>Certifications</label>
                          <input name="certCount" value={data.certCount} onChange={handleChange} style={inputStyle} />
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              )}

              {activeTab === "experience" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <button onClick={handleAddExperience} style={{ background: "rgba(255, 255, 255, 0.05)", color: "white", padding: "1.5rem", borderRadius: "16px", border: "2px dashed rgba(255, 255, 255, 0.2)", cursor: "pointer", fontWeight: "600", fontSize: "1rem", transition: "0.2s", marginBottom: "1rem" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.05)"}>+ Add New Experience</button>
                  {data.experiences?.map((exp, index) => (
                    <div key={exp.id} className="glass-panel" style={{ padding: "2rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: "0", fontSize: "1.125rem", color: "var(--accent)" }}>Experience Data (Position {index + 1})</h3>
                        <button onClick={() => handleDeleteExperience(exp.id)} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(239, 68, 68, 0.25)"} onMouseOut={e=>e.currentTarget.style.background="rgba(239, 68, 68, 0.15)"}>Delete</button>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={labelStyle}>Year / Duration</label>
                          <input value={exp.year} onChange={(e) => handleExperienceChange(exp.id, "year", e.target.value)} style={inputStyle} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                          <label style={labelStyle}>Company</label>
                          <input value={exp.company} onChange={(e) => handleExperienceChange(exp.id, "company", e.target.value)} style={inputStyle} />
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Role</label>
                        <input value={exp.role} onChange={(e) => handleExperienceChange(exp.id, "role", e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Description</label>
                        <textarea value={exp.description} onChange={(e) => handleExperienceChange(exp.id, "description", e.target.value)} style={{...inputStyle, minHeight: "80px"}} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "projects" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <button onClick={handleAddProject} style={{ background: "rgba(255, 255, 255, 0.05)", color: "white", padding: "1.5rem", borderRadius: "16px", border: "2px dashed rgba(255, 255, 255, 0.2)", cursor: "pointer", fontWeight: "600", fontSize: "1rem", transition: "0.2s", marginBottom: "1rem" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.05)"}>+ Add New Project</button>
                  {data.projects?.map((proj, index) => (
                    <div key={proj.id} className="glass-panel" style={{ padding: "2rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: "0", fontSize: "1.125rem", color: "var(--primary)" }}>Project Data (Position {index + 1})</h3>
                        <button onClick={() => handleDeleteProject(proj.id)} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(239, 68, 68, 0.25)"} onMouseOut={e=>e.currentTarget.style.background="rgba(239, 68, 68, 0.15)"}>Delete</button>
                      </div>
                      
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Project Name</label>
                        <input value={proj.title} onChange={(e) => handleProjectChange(proj.id, "title", e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Description</label>
                        <textarea value={proj.description} onChange={(e) => handleProjectChange(proj.id, "description", e.target.value)} style={{...inputStyle, minHeight: "80px"}} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Image URL</label>
                        <input value={proj.image || ""} onChange={(e) => handleProjectChange(proj.id, "image", e.target.value)} style={inputStyle} placeholder="https://..." />
                        <span style={hintStyle}>Enter a direct link to the image. Will use a gradient fallback if empty.</span>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Technologies Used (Comma Separated)</label>
                        <input value={proj.tech || ""} onChange={(e) => handleProjectChange(proj.id, "tech", e.target.value)} style={inputStyle} placeholder="React, Node, MongoDB" />
                      </div>
                      
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", background: "rgba(0,0,0,0.2)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label style={labelStyle}>Code Base Link</label>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                              <input type="checkbox" checked={proj.showGithub !== false} onChange={(e) => handleProjectChange(proj.id, "showGithub", e.target.checked)} />
                              <span style={hintStyle}>Show Button</span>
                            </label>
                          </div>
                          <input value={proj.github || ""} onChange={(e) => handleProjectChange(proj.id, "github", e.target.value)} style={inputStyle} placeholder="https://github.com/..." />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <label style={labelStyle}>Live Demo Link</label>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                              <input type="checkbox" checked={proj.showLive !== false} onChange={(e) => handleProjectChange(proj.id, "showLive", e.target.checked)} />
                              <span style={hintStyle}>Show Button</span>
                            </label>
                          </div>
                          <input value={proj.live || ""} onChange={(e) => handleProjectChange(proj.id, "live", e.target.value)} style={inputStyle} placeholder="https://..." />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "services" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <button onClick={handleAddService} style={{ background: "rgba(255, 255, 255, 0.05)", color: "white", padding: "1.5rem", borderRadius: "16px", border: "2px dashed rgba(255, 255, 255, 0.2)", cursor: "pointer", fontWeight: "600", fontSize: "1rem", transition: "0.2s", marginBottom: "1rem" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.05)"}>+ Add New Service</button>
                  {data.services?.map((srv, index) => (
                    <div key={srv.id} className="glass-panel" style={{ padding: "2rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: "0", fontSize: "1.125rem", color: "var(--accent)" }}>Service Data (Position {index + 1})</h3>
                        <button onClick={() => handleDeleteService(srv.id)} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(239, 68, 68, 0.25)"} onMouseOut={e=>e.currentTarget.style.background="rgba(239, 68, 68, 0.15)"}>Delete</button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Service Title</label>
                        <input value={srv.title} onChange={(e) => handleServiceChange(srv.id, "title", e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Description</label>
                        <textarea value={srv.description} onChange={(e) => handleServiceChange(srv.id, "description", e.target.value)} style={{...inputStyle, minHeight: "80px"}} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Icon Name</label>
                        <select value={srv.icon || "Code"} onChange={(e) => handleServiceChange(srv.id, "icon", e.target.value)} style={inputStyle}>
                          <option value="Layout">Layout</option>
                          <option value="Smartphone">Smartphone</option>
                          <option value="Server">Server</option>
                          <option value="Code">Code</option>
                          <option value="Database">Database</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "skills" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  {data.skills?.map((skill, index) => (
                    <div key={skill.id} className="glass-panel" style={{ padding: "2rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: "0", fontSize: "1.125rem", color: "var(--primary)" }}>Skill Category {index + 1}</h3>
                        <button onClick={() => handleDeleteSkill(skill.id)} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(239, 68, 68, 0.25)"} onMouseOut={e=>e.currentTarget.style.background="rgba(239, 68, 68, 0.15)"}>Delete</button>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Category Name</label>
                        <input value={skill.title} onChange={(e) => handleSkillChange(skill.id, "title", e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Skills (Comma Separated)</label>
                        <textarea value={skill.list} onChange={(e) => handleSkillChange(skill.id, "list", e.target.value)} style={{...inputStyle, minHeight: "80px"}} />
                      </div>
                    </div>
                  ))}
                  <button onClick={handleAddSkill} style={{ background: "rgba(255, 255, 255, 0.05)", color: "white", padding: "1.5rem", borderRadius: "16px", border: "2px dashed rgba(255, 255, 255, 0.2)", cursor: "pointer", fontWeight: "600", fontSize: "1rem", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.05)"}>+ Add New Category</button>
                </div>
              )}

              {activeTab === "education" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div className="glass-panel" style={{ padding: "2rem", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ margin: "0", fontSize: "1.125rem", color: "var(--accent)" }}>Global Visibility</h3>
                      <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>Show or hide the Education section on the homepage.</p>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: data.showEducation ? "var(--primary)" : "rgba(255,255,255,0.4)" }}>{data.showEducation ? "VISIBLE" : "HIDDEN"}</span>
                      <input type="checkbox" checked={data.showEducation !== false} onChange={(e) => setData(prev => ({...prev, showEducation: e.target.checked}))} style={{ width: "40px", height: "20px" }} />
                    </label>
                  </div>

                  <button onClick={handleAddEducation} style={{ background: "rgba(255, 255, 255, 0.05)", color: "white", padding: "1.5rem", borderRadius: "16px", border: "2px dashed rgba(255, 255, 255, 0.2)", cursor: "pointer", fontWeight: "600", fontSize: "1rem", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.05)"}>+ Add New Education</button>

                  {data.education?.map((edu, index) => (
                    <div key={edu.id} className="glass-panel" style={{ padding: "2rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: "0", fontSize: "1.125rem", color: "var(--primary)" }}>Education {index + 1}</h3>
                        <button onClick={() => handleDeleteEducation(edu.id)} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(239, 68, 68, 0.25)"} onMouseOut={e=>e.currentTarget.style.background="rgba(239, 68, 68, 0.15)"}>Delete</button>
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Year</label>
                        <input value={edu.year || ""} onChange={(e) => handleEducationChange(edu.id, "year", e.target.value)} style={inputStyle} placeholder="e.g. 2022 - 2026" />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Degree</label>
                        <input value={edu.degree || ""} onChange={(e) => handleEducationChange(edu.id, "degree", e.target.value)} style={inputStyle} />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Institution</label>
                        <input value={edu.institution || ""} onChange={(e) => handleEducationChange(edu.id, "institution", e.target.value)} style={inputStyle} />
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Details</label>
                        <textarea value={edu.details || ""} onChange={(e) => handleEducationChange(edu.id, "details", e.target.value)} style={{...inputStyle, minHeight: "100px"}} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "testimonials" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div className="glass-panel" style={{ padding: "2rem", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <h3 style={{ margin: "0", fontSize: "1.125rem", color: "var(--accent)" }}>Global Visibility</h3>
                      <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>Show or hide the Testimonials section on the homepage.</p>
                    </div>
                    <label style={{ display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                      <span style={{ fontSize: "0.875rem", fontWeight: 600, color: data.showTestimonials ? "var(--primary)" : "rgba(255,255,255,0.4)" }}>{data.showTestimonials ? "VISIBLE" : "HIDDEN"}</span>
                      <input type="checkbox" checked={data.showTestimonials} onChange={(e) => setData(prev => ({...prev, showTestimonials: e.target.checked}))} style={{ width: "40px", height: "20px" }} />
                    </label>
                  </div>

                  <button onClick={handleAddTestimonial} style={{ background: "rgba(255, 255, 255, 0.05)", color: "white", padding: "1.5rem", borderRadius: "16px", border: "2px dashed rgba(255, 255, 255, 0.2)", cursor: "pointer", fontWeight: "600", fontSize: "1rem", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.1)"} onMouseOut={e=>e.currentTarget.style.background="rgba(255, 255, 255, 0.05)"}>+ Add New Testimonial</button>
                  
                  {data.testimonials?.map((test, index) => (
                    <div key={test.id} className="glass-panel" style={{ padding: "2rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <h3 style={{ margin: "0", fontSize: "1.125rem", color: "var(--primary)" }}>Testimonial {index + 1}</h3>
                        <div style={{ display: "flex", gap: "1rem" }}>
                          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                            <input type="checkbox" checked={test.show !== false} onChange={(e) => handleTestimonialChange(test.id, "show", e.target.checked)} />
                            <span style={hintStyle}>Visible</span>
                          </label>
                          <button onClick={() => handleDeleteTestimonial(test.id)} style={{ background: "rgba(239, 68, 68, 0.15)", color: "#ef4444", border: "none", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "0.875rem" }}>Delete</button>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Client Name</label>
                        <input value={test.author} onChange={(e) => handleTestimonialChange(test.id, "author", e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        <label style={labelStyle}>Role / Company</label>
                        <input value={test.role} onChange={(e) => handleTestimonialChange(test.id, "role", e.target.value)} style={inputStyle} />
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                        <label style={labelStyle}>Feedback Quote</label>
                        <textarea value={test.quote} onChange={(e) => handleTestimonialChange(test.id, "quote", e.target.value)} style={{...inputStyle, minHeight: "80px"}} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "contact" && (
                <div className="glass-panel" style={{ padding: "2.5rem", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "2rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={labelStyle}>Email Address</label>
                    <input name="contactEmail" value={data.contactEmail} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={labelStyle}>Phone Number</label>
                    <input name="contactPhone" value={data.contactPhone} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={labelStyle}>Location / Address</label>
                    <input name="contactLocation" value={data.contactLocation} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={labelStyle}>LinkedIn Username</label>
                    <input name="contactLinkedin" value={data.contactLinkedin} onChange={handleChange} style={inputStyle} />
                    <span style={hintStyle}>e.g. aditya-soni-927ab5259</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={labelStyle}>GitHub Username</label>
                    <input name="contactGithub" value={data.contactGithub} onChange={handleChange} style={inputStyle} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "0.875rem 1rem", borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(0, 0, 0, 0.3)", color: "white", outline: "none", fontSize: "0.95rem", transition: "border 0.2s",
  fontFamily: "'Inter', sans-serif"
};

const labelStyle = {
  fontSize: "0.875rem", color: "rgba(255, 255, 255, 0.8)", fontWeight: 500
};

const hintStyle = {
  fontSize: "0.75rem", color: "rgba(255, 255, 255, 0.4)"
};
