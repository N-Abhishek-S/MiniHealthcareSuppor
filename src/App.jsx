import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import HeroSection from "./component/Herosection";
import PatientSupportForm from "./component/PatientSupportPage";
import VolunteerRegistrationForm from "./component/Volunteerregistrationform";
import AIChatbot from "./component/Aichatbot";

const NAV_ITEMS = [
  { id: "/", label: "Home" },
  { id: "/patient", label: "Patient Support" },
  { id: "/volunteer", label: "Volunteer" },
];

const HOME_CARDS = [
  {
    icon: "🏥",
    title: "I Need Support",
    description: "Request medical help, home care, transport, or counseling.",
    cta: "Request Support",
    path: "/patient",
    accent: "bg-blue-600",
    surface: "bg-blue-50",
    border: "border-blue-100",
  },
  {
    icon: "🤝",
    title: "I Want to Volunteer",
    description: "Register your skills and availability to help patients.",
    cta: "Join as Volunteer",
    path: "/volunteer",
    accent: "bg-indigo-600",
    surface: "bg-indigo-50",
    border: "border-indigo-100",
  },
];

const FONT_IMPORTS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Clash+Display:wght@600;700&display=swap');
  * { box-sizing: border-box; }
  html { scroll-behavior: smooth; }
  body { margin: 0; overflow-x: hidden; background: #ffffff; }
  button, input, select, textarea { font: inherit; }
`;

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigateTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{FONT_IMPORTS}</style>

      <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <button type="button" onClick={() => navigateTo("/")} className="flex items-center gap-3 rounded-2xl text-left">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-[0_12px_30px_rgba(37,99,235,0.28)]">+</span>
            <span className="text-lg font-bold text-slate-900" style={{ fontFamily: "'Clash Display', sans-serif" }}>
              HealthCare<span className="text-blue-600">NGO</span>
            </span>
          </button>

          <div className="ml-auto hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigateTo(item.id)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition duration-200 ${
                  location.pathname === item.id
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 hover:text-blue-600"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <button type="button" onClick={() => setMenuOpen((p) => !p)} className="ml-auto inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-50 md:hidden" aria-label="Toggle navigation" aria-expanded={menuOpen}>
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 7H20M4 12H20M4 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            )}
          </button>
        </div>

        {menuOpen && (
          <div className="border-t border-slate-200/80 px-4 pb-4 md:hidden">
            <div className="flex flex-col gap-2 pt-4">
              {NAV_ITEMS.map((item) => (
                <button key={item.id} type="button" onClick={() => navigateTo(item.id)}
                  className={`w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition duration-200 ${
                    location.pathname === item.id ? "bg-blue-50 text-blue-600" : "bg-slate-50 text-slate-700 hover:bg-slate-100"
                  }`}>
                  {item.label}
                </button>
              ))}
              <button type="button" onClick={() => navigateTo("/volunteer")} className="mt-2 inline-flex w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition duration-200 hover:bg-blue-700">
                Volunteer
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="bg-white">
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection />
              <section className="bg-white px-4 py-16 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-5xl text-center">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Get started</p>
                  <h2 className="mt-4 text-4xl font-bold text-slate-900" style={{ fontFamily: "'Clash Display', sans-serif" }}>
                    What brings you here?
                  </h2>
                  <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
                    Choose the path that fits your situation and we will take you to the right workflow right away.
                  </p>
                  <div className="mt-12 grid gap-6 md:grid-cols-2">
                    {HOME_CARDS.map((card) => (
                      <button key={card.path} type="button" onClick={() => navigateTo(card.path)}
                        className={`group rounded-[28px] border ${card.border} ${card.surface} p-8 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(15,23,42,0.08)]`}>
                        <span className="text-4xl">{card.icon}</span>
                        <h3 className="mt-6 text-2xl font-bold text-slate-900" style={{ fontFamily: "'Clash Display', sans-serif" }}>{card.title}</h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">{card.description}</p>
                        <span className={`mt-6 inline-flex rounded-xl ${card.accent} px-4 py-2.5 text-sm font-semibold text-white transition duration-200 group-hover:opacity-90`}>{card.cta}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            </>
          } />
          <Route path="/patient" element={<PatientSupportForm />} />
          <Route path="/volunteer" element={<VolunteerRegistrationForm />} />
          
          {/* Catch-all route for unknown paths */}
          <Route path="*" element={
            <div className="flex min-h-[50vh] flex-col items-center justify-center text-center px-4">
              <h2 className="text-4xl font-bold text-slate-900">404</h2>
              <p className="mt-2 text-lg text-slate-600">Oops! The page you're looking for doesn't exist.</p>
              <button onClick={() => navigateTo("/")} className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700">
                Go back home
              </button>
            </div>
          } />
        </Routes>
      </main>

      <AIChatbot />

      <footer className="bg-slate-950 px-4 py-10 text-center text-sm text-slate-400 sm:px-6 lg:px-8">
        <p className="text-lg font-bold text-white" style={{ fontFamily: "'Clash Display', sans-serif" }}>
          HealthCare<span className="text-blue-400">NGO</span>
        </p>
        <p className="mt-3">Registered NGO · Serving 28 districts · Helpline: 1800-000-0000</p>
        <p className="mt-2 text-slate-500">© {new Date().getFullYear()} HealthCare NGO. Built for community health.</p>
      </footer>
    </div>
  );
}