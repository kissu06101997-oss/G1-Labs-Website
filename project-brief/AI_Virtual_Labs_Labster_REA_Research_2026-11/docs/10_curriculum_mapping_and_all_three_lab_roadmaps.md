# Andhra Pradesh curriculum mapping and all-three-lab roadmap

**Research snapshot 22 November 2026 IST · PUBLISHED curriculum evidence · PROPOSED product plan**

## Coverage and evidence

The public CSE AP academic-year form returned ten 2026–27 science textbook records for the Telugu–English filter across Classes 6–10. Classes 6–9 listed semester 1 and 2 science books. Class 10 listed Physical Science and Biological Science as separate books. The same grade queries under the English-only filter returned zero rows. This describes the observed form responses. The legacy official title-wise index separately lists English Medium, Telugu Medium and several other-language variants. The two listings have different scopes. [CSE AP current academic textbook form](https://cse.ap.gov.in/loadacademictextbookpublicview), [CSE AP legacy title-wise index](https://cse.ap.gov.in/textBooksDownloadingPagetitleWise)

| Grade | Current textbook results inspected | Official fallback consulted | Chemistry | Physics | Biology |
|---|---|---|---:|---:|---:|
| 6 | Semester 2 acquired. Semester 1 listed, empty response. | Legacy general science semester 1. | 35 | 12 | 20 |
| 7 | Semester 2 acquired. Semester 1 listed, empty response. | Legacy general science semester 1. | 14 | 23 | 11 |
| 8 | Semester 2 acquired and screened with English OCR. Semester 1 listed, empty response. | Legacy separate Physical Science and Biology semester 1. | 4 | 39 | 16 |
| 9 | Semester 2 acquired. Semester 1 listed, empty response. | Legacy separate Physics/Physical Science and Biology listings. | 15 | 28 | 17 |
| 10 | Physical and Biological Science listed. Both current links returned empty responses on two government hosts. | Legacy official Physical Science and Biology. | 52 | 28 | 26 |
| Total | 4/10 current files acquired, 6 blocked at file delivery | 13 official volumes cited across current and legacy | 120 | 130 | 90 |

There are **340 edition-specific candidate rows**, including **126 tied to acquired current 2026–27 volumes** and 214 tied to older official editions. Current versus legacy by subject is Chemistry 30/90, Physics 75/55, and Biology 21/69. A row records a visible activity or observation opportunity with its source, PDF page and a proposal for an original virtual adaptation. Class, chapter, numbering and edition travel with each record. Different editions may present related concepts. Dedupe identical source-page activity references, then curate concept families before selecting a production slate. Approximate 40 Chemistry experiments is a planning target alongside curriculum review. The Physics and Biology production counts are open.

The scope covers Class 6–10 textbook activities discoverable in the sampled corpus. It includes suitable measurement, experiment, observation and evidence-classification tasks. The four acquired volumes contain unnumbered and practice material with uneven screen coverage. One volume had scanned pages, so OCR grouping and source-image spot checks were required. Workbooks, teacher manuals, Classes 1–5 integrated EVS, upper-secondary board practicals, current first-semester files, separate editions for other media, and independent Telugu expertise remain gaps. Eligibility for a production activity remains under review. Retain the blocked rows and hashes in the source audit. [Access and source evidence](../EVIDENCE/public_sources/AP_TEXTBOOK_ACCESS.json), [Candidate catalog](../data/ap_experiment_catalog.csv)

## Stable curriculum bindings

| Candidate | Official source and location | Product content in the two modes | Approval gate |
|---|---|---|---|
| `AP-CHEM-10-2.3` | Class X Physical Science, Acids, Bases and Salts, §2.1.2, Activity 2.3, legacy official English page p.38, PDF p.49. | Simulation guides apparatus, evidence and teacher checkpoint. Experiment compares eligible limiting-reactant scenarios with model bounds. | Obtain exact current edition page and approved stock, teacher/safety review, scientific model validation. |
| `AP-PHYS-10-9.10` | Class X Physical Science, Light – Reflection and Refraction, Activity 9.10, Figure 9.10, legacy official English page p.184, PDF p.195. | Simulation traces rays through the slab. Experiment compares one of angle, thickness or registered optical index at a time. | Obtain exact current edition page, qualify geometry and meters, and review accessible route. |
| `AP-BIO-09-5.1` | Class IX Biology, The Fundamental Unit of Life, Activity 5.1, legacy bilingual English page p.2, PDF p.12. | Simulation identifies visible onion epidermis structures. Experiment compares approved views and records scale-bound measurements. | Obtain exact current edition page, release a calibrated rights-cleared image stack, and complete imaging and Telugu educator review. |

The Class X UM-labeled file contains English-facing activity text. The legacy Telugu–English AP index also surfaced a distinct 2024–25 PDF. The current portal's catalogue presence verifies title availability as listed. The year-specific content binding for the three candidates remains pending. A district curriculum owner should record school adoption, book ID, imprint, medium and exact English/Telugu pages in the content manifest. Treat older classroom terminology as evidence for drafting the candidate. [Class X government Physical Science](https://cse.ap.gov.in/downloadBooks/Physics%20Books/10_Physics_Textbook_UM.pdf/10), [Class IX government Biology](https://cse.ap.gov.in/downloadBooks/Biology%20Books/9_Biology_Textbook.pdf/9)

## Candidate ranking and release path

Score each candidate from 0 to 3 for curriculum impact, evidence strength, shared asset reuse and classroom testability. Subtract 0 to 3 for specialist asset/model cost. Require exact current source, rights and safety sign-offs before approved publishing irrespective of score. If two source records express the same task, select one product ID and attach both as curriculum cross-references. Retain earlier versioned references for saved assignments and teacher review. A Telugu reviewer signs labels, glossary, unit reading, step wording and parallel alternative assessments. English and Telugu routes share task IDs, same unit conventions and same evidence. Product team owns wording and authored visuals.

1. **Website** · Expose all three subject hubs and both modes from one experiment card contract. System administrators review draft metadata, locale and rights. Include teacher preview, assignment, completion with evidence and separate eligibility labels for data and inference.
2. **Browser integration** · Use tiny registered fixture scenes for the three subject adapters. Demonstrate launch with exact experiment ID/mode/version, action rejection, save/reload, evidence reporting and a keyboard-only route. Build phase completes after those shared contracts work across all three subject types.
3. **Three environments** · Create one reusable room/environment for each. Confirm separately named workstations, canonical object/scene IDs, shared pointer and camera interactions, alternate controls and package loading. Produce an experiment as data plus small content packages selecting room and workstations. Keep its workflow out of room-level animation state.
4. **Curriculum-aligned experiments** · Start Chemistry Activity 2.3 while carrying the Physics and Biology source and validation work. Produce all three slices before first subject production gate. Second cases verify room reuse. Suggested second tasks are Chemistry indicators, Physics simple pendulum and Biology stomata image comparison. All three require version-specific curriculum checks and model/data qualification. Exact portfolio split follows discovery of missing current editions and teacher prioritization.
5. **Test and deploy** · Assess all subjects on the same school-device and low-connectivity test matrix. Run matched evidence/score checks for two modes and both languages. Audit feedback for scientific accuracy, evaluate child privacy and verify the platform recovers durable observations after transient failure or interrupted sync.

### Three-subject release checklist

| Gate | Chemistry | Physics | Biology |
|---|---|---|---|
| Current curriculum | Exact grade/activity + approved stock | Exact grade/activity + geometric interpretation | Exact grade/activity + approved specimen/labels |
| Original interaction | Correct build-up of a reaction station | An optics setup supporting adjustment and measurement | An optical instrument with true stage views and dataset bounds |
| Experiment Mode authority | Bounded stoichiometric ledger or fixed observations | Typed analytic calculators and calibrated meters | Versioned calibrated images and dataset-backed observations |
| Accessible evidence | Gas/indicator text alternatives and safe motion | Ray tables, keyboard marks, and label distinctions | Keyboard region navigation, structured morphology descriptions |
| Second activity reuse | Existing vessel/indicator with new content manifest | Existing rail or timing station with a different preset | Existing optical stack and region viewer with a different dataset |
| Production status | Proposed, binding and model pending | Proposed, binding and model pending | Proposed, binding and data pending |

The per-subject chapters specify apparatus and content dependencies. [Chemistry](10a_chemistry_lab_curriculum_and_production.md), [Physics](10b_physics_lab_curriculum_and_production.md), [Biology](10c_biology_lab_curriculum_and_production.md)
