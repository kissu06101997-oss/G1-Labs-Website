# Independent audit — Labster REA research & Virtual Laboratories production blueprint

**Audit date:** 22 November 2026 (analysis of user-provided files).  
**Audited inputs:** `LABSTER_RESEARCH_COMPLETE.zip`, `Pasted text(3).txt`, `Pasted text (2).txt`, `EXECUTIVE_SUMMARY.pdf`, `delivery-status.json`.  
**Purpose:** determine research completeness, data reliability, build readiness, scientific validity, budget risk and government-delivery gaps.  
**Method:** inspect ZIP paths, CRC, manifest SHA-256, source ledgers, all CSV/JSON schemas and count distributions, research chapters, examples, design contracts, performance and cost worksheets, PDF pages and provenance notes. Verify representative official upstream public information where practical; do not assume inaccessible Labster internals. No game was launched and no production system was modified.

## Overall verdict

**STRONG RESEARCH FOUNDATION; INCOMPLETE LABSTER REVERSE ENGINEERING; WEBSITE-SKELETON READY WITH CONDITIONS; NOT APPROVED FOR FULL LAB PRODUCTION OR GOVERNMENT DEPLOYMENT.**

The package is a serious and unusually well-organized *research design artifact*. It does **not** contain actual Labster source or gameplay inspection, a running website, functioning web laboratory, validated scientific solver library, Blender models or benchmark proof. Its clear provenance limits are an asset, not a defect; presenting it as a finished Labster-equivalent production implementation would be inaccurate.

### Evidence grades and what they mean

- **Verified locally by this audit:** archive integrity, tabular counts/uniqueness, presence of contracts, JSON Schema/example compatibility, cost-sheet numeric fields, PDF readability and exact uploaded-text duplicates.
- **Stated in research, not independently reproduced in full:** 311 public vendor cards, source capture provenance, official AP textbook details, model/vendor contracts, all 455 registry sources and individual vendor public metadata.
- **Proposed / synthetic:** architecture, budget and performance targets, software fixture tests, science-domain range assumptions, 30-day sequence, rights and legal plans.
- **Missing direct evidence:** live Labster gameplay, exact student/teacher private flows, live Labster asset loading, scientific algorithms, web app, GPU/frame timing, school devices, experimentally measured chemistry/physics/biology data and acceptance testing.

## All uploaded items

| Item | Finding | Handling |
|---|---|---|
| ZIP research package | **90 files**, roughly 3.42 MB uncompressed; CRC passes; manifest contains 88 entries and both manifest/checksum files deliberately self-excluded; all 88 hashes/sizes match and all 89 checksum lines verify. No unsafe traversal paths. | Primary research dataset. |
| `Pasted text(3).txt` | Byte-for-byte duplicate of the packaged `MASTER_BLUEPRINT.md`; 19,463 bytes. | Executive text handoff. |
| `Pasted text (2).txt` | Byte-for-byte duplicate of `MASTER_BLUEPRINT_FULL.md`; 302,018 bytes. | Broad, standalone research specification. |
| `EXECUTIVE_SUMMARY.pdf` | Exact duplicate of ZIP PDF, **2 pages**; render visually readable and correctly laid out. | High-level summary only; not sufficient to build from. |
| `delivery-status.json` | **Unrelated** status file for a different cancelled PDF messaging/delivery action; not linked to the Labster research. | Exclude from this project handoff; contains no Labster implementation results. |

## A. Labster research — critical gap

**Supported:** 311 distinct public card titles, 311 catalogue-linked detail URL records, one additional same-title detail route, taxonomy, level, language and accessibility tags, course associations and published objectives/list pointers. The vendor/public catalogue model is rich enough to design our own catalogue and filters.

**Not supported:** investigation of each actual simulation, operational apparatus, exact scientific logic, 3D materials, physics, mouse/pointer interactions, motion quality, load times and cloud services. All 311 `play_status` fields are `NOT_TESTED`. The 12 in-depth case studies are published-description desk studies, with *zero* live sessions.

### Critical quantified gaps in the 311-row catalogue

| Catalogue attribute | Values absent or literal `null` |
|---|---:|
| Actual gameplay/test status | 311 / 311 not tested |
| Published-summary paraphrase | 299 / 311 |
| Reported apparatus/materials | 302 / 311 |
| Reported prerequisites/safety | 311 / 311 |
| Reported inputs | 305 / 311 |
| Reported controls | 305 / 311 |
| Reported output/observations | 299 / 311 |
| Project-specific reuse/complexity/risk analysis | 299 / 311 |

**Data hygiene issue:** these missing fields are stored as the string `null`, not empty/typed-null values. A naïve importer will mistakenly treat all 311 as completed rows. Normalise them before using the catalogue for planning or release.

**Why Codex stopped:** the investigation records Labster's public terms restricting software reverse engineering and competitor analysis. We checked the official publicly displayed terms sections 2.2.3 and 2.2.9 and they do contain restrictions. The REA browser test was instead performed on a *local, study-owned control page*. The package therefore did not and should not claim to have reverse-engineered Labster's private runtime. Any further vendor runtime analysis requires a written authorized scope and appropriate legal advice.

**REA setup caveat:** `RESEARCH_METHOD_AND_COVERAGE.md` records a Node version mismatch, skill/config drift and unavailable integrated Codex REA MCP. The CLI local test worked. This does not demonstrate readiness of REA as a robust Labster benchmark harness.

**Recommendation:** retain original independent design research; if no vendor permission is available, conduct actual performance/user-experience benchmarking on our own original proof of concept, while using lawful public educational and technical references. Do not describe this as 'entire Labster reverse engineering'.

## B. Andhra Pradesh curriculum research

| Finding | Count |
|---|---:|
| Proposed activity candidates | **340** |
| Chemistry candidates | 120 |
| Physics candidates | 130 |
| Biology candidates | 90 |
| Candidates tied to accessible current 2026–27 content | 126 |
| Candidates tied to older official editions; current binding pending | 214 |
| Published candidate rows awaiting scope/teacher review | 337 |
| Proposed initial slices pending approval | 3 |

These are **candidate records across editions**, not 340 vetted distinct deliverable experiments. The approximately 40 Chemistry experiments have **not** been selected or frozen. Physics and Biology production counts are also open. Six of ten current official book links did not yield usable files in the research run. English–Telugu educational equivalence and textbook numbering need independent approval.

First proposed activities: Chemistry AP-CHEM-10-2.3 zinc/dilute acid (previous edition references), Physics AP-PHYS-10-9.10 glass slab refraction and Biology AP-BIO-09-5.1 onion epidermis microscopy. They are thoughtful demonstrations of the three science families but are NOT fully signed-off current-year course records. Differences in page numbers from earlier user-provided textbook references should be reconciled by edition rather than arbitrarily overridden.

**Needed:** verified current source bytes (or official school edition), teacher-reviewed exact syllabus maps, bilingual activities/objectives/assessments, deduped production slate, priority/effort and approved content identity. Tag each actual planned release with approved grade, book, edition, page and medium.

## C. Two modes, science authority and exploratory AI

**Solid design choice:** each activity shares one apparatus and science state contract across guided **Simulation Mode** and self-designed **Experiment Mode**. UI/hand/VFX cannot overwrite chemistry, physics or biology measurements. Actions are versioned, reason-coded and subject to validation; AI is intended for explanations and proposed actions, not arbitrary factual results.

**Decisive scope mismatch with the owner's vision:** exploratory Activity 2.3 currently permits **zinc and a symbolic acid-equivalent fixture** over a bounded synthetic domain only. It does NOT implement a general metal × acid × concentration × temperature predictor. Hydrogen stoichiometric *upper bound* is not rate, collected quantity, pressure, visible bubbles or pop timing. Nitric acid and unsupported materials must not be treated as interchangeable reactions. This is defensible scientific safety but materially less capable than the desired open-ended Experiment Mode.

Other subjects are similarly bounded: Physics is a synthetic, ideal Snell-law slab geometry example pending real material calibration; Biology is a proposed discrete onion image stack without actual rights-cleared calibrated images. The registry contains 7 proposed/blocked concepts, not 7 implemented solvers; `science_models.json` supplies **3 illustrative profiles**.

**Needed:** experiment-specific admissible variable matrices, validated data/models, independent golden tests with uncertainty, a model-registry publishing process and clearly-labelled unsupported combinations. Client-side mathematical previews may be cheap; authoritative grading must be replayable. An LLM must never fabricate unobserved experiment outcomes, regardless of model name.

## D. Website and platform architecture

**Provided:** bilingual three-subject web sitemap, 12 page/workflow inventory rows, student/teacher/school/district/state/content reviewer roles, versioned mode launch, minimal role-aware auth concept, `OpenAPI 3.1` with 9 proposed paths, 35 PostgreSQL DDL statements, launch/experiment/action/science JSON Schemas, fixtures, event logs, idempotency, checkpoints, and teacher-report outbox.

**Independent static check:** four JSON Schema files are valid Draft 2020-12; three sample experiment definitions, three science model profiles and six runtime examples pass matching validation; the API spec parses into nine paths. This supports planning, **not runtime correctness**. No working website, frontend, backend, database, serverless API, migrations, access-control integration or end-to-end grade submission is delivered.

**Security implementation must not be inferred:** database DDL explicitly does NOT activate row-level security policies; application-side user-role enforcement, enrollment checks, identity lifecycle, CSRF, token redemption, audit and deletion are unimplemented. Research design describes correct principles but authorization must be tested in running code, including cross-school and cross-class denial.

**Portability:** the master full Markdown contains the merged chapters and source-level examples, enough to brief another AI agent about product architecture and first tasks. It does not contain the entire 311-row dataset or actual code; use the ZIP alongside it. Some decisions are explicitly marked PROPOSED, not owner-approved.

**Scope:** website-first sequence is coherent. However the 12 screens are functional descriptions—not high-fidelity design, a component library, responsive mockups, Telugu type tests, full CMS, or a shipped login/product. The proposed days 1–30 are a first neutral-player website/integration sprint, not government-ready website completion. The 17 backlog task ranges total approximately **124–239 person-days** and depend on parallel staff/reviews; this is not a guaranteed one-person/one-month delivery timeline.

## E. Browser engine, graphics, hands and asset pipeline

**Provided:** Babylon.js/WebGL2 proposed as lowest-friction open-source browser renderer, Three.js alternative, WebGPU enhancement; Godot and Unity included. Blender scale-true master → LODs, glTF/GLB, KTX2, collision/grip ports, content-hash manifests, wrist-only gloves, object/camera controls, sound, adaptive settings, glass/liquid rendering guidance.

**Not provided:** any complete `.blend`, `.glb`, actual materials, shaders, animations, textures, shot-by-shot before/after images or browser gameplay recordings. The asset library lists **32 planned apparatus/contracts** (10 Chemistry, 10 Physics, 8 Biology, 4 shared). These are specifications, not photorealistic assets.

**Business decision:** Babylon.js is a *new proposal* in the report, not a confirmed owner decision and **not a claim that Labster itself uses Babylon.js**. It can satisfy the owner's *browser-native delivery approach* while prioritizing permissive licensing, but its glass quality, hand rigging, 4 GB performance, asset pipeline and labor cost must pass a controlled engine spike. Choosing it solely from desk research risks expensive rework. Unity licensing requires written procurement review if considered.

**Vision:** 720p/30 FPS on 4 GB integrated graphics is a target, not measured. High-tier visual aspirations do not guarantee photorealism on school PCs. Concrete camera shots, object pick accuracy, glass readability, liquid volume/transfer, two-hand contact, audio, and low-spec fallback require footage and measurements from a running browser client.

## F. Performance and hosting costs — high commercial risk

`performance_benchmarks.csv` contains nine rows: only **one observed row** is a roughly 1.687 s REA local control scenario. One row marks Labster performance blocked; seven rows are proposed. There is **no measured frame rate, memory, load time or network traffic from Labster or the new web lab**.

The financial spreadsheet models nine cases at 10k/100k/1m registered users. Its *base scenario* is:

| Registered | DAU | Peak concurrency | Base total USD/month |
|---:|---:|---:|---:|
| 10,000 | 1,200 | 127 | **$2,441** |
| 100,000 | 12,000 | 1,265 | **$5,453** |
| 1,000,000 | 120,000 | 12,650 | **$24,286** |

These totals include assumed staff, operational components and reserve but exclude asset/experiment production, school devices/network, taxes, audit/certification, legal costs, procurement-specific rates and unpriced disaster-recovery components. The same 1M-user scenario ranges from about **$3,124 low** to **$176,658 high** under changed usage assumptions. Thus '$24k/month' is NOT a confirmed vendor price or fixed budget.

**Critical sizing gap:** in the 1M-user *base* case, 3,036,000 monthly sessions × 22 minutes × six API requests/minute imply approximately **400,752,000 action/API requests per month**. The scenario assumes **1,265 peak RPS** and only **12 small 4 GB application nodes**, with **$230/month provisional database cost**. There is no load test proving transactional event writes, contention, backup, indexing, replay, report delivery or reliability at that scale. These inputs may materially understate actual infrastructure/operations cost.

Require real load tests and production-like synthetic API generation, grade/outbox throughput, DB storage/index volume, CDN cache and India-region pricing; compare low/base/high and class-boundary peak bursts. Consider whether purely visual, ungraded micro-actions can remain client-local and only meaningful scientific/assessment transactions require server confirmation. Do not change the event-authority model without specifying anti-tamper and grade integrity tradeoffs.

## G. Government security, licensing and accessibility

The report responsibly identifies GIGW, WCAG 2.2 AA, child data governance, DPDP staged requirements, CERT-In, procurement, cross-school access, Telugu/English, accessibility-equivalent DOM player, backups, DR and admin governance. These are intended engineering controls; no approvals, penetration tests, school pilot, legal sign-off or signed government procurement are included. Date-sensitive law and vendor licensing statements need counsel to confirm applicability to the contracting entity. The current Labster public ToS can be independently read at https://www.labster.com/terms-of-service-and-use .

The accessible 2D/DOM equivalent is a good inclusion; preserving equivalent educational evidence is better than claiming every 4 GB device can run full 3D. However, accessibility and Telugu language have no real user acceptance testing yet.

## H. Handoff/reproducibility quality

Strengths: traceable folder structure, manifest and checksums; research caveats; complete append-only master; open JSON schemas; proposed API and SQL; source IDs; costs and academic source mapping. A cold-read handoff test reports eight answered questions and a small set of corrections. The scripts are research/test utilities, **not** deployed web or science systems.

Limitations: 'VERIFIED' in manifest may describe format/count/source label verification rather than observation of actual behaviour or an externally audited claim. The 455 source IDs include many per-listing reference links and are not equivalent to 455 independent experimental tests. Source URL liveness was not independently confirmed for every entry during this audit. Relative paths inside the standalone text refer to ZIP members; preserve the ZIP.

## High-priority remediation register

| Severity | Required decision or verification | Proposed owner and proof |
|---|---|---|
| P0 | Clarify legally permissible Labster comparison scope | Counsel + product; signed scope or pivot entirely to public source comparisons |
| P0 | Freeze both-mode product capability levels | Product + science; supported-variable matrix and explicit unsupported outcomes for each first slice |
| P0 | Validate browser engine with school-hardware reality | Web 3D lead; identical benchmark mini-scene on Babylon/alternative, 4 GB test, glass/hand/pour footage |
| P0 | Approve AP textbook version and first experiment selection | AP educators; current edition/medium, exact pages, signed objectives and Telugu review |
| P0 | Validate scientific authority/data | Chemistry, Physics, Biology experts; independent reference results, calibrated physics, licensed biology images |
| P0 | Stress-test cost assumptions, transactions and scale | Backend/ops; workload generator, 400m-request scenario, load and cost report |
| P1 | Establish final website experience/design system | UX team; all 12 screens, responsive bilingual components and teacher journey usability |
| P1 | Build neutral browser integration and confirm end-to-end authority | Frontend/backend; six mode launches, checkpoint, one result, cross-school negative tests |
| P1 | Turn 340 candidate source rows into approved production slate | Content team; remove duplicate concepts, first approx. 40 Chemistry activities, prioritised Physics/Biology subset |
| P1 | Fix catalogue missing-value encoding and confidence semantics | Data team; literal null → typed null, completeness score, split published and inferred fields |
| P1 | Turn asset specification into real browser-native meshes | Tech art; one labelled bottle, test tube, glass apparatus, one glove interaction, closeup, performance logs |
| P1 | Formalise privacy/data authority and accessibility | Legal/security/education; policies, consent/exception, audits, keyboard/screen reader/Telugu acceptance |

## Go/no-go decisions

- **GO:** Plan and implement a separately authorized **website foundation**, three subject catalogue stubs, pseudonymous synthetic roles, dual-mode selection, a neutral browser scene/DOM equivalent and API result handshake; preserve the existing Unreal proof separately.
- **CONDITIONAL GO:** Commit to Babylon.js only after a comparable school-device graphics/function spike. Do not infer its performance or visual fidelity from source descriptions.
- **NO GO:** Declare the Labster reference fully reverse-engineered; schedule 40 finished science experiments as if already modelled; expose arbitrary AI chemistry prediction as fact; publish school grades or collect real child data without governance; promise 1M-user production cost/throughput from this worksheet alone; label research fixtures as validated measurements.

## Source map for next agent

| Need | Start file(s) |
|---|---|
| Product intent and first steps | `MASTER_BLUEPRINT.md`, `MASTER_BLUEPRINT_FULL.md`, `README_START_HERE.md` |
| Provenance, access limits | `RESEARCH_METHOD_AND_COVERAGE.md`, `VALIDATION_REPORT.md`, `SOURCES_AND_EVIDENCE.csv` |
| Labster catalogue | `data/labster_catalog.csv`, `data/labster_catalog_data_dictionary.md`, `docs/02_full_catalog_analysis.md` |
| AP content | `data/ap_experiment_catalog.csv`, `docs/10*.md`, `EVIDENCE/public_sources/AP_TEXTBOOK_ACCESS.json` |
| Website and API | `docs/11*.md`, `docs/12*.md`, `specs/website_lab_api.openapi.yaml`, `specs/database_schema.sql` |
| Two modes/science | `docs/09*.md`, `specs/science_model_contract.schema.json`, `specs/science_models.json`, `specs/example_*` |
| Browser graphics | `docs/07*.md`, `docs/08*.md`, `data/apparatus_library.csv` |
| Costs | `docs/15*.md`, `data/cost_scenarios.csv` |
| Release sequence and tests | `docs/16*.md`, `specs/acceptance_tests.csv`, `specs/implementation_backlog.csv` |

## Reproducible audit checks performed

- ZIP decompression CRC: **pass**, 90 safe paths.
- Integrity: 88 manifest entries match SHA-256 and byte counts, 89 checksum lines valid, `MANIFEST.json` and `SHA256SUMS.txt` intentionally self-excluded.
- Text duplication: both pasted files match their ZIP masters exactly; PDF matches ZIP PDF exactly.
- Structures: 311 Labster entries unique title/ID/URL; 340 AP candidate IDs unique; 32 apparatus specifications; 17 acceptance cases.
- Sources: 455 unique registry IDs, all referenced tabular source IDs resolve within the registry and the registered local evidence paths exist; this is **reference integrity**, not complete source-content verification.
- Static JSON: four schemas pass Draft 2020-12 structure checks; 3 experiment samples, 3 science model profiles and 6 launch/action/event examples validate; OpenAPI 3.1 YAML parses with 9 paths.
- PDF: both pages rendered and visually inspected.
- Not performed: full external source URL checking, pglast DDL execution against PostgreSQL, deployed API/role tests, actual classroom benchmarks, live vendor runtime analysis, human legal/science/Telugu approvals, or production visual review.

**Bottom line:** The dossier is usable for a carefully scoped website prototype and cross-team research handoff. To make it a credible *complete product blueprint* for government procurement and full virtual labs, resolve the P0 scientific, hardware, cost and governance gates and produce a real dual-mode browser slice in **each** subject. Neither more pages nor more REA tooling can replace those measurements.
