import './program-loading.css';

export default function ProgramLoading() {
  return <div className="program-loading" role="status" aria-label="Loading your program" aria-live="polite">
    <img src="/momentum-logo.svg" width="244" height="24" alt="" className="program-loading-logo" />
  </div>;
}
