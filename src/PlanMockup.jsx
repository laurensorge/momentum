import { useEffect, useRef, useState } from 'react';
import './plan-mockup.css';
import BodyFocus, { FocusSummary } from './BodyFocus';

const PROGRAMS = {
  foundations: { name: 'Momentum Foundations', goal: 'General fitness', image: '/images/workout-full-body-light-v2.png', description: 'Build a routine that feels like you.', sessions: ['Full Body Foundations', 'Cardio & Mobility', 'Full Body Balance'], time: '30–40' },
  build: { name: 'Momentum Build', goal: 'Build muscle', image: '/images/main-back.png', description: 'Get stronger, one session at a time.', sessions: ['Squat, Push & Pull', 'Hinge, Shoulders & Legs', 'Full Body Practice'], time: '40–50' },
  move: { name: 'Momentum Move', goal: 'Weight loss', image: '/images/workout-lower-cardio-v2.png', description: 'Find your rhythm with strength and cardio.', sessions: ['Strength + Cardio A', 'Steady Cardio & Mobility', 'Strength + Cardio B'], time: '30–40' },
};
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const EQUIPMENT = ['Dumbbells', 'Resistance bands', 'Kettlebells', 'Barbell', 'Bench', 'Cable machine', 'Weight machines', 'Pull-up bar', 'Treadmill', 'Bike', 'Yoga mat'];
const INITIAL = { program: 'foundations', level: 'Beginner', focus: [], equipment: 'Dumbbells / Yoga mat', time: '30–40', days: 'Mon / Wed / Fri', week: 2 };
const values = value => value ? value.split(' / ') : [];
const toggle = (value, item, order) => order.filter(option => option === item ? !values(value).includes(option) : values(value).includes(option)).join(' / ');
const equipmentLabel = value => value || 'No equipment';
// Illustrative session allocation for the mockup; detailed plans are not generated here.
const schedule = plan => {
  let strengthCount = 0;
  let previousDay = -2;
  const selected = values(plan.days);
  return selected.map(day => {
    const index = DAYS.indexOf(day);
    const adjacent = index === previousDay + 1 || (index === 6 && selected.includes('Sun'));
    const strength = !adjacent && strengthCount < (plan.program === 'build' ? 3 : 2);
    previousDay = index;
    const title = strength ? PROGRAMS[plan.program].sessions[plan.program === 'build' ? strengthCount : strengthCount === 0 ? 0 : 2] : 'Easy Cardio & Mobility';
    if (strength) strengthCount++;
    return { day, title };
  });
};
const dateLabel = (date) => date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

export default function PlanMockup({ onClose, onSignOut, initialScreen = 'manage' }) {
  const [signingOut, setSigningOut] = useState(false);
  const [signOutMessage, setSignOutMessage] = useState('');
  const signOut = async () => {
    if (!onSignOut) { setSignOutMessage('Preview only — your account is still signed in.'); return; }
    setSigningOut(true);
    setSignOutMessage('');
    try { await onSignOut(); } catch { setSignOutMessage('Couldn’t sign out. Please try again.'); } finally { setSigningOut(false); }
  };
  const goHome = () => onClose ? onClose() : window.location.assign('/');
  const [screen, setScreen] = useState(initialScreen);
  const [active, setActive] = useState(INITIAL);
  const [draft, setDraft] = useState(INITIAL);
  const [pending, setPending] = useState(null);
  const [history, setHistory] = useState([]);
  const [timing, setTiming] = useState('next');
  const [result, setResult] = useState('');
  const heading = useRef(null);
  useEffect(() => { window.scrollTo(0, 0); heading.current?.focus(); }, [screen]);
  const current = PROGRAMS[active.program];
  const proposed = PROGRAMS[draft.program];
  const changedProgram = draft.program !== active.program || draft.level !== active.level;
  const changed = changedProgram || ['equipment', 'time', 'days', 'focus'].some(key => JSON.stringify(draft[key]) !== JSON.stringify(active[key]));
  const next = new Date();
  next.setDate(next.getDate() + ((8 - next.getDay()) % 7 || 7));
  const titles = { manage: 'Manage my plan', preferences: 'Make it fit your life.', preview: 'Your next chapter.', success: 'You’re all set.', settings: 'Settings' };
  const edit = () => { setDraft({ ...active }); setTiming('next'); setScreen('preferences'); };
  const confirm = () => {
    const replacement = { ...draft, week: changedProgram ? 1 : active.week };
    if (timing === 'next') {
      setPending({ ...replacement, date: dateLabel(next) });
      setResult(`${proposed.name} ${changedProgram ? 'starts' : 'updates'} ${dateLabel(next)}.`);
    } else {
      if (changedProgram) setHistory(items => [{ name: current.name, week: active.week }, ...items]);
      setActive(replacement);
      setPending(null);
      setResult(changedProgram ? `${proposed.name} is ready for your next workout.` : 'Your preferences are updated for upcoming workouts.');
    }
    setScreen('success');
  };

  return <main className="pm">
    {screen !== 'manage' && <header className="pm-header">
      {screen !== 'settings' || onClose ? <button className="pm-back" aria-label={screen === 'settings' ? 'Back to Home' : screen === 'manage' ? 'Back to Settings' : 'Back'} onClick={() => screen === 'settings' ? onClose?.() : setScreen(screen === 'manage' ? 'settings' : screen === 'preview' ? 'preferences' : 'manage')}>←</button> : <span aria-hidden="true" />}
      {screen !== 'settings' ? <span>MOMENTUM</span> : <span aria-hidden="true" />}
      <span aria-hidden="true" />
    </header>}
    <div className="pm-content" style={screen === 'manage' ? { paddingTop: 24 } : undefined}>
      <p className="pm-eyebrow">{screen === 'preview' ? '02 / REVIEW YOUR PLAN' : screen === 'preferences' ? '01 / YOUR PREFERENCES' : 'YOUR TRAINING, YOUR WAY'}</p>
      <h1 ref={heading} tabIndex={-1}>{titles[screen]}</h1>

      {screen === 'manage' && <>
        <p className="pm-intro">A little consistency. A lot of possibility.</p>
        <section className="pm-hero" style={{ backgroundImage: `linear-gradient(0deg, #080805 4%, #08080577 65%), url(${current.image})` }}>
          <span className="pm-badge">CURRENT PROGRAM</span>
          <div><p className="pm-eyebrow">{current.goal}</p><h2>{current.name}</h2><p>Week {active.week} of 4 · {active.level}</p></div>
        </section>
        <div className="pm-weeks" aria-label={`Week ${active.week} of four`}>{['Establish', 'Build', 'Progress', 'Consolidate'].map((label, index) => <div key={label} className={index + 1 <= active.week ? 'filled' : ''}><span>W{index + 1}</span><small>{label}</small></div>)}</div>
        {pending && <section className="pm-notice" role="status"><strong>{PROGRAMS[pending.program].name} · {pending.date}</strong><p>Your current plan continues until then.</p><button className="pm-link" onClick={() => setPending(null)}>Cancel scheduled change</button></section>}
        <section className="pm-card"><div className="pm-section-title"><h2>Your preferences</h2><button className="pm-link" onClick={edit}>Edit</button></div><dl><div><dt>Schedule</dt><dd>{active.days}</dd></div><div><dt>Session length</dt><dd>{active.time} min</dd></div><div><dt>Equipment</dt><dd>{equipmentLabel(active.equipment)}</dd></div></dl></section>
        <section className="pm-card"><h2>Your body focus</h2><FocusSummary plan={active} /></section>
        <div className="pm-section-title"><h2>This week</h2><span className="pm-muted">{values(active.days).length} sessions</span></div>
        <div className="pm-schedule">{schedule(active).map(({ day, title }) => <div key={day}><span className="pm-day">{day}</span><div><strong>{title}</strong><small>{active.time} min</small></div></div>)}</div>
        <button className="pm-primary" onClick={edit}>Change my program <span>→</span></button>
        <p className="pm-footnote">Your completed workouts stay with you.</p>
        <button className="pm-secondary" onClick={goHome}>Back to Home</button>
        <section className="pm-history"><h2>Program history</h2>{history.length ? history.map((item, i) => <div className="pm-history-row" key={i}><strong>{item.name}</strong><small>Switched after week {item.week} · Workouts retained</small></div>) : <p>Your previous programs will appear here when you switch.</p>}</section>
      </>}

      {screen === 'preferences' && <>
        <p className="pm-intro">Keep what works. Adjust what you need.</p>
        <fieldset><legend>What are you working toward?</legend>{Object.entries(PROGRAMS).map(([id, program]) => <label className={`pm-choice ${draft.program === id ? 'selected' : ''}`} key={id}><input type="radio" name="program" checked={draft.program === id} onChange={() => setDraft({ ...draft, program: id })}/><span><strong>{program.goal}</strong><small>{program.name}</small></span></label>)}</fieldset>
        <fieldset><legend>Your experience level</legend><div className="pm-chips">{['Beginner', 'Intermediate', 'Advanced'].map(level => <button type="button" className="pm-toggle" key={level} aria-pressed={draft.level === level} onClick={() => setDraft({ ...draft, level })}>{level}</button>)}</div><p className="pm-muted">{draft.level === 'Beginner' ? 'New to training or getting back into a routine.' : draft.level === 'Intermediate' ? 'Training regularly and comfortable with the main movements.' : 'Experienced with structured training and managing your progression.'}</p></fieldset>
        <fieldset><legend>Which days work for you?</legend><p className="pm-muted">Pick the days you want to move. We’ll work recovery into your schedule.</p><div className="pm-days">{DAYS.map(day => <button type="button" className="pm-toggle" key={day} aria-pressed={values(draft.days).includes(day)} onClick={() => setDraft({ ...draft, days: toggle(draft.days, day, DAYS) })}>{day}</button>)}</div><p className="pm-muted" role="status">{values(draft.days).length ? `${values(draft.days).length} ${values(draft.days).length === 1 ? 'day' : 'days'} per week selected` : 'Select at least one training day.'}</p></fieldset>
        <fieldset><legend>Time per session</legend><div className="pm-chips">{['20–30', '30–40', '40–50', '50–60'].map(time => <button type="button" className="pm-toggle" key={time} aria-pressed={draft.time === time} onClick={() => setDraft({ ...draft, time })}>{time} min</button>)}</div></fieldset>
        <fieldset><legend>Your available equipment</legend><p className="pm-muted">Your usual setup is selected. Tap to remove anything you can’t access, or add what’s available.</p><div className="pm-chips">{EQUIPMENT.map(item => <button type="button" className="pm-toggle" key={item} aria-pressed={values(draft.equipment).includes(item)} onClick={() => setDraft({ ...draft, equipment: toggle(draft.equipment, item, EQUIPMENT) })}><span aria-hidden="true">{values(draft.equipment).includes(item) ? '✓' : '+'}</span> {item}</button>)}</div><p className="pm-muted" role="status">{draft.equipment ? `${values(draft.equipment).length} selected · Applies to your usual plan` : 'No equipment selected · Bodyweight options'}</p></fieldset>
        <BodyFocus plan={draft} onChange={setDraft} />
        <button className="pm-primary" disabled={!changed || !draft.days} onClick={() => setScreen('preview')}>Preview changes <span>→</span></button>
        <button className="pm-secondary" onClick={() => setScreen('manage')}>Keep my current plan</button>
      </>}

      {screen === 'preview' && <>
        <p className="pm-intro">{changedProgram ? 'A fresh four weeks, built around you.' : 'A better fit for the program you’re already in.'}</p>
        <section className="pm-hero pm-hero-small" style={{ backgroundImage: `linear-gradient(0deg, #080805 4%, #08080588 75%), url(${proposed.image})` }}><span className="pm-badge">{changedProgram ? 'YOUR NEW PROGRAM' : 'YOUR UPDATED PROGRAM'}</span><div><h2>{proposed.name}</h2><p>{draft.time} min · {values(draft.days).length} days/week</p><p>{equipmentLabel(draft.equipment)}</p></div></section>
        <section className="pm-card"><h2>What’s changing</h2><p>{changedProgram ? `${current.goal} → ${proposed.goal}. You’ll begin at week 1.` : `Your progress stays at week ${active.week}.`}</p>{draft.time !== active.time && <p>Session length: {active.time} → {draft.time} minutes.</p>}{draft.days !== active.days && <p>Training days: {draft.days}.</p>}{draft.equipment !== active.equipment && <p>Available equipment: {equipmentLabel(draft.equipment)}.</p>}{draft.program === 'build' && ['20–30', '30–40'].includes(draft.time) && <p>Shorter version: prioritize the main lifts and reduce accessory work to fit your time.</p>}<div className="pm-preserved">✓ Completed workouts and exercise history stay saved.</div></section>
        <section className="pm-card"><h2>{draft.level} program</h2><p>{draft.level !== active.level ? `${active.level} → ${draft.level}. Your updated four-week block starts at week 1; completed workouts stay saved.` : `Your experience level stays ${draft.level.toLowerCase()}.`}</p></section>
        <h2>Your weekly rhythm</h2><p className="pm-muted">{values(draft.days).length} days per week · Strength and easier movement balanced across your selected days.</p><div className="pm-schedule">{schedule(draft).map(({ day, title }) => <div key={day}><span className="pm-day">{day}</span><div><strong>{title}</strong><small>{draft.time} minutes · {draft.level}</small></div></div>)}</div>
        <section className="pm-card"><h2>Your body focus</h2><FocusSummary plan={draft} /><p>These preferences guide where extra training work goes, while keeping the program balanced.</p></section>
        <fieldset><legend>When should this start?</legend><label className={`pm-choice ${timing === 'next' ? 'selected' : ''}`}><input type="radio" name="timing" checked={timing === 'next'} onChange={() => setTiming('next')}/><span><strong>Next week <em>Recommended</em></strong><small>{dateLabel(next)} · Finish this week as planned</small></span></label><label className={`pm-choice ${timing === 'now' ? 'selected' : ''}`}><input type="radio" name="timing" checked={timing === 'now'} onChange={() => setTiming('now')}/><span><strong>Start now</strong><small>Applies to your next unstarted workout</small></span></label></fieldset>
        {pending && <p className="pm-muted">This replaces your previously scheduled change.</p>}
        <button className="pm-primary" onClick={confirm}>{timing === 'next' ? 'Schedule my change' : changedProgram ? 'Start this program' : 'Apply changes'} <span>→</span></button><button className="pm-secondary" onClick={() => setScreen('preferences')}>Back to preferences</button>
      </>}

      {screen === 'success' && <div className="pm-success"><div className="pm-check">✓</div><h2>{timing === 'next' ? 'Your next chapter is scheduled.' : 'Ready when you are.'}</h2><p>{result}</p><section className="pm-card"><strong>{proposed.name}</strong><p>{draft.days} · {draft.time} min</p><p>{changedProgram ? 'A fresh four-week program.' : `Continuing week ${active.week}.`} Your history stays with you.</p></section><button className="pm-primary" onClick={goHome}>Back to Home <span>→</span></button></div>}

      {screen === 'settings' && <><p className="pm-intro">Make Momentum work for you.</p><button className="pm-settings-row" onClick={() => setScreen('manage')}><span><strong>Manage my plan</strong><small>{current.name} · Week {active.week}</small></span><span>→</span></button><div className="pm-account-actions"><button className="pm-signout" onClick={signOut} disabled={signingOut}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9 4H4v16h5M10 12h10m-4-4 4 4-4 4" /></svg>{signingOut ? 'Signing out…' : 'Sign out'}</button>{signOutMessage && <p role="status">{signOutMessage}</p>}</div></>}
      {['preferences', 'preview'].includes(screen) && <p className="pm-preview-note">Preview only. Changes reset when you leave and do not update your account.</p>}
    </div>
  </main>;
}
