# Website-first product specification

## Sitemap and navigation

- Public Home → Labs → Chemistry, Physics, Biology → filterable catalogue → experiment detail → two-mode chooser → role-aware launch. Include support, accessibility, status and English / Telugu in header/footer.
- Student Home → assignments, three hubs, resume, history/feedback and settings. Login shows school login options and help without legal/identity collection before approval.
- Teacher → Classes → roster summary → assignment builder → report/attempt evidence → approved export. Teachers see a live sample journey for both modes across all three subjects.
- School Administration → enrollment and role grants, devices, school reports and exports. District Administration → permitted school roll-ups, training and service incidents. State Administration → aggregate indicators, statewide content rollout, approval and accessibility status. Content workspace is separate and guarded by editor/reviewer permissions.

## Original interface

Desktop uses a narrow semantic sidebar, readably spaced two/three-column content grid and a full-width Player viewport. Mobile uses compact single-column flow and a sticky launch/save control with consistent order. Provide an accessible 2D HTML path on phone and an opt-in large viewport requirement for the target 3D fidelity. Chips indicate meaningful grade, time, mode and readiness; distinguish both modes with pictogram, accessible label and narrative. Build the design from dark slate text, warm off-white surfaces, dark green/blue focus states, and Telugu-capable family (e.g. Noto Sans Telugu after glyph/accessibility QA). Use clear headings, distinct visited link styles, focus rings, proportional spacing, supports text enlargement, disabled reasons and locale-independent numeric parsing. Final design research validates contrast and fonts by device. No existing vendor design assets required.

Experiment detail exposes approved class/book, objective, apparatus/experience preview, estimated duration, model scope, language and access option. Suggested columns:
```
[App nav       Chemistry > Class 10 > Activity 2.3     language]
[Title, objective, edition, apparatus, support and accessibility]
[ Simulation Mode      | Experiment Mode                   ]
[ Guided practical     | Your hypothesis and variable choices ]
[ Enter guided lab     | Open investigation                ]
```
Player header: subject / title / mode · saved at revision / offline · view/help/exit. Bench/canvas and keyboard control list share targets. Results: observation ledger, claim evidence, attempts, rubric and download where authorized. Teacher report: filters, assignment counts, rubric, attempts, provisional/offline reconciliation, individual evidence click-through only in own classes.

## Requirements and acceptance

- REQ-01: public English/Telugu subject hubs with canonical URLs and strict subject, grade, locale filtering; headings and controls usable at 200% zoom, on narrow screen and with keyboard.
- REQ-02: session owner chooses one mode for each approved activity. Mode, subject, experiment and version all appear in player start and saved state. No silent fallback.
- REQ-03: scoped class/student/admin access through server verified membership and role scope. User switches school context explicitly. Cross-school read/write tests, aggregated district/state.
- REQ-04: teacher can publish with due date, rubric, allowed modes and attempt policy. Reports reflect class and variant and distinguish unsubmitted/rejected sync. No time-speed grading.
- REQ-05: website pilot includes an independent neutral browser canvas that sends one synthetic action. Select each subject and mode, launch, move pointer and accessible input, reload, resume, submit and see grade once. Its result is synthetic QA evidence only.
- REQ-06: localized instructions, keyboard and DOM equivalent with identical science actions and mastery evidence. Avoid motion dependence.
- REQ-07: teacher reviewer must approve science, medium equivalence, safety/ethics, assets/rights and data before release. See roadmap and contracts.

Initial navigation can use accessible server-rendered pages with progressive enhancement and lazy player loading. Version URL paths for contracts, publication status in catalogue. Prefer data tables, visible keyboard focus and real-world capture QA over layout screenshots alone.
