import { useState } from 'react';

export const AREAS = ['Shoulders', 'Chest', 'Back', 'Arms', 'Abs', 'Glutes', 'Quads', 'Hamstrings', 'Calves'];
const regions = {
  Shoulders: 'M69 70 Q49 72 46 97 L61 103 76 84Z M111 70 Q131 72 134 97 L119 103 104 84Z',
  Arms: 'M46 101 L60 107 51 142 44 171 30 167 37 132Z M134 101 L120 107 129 142 136 171 150 167 143 132Z',
  Chest: 'M74 76 L88 81 88 111 64 104 65 88Z M106 76 L92 81 92 111 116 104 115 88Z',
  Abs: 'M66 110 L87 116 93 116 114 110 108 144 109 164 91 180 71 164 72 144Z',
  Back: 'M74 76 L90 81 106 76 116 94 112 117 103 145 108 160 90 167 72 160 77 145 68 117 64 94Z',
  Glutes: 'M72 165 Q62 180 64 202 Q77 213 88 201 L88 170Z M108 165 Q118 180 116 202 Q103 213 92 201 L92 170Z',
  Quads: 'M66 184 L86 190 85 235 79 265 63 263 59 229Z M114 184 L94 190 95 235 101 265 117 263 121 229Z',
  Hamstrings: 'M64 208 Q76 216 87 208 L84 239 79 265 63 263 59 233Z M116 208 Q104 216 93 208 L96 239 101 265 117 263 121 233Z',
  Calves: 'M63 274 L79 276 78 304 72 336 60 336 59 306Z M117 274 L101 276 102 304 108 336 120 336 121 306Z',
};

export function FocusSummary({ plan }) {
  return <div className="pm-focus-summary"><p>{plan.focus?.join(', ') || 'Balanced full-body training'}</p></div>;
}

export default function BodyFocus({ plan, onChange }) {
  const [view, setView] = useState('Front');
  const selected = plan.focus || [];
  const choose = area => {
    onChange({ ...plan, focus: selected.includes(area) ? selected.filter(item => item !== area) : AREAS.filter(item => item === area || selected.includes(item)) });
  };
  const visible = view === 'Front' ? ['Shoulders', 'Chest', 'Arms', 'Abs', 'Quads', 'Calves'] : ['Shoulders', 'Arms', 'Back', 'Glutes', 'Hamstrings', 'Calves'];
  return <fieldset className="pm-body-focus"><legend>Where do you want to focus?</legend>
    <p className="pm-muted">Select the areas you’d like to prioritize. Leave everything unselected for a balanced plan.</p>
    <div className="pm-body-panel">
      <div className="pm-chips" role="group" aria-label="Body view">{['Front', 'Back'].map(side => <button type="button" className="pm-toggle" aria-pressed={view === side} key={side} onClick={() => setView(side)}>{side}</button>)}</div>
      <svg className="pm-body-map" viewBox="0 0 180 370" role="group" aria-label={`${view} body areas. Select your focus areas.`}>
        <g fill="#202222" stroke="#656565" strokeWidth="1.2" aria-hidden="true">
          <ellipse cx="90" cy="35" rx="19" ry="25" />
          <path d="M79 58 L78 68 66 72 Q48 74 43 96 L33 130 25 172 29 190 37 192 43 177 51 147 61 116 66 140 62 167 Q53 192 56 225 L60 269 56 307 58 339 51 352 Q48 360 60 360 L76 357 79 344 80 311 85 278 90 222 95 278 100 311 101 344 104 357 120 360 Q132 360 129 352 L122 339 124 307 120 269 124 225 Q127 192 118 167 L114 140 119 116 129 147 137 177 143 192 151 190 155 172 147 130 137 96 Q132 74 114 72 L102 68 101 58" />
        </g>
        {visible.map(area => <path key={area} d={regions[area]} className={`pm-muscle ${selected.includes(area) ? 'focus' : ''}`} role="button" tabIndex={0} aria-label={area} aria-pressed={selected.includes(area)} onClick={() => choose(area)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); choose(area); } }}><title>{area}</title></path>)}
      </svg>
    </div>
    <p className="pm-muted">Tap the body or select an area below.</p>
    <div className="pm-chips">{AREAS.map(area => <button type="button" key={area} className="pm-toggle" aria-pressed={selected.includes(area)} onClick={() => choose(area)}>{selected.includes(area) ? '✓ ' : '+ '}{area}</button>)}</div>
    <div aria-live="polite"><FocusSummary plan={plan} /></div>
  </fieldset>;
}
