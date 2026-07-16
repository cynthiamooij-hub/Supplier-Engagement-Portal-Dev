# The Corporate Supplier Sustainability Portal 2026

## Identity
A public landing page that onboards Tier 1 suppliers into The Corporate's ESRS-aligned sustainability assessment programme, routing each supplier to an EcoVadis scorecard submission or an in-tool questionnaire — and now persisting every questionnaire submission to a database so The Corporate's team can retrieve it.
Tier: 2 — public submission form, data persists to Supabase, no login required (D3+A1)
Spec version governed: v3.0 — the version of docs/product-spec.md these rules were derived from.
Position: Standalone — this tool creates the schema. A future internal review dashboard (Tier 3) will share this same Supabase project and read this schema; it is out of scope here.

## Session Protocol
At the start of every session:
1. Pull the latest from main before reading anything else.
2. Check docs/product-spec.md: if its version is newer than the "Spec version governed" line in this file, STOP. Tell the builder: "The spec has changed since this CLAUDE.md was written — re-run the Project Governor on the revised spec before building, or these rules may contradict it." Do not build against a stale CLAUDE.md.
3. Read PROGRESS.md in the project root — it is the current state of this build. If it is missing, recreate it with the structure at the end of this section, then continue.
4. Increment the session number and update the date in PROGRESS.md.
5. If "Notes for next session" has content: repeat the notes back to the builder, treat them as this session's priorities, then clear the section.
6. If this is session 1, run First Session Setup below before any build work.

Save point — after completing any module, feature, fix, or schema change:
1. Update PROGRESS.md: current state, remaining work, build decisions, known issues.
2. If the database was touched (any table, policy, bucket, or auth change), update docs/supabase-setup.md in the same save point.
3. Commit and push to main.
4. Tell the builder in one line: "Save point committed: [what changed]."
Do not start the next piece of work before the save point is pushed. Never end a session without one — an ending session is a save point.

First Session Setup (session 1 only):
1. Confirm docs/ exists with product-spec.md in it (carried over from the v2.0 build). No supabase-setup.md exists yet — this tool creates it once the schema is built.
2. Confirm the-corporate-brand skill is installed at .claude/skills/the-corporate-brand/SKILL.md. It was reported MISSING during the v2.0 session — if still absent, install it there before any UI work.
3. Announce what moved or was installed, then commit and push before building anything.

PROGRESS.md structure (for the recreate rule): status header (Session / Last updated / Live URL), Current state, Last session (3–5 lines, replace each session), Remaining work (shrinking checklist), Build decisions (one line each), Known issues, Notes for next session.

## Commands
```
npm install
npm run dev
npm run build
```

## Tech Stack
React · Vite · Tailwind CSS · Netlify · Supabase
Deployment: GitHub → Netlify, auto-deploys from main. Netlify MCP is not active — the builder connects the repo and enters environment variables in the Netlify dashboard; remind them before the first deploy.

## Arms
Export — browser only, no server function — (1) the unchanged blank questionnaire template The_Corporate_Supplier_Questionnaire_2026.xlsx, downloaded from within Door 2; (2) a branded PDF summary of the supplier's submitted answers, generated client-side after either door's submission, per the-corporate-brand. The PDF is generated from the in-session answer set, not re-fetched from the database.

## Environment Variables
VITE_SUPABASE_URL — Supabase: Project Settings → API → Project URL — Netlify env var
VITE_SUPABASE_ANON_KEY — Supabase: Project Settings → API → anon / public key — Netlify env var

Both are browser-exposed (VITE_ prefix) and intentionally public — protected by RLS. No service role key is used by this tool; it must never appear in frontend code or any committed file. At session start, confirm these exist before first use; prompt the builder for any that are missing. No value ever appears in code or in any file committed to GitHub.

## Supabase
Project: "the-corporate-sustainability" — already exists as an empty project (created via the Supabase dashboard, no schema yet). Do NOT create a new project. Connect via Supabase MCP to project ref `opivmalcijemwvsjkarr`.
Project URL: https://opivmalcijemwvsjkarr.supabase.co
Region: UK (London, AWS eu-west-2) — fixed, cannot change. Governs the GDPR note below.
Plan: Free — pauses after ~1 week without traffic. Flagged in PROGRESS.md: risks dropped submissions during quiet periods; decide on Pro before client go-live.

No supabase-setup.md exists yet. Build this schema via MCP — authoritative until docs/supabase-setup.md is written:
suppliers: legal_name, registered_country, contact_name, contact_email, route, has_ecovadis, ecovadis_link, status, created_at, updated_at
submissions: supplier_id — FK to suppliers, door, submitted_at, has_ecovadis, pfas_flag, sbti_validated, answers (jsonb), consent_given, consent_timestamp, created_at

RLS — build these policies, never skip:
suppliers: anon — insert only. No read, update, or delete access.
submissions: anon — insert only. No read, update, or delete access.
The anon key can submit but can never read any row back, so no one with the public link can enumerate other suppliers' data. The Corporate's team reads data through the Supabase dashboard (or the future internal dashboard tool with its own credentials).

Repeat submissions: a supplier submitting twice must not error and must not require anon read access. Insert a fresh submissions row each time; upsert the suppliers tracker row keyed on contact_email + legal_name via a SECURITY DEFINER function (or an append-only tracker). Decide the exact mechanism at build time and record it in docs/supabase-setup.md.

After setup, write docs/supabase-setup.md and update it at every save point that touches the database. It must contain: project name, project ref/ID, project URL, plan, region, every table with field names and types, RLS policies per table, the repeat-submission mechanism chosen, notes for future sessions (including that a future Tier 3 internal dashboard will read this schema), and a last-updated line with date and session number. From the moment it exists, that file is the schema source of truth.

## Hard Rules
- API keys never in any frontend file or GitHub commit. Storage follows function placement: Netlify env vars for the frontend. Only the Supabase URL and anon key are used client-side, and they are intentionally public — protected by RLS.
- Netlify Identity: never. Supabase Auth is the only authentication system in this stack (and no auth is used in this version — A1).
- RLS: never disabled on any table. If a query fails, fix the policy or the query — never disable RLS to work around it. Both tables are insert-only for anon; never loosen this to make a read work.
- GDPR: consent checkbox and the confirmed data statement required on the form before any data is submitted, on BOTH doors. Personal data collected: legal name, registered country, contact name and title, contact email. Deletion requests go to info@thecorporate.com. Project region is UK (London) under UK GDPR — confirm EU adequacy is acceptable for any EU-based suppliers with The Corporate's data governance owner.
- No data leaves the browser except the supplier/submission insert to Supabase on Submit. The PDF and template download are client-side only.

## Brand
Brand is governed by the the-corporate-brand skill at .claude/skills/the-corporate-brand/SKILL.md (confirm installed in First Session Setup — it was missing during v2.0). Invoke it for any UI or visual work, including the consent UI and the PDF.
Hard rules that hold even if the skill is not loaded:
- Backgrounds: Chalk (#F2F2F2), Linen (#EAE4D5), White (#FFFFFF) — never a Tailwind gray default
- Accent: Acid Lime (#C8F135), used sparingly and always against Ink (#000000), never on a light background
- Fonts: Playfair Display (headings), DM Sans 300 (body), DM Sans 500 (labels and emphasis)
- Square corners, no shadows, no gradients. No blue links — underline plus Ink colour only.
- Copy: short declarative sentences, active voice, no exclamation points, no emoji — including the consent statement and error messages.

## Business Rules
- Answers stored as one jsonb column on submissions, keyed by ESRS reference — schema is stable across questionnaire wording changes.
- Flags derived client-side before insert: has_ecovadis (S1 bypass), pfas_flag (S3 PFAS = Yes, mirrors the workbook ⚠ AUTO-FLAG), sbti_validated (S2 SBTi); route, door, status also derived.
- EcoVadis bypass: S1 = Yes makes S2–S7 optional; ecovadis_link required only when has_ecovadis = Yes. PFAS roadmap and water-contingency questions required only when their Yes/No trigger is Yes. Legal name, contact, and the EcoVadis question are always required. (Full validation rules carried from v2.0 — see spec Section 9.)
- Submit (both doors): blocked until every required field is valid AND consent is ticked. On valid Submit, write supplier + submission rows, then advance to Confirmation.
- Write failure: clear non-technical retry message, answers preserved on screen. No partial/duplicate silent write; a retry must not create orphaned rows.
- Repeat submission allowed: a new submissions row each time; tracker reflects latest status.
- Door 2 upload, PDF export, and the src/data/questionnaire.js single-source-of-truth behave as built in v2.0 — see spec Sections 8–9. Do not regress them.

Out of scope — do not build:
- Internal review dashboard for procurement/EHS (a separate Tier 3 tool on this same project)
- Supplier login or verification (requires A2/A3)
- Submission-received or notification emails (no email arm this version)
- Submission tracker dashboard / percentage responded (lives in the future internal dashboard)
- Storage of the original uploaded .xlsx/.csv files (only parsed values are stored)
- Normalised one-row-per-answer table (JSONB covers this version)
- Automated EcoVadis scorecard validation

## Reference Docs
Read before building the related part:
- docs/product-spec.md — full module specs, UI sections, logic, arm detail, Acceptance Criteria (18 criteria)
- docs/supabase-setup.md — schema source of truth (created in session 1 once tables are built; read first thereafter)
- .claude/skills/the-corporate-brand/SKILL.md — full brand system
PROGRESS.md in the root is read at every session start per the Session Protocol.
