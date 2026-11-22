# G1 Virtua Labs — Website Foundation

**G1 Virtua Labs** is a browser-native, bilingual (**English `en-IN` / Telugu `te-IN`**) virtual science laboratory platform designed for **Andhra Pradesh** government-school contexts across **Chemistry, Physics, and Biology**, featuring two clearly differentiated learning modes per qualified experiment:

- **Simulation Mode (Blue `#0E80D4`)** — Guided curriculum practical with step-by-step instructions, contextual hints, server-validated observations, checkpoints, and rubric assessment.
- **Experiment Mode (Green `#058D60`)** — Bounded independent scientific inquiry with approved variable domains, explicit units, control/comparison trials, theoretical/calibration disclaimers, and evidence-linked rubric evaluation.

> **Scope & Evidence Honesty Notice**  
> This repository delivers the **Gate W Website Foundation**: working bilingual routes, real PostgreSQL 16+ persistence, tenant-scoped authentication and RBAC, OpenAPI 3.1 lab contracts, six tested subject × mode neutral player launches, reload/resume checkpoints, teacher assignment publishing, exactly-once grade propagation, audited CSV exports, small-cell suppressed district/state aggregates, and two-person editorial publication review.  
> **Not claimed complete in this phase:** Full photorealistic 3D Blender/Babylon.js laboratory scenes, physical slab calibration, rights-cleared onion micrographs, final 2026–27 AP SCERT textbook edition sign-off, external LTI 1.3 LMS integration, or government procurement / DPDP certification. All seeded accounts and student rosters are **synthetic local QA fixtures** with no real student data.

## Workspace Provenance

- **Active Local Workspace:** `E:\G1 Virtual Labs website` (local Git repository with **no remote**; no cloud deployment; existing Unreal/Unity folders on `D:\` were left completely untouched).
- **Supplied Brief Archive:** Unpacked read-only reference copy preserved in `project-brief/` (approved design references, Labster REA research package, and independent audit).
- **Canonical Brand Asset:** `public/brand/g1-canonical-logo.png` (unmodified `278×50` crop from `00_APPROVED_VISUAL_ANCHOR.png`) rendered uniformly by `src/components/BrandLogo.tsx`.

## Quick Start (Windows Local)

```powershell
# 1. Install dependencies (already installed in workspace)
npm install

# 2. One-command local startup (embedded PostgreSQL + migrate + seed + Next.js on http://127.0.0.1:3000)
npm run dev:local
```

Or run the production build locally:

```powershell
npm run build
npm run start:local
```

See [SETUP_LOCAL.md](./SETUP_LOCAL.md) for standalone PostgreSQL 16+ configuration, database reset commands (`npm run db:reset`), and seeded synthetic QA accounts.

## Key Documentation

| Document | Purpose |
|---|---|
| [AGENTS.md](./AGENTS.md) | Non-negotiable engineering, brand, security, accessibility and scientific rules for AI coding agents |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture, PostgreSQL schema, auth/RBAC, and API/player boundaries |
| [SETUP_LOCAL.md](./SETUP_LOCAL.md) | Step-by-step Windows setup, env vars, DB commands, and seeded synthetic accounts |
| [LAB_INTEGRATION_CONTRACT.md](./LAB_INTEGRATION_CONTRACT.md) | Exact OpenAPI 3.1 / JSON Schema / `lab@1` integration protocol for 3D scene & science adapters |
| [HANDOFF_TO_CODEX.md](./HANDOFF_TO_CODEX.md) | Self-contained Stage-2 handoff guide for Codex (Babylon.js 3D rooms + validated science models) |
| [UX_CONTROL_INVENTORY.md](./UX_CONTROL_INVENTORY.md) | Usefulness-gate audit of every visible control across all routes |
| [FEATURE_TRACEABILITY_MATRIX.md](./FEATURE_TRACEABILITY_MATRIX.md) | Evidence-graded mapping from REA research to independently authored G1 features |
| [TESTING_REPORT.md](./TESTING_REPORT.md) | Executed commands, unit/contract/E2E/axe-core results, and visual QA findings |
| [docs/SKILLS_INSTALLATION_REPORT.md](./docs/SKILLS_INSTALLATION_REPORT.md) | Audited skills installed into `.agents/skills/` |
