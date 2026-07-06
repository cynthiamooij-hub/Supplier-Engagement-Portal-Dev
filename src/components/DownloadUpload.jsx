// Download & Upload (Door 2) — download the unchanged template, upload a
// completed .xlsx or .csv. Structural mismatch fails outright with a clear error.

import { useRef, useState } from 'react'
import { parseUpload, StructuralError } from '../lib/parseUpload.js'

const TEMPLATE_URL = '/assets/The_Corporate_Supplier_Questionnaire_2026.xlsx'

export default function DownloadUpload({ onParsed, onBack }) {
  const inputRef = useRef(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [fileName, setFileName] = useState('')

  const handleFile = async (file) => {
    if (!file) return
    setError('')
    setBusy(true)
    setFileName(file.name)
    try {
      const { answers } = await parseUpload(file)
      onParsed(answers, file.name)
    } catch (e) {
      if (e instanceof StructuralError) {
        setError(e.message)
      } else {
        setError('The file could not be read. Please upload the unmodified template or its .csv export.')
      }
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <button type="button" onClick={onBack} className="btn-ghost -ml-4 mb-6">
        ← Back to door choice
      </button>

      <p className="text-[11px] font-medium uppercase tracking-[0.25em] text-ink">Door Two</p>
      <h1 className="mt-3 font-display font-bold text-4xl">Download, complete, upload</h1>
      <p className="mt-4 max-w-2xl font-light text-ink/80">
        Download the template, complete every required field offline, then upload the finished
        file. We read it back for you to review before you submit.
      </p>

      {/* Step 1 — download */}
      <section className="mt-10 card bg-white p-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">Step 1</span>
        <h2 className="mt-2 font-display font-bold text-2xl">Download the template</h2>
        <p className="mt-3 font-light text-ink/80">
          The unmodified The Corporate Supplier Questionnaire 2026 workbook. Do not add, remove, or
          reorder rows — enter your answers in the “Supplier Response” column only.
        </p>
        <a
          href={TEMPLATE_URL}
          download="The_Corporate_Supplier_Questionnaire_2026.xlsx"
          className="btn-primary mt-6 no-underline"
        >
          Download template <span className="accent ml-2" aria-hidden="true">↓</span>
        </a>
      </section>

      {/* Step 2 — upload */}
      <section className="mt-6 card bg-white p-8">
        <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-ink">Step 2</span>
        <h2 className="mt-2 font-display font-bold text-2xl">Upload your completed file</h2>
        <p className="mt-3 font-light text-ink/80">
          Accepts the completed <span className="font-medium">.xlsx</span> workbook or its{' '}
          <span className="font-medium">.csv</span> export.
        </p>

        <div
          className="mt-6 border border-ink border-dashed p-8 text-center bg-chalk"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            handleFile(e.dataTransfer.files?.[0])
          }}
        >
          <p className="font-light text-ink/70">Drag a file here, or</p>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="btn-secondary mt-4"
            disabled={busy}
          >
            {busy ? 'Reading…' : 'Choose file'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.xlsm,.csv"
            className="hidden"
            onChange={(e) => handleFile(e.target.files?.[0])}
          />
          {fileName && !error && !busy && (
            <p className="mt-4 text-sm font-light text-ink/60">Last file: {fileName}</p>
          )}
        </div>

        {error && (
          <div className="mt-6 border border-red-700 bg-[#fff5f5] p-5" role="alert">
            <p className="font-medium text-red-800">Upload could not be read</p>
            <p className="mt-1 text-sm font-light text-red-800">{error}</p>
          </div>
        )}
      </section>
    </div>
  )
}
