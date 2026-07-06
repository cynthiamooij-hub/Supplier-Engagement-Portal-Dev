// Questionnaire schema — the single source of truth for Door 1 (guided form)
// and Door 2 (upload parsing). Derived at build time from
// The_Corporate_Supplier_Questionnaire_2026.xlsx (sheet "Supplier Assessment 2026").
//
// Excel layout (confirmed by reading the workbook grid):
//   Column A = SECTION id (S1..S7)
//   Column B = ESRS REF
//   Column C = TYPE (Required / Dropdown / Quantitative / Open-Ended / Conditional / Bypass)
//   Column D = QUESTION / METRIC
//   Column E = SUPPLIER RESPONSE   <-- suppliers fill this column
//   Column F = NOTES / EVIDENCE
//   Column G = STATUS
//
// Each question below carries `row`, the 1-based Excel row of its answer cell
// in column E. Door 2 reads column E of that exact row; a structural mismatch
// (missing row, shifted headers, wrong sheet) fails the read outright.
//
// `required` semantics:
//   true            -> always required
//   'ecovadis'      -> required only if the EcoVadis bypass answer (q_s1_ecovadis) is 'Yes'
//   'pfas'          -> required only if q_s3_pfas is 'Yes'
//   'waterStress'   -> required only if q_s4_stress is 'Yes'
//   false           -> optional
// When the EcoVadis bypass (q_s1_ecovadis) is 'Yes', all S2–S7 questions become
// optional, mirroring the workbook instruction: "Suppliers with a valid EcoVadis
// Scorecard (S1, Q1 = YES) must submit scorecard link and proceed directly to
// STATUS. All others complete Sections S2–S7."

export const YES_NO = ['Yes', 'No']

export const SECTIONS = [
  {
    id: 'S1',
    title: 'General Information & EcoVadis Bypass',
    esrs: 'All ESRS',
    questions: [
      {
        id: 'q_s1_legal',
        row: 6,
        type: 'text',
        esrs: '—',
        required: true,
        label: 'Legal name and registered country of the responding entity.',
      },
      {
        id: 'q_s1_contact',
        row: 7,
        type: 'text',
        esrs: '—',
        required: true,
        label: 'Primary contact name, title, and email address for this assessment.',
      },
      {
        id: 'q_s1_ecovadis',
        row: 8,
        type: 'select',
        options: YES_NO,
        esrs: 'Bypass',
        required: true,
        label:
          'Do you hold a valid EcoVadis Sustainability Scorecard (issued within the last 12 months)?',
        help: 'If YES, provide the scorecard link below. Sections S2–S7 then become optional.',
      },
      {
        id: 'q_s1_scorecard',
        row: 9,
        type: 'text',
        esrs: '—',
        required: 'ecovadis',
        label: 'EcoVadis Scorecard Link (if applicable). Paste URL or attach document reference.',
      },
    ],
  },
  {
    id: 'S2',
    title: 'Climate & Decarbonisation',
    esrs: 'ESRS E1',
    questions: [
      {
        id: 'q_s2_scope1',
        row: 11,
        type: 'text',
        esrs: 'E1-4',
        required: true,
        label:
          'Total Scope 1 emissions for last fiscal year (metric tonnes CO₂e). Include verification method.',
      },
      {
        id: 'q_s2_scope2',
        row: 12,
        type: 'text',
        esrs: 'E1-4',
        required: true,
        label:
          'Total Scope 2 emissions for last fiscal year — market-based (metric tonnes CO₂e).',
      },
      {
        id: 'q_s2_scope3',
        row: 13,
        type: 'text',
        esrs: 'E1-4',
        required: true,
        label:
          'Total Scope 3 emissions for last fiscal year (metric tonnes CO₂e). Specify categories included.',
      },
      {
        id: 'q_s2_sbti',
        row: 14,
        type: 'select',
        options: YES_NO,
        esrs: 'E1-3',
        required: true,
        label:
          'Does your organisation have a Science-Based Target (SBTi) validated decarbonisation target?',
      },
      {
        id: 'q_s2_projects',
        row: 15,
        type: 'textarea',
        esrs: 'E1-2',
        required: true,
        label:
          'Describe your top three decarbonisation projects currently in progress or planned for the next 24 months. Include estimated tCO₂e reduction and the specific technology being utilised (e.g., electrification of heat, on-site renewables).',
      },
      {
        id: 'q_s2_barriers',
        row: 16,
        type: 'textarea',
        esrs: 'E1-2',
        required: true,
        label:
          'What are the primary technical or financial barriers preventing you from reaching a 50% reduction in Scope 1 and 2 emissions by 2030?',
      },
    ],
  },
  {
    id: 'S3',
    title: 'Pollution & PFAS',
    esrs: 'ESRS E2',
    questions: [
      {
        id: 'q_s3_svhc',
        row: 18,
        type: 'text',
        esrs: 'E2-3',
        required: true,
        label:
          'Total weight of substances of concern (REACH, SVHC list) used in production last fiscal year (kg).',
      },
      {
        id: 'q_s3_pfas',
        row: 19,
        type: 'select',
        options: YES_NO,
        esrs: 'E2-3',
        required: true,
        label:
          'Do any of your products or production processes contain or utilise PFAS compounds ("Forever Chemicals")?',
        help: 'A "Yes" answer triggers a PFAS Risk review.',
      },
      {
        id: 'q_s3_roadmap',
        row: 20,
        type: 'textarea',
        esrs: 'E2-3',
        required: 'pfas',
        label:
          'If your products contain PFAS, detail your substitution roadmap. Have you identified viable non-PFAS alternatives? Provide your target date for a complete phase-out.',
      },
      {
        id: 'q_s3_wastewater',
        row: 21,
        type: 'textarea',
        esrs: 'E2-2',
        required: true,
        label:
          'Describe your industrial wastewater treatment process. What specific measures are in place to ensure zero leakage of hazardous chemicals into local water systems?',
      },
    ],
  },
  {
    id: 'S4',
    title: 'Water & Marine Resources',
    esrs: 'ESRS E3',
    questions: [
      {
        id: 'q_s4_withdrawal',
        row: 23,
        type: 'text',
        esrs: 'E3-1',
        required: true,
        label:
          'Total water withdrawal last fiscal year (m³). Specify source (municipal, groundwater, surface).',
      },
      {
        id: 'q_s4_stress',
        row: 24,
        type: 'select',
        options: YES_NO,
        esrs: 'E3-1',
        required: true,
        label:
          'Is your primary production facility located in a high-water-stress region (WRI Aqueduct score ≥3)?',
      },
      {
        id: 'q_s4_savings',
        row: 25,
        type: 'textarea',
        esrs: 'E3-2',
        required: true,
        label:
          'Provide details on any water-saving or closed-loop recycling projects implemented at your facility. How has your total water intensity (litres per unit produced) changed over the last three years?',
      },
      {
        id: 'q_s4_contingency',
        row: 26,
        type: 'textarea',
        esrs: 'E3-2',
        required: 'waterStress',
        label:
          'If your facility is in a high-water-stress region, what is your operational contingency plan for severe drought conditions to ensure supply continuity to The Corporate?',
      },
    ],
  },
  {
    id: 'S5',
    title: 'Circular Economy & Waste',
    esrs: 'ESRS E5',
    questions: [
      {
        id: 'q_s5_waste',
        row: 28,
        type: 'text',
        esrs: 'E5-2',
        required: true,
        label:
          'Total waste generated last fiscal year (tonnes). Breakdown: landfill / recycled / energy recovery / hazardous.',
      },
      {
        id: 'q_s5_pcr',
        row: 29,
        type: 'text',
        esrs: 'E5-4',
        required: true,
        label:
          'Percentage of post-consumer recycled (PCR) content in the components supplied to The Corporate (%).',
      },
      {
        id: 'q_s5_circularity',
        row: 30,
        type: 'textarea',
        esrs: 'E5-3',
        required: true,
        label:
          'How are you incorporating circularity into the specific components you supply to The Corporate? Examples: design for disassembly, modularity, or increasing PCR content.',
      },
      {
        id: 'q_s5_zerowaste',
        row: 31,
        type: 'textarea',
        esrs: 'E5-2',
        required: true,
        label:
          'Detail your strategy for achieving Zero Waste to Landfill. What are your primary waste streams, and what innovative recycling or upcycling initiatives have you launched recently?',
      },
    ],
  },
  {
    id: 'S6',
    title: 'Biodiversity & Ecosystems',
    esrs: 'ESRS E4',
    questions: [
      {
        id: 'q_s6_protected',
        row: 33,
        type: 'select',
        options: YES_NO,
        esrs: 'E4-2',
        required: true,
        label:
          'Are any of your production sites located within or adjacent to (within 1 km) a protected area or biodiversity hotspot?',
      },
      {
        id: 'q_s6_initiatives',
        row: 34,
        type: 'textarea',
        esrs: 'E4-3',
        required: true,
        label:
          'Describe any initiatives taken to minimise the impact of your operations on local biodiversity. Include land-use management, native planting schemes, or light/noise pollution reduction.',
      },
      {
        id: 'q_s6_assessment',
        row: 35,
        type: 'textarea',
        esrs: 'E4-5',
        required: true,
        label:
          'Have you undertaken a biodiversity impact assessment (TNFD or equivalent) for your primary production sites? If yes, share key findings. If no, provide your target assessment date.',
      },
    ],
  },
  {
    id: 'S7',
    title: 'Social, Labour & Governance',
    esrs: 'ESRS S2 · G1',
    questions: [
      {
        id: 'q_s7_hrpolicy',
        row: 37,
        type: 'select',
        options: YES_NO,
        esrs: 'S2-1',
        required: true,
        label:
          'Does your organisation have a formal Human Rights and Labour Rights Policy, aligned with the UN Guiding Principles on Business and Human Rights?',
      },
      {
        id: 'q_s7_duediligence',
        row: 38,
        type: 'select',
        options: YES_NO,
        esrs: 'S2-2',
        required: true,
        label:
          'Have you conducted a human rights due diligence assessment of your Tier 1 and Tier 2 supply chains in the last 24 months?',
      },
      {
        id: 'q_s7_grievance',
        row: 39,
        type: 'textarea',
        esrs: 'S2-4',
        required: true,
        label:
          'Describe the grievance mechanism available to workers in your supply chain. How many grievances were filed and resolved in the last 12 months?',
      },
      {
        id: 'q_s7_conflict',
        row: 40,
        type: 'select',
        options: YES_NO,
        esrs: 'G1-1',
        required: true,
        label:
          'Does your organisation have a verified conflict minerals policy (3TG — tin, tantalum, tungsten, gold) in place, including OECD Due Diligence guidance compliance?',
      },
      {
        id: 'q_s7_codeofconduct',
        row: 41,
        type: 'textarea',
        esrs: 'G1-2',
        required: true,
        label:
          'Describe your supplier code of conduct and how compliance is monitored across your own supply chain. Include details of any third-party audits conducted in the last 24 months.',
      },
    ],
  },
]

// The exact header labels expected in row 3, used to validate an uploaded file's
// structure before any mapping is attempted.
export const EXPECTED_HEADERS = [
  'SECTION',
  'ESRS REF',
  'TYPE',
  'QUESTION / METRIC',
  'SUPPLIER RESPONSE',
  'NOTES / EVIDENCE',
  'STATUS',
]

export const HEADER_ROW = 3
export const RESPONSE_COL_INDEX = 4 // column E (0-based) — SUPPLIER RESPONSE
export const QUESTION_COL_INDEX = 3 // column D (0-based) — QUESTION / METRIC
export const SHEET_NAME = 'Supplier Assessment 2026'

export const ALL_QUESTIONS = SECTIONS.flatMap((s) =>
  s.questions.map((q) => ({ ...q, sectionId: s.id, sectionTitle: s.title }))
)

// Is a question required given the current answers (handles conditionals + bypass)?
export function isRequired(question, answers) {
  const ecovadisBypass = (answers.q_s1_ecovadis || '').trim() === 'Yes'
  const inS2toS7 = question.sectionId
    ? question.sectionId !== 'S1'
    : !question.id.startsWith('q_s1')
  if (ecovadisBypass && inS2toS7) return false

  switch (question.required) {
    case true:
      return true
    case 'ecovadis':
      return ecovadisBypass
    case 'pfas':
      return (answers.q_s3_pfas || '').trim() === 'Yes'
    case 'waterStress':
      return (answers.q_s4_stress || '').trim() === 'Yes'
    default:
      return false
  }
}

// Return the list of question objects that are required-but-empty given answers.
export function missingRequired(answers) {
  return ALL_QUESTIONS.filter((q) => {
    if (!isRequired(q, answers)) return false
    const v = (answers[q.id] || '').toString().trim()
    return v === ''
  })
}
