// Client-side PDF generation for the confirmation summary.
// Styled per the-corporate-brand: Playfair-style heading weight, DM Sans body,
// Ink / Stone / Linen tokens, square rules, no shadows, no cover page.
// Everything runs in the browser — nothing leaves it.

import { jsPDF } from 'jspdf'
import { SECTIONS } from '../data/questionnaire.js'

const INK = [0, 0, 0]
const STONE = [182, 176, 159]
const LINEN = [234, 228, 213]

export function generateSubmissionPdf(answers, doorLabel, dateStr) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageW = doc.internal.pageSize.getWidth()
  const pageH = doc.internal.pageSize.getHeight()
  const margin = 48
  const contentW = pageW - margin * 2
  let y = margin

  const ensureSpace = (needed) => {
    if (y + needed > pageH - margin - 24) {
      doc.addPage()
      y = margin
    }
  }

  // Header: logo mark + title (no cover page).
  doc.setFillColor(...INK)
  doc.rect(margin, y, 26, 26, 'F')
  doc.setFillColor(200, 241, 53) // Acid Lime on Ink only
  doc.rect(margin + 7, y + 7, 12, 12, 'F')

  doc.setTextColor(...INK)
  doc.setFont('times', 'bold') // stand-in for Playfair Display (serif) in core fonts
  doc.setFontSize(18)
  doc.text('THE CORPORATE', margin + 38, y + 12)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(90, 90, 90)
  doc.text('Global Supplier Sustainability Assessment 2026', margin + 38, y + 25)
  y += 44

  doc.setDrawColor(...INK)
  doc.setLineWidth(1)
  doc.line(margin, y, pageW - margin, y)
  y += 22

  doc.setTextColor(...INK)
  doc.setFont('times', 'bold')
  doc.setFontSize(20)
  doc.text('Supplier Questionnaire Submission', margin, y)
  y += 26

  // Section-by-section listing, S1..S7 in order.
  SECTIONS.forEach((section) => {
    ensureSpace(60)
    doc.setFillColor(...LINEN)
    doc.rect(margin, y, contentW, 22, 'F')
    doc.setTextColor(...INK)
    doc.setFont('times', 'bold')
    doc.setFontSize(12)
    doc.text(`${section.id} · ${section.title}`, margin + 8, y + 15)
    y += 30

    section.questions.forEach((q) => {
      const answerRaw = (answers[q.id] || '').toString().trim()
      const answer = answerRaw === '' ? '— not provided —' : answerRaw

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(60, 60, 60)
      const qLines = doc.splitTextToSize(q.label, contentW)
      ensureSpace(qLines.length * 11 + 6)
      doc.text(qLines, margin, y)
      y += qLines.length * 11 + 2

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.setTextColor(...INK)
      const aLines = doc.splitTextToSize(answer, contentW)
      ensureSpace(aLines.length * 12 + 10)
      doc.text(aLines, margin, y)
      y += aLines.length * 12 + 12
    })
    y += 6
  })

  // Footer on every page: submission date + which door was used.
  const pageCount = doc.internal.getNumberOfPages()
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p)
    doc.setDrawColor(...STONE)
    doc.setLineWidth(0.5)
    doc.line(margin, pageH - margin + 8, pageW - margin, pageH - margin + 8)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(110, 110, 110)
    doc.text(`Submitted ${dateStr} · ${doorLabel}`, margin, pageH - margin + 20)
    doc.text(`Page ${p} of ${pageCount}`, pageW - margin, pageH - margin + 20, { align: 'right' })
  }

  doc.save('The-Corporate-Supplier-Submission.pdf')
}
