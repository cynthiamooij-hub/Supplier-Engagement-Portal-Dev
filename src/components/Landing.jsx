// Landing Page — brand-aligned onboarding. Two side-by-side route cards:
// EcoVadis (opens ecovadis.com in a new tab) and Questionnaire ("Complete
// Questionnaire" -> Door Choice). Replaces the v1.0 yes/no decision tree and
// mailto submission, per product-spec Section 8 and CLAUDE.md Business Rules.

const TIMELINE = [
  { date: 'July 2026', label: 'Programme launch', body: 'Assessment opens to all Tier 1 suppliers.' },
  { date: 'September 2026', label: 'Submission window', body: 'Complete via EcoVadis or the questionnaire.' },
  { date: 'Q4 2026', label: 'Review & engagement', body: 'Procurement and EHS review responses.' },
  { date: '2027', label: 'Improvement plans', body: 'Targets agreed with priority suppliers.' },
]

const RESOURCES = [
  'The Corporate Supplier Code of Conduct 2026',
  'The Corporate Global Environmental Policy',
  'Procurement Sustainability Strategy 2026',
  'Supplier Engagement Programme — Charter',
]

export default function Landing({ onStartQuestionnaire }) {
  const openEcoVadis = () => {
    window.open('https://ecovadis.com', '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-chalk border-b border-ink">
        <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
          <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink">
            Global Supplier Sustainability Assessment
          </p>
          <h1 className="mt-4 font-display font-bold text-4xl sm:text-6xl leading-[1.05] max-w-3xl">
            Your sustainability data, on the record for 2026.
          </h1>
          <p className="mt-6 max-w-2xl text-lg font-light text-ink/80">
            The Corporate is aligning its supply chain to ESRS and CSRD. As a Tier 1 supplier,
            you complete this assessment once — through your EcoVadis scorecard or our
            questionnaire. Choose your route below.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 bg-ink text-white px-4 py-2">
            <span className="w-2 h-2 bg-lime inline-block" />
            <span className="text-sm font-medium">Confidential · EcoVadis-first programme</span>
          </div>
        </div>
      </section>

      {/* Why we are asking */}
      <section className="bg-white border-b border-ink">
        <div className="mx-auto max-w-6xl px-6 py-14 grid gap-10 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="font-display font-bold text-2xl">Why we are asking</h2>
          </div>
          <div className="md:col-span-2 grid gap-6 sm:grid-cols-2">
            <p className="font-light text-ink/80">
              The Corporate has committed to net-zero across its value chain. Meeting that
              commitment starts with understanding the environmental and social performance of
              the suppliers we work with.
            </p>
            <p className="font-light text-ink/80">
              This assessment is aligned to the European Sustainability Reporting Standards. Your
              responses inform our disclosures and shape how we engage with you through 2027.
            </p>
          </div>
        </div>
      </section>

      {/* Two routes */}
      <section className="bg-linen border-b border-ink">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="font-display font-bold text-3xl">Choose your submission route</h2>
          <p className="mt-3 max-w-2xl font-light text-ink/80">
            Both routes satisfy the assessment. If you already hold a current EcoVadis scorecard,
            the EcoVadis route is fastest.
          </p>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {/* EcoVadis card */}
            <article className="card p-8 flex flex-col bg-white">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
                Route One
              </span>
              <h3 className="mt-3 font-display font-bold text-2xl">EcoVadis Scorecard</h3>
              <p className="mt-4 font-light text-ink/80 flex-1">
                Already assessed by EcoVadis? Share your current scorecard directly. This is the
                preferred route and takes the least time.
              </p>
              <button type="button" onClick={openEcoVadis} className="btn-primary mt-8 self-start">
                Submit EcoVadis Scorecard
                <span className="accent ml-2" aria-hidden="true">→</span>
              </button>
              <p className="mt-3 text-xs font-light text-ink/60">Opens ecovadis.com in a new tab.</p>
            </article>

            {/* Questionnaire card */}
            <article className="card p-8 flex flex-col bg-white">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">
                Route Two
              </span>
              <h3 className="mt-3 font-display font-bold text-2xl">The Corporate Questionnaire</h3>
              <p className="mt-4 font-light text-ink/80 flex-1">
                No EcoVadis scorecard? Complete our ESRS-aligned questionnaire — guided in your
                browser, or downloaded, completed offline, and uploaded for review.
              </p>
              <button type="button" onClick={onStartQuestionnaire} className="btn-primary mt-8 self-start">
                Complete Questionnaire
                <span className="accent ml-2" aria-hidden="true">→</span>
              </button>
              <p className="mt-3 text-xs font-light text-ink/60">
                Nothing is stored — your answers stay in your browser.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-white border-b border-ink">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="font-display font-bold text-3xl">Programme timeline</h2>
          <div className="mt-8 grid gap-px bg-ink sm:grid-cols-4 border border-ink">
            {TIMELINE.map((t) => (
              <div key={t.date} className="bg-white p-6">
                <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-ink">
                  {t.date}
                </p>
                <p className="mt-2 font-medium">{t.label}</p>
                <p className="mt-2 text-sm font-light text-ink/70">{t.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key resources */}
      <section className="bg-chalk">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <h2 className="font-display font-bold text-3xl">Key resources</h2>
          <p className="mt-3 max-w-2xl font-light text-ink/80">
            Review these before completing your assessment. They set the expectations your
            responses are measured against.
          </p>
          <ul className="mt-8 grid gap-px bg-ink border border-ink sm:grid-cols-2">
            {RESOURCES.map((r) => (
              <li key={r} className="bg-white p-5 font-medium flex items-center gap-3">
                <span className="w-2 h-2 bg-ink inline-block shrink-0" />
                {r}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}
