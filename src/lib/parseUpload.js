// Door 2 — client-side parsing of an uploaded completed questionnaire.
// Reads .xlsx (SheetJS) or .csv (PapaParse) entirely in the browser.
// Structural mismatch fails the read outright — no partial or best-effort mapping.

import * as XLSX from 'xlsx'
import Papa from 'papaparse'
import {
  ALL_QUESTIONS,
  EXPECTED_HEADERS,
  HEADER_ROW,
  RESPONSE_COL_INDEX,
  QUESTION_COL_INDEX,
} from '../data/questionnaire.js'

function norm(v) {
  return (v === undefined || v === null ? '' : String(v)).replace(/\s+/g, ' ').trim()
}

// Turn a 2D grid (array of row-arrays) into { answers } or throw a structural error.
function mapGrid(grid) {
  if (!Array.isArray(grid) || grid.length < HEADER_ROW) {
    throw new StructuralError(
      'The file does not match the questionnaire template. Please upload the unmodified template.'
    )
  }

  // Validate the header row (row 3, 1-based -> index 2).
  const header = (grid[HEADER_ROW - 1] || []).map(norm)
  const headersOk = EXPECTED_HEADERS.every((h, i) => norm(header[i]) === norm(h))
  if (!headersOk) {
    throw new StructuralError(
      'The column headers do not match the template. Expected: ' +
        EXPECTED_HEADERS.join(', ') +
        '. Please upload the unmodified The Corporate template.'
    )
  }

  const answers = {}
  for (const q of ALL_QUESTIONS) {
    const rowArr = grid[q.row - 1]
    if (!rowArr) {
      throw new StructuralError(
        `The template is missing an expected question row (row ${q.row}). Please upload the unmodified template.`
      )
    }
    // Confirm the question text in column D still matches — guards against a
    // shifted / reordered layout that would otherwise map cells to the wrong field.
    const questionCell = norm(rowArr[QUESTION_COL_INDEX])
    const expected = norm(q.label)
    // Prefix match, not strict equality: some template cells append extra
    // instruction text after the question (e.g. the EcoVadis row). A prefix
    // match still catches a shifted or reordered layout while tolerating that.
    if (!questionCell.startsWith(expected)) {
      throw new StructuralError(
        `The questionnaire structure does not match the template near row ${q.row}. ` +
          'Please complete and upload the unmodified template without adding, removing, or reordering rows.'
      )
    }
    answers[q.id] = norm(rowArr[RESPONSE_COL_INDEX])
  }
  return { answers }
}

export class StructuralError extends Error {
  constructor(message) {
    super(message)
    this.name = 'StructuralError'
  }
}

async function readXlsx(file) {
  const buf = await file.arrayBuffer()
  let wb
  try {
    wb = XLSX.read(buf, { type: 'array' })
  } catch {
    throw new StructuralError('The file could not be read as a spreadsheet. Please upload the .xlsx template or its .csv export.')
  }
  const sheet = wb.Sheets[wb.SheetNames[0]]
  if (!sheet) {
    throw new StructuralError('The workbook has no readable sheet. Please upload the unmodified template.')
  }
  const grid = XLSX.utils.sheet_to_json(sheet, { header: 1, blankrows: true, defval: '' })
  return mapGrid(grid)
}

async function readCsv(file) {
  const text = await file.text()
  const result = Papa.parse(text, { skipEmptyLines: false })
  if (result.errors && result.errors.length) {
    throw new StructuralError('The CSV file could not be parsed. Please upload the unmodified template or its .csv export.')
  }
  return mapGrid(result.data)
}

// Public entry point. Returns { answers }. Throws StructuralError on mismatch.
export async function parseUpload(file) {
  const name = (file.name || '').toLowerCase()
  if (name.endsWith('.csv')) return readCsv(file)
  if (name.endsWith('.xlsx') || name.endsWith('.xlsm') || name.endsWith('.xls')) return readXlsx(file)
  throw new StructuralError('Unsupported file type. Upload the .xlsx template or its .csv export.')
}
