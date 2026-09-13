import { useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import BodyFocus from "../BodyFocus";
import "../plan-mockup.css";
import { ACTIVITIES, EQUIPMENT, FREQUENCIES, GOALS, LEVELS, buildPersonalizedPlan } from "./personalization";

const STEPS = [
  { key: "goal", title: "What are your fitness goals? 🎯", subtitle: "Select one option.", type: "single", options: GOALS },
  { key: "level", title: "What’s your current fitness level? 💪", subtitle: "Select one option.", type: "single", options: LEVELS },
  { key: "focus", title: "Where do you want to focus?", subtitle: "Select the areas you’d like to prioritize. Leave everything unselected for a balanced plan.", type: "body" },
  { key: "activities", title: "What types of activities do you enjoy? 🏋️", subtitle: "Select all that apply.", type: "multi", options: ACTIVITIES },
  { key: "equipment", title: "What equipment do you have access to? 🚴", subtitle: "Select all that apply.", type: "multi", options: EQUIPMENT },
  { key: "frequency", title: "How often do you want to workout? 🏃", subtitle: "Select one option.", type: "single", options: FREQUENCIES },
];

const DEFAULTS = {
  goal: "general_fitness",
  level: "beginner",
  focus: [],
  activities: [],
  equipment: [],
  frequency: "3_4_days",
};

const SUMMARY_IMAGES = {
  "Strength Training": "/images/main-back.png",
  HIIT: "/images/main-quads.png",
  Running: "/images/workout-lower-cardio-v2.png",
  Yoga: "/images/workout-stretch-mobility-v2.png",
  Mobility: "/images/workout-stretch-mobility-v2.png",
  "Full Body Strength": "/images/main-quads.png",
  "Lower Body Strength": "/images/main-glutes.png",
  "Upper Body Strength": "/images/main-back.png",
  "Core & Stability": "/images/workout-core-stability-v2.png",
};

function Progress({ step }) {
  return (
    <div role="progressbar" aria-label="Onboarding progress" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} style={{ display: "grid", gridTemplateColumns: `repeat(${STEPS.length}, 1fr)`, gap: 5 }}>
      {STEPS.map((item, index) => (
        <div key={item.key} style={{ height: 5, background: index === step ? "linear-gradient(90deg,#DDFB24,#ff7a1a)" : "#302F2F" }} />
      ))}
    </div>
  );
}

function ChoiceCard({ option, selected, onClick }) {
  return (
    <button type="button" onClick={onClick} style={{
      width: "100%", minHeight: 76, padding: "15px 18px", display: "flex", alignItems: "center", gap: 16,
      textAlign: "left", color: "#fff", cursor: "pointer", fontFamily: "'DM Sans',sans-serif",
      background: "linear-gradient(180deg,#171717,#0d0b0b)", borderRadius: 16,
      border: selected ? "1px solid rgba(221,251,36,0.7)" : "1px solid #525252",
      boxShadow: selected ? "0 10px 30px rgba(221,251,36,0.1)" : "none",
    }}>
      {option.icon && (
        <span style={{ width: 44, height: 44, flexShrink: 0, overflow: "hidden" }}>
          <img src={option.icon} alt="" aria-hidden="true" style={{ width: 44, height: 44, display: "block" }} />
        </span>
      )}
      <span style={{ flex: 1 }}>
        <strong style={{ display: "block", fontSize: 16, lineHeight: 1.25 }}>{option.title}</strong>
        <span style={{ display: "block", color: "#ADADAD", fontSize: 13, marginTop: 5 }}>{option.description}</span>
      </span>
      <span style={{ width: 20, height: 20, borderRadius: "50%", border: `2px solid ${selected ? "#DDFB24" : "#d8d8d8"}`, padding: 3, boxSizing: "border-box" }}>
        {selected && <span style={{ display: "block", width: "100%", height: "100%", borderRadius: "50%", background: "#DDFB24" }} />}
      </span>
    </button>
  );
}

export default function OnboardingFlow({ user, profile, onComplete, preview = false, previewStartAtFocus = false }) {
  const [step, setStep] = useState(preview && previewStartAtFocus ? STEPS.findIndex(item => item.key === 'focus') : 0);
  const [answers, setAnswers] = useState(DEFAULTS);
  const [success, setSuccess] = useState(false);
  const [savedProfile, setSavedProfile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const plan = useMemo(() => buildPersonalizedPlan(answers), [answers]);
  const current = STEPS[step];

  const selected = (option) => current.type === "multi"
    ? answers[current.key].includes(option)
    : answers[current.key] === option.id;

  const choose = (option) => {
    if (current.type === "multi") {
      setAnswers((previous) => ({
        ...previous,
        [current.key]: previous[current.key].includes(option)
          ? previous[current.key].filter((item) => item !== option)
          : [...previous[current.key], option],
      }));
    } else {
      setAnswers((previous) => ({ ...previous, [current.key]: option.id }));
    }
  };

  const next = async () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    if (preview) {
      setSuccess(true);
      return;
    }
    setSaving(true);
    setError("");
    const completedAt = new Date().toISOString();
    const { data, error: saveError } = await supabase
      .from("profiles")
      .update({
        fitness_goal: answers.goal,
        fitness_level: answers.level,
        preferred_activities: answers.activities,
        available_equipment: answers.equipment,
        workout_frequency: answers.frequency,
        personalized_plan: plan,
        onboarding_completed_at: completedAt,
      })
      .eq("id", user.id)
      .select()
      .single();

    if (saveError) setError("We couldn’t save your answers yet. Make sure the latest Supabase setup script has been run.");
    else {
      setSavedProfile({ ...profile, ...data });
      setSuccess(true);
    }
    setSaving(false);
  };

  if (success) {
    const summary = plan.weekly_schedule.slice(0, 4);
    return (
      <main style={styles.wrap}>
        <section style={{ padding: "64px 20px 36px" }}>
          <h1 style={styles.title}>You’re All Set!</h1>
          <p style={styles.subtitle}>Here’s what we’ve tailored for you based on your input.</p>
          <div style={{ ...styles.heroCard, marginTop: 32 }}>
            <div style={{ position: "relative", zIndex: 1, maxWidth: "68%" }}>
              <strong style={{ fontSize: 15 }}>Fitness Goal</strong>
              <h2 style={{ fontSize: 25, margin: "8px 0" }}>{plan.title}</h2>
              <p style={{ ...styles.small, lineHeight: 1.5 }}>{plan.description}</p>
            </div>
            <img src="/images/main-quads.png" alt="" style={styles.cardImage} />
          </div>
          <h2 style={{ fontSize: 20, margin: "24px 0 4px" }}>Your weekly plan</h2>
          <p style={styles.small}>{plan.days_per_week} tailored training days based on your preferences.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
            {summary.map((item) => (
              <div key={item.day} style={styles.summaryCard}>
                <div style={{ position: "relative", zIndex: 1, maxWidth: "65%" }}>
                  <strong style={{ fontSize: 16 }}>{item.focus}</strong>
                  <p style={{ ...styles.small, marginTop: 6 }}>{item.duration_minutes} minutes · Day {item.day}</p>
                </div>
                <img src={SUMMARY_IMAGES[item.focus] || "/images/main-posture.png"} alt="" style={styles.cardImage} />
              </div>
            ))}
          </div>
          <button type="button" onClick={() => onComplete(savedProfile)} style={{ ...styles.primary, marginTop: 28 }}>Start Exploring Momentum</button>
          <button type="button" onClick={() => { setSuccess(false); setStep(0); }} style={styles.skip}>Edit My Preferences</button>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.wrap}>
      <section style={{ minHeight: "100vh", padding: "66px 22px 26px", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
        <Progress step={step} />
        <div style={{ marginTop: 46 }}>
          <h1 style={styles.title}>{current.title}</h1>
          <p style={styles.subtitle}>{current.subtitle}</p>
        </div>
        <div style={{ display: "flex", flexDirection: current.type === "multi" ? "row" : "column", flexWrap: "wrap", gap: current.type === "multi" ? 10 : 16, marginTop: current.type === "body" ? 16 : 28 }}>
          {current.type === "body" ? <div className="pm" style={{ width: "100%", minHeight: 0, background: "transparent", paddingBottom: 0 }}><BodyFocus hideHeading plan={answers} onChange={setAnswers} /></div> : current.options.map((option) => current.type === "multi" ? (
            <button key={option} type="button" onClick={() => choose(option)} style={{
              padding: "10px 14px", borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: 15, fontWeight: 600, cursor: "pointer",
              background: selected(option) ? "#DDFB24" : "#141414", color: selected(option) ? "#000" : "#fff",
              border: selected(option) ? "1px solid #DDFB24" : "1px solid #525252",
            }}>{option}</button>
          ) : (
            <ChoiceCard key={option.id} option={option} selected={selected(option)} onClick={() => choose(option)} />
          ))}
        </div>
        <div style={{ marginTop: "auto", paddingTop: 28 }}>
          {error && <p role="alert" style={{ color: "#ff9a9a", fontSize: 12, marginBottom: 10 }}>{error}</p>}
          <button type="button" onClick={next} disabled={saving} style={{ ...styles.primary, opacity: saving ? 0.6 : 1 }}>{saving ? "Building your plan…" : "Next"}</button>
          <button type="button" onClick={() => step < STEPS.length - 1 ? setStep(step + 1) : next()} style={styles.skip}>Skip</button>
        </div>
      </section>
    </main>
  );
}

const styles = {
  wrap: { background: "radial-gradient(circle at 50% 18%,#111204 0%,#050600 38%,#020300 100%)", minHeight: "100vh", maxWidth: 430, margin: "0 auto", color: "#fff", fontFamily: "'DM Sans',sans-serif" },
  title: { fontSize: 34, lineHeight: 1.12, margin: 0, letterSpacing: -0.7 },
  subtitle: { color: "#c3c3c3", fontSize: 18, lineHeight: 1.35, margin: "20px 0 0" },
  small: { color: "#ADADAD", fontSize: 14, margin: 0 },
  primary: { width: "100%", minHeight: 48, borderRadius: 13, background: "linear-gradient(180deg,#DDFB24,#d8ff10)", color: "#000", border: "1px solid #efff75", boxShadow: "0 0 0 3px #59660b", fontSize: 16, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  skip: { width: "100%", padding: "18px 0 4px", background: "none", border: "none", color: "#DDFB24", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif" },
  heroCard: { minHeight: 140, border: "1px solid #DDFB24", borderRadius: 22, padding: 22, overflow: "hidden", position: "relative", background: "#111" },
  summaryCard: { minHeight: 100, border: "1px solid #454545", borderRadius: 22, padding: 18, overflow: "hidden", position: "relative", background: "#111", display: "flex", alignItems: "center" },
  cardImage: { position: "absolute", inset: "0 0 0 42%", width: "58%", height: "100%", objectFit: "cover", opacity: 0.7, maskImage: "linear-gradient(90deg,transparent,#000 40%)", WebkitMaskImage: "linear-gradient(90deg,transparent,#000 40%)" },
};
