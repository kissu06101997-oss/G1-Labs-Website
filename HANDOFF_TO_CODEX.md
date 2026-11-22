# Handoff to Codex — G1 Virtua Labs (Stage 2: Browser 3D Labs & Science Validation)

## 1. Current State & Workspace Location

- **Local Repository Path:** `E:\G1 Virtual Labs website` (local Git initialized on `main`, **no remote**, no cloud deployment; `D:\AI_Virtual_Laboratories_Web` did not exist on the machine and all `D:\` Unreal/Unity folders were left untouched).
- **Reference Materials Preserved:** `project-brief/` contains the unpacked `G1_Virtua_Labs_Approved_Design_References/` (7 approved reference images + canonical logo + visual anchor), `AI_Virtual_Labs_Labster_REA_Research_2026-11/`, and `LABSTER_RESEARCH_INDEPENDENT_AUDIT.md`.
- **Gate W Status:** Website Foundation implemented and verified locally (all 31 Next.js routes build cleanly, real PostgreSQL 16+ schema + migrations + synthetic seed, 6 subject × mode neutral player launches, reload/resume, teacher assignment publishing, single report receipt, audited CSV, cross-tenant negative isolation, small-cell suppression, two-person editorial review, WCAG 2.2 AA axe-core scans).

## 2. First Commands for Codex

```powershell
cd "E:\G1 Virtual Labs website"

# Start embedded PostgreSQL + migrate + seed + Next.js at http://127.0.0.1:3000
npm run dev:local

# In a second terminal: run full verification gates
npm run typecheck
npm run test:unit
npm run db:reset
npm run test:e2e
```

Synthetic local QA credentials (never real student data; password `G1LocalTest!2026` for all):
- Student A (School A): `student.a@school-guntur-01.test`
- Student B (School B): `student.b@school-vijayawada-02.test`
- Teacher A (School A, Class 10-A): `teacher.a@school-guntur-01.test`
- Teacher B (School B, Class 10-A): `teacher.b@school-vijayawada-02.test`
- School Admin / District Admin / State Admin / Content Editor / Content Reviewer: see `SETUP_LOCAL.md`.

## 3. How to Plug In a Real 3D Browser Lab Without Rewriting the Website

Do **not** rewrite authentication, `/api/v1/*`, PostgreSQL tables, or the page shell. Follow this exact 4-step extension path:

### Step A — Swap the Stage Renderer inside `src/components/LabStageCanvas.tsx`
1. Create a lazy-loaded client component `src/components/BabylonLabCanvas.tsx` (or Three.js fallback after completing the Gate B 4 GB school-GPU benchmark spike!) dynamically imported with `next/dynamic(..., { ssr: false })`.
2. Mount it inside `LabStageCanvas.tsx` when `!domAccessibleMode` and WebGL2 is available, keeping the existing **2D Accessible DOM Control Equivalent** (`domAccessibleMode`) 100% intact for screen readers, keyboard-only learners, and low-spec 4 GB / mobile devices!
3. Subscribe the 3D scene to `state` and `state.visualCues` passed from `LabPlayerClient.tsx`. When a user interacts with a 3D apparatus collider/grip port in the scene, invoke the existing `onDispatch({ targetObjectId, actionType, parametersWithUnits, interactionPort, choiceId })` callback.
4. **Never** run reaction animations or update measurements optimistically before `POST /api/v1/sessions/{sessionId}/actions` returns `accepted: true`.

### Step B — Register Fingerprinted Scene & Asset Packs
1. Place Blender-exported `.glb` meshes and KTX2 textures under `public/scenes/<sceneId>/<sha256>/` (separable to an immutable HTTPS CDN in future deployment).
2. Add asset URLs and SHA-256 digests to the `definition` JSON stored in `experiment_version` via a new migration or the `/content` two-person editorial review flow.
3. Because `POST /api/v1/launch` pins `manifestSha256` and `engineAbi`, any updated asset/model pack automatically receives a new immutable digest while older attempts remain replayable against their pinned version.

### Step C — Upgrade Domain Science Adapters in `src/lib/science-adapters.ts`
1. Replace or expand each subject's deterministic server executor (`executeChemistryAction`, `executePhysicsAction`, `executeBiologyAction`) **only after** subject-matter expert sign-off and independent golden test vectors:
   - **Chemistry (`CHEM-ZN-ACID-BOUND`):** Keep exact integer/rational stoichiometry; do not introduce unvalidated kinetics or arbitrary reagent mixing. Add PHREEQC/Cantera only as separately qualified versioned model profiles (`model_version`).
   - **Physics (`PHYS-SLAB-RAY`):** Add independently measured refractive index `n(λ, T)` and instrument uncertainty propagation once a physical school glass slab is calibrated.
   - **Biology (`BIO-ONION-STACK`):** Keep `measure_cell_length` returning `422 CALIBRATION_MISSING` until rights-cleared, stage-micrometer-calibrated (`µm/px`) onion epidermis image stacks with SHA-256 `dataset_digest` are published in `model_version`.
2. Add golden-case regression tests in `tests/unit/science-adapters.test.ts` and validate every new output shape against `specs/lab_action.schema.json`.

### Step D — Promote New AP Curriculum Activities (Data-Driven, Zero Engine Fork)
1. Use the normalized 340-row AP corpus in `project-brief/AI_Virtual_Labs_Labster_REA_Research_2026-11/data/ap_experiment_catalog.csv` as an internal research candidate list only.
2. After AP educator edition/page/Telugu sign-off, insert new `experiment` + `experiment_version` + `curriculum_ref` records referencing the existing reusable room `sceneId` (`room-chemistry@1`, `room-physics@1`, `room-biology@1`).
3. Route every release through the two-person `/content` review workflow (`editor@g1virtualabs.test` → `reviewer@g1virtualabs.test`).

## 4. Stage-2 Prioritized Backlog (P0 Gates Before Full School Pilot)

| Priority | Gate | Deliverable | Acceptance Proof Required |
|---|---|---|---|
| **P0-1** | Gate B | 4 GB Integrated-GPU Browser Engine Spike (Babylon.js WebGL2 vs Three.js) | Identical glassware + wrist-only PPE glove + constrained liquid transfer test scene measured on real 4 GB / 8 GB / 16 GB devices at 1.1 / 5 / 20 Mbps (`p50/p95/p99` frame times, cold/warm bytes, memory) |
| **P0-2** | Gate C | Three Reusable Room Asset Packs (`room-chemistry@1`, `room-physics@1`, `room-biology@1`) | Scale-true Blender masters → `.glb` + KTX2 LODs + collision/grip port metadata, `<= 12 MB` first scene budget |
| **P0-3** | Gate S | AP SCERT 2026–27 Edition & Telugu Educator Sign-Off for First 3 Slices | Confirmed edition/imprint/page numbers and Telugu terminology review for `AP-CHEM-10-2.3`, `AP-PHYS-10-9.10`, `AP-BIO-09-5.1` |
| **P0-4** | Gate S | Calibrated Physics Slab & Rights-Cleared Biology Micrograph Stack | Signed calibration constants for Physics and SHA-256-pinned micrograph dataset + scale (`µm/px`) for Biology |
| **P0-5** | Gate G | Load Testing, PostgreSQL RLS Activation & Shared Rate Limiter | Synthetic class-boundary burst load test against standalone PostgreSQL 16+ with non-owner RLS roles and Redis/DB rate limiter |
| **P0-6** | Gate G | Legal, DPDP Child-Data Governance, CERT-In & GIGW/WCAG Audit | Independent accessibility testing with assistive technology (NVDA + Telugu) and written legal/procurement sign-off before onboarding any real students |
