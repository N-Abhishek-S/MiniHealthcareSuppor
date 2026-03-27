import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { icon: "🩺", title: "Medical Consultation", desc: "Connect with certified doctors for in-home or remote consultations within hours.", color: "#e8f4f0", accent: "#2d9b72", tag: "Most Requested" },
  { icon: "🚑", title: "Emergency Transport", desc: "24/7 medical transport services to hospitals, clinics, and care centres.", color: "#fef3ec", accent: "#e07b39", tag: "24/7 Available" },
  { icon: "💊", title: "Medication Delivery", desc: "Prescribed medicines delivered to your doorstep — same day, no delays.", color: "#edf0fe", accent: "#5560d4", tag: "Free Delivery" },
  { icon: "🧠", title: "Mental Health Support", desc: "Confidential counseling sessions with licensed therapists and social workers.", color: "#fdf0f5", accent: "#c45882", tag: "Private & Safe" },
  { icon: "🥗", title: "Nutrition Guidance", desc: "Personalised diet plans and nutritional counseling for recovery and wellness.", color: "#f0fae8", accent: "#5a9e2f", tag: "Personalized" },
  { icon: "🦾", title: "Physiotherapy", desc: "Rehabilitation exercises and physiotherapy sessions at home or facility.", color: "#fdf6e8", accent: "#c49a2a", tag: "At Home" },
];

const STEPS = [
  { num: "01", title: "Submit Your Request", desc: "Fill out a quick form describing your medical need, location, and urgency level." },
  { num: "02", title: "AI Matches You", desc: "Our system instantly finds the closest available volunteer with the right skills." },
  { num: "03", title: "Volunteer Confirmed", desc: "You receive a confirmation with your volunteer's details and estimated arrival." },
  { num: "04", title: "Care Delivered", desc: "Receive quality care and provide feedback to help improve the community." },
];

const TESTIMONIALS = [
  { quote: "Within 45 minutes of requesting help, a doctor arrived at our home. I was in tears — my mother finally got the care she needed.", name: "Priya Sharma", location: "Pune, Maharashtra", initials: "PS", color: "#2d9b72" },
  { quote: "The mental health counselor was compassionate and professional. This service changed my life during the hardest period.", name: "Arjun Mehta", location: "Mumbai, Maharashtra", initials: "AM", color: "#5560d4" },
  { quote: "We live far from the city. Having a physiotherapist come to our village for my father was unimaginable before this platform.", name: "Kavya Reddy", location: "Nashik, Maharashtra", initials: "KR", color: "#c45882" },
];

const STATS = [
  { value: "12,400+", label: "Patients Helped" },
  { value: "340+", label: "Active Volunteers" },
  { value: "28 min", label: "Avg. Response Time" },
  { value: "98%", label: "Satisfaction Rate" },
];

const FAQS = [
  { q: "Is this service free for patients?", a: "Yes — all patient support is completely free. Our volunteers donate their time and skills. There are no hidden charges." },
  { q: "How quickly can I get help?", a: "For non-emergency requests, typical response time is under 30 minutes. Emergency transport is available 24/7 with priority dispatch." },
  { q: "What areas do you currently serve?", a: "We currently operate across Maharashtra with active networks in Pune, Mumbai, Nashik, Nagpur, and Aurangabad. We're expanding fast." },
  { q: "Can I request a specific type of volunteer?", a: "Absolutely. When submitting a request you can specify the skill type, language preference, and whether you prefer a male or female volunteer." },
  { q: "What if my condition is very serious?", a: "Please call emergency services first (112). Our platform complements — not replaces — emergency medical services. We can assist with transport and follow-up care." },
];

export default function PatientSupportPage() {
  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", background: "#faf9f7", color: "#1a1a2e", overflowX: "hidden" }}>
      <HeroSection />
      <StatsBar />
      <ServicesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <RequestSection />
      <Footer />
    </div>
  );
}

function HeroSection() {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);
  const blobRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(blobRef.current, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.4, ease: "power3.out" });
      gsap.fromTo(titleRef.current, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", delay: 0.2 });
      gsap.fromTo(subRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.45 });
      gsap.fromTo(ctaRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out", delay: 0.65 });
      gsap.to(blobRef.current, { y: -20, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut" });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} style={{
      minHeight: "100vh", background: "linear-gradient(160deg, #0d1f3c 0%, #1a3a5c 45%, #0d2d40 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "6rem 1.5rem 4rem", position: "relative", overflow: "hidden", textAlign: "center",
    }}>
      <div ref={blobRef} style={{
        position: "absolute", top: "5%", right: "-8%", width: "520px", height: "520px",
        borderRadius: "60% 40% 70% 30% / 50% 60% 40% 70%",
        background: "radial-gradient(circle, rgba(45,155,114,0.22) 0%, rgba(45,155,114,0.04) 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "0%", left: "-5%", width: "380px", height: "380px",
        borderRadius: "40% 60% 30% 70% / 60% 40% 70% 30%",
        background: "radial-gradient(circle, rgba(85,96,212,0.2) 0%, rgba(85,96,212,0.03) 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "radial-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <div style={{ position: "relative", maxWidth: "780px", margin: "0 auto" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 1rem",
          borderRadius: "9999px", marginBottom: "1.75rem", background: "rgba(45,155,114,0.15)",
          border: "1px solid rgba(45,155,114,0.4)", color: "#6ee7b7", fontSize: "0.825rem", fontWeight: 600, letterSpacing: "0.05em",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#6ee7b7", display: "inline-block" }} />
          PATIENT SUPPORT NETWORK — INDIA
        </div>
        <h1 ref={titleRef} style={{
          fontSize: "clamp(2.6rem, 6vw, 4.2rem)", fontWeight: 800, lineHeight: 1.1,
          color: "#f0f4ff", marginBottom: "1.5rem", letterSpacing: "-0.02em",
        }}>
          Quality Healthcare,<br />
          <span style={{ background: "linear-gradient(90deg, #6ee7b7, #60a5fa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            Right at Your Door
          </span>
        </h1>
        <p ref={subRef} style={{
          fontSize: "1.125rem", color: "rgba(200,215,240,0.8)", lineHeight: 1.75,
          maxWidth: "560px", margin: "0 auto 2.5rem",
        }}>
          Free, volunteer-powered medical support for underserved communities across Maharashtra.
          Doctors, nurses, counselors — matched to you in minutes.
        </p>
        <div ref={ctaRef} style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <HoverButton primary onClick={() => document.getElementById("request-section")?.scrollIntoView({ behavior: "smooth" })}>
            Request Support Now →
          </HoverButton>
          <HoverButton onClick={() => document.getElementById("services-section")?.scrollIntoView({ behavior: "smooth" })}>
            View All Services
          </HoverButton>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: "1.5rem", marginTop: "3.5rem", flexWrap: "wrap" }}>
          {["✓ Free of charge", "✓ Verified volunteers", "✓ 24/7 emergency support"].map((t) => (
            <span key={t} style={{ color: "rgba(180,200,230,0.65)", fontSize: "0.825rem", fontWeight: 500 }}>{t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsBar() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current.querySelectorAll(".stat-item"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 85%" } }
    );
  }, []);
  return (
    <div ref={ref} style={{ background: "#fff", borderBottom: "1px solid #f0ede8", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "2rem", textAlign: "center" }}>
        {STATS.map((s) => (
          <div key={s.label} className="stat-item">
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "#0d1f3c", letterSpacing: "-0.03em" }}>{s.value}</div>
            <div style={{ fontSize: "0.85rem", color: "#7a8399", fontWeight: 500, marginTop: "0.2rem" }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ServicesSection() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current.querySelectorAll(".service-card"),
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.65, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 80%" } }
    );
  }, []);
  return (
    <section id="services-section" ref={ref} style={{ padding: "6rem 1.5rem", background: "#faf9f7" }}>
      <SectionLabel>Our Services</SectionLabel>
      <SectionTitle>Every Kind of Care,<br />One Platform</SectionTitle>
      <SectionSubtitle>From emergency transport to mental health support — our trained volunteers cover every aspect of your wellbeing.</SectionSubtitle>
      <div style={{ maxWidth: "1100px", margin: "3.5rem auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {SERVICES.map((sv) => <ServiceCard key={sv.title} service={sv} />)}
      </div>
    </section>
  );
}

function ServiceCard({ service }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="service-card"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff", borderRadius: "1.25rem", padding: "1.75rem",
        border: `1px solid ${hovered ? service.accent + "40" : "#f0ede8"}`,
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px ${service.accent}18` : "0 2px 8px rgba(0,0,0,0.04)",
        transition: "all 0.25s ease", position: "relative", overflow: "hidden",
      }}>
      <div style={{
        position: "absolute", top: 0, right: 0, width: "80px", height: "80px",
        borderRadius: "0 1.25rem 0 80px", background: service.color,
        transition: "all 0.25s", transform: hovered ? "scale(1.3)" : "scale(1)",
      }} />
      <div style={{ width: "52px", height: "52px", borderRadius: "0.875rem", background: service.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", marginBottom: "1.25rem", position: "relative" }}>
        {service.icon}
      </div>
      <div style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: "9999px", background: service.color, color: service.accent, fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em", marginBottom: "0.75rem" }}>
        {service.tag}
      </div>
      <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0d1f3c", marginBottom: "0.5rem" }}>{service.title}</h3>
      <p style={{ fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.65, margin: 0 }}>{service.desc}</p>
    </div>
  );
}

function HowItWorksSection() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current.querySelectorAll(".step-item"),
      { x: -40, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.65, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 78%" } }
    );
  }, []);
  return (
    <section ref={ref} style={{ padding: "6rem 1.5rem", background: "#0d1f3c", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", right: "-100px", top: "50%", transform: "translateY(-50%)", width: "400px", height: "400px", borderRadius: "50%", background: "radial-gradient(circle, rgba(45,155,114,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <SectionLabel dark>How It Works</SectionLabel>
      <SectionTitle dark>From Request to Care<br />in 4 Simple Steps</SectionTitle>
      <SectionSubtitle dark>Our streamlined process ensures you get help fast — no complicated forms, no long waits.</SectionSubtitle>
      <div style={{ maxWidth: "960px", margin: "3.5rem auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "2rem", position: "relative" }}>
        <div style={{ position: "absolute", top: "2.5rem", left: "12%", right: "12%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(110,231,183,0.3), rgba(96,165,250,0.3), transparent)", pointerEvents: "none" }} />
        {STEPS.map((step, i) => (
          <div key={step.num} className="step-item" style={{ textAlign: "center", padding: "0 0.5rem" }}>
            <div style={{
              width: "56px", height: "56px", borderRadius: "50%",
              background: i % 2 === 0 ? "rgba(45,155,114,0.15)" : "rgba(85,96,212,0.15)",
              border: `1px solid ${i % 2 === 0 ? "rgba(45,155,114,0.4)" : "rgba(85,96,212,0.4)"}`,
              display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem",
            }}>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: i % 2 === 0 ? "#6ee7b7" : "#93c5fd", letterSpacing: "0.05em" }}>{step.num}</span>
            </div>
            <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#f0f4ff", marginBottom: "0.6rem" }}>{step.title}</h4>
            <p style={{ fontSize: "0.85rem", color: "rgba(200,215,240,0.65)", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current.querySelectorAll(".testi-card"),
      { y: 50, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.65, stagger: 0.15, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 78%" } }
    );
  }, []);
  return (
    <section ref={ref} style={{ padding: "6rem 1.5rem", background: "#fff" }}>
      <SectionLabel>Stories</SectionLabel>
      <SectionTitle>Real People,<br />Real Impact</SectionTitle>
      <SectionSubtitle>Thousands of families across Maharashtra have received care through our volunteer network.</SectionSubtitle>
      <div style={{ maxWidth: "1050px", margin: "3.5rem auto 0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))", gap: "1.5rem" }}>
        {TESTIMONIALS.map((t) => (
          <div key={t.name} className="testi-card" style={{ background: "#faf9f7", borderRadius: "1.25rem", padding: "2rem", border: "1px solid #f0ede8", position: "relative" }}>
            <div style={{ fontSize: "3rem", lineHeight: 1, color: t.color, opacity: 0.25, position: "absolute", top: "1.25rem", right: "1.5rem", fontFamily: "Georgia, serif", fontWeight: 900 }}>"</div>
            <p style={{ fontSize: "0.925rem", color: "#374151", lineHeight: 1.75, marginBottom: "1.5rem", fontStyle: "italic" }}>"{t.quote}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: t.color + "25", border: `2px solid ${t.color}60`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 700, color: t.color }}>{t.initials}</div>
              <div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#0d1f3c" }}>{t.name}</div>
                <div style={{ fontSize: "0.775rem", color: "#9ca3af" }}>{t.location}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);
  const ref = useRef(null);
  useEffect(() => {
    gsap.fromTo(ref.current.querySelectorAll(".faq-item"),
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 80%" } }
    );
  }, []);
  return (
    <section ref={ref} style={{ padding: "6rem 1.5rem", background: "#faf9f7" }}>
      <SectionLabel>FAQ</SectionLabel>
      <SectionTitle>Common Questions</SectionTitle>
      <SectionSubtitle>Everything you need to know about our patient support services.</SectionSubtitle>
      <div style={{ maxWidth: "720px", margin: "3rem auto 0", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {FAQS.map((faq, i) => (
          <div key={i} className="faq-item" style={{ background: "#fff", borderRadius: "1rem", border: `1px solid ${openIdx === i ? "#2d9b7240" : "#f0ede8"}`, overflow: "hidden", transition: "border-color 0.2s" }}>
            <button onClick={() => setOpenIdx(openIdx === i ? null : i)}
              style={{ width: "100%", padding: "1.25rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: "1rem" }}>
              <span style={{ fontSize: "0.95rem", fontWeight: 600, color: "#0d1f3c" }}>{faq.q}</span>
              <span style={{ width: "24px", height: "24px", borderRadius: "50%", background: openIdx === i ? "#2d9b72" : "#f0ede8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: openIdx === i ? "#fff" : "#9ca3af", fontSize: "1rem", fontWeight: 700, transition: "all 0.2s", transform: openIdx === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
            </button>
            {openIdx === i && (
              <div style={{ padding: "0 1.5rem 1.25rem", fontSize: "0.875rem", color: "#6b7280", lineHeight: 1.75 }}>{faq.a}</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function RequestSection() {
  const ref = useRef(null);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", district: "", service: "", urgency: "", notes: "" });
  useEffect(() => {
    gsap.fromTo(ref.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: ref.current, start: "top 80%" } });
  }, []);
  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  const inputStyle = { width: "100%", padding: "0.85rem 1rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.07)", color: "#f0f4ff", fontSize: "0.9rem", outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  return (
    <section id="request-section" style={{ padding: "6rem 1.5rem", background: "linear-gradient(160deg, #0d1f3c 0%, #0d2d40 100%)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: "-80px", bottom: "-80px", width: "350px", height: "350px", borderRadius: "50%", background: "radial-gradient(circle, rgba(85,96,212,0.2) 0%, transparent 70%)", pointerEvents: "none" }} />
      <SectionLabel dark>Get Help Now</SectionLabel>
      <SectionTitle dark>Request Patient Support</SectionTitle>
      <SectionSubtitle dark>Fill in the details below and our team will match you with the right volunteer immediately.</SectionSubtitle>
      <div ref={ref} style={{ maxWidth: "620px", margin: "3rem auto 0", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "1.5rem", padding: "2.5rem", backdropFilter: "blur(10px)" }}>
        {done ? (
          <div style={{ textAlign: "center", padding: "2rem 0" }}>
            <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(45,155,114,0.15)", border: "1px solid rgba(45,155,114,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", margin: "0 auto 1.5rem" }}>✅</div>
            <h3 style={{ color: "#f0f4ff", fontSize: "1.4rem", fontWeight: 700, marginBottom: "0.75rem" }}>Request Submitted!</h3>
            <p style={{ color: "rgba(200,215,240,0.7)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "2rem" }}>
              We've received your request for <strong style={{ color: "#6ee7b7" }}>{form.name}</strong>. A volunteer will be matched and contact you shortly.
            </p>
            <button onClick={() => { setDone(false); setForm({ name: "", phone: "", district: "", service: "", urgency: "", notes: "" }); }}
              style={{ background: "transparent", border: "1px solid rgba(255,255,255,0.2)", color: "rgba(200,215,240,0.7)", padding: "0.6rem 1.5rem", borderRadius: "9999px", cursor: "pointer", fontSize: "0.875rem", fontFamily: "inherit" }}>
              Submit another request
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setDone(true); }} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", color: "rgba(200,215,240,0.7)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>Patient Name *</label>
                <input style={inputStyle} name="name" value={form.name} onChange={handleChange} required placeholder="Full name" />
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(200,215,240,0.7)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>Phone Number *</label>
                <input style={inputStyle} name="phone" type="tel" value={form.phone} onChange={handleChange} required placeholder="+91 98765 43210" />
              </div>
            </div>
            <div>
              <label style={{ display: "block", color: "rgba(200,215,240,0.7)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>District / City *</label>
              <input style={inputStyle} name="district" value={form.district} onChange={handleChange} required placeholder="e.g. Pune, Maharashtra" />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", color: "rgba(200,215,240,0.7)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>Service Required *</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} name="service" value={form.service} onChange={handleChange} required>
                  <option value="" style={{ background: "#0d1f3c" }}>Select service</option>
                  {SERVICES.map((sv) => <option key={sv.title} value={sv.title} style={{ background: "#0d1f3c" }}>{sv.title}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", color: "rgba(200,215,240,0.7)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>Urgency Level *</label>
                <select style={{ ...inputStyle, cursor: "pointer" }} name="urgency" value={form.urgency} onChange={handleChange} required>
                  <option value="" style={{ background: "#0d1f3c" }}>Select level</option>
                  {["Low — within 24 hrs", "Medium — within 4 hrs", "High — within 1 hr", "Emergency — ASAP"].map((u) => <option key={u} value={u} style={{ background: "#0d1f3c" }}>{u}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={{ display: "block", color: "rgba(200,215,240,0.7)", fontSize: "0.8rem", fontWeight: 500, marginBottom: "0.4rem" }}>Additional Notes</label>
              <textarea style={{ ...inputStyle, resize: "vertical", minHeight: "90px" }} name="notes" value={form.notes} onChange={handleChange} placeholder="Describe the patient's condition, any special requirements..." />
            </div>
            <button type="submit" style={{ width: "100%", padding: "1rem", borderRadius: "0.875rem", background: "linear-gradient(90deg, #2d9b72, #1a7a57)", color: "#fff", fontWeight: 700, fontSize: "1rem", border: "none", cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 6px 24px rgba(45,155,114,0.35)", fontFamily: "inherit" }}
              onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; }}>
              Submit Support Request →
            </button>
            <p style={{ textAlign: "center", color: "rgba(160,180,220,0.5)", fontSize: "0.75rem", margin: 0 }}>Completely free. Your information is kept private and secure.</p>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: "#080f1e", padding: "3rem 1.5rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
        <span style={{ fontSize: "1.2rem" }}>🌿</span>
        <span style={{ color: "#f0f4ff", fontWeight: 700, fontSize: "1.1rem" }}>HealthReach India</span>
      </div>
      <p style={{ color: "rgba(160,180,220,0.45)", fontSize: "0.825rem", marginBottom: "1.5rem" }}>Connecting patients with volunteer healthcare professionals across Maharashtra.</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
        {["About Us", "Volunteer", "Privacy Policy", "Emergency Helpline"].map((link) => (
          <a key={link} href="#" style={{ color: "rgba(160,180,220,0.5)", fontSize: "0.8rem", textDecoration: "none" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#6ee7b7")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(160,180,220,0.5)")}>
            {link}
          </a>
        ))}
      </div>
      <p style={{ color: "rgba(160,180,220,0.25)", fontSize: "0.75rem", marginTop: "2rem" }}>© 2025 HealthReach India. All rights reserved.</p>
    </footer>
  );
}

function SectionLabel({ children, dark }) {
  return (
    <div style={{ textAlign: "center", marginBottom: "0.75rem" }}>
      <span style={{ display: "inline-block", padding: "0.25rem 0.875rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", background: dark ? "rgba(45,155,114,0.15)" : "rgba(45,155,114,0.1)", color: dark ? "#6ee7b7" : "#2d9b72", border: dark ? "1px solid rgba(45,155,114,0.3)" : "1px solid rgba(45,155,114,0.2)" }}>
        {children}
      </span>
    </div>
  );
}

function SectionTitle({ children, dark }) {
  return (
    <h2 style={{ textAlign: "center", fontSize: "clamp(1.8rem, 4vw, 2.75rem)", fontWeight: 800, lineHeight: 1.18, letterSpacing: "-0.02em", color: dark ? "#f0f4ff" : "#0d1f3c", margin: "0.5rem 0" }}>
      {children}
    </h2>
  );
}

function SectionSubtitle({ children, dark }) {
  return (
    <p style={{ textAlign: "center", maxWidth: "520px", margin: "0.875rem auto 0", fontSize: "1rem", color: dark ? "rgba(200,215,240,0.65)" : "#6b7280", lineHeight: 1.75 }}>
      {children}
    </p>
  );
}

function HoverButton({ children, primary, onClick }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        padding: "0.85rem 2rem", borderRadius: "0.75rem", fontWeight: 700, fontSize: "0.95rem",
        cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        ...(primary ? {
          background: hovered ? "#34c984" : "#2d9b72", color: "#fff", border: "none",
          boxShadow: hovered ? "0 8px 24px rgba(45,155,114,0.45)" : "0 4px 16px rgba(45,155,114,0.3)",
        } : {
          background: "transparent", color: "#f0f4ff", border: "1px solid rgba(255,255,255,0.25)", boxShadow: "none",
        }),
      }}>
      {children}
    </button>
  );
}