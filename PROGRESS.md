# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching anything. Update it at every save point. Replace content, do not append. History lives in git.

**Session:** 2 — first full build session (React + Vite + Tailwind)
**Last updated:** 6 July 2026
**Live URL:** not yet redeployed for v2.0 — builder connects/redeploys via the Netlify dashboard (Netlify MCP not active). Record the URL here after deploy.

## Current state
v2.0 is built and passing local verification. The frontend has been migrated from the v1.0 static HTML/CSS/JS to React + Vite + Tailwind. All spec views are implemented:
- **Landing** — corrected to the spec: two side-by-side route cards. EcoVadis card opens ecovadis.com in a new tab; Questionnaire card button reads "Complete Questionnaire" and opens Door Choice. Hero, "Why we are asking", timeline, key resources, footer. On-brand.
- **Door Choice** — two cards (fill in the tool / download & upload), with a way back to the landing page.
- **Door 1 (Guided Form)** — 7-section wizard, free back-and-forth via a section stepper, inline required-field validation that blocks advancing and final submit.
- **Door 2 (Download & Upload)** — downloads the unchanged template from `/assets`, accepts `.xlsx`/`.csv`, parses client-side, fails structural mismatches outright.
- **Upload Review** — read-only parsed answers grouped S1–S7, flags missing required answers, blocks Submit until corrected.
- **Confirmation** — shared by both doors, shows door used + summary, generates the branded PDF client-side.

Everything is client-side only; no network request carries submission data (AC13). State is React-only and clears on refresh/close (AC14).

## Last session
Ran First Session Setup (created `docs/`, moved product-spec.md into it, put the questionnaire asset in `public/assets/`). Derived the S1–S7 field structure by reading the Excel workbook grid (30 questions across 7 sections + declaration). Built the whole React app, wrote the Door 2 xlsx/csv parser and the jsPDF export. Verified end-to-end in a headless browser: landing→doors→form validation, EcoVadis bypass submit→confirmation→PDF, and Door 2 upload with missing-field flagging and corrupt-file rejection.

## Remaining work
- [ ] Builder: confirm the derived S1–S7 field mapping (see Build decisions) — spec Section 15 asks for confirmation; built against the derived default meanwhile.
- [ ] Builder: reinstall the `the-corporate-brand` skill at `.claude/skills/the-corporate-brand/SKILL.md` — it was NOT present in the repo this session (see Known issues). Built to the hard brand rules in CLAUDE.md/spec instead.
- [ ] Deploy to Netlify and record the live URL here.
- [ ] Post-deploy: re-verify Acceptance Criterion 15 (responsive on desktop + mobile) on the live URL.

## Build decisions
- Single source of truth for both doors: `src/data/questionnaire.js`, carrying each question's Excel answer-cell row (column E) for Door 2 parsing.
- Door 2 structural validation: checks row-3 headers exactly and that each question row's column-D text still starts with the expected label (prefix match — the EcoVadis cell appends instruction text). Any mismatch fails the read; no partial mapping.
- Required-field logic mirrors the workbook's own instructions: legal name, contact and the EcoVadis question are always required; the EcoVadis link is required only if EcoVadis = Yes; the PFAS roadmap and water contingency questions are conditional on their Yes/No triggers; and an EcoVadis = Yes answer makes all of S2–S7 optional (the "EcoVadis bypass").
- Libraries: `xlsx` (SheetJS) for .xlsx, `papaparse` for .csv, `jspdf` for the PDF. All bundled, no keys, nothing leaves the browser.
- Fonts loaded from Google Fonts in index.html (Playfair Display + DM Sans). Not submission data — AC13 unaffected.

## Known issues
- The `the-corporate-brand` skill is not in the repo (`.claude/skills/` was empty). Built against the hard brand rules captured in CLAUDE.md and product-spec Section 10. Reinstall the skill before further UI work.
- Vite reports the main JS chunk >500 kB (xlsx + jspdf). Acceptable for this tool; could be code-split with dynamic import in a later pass if load time matters.

## Notes for next session
None.
