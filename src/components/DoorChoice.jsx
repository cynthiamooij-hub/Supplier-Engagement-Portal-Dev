// Door Choice — supplier picks how to complete the questionnaire.
// Door 1: fill in the tool. Door 2: download, complete offline, upload.

export default function DoorChoice({ onDoor1, onDoor2, onBack }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <button type="button" onClick={onBack} className="btn-ghost -ml-4 mb-8">
        ← Back to landing page
      </button>

      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink">
        The Corporate Questionnaire
      </p>
      <h1 className="mt-3 font-display font-bold text-4xl sm:text-5xl">
        How would you like to complete it?
      </h1>
      <p className="mt-4 max-w-2xl font-light text-ink/80">
        Both paths produce the same submission and a downloadable PDF record. Choose whichever
        suits how you work.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <article className="card p-8 flex flex-col bg-white">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
            Door One
          </span>
          <h2 className="mt-3 font-display font-bold text-2xl">Fill in the tool</h2>
          <p className="mt-4 font-light text-ink/80 flex-1">
            Answer the seven sections section by section, directly in your browser. Move freely
            between sections; required fields are checked as you go. Best for a single person
            completing the assessment in one sitting.
          </p>
          <button type="button" onClick={onDoor1} className="btn-primary mt-8 self-start">
            Start guided form
            <span className="accent ml-2" aria-hidden="true">→</span>
          </button>
        </article>

        <article className="card p-8 flex flex-col bg-white">
          <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
            Door Two
          </span>
          <h2 className="mt-3 font-display font-bold text-2xl">Download and complete offline</h2>
          <p className="mt-4 font-light text-ink/80 flex-1">
            Download the Excel template, complete it with colleagues at your own pace, then upload
            the finished file. We read it back for you to review before you submit. Best when
            several people contribute answers.
          </p>
          <button type="button" onClick={onDoor2} className="btn-secondary mt-8 self-start">
            Download &amp; upload
            <span className="ml-2" aria-hidden="true">→</span>
          </button>
        </article>
      </div>
    </div>
  )
}
