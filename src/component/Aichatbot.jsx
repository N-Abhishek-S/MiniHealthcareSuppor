import { useCallback, useEffect, useRef, useState } from "react";

const GEMINI_API_URL = "/api/gemini";

const SUGGESTIONS = [
  "How to register as volunteer?",
  "How can a patient get help?",
  "Is this service free?",
  "What areas do you cover?",
  "What's your helpline number?",
];

const WELCOME_MSG =
  "👋 Hello! I'm **HealthBot**, your AI-powered healthcare assistant.\n\nI can help you with general health questions, NGO services, volunteer registration, and patient support. How can I help you today?";

const SYSTEM_PROMPT = `You are HealthBot, a warm and knowledgeable healthcare assistant for a non-profit NGO platform serving 28 districts across Maharashtra, Karnataka, and Telangana.

ABSOLUTE RULES — never break these:
1. Provide ONLY general health guidance and wellness information.
2. NEVER diagnose any medical condition under any circumstance.
3. NEVER suggest specific medicines, dosages, or treatment plans.
4. ALWAYS end medical answers by recommending the user consult a licensed doctor.
5. For ANY life-threatening emergency, immediately direct to 108 (Ambulance) or 112 (Emergency) before anything else.
6. Keep answers concise, warm, and human — 2 to 4 short paragraphs at most.
7. Do NOT engage with topics unrelated to health, wellness, or the NGO's services.

NGO FACTS you may share:
- Services are completely free of charge.
- Helpline: 1800-000-0000 (24/7).
- Email: help@healthcarengo.org.
- Volunteer matching: 15–30 minutes urgent, 24 hours routine.
- Coverage: 28 districts across Maharashtra, Karnataka, and Telangana. Expanding soon.
- Donations are 80G tax-exempt. Accepted via UPI, bank transfer, international payments.

Tone: compassionate, clear, never alarmist. Speak like a trusted health advisor, not a robot.
Format: Use **bold** for key terms. Keep responses to 2-4 short paragraphs.`;

const MAX_HISTORY = 10;
const MAX_INPUT = 500;

let _id = 0;
const uid = () => `${Date.now()}-${++_id}`;
const makeMsg = (role, text, isError = false) => ({ id: uid(), role, text, isError, ts: new Date() });
const createAppError = (code, message, extras = {}) => Object.assign(new Error(message), { code, ...extras });

async function sendMessageToGemini(userMessage, history = []) {
  if (!userMessage?.trim()) throw createAppError("BAD_REQUEST", "Empty message.");

  const trimmed = history.slice(-(MAX_HISTORY * 2));

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userMessage: userMessage.trim(),
        history: trimmed,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const code =
        data?.code ||
        (response.status >= 502 && response.status <= 504
          ? "SERVER_UNAVAILABLE"
          : `API_${response.status}`);
      throw createAppError(
        code,
        data?.message ||
          (code === "SERVER_UNAVAILABLE"
            ? "HealthBot server is not reachable."
            : `Request failed with status ${response.status}`),
        { retryAfterSeconds: data?.retryAfterSeconds ?? null }
      );
    }

    if (!data?.reply) {
      throw createAppError("EMPTY_RESPONSE", "Empty response from server.");
    }

    return data.reply;
  } catch (error) {
    if (error?.code) throw error;
    throw createAppError("SERVER_UNAVAILABLE", "HealthBot server is not reachable.");
  }
}

const SpeechRecognitionAPI =
  typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

const voiceService = {
  isMicSupported: () => Boolean(SpeechRecognitionAPI),
  isTTSSupported: () => typeof window !== "undefined" && Boolean(window.speechSynthesis),

  createRecognizer({ onResult, onError, onEnd, lang = "en-IN" }) {
    if (!this.isMicSupported()) return null;
    const rec = new SpeechRecognitionAPI();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;
    rec.onresult = (e) => {
      const t = e.results?.[0]?.[0]?.transcript ?? "";
      if (t) onResult(t.trim());
    };
    rec.onerror = (e) => { if (e.error !== "aborted") onError(e.error); };
    rec.onend = onEnd;
    return rec;
  },

  speak(text, { onStart, onEnd } = {}) {
    if (!this.isTTSSupported() || !text) return;
    this.stopSpeaking();
    const clean = text.replace(/[*_`>#~]+/g, "").replace(/\n{2,}/g, ". ").replace(/\n/g, " ").trim();
    const utt = new SpeechSynthesisUtterance(clean);
    utt.lang = "en-IN"; utt.rate = 0.93; utt.pitch = 1.05; utt.volume = 1;
    const voices = window.speechSynthesis.getVoices();
    const voice =
      voices.find((v) => v.name.includes("Google") && v.lang.startsWith("en")) ||
      voices.find((v) => v.name.includes("Samantha")) ||
      voices.find((v) => v.lang.startsWith("en") && !v.localService) ||
      voices.find((v) => v.lang.startsWith("en")) || null;
    if (voice) utt.voice = voice;
    utt.onstart = () => onStart?.();
    utt.onend = () => { onEnd?.(); };
    utt.onerror = () => { onEnd?.(); };
    setTimeout(() => window.speechSynthesis.speak(utt), 50);
  },

  stopSpeaking() {
    if (this.isTTSSupported() && window.speechSynthesis.speaking) window.speechSynthesis.cancel();
  },
};

function RichText({ text }) {
  return (
    <>
      {text.split("\n").map((line, li, arr) => (
        <span key={li}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={i}>{part.slice(2, -2)}</strong>
              : <span key={i}>{part}</span>
          )}
          {li < arr.length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const MicIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="2" width="6" height="11" rx="3"/>
    <path d="M5 10a7 7 0 0 0 14 0M12 19v4M8 23h8"/>
  </svg>
);
const SpeakerOnIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);
const SpeakerOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
);
const ResetIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);
const MinimizeIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M5 12h14"/>
  </svg>
);

export default function HealthBot() {
  const messagesRef   = useRef(null);
  const inputRef      = useRef(null);
  const recognizerRef = useRef(null);

  const [isOpen,        setIsOpen]       = useState(false);
  const [messages,      setMessages]     = useState([makeMsg("bot", WELCOME_MSG)]);
  const [history,       setHistory]      = useState([]);
  const [input,         setInput]        = useState("");
  const [isLoading,     setIsLoading]    = useState(false);
  const [isListening,   setIsListening]  = useState(false);
  const [isSpeaking,    setIsSpeaking]   = useState(false);
  const [ttsEnabled,    setTtsEnabled]   = useState(false);
  const [error,         setError]        = useState(null);
  const [unread,        setUnread]       = useState(0);
  const [showScroll,    setShowScroll]   = useState(false);
  const [lastFailed,    setLastFailed]   = useState(null);

  const canMic = voiceService.isMicSupported();
  const canTTS = voiceService.isTTSSupported();

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    const handler = () => setShowScroll(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
    el.addEventListener("scroll", handler, { passive: true });
    return () => el.removeEventListener("scroll", handler);
  }, [isOpen]);

  useEffect(() => {
    const el = messagesRef.current;
    if (el && !showScroll) el.scrollTop = el.scrollHeight;
  }, [messages, isLoading, showScroll]);

  useEffect(() => {
    if (!isOpen && messages.length > 1) setUnread((n) => n + 1);
  }, [messages]); // eslint-disable-line

  useEffect(() => {
    if (isOpen) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }
  }, [isOpen]);

  useEffect(() => () => {
    voiceService.stopSpeaking();
    recognizerRef.current?.stop();
  }, []);

  const sendMessage = useCallback(async (override) => {
    const text = (override ?? input).trim();
    if (!text || isLoading) return;
    if (text.length > MAX_INPUT) { setError(`Max ${MAX_INPUT} characters.`); return; }

    setError(null);
    setInput("");
    setLastFailed(null);
    voiceService.stopSpeaking();
    setIsSpeaking(false);

    const userMsg = makeMsg("user", text);
    setMessages((p) => [...p, userMsg]);
    setIsLoading(true);

    const historySnapshot = history;

    try {
      const reply = await sendMessageToGemini(text, historySnapshot);
      const botMsg = makeMsg("bot", reply);
      setMessages((p) => [...p, botMsg]);
      setHistory((h) => [...h, { role: "user", text }, { role: "bot", text: reply }]);

      if (ttsEnabled && canTTS) {
        setIsSpeaking(true);
        voiceService.speak(reply, { onEnd: () => setIsSpeaking(false) });
      }
    } catch (err) {
      console.error("[HealthBot]", err);
      const code = err.code ?? err.message;
      const retryHint = err.retryAfterSeconds
        ? ` Please wait about ${err.retryAfterSeconds} seconds and try again.`
        : " Please wait a moment and try again.";
      const handledMsgMap = {
        RATE_LIMIT:          `⚠️ Too many requests.${retryHint}`,
        QUOTA_UNAVAILABLE:   "⚠️ This SambaNova project currently has no available quota for the selected model. Enable billing or use a key/project with active quota, then try again.",
        AUTH_ERROR:          "⚠️ SambaNova authentication failed. Check the server-side API key.",
        BAD_REQUEST:         "⚠️ Request error. Please rephrase and try again.",
        TEMP_UNAVAILABLE:    "⚠️ SambaNova is temporarily busy. Please try again in a moment.",
        SERVER_CONFIG_ERROR: "⚠️ The chatbot server is missing its SambaNova API key.",
        SERVER_UNAVAILABLE:  "⚠️ The chatbot backend is not running. Start the server and try again.",
      };
      const handledErrorMap = {
        RATE_LIMIT:          err.retryAfterSeconds ? `Please wait about ${err.retryAfterSeconds} seconds, then tap Retry.` : "Please wait a moment, then tap Retry.",
        QUOTA_UNAVAILABLE:   "This SambaNova project currently has zero quota for the configured model.",
        AUTH_ERROR:          "Server authentication with SambaNova failed.",
        BAD_REQUEST:         "Please rephrase your message and try again.",
        TEMP_UNAVAILABLE:    "SambaNova is temporarily busy.",
        SERVER_CONFIG_ERROR: "The backend server is missing its SambaNova API key.",
        SERVER_UNAVAILABLE:  "Backend server is not running.",
      };
      const handledMsg =
        handledMsgMap[code] ?? "⚠️ Something went wrong. Please try again or call **1800-000-0000**.";
      setMessages((p) => [...p, makeMsg("bot", handledMsg, true)]);
      setLastFailed(text);
      setError(handledErrorMap[code] ?? "Failed to send - tap Retry to try again.");

    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, history, ttsEnabled, canTTS]);

  const retryLast = useCallback(() => {
    if (!lastFailed) return;
    const txt = lastFailed;
    setError(null);
    setLastFailed(null);
    setMessages((p) => p.filter((m) => !m.isError));
    sendMessage(txt);
  }, [lastFailed, sendMessage]);

  const toggleMic = useCallback(() => {
    if (isListening) { recognizerRef.current?.stop(); setIsListening(false); return; }
    voiceService.stopSpeaking(); setIsSpeaking(false); setError(null);

    recognizerRef.current = voiceService.createRecognizer({
      onResult: (t) => { setIsListening(false); setInput(t); setTimeout(() => sendMessage(t), 80); },
      onError:  (code) => {
        setIsListening(false);
        setError(code === "not-allowed" ? "Microphone access denied." : code === "no-speech" ? "No speech detected." : `Mic error: ${code}`);
      },
      onEnd: () => setIsListening(false),
    });
    recognizerRef.current?.start();
    setIsListening(true);
  }, [isListening, sendMessage]);

  const toggleTTS = () => {
    if (isSpeaking) { voiceService.stopSpeaking(); setIsSpeaking(false); }
    setTtsEnabled((v) => !v);
  };

  const handleReset = () => {
    voiceService.stopSpeaking();
    setIsLoading(false);
    setMessages([makeMsg("bot", "🔄 Conversation reset. How can I help you today?")]);
    setHistory([]); setError(null); setIsSpeaking(false);
    setIsListening(false); setLastFailed(null);
    recognizerRef.current?.stop();
    inputRef.current?.focus();
  };

  const handleClose = () => {
    voiceService.stopSpeaking(); recognizerRef.current?.stop();
    setIsListening(false); setIsSpeaking(false); setIsOpen(false);
  };

  const handleInput = (e) => {
    if (e.target.value.length > MAX_INPUT) return;
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const statusLabel = isLoading ? "Thinking…" : isSpeaking ? "Speaking…" : isListening ? "Listening…" : "Online · Ready to help";
  const statusColor = isLoading ? "#f59e0b" : isSpeaking ? "#60a5fa" : isListening ? "#f43f5e" : "#10b981";
  const charLeft = MAX_INPUT - input.length;

  return (
    <div className="font-['DM_Sans',_sans-serif] text-slate-900 box-border *-[box-border]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&display=swap');
        @keyframes hbPop { from { transform: scale(0); } to { transform: scale(1); } }
        @keyframes hbFabRing { 0% { opacity:.8; transform:scale(1); } 100% { opacity:0; transform:scale(1.35); } }
        @keyframes hbSlideIn { from { opacity:0; transform:scale(0.88) translateY(24px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes hbRing { 0%{opacity:.8;transform:scale(1);} 100%{opacity:0;transform:scale(1.4);} }
        @keyframes hbFadeUp { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
        @keyframes hbBounce { 0%,80%,100%{transform:translateY(0);opacity:.4;} 40%{transform:translateY(-5px);opacity:1;} }
        @keyframes hbWave { 0%,100%{transform:scaleY(.5);opacity:.5;} 50%{transform:scaleY(1);opacity:1;} }
      `}</style>

      {!isOpen && (
        <button 
          className="fixed bottom-7 right-7 z-[9998] w-[60px] h-[60px] rounded-[18px] border-none bg-gradient-to-br from-[#0369a1] to-[#0ea5e9] text-white cursor-pointer text-2xl flex items-center justify-center shadow-[0_8px_28px_rgba(14,165,233,.4),0_2px_8px_rgba(0,0,0,.1)] transition-transform duration-[250ms] ease-[cubic-bezier(.34,1.56,.64,1)] hover:scale-[1.08] hover:-translate-y-[3px] hover:-rotate-3 hover:shadow-[0_16px_40px_rgba(14,165,233,.5)]" 
          onClick={() => setIsOpen(true)} 
          aria-label="Open HealthBot"
        >
          🏥
          <span className="absolute inset-0 rounded-[18px] border-[2px] border-[rgba(14,165,233,.4)] animate-[hbFabRing_2s_ease-out_infinite]" />
          {unread > 0 && <span className="absolute -top-[5px] -right-[5px] min-w-[18px] h-[18px] rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white px-[3px] animate-[hbPop_.3s_cubic-bezier(.34,1.56,.64,1)]">{unread > 9 ? "9+" : unread}</span>}
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-7 right-6 z-[9999] w-[min(420px,calc(100vw-20px))] max-h-[min(88vh,780px)] flex flex-col rounded-[22px] overflow-hidden bg-[#f8faff] shadow-[0_0_0_1px_rgba(14,165,233,.08),0_28px_70px_rgba(14,165,233,.14),0_10px_28px_rgba(0,0,0,.10)] animate-[hbSlideIn_.38s_cubic-bezier(.34,1.4,.64,1)_both]" role="dialog" aria-label="HealthBot" aria-modal="true">

          <div className="shrink-0 bg-gradient-to-br from-[#0369a1] via-[#0ea5e9] to-[#14b8a6] p-[14px] px-4 flex items-center gap-[11px] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[url('data:image/svg+xml,%3Csvg_width=%2760%27_height=%2760%27_viewBox=%270_0_60_60%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg_fill=%27%23ffffff%27%3E%3Ccircle_cx=%2730%27_cy=%2730%27_r=%2720%27/%3E%3C/g%3E%3C/svg%3E')] bg-repeat" />
            
            <div className="w-[42px] h-[42px] rounded-[14px] bg-white/20 border-[1.5px] border-white/25 flex items-center justify-center text-xl shrink-0 relative backdrop-blur-[4px]">
              🏥
              {(isSpeaking || isLoading) && <span className="absolute -inset-1 rounded-[18px] border-[1.5px] border-white/30 animate-[hbRing_2s_ease-out_infinite]" />}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-white font-extrabold text-[15px] font-['Bricolage_Grotesque',_sans-serif] m-0 tracking-[-.02em]">HealthBot</p>
              <p className="text-[10.5px] text-white/65 mt-[2px] mb-0">Healthcare NGO · 28 Districts</p>
              <div className="flex items-center gap-[5px] mt-1">
                <span className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300" style={{ background: statusColor }} />
                <span className="text-[10.5px] text-white/75 font-medium">{statusLabel}</span>
              </div>
            </div>
            
            <div className="flex gap-[5px] items-center">
              <button className="w-7 h-7 rounded-[9px] border-none bg-white/10 text-white cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-white/25 hover:scale-[1.08]" onClick={handleReset} title="Reset chat" aria-label="Reset">
                <ResetIcon />
              </button>
              <button className="w-7 h-7 rounded-[9px] border-none bg-white/10 text-white cursor-pointer flex items-center justify-center transition-all duration-150 hover:bg-white/25 hover:scale-[1.08]" onClick={handleClose} title="Minimize" aria-label="Close">
                <MinimizeIcon />
              </button>
            </div>
          </div>

          <div className="shrink-0 bg-[#f0f9ff] py-[7px] px-[14px] border-b border-[#bae6fd] flex items-start gap-[7px]">
            <span style={{ fontSize: 12 }}>🛡️</span>
            <p className="text-[11px] text-[#0284c7] font-medium m-0 leading-relaxed">
              General guidance only · Consult a doctor for medical concerns · <strong>Emergency: 108</strong>
            </p>
          </div>

          {error && (
            <div className="shrink-0 bg-rose-50 py-[7px] px-[14px] border-b border-rose-200 flex items-center gap-[6px]" role="alert">
              <p className="text-[11px] text-rose-700 m-0 font-medium flex-1">⚠️ {error}</p>
              {lastFailed && <button className="text-[10px] text-sky-500 bg-transparent border border-sky-200 rounded-[6px] py-[1px] px-[7px] cursor-pointer font-semibold transition-colors duration-150 hover:bg-sky-50" onClick={retryLast}>Retry</button>}
              <button className="border-none bg-transparent text-rose-700 cursor-pointer p-0 text-base leading-none opacity-70 hover:opacity-100" onClick={() => setError(null)} aria-label="Dismiss">×</button>
            </div>
          )}
          
          <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 px-[13px] flex flex-col gap-[14px] min-h-0 scroll-smooth [&::-webkit-scrollbar]:w-[3px] [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full" aria-live="polite" role="log">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col animate-[hbFadeUp_.28s_ease_both] ${msg.role === 'bot' ? 'items-start' : 'items-end'}`}>
                <div className={`flex items-end gap-[7px] max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  {msg.role === "bot" && <div className="w-7 h-7 rounded-[10px] bg-gradient-to-br from-[#0369a1] to-[#0ea5e9] shrink-0 flex items-center justify-center text-[13px] shadow-[0_2px_8px_rgba(14,165,233,.25)] mb-[2px]" aria-hidden="true">🏥</div>}
                  
                  <div className={`p-[10px] px-[14px] text-[13.5px] leading-[1.7] whitespace-pre-wrap break-words ${
                    msg.role === 'bot' 
                      ? msg.isError 
                        ? 'bg-rose-50 border-rose-200 text-rose-700 rounded-[5px_16px_16px_16px] border' 
                        : 'bg-white text-slate-900 rounded-[5px_16px_16px_16px] border border-slate-200 shadow-[0_2px_12px_rgba(14,165,233,.12)]'
                      : 'bg-gradient-to-br from-[#0369a1] to-[#0ea5e9] text-white rounded-[16px_5px_16px_16px] shadow-[0_4px_16px_rgba(2,132,199,.28)]'
                  }`}>
                    <RichText text={msg.text} />
                  </div>
                </div>
                
                <div className={`flex items-center gap-2 mt-1 ${msg.role === 'bot' ? 'ml-[35px]' : 'flex-row-reverse'}`}>
                  <span className="text-[10px] text-slate-400">{msg.ts.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {msg.isError && lastFailed && <button className="text-[10px] text-sky-500 bg-transparent border border-sky-200 rounded-[6px] py-[1px] px-[7px] cursor-pointer font-semibold transition-colors duration-150 hover:bg-sky-50" onClick={retryLast}>↻ Retry</button>}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-end gap-[7px] animate-[hbFadeUp_.28s_ease_both]">
                <div className="w-7 h-7 rounded-[10px] bg-gradient-to-br from-[#0369a1] to-[#0ea5e9] shrink-0 flex items-center justify-center text-[13px] shadow-[0_2px_8px_rgba(14,165,233,.25)] mb-[2px]" aria-hidden="true">🏥</div>
                <div className="bg-white text-slate-900 rounded-[5px_16px_16px_16px] border border-slate-200 shadow-[0_2px_12px_rgba(14,165,233,.12)] p-[12px] px-[16px]">
                  <div style={{ display: "flex", gap: 4 }}>
                    <div className="w-[6px] h-[6px] rounded-full bg-slate-400 animate-[hbBounce_1.4s_ease-in-out_infinite]" />
                    <div className="w-[6px] h-[6px] rounded-full bg-slate-400 animate-[hbBounce_1.4s_ease-in-out_infinite] [animation-delay:.2s]" />
                    <div className="w-[6px] h-[6px] rounded-full bg-slate-400 animate-[hbBounce_1.4s_ease-in-out_infinite] [animation-delay:.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {showScroll && (
            <button className="absolute bottom-[180px] right-[18px] w-8 h-8 rounded-full bg-white border-[1.5px] border-slate-200 text-slate-600 cursor-pointer flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,.08),0_2px_6px_rgba(0,0,0,.05)] transition-transform duration-150 hover:scale-[1.08] z-10" onClick={() => { const el = messagesRef.current; if (el) el.scrollTop = el.scrollHeight; }} aria-label="Scroll to latest">↓</button>
          )}

          {isListening && (
            <div className="shrink-0 bg-gradient-to-r from-orange-50 to-amber-50 border-t border-orange-200 py-2 px-[14px] flex items-center gap-2" aria-live="polite">
              <div className="flex items-center gap-[2px] h-4" aria-hidden="true">
                <div className="w-[3px] rounded-[3px] bg-rose-500 animate-[hbWave_1s_ease-in-out_infinite] h-[6px] [animation-delay:0s]" />
                <div className="w-[3px] rounded-[3px] bg-rose-500 animate-[hbWave_1s_ease-in-out_infinite] h-[12px] [animation-delay:.15s]" />
                <div className="w-[3px] rounded-[3px] bg-rose-500 animate-[hbWave_1s_ease-in-out_infinite] h-[8px] [animation-delay:.3s]" />
                <div className="w-[3px] rounded-[3px] bg-rose-500 animate-[hbWave_1s_ease-in-out_infinite] h-[14px] [animation-delay:.1s]" />
                <div className="w-[3px] rounded-[3px] bg-rose-500 animate-[hbWave_1s_ease-in-out_infinite] h-[5px] [animation-delay:.25s]" />
              </div>
              <span className="text-[11.5px] text-amber-900 font-semibold">Listening… speak clearly</span>
            </div>
          )}

          <div className="shrink-0 bg-white p-2 px-[10px] border-t border-slate-100 flex gap-[6px] overflow-x-auto flex-nowrap [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Quick suggestions">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="shrink-0 border-[1.5px] border-[#bae6fd] rounded-full py-[5px] px-[12px] text-[11.5px] font-semibold text-[#0284c7] bg-[#f0f9ff] cursor-pointer whitespace-nowrap transition-all duration-150 ease-out hover:not-disabled:bg-[#bae6fd] hover:not-disabled:border-[#0ea5e9] hover:not-disabled:-translate-y-[1px] hover:not-disabled:shadow-[0_4px_10px_rgba(14,165,233,.15)] disabled:opacity-40 disabled:cursor-not-allowed" onClick={() => sendMessage(s)} disabled={isLoading || isListening}>
                {s}
              </button>
            ))}
          </div>

          <div className="shrink-0 bg-white py-[9px] px-[11px] border-t border-slate-200 flex items-end gap-[6px]">
            {canTTS && (
              <button
                className={`w-[38px] h-[38px] rounded-[12px] border-[1.5px] cursor-pointer shrink-0 flex items-center justify-center transition-all duration-150 hover:not-disabled:scale-[1.07] disabled:opacity-35 disabled:cursor-not-allowed ${ttsEnabled ? "bg-sky-50 text-sky-500 border-sky-200" : "bg-[#f8faff] text-slate-400 border-slate-200"}`}
                onClick={toggleTTS} title={ttsEnabled ? "Mute" : "Enable voice"} aria-pressed={ttsEnabled}
              >
                {ttsEnabled ? <SpeakerOnIcon /> : <SpeakerOffIcon />}
              </button>
            )}

            <div style={{ flex: 1, position: "relative" }}>
              <textarea
                ref={inputRef} className="w-full border-[1.5px] border-slate-200 rounded-[13px] outline-none bg-[#f8faff] text-[13.5px] text-slate-900 py-[9px] px-[13px] transition-all duration-200 resize-none leading-[1.45] min-h-[40px] max-h-[100px] focus:border-sky-500 focus:shadow-[0_0_0_3px_rgba(14,165,233,.1)] focus:bg-white placeholder:text-slate-400 disabled:opacity-55 disabled:cursor-not-allowed" rows={1}
                placeholder={isListening ? "Listening…" : "Ask me anything… (Shift+Enter for new line)"}
                value={input} onChange={handleInput} onKeyDown={onKeyDown}
                disabled={isLoading || isListening} aria-label="Type your message" maxLength={MAX_INPUT}
              />
              {input.length > MAX_INPUT - 100 && (
                <div className={`text-[9.5px] px-[2px] pb-[6px] text-right ${charLeft < 20 ? 'text-rose-500' : charLeft < 60 ? 'text-amber-500' : 'text-slate-400'}`}>{charLeft} left</div>
              )}
            </div>

            {canMic && (
              <button
                className={`w-[38px] h-[38px] rounded-[12px] border-[1.5px] cursor-pointer shrink-0 flex items-center justify-center transition-all duration-150 hover:not-disabled:scale-[1.07] disabled:opacity-35 disabled:cursor-not-allowed ${isListening ? "bg-rose-50 text-rose-500 border-rose-200" : "bg-[#f8faff] text-slate-600 border-slate-200"}`}
                onClick={toggleMic} disabled={isLoading} aria-pressed={isListening}
                title={isListening ? "Stop mic" : "Speak"}
              >
                <MicIcon />
              </button>
            )}

            <button
              className="w-[38px] h-[38px] rounded-[12px] border-none cursor-pointer shrink-0 flex items-center justify-center transition-all duration-150 hover:not-disabled:scale-[1.07] hover:not-disabled:shadow-[0_6px_16px_rgba(14,165,233,.45)] disabled:opacity-35 disabled:cursor-not-allowed bg-gradient-to-br from-[#0369a1] to-[#0ea5e9] text-white shadow-[0_3px_10px_rgba(14,165,233,.35)]"
              onClick={() => sendMessage()} disabled={isLoading || !input.trim()}
              aria-label="Send"
            >
              <SendIcon />
            </button>
          </div>

          <div className="shrink-0 bg-white py-[6px] px-[14px] pb-2 border-t border-slate-100 flex items-center justify-center gap-[5px]">
            <p className="text-[10px] text-slate-300 m-0">Powered by SambaNova AI</p>
            <div className="w-[3px] h-[3px] rounded-full bg-slate-200" />
            <p className="text-[10px] text-slate-300 m-0">HealthCare NGO · Free Service</p>
            <div className="w-[3px] h-[3px] rounded-full bg-slate-200" />
            <p className="text-[10px] text-slate-300 m-0">Helpline 1800-000-0000</p>
          </div>
        </div>
      )}
    </div>
  );
}