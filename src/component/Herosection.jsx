import React from "react";

const STATS = [
  { value: "12K+", label: "Patients Supported", icon: "🫀" },
  { value: "340+", label: "Active Volunteers",  icon: "🤝" },
  { value: "28",   label: "Districts Covered",  icon: "📍" },
  { value: "98%",  label: "Satisfaction Rate",  icon: "⭐" },
];

const PATIENT_ROWS = [
  { label: "Name",     value: "Priya Sharma"     },
  { label: "Need",     value: "Post-surgery care" },
  { label: "District", value: "Pune, MH"          },
];

const d = (s) => ({ animationDelay: `${s}s` });

export default function HeroSection() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap" rel="stylesheet" />
      <link href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700&display=swap" rel="stylesheet" />
      
      <style>{`
        @keyframes blobTR { from{transform:scale(1) translate(0,0)} to{transform:scale(1.08) translate(18px,-14px)} }
        @keyframes blobBL { from{transform:scale(1) translate(0,0)} to{transform:scale(1.12) translate(-20px,16px)} }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes pulseScale { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:.5; transform:scale(1.4); } }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }
        @keyframes floatS { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes floatR { 0%,100%{transform:translateY(0)} 50%{transform:translateY(7px)} }
      `}</style>

      <section className="relative w-full min-h-screen overflow-hidden bg-white font-['DM_Sans',_system-ui,_sans-serif] flex flex-col justify-center">
        
        <div className="absolute rounded-full pointer-events-none -top-[130px] -right-[130px] w-[520px] h-[520px] bg-[radial-gradient(circle,rgba(191,219,254,.6)_0%,rgba(219,234,254,.18)_65%,transparent_100%)] blur-[3px] animate-[blobTR_7s_ease-in-out_infinite_alternate]" aria-hidden="true" />
        <div className="absolute rounded-full pointer-events-none -bottom-[160px] -left-[96px] w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(165,243,252,.38)_0%,rgba(224,242,254,.12)_70%,transparent_100%)] blur-[5px] animate-[blobBL_9s_1.5s_ease-in-out_infinite_alternate]" aria-hidden="true" />
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(#2563eb_1px,transparent_1px),linear-gradient(90deg,#2563eb_1px,transparent_1px)] bg-[size:44px_44px] opacity-[.032]" aria-hidden="true" />

        <div className="relative z-10 max-w-[1280px] mx-auto w-full pt-20 pb-12 px-6 md:px-12 lg:px-[80px] grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="flex flex-col gap-8">
            <div className="inline-flex items-center gap-2 self-start py-2 px-4 rounded-full border border-blue-200 bg-blue-50 text-sm font-medium text-blue-800 tracking-[.02em] opacity-0 animate-[fadeUp_.7s_cubic-bezier(.22,1,.36,1)_forwards]" style={d(0.1)}>
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 animate-[pulseScale_1.8s_ease-in-out_infinite]" />
              Healthcare NGO Platform
            </div>

            <h1 className="font-['Clash_Display','DM_Sans',system-ui,sans-serif] text-[clamp(2.6rem,5vw,4.5rem)] font-bold leading-[1.06] tracking-[-.03em] text-gray-900">
              <span className="inline-block mr-[.22em] opacity-0 animate-[fadeUp_.7s_cubic-bezier(.22,1,.36,1)_forwards]" style={d(0.25)}>Compassionate</span>
              <span className="inline-block mr-[.22em] opacity-0 animate-[fadeUp_.7s_cubic-bezier(.22,1,.36,1)_forwards]" style={d(0.37)}>Care</span>
              <br />
              <span className="inline-block mr-[.22em] text-blue-600 opacity-0 animate-[fadeUp_.7s_cubic-bezier(.22,1,.36,1)_forwards]" style={d(0.49)}>For Every</span>{" "}
              <span className="inline-block mr-[.22em] relative opacity-0 animate-[fadeUp_.7s_cubic-bezier(.22,1,.36,1)_forwards]" style={d(0.61)}>
                Life
                <svg className="absolute -bottom-2 left-0 w-full pointer-events-none" height="8" viewBox="0 0 80 8" fill="none" aria-hidden="true">
                  <path d="M2 5.5 Q20 1.5 40 5 Q60 8.5 78 4" stroke="#2563eb" strokeWidth="2.8" strokeLinecap="round" fill="none"/>
                </svg>
              </span>
            </h1>

            <p className="text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.75] text-gray-500 max-w-[480px] opacity-0 animate-[fadeUp_.7s_cubic-bezier(.22,1,.36,1)_forwards]" style={d(0.72)}>
              Connecting patients with volunteers and healthcare resources.
              One platform. Real impact. Built on the belief that everyone
              deserves quality care.
            </p>

            <div className="flex flex-wrap gap-4 opacity-0 animate-[fadeUp_.7s_cubic-bezier(.22,1,.36,1)_forwards]" style={d(0.84)}>
              <button className="inline-flex items-center justify-center py-[15px] px-[30px] rounded-[1.5rem] font-['DM_Sans',system-ui,sans-serif] text-base font-semibold cursor-pointer border-none outline-none transition-all duration-[220ms] ease-[cubic-bezier(.34,1.56,.64,1)] bg-gradient-to-br from-blue-700 to-blue-500 text-white shadow-[0_4px_16px_rgba(37,99,235,.25)] hover:-translate-y-[3px] hover:shadow-[0_16px_36px_rgba(37,99,235,.38)] active:-translate-y-[1px] focus-visible:ring-[3px] focus-visible:ring-blue-600/40">
                Get Patient Support
              </button>
              <button className="inline-flex items-center justify-center py-[15px] px-[30px] rounded-[1.5rem] font-['DM_Sans',system-ui,sans-serif] text-base font-semibold cursor-pointer outline-none transition-all duration-[220ms] ease-[cubic-bezier(.34,1.56,.64,1)] bg-white text-gray-900 border border-gray-200 hover:bg-indigo-50 hover:-translate-y-[3px] active:-translate-y-[1px] focus-visible:ring-[3px] focus-visible:ring-blue-600/40">
                Become a Volunteer →
              </button>
            </div>

            <p className="text-sm text-gray-400 opacity-0 animate-[fadeUp_.7s_cubic-bezier(.22,1,.36,1)_forwards]" style={d(0.96)}>
              Trusted by <strong className="text-gray-500 font-semibold">12,000+ families</strong> across India · Registered NGO
            </p>
          </div>

          <div className="hidden lg:flex relative h-[480px] items-center justify-center overflow-visible opacity-0 animate-[fadeUp_.7s_cubic-bezier(.22,1,.36,1)_forwards]" style={d(0.55)} aria-hidden="true">
            <div className="absolute bg-white rounded-[24px] p-8 w-[320px] border border-[rgba(37,99,235,.10)] shadow-[0_28px_72px_rgba(37,99,235,.13)] animate-[float_4.5s_ease-in-out_infinite]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-[14px] bg-blue-600 flex items-center justify-center shrink-0">
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24">
                    <path d="M12 21.5C12 21.5 3 16 3 9.5a4.5 4.5 0 0 1 9-0.5 4.5 4.5 0 0 1 9 .5c0 6.5-9 12-9 12z" fill="white"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[.95rem] text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis">Patient Request</p>
                  <p className="text-[.75rem] text-gray-400 mt-[2px]">Just submitted</p>
                </div>
                <span className="ml-auto shrink-0 text-[.72rem] font-medium py-1 px-[10px] rounded-full bg-emerald-100 text-emerald-800">Received</span>
              </div>

              <div className="flex flex-col gap-3">
                {PATIENT_ROWS.map((r) => (
                  <div key={r.label} className="flex justify-between items-center gap-4">
                    <span className="text-[.85rem] text-gray-400 shrink-0">{r.label}</span>
                    <span className="text-[.85rem] font-medium text-gray-900 text-right">{r.value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <div className="h-2 rounded-full bg-blue-100 overflow-hidden">
                  <div className="h-full rounded-full bg-blue-600 transition-[width] duration-[1.2s] ease-[cubic-bezier(.4,0,.2,1)]" style={{ width: "65%" }} />
                </div>
                <p className="text-[.75rem] text-gray-400 mt-2">Volunteer match: <span className="text-blue-600 font-semibold">65%</span></p>
              </div>
            </div>

            <div className="absolute bg-white rounded-[1rem] shadow-[0_8px_28px_rgba(0,0,0,.08)] border border-[rgba(37,99,235,.09)] py-3 px-4 flex items-center gap-3 whitespace-nowrap top-[32px] -right-[16px] animate-[floatS_5s_ease-in-out_infinite]">
              <span className="w-8 h-8 rounded-[10px] flex items-center justify-center text-base shrink-0 bg-emerald-100">🤝</span>
              <div>
                <p className="text-[.78rem] font-semibold text-gray-900">Volunteer Matched!</p>
                <p className="text-[.72rem] text-gray-400 mt-[2px]">Dr. Arjun — 2 min ago</p>
              </div>
            </div>

            <div className="absolute bg-white rounded-[1rem] shadow-[0_8px_28px_rgba(0,0,0,.08)] border border-[rgba(37,99,235,.09)] py-3 px-4 flex items-center gap-3 whitespace-nowrap bottom-0 -left-[24px] animate-[floatR_6s_ease-in-out_infinite]">
              <span className="w-8 h-8 rounded-[10px] flex items-center justify-center text-base shrink-0 bg-violet-100">🤖</span>
              <div>
                <p className="text-[.78rem] font-semibold text-gray-900">AI Support</p>
                <p className="text-[.72rem] text-gray-400 mt-[2px]">FAQ answered instantly</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto w-full px-6 pb-16 grid grid-cols-2 md:grid-cols-4 md:px-12 lg:px-[80px] gap-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-[1.5rem] p-5 md:px-6 flex flex-col gap-[6px] shadow-[0_1px_4px_rgba(0,0,0,.04)] transition-all duration-[220ms] ease-[cubic-bezier(.34,1.56,.64,1)] hover:-translate-y-[5px] hover:shadow-[0_12px_32px_rgba(37,99,235,.13)] opacity-0 animate-[fadeUp_.7s_cubic-bezier(.22,1,.36,1)_forwards]" style={d(1.0 + i * 0.1)}>
              <span className="text-xl leading-none">{s.icon}</span>
              <span className="font-['Clash_Display','DM_Sans',system-ui,sans-serif] text-[1.9rem] font-bold text-blue-600 tracking-[-.03em] leading-[1.1]">{s.value}</span>
              <span className="text-[.85rem] text-gray-500">{s.label}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}