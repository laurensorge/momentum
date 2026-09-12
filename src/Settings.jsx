import { useState } from 'react';
import { supabase } from './lib/supabase';
import BodyFocus from './BodyFocus';
import PreferenceChoices from './onboarding/PreferenceChoices';
import { preferencesFromProfile, preferenceFields } from './onboarding/preferences';
import { GOALS, LEVELS, ACTIVITIES } from './onboarding/personalization';
import './plan-mockup.css';

export default function Settings({ profile, onProfileChange, onClose, onSignOut, onStartProgram, activeProgram }) {
  const [editing, setEditing] = useState(false);
  const [answers, setAnswers] = useState(() => preferencesFromProfile(profile));
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const saved = preferencesFromProfile(profile);
  const changed = JSON.stringify(answers) !== JSON.stringify(saved);
  const save = async () => {
    setBusy(true); setMessage('');
    try {
      const { data, error } = await supabase.from('profiles').update(preferenceFields(answers)).eq('id', profile.id).select().single();
      if (error) throw error;
      onProfileChange(data); setEditing(false);
      setMessage('Preferences saved. Your current workout schedule is unchanged.');
    } catch { setMessage('Couldn’t save your preferences. Please try again. If this persists, the database may need its latest update.'); }
    finally { setBusy(false); }
  };
  const signOut = async () => { setBusy(true); setMessage(''); try { await onSignOut(); } catch { setMessage('Couldn’t sign out. Please try again.'); } finally { setBusy(false); } };
  return <main className="pm">
    <header className="pm-header"><button className="pm-back" disabled={busy} aria-label={editing ? 'Back to Settings' : 'Back to Home'} onClick={() => { if (editing) { setEditing(false); setAnswers(saved); setMessage(''); } else onClose(); }}>←</button></header>
    <div className="pm-content"><h1>{editing ? 'Make it fit your life.' : 'Settings'}</h1>
      {editing ? <>
        <p className="pm-intro">Update your training preferences.</p>
        <fieldset><legend>What are you working toward?</legend>{GOALS.map(goal => <label className={`pm-choice ${answers.goal === goal.id ? 'selected' : ''}`} key={goal.id}><input type="radio" name="goal" checked={answers.goal === goal.id} onChange={() => setAnswers({ ...answers, goal: goal.id })} /><span><strong>{goal.title}</strong><small>{goal.description}</small></span></label>)}</fieldset>
        <fieldset><legend>Your experience level</legend><div className="pm-chips">{LEVELS.map(level => <button className="pm-toggle" key={level.id} aria-pressed={answers.level === level.id} onClick={() => setAnswers({ ...answers, level: level.id })}>{level.title}</button>)}</div></fieldset>
        <fieldset><legend>Which days work for you?</legend><p>Choose your usual training days.</p><PreferenceChoices kind="days" answers={answers} onChange={setAnswers} /></fieldset>
        <fieldset><legend>Time per session</legend><PreferenceChoices kind="time" answers={answers} onChange={setAnswers} /></fieldset>
        <fieldset><legend>Your available equipment</legend><p>Tap to add or remove equipment. Leave blank for bodyweight workouts.</p><PreferenceChoices kind="equipment" answers={answers} onChange={setAnswers} /></fieldset>
        <fieldset><legend>Activities you enjoy</legend><div className="pm-chips">{ACTIVITIES.map(activity => <button className="pm-toggle" key={activity} aria-pressed={answers.activities.includes(activity)} onClick={() => setAnswers({ ...answers, activities: answers.activities.includes(activity) ? answers.activities.filter(value => value !== activity) : [...answers.activities, activity] })}>{activity}</button>)}</div></fieldset>
        <BodyFocus plan={answers} onChange={setAnswers} />
        <p>Your choices will be used for future personalized programs. They won’t change your current workout schedule yet.</p>
        <button className="pm-primary" disabled={busy || !answers.days.length || !changed} onClick={save}>{busy ? 'Saving…' : 'Save preferences'}</button>
        <button className="pm-secondary" disabled={busy} onClick={() => { setAnswers(saved); setEditing(false); setMessage(''); }}>Cancel</button>
      </> : <>
        <p className="pm-intro">Make Momentum work for you.</p>
        {activeProgram && <section className="pm-card"><h2>{activeProgram}</h2><p>Your saved program keeps its original preferences. Editing preferences does not replace it.</p></section>}
        {onStartProgram && <section className="pm-card"><h2>Momentum Foundations is ready</h2><p>Four weeks · 3 sessions per week · 30–40 minutes. You’ll need dumbbells, a sturdy chair, and walking space. This becomes your active program; previous workout records stay saved.</p><button className="pm-primary" disabled={busy} onClick={async () => { setBusy(true); setMessage(''); try { await onStartProgram(); } catch { setMessage('Couldn’t start your program. Reload and try again.'); } finally { setBusy(false); } }}>{busy ? 'Starting…' : 'Start Foundations'}</button></section>}
        <button className="pm-settings-row" onClick={() => { setAnswers(saved); setEditing(true); setMessage(''); }}><span><strong>Manage my plan</strong><small>{GOALS.find(goal => goal.id === saved.goal)?.title} · {saved.level}</small></span><span>→</span></button>
        <section className="pm-card"><h2>Your preferences</h2><dl><div><dt>Days</dt><dd>{saved.days.join(' / ')}</dd></div><div><dt>Time</dt><dd>{saved.time} min</dd></div><div><dt>Equipment</dt><dd>{saved.equipment.join(', ') || 'Bodyweight'}</dd></div><div><dt>Body focus</dt><dd>{saved.focus.join(', ') || 'Full body'}</dd></div></dl></section>
        <div className="pm-account-actions"><button className="pm-signout" disabled={busy} onClick={signOut}>{busy ? 'Signing out…' : 'Sign out'}<span aria-hidden="true">→</span></button></div>
      </>}
      {message && <p role="status">{message}</p>}
    </div>
  </main>;
}
