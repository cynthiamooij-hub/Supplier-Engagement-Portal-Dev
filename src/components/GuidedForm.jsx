// Guided Form (Door 1) — 7-section wizard, session-only state.
// Free back-and-forth between visited sections. Required-field validation
// blocks advancing to the next section and blocks final submission until every
// required field across all sections is valid. Errors shown inline per field.

import { useState } from 'react'
import { SECTIONS, isRequired, missingRequired } from '../data/questionnaire.js'
import Field from './Field.jsx'

export default function GuidedForm({ answers, setAnswer, onSubmit, onBack }) {
  const [current, setCurrent] = useState(0)
  const [visited, setVisited] = useState(() => new Set([0]))
  // Sections the user has attempted to leave / submit — controls error display.
  const [validated, setValidated] = useState(() => new Set())

  const section = SECTIONS[current]
  const total = SECTIONS.length

  // Errors for the fields of a given section, honouring conditional requiredness.
  const sectionErrors = (secIndex) => {
    const errs = {}
    SECTIONS[secIndex].questions.forEach((q) => {
      if (isRequired(q, answers) && (answers[q.id] || '').toString().trim() === '') {
        errs[q.id] = 'This field is required.'
      }
    })
    return errs
  }

  const currentErrors = validated.has(current) ? sectionErrors(current) : {}

  const goTo = (index) => {
    if (index === current) return
    // Free navigation between visited sections is always allowed.
    // Advancing forward past the current section requires it to be valid.
    if (index > current) {
      const errs = sectionErrors(current)
      if (Object.keys(errs).length > 0) {
        setValidated((v) => new Set(v).add(current))
        return
      }
    }
    setVisited((v) => new Set(v).add(index))
    setCurrent(index)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const next = () => goTo(Math.min(current + 1, total - 1))
  const prev = () => goTo(Math.max(current - 1, 0))

  const handleSubmit = () => {
    // Mark every section validated so any missing field shows inline.
    const missing = missingRequired(answers)
    if (missing.length > 0) {
      setValidated(new Set(SECTIONS.map((_, i) => i)))
      // Jump to the first section that has a missing required field.
      const firstBadSection = SECTIONS.findIndex((s) =>
        s.questions.some((q) => missing.some((m) => m.id === q.id))
      )
      if (firstBadSection >= 0) {
        setVisited((v) => new Set(v).add(firstBadSection))
        setCurrent(firstBadSection)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      return
    }
    onSubmit()
  }

  const isLast = current === total - 1

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <button type="button" onClick={onBack} className="btn-ghost -ml-4 mb-6">
        ← Back to door choice
      </button>

      {/* Progress */}
      <div className="flex items-baseline justify-between">
        <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink">
          Section {current + 1} of {total}
        </p>
        <p className="text-sm font-light text-ink/60">{section.esrs}</p>
      </div>

      {/* Section stepper */}
      <nav className="mt-4 grid grid-cols-7 gap-px bg-ink border border-ink" aria-label="Sections">
        {SECTIONS.map((s, i) => {
          const done = visited.has(i)
          const active = i === current
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              className={`py-2 text-xs font-medium transition-colors ${
                active
                  ? 'bg-ink text-lime'
                  : done
                  ? 'bg-white text-ink hover:bg-linen'
                  : 'bg-chalk text-ink/50 hover:bg-linen'
              }`}
              title={`${s.id} — ${s.title}`}
            >
              {s.id}
            </button>
          )
        })}
      </nav>

      <h1 className="mt-8 font-display font-bold text-3xl sm:text-4xl">
        {section.id} · {section.title}
      </h1>

      <div className="mt-4 card bg-white px-6">
        {section.questions.map((q) => (
          <Field
            key={q.id}
            question={q}
            value={answers[q.id]}
            onChange={(v) => setAnswer(q.id, v)}
            error={currentErrors[q.id]}
            showRequired={isRequired(q, answers)}
          />
        ))}
      </div>

      {validated.has(current) && Object.keys(currentErrors).length > 0 && (
        <p className="mt-4 text-sm font-medium text-red-700" role="alert">
          Complete the required fields in this section before continuing.
        </p>
      )}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          ← Back
        </button>

        {isLast ? (
          <button type="button" onClick={handleSubmit} className="btn-primary">
            Submit assessment
            <span className="accent ml-2" aria-hidden="true">→</span>
          </button>
        ) : (
          <button type="button" onClick={next} className="btn-primary">
            Next
            <span className="accent ml-2" aria-hidden="true">→</span>
          </button>
        )}
      </div>
    </div>
  )
}
