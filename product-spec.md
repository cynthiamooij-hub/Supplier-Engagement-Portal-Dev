# Product Spec — The Corporate Supplier Sustainability Portal 2026

**Version:** 3.0
**Date:** 16 July 2026
**Author:** Zyad Hatquai
**Status:** Confirmed

---

## Section 1 — Tool Summary

**Tool name:** The Corporate Supplier Sustainability Portal 2026

**What it does:** A single-page public landing page that onboards Tier 1 suppliers into The Corporate's ESRS-aligned sustainability assessment programme. It communicates the company's net-zero targets, explains the two submission paths, and routes each supplier to the correct action. Route one is the EcoVadis scorecard. Route two, the questionnaire, lets suppliers submit their answers directly through the tool, either by filling in a guided in-tool form or by downloading, completing offline, and uploading the finished file for review before submitting. **New in this version:** submissions are now written to a database, so The Corporate's team can retrieve what suppliers send, and the tool tracks each supplier's status — whether they have submitted, and by which route.

**Who uses it:** Tier 1 supplier contacts, sustainability managers, EHS leads, and procurement representatives at supplier organisations, who receive the URL directly from The Corporate's procurement or EHS team. The stored submissions are consumed by The Corporate's internal procurement and EHS working group — but the internal review interface itself is deferred (see Section 12).

**Why it exists:** To formally launch The Corporate's 2026 supplier sustainability assessment without requiring direct explanation from the internal team, and to capture supplier responses in a durable, retrievable form. The v2.0 experiment validated that suppliers can complete and submit the full questionnaire in-browser; this version adds the persistence layer that experiment deliberately deferred, so the responses are no longer discarded when the tab closes.

**Build status:** Iteration. Previous version (v2.0) was a Tier 1, session-only (D2) React build with two in-tool submission doors — a guided form (Door 1) and a download-complete-upload flow (Door 2) — plus a client-side branded PDF export. Nothing was stored, emailed, or transmitted; all state lived in React component state for the session only. This build promotes the tool to Tier 2: it adds a Supabase database and writes every submission to it, records supplier status, and keeps the entire v2.0 supplier-facing flow otherwise intact. No login is added — the supplier-facing tool remains public.

---

## Section 2 — Classification

This section defines the architecture of the tool. Every downstream decision follows from this.

### Data Model

**Decision:** D3

| Label | What it means | This tool? |
|-------|--------------|-----------|
| D1 — Hardcoded | All data is written into the code by the developer. Users cannot input anything that persists. The tool displays what the developer put in. | No |
| D2 — Session | Data enters the tool during use and disappears when the tab closes. No database. Covers both uploaded files and form inputs. | No |
| D3 — Persisted | Data is written to a database and survives after the session ends. Supabase is required. | Yes |

**Reason:** Supplier submissions must be retrievable by The Corporate's team after the supplier's session ends, and the tool must track which suppliers have and have not responded — both require the data to survive the session, which is what promotes this tool from D2 to D3.

**D3 is triggered if any of the following are true — check all that apply:**
- [x] Data must be retrievable after the session ends
- [x] Multiple sessions contribute to the same dataset
- [x] An audit trail or history is needed
- [x] Data submitted by one person must be visible to another
- [ ] Results must be accessible via a URL after the session ends
- [ ] Files uploaded by users must be stored and retrievable later

> The two unchecked triggers are deliberate scoping decisions for this version. Submissions are retrievable by The Corporate's team through the database, not through a per-submission public URL. Uploaded Excel/CSV files are parsed client-side and only the parsed answer values are stored — the original file itself is not uploaded to storage (see Section 5, File storage).

---

### Access Model

**Decision:** A1

| Label | What it means | This tool? |
|-------|--------------|-----------|
| A1 — Public | Anyone with the URL can use it. No login, no account required. | Yes |
| A2 — Authentication | Users must log in. All logged-in users see the same thing and have the same permissions. | No |
| A3 — Authorization | Users must log in and have different roles. Different roles see different data or have different permissions. | No |

**Reason:** The page is still distributed to Tier 1 suppliers as a direct link, and suppliers self-identify by typing their company details into Section 1 of the form; no login or account is required for the supplier-facing submission flow in this version.

> **Promotion rule:** Auth requires a database. If the access model is A2 or A3, the data model is D3, even when all displayed content is fixed. Here A1 is confirmed for the supplier-facing tool, so the promotion rule does not apply. The internal review side, which would require A2/A3, is explicitly deferred — see Section 12. When it is built, it will be a separate tool sharing this Supabase project (a stack), classified on its own.

---

### Tier

**Tier:** 2

| Tier | D+A combination | Stack | Deployment |
|------|----------------|-------|------------|
| 1 | D1+A1 or D2+A1 | Netlify only | Netlify |
| 2 | D3+A1 | Netlify + Supabase (no auth) | Netlify |
| 3 | D3+A2 or D3+A3 | Netlify + Supabase (auth + RLS) | Netlify |

D3 + A1 places this tool at Tier 2: a Supabase database is added, but there is no login system and no role-based authorization. The supplier-facing frontend stays a Netlify static deploy that now writes to Supabase. Row Level Security is still configured — public-insert, no-public-read — but there is no auth layer.

---

### Standalone or Stack

**This tool is:** Standalone for this build — it is the only tool writing to its Supabase project today.

> This tool has an implied future stack: a public submission side (this tool) plus an internal review dashboard for procurement/EHS (deferred, Section 12). When the dashboard is built it becomes Tool B in a stack sharing this Supabase project, classified separately (it will be Tier 3, D3+A2/A3). This spec is written so that the schema it creates is the schema the future dashboard reads. This tool builds the schema; it marks the Supabase project as **new**.

---

## Section 3 — Arms

Arms are capabilities added to the tool. They do not change the tier.

### AI API Arm

**Active:** No

Reading the uploaded file back (Door 2) is structural cell-to-field matching only. It does not use AI to interpret free text. Unchanged from v2.0.

---

### Export Arm

**Active:** Yes

| Detail | Answer |
|--------|--------|
| Format | Both (XLSX and PDF) |
| What is exported | (1) The unchanged blank questionnaire template, The_Corporate_Supplier_Questionnaire_2026.xlsx, downloaded from within Door 2. (2) A branded PDF summary of the supplier's submitted answers, generated client-side after either door's submission, so the supplier keeps a record. Both unchanged from v2.0. The PDF is still generated from the in-session answer set, not re-fetched from the database. |
| PDF design intent | The Corporate brand throughout: Playfair Display for headings, DM Sans for body text, Ink / Stone / Linen / Chalk / White colour tokens, square corners, no shadows. A straightforward listing of the supplier's answers, one section per heading, S1 through S7, in order. Header includes The Corporate logo and the title "Supplier Questionnaire Submission." Footer includes the submission date and which door was used (in-tool form or file upload). No cover page. Unchanged from v2.0. |

---

### Email Arm

**Active:** No

No email is sent at any point in this version. A submission-received confirmation email to the supplier and/or a notification to the internal team were discussed and deferred to a later iteration — see Section 12. When added, the trigger would be a successful database insert (Supabase Edge Function placement, Resend).

---

### Scheduled Automation Arm

**Active:** No

---

## Section 4 — Stack and Deployment

### All Tiers

| Detail | Answer |
|--------|--------|
| Frontend framework | React + Vite + Tailwind. Carried over from the v2.0 build, unchanged. |
| Deployment target | Netlify |
| Netlify MCP | Not active. Deployment is done manually through the Netlify dashboard after each build. The Supabase anon key and project URL are set as Netlify environment variables through the dashboard, not committed to the repo. |

**GitHub — pre-build requirement for all Tier 1, 2, and 3 tools:**
This iteration continues in the existing repository used for the v1.0 and v2.0 builds (cynthiamooij-hub/Supplier-Engagement-Portal-Dev). The updated product-spec.md, CLAUDE.md, and PROGRESS.md replace the v2.0 versions before the build session opens. Claude Code assumes the repo exists, commits regularly, and pushes to main. It does not create or configure the repo.

---

### CONDITIONAL: Supabase project — Tier 2

**Supabase project status:** Existing empty project — the builder has already created the project shell in the Supabase dashboard (account + "new project"), but it has no schema yet. Claude Code connects to it via MCP and builds the schema into it; it does NOT create a new project.

**Supabase plan:** Free — confirmed by the builder. Note: the Free plan pauses after ~1 week without traffic, which risks dropping supplier submissions during quiet stretches of the onboarding window. A move to Pro (a manual billing step in the dashboard) is recommended before client go-live; tracked as a pre-go-live decision, not a build blocker. See Section 15.

**Existing empty project details:**

| Detail | Answer |
|--------|--------|
| Project name (label) | the-corporate-sustainability |
| Project ref / ID | opivmalcijemwvsjkarr |
| Project URL | https://opivmalcijemwvsjkarr.supabase.co |
| Region | UK (London, AWS eu-west-2) — fixed at creation, governs the GDPR note in Section 7 |
| supabase-setup.md | Does not exist yet — Claude Code writes it once the schema is built, then it becomes the schema source of truth |

> Because the project already exists but is empty, this is effectively a new build that skips the create-project step: Claude Code connects to ref opivmalcijemwvsjkarr, builds the tables and RLS, and writes docs/supabase-setup.md at the end of the first build session.

**supabase-setup.md — created by Claude Code at the end of the first build session** and updated every time Claude Code touches the database. It lives permanently in docs/ and records the project name, project ID, all tables and fields, RLS policies, and the anon/service-role key locations. It is the schema source of truth for all future build sessions — including the deferred internal dashboard — and for the Supabase QA skill.

---

### CONDITIONAL: Stack membership

Not a stack for this build. Standalone tool that creates the schema a future internal dashboard will read. See Standalone or Stack note above and Section 12.

---

## Section 5 — Data Architecture

### Data Model is D3 — this section drives the schema Claude Code builds via MCP.

**What data is collected or stored in this tool:**

| Field name | Plain language label | Data type | Who provides it | Required? |
|-----------|---------------------|-----------|----------------|-----------|
| legal_name | Supplier legal name | Text | Supplier (S1 Q1) | Yes |
| registered_country | Registered country | Text | Supplier (S1 Q1) | Yes |
| contact_name | Primary contact name & title | Text | Supplier (S1 Q2) | Yes |
| contact_email | Primary contact email | Text | Supplier (S1 Q2) | Yes |
| route | Path taken | Text (`ecovadis` / `questionnaire`) | Derived from supplier's choice | Yes |
| has_ecovadis | Holds a valid EcoVadis scorecard | Boolean | Supplier (S1 bypass) | Yes |
| ecovadis_link | EcoVadis scorecard URL | Text | Supplier (S1 conditional) | Only if has_ecovadis = Yes |
| status | Submission status | Text (`not_started` / `in_progress` / `submitted`) | Derived | Yes |
| door | Which door was used | Text (`guided_form` / `file_upload`) | Derived | Yes (on submission) |
| submitted_at | Timestamp of submission | Timestamp | Automatic | Yes |
| pfas_flag | PFAS auto-flag (S3) | Boolean | Derived from S3 answer | Yes |
| sbti_validated | Has SBTi-validated target (S2) | Boolean | Derived from S2 answer | Yes |
| answers | Full questionnaire answer set | JSONB | Supplier (all sections) | Yes |
| consent_given | GDPR consent captured | Boolean | Supplier (consent checkbox) | Yes |
| consent_timestamp | When consent was given | Timestamp | Automatic | Yes |

**Tables needed:**

| Table name | What it stores | Key fields |
|-----------|---------------|-----------|
| suppliers | One row per supplier organisation. Tracks who they are and whether they have submitted, regardless of route. This is the "submitted or not / EcoVadis or questionnaire" tracker. | id (uuid PK), legal_name, registered_country, contact_name, contact_email, route, has_ecovadis, ecovadis_link, status, created_at, updated_at |
| submissions | One row per completed questionnaire submission. Separate from suppliers because a supplier may resubmit, and the audit trail needs each submission preserved. Holds the full answer set plus denormalised flags used to filter the future dashboard without parsing JSON. | id (uuid PK), supplier_id (FK → suppliers.id), door, submitted_at, has_ecovadis, pfas_flag, sbti_validated, answers (JSONB), consent_given, consent_timestamp |

> **Answer storage decision — JSONB, confirmed:** The full section-by-section answer set is stored as a single `answers` JSONB column on `submissions`, keyed by ESRS reference (e.g. `"E1-4_scope1"`). This keeps the schema stable when the questionnaire changes year to year, makes reconstructing the PDF and future dashboard trivial, and needs one insert per submission. The handful of fields the internal team will actually filter and sort on — `has_ecovadis`, `pfas_flag`, `sbti_validated` — are denormalised into their own boolean columns so the dashboard can query them directly without unpacking JSON. A fully normalised one-row-per-answer table was considered and deferred; it is only worth adding if cross-supplier metric analytics (e.g. average Scope 1 across all suppliers) becomes a requirement, and the JSONB retains all raw data needed to migrate later.

**File storage:** No
Door 2 uploads are parsed client-side; only the extracted answer values are written to the `answers` JSONB. The original .xlsx/.csv file is not uploaded to Supabase Storage. This keeps the tool out of file-retention scope and avoids storing supplier documents. If The Corporate later needs the original files retained, that reopens this decision.

**Derived or calculated data:** Yes
`status` is derived (a supplier who reaches the confirmation screen is `submitted`). `pfas_flag` is derived from the S3 PFAS dropdown ("Yes" sets the flag, mirroring the workbook's ⚠ AUTO-FLAG). `sbti_validated` is derived from the S2 SBTi dropdown. `route` and `door` are derived from the path the supplier takes. All derivations happen client-side before the insert.

---

## Section 6 — Access and Permissions

Access Model is A1 — no authentication, no roles, no user accounts in this version.

There is no login and no `auth.users`. RLS is still enabled on both tables with a deliberately narrow public policy, because the frontend uses the public anon key:

| Table | User type | Can read | Can insert | Can update | Can delete |
|-------|----------|----------|------------|------------|------------|
| suppliers | Unauthenticated (anon) | No | Yes | No | No |
| submissions | Unauthenticated (anon) | No | Yes | No | No |

> The anon key can insert a submission but cannot read any submission back — so no supplier (or anyone with the public link and the key) can enumerate other suppliers' data through the browser. The Corporate's team reads the data through the Supabase dashboard or, later, through the internal dashboard tool authenticating with appropriate credentials. This insert-only-anon posture is what makes a public submission form safe at Tier 2 without auth. Claude Code configures these policies via MCP during the build session; the Supabase QA skill can verify them afterward.
>
> **Upsert note:** because anon cannot read, the supplier/submission write is handled as an insert of a fresh `submissions` row each time plus an insert-or-update of the `suppliers` row keyed by a server-side match on `contact_email` + `legal_name`, done through a `SECURITY DEFINER` Postgres function (or an append-only tracker insert). Claude Code decides the exact mechanism at build time and records it in supabase-setup.md; the requirement is only that a supplier submitting twice does not error and does not let anon read existing rows.

---

## Section 7 — GDPR

### MANDATORY DECISION for every D3 tool.

**GDPR outcome:** Applies — personal data is now collected through the tool's form and written to a database.

> This is the section v2.0 explicitly closed as "not applicable," on the condition — stated in v2.0 Section 7 — that it must be reopened the moment persistence (D3) is added. Persistence is now added, so it is reopened here.

**Personal data collected:**
Supplier legal name, registered country, primary contact name and title, primary contact email address. (Company sustainability metrics in S2–S7 are organisational, not personal data, but they are stored in the same record.)

**Consent checkpoint on the form:** Yes — a checkbox and data statement must appear before the final submit on both doors. Submission is blocked until the box is ticked. The consent flag and its timestamp are stored on the submission (`consent_given`, `consent_timestamp`).

**Data statement text shown to users at the point of collection:**
> The information you submit, including your name and contact email, will be stored securely by The Corporate and used only to administer the 2026 Supplier Sustainability Assessment. It will not be shared outside The Corporate's procurement and EHS working group. You can request access to or deletion of your data at any time by contacting [The Corporate data contact — email to be confirmed by builder, Section 15].

**Deletion mechanism:**
A data subject requests deletion by emailing the data contact above. The request is processed manually by The Corporate's team through the Supabase dashboard (delete the supplier row and its submissions) until the internal dashboard with a built-in deletion control is added. The exact data contact address is an open item — see Section 15. This must be resolved before go-live, as it is a legal requirement.

> The consent checkbox, data statement, and deletion contact must be confirmed in this spec before Claude Code begins the build. The statement wording above is a working default; the builder confirms or adjusts it and supplies the contact address.

---

## Section 8 — Screen and UI Structure

The v2.0 view structure is unchanged except that the two Submit actions now write to the database, and a consent checkpoint is added before each Submit. Views below are described only where they change; unchanged views are noted as such.

### Landing Page — unchanged from v2.0
Nav bar, hero, "Why We Are Asking," two-route section (EcoVadis card, Questionnaire card), timeline, key resources, footer. EcoVadis card opens ecovadis.com in a new tab. Questionnaire card button "Complete Questionnaire" opens Door Choice.

### Door Choice — unchanged from v2.0
Two option cards: Door 1 "Fill in the tool," Door 2 "Download and complete offline." A way back to the landing page.

### Guided Form (Door 1) — changed
- **Purpose:** Let the supplier answer section by section, mirroring the Excel workbook.
- **What is visible:** Progress indicator ("Section 3 of 7"), current section title and fields, Back/Next controls, inline validation. **New:** on the final section, before the Submit control, a GDPR consent checkbox and the data statement from Section 7. Submit is disabled until the box is ticked.
- **User actions:** Fill fields; navigate freely between visited sections; tick consent; Submit.
- **What happens next:** A valid submit (all required fields valid AND consent ticked) writes the supplier and submission rows to Supabase, then moves to the Confirmation Screen. A write failure shows a clear, non-technical error and keeps the supplier's answers on screen so they can retry — nothing is lost to a failed insert.

### Download & Upload (Door 2) — unchanged from v2.0
Download the blank template; upload a completed .xlsx/.csv; structural mismatch fails outright with a clear error.

### Upload Review (Door 2) — changed
- **What is visible:** Read-only parsed answers grouped S1–S7, missing-required flags. **New:** the same GDPR consent checkbox and data statement before the Submit control.
- **User actions:** Tick consent; Submit; or re-upload a corrected file.
- **What happens next:** A valid submit (nothing missing AND consent ticked) writes to Supabase, then moves to Confirmation. Same write-failure handling as Door 1.

### Confirmation Screen (shared) — changed
- **Purpose:** Confirm the submission was received and stored, and let the supplier keep a record.
- **What is visible:** A summary of what was submitted (which door, sections completed), confirmation that the submission has been recorded, and a "Download PDF" button. **New:** wording changes from v2.0's "received for this session" to confirming the submission is stored, since it now is.
- **User actions:** Click "Download PDF" for the branded client-side summary.
- **What happens next:** Nothing further. The record persists in the database.

---

## Section 9 — Logic and Calculations

**Door 1 sequential form logic:** Unchanged from v2.0. 7 sections in component state during entry; free back-and-forth; required-field validation blocks advancing and final submit; errors inline. The EcoVadis bypass (S1 = Yes makes S2–S7 optional), the PFAS/water conditional-required questions, and the conditional EcoVadis link remain as built in v2.0.

**Door 2 upload parsing logic:** Unchanged from v2.0. Client-side xlsx/csv parse against the single source of truth (`src/data/questionnaire.js`); structural mismatch fails outright; missing required answers flagged on the review screen and block Submit.

**New — persistence logic:** On a valid Submit from either door, the client:
1. Derives `route`, `door`, `has_ecovadis`, `pfas_flag`, `sbti_validated`, and `status` from the answer set.
2. Assembles the `answers` JSONB keyed by ESRS reference.
3. Writes the supplier row (insert or tracker-update keyed on contact_email + legal_name) and the submission row via the Supabase anon client.
4. On success, advances to Confirmation. On failure, shows a retryable error and preserves the on-screen answers.

**PDF generation logic:** Unchanged from v2.0. Client-side, from the in-session answer set, styled per the-corporate-brand. Not re-fetched from the database.

**Edge cases:**
- Supplier closes the tab before Submit: nothing is written (the write only happens at Submit). Expected.
- Database write fails (network, Supabase down): the supplier sees a clear retry message; their answers stay on screen; no partial or duplicate silent write. Claude Code makes the write idempotent enough that a retry does not create orphaned rows.
- Supplier submits twice: a new `submissions` row is created each time (audit trail preserved); the `suppliers` tracker reflects the latest status. This is intended, not an error.
- Uploaded file parses but misses required answers: unchanged from v2.0 — flagged, Submit blocked.
- Consent box not ticked: Submit blocked with an inline message, same pattern as a missing required field.

---

## Section 10 — Brand and Visual Direction

**Brand reference:** the-corporate-brand skill file. Confirmed present at .claude/skills/the-corporate-brand/SKILL.md — note the v2.0 PROGRESS.md flagged it as missing during that build; it must be reinstalled before UI work (Section 15).

**Visual feel:** Corporate minimalism, unchanged. Restraint over decoration. No gradients, shadows, or rounded corners.

**Key brand rules — enforced on all views, the new consent UI, and the PDF:**
- Fonts: Playfair Display (headlines), DM Sans 300 (body), DM Sans 500 (labels/emphasis)
- Colours: Ink (#000000), Stone (#B6B09F), Linen (#EAE4D5), Chalk (#F2F2F2), White (#FFFFFF), Acid Lime (#C8F135)
- Acid Lime: sparingly, always against #000000, never on light backgrounds
- Buttons and cards: square corners, no shadows
- No blue links: underline plus Ink colour only
- Copy: short declarative sentences, active voice, no exclamation points, no emoji — including the consent statement and any new error messages

---

## Section 11 — API and Credentials

| Service | What it does in this tool | Key required | Where key is stored |
|---------|--------------------------|-------------|-------------------|
| Supabase | Database — stores supplier and submission rows | Anon key (public, browser-safe) + Service role key (server-side/dashboard only, never in frontend) | Netlify environment variables (anon key + project URL); service role key never leaves the Supabase dashboard / secure store |

**Client-side libraries (not credentials):** `xlsx` (SheetJS) for .xlsx parsing, `papaparse` for .csv, `jspdf` for the PDF, plus `@supabase/supabase-js` for the database client. All bundled at build time.

> **Security rule — no exceptions:** The Supabase anon key is browser-safe by design and is the only key the frontend uses; it is set as a Netlify environment variable, not committed to the repo. The service role key must never appear in any frontend file, any JavaScript bundle, or any GitHub commit. RLS (Section 6) is what makes the anon key safe to expose: it can insert but cannot read.

**Credentials readiness:**

| Credential | Status | Where to get it |
|-----------|--------|----------------|
| Supabase anon key | Created by Claude Code with the project | Supabase dashboard → Project Settings → API |
| Supabase service role key | Created by Claude Code with the project — dashboard use only | Supabase dashboard → Project Settings → API |
| Supabase project URL | Created with the project | Supabase dashboard → Project Settings → API |

Nothing needs creating by the builder before the session — Claude Code provisions the Supabase project via MCP. The builder's only pre-build task is confirming the project name and plan (Section 15) and setting the anon key + URL as Netlify environment variables after the project is created (Netlify MCP is not active, so this is manual).

---

## Section 12 — Out of Scope — Phase 2

| Deferred feature | Reason it is deferred |
|-----------------|----------------------|
| Internal review dashboard for procurement/EHS | This build creates the schema and captures submissions; the internal read/review interface is a separate Tier 3 tool (D3+A2/A3) sharing this Supabase project, built next once the schema exists and submissions are flowing |
| Supplier login or verification (only invited/correct suppliers can submit) | Requires an access-model change to A2/A3 on the supplier side; the public link is retained for this version |
| Submission-received confirmation email to the supplier, and/or notification email to the internal team | Email arm intentionally left inactive this iteration; add via Resend on a successful-insert trigger once persistence is proven |
| Submission tracker dashboard (percentage of Tier 1 suppliers who have responded) | The `suppliers.status` field now makes this computable, but the visualisation lives in the deferred internal dashboard |
| Storage of the original uploaded .xlsx/.csv files | Only parsed answer values are stored this version; retaining source files reopens the file-storage and retention decision |
| Normalised one-row-per-answer table for cross-supplier metric analytics | JSONB payload covers retrieval and PDF/dashboard reconstruction; normalise later only if fleet-wide metric analytics is required |
| Automated EcoVadis scorecard validation | Requires EcoVadis API access, pending availability |

---

## Section 13 — Acceptance Criteria

| # | What to verify | Expected result | Done? |
|---|---------------|-----------------|-------|
| 1 | Landing page renders unchanged | All v2.0 sections render; EcoVadis button opens ecovadis.com in a new tab | [ ] |
| 2 | Questionnaire button opens Door Choice | "Complete Questionnaire" opens Door Choice, no download | [ ] |
| 3 | Door Choice presents both doors clearly | Both cards visible, described, navigable; a way back exists | [ ] |
| 4 | Guided form matches the source Excel structure | All 7 sections render with fields matching the workbook | [ ] |
| 5 | Guided form navigation and validation | Free back-and-forth; required fields block advancing/submitting, inline | [ ] |
| 6 | Supabase project created and schema built | `suppliers` and `submissions` tables exist per Section 5; recorded in docs/supabase-setup.md | [ ] |
| 7 | RLS is insert-only for anon | Anon can insert into both tables; anon cannot read either table back — verified in QA | [ ] |
| 8 | Consent checkpoint blocks submit | Submit is disabled on both doors until the consent box is ticked; consent flag + timestamp stored | [ ] |
| 9 | Door 1 submit writes to the database | A valid guided-form submit creates a supplier row and a submission row with the correct JSONB answers and derived flags | [ ] |
| 10 | Door 2 submit writes to the database | A valid upload submit creates the same rows with `door = file_upload` | [ ] |
| 11 | Derived flags are correct | `pfas_flag`, `sbti_validated`, `has_ecovadis`, `route`, `door`, `status` match the submitted answers | [ ] |
| 12 | Repeat submission behaves as specified | A second submit from the same supplier adds a new submission row and does not error; tracker reflects latest status | [ ] |
| 13 | Write failure is handled gracefully | A simulated failed insert shows a clear retry message and preserves on-screen answers; no orphaned/duplicate silent rows | [ ] |
| 14 | Download Template (Door 2) unchanged | Downloads the unmodified The_Corporate_Supplier_Questionnaire_2026.xlsx | [ ] |
| 15 | Upload validates files | .xlsx/.csv accepted; structural mismatch errors with no partial data; missing required answers flagged and block submit | [ ] |
| 16 | PDF export matches brand and content | Branded, section-by-section S1–S7 listing of submitted answers | [ ] |
| 17 | No service-role key in the frontend | No service role key in any bundle or commit; only the anon key + URL are used client-side, sourced from Netlify env vars | [ ] |
| 18 | Tool deploys and is responsive | Live Netlify URL loads on desktop and mobile for every view | [ ] |

---

## Section 14 — Build Path

**This tool's tier:** Tier 2

### Pre-build steps — complete before opening Claude Code

- [ ] Tool Architect skill — this v3.0 spec written and confirmed
- [ ] Project Governor skill — CLAUDE.md and PROGRESS.md regenerated from this spec (the v2.0 CLAUDE.md governs v2.0 and will halt the session until re-run)
- [ ] Existing GitHub repo confirmed (Supplier-Engagement-Portal-Dev)
- [ ] product-spec.md (this file), CLAUDE.md, PROGRESS.md uploaded to the repo root, replacing v2.0 versions
- [ ] the-corporate-brand skill reinstalled at .claude/skills/ (was missing in the v2.0 session)
- [ ] The_Corporate_Supplier_Questionnaire_2026.xlsx confirmed present in public/assets/, unchanged
- [ ] Supabase project name and plan confirmed (Section 15)
- [ ] GDPR data contact address confirmed (Section 15)
- [ ] Netlify connection to the repo confirmed active (Netlify MCP not active — deploys and env vars stay manual)

### Tier 2 — build session

- [ ] Open Claude Code in the project folder
- [ ] First Session check: docs/, reference files, brand skill installed
- [ ] Claude Code reads product-spec.md, CLAUDE.md, PROGRESS.md
- [ ] Claude Code confirms the Supabase project name, then creates the project via MCP
- [ ] Claude Code builds the `suppliers` and `submissions` tables and the insert-only-anon RLS policies via MCP
- [ ] Claude Code writes docs/supabase-setup.md (project name, ID, tables, fields, RLS)
- [ ] Claude Code wires `@supabase/supabase-js` into both doors' Submit actions, adds the consent checkpoint, and updates the Confirmation copy
- [ ] Claude Code handles write success/failure per Section 9
- [ ] Test locally (including a simulated write failure) before deploying
- [ ] Builder sets the Supabase anon key + project URL as Netlify environment variables
- [ ] Push to main; Netlify deploys; record the live URL in PROGRESS.md
- [ ] Post-deploy: verify AC7 (anon cannot read) and AC18 (responsive) on the live URL

---

## Section 15 — Open Questions

| Question | Who answers it | Status |
|----------|---------------|--------|
| Supabase project | Builder | RESOLVED — existing empty project, ref opivmalcijemwvsjkarr, label "the-corporate-sustainability", region UK (London) |
| Supabase plan | Builder | RESOLVED — Free. Pre-go-live decision noted: move to Pro to avoid idle-pause dropping live submissions |
| GDPR data-subject contact email | Builder | RESOLVED — info@thecorporate.com |
| EU adequacy for a UK-region project | The Corporate data governance owner | OPEN — non-blocking; confirm UK GDPR adequacy is acceptable for any EU-based suppliers before go-live |
| Consent statement wording (Section 7) | Builder | Open — working default can build; adjust any time before go-live |
| Supplier-tracker match key (contact_email + legal_name) | Builder | Open — Claude Code builds the stated default unless overridden |
| Whether original uploaded files must be retained | Builder | Open — deferred by default; reopens file-storage scope if yes |

---

## Section 16 — Tool Version History

| Version | Date | What changed in the tool |
|---------|------|--------------------------|
| v1.0 | 12 June 2026 | Retroactive spec of the existing supplier onboarding landing page (supplier_onboarding.html). Static, D1+A1, Tier 1. |
| v2.0 | 5 July 2026 | Added two in-tool submission doors (guided form + download/complete/upload with read-only review), a branded client-side PDF export, and migrated the frontend to React + Vite + Tailwind. Data model D1→D2 (session only); access remained A1; Tier 1. No database, login, or email — all explicitly deferred. |
| v3.0 | 16 July 2026 | Promoted to Tier 2. Added a Supabase database: every submission is now written to `suppliers` and `submissions` tables, with the full answer set stored as JSONB plus denormalised flags (has_ecovadis, pfas_flag, sbti_validated) and a supplier status tracker. Data model D2→D3; access remains A1 with insert-only-anon RLS (anon can submit, cannot read). GDPR section reopened per the v2.0 condition — consent checkpoint, data statement, and deletion mechanism added. The supplier-facing flow, PDF export, and brand are otherwise unchanged from v2.0. Internal review dashboard, supplier login, and confirmation emails deferred to Phase 2 — the internal dashboard becomes a Tier 3 tool sharing this Supabase project. |

---

*This spec is written for Claude Code. It assumes zero prior context. Every decision, rule, and requirement must be explicit enough that the builder can hand this document to Claude Code without a single verbal explanation.*
