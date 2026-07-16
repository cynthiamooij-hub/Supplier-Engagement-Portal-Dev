# PROGRESS — The Corporate Supplier Sustainability Portal 2026

> Claude Code: read this file at the start of every session, before touching anything. Update it at every save point. Replace content, do not append. History lives in git.

**Session:** 2 — first full build session (React + Vite + Tailwind)
**Last updated:** 6 July 2026
**Live URL:** not yet redeployed. v3.0 requires a redeploy with the two new Supabase environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY) set in the Netlify dashboard (Netlify MCP not active). Record the URL here after deploy.

## Current state
v2.0 is built and passing local verification. The frontend has been migrated from the v1.0 static HTML/CSS/JS to React + Vite + Tailwind. All spec views are implemented:
- **Landing** — corrected to the spec: two side-by-side route cards. EcoVadis card opens ecovadis.com in a new tab; Questionnaire card button reads "Complete Questionnaire" and opens Door Choice. Hero, "Why we are asking", timeline, key resources, footer. On-brand.
- **Door Choice** — two cards (fill in the tool / download & upload), with a way back to the landing page.
- **Door 1 (Guided Form)** — 7-section wizard, free back-and-forth via a section stepper, inline required-field validation that blocks advancing and final submit.
- **Door 2 (Download & Upload)** — downloads the unchanged template from `/assets`, accepts `.xlsx`/`.csv`, parses client-side, fails structural mismatches outright.
- **Upload Review** — read-only parsed answers grouped S1–S7, flags missing required answers, blocks Submit until corrected.
- **Confirmation** — shared by both doors, shows door used + summary, generates the branded PDF client-side.

Everything is client-side only; no network request carries submission data (v2.0 AC13). State is React-only and clears on refresh/close (v2.0 AC14). NOTE: v3.0 deliberately changes this — submissions now persist to Supabase. See Remaining work.

## Last session
Ran First Session Setup (created `docs/`, moved product-spec.md into it, put the questionnaire asset in `public/assets/`). Derived the S1–S7 field structure by reading the Excel workbook grid (30 questions across 7 sections + declaration). Built the whole React app, wrote the Door 2 xlsx/csv parser and the jsPDF export. Verified end-to-end in a headless browser: landing→doors→form validation, EcoVadis bypass submit→confirmation→PDF, and Door 2 upload with missing-field flagging and corrupt-file rejection.

## Remaining work
- [ ] Builder: confirm the derived S1–S7 field mapping (see Build decisions) — spec Section 15 asks for confirmation; built against the derived default meanwhile.
- [ ] Builder: reinstall the `the-corporate-brand` skill at `.claude/skills/the-corporate-brand/SKILL.md` — it was NOT present in the repo this session (see Known issues). Built to the hard brand rules in CLAUDE.md/spec instead.
- [ ] First Session Setup (v3.0 revision): confirm docs/ + product-spec.md present; reinstall the-corporate-brand skill if still missing; commit (see CLAUDE.md Session Protocol).
- [ ] Builder (v3.0 revision): before client go-live, decide whether to upgrade the Supabase project to Pro — the Free plan pauses after ~1 week idle and can drop live submissions.
- [ ] Connect to the existing empty Supabase project "the-corporate-sustainability" (ref opivmalcijemwvsjkarr) via MCP — do NOT create a new project (v3.0 revision).
- [ ] Build the suppliers and submissions tables and their insert-only-anon RLS policies via MCP; implement the repeat-submission upsert mechanism, then write docs/supabase-setup.md (v3.0 revision).
- [ ] Wire Door 1 (Guided Form) Submit to write supplier + submission rows to Supabase with derived flags and JSONB answers (v3.0 revision).
- [ ] Wire Door 2 (Upload Review) Submit to write the same rows with door = file_upload (v3.0 revision).
- [ ] Add the GDPR consent checkbox and confirmed data statement before Submit on BOTH doors; store consent_given + consent_timestamp (v3.0 revision).
- [ ] Update the Confirmation Screen copy from "received for this session" to confirming the submission is stored (v3.0 revision).
- [ ] Add graceful write-failure handling: retry message, answers preserved, no orphaned/duplicate rows (v3.0 revision).
- [ ] Local test pass including a simulated failed insert (v3.0 revision).
- [ ] Acceptance criteria pass — verify all 18 criteria in spec Section "Acceptance Criteria" before deploy (v3.0 revision).
- [ ] Redeploy to Netlify — builder adds VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in the Netlify dashboard; record the live URL (v3.0 revision).
- [ ] Post-deploy: verify anon cannot read either table (AC7) and responsiveness (AC18) on the live URL (v3.0 revision).

## Build decisions
- Single source of truth for both doors: `src/data/questionnaire.js`, carrying each question's Excel answer-cell row (column E) for Door 2 parsing.
- Door 2 structural validation: checks row-3 headers exactly and that each question row's column-D text still starts with the expected label (prefix match — the EcoVadis cell appends instruction text). Any mismatch fails the read; no partial mapping.
- Required-field logic mirrors the workbook's own instructions: legal name, contact and the EcoVadis question are always required; the EcoVadis link is required only if EcoVadis = Yes; the PFAS roadmap and water contingency questions are conditional on their Yes/No triggers; and an EcoVadis = Yes answer makes all of S2–S7 optional (the "EcoVadis bypass").
- Libraries: `xlsx` (SheetJS) for .xlsx, `papaparse` for .csv, `jspdf` for the PDF. All bundled, no keys, nothing leaves the browser.
- Fonts loaded from Google Fonts in index.html (Playfair Display + DM Sans). Not submission data — v2.0 AC13 unaffected.

## Known issues
- The `the-corporate-brand` skill is not in the repo (`.claude/skills/` was empty). Built against the hard brand rules captured in CLAUDE.md and product-spec Section 10. Reinstall the skill before further UI work.
- Vite reports the main JS chunk >500 kB (xlsx + jspdf). Acceptable for this tool; could be code-split with dynamic import in a later pass if load time matters.
- Spec revised to v3.0 on 16 July 2026 — CLAUDE.md regenerated by Project Governor; tool promoted from Tier 1 (session-only) to Tier 2 (Supabase persistence).
- Supabase project is UK (London, eu-west-2) under UK GDPR, on the Free plan. Two things to confirm before go-live: (a) EU adequacy is acceptable for any EU-based suppliers — check with The Corporate's data governance owner; (b) whether Free-plan idle-pausing is acceptable or the project should move to Pro.

## Notes for next session
None.
