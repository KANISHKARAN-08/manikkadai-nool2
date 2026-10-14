# Manikkadai Nool (மணிக்கடை நூல்)

A production-ready, 100% local Siddha medical research web application for **Manikkadai Nool** — the classical wrist circumference diagnostic treatise from *Noi Nadal Noi Mudal Nadal Thirattu* (நோய் நாடல் நோய் முதல் நாடல் திரட்டு, பாகம் 1).

**Zero Supabase. Zero remote database. Zero environment variables required.**

---

## Features

| Feature | Status |
|---|---|
| 25 canonical manuscript records (pages 368–371) | ✅ |
| Traditional Virarkadai lookup (4, 4¼, 4½ … 10) | ✅ |
| Metric cm/mm assessment with live normalization | ✅ |
| Repeat reading discrepancy calculation (0.3 cm tolerance) | ✅ |
| 3 provisional metric research ranges (pending review) | ✅ |
| Assessment history in localStorage | ✅ |
| CSV export (UTF-8 BOM, Tamil-safe) | ✅ |
| Browser print / Save as PDF | ✅ |
| Canonical Reference Library with offline search | ✅ |
| Source gallery (authentic manuscript photographs) | ✅ |
| Research & bibliographic provenance page | ✅ |
| English / Tamil language toggle (persisted) | ✅ |
| Responsive mobile-first design | ✅ |
| No Supabase / no remote database | ✅ |
| 25 unit + integration + UI tests — all passing | ✅ |
| Production build verified | ✅ |

---

## Quick Start

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Run all tests (25 tests)
npm test

# Production build
npm run build

# Preview production build locally
npm run preview
```

No `.env` file or API keys are required.

---

## Project Structure

```
src/
├── data/
│   ├── traditionalReferences.ts   # 25 canonical Virarkadai records + integrity validator
│   └── metricResearchRanges.ts    # 3 provisional metric ranges (pending_review)
├── lib/
│   ├── lookupEngine.ts            # Mode A (Traditional) & Mode B (Metric) lookup
│   ├── normalization.ts           # Strict validation, cm↔mm, fraction parsing
│   ├── assessmentStore.ts         # localStorage CRUD with schema validation
│   ├── csvExport.ts               # RFC-4180 CSV with UTF-8 BOM
│   ├── printReport.ts             # Browser print trigger
│   └── translations.ts            # English / Tamil UI strings
├── pages/
│   ├── HomePage.tsx               # Hero, radial artwork, architecture cards
│   ├── AssessmentPage.tsx         # Full metric assessment form + live report
│   ├── ReferenceLibraryPage.tsx   # Searchable 25-record library with modals
│   ├── SourceGalleryPage.tsx      # Manuscript photograph gallery + lightbox
│   ├── ResearchPage.tsx           # Bibliographic provenance & range metadata
│   └── HistoryPage.tsx            # Persisted history, export, delete
├── components/
│   ├── Header.tsx                 # Responsive nav + language toggle
│   ├── Footer.tsx                 # Archival provenance footer
│   └── RadialMeasurementGraphic.tsx  # Interactive SVG Virarkadai artwork
├── types/
│   └── index.ts                   # All TypeScript interfaces
├── test/
│   ├── setup.ts
│   ├── traditionalReferences.test.ts
│   ├── metricNormalization.test.ts
│   ├── metricRanges.test.ts
│   ├── inputValidation.test.ts
│   ├── persistenceAndCsv.test.ts
│   └── uiWorkflow.test.tsx
├── App.tsx
├── main.tsx
└── index.css
public/
└── images/manuscript/
    ├── page-368.jpg    # Authentic photograph: disease manifestations (10–7)
    ├── page-369.jpg    # Authentic photograph: disease manifestations + verses (6¾–6¼)
    └── page-371.jpg    # Authentic photograph: critical prognosis table (6–4)
```

---

## Data Architecture

### Traditional Records (`traditionalReferences.ts`)
- **25 unique entries**, numeric values 4.00 to 10.00 in 0.25 increments
- Each record stores: stable ID, numeric value, display label (`4 ¼`), unit (`virarkadai`), aliases, original Tamil description, English translation, source title, part/volume, page number, category, transcription status
- Runtime integrity validator confirms all 25 unique values and IDs at startup
- **All Tamil descriptions transcribed directly from the supplied manuscript photographs** (pages 368–371)
- Entries flagged `needs_review` where text was difficult to fully confirm

### Metric Research Ranges (`metricResearchRanges.ts`)
- **3 provisional ranges**: 11.9–14.3 cm, 14.7–16.6 cm, 17.1–19.0 cm
- All have `reviewStatus: 'pending_review'` — never presented as verified clinical diagnoses
- No DOI fabricated; `doi: null` is explicit
- The lookup uses inclusive boundary matching with ±0.0001 float tolerance

### Lookup Engine (`lookupEngine.ts`)
- **Mode A** — Traditional Virarkadai: exact numeric match from aliases/fractions
- **Mode B** — Metric Assessment: strict validation → normalization → range query → AssessmentRecord generation
- Result types: `traditional_match`, `metric_research_range_match`, `no_compatible_metric_reference`, `traditional_no_match`, `invalid_input`

---

## Deploying to Vercel

1. Push to a GitHub repository
2. Connect to Vercel
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. **No environment variables required**

For SPA routing, create `public/_redirects`:
```
/*  /index.html  200
```

Or in `vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## Scientific Integrity Notice

This application distinguishes strictly between:

1. **Canonical manuscript text** — authenticated Tamil verse descriptions from the printed source (pages 368–371), transcribed faithfully and flagged where uncertain
2. **Provisional metric research ranges** — observational cohort data explicitly labelled `pending_review`, never presented as verified clinical standards
3. **No fabricated DOIs, PMIDs, or clinical classifications** appear anywhere in the codebase

---

## Source

> நோய் நாடல் நோய் முதல் நாடல் திரட்டு (பாகம் 1)
> Printed pages 368, 369, 371
> Unit: Virarkadai (விரற்கடை) — 4 to 10 in ¼ increments

---

## License

For academic and educational use. All traditional Tamil manuscript content belongs to the Siddha medical heritage.
