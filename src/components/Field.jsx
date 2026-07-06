// Single questionnaire field, brand-styled, with inline validation message.

export default function Field({ question, value, onChange, error, showRequired }) {
  const { id, type, label, help, options } = question
  const inputId = `field-${id}`
  const invalid = Boolean(error)

  return (
    <div className="py-5 border-b border-linen last:border-b-0">
      <label htmlFor={inputId} className="block label text-[15px] leading-snug">
        {label}
        {showRequired && <span className="text-ink"> *</span>}
      </label>
      {help && <p className="mt-1 text-sm font-light text-ink/60">{help}</p>}

      <div className="mt-3">
        {type === 'textarea' ? (
          <textarea
            id={inputId}
            rows={4}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`field-input ${invalid ? 'invalid' : ''}`}
            aria-invalid={invalid}
          />
        ) : type === 'select' ? (
          <select
            id={inputId}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`field-input ${invalid ? 'invalid' : ''}`}
            aria-invalid={invalid}
          >
            <option value="">Select…</option>
            {options.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={inputId}
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            className={`field-input ${invalid ? 'invalid' : ''}`}
            aria-invalid={invalid}
          />
        )}
      </div>

      {invalid && (
        <p className="mt-2 text-sm font-medium text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
