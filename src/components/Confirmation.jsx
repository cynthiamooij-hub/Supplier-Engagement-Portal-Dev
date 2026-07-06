// Confirmation Screen (shared by both doors). Shows which door was used and a
// summary of what was submitted; offers the branded PDF download. Nothing is
// stored — this record exists only for this session.

import { SECTIONS } from '../data/questionnaire.js'
import { generateSubmissionPdf } from '../lib/pdf.js'

export default function Confirmation({ answers, door, submittedAt, onHome }) {
  const doorLabel = door === 'door1' ? 'In-tool guided form' : 'File upload'
  const dateStr = submittedAt
  const answeredCount = SECTIONS.reduce(
    (n, s) => n + s.questions.filter((q) => (answers[q.id] || '').toString().trim() !== '').length,
    0
  )
  const totalCount = SECTIONS.reduce((n, s) => n + s.questions.length, 0)

  const downloadPdf = () => generateSubmissionPdf(answers, doorLabel, dateStr)

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="inline-flex items-center gap-3 bg-ink text-white px-4 py-2">
        <span className="w-2 h-2 bg-lime inline-block" />
        <span className="text-sm font-medium">Submission received for this session</span>
      </div>

      <h1 className="mt-6 font-display font-bold text-4xl sm:text-5xl">Thank you.</h1>
      <p className="mt-4 font-light text-ink/80">
        Your assessment has been completed in your browser. Because this tool stores nothing,
        download the PDF now to keep a record — once you close this tab, nothing is retained.
      </p>

      <div className="mt-10 card bg-white divide-y divide-linen">
        <Row label="Submission route" value={doorLabel} />
        <Row label="Sections completed" value={`${SECTIONS.length} of ${SECTIONS.length}`} />
        <Row label="Questions answered" value={`${answeredCount} of ${totalCount}`} />
        <Row label="Submitted" value={dateStr} />
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="button" onClick={downloadPdf} className="btn-primary">
          Download PDF <span className="accent ml-2" aria-hidden="true">↓</span>
        </button>
        <button type="button" onClick={onHome} className="btn-secondary">
          Return to landing page
        </button>
      </div>

      <p className="mt-6 text-sm font-light text-ink/60">
        The PDF is generated on your device. No answers are sent anywhere.
      </p>
    </div>
  )
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <span className="font-medium">{label}</span>
      <span className="font-light text-ink/80">{value}</span>
    </div>
  )
}
