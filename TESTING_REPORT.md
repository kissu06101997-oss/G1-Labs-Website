# Testing & Verification Report — G1 Virtua Labs (Website Foundation / Gate W)

**Verification Date:** 22 November 2026 (IST)  
**Environment:** Windows local workstation · Node `v24.14.1` · npm `11.11.0` · Next.js `16.4.6` (Turbopack) · Embedded PostgreSQL (`@electric-sql/pglite@0.5.17` + `@electric-sql/pglite-socket@0.2.20` on `127.0.0.1:54329`) · Chromium (Playwright `1.58.2`) · `@axe-core/playwright@4.10.2`  
**Verified Localhost URL:** `http://127.0.0.1:3000` (local only; not production-deployed)

## 1. Executed Verification Commands & Actual Results

| Check | Exact Command | Result | Duration / Notes |
|---|---|---|---|
| Production dependency audit | `npm audit --omit=dev` | **PASS** (`found 0 vulnerabilities`) | Initially detected `zod <4.6.6` (`GHSA-mrhx-c7xc-m3w5`); upgraded to `zod@4.6.7` and re-verified clean |
| TypeScript strict check | `npm run typecheck` (`tsc --noEmit`) | **PASS** (0 errors) | Strict mode across `src/` and `tests/` |
| Unit & JSON Schema contract tests | `npm run test:unit` (`vitest run`) | **PASS** (2 files, **11 / 11 tests passed**) | `712 ms` — science adapters + Ajv Draft 2020-12 schema validation |
| Production build | `npm run build` (`next build`) | **PASS** (all 31 App Router pages & API routes built) | Compiled in `1.0s`, TypeScript checked in `2.7s` |
| Database migration & reset | `npm run db:reset` | **PASS** | Executes `001_initial_schema.sql` cleanly against real PostgreSQL and seeds idempotent synthetic fixtures |
| End-to-end + Axe WCAG 2.2 AA | `npm run test:e2e` (`playwright test`) | **PASS** (**4 / 4 full E2E suites passed**) | `15.4 s` — covers AT-01 through AT-07, all 6 subject × mode launches, cross-tenant security, small-cell suppression, two-person content review, and zero serious/critical axe-core violations |
| Built-in Antigravity Browser visual QA | Live inspection of `http://127.0.0.1:3000/`, `/laboratories`, `/experiments/AP-CHEM-10-2.3` | **PASS** (0 console errors, 0 broken images) | Caught duplicate version card after test publication (`DISTINCT ON` fix applied), SVG thumbnail crop (`object-contain` fix applied), and mid-width nav wrapping (`whitespace-nowrap` fix applied) |

## 2. Acceptance Test Matrix (Gate W)

| Gate ID | Verified Coverage | Status |
|---|---|---|
| **AT-01** | Public Homepage, Chemistry/Physics/Biology hubs, search/subject/class URL-state filters preserved on Back, English ↔ Telugu (`en-IN` / `te-IN`) switching with `Noto Sans Telugu`, canonical logo pixel integrity (`278×50` unmodified PNG), mobile (`390×844`) zero horizontal overflow, `@axe-core/playwright` WCAG 2.2 AA | **PASS** |
| **AT-02** | All **6 subject × mode launches** (`AP-CHEM-10-2.3`, `AP-PHYS-10-9.10`, `AP-BIO-09-5.1` × Simulation/Experiment) verify immutable `manifestSha256` + `engineAbi: "lab@1"`, redeem single-use launch grant via same-origin POST body only, reject mismatched manifest (`409 VERSION_MISMATCH`), and block token replay (`409 STATE_CONFLICT`) | **PASS** |
| **AT-03** | Cross-school isolation (Teacher B requesting School A class report returns masked `404`), same-school cross-class isolation (Teacher A requesting unassigned Class 9-A returns masked `404`), State Admin aggregate view enforces `< 5 (suppressed)` small-cell suppression with zero student PII | **PASS** |
| **AT-04** | Teacher A publishes version-pinned assignment (`POST /api/v1/teacher/classes/{classId}/assignments`) → persists to PostgreSQL → Student A submits confirmed evidence → Teacher A receives single committed rubric result and exports formula-safe audited CSV (`audit_event`) | **PASS** |
| **AT-05** | Neutral browser player commits typed server actions across all 3 subjects, rejects invalid reagent (`HCl` → `422 INCOMPATIBLE_MATERIAL`), out-of-domain angle (`75°` → `422 OUTSIDE_DOMAIN`), and uncalibrated biology measurement (`422 CALIBRATION_MISSING`) with zero state/revision mutation; browser reload (`F5`) restores exact confirmed revision and observations from PostgreSQL | **PASS** |
| **AT-06** | Equipment List & **2D Accessible DOM Controls** mode verified end-to-end executing identical `/api/v1/sessions/{id}/actions` commands and rubric evaluation without mouse dragging; keyboard-focusable scrollable observation regions (`tabIndex={0}`); automated `@axe-core/playwright` (`wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`) passed with **0 critical / 0 serious violations** across all audited views | **PASS (Automated)** — manual assistive technology (NVDA + Telugu educator UAT) remains required at Gate G |
| **AT-07** | Two-person editorial workflow: `editor@g1virtualabs.test` submits draft `AP-CHEM-10-2.3@0.2.0-e2e` → independent `reviewer@g1virtualabs.test` approves & publishes (enforced by both API and PostgreSQL `CHECK (reviewer_principal_id <> editor_principal_id)`) | **PASS** |

## 3. Defects Caught & Fixed During Testing

1. **PostgreSQL Research DDL Foreign Key Defect:** Running `specs/database_schema.sql` against real PostgreSQL surfaced error `42830` (`number of referencing and referenced columns for foreign key disagree`) on composite unique references in `experiment_version` and `experiment_model`. Fixed explicitly in `db/migrations/001_initial_schema.sql`.
2. **Embedded PGlite Socket Concurrency (`ECONNRESET`):** Concurrent `Promise.all` server queries against single-connection `PGLiteSocketServer` initially caused socket resets. Resolved cleanly in `src/lib/db.ts` by serializing local PGlite connections (`max: 1`, `idleTimeoutMillis: 250`) while preserving `PG_POOL_MAX=10` for standalone PostgreSQL 16+.
3. **Axe-Core `scrollable-region-focusable` Violation:** Caught on Experiment Player's scrollable observation list; fixed with `tabIndex={0}` and accessible labels on scrollable regions.
4. **Mobile Horizontal Overflow & Language Toggle Wrapping:** Fixed with `overflow-x: clip`, responsive logo `max-w-[160px] sm:max-w-none`, and `whitespace-nowrap` on `LocaleToggle`.
5. **Visual QA Polish:** Replaced raw JSON trial preview in Experiment Mode with formatted human-readable summaries (`1.5 µmol H₂ (2 Zn, 3 H⁺)`), widened text-to-photo clearance on Homepage subject cards, deduplicated multi-version catalog queries with `DISTINCT ON (ev.experiment_id)`, and switched SVG concept thumbnails in `/laboratories` to `object-contain`.

## 4. Captured Visual Verification Screenshots (`docs/screenshots/`)

- `01_homepage_desktop.png` (1440×900) & `01_homepage_telugu.png` (Telugu `te-IN`) & `01_homepage_mobile.png` (390×844)
- `02_catalogue_desktop.png`
- `03_experiment_detail_desktop.png` & `03_detail_mobile.png`
- `04_student_dashboard_desktop.png`
- `05_teacher_dashboard_desktop.png`
- `06_simulation_player_desktop.png`
- `07_experiment_player_desktop.png`

## 5. Explicitly Unverified / Out-of-Scope Gates (Stage 2+)

- **Gate B (Hardware & 3D Engine Spike):** Real 4 GB / 8 GB / 16 GB integrated-GPU frame-time benchmarks (`p50/p95/p99`) and 1.1 / 5 / 20 Mbps caching tests for Babylon.js vs Three.js have **not** been run yet.
- **Gate S (Subject Science Sign-Off):** Physical glass slab calibration constants, rights-cleared calibrated onion epidermis micrographs (`µm/px`), and final 2026–27 AP SCERT textbook edition/page verification remain pending specialist review.
- **Gate G (Government Deployment):** Standalone PostgreSQL RLS role enforcement, shared multi-node rate limiting, load testing, CERT-In / DPDP legal review, NVDA + Telugu human accessibility testing, and procurement approvals are not complete and are **not** claimed here.
