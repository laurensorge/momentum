import { useState } from 'react';
import './completion-preview.css';

export function WorkoutCompletion({ workout, weeklyCount, onClose, onHome, onFeeling, preview = false }) {
  const [feeling, setFeeling] = useState(workout.feeling || null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const choose = async value => {
    if (busy) return;
    const next = feeling === value ? null : value;
    setBusy(true); setError('');
    try { await onFeeling?.(next); setFeeling(next); } catch { setError('Couldn’t save your feedback. Please try again.'); }
    finally { setBusy(false); }
  };
  return <main className="completion-preview">
    <img className="completion-art" src={workout.image} alt="" />
    <div className="completion-shade" />
    <div className="completion-confetti" aria-hidden="true">{Array.from({ length: 22 }, (_, i) => <i key={i} style={{ '--x': `${(i * 37) % 100}%`, '--delay': `${(i % 5) * .09}s`, '--turn': `${i * 49}deg` }} />)}</div>
    <header className="completion-header"><img src="/momentum-logo.svg" alt="Momentum" /><button disabled={busy} onClick={onClose} aria-label="Close celebration">×</button></header>
    <section className="completion-content">
      <div className="completion-check" aria-hidden="true"><svg viewBox="0 0 32 32" fill="none"><path d="m8 16 5 5L24 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      <p className="completion-eyebrow">WORKOUT COMPLETE</p>
      <h1>Workout crushed<span>.</span></h1>
      <h2>{workout.title}</h2>
      <p className="completion-message">Take a breath. Enjoy the finish.</p>
      <div className="completion-stats"><div><strong>{workout.exerciseCount}<span>/{workout.exerciseCount}</span></strong><span>Exercises completed</span></div><div><strong>{weeklyCount} {weeklyCount === 1 ? 'workout' : 'workouts'}</strong><span>Completed this week</span></div></div>
      <fieldset disabled={busy} className="completion-feeling"><legend>How did it feel? <span>Optional</span></legend><div>{['Easy', 'Just right', 'Tough'].map(value => <button key={value} aria-pressed={feeling === value} onClick={() => choose(value)}>{value}</button>)}</div></fieldset>
      {error && <p role="alert">{error}</p>}
      <button disabled={busy} className="completion-home" onClick={onHome}>{busy ? 'Saving…' : 'Back to Home'}</button>
      {preview && <p className="completion-demo">Design preview · Sample stats · Nothing saved</p>}
    </section>
  </main>;
}

export default function CompletionPreview() {
  const close = () => window.location.assign('/');
  return <WorkoutCompletion preview workout={{ title: 'Glute Burnout', image: '/images/main-burnout.png', exerciseCount: 7 }} weeklyCount={3} onClose={close} onHome={close} />;
}
