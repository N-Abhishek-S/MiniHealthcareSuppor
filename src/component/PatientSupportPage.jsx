import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";

const INITIAL_FORM_DATA = {
  requesterName: "",
  patientName: "",
  relationship: "",
  phone: "",
  email: "",
  district: "",
  locality: "",
  patientAge: "",
  preferredContact: "",
  urgency: "priority",
  careSetting: "",
  address: "",
  details: "",
  transportRequired: false,
  consent: false,
};

const SUPPORT_TYPES = [
  {
    value: "doctor-consult",
    label: "Doctor consultation",
    icon: "🩺",
    note: "Connect with medical professionals for case review or direction.",
  },
  {
    value: "nursing-care",
    label: "Nursing care",
    icon: "💉",
    note: "For dressing, injections, vitals monitoring, or recovery support.",
  },
  {
    value: "counseling",
    label: "Counseling",
    icon: "🧠",
    note: "Emotional support for patients and caregivers under stress.",
  },
  {
    value: "transport",
    label: "Medical transport",
    icon: "🚑",
    note: "Help coordinating travel to a clinic, hospital, or test center.",
  },
  {
    value: "physio",
    label: "Physiotherapy",
    icon: "🦾",
    note: "Mobility, post-surgery, or rehabilitation assistance.",
  },
  {
    value: "nutrition",
    label: "Nutrition support",
    icon: "🥗",
    note: "Diet planning for recovery, chronic care, or weakness.",
  },
  {
    value: "home-visit",
    label: "Home visit",
    icon: "🏠",
    note: "For patients who need support delivered at home.",
  },
  {
    value: "caregiver-help",
    label: "Caregiver guidance",
    icon: "🤝",
    note: "Practical help for family members managing care at home.",
  },
];

const URGENCY_OPTIONS = [
  {
    value: "routine",
    label: "Routine",
    eta: "Response within 24 hours",
    tone: "Suitable for planned support, follow-up care, and non-urgent needs.",
    accent: "border-slate-300/20 bg-white/[0.03] text-slate-200",
  },
  {
    value: "priority",
    label: "Priority",
    eta: "Response in a few hours",
    tone: "Use when the patient needs help soon but is not in immediate danger.",
    accent: "border-cyan-300/30 bg-cyan-400/10 text-cyan-100",
  },
  {
    value: "critical",
    label: "Critical",
    eta: "Escalated triage review",
    tone: "For fast deterioration, high distress, or urgent coordination needs.",
    accent: "border-amber-300/35 bg-amber-400/10 text-amber-100",
  },
];

const CONTACT_METHODS = ["Phone call", "WhatsApp", "SMS", "Email"];

const CARE_SETTINGS = [
  "At home",
  "Hospital discharge support",
  "Clinic follow-up",
  "Remote guidance only",
];

const TIME_WINDOWS = ["Morning", "Afternoon", "Evening", "Night"];
const DAYS_AVAILABLE = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const RESPONSE_STEPS = [
  {
    title: "Triage review",
    text: "We read your request, check urgency, and verify the care details shared.",
  },
  {
    title: "Volunteer routing",
    text: "The request is matched with available medical, transport, or counseling support nearby.",
  },
  {
    title: "Confirmation call",
    text: "You receive a direct update once a responder or coordinator has been assigned.",
  },
];

const SERVICE_SIGNALS = [
  { value: "28", label: "districts active" },
  { value: "15 min", label: "fastest urgent routing" },
  { value: "24/7", label: "support desk availability" },
];

const FIELD_CLASS_NAME =
  "mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-sm text-slate-100 outline-none transition duration-200 placeholder:text-slate-500 focus:border-cyan-300 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-300/15";

const LABEL_CLASS_NAME =
  "text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-slate-400";

export default function PatientSupportPage() {
  const containerRef = useRef(null);
  const submitButtonRef = useRef(null);
  const progressFillRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [selectedSupportTypes, setSelectedSupportTypes] = useState([]);
  const [selectedTimeWindows, setSelectedTimeWindows] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".patient-intro",
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }
      );

      gsap.fromTo(
        ".patient-panel",
        { opacity: 0, y: 34 },
        { opacity: 1, y: 0, duration: 0.75, delay: 0.12, ease: "power3.out" }
      );

      gsap.fromTo(
        ".patient-section",
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.58,
          delay: 0.24,
          stagger: 0.08,
          ease: "power3.out",
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const toggleSelection = (setter) => (value) => {
    setter((previous) =>
      previous.includes(value)
        ? previous.filter((item) => item !== value)
        : [...previous, value]
    );
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const completionPercent = useMemo(() => {
    const checklist = [
      Boolean(formData.requesterName.trim()),
      Boolean(formData.patientName.trim()),
      Boolean(formData.relationship.trim()),
      Boolean(formData.phone.trim()),
      Boolean(formData.district.trim()),
      Boolean(formData.details.trim()),
      Boolean(formData.preferredContact),
      selectedSupportTypes.length > 0,
      Boolean(formData.urgency),
      formData.consent,
    ];

    const completed = checklist.filter(Boolean).length;
    return Math.round((completed / checklist.length) * 100);
  }, [
    formData.requesterName,
    formData.patientName,
    formData.relationship,
    formData.phone,
    formData.district,
    formData.details,
    formData.preferredContact,
    formData.urgency,
    formData.consent,
    selectedSupportTypes.length,
  ]);

  useEffect(() => {
    if (!progressFillRef.current) {
      return;
    }

    gsap.to(progressFillRef.current, {
      width: `${completionPercent}%`,
      duration: 0.5,
      ease: "power2.out",
    });
  }, [completionPercent]);

  const resetForm = () => {
    setSubmitted(false);
    setSelectedSupportTypes([]);
    setSelectedTimeWindows([]);
    setSelectedDays([]);
    setFormData(INITIAL_FORM_DATA);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    gsap.to(submitButtonRef.current, {
      scale: 0.98,
      duration: 0.1,
      yoyo: true,
      repeat: 1,
      onComplete: () => setSubmitted(true),
    });
  };

  if (submitted) {
    return (
      <PatientSupportSuccess
        patientName={formData.patientName}
        district={formData.district}
        urgency={formData.urgency}
        onReset={resetForm}
      />
    );
  }

  const selectedSupportLabels = SUPPORT_TYPES.filter((type) =>
    selectedSupportTypes.includes(type.value)
  ).map((type) => type.label);

  const activeUrgency = URGENCY_OPTIONS.find(
    (option) => option.value === formData.urgency
  );

  return (
    <section
      ref={containerRef}
      className="relative isolate overflow-hidden bg-slate-950 text-slate-100"
    >
      <div className="absolute inset-0 bg-slate-950" />
      <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-cyan-400/12 blur-[130px]" />
      <div className="absolute right-0 top-1/4 h-[26rem] w-[26rem] rounded-full bg-emerald-400/10 blur-[150px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,211,252,0.1),transparent_35%),linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:auto,34px_34px,34px_34px] opacity-70" />

      <div className="relative mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-start lg:gap-10 lg:px-8 lg:py-18">
        <aside className="patient-intro space-y-6 lg:sticky lg:top-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100">
            <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_0_6px_rgba(52,211,153,0.12)]" />
            Patient care desk
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-400">
              Request support
            </p>
            <h1
              className="max-w-xl text-4xl font-bold leading-tight sm:text-5xl xl:text-6xl"
              style={{ fontFamily: "'Clash Display', sans-serif" }}
            >
              Ask for care support with clarity, not stress.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
              Share the patient’s needs once. Our team can triage the request,
              coordinate volunteers, and guide the next steps from there.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {SERVICE_SIGNALS.map((signal) => (
              <div
                key={signal.label}
                className="rounded-full border border-white/10 bg-white/[0.05] px-4 py-3"
              >
                <p
                  className="text-lg font-bold text-white"
                  style={{ fontFamily: "'Clash Display', sans-serif" }}
                >
                  {signal.value}
                </p>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  {signal.label}
                </p>
              </div>
            ))}
          </div>

          <div className="rounded-[30px] border border-white/10 bg-white/[0.05] p-6 shadow-[0_30px_110px_rgba(8,47,73,0.3)] backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Request readiness
                </p>
                <p className="mt-2 text-3xl font-bold text-white">
                  {completionPercent}%
                </p>
              </div>
              <div className="rounded-2xl border border-cyan-300/20 bg-cyan-400/10 px-3 py-2 text-xs font-semibold text-cyan-100">
                {activeUrgency?.label || "Priority"}
              </div>
            </div>

            <div className="mt-4 h-2 rounded-full bg-white/10">
              <div
                ref={progressFillRef}
                className="h-full w-0 rounded-full bg-gradient-to-r from-cyan-300 via-emerald-300 to-cyan-400"
              />
            </div>

            <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-400/10 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100">
                Safety note
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                If the patient is having a life-threatening emergency, call
                <span className="font-semibold text-white"> 108 </span>
                or
                <span className="font-semibold text-white"> 112 </span>
                immediately before submitting this form.
              </p>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
                Current request snapshot
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <SummaryItem
                  label="Patient"
                  value={formData.patientName || "Name pending"}
                />
                <SummaryItem
                  label="District"
                  value={formData.district || "Location pending"}
                />
                <SummaryItem
                  label="Support"
                  value={
                    selectedSupportLabels.length
                      ? `${selectedSupportLabels.length} selected`
                      : "Choose support type"
                  }
                />
                <SummaryItem
                  label="Contact"
                  value={formData.preferredContact || "Set preference"}
                />
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-950/55 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-100">
              What happens after submission
            </p>
            <div className="mt-6 space-y-5">
              {RESPONSE_STEPS.map((step, index) => (
                <div key={step.title} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cyan-300/25 bg-cyan-400/10 text-sm font-semibold text-cyan-100">
                      {index + 1}
                    </span>
                    {index !== RESPONSE_STEPS.length - 1 ? (
                      <span className="mt-2 h-full w-px bg-white/10" />
                    ) : null}
                  </div>
                  <div className="pb-5">
                    <p className="text-sm font-semibold text-white">
                      {step.title}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="patient-panel rounded-[32px] border border-white/10 bg-white/[0.06] p-4 shadow-[0_32px_120px_rgba(15,23,42,0.55)] backdrop-blur sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">
                Patient intake
              </p>
              <h2
                className="mt-2 text-2xl font-bold text-white sm:text-3xl"
                style={{ fontFamily: "'Clash Display', sans-serif" }}
              >
                Tell us what the patient needs
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Keep the request short and concrete. The more specific the need,
                the faster we can coordinate the right response.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <TopNote title="Coverage" value="28 active districts" />
              <TopNote title="Helpline" value="1800-000-0000" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <PanelSection
              title="Requester & Patient Details"
              description="We need one reliable contact and a quick profile of the patient who needs help."
            >
              <div className="grid gap-5 md:grid-cols-2">
                <Input
                  label="Requester name *"
                  name="requesterName"
                  value={formData.requesterName}
                  onChange={handleChange}
                  autoComplete="name"
                  required
                  placeholder="Anita Sharma"
                />
                <Input
                  label="Patient name *"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  required
                  placeholder="Ramesh Sharma"
                />
                <Input
                  label="Relationship to patient *"
                  name="relationship"
                  value={formData.relationship}
                  onChange={handleChange}
                  required
                  placeholder="Daughter, son, spouse, self"
                />
                <Input
                  type="tel"
                  label="Phone number *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  required
                  placeholder="+91 98765 43210"
                />
                <Input
                  type="email"
                  label="Email address"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="family@example.com"
                />
                <Input
                  type="number"
                  label="Patient age"
                  name="patientAge"
                  value={formData.patientAge}
                  onChange={handleChange}
                  min="0"
                  placeholder="68"
                />
                <Input
                  label="District / city *"
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  autoComplete="address-level2"
                  required
                  placeholder="Pune, Maharashtra"
                />
                <Input
                  label="Area / locality"
                  name="locality"
                  value={formData.locality}
                  onChange={handleChange}
                  placeholder="Kothrud, Baner, Hadapsar"
                />
              </div>
            </PanelSection>

            <PanelSection
              title="Support Needed"
              description="Pick every kind of help the patient currently needs so we can route it correctly."
              aside={
                selectedSupportTypes.length
                  ? `${selectedSupportTypes.length} selected`
                  : "Choose all that apply"
              }
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {SUPPORT_TYPES.map((type) => (
                  <SupportChip
                    key={type.value}
                    icon={type.icon}
                    label={type.label}
                    note={type.note}
                    active={selectedSupportTypes.includes(type.value)}
                    onClick={() =>
                      toggleSelection(setSelectedSupportTypes)(type.value)
                    }
                  />
                ))}
              </div>
            </PanelSection>
            <PanelSection
              title="Urgency & Coordination"
              description="Tell us how soon help is needed and how we should contact you."
            >
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
                <div>
                  <p className={LABEL_CLASS_NAME}>Urgency level</p>
                  <div className="mt-3 grid gap-3">
                    {URGENCY_OPTIONS.map((option) => {
                      const active = formData.urgency === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() =>
                            setFormData((previous) => ({
                              ...previous,
                              urgency: option.value,
                            }))
                          }
                          className={`rounded-3xl border p-4 text-left transition duration-200 ${
                            active
                              ? option.accent
                              : "border-white/10 bg-white/[0.03] text-slate-200 hover:border-cyan-300/25 hover:bg-white/[0.05]"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-semibold">{option.label}</p>
                            <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                              {option.eta}
                            </span>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-400">
                            {option.tone}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {formData.urgency === "critical" ? (
                    <div className="mt-4 rounded-2xl border border-amber-300/25 bg-amber-400/10 p-4 text-sm leading-6 text-amber-50">
                      Critical requests are escalated first. If the patient is
                      unstable, unconscious, struggling to breathe, or at
                      immediate risk, call emergency services now.
                    </div>
                  ) : null}
                </div>

                <div className="space-y-5">
                  <Select
                    label="Preferred contact method *"
                    name="preferredContact"
                    value={formData.preferredContact}
                    onChange={handleChange}
                    options={CONTACT_METHODS}
                    required
                  />

                  <Select
                    label="Care setting"
                    name="careSetting"
                    value={formData.careSetting}
                    onChange={handleChange}
                    options={CARE_SETTINGS}
                  />

                  <label className="block">
                    <span className={LABEL_CLASS_NAME}>Available time windows</span>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {TIME_WINDOWS.map((window) => (
                        <PillButton
                          key={window}
                          label={window}
                          active={selectedTimeWindows.includes(window)}
                          onClick={() =>
                            toggleSelection(setSelectedTimeWindows)(window)
                          }
                        />
                      ))}
                    </div>
                  </label>

                  <label className="block">
                    <span className={LABEL_CLASS_NAME}>Preferred days</span>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {DAYS_AVAILABLE.map((day) => (
                        <DayButton
                          key={day}
                          label={day}
                          active={selectedDays.includes(day)}
                          onClick={() => toggleSelection(setSelectedDays)(day)}
                        />
                      ))}
                    </div>
                  </label>
                </div>
              </div>
            </PanelSection>

            <PanelSection
              title="Care Notes"
              description="Describe symptoms, recent treatment, mobility issues, or what kind of help is most urgent."
            >
              <div className="grid gap-5">
                <label className="block">
                  <span className={LABEL_CLASS_NAME}>Care address / visit location</span>
                  <input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Flat, street, landmark, hospital ward, or clinic address"
                    className={FIELD_CLASS_NAME}
                  />
                </label>

                <label className="block">
                  <span className={LABEL_CLASS_NAME}>Request details *</span>
                  <textarea
                    id="details"
                    name="details"
                    rows={6}
                    value={formData.details}
                    onChange={handleChange}
                    required
                    placeholder="Example: Patient was discharged after surgery yesterday and needs dressing support, medicine guidance, and transport for a check-up on Monday."
                    className={`${FIELD_CLASS_NAME} min-h-40 resize-y`}
                  />
                </label>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <input
                      type="checkbox"
                      name="transportRequired"
                      checked={formData.transportRequired}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        Transport support may be required
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Tick this if the patient may need help reaching a clinic,
                        hospital, or diagnostic center.
                      </p>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/45 p-4">
                    <input
                      type="checkbox"
                      name="consent"
                      checked={formData.consent}
                      onChange={handleChange}
                      required
                      className="mt-1 h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        I confirm the patient or caregiver has consented *
                      </p>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        This allows our team to review the request and contact
                        the listed number for coordination.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </PanelSection>

            <div className="patient-section rounded-[28px] border border-cyan-300/20 bg-cyan-400/10 p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-white">
                    Ready to send the patient request?
                  </p>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-cyan-50/75">
                    Our coordinators review every request carefully. Clear
                    details help us route urgent support faster and avoid repeat
                    follow-up calls.
                  </p>
                </div>

                <button
                  ref={submitButtonRef}
                  type="submit"
                  className="inline-flex min-w-[220px] items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-300 to-emerald-300 px-6 py-4 text-base font-semibold text-slate-950 transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(45,212,191,0.22)] focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
                >
                  Submit Patient Request
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function PanelSection({ title, description, aside, children }) {
  return (
    <section className="patient-section rounded-[28px] border border-white/10 bg-slate-950/45 p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_0_6px_rgba(125,211,252,0.14)]" />
            <h3 className="text-lg font-semibold text-white">{title}</h3>
          </div>
          {description ? (
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              {description}
            </p>
          ) : null}
        </div>

        {aside ? (
          <span className="inline-flex w-fit rounded-full border border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-100">
            {aside}
          </span>
        ) : null}
      </div>

      {children}
    </section>
  );
}

function Input({ label, name, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className={LABEL_CLASS_NAME}>{label}</span>
      <input id={name} name={name} className={FIELD_CLASS_NAME} {...props} />
    </label>
  );
}

function Select({ label, name, options = [], value, onChange, required }) {
  return (
    <label className="block">
      <span className={LABEL_CLASS_NAME}>{label}</span>
      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className={`${FIELD_CLASS_NAME} appearance-none pr-12`}
        >
          <option value="">Select one</option>
          {options.map((option) => (
            <option key={option} value={option} className="bg-slate-900">
              {option}
            </option>
          ))}
        </select>
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M6 9L12 15L18 9"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </label>
  );
}

function SupportChip({ icon, label, note, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex min-h-[118px] w-full flex-col items-start justify-between rounded-3xl border p-4 text-left transition duration-200 ${
        active
          ? "border-cyan-300 bg-cyan-400/12 shadow-[0_16px_36px_rgba(34,211,238,0.14)]"
          : "border-white/10 bg-white/[0.04] hover:border-cyan-300/30 hover:bg-white/[0.06]"
      }`}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-xl">
        {icon}
      </span>
      <div className="mt-4">
        <p className="text-sm font-semibold text-white">{label}</p>
        <p className="mt-2 text-sm leading-6 text-slate-400">{note}</p>
      </div>
    </button>
  );
}

function PillButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-4 py-2.5 text-sm font-medium transition duration-200 ${
        active
          ? "border-cyan-300 bg-cyan-400/12 text-cyan-100"
          : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-cyan-300/30 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function DayButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex h-11 w-11 items-center justify-center rounded-full border text-xs font-semibold transition duration-200 ${
        active
          ? "border-emerald-300 bg-emerald-400/15 text-emerald-100"
          : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-emerald-300/35 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function TopNote({ title, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/45 px-4 py-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}

function PatientSupportSuccess({ patientName, district, urgency, onReset }) {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { scale: 0.92, opacity: 0, y: 20 },
      { scale: 1, opacity: 1, y: 0, duration: 0.7, ease: "back.out(1.4)" }
    );
  }, []);

  const urgencyLabel =
    URGENCY_OPTIONS.find((option) => option.value === urgency)?.label ||
    "Priority";

  return (
    <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-slate-100">
      <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-cyan-400/12 blur-[130px]" />
      <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-emerald-400/10 blur-[150px]" />

      <div
        ref={cardRef}
        className="relative w-full max-w-xl rounded-[32px] border border-white/10 bg-white/[0.06] p-8 text-center shadow-[0_32px_120px_rgba(15,23,42,0.55)] backdrop-blur sm:p-10"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-cyan-400/15 text-4xl">
          ✳
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.32em] text-cyan-100">
          Request received
        </p>
        <h2
          className="mt-4 text-3xl font-bold text-white sm:text-4xl"
          style={{ fontFamily: "'Clash Display', sans-serif" }}
        >
          Support request logged for {patientName || "the patient"}.
        </h2>
        <p className="mt-4 text-base leading-7 text-slate-300">
          Our care desk has received the request
          {district ? ` for ${district}` : ""} and marked it as
          <span className="font-semibold text-white"> {urgencyLabel}</span>.
          We will use the submitted details to begin triage and coordination.
        </p>

        <div className="mt-8 rounded-3xl border border-white/10 bg-slate-950/50 p-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Next steps
          </p>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-300">
            <p>1. A coordinator reviews the request and urgency level.</p>
            <p>2. Matching starts with nearby care, transport, or counseling support.</p>
            <p>3. You receive a confirmation call or message on the preferred channel.</p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="mt-8 inline-flex items-center justify-center rounded-2xl border border-cyan-300/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition duration-200 hover:border-cyan-200/50 hover:bg-cyan-400/15"
        >
          Submit another request
        </button>
      </div>
    </section>
  );
}
