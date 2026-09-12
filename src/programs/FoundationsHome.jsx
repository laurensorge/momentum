import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { localDate } from './foundations';
import '../plan-mockup.css';

export default function FoundationsHome({ assignment, onSettings, onNutrition }) {
  const today = localDate();
  const sessions = assignment.prescription.sessions;
  const current = sessions.find(session => session.date === today);
  const upcoming = sessions.find(session => session.date >= today);
  const [detail, setDetail] = useState(null);
  const [log, setLog] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [week, setWeek] = useState((current || upcoming)?.week || 4);
  const open = async session => {
    setBusy(true); setError(''); setDetail(session); setLog(null);
    try {
      const { data, error } = await supabase.from('workout_sessions').select('*').eq('assignment_id', assignment.id).eq('session_key', session.key).maybeSingle();
      if (error) throw error;
      setLog(data || { performance: { completed: [], notes: '' } });
    } catch { setError('Couldn’t load this workout’s progress. Go back and try again.'); }
    finally { setBusy(false); }
  };
  const save = async performance => {
    setBusy(true); setError('');
    try {
      const { data, error } = await supabase.from('workout_sessions').upsert({ user_id: assignment.user_id, assignment_id: assignment.id, session_key: detail.key, scheduled_on: detail.date, prescription: detail, performance, started_at: log.started_at || new Date().toISOString(), completed_at: performance.completed.length === detail.exercises.length ? new Date().toISOString() : null }, { onConflict: 'assignment_id,session_key' }).select().single();
      if (error) throw error;
      setLog(data);
    } catch { setError('Couldn’t save progress. Please try again.'); }
    finally { setBusy(false); }
  };
  return <main className="pm"><header className="pm-header">{detail ? <button className="pm-back" disabled={busy} onClick={() => setDetail(null)} aria-label="Back to Home">←</button> : <span />}<span>MOMENTUM</span><button className="pm-back" disabled={busy} onClick={onSettings} aria-label="Settings">⚙</button></header><div className="pm-content">
    {detail ? <><p className="pm-eyebrow">Week {detail.week} · {detail.date}</p><h1>{detail.title}</h1><p>{detail.guidance}</p>{busy && <p role="status">Syncing…</p>}{detail.date > today && <p>Preview — tracking opens on the scheduled day.</p>}{detail.exercises.map((exercise, i) => <div className="pm-card" key={exercise.name}><label style={{ display: 'flex', alignItems: 'center', gap: 12 }}><input type="checkbox" disabled={busy || !log || detail.date > today} checked={log?.performance?.completed?.includes(i) || false} onChange={() => { const completed = log.performance?.completed || []; save({ ...log.performance, completed: completed.includes(i) ? completed.filter(item => item !== i) : [...completed, i] }); }} /><strong>{exercise.name}</strong></label><p>{exercise.sets} × {exercise.reps}</p><p>{exercise.notes}</p></div>)}{log?.completed_at && <p role="status">✓ Workout complete. Progress saved.</p>}</> : <>
      <p className="pm-eyebrow">YOUR FOUR-WEEK PROGRAM</p><h1>{assignment.prescription.title}</h1><p>{assignment.starts_on} – {assignment.prescription.ends_on}</p>
      {today > assignment.prescription.ends_on ? <section className="pm-card"><h2>Your four-week block has ended</h2><p>Your workout history is available below. The program won’t automatically restart.</p></section> : <section className="pm-card"><h2>{current ? 'Today’s workout' : today < assignment.starts_on ? 'Your program starts soon' : 'Recovery day'}</h2><p>{current?.title || 'Keep movement easy and optional.'}</p>{(current || upcoming) && <button className="pm-primary" onClick={() => open(current || upcoming)}>{current ? 'View workout' : `Preview ${upcoming.date}`} →</button>}</section>}
      <div className="pm-chips" aria-label="Program week">{[1,2,3,4].map(value => <button className="pm-toggle" aria-pressed={week === value} key={value} onClick={() => setWeek(value)}>Week {value}</button>)}</div>
      {sessions.filter(session => session.week === week).map(session => <button className="pm-settings-row" style={{ marginTop: 14 }} key={session.key} onClick={() => open(session)}><span><strong>{session.title}</strong><small>{session.date} · {session.duration}</small></span><span>→</span></button>)}
      <p>Targets are adjustable: repeat a manageable workload rather than forcing an increase. Stop a movement that causes sharp or increasing pain.</p>
      <button className="pm-secondary" onClick={onNutrition}>View nutrition</button>
    </>}{error && <p role="alert">{error}</p>}</div></main>;
}
