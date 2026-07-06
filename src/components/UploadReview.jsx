// Upload Review (Door 2) — read-only summary of parsed answers, grouped by
// section. Missing required answers are flagged and block Submit until a
// corrected file is uploaded (per product-spec Section 9 default). No inline edit.

import { SECTIONS, isRequired, missingRequired } from '../data/questionnaire.js'

export default function UploadReview({ answers, fileName, onSubmit, onReupload, onBack }) {
  const missing = missingRequired(answers)
  const missingIds = new Set(missing.map((m) => m.id))
  const blocked = missing.length > 0

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <button type="button" onClick={onBack} className="btn-ghost -ml-4 mb-6">
        ← Back to door choice
      </button>

      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink">Door Two</p>
      <h1 className="mt-3 font-display font-bold text-4xl">Review your answers</h1>
      <p className="mt-4 max-w-2xl font-light text-ink/80">
        This is exactly what we read from{' '}
        <span className="font-medium">{fileName || 'your file'}</span>. Answers are read-only here —
        to change anything, correct the source file and re-upload.
      </p>

      {blocked && (
        <div className="mt-6 border border-red-700 bg-[#fff5f5] p-5" role="alert">
          <p className="font-medium text-red-800">
            {missing.length} required {missing.length === 1 ? 'answer is' : 'answers are'} missing
          </p>
          <p className="mt-1 text-sm font-light text-red-800">
            Complete the highlighted fields in your file, then re-upload. Submit is disabled until
            every required answer is present.
          </p>
        </div>
      )}

      <div className="mt-8 space-y-6">
        {SECTIONS.map((section) => (
          <section key={section.id} className="card bg-white">
            <header className="bg-linen px-6 py-3 border-b border-ink">
              <h2 className="font-display font-bold text-lg">
                {section.id} · {section.title}
              </h2>
            </header>
            <dl className="px-6">
              {section.questions.map((q) => {
                const val = (answers[q.id] || '').toString().trim()
                const isMissing = missingIds.has(q.id)
                return (
                  <div key={q.id} className="py-4 border-b border-linen last:border-b-0">
                    <dt className="label text-[14px] leading-snug">
                      {q.label}
                      {isRequired(q, answers) && <span> *</span>}
                    </dt>
                    <dd
                      className={`mt-2 font-light ${
                        isMissing ? 'text-red-700 font-medium' : val ? 'text-ink' : 'text-ink/50'
                      }`}
                    >
                      {isMissing ? '⚠ Required — missing in uploaded file' : val || '— not provided —'}
                    </dd>
                  </div>
                )
              })}
            </dl>
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <button type="button" onClick={onReupload} className="btn-secondary">
          Re-upload a different file
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={blocked}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          title={blocked ? 'Resolve missing required answers first' : undefined}
        >
          Submit assessment
          <span className="accent ml-2" aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  )
}
