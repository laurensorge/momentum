import { AVAILABLE_EQUIPMENT, SESSION_LENGTHS, TRAINING_DAYS, toggleEquipment } from './preferences';

export default function PreferenceChoices({ kind, answers, onChange }) {
  const options = kind === 'days' ? TRAINING_DAYS : kind === 'time' ? SESSION_LENGTHS : AVAILABLE_EQUIPMENT;
  const selected = value => kind === 'time' ? answers.time === value : answers[kind].includes(value);
  return <div><div className={kind === 'days' ? 'pm-days' : 'pm-chips'}>{options.map(value => <button type="button" className="pm-toggle" key={value} aria-pressed={selected(value)} onClick={() => onChange({ ...answers, [kind]: kind === 'time' ? value : kind === 'equipment' ? toggleEquipment(answers.equipment, value) : options.filter(item => item === value ? !selected(item) : selected(item)) })}>{value}{kind === 'time' ? ' min' : ''}</button>)}</div>{kind === 'equipment' && <p>Full gym access preselects common equipment. Deselect anything unavailable. Turning it off keeps your individual selections.</p>}{kind === 'days' && <p role="status">{answers.days.length ? `${answers.days.length} days per week` : 'Select at least one day.'}</p>}</div>;
}
