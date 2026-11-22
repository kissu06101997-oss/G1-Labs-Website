# G1 VIRTUA LABS — DEFINITIVE ANTIGRAVITY LOCAL WEBSITE BUILD BRIEF

**Product:** G1 Virtua Labs (spell it exactly).  
**Owner-approved visual anchor:** `00_APPROVED_VISUAL_ANCHOR.png` (the owner's chosen bright reference screenshot).  
**Owner-approved logo:** `assets/G1_CANONICAL_LOGO_FROM_APPROVED_SCREENSHOT.png`, cropped without redesign from the owner's approved screenshot.  
**Workspace:** `D:\AI_Virtual_Laboratories_Web` on the owner's local Windows computer.  
**Primary delivery:** A functioning, beautiful, maintainable, bilingual website foundation that supports Chemistry, Physics and Biology, with two learning modes for every approved experiment and real browser-player integration contracts.  
**Follow-on delivery:** Real subject-specific 3D rooms and scientific adapters, integrated later by Codex or another agent, without rewriting the website.

## 0. Your mission and authority

You are Google Antigravity, working locally. You have no previous project context. Read this brief in full, then `MASTER_BLUEPRINT_FULL.md`, `MASTER_BLUEPRINT.md`, the contents of `LABSTER_RESEARCH_COMPLETE.zip`, and `LABSTER_RESEARCH_INDEPENDENT_AUDIT.md` (and any supplied source/evidence directories). Inspect actual files, not guessed names; identify any missing files or inconsistent requirements. Treat the source research's status classification—**OBSERVED, PUBLISHED, INFERRED, PROPOSED, UNKNOWN/BLOCKED**—as authoritative about evidence strength. The product owner's explicit requirements in this brief override optional aesthetic suggestions from the research, but never override verified scientific, security or accessibility requirements.

**Do not produce a disposable demo website.** Produce a premium product-grade **website foundation with actually working flows**: real routes, real local persistence, real authentication and authorization checks, real assessment and reporting contracts, tested six subject/mode launches and a functioning inert browser player. Only the **laboratory science and full high-fidelity 3D environments** are allowed to remain future integration work. The website is a real application; its synthetic accounts and inert scene are test fixtures, plainly identified as such.

Do not silently assert that Chemistry, Physics or Biology experimental science models are finished, that all AP curriculum activities are approved, or that a generated image is a verified experiment illustration. Do not describe localhost as production-deployed. Avoid claims of government authorization, certification or guaranteed operating costs.

**Strict local boundaries:** Work in `D:\AI_Virtual_Laboratories_Web`. Do not create a remote GitHub repository, publish the site, purchase hosting, send student information to remote services, change Windows global settings without reason, or touch `D:\AcidsBasesLab_Unreal` or any other existing Unreal workspace. Local Git history with **no remote** is encouraged; before significant architectural changes make a reversible commit or dated snapshot. Never include credentials in commits, screenshots or the final handoff.

## 1. First, verify development skills and project assumptions

Install only the skills relevant to the build, after reading their official documentation, evaluating the repository contents, and verifying Antigravity's actual project-skill discovery and installation mechanism (CLI names may vary by installed version):

1. **UI/UX Pro Max:** `https://github.com/nextlevelbuilder/ui-ux-pro-max-skill.git` — premium design systems, color, typography, layout and interaction design. The skill advises; it does not override our owner-approved visual anchor or logo.
2. **Addy Osmani Agent Skills:** `https://github.com/addyosmani/agent-skills.git` — frontend engineering, maintainability, web performance, security, testing and browser diagnostics. Install/select appropriate individual skills; do not blindly execute unrelated automation scripts.
3. **Ponytail:** `https://github.com/DietrichGebert/ponytail.git` — review for avoidable duplication and excessive complexity. Never use it to remove necessary correctness, security, accessibility, fidelity, user workflows or required science interfaces.

Use Antigravity Browser for actual visual inspections and Playwright for repeatable functional tests; use `axe-core`/`@axe-core/playwright` for accessibility checks. Follow a single set of nonconflicting project instructions. Record what was installed, from where, versions/commits and any permissions in `docs/SKILLS_INSTALLATION_REPORT.md`. If a plugin cannot be installed safely, keep developing with built-in tools and document the reason.

## 2. Nonnegotiable product identity and scope

**G1 Virtua Labs** — a browser-native science-learning platform for Andhra Pradesh government-school contexts. Three **first-class** subjects: Chemistry, Physics, Biology. One shared website with role-aware workspaces for learner, teacher, school administrator, district/state aggregate reviewers, content editor/reviewer and system operator. English (`en-IN`) and Telugu (`te-IN`) are mandatory in the architecture and principal pilot journeys, including labels, scientific terms and assessment choices. Do not use Filipino, Spanish, Philippines DepEd or US Advanced Placement labels as Andhra Pradesh curricula. AP refers to **Andhra Pradesh** here.

Every released experiment must offer two differentiated modes, **subject to scientific approval of that mode**:

- **Simulation Mode = BLUE (`#0E80D4`)**. Guided curriculum practical: aim, apparatus, safety, step-by-step mission, in-context help, observations, checkpoint, assessments and teacher-visible completion. A help button offers useful guidance; it does not cover the whole viewport or control the student unnecessarily.
- **Experiment Mode = GREEN (`#058D60`)**. Independent, **bounded** scientific investigation: question/hypothesis, choice of *approved* independent/dependent/control variables and ranges, control trial, repeat/compare, grounded evidence, uncertainty/limitations, claim-evidence-reasoning and rubric. No unlimited chemical mixing; no AI-generated measurements, kinetics, pressure, biological data or arbitrary material behavior.

The two colors **supplement** text, icons and labels; do not make color the sole differentiator. **Never reverse the semantic definitions**. A simulation is guided, an experiment is inquiry-led. Preserve the same domain state/actions, scientific model IDs, observation sources and activity version between modes. Only allowed actions, rubric and guidance differ.

## 3. Brand and exact logo — no drift

Use `assets/G1_CANONICAL_LOGO_FROM_APPROVED_SCREENSHOT.png` as the **one exact canonical logo** in public header, sign-in, student and teacher headers, player, administrator app and report exports. It is extracted directly from the owner's approved screenshot. Do **not** draw your own G1 glyph, replace the mark with an atom/flask or regenerate the wordmark per page. Do not rotate, recolor, skew, add a trademark symbol, omit the speed-line motif or change the G1 proportions.

The supplied logo is a raster identity reference, not an editable vector master. For production create a vector recreation only through precise tracing of the supplied identity, then compare overlays at multiple sizes and obtain owner approval **before** switching the canonical asset. Preserve the original crop as the comparison standard. Export a consistent header logo, dark-surface variant only if needed, compact favicon from the same approved monogram, and document clear space, sizes and accessible logo text. No newly designed secondary logo.

**Owner-approved visual anchor:** bright ice-white background, generous clean spacing, soft cyan-blue wash, gentle green accents, minimal relevant 3D/photorealistic lab illustrations and refined raised gradient buttons. **Reject** dark full-page wallpaper, sci-fi neon clutter, glowing particles, impenetrable glassmorphism, fake 3D dashboards and random visual gradients. Our reference screens are structural illustrations; the finished UI must look at least as polished.

Suggested design tokens (test contrast, font and light/dark adaptation; these are guidance, not an excuse to drop accessibility): background `#F4FAFE`, white card `#FFFFFF`, text `#0C2444`, secondary text `#61738C`, brand teal `#008E8B`, Simulation blue `#0E80D4`, Experiment green `#058D60`, border `#DDEBF3`; Inter and approved Telugu-shaping font. Use a restrained set of icon sizes, border radii and spacing intervals. Apply tactile button shading sparingly: subtle convex top highlight, ambient shadow, hover lift ~1–2 px, press displacement ~1–2 px, visible keyboard focus, reduced motion. Not every card needs a glowing outline. Choose readable typography and comfortable targets over dense information.

## 4. The exact seven design references — read images individually

The `references/` directory contains seven distinct **1600×900** desktop image references plus their editable **HTML layout study files** in `html/`. These HTML files are design sketches only, not the future application source. Study each individually. **Do not replace the whole project with stitched screenshots.** Build real responsive components that match their conceptual information hierarchy.

| File | User intent | Essential visible elements | Omit |
|---|---|---|---|
| `01_Homepage.png` | Understand the platform and enter subject browsing | Exact G1 logo, Laboratories, For teachers, Help, EN/TE switch, Sign in, **one primary Explore laboratories CTA**, three subject entries, brief blue/green mode explanation, three carefully chosen practical previews | Unimplemented promo-video button, duplicate onboarding CTAs, fabricated testimonials, ratings, fake school metrics, irrelevant menu options |
| `02_Experiment_Catalogue.png` | Find a practical | Global search, subject/class filters, relevant experiment cards and exactly **one View experiment action per card** | A sprawling filter sidebar, duplicated mode buttons on every card, ratings, unverified difficulties, every possible metadata field |
| `03_Experiment_Detail.png` | Understand task and choose mode | Title, source edition/subject, appropriate apparatus concept, outcome/safety, two **clearly labelled** mode choices with one launch action each | Duplicated Start buttons, hallucinated results, unrelated recommendations, teacher-only controls shown to anonymous visitors |
| `04_Student_Dashboard.png` | Resume assigned work and see deadlines | One dominant Resume, upcoming assignments, concise real-data progress, Results and Help | Fake achievements, user-unearned certificates, cluttered graphs, teacher controls or marketing sections |
| `05_Teacher_Dashboard.png` | Assign content and review evidence | Class scope, Assign experiment, versioned assignment list, submission/review status, class report | Statewide charts by default, student UI masquerading as teacher, ungrounded gamification |
| `06_Simulation_Player.png` | Complete current guided step | Unobstructed canvas, one step at a time, accessible equipment list, contextual observation, confirmed save status, one relevant Next/Check control | Multiple cursors, full-screen help overlays, permanent 20-control sidebars, FX pretending to be experimental measurement |
| `07_Experiment_Mode_Player.png` | Conduct admitted inquiry | Approved variable selectors with units, domain warning, main scene, theoretical or measured evidence explicitly labelled, control/comparison state, Record trial | Unsupported reagent choices, free-form invented chemistry, arbitrary measurements, inaccurate timing claims |

These are **reference screen compositions**. In product, show controls conditionally by role, state, approval status and screen width. The website must support phone/tablet access, but premium 3D physics scenes may require an approved low-device 2D DOM-equivalent route. Create actual mobile variants after desktop implementation; avoid horizontally scrolling desktop tables on narrow screens when a sensible stacked summary works.

## 5. The usefulness gate: every visible control must earn its place

For **every** proposed control, tab, icon, badge, search, filter, chart, CTA, notification, activity card, illustration and nav link, maintain `docs/UX_CONTROL_INVENTORY.md` with:

- Route and exact label.
- Who may see it and why.
- User's goal and the action it executes.
- Real route/state/API call and required permissions.
- Loading, empty, disabled, offline and error behaviour.
- Evidence backing values and whether it is synthetic or released.
- Keyboard/screen-reader/touch action.
- Whether its purpose can be handled by an existing simpler control.

If an option has no justified task, **remove it**. If it is useful but secondary, disclose it at the point of need instead of placing it permanently on the main surface. Do not create dead-end buttons. Noninteractive explanatory information should **not look clickable**.

The catalogue must not offer both modes until the user selects an experiment. The homepage's mode blocks are **explanatory**, not 2 orphan launch buttons. The teacher's "Assign" flow contains appropriate class, approved experiment/version, allowed modes, deadline and attempt policy; show complexity inside that task, not as homepage navigation. Charts are only shown with meaningful, real/synthetic-labelled underlying data and a question they answer. Every scientific illustration must correspond to its lab/domain; data from literature and measurements must never be fabricated by a decorative asset.

## 6. Website product feature set from the REA research — no omission

The research is a comparative source, **not** a legal mandate to copy Labster. Build independently authored equivalents or improved flows. Do not copy vendor-protected screens, assets, quizzes, code or runtime. In your traceability matrix use the research's true access labels and never claim direct Labster gameplay was observed: it wasn't.

### Public and content discovery

A fast accessible homepage, three subject hubs, AP grade/class, edition/chapter/outcome/content family links, search, sensible filters, experiment detail, published state/availability, mode chooser, support/compatibility disclosure, language switch, source-approved content previews. Public catalogue should not simply import all 311 Labster products; the independent AP candidate catalogue has 340 **unapproved candidates** across 13 book volumes (120 Chemistry, 130 Physics, 90 Biology), and exact year/medium curriculum binding remains a reviewer task. Use genuinely available approved experiments only when status says approved; show research-only records in appropriate internal preview, not as deployable content.

### Guided learning / assessments

Learning goals, expected skills, procedure steps, contextual help/hints/theory, observable steps, notes, checkpoint/resume, completion states, rubric-based quiz and evidence assessment, first/latest attempts, retries, reflection, alternative keyboard/DOM route. A mission completion flag is not proof of scientific mastery. Do not grade a student based on fancy animation, perceived reaction speed, whether audio was played, or connection quality.

### Student workspace

School-scoped test identity, assigned lessons, resume exact content/model/mode/version, progress, evidence, rubric feedback, attempts/retries, locale preference, saved-state clarity, device support, help and account recovery. Underlying records must have authoritative server revision IDs; offline intents are visibly **pending**, never silently treated as submitted grades. Do not implement certificates/leaderboards without real educational requirements, award logic and privacy review.

### Teacher workspace

Classes/sections, school membership, approved curriculum search, assignment version/mode/due date/attempt policy, teacher preview, progress summary, student evidence/rubric by authorized class, retry/first/latest views, safe exports with audit, class report and review flags. A teacher from school A must never access school B's learner evidence. Grade exports/LMS sync are separately authorized integration work; document 1EdTech LTI 1.3 and grades/services as future contracts, not a fictional active integration.

### School, district, state and editorial workflows

School-level role and enrollment controls, scoped administration, audit/export logs, device readiness metadata, district/state **aggregates with small-cell suppression**, content editor and independent reviewer, curriculum edition checks, bilingual translation approval, scientific-model qualification, rights verification, publish/version/rollback, operator system status. Create real local staging schemas and minimal usable screens for administration. Do not waste the student UI surface displaying back-office features.

### Science and browser-player contracts

Use the documented versioned `ExperimentDefinition`, `Launch`, `LabActionRequest`, `LabActionResult`, `LearningEvent`, science-model and dataset/manifest concepts. Preserve immutable content hashes/engine ABI, single-use scoped launch grant redemption via authenticated same-origin POST body, expected revision, idempotency, retry/resume and transactional authoritative outcome. Implement a small neutral interactive player fixture (not a fake chemistry reaction) that exercises this protocol across **3 subjects × 2 modes = 6 launches**, with the same student/teacher result flow. Render decorative motion **only after** accepted state in real lab future. A losing network connection never creates phantom grades or duplicate experiment actions. An accessible DOM player has the same authoritatively computed actions/evidence.

The REA report provisionally proposes **Babylon.js with WebGL2**, Three.js as a possible fallback and browser-side rendering to avoid mandatory per-student GPU streaming. Do not permanently lock the engine without a measured 4 GB classroom GPU device pilot and a test of transparent glass, accurate picking, loading/caching and local memory. An inert browser integration smoke test is enough for this website phase. Codex will later own full Blender+glTF/KTX2 scene packs and validated subject adapters.

### Scientific authority and three first slices

- Chemistry `AP-CHEM-10-2.3`: **zinc + dilute sulfuric acid**, textbook specifies a teacher-guided virtual procedure and gas routed into **soap solution**; verify adopted edition. Do **not** substitute hydrochloric acid because a mockup once showed HCl. Explore amounts only within a reviewed stoichiometric upper-bound model; no automatic kinetics, collection-volume or ignition prediction, nor unsupported substitution of arbitrary metals/acids.
- Physics `AP-PHYS-10-9.10`: refraction through parallel glass slab; exact refractive index and real meter accuracy require verified material/instrument calibration. Separate renderer ray display from model-computed angle and displacement. Handle user-set angles and a validated accessible ray diagram.
- Biology `AP-BIO-09-5.1`: onion epidermis microscopy; lab artwork is not measured data. Require rights-cleared calibrated image datasets for quantitative measurement; allow explicit observed-view versus illustrative-only modes and expose unavailable measurements as such.

The two modes are independently qualified per experiment. Keep a model registry with valid units, domains, versions, provenance, uncertainty and expected error codes. The tutor is **optional** and never invents scientific numeric results, grade authority or student identity. First-party authored bilingual hints work without paid AI services.

## 7. Implementation architecture and local delivery

Recommended baseline: Next.js with TypeScript (accessible server-rendered website shell), a consistent component/design-token system, Node LTS, PostgreSQL local development, relational tenant-aware authorization and migrations, runtime contract validation, a versioned immutable content manifest, TypeScript browser-player shell, Playwright end-to-end and unit/contract tests. Use Prisma/Drizzle or SQL migrations deliberately; don't install several competing ORMs/frameworks. Document the actual choice and tradeoffs.

Start with design tokens, responsive semantics and URL routes, then build auth and role policies, content seed/editorial status, assignments, launch/session API, action revision state, submission and teacher reporting. Build a backend with genuine transactional idempotency. The prototype/test fixture can run in one local service, but must not rely on localStorage for scores, user roles or authorization. Use local synthetic identities, no real school children, no remote auth provider required for the first local build. Include scripts to initialize/reset demo fixtures safely, with no production secrets in the repository. Do not fake external API integrations.

Suggested routes: `/`, `/laboratories`, `/laboratories/chemistry`, `/laboratories/physics`, `/laboratories/biology`, `/experiments/[experimentId]`, `/player/[sessionId]`, `/student`, `/teacher`, `/teacher/classes/[classId]`, `/teacher/assignments`, `/teacher/reports`, `/admin`, `/content`, `/help`, `/sign-in`. These are design guidance, not excuses to create empty route stubs. Avoid public links to hidden internal/admin routes. Use actual testable destination for every visible link.

Required contracts: list/catalogue; experiment detail + validated availability; assignment create/update; six-mode launch; redeem grant; get session/checkpoint; submit typed action with idempotency and expected revision; submit attempt; teacher grade/reports; content versioning; bilingual locale bundle. Rejections must not mutate scientific state. Protected result read/export is scoped to the owning student/teacher/class/school. Prepare OpenAPI docs and JSON Schema fixtures matching or explicitly versioning research contracts.

## 8. Exact UX journeys to implement and test

### Public: from first visit to correct experiment

`Homepage → Explore laboratories → Chemistry/Physics/Biology → Search/filter → Experiment detail → Read objectives and source edition → Choose blue Simulation or green Experiment → School sign-in if required → Launch appropriate player.` Back/history must preserve the relevant search/filter state. No unauthorized content silently becomes accessible merely because a URL is known.

### Student guided mode

`Sign in → Assignments → Open Activity 2.3 → Simulation Mode → Guided step 1 → valid setup action → authoritative checkpoint → browser reload → Resume same revision → observation/assessment → Submit → See rubric feedback`. Student can use screen reader/equipment list as an equivalent to dragging; one visible pointer, no phantom cursor. Wrong port/reagent must reject with a helpful reason and no mutation.

### Student experiment mode

`Sign in → Activity 2.3 → Experiment Mode → Review admitted model scope → Make hypothesis → Set one supported variable → Run an admitted synthetic or reviewed model → Record trial → Compare with a control → Explain limitation → Submit`. No fake gas volume or uncontrolled free-text calculation.

### Teacher

`Teacher sign-in → Own school/class → Browse approved experiment → Assign version/modes/attempts/due date → Student completes and submits → Teacher sees exactly one result with rubric and evidence → Authorized export`. Cross-school and cross-tenant tests must fail safely.

### Admin/content

`Authorized admin → school-scoped roster/roles` and `Authorized editor → draft content → bilingual/science/rights review → approved publication manifest → teacher catalogue`, with clear placeholder status on work not yet approved. District/state views show permitted aggregates, not individual child records.

## 9. Accessibility, localization, security and government readiness

Aim for **WCAG 2.2 AA** as a product target plus applicable GIGW 3.0 review. Do not falsely claim certification. Provide semantic HTML, visible focus, usable 200% zoom/reflow, correct English/Telugu fonts and science symbols, understandable labels, contrast, captions and readable equivalents for important graphics. Same action/grade parity on keyboard and optional 2D DOM player; mouse, touch and switch use appropriate explicit controls. Respect reduced-motion preferences and avoid animated backgrounds that interrupt attention. Teal/blue/green palettes must pass contrast checks for text and affordances.

Use explicit role/tenant policy, server-side authorization on all APIs, CSRF where appropriate, cookie/session hardening, no credential exposure, security headers, rate limits and export audit. Preserve child privacy: synthetic test users until formal approval. The REA research notes DPDP phased implementation and required child-data/legal exceptions review; local development is not permission to process real student data. No third-party analytics trackers or ads. Keep optional tutor disabled by default until approved policy, regional data handling and cost caps exist.

For scalable future deployment, keep browser-native static assets separable from private APIs, immutable cache fingerprints, adjustable quality, 4 GB device target, 1.1/5/20 Mbps test profiles, and real p50/p95/p99 performance telemetry in controlled synthetic testing. A screenshot is not a performance benchmark. REA cost numbers are modeling scenarios, **not actual government pricing or guaranteed production capacity**.

## 10. Functional definition of done: do not report completion early

Required before your website-foundation milestone is marked ready:

- Exact canonical logo appears identically on homepage, catalogue, detail, student/teacher/admin sign-in and player header. Compare screenshot overlays; never independently rebuild it on each route.
- All visible CTAs perform meaningful routes/actions. No fake videos, decorative "download" buttons, impossible help menus or dead-end features.
- Homepage, subject hubs, catalogue, search, filters, detail and two-mode chooser work; each mode means what its name says. English and Telugu principal journeys are usable.
- Student/teacher/school-admin accounts use local synthetic fixtures and actually enforce role scopes.
- Teacher assignment changes persist to PostgreSQL with pinned curriculum/experiment/mode/version/attempt policy; learner sees only authorized assignments.
- Six (3 subjects × 2 modes) neutral launch flows, revisions, reload/resume, one valid/rejected action and exactly-once grade/report propagation are independently tested.
- Student/teacher report evidence is server-owned and linked to real submitted fixture attempt/rubric; no client-only grades.
- Keyboard and screen-reader lab-object alternatives work; no mouse-only graded action. Every error has a clear explanation. Buttons remain accessible at the chosen minimum view.
- Real desktop and narrow-screen browser screenshots are reviewed against all seven reference images. Visual QA catches overflow, blurry scientific labels, wrong mode colors, logo drift and irrelevant decorative elements.
- User-facing assertions about published science/curriculum are approved or explicitly marked under review. Real scientific engines remain correctly gated for the later specialist phase.
- Playwright end-to-end suites, unit/contract tests, axe checks and clean local build pass; final report includes actual commands and results. Failed tests must be reported, not hidden.
- Source is saved inside the owner-authorized local folder; `README.md`, `AGENTS.md`, `ARCHITECTURE.md`, `SETUP_LOCAL.md`, `LAB_INTEGRATION_CONTRACT.md`, `HANDOFF_TO_CODEX.md`, `UX_CONTROL_INVENTORY.md`, `FEATURE_TRACEABILITY_MATRIX.md`, `TESTING_REPORT.md`, and `.env.example` are complete.

The approved first phase is a **working premium website foundation**. No full scene graph or 40 experiments are expected yet; the science integration requires separate expert authorization. Do not use the lack of fully implemented 3D labs as an excuse to leave the website unfinished.

## 11. Source/feature traceability and AI-agent handoff

Produce a detailed `FEATURE_TRACEABILITY_MATRIX.md` mapping every relevant Labster-published feature in the REA to a **separately authored** G1 feature, source evidence class, current/future ownership, route, data contract, implementation status and test. Include: catalogue/course/skill discovery; missions/objectives; quizzes; assessments; hints/theory; checkpoints; resumption; assignments; due dates/attempts; learner reports; teacher class/course management; accessibility; versioned content; LMS integration proposal; admin aggregation; launch and scientific state; performance/caching; user support. Labster's true runtime, authenticated UI and benchmarks remain unknown.

`HANDOFF_TO_CODEX.md` must be self-contained and demonstrate how a new AI coding agent opens the same local folder, installs dependencies, runs the site/tests, inspects asset/manifest versions and creates a browser-lab module without rewriting the frontend or database. Include exact route/API schemas, payload examples, test credentials as **synthetic only**, error codes, traceability and a stage-2 backlog. Do not leave vague phrases like "integrate a 3D lab later" without contracts.

## 12. Visual-design and learning research that governs this project

- Nielsen Norman Group, *Progressive Disclosure*: https://www.nngroup.com/articles/progressive-disclosure/ — show frequently needed actions; defer advanced controls until relevant.
- Nielsen Norman Group, *Explicitly State Differences Between Options*: https://www.nngroup.com/articles/explicit-differences/ — guided vs independent choices need obvious textual differences, not color alone.
- University of Colorado PhET, *What is PhET?*: https://phet.colorado.edu/translation/920/about — productive inquiry relies on implicit guidance and limited meaningful controls.
- University of Colorado PhET, *Interface design and intuitive interaction*: https://phet.colorado.edu/publications/PhET_Interviews_II.pdf — if controls are confusing, learners focus on operating software rather than science.
- GOV.UK Design System, *Start using a service*: https://design-system.service.gov.uk/patterns/start-using-a-service/ — give users just enough information to know the task and start it.
- GOV.UK Design System, *Task list*: https://design-system.service.gov.uk/components/task-list/ — show true completion state and only necessary hints.
- W3C, *WCAG 2.2*: https://www.w3.org/TR/WCAG22/ — accessible focus, navigation, input targets, semantics, not color-only status.
- Government of India, *GIGW*: https://guidelines.india.gov.in/ — applicable public-facing government service design/security/accessibility review.

These sources inform independent original product design; no vendor layout, proprietary source or asset is to be copied. School-device and AP teacher testing remain mandatory for actual usability evidence.

## 13. Final delivery on the owner's computer

Present a verified localhost URL, exact Windows launch commands and a working site, a written skills installation ledger, approved canonical logo location, desktop/mobile screenshots for the above routes, automated test command/results, seeded synthetic accounts, critical route walkthrough and a **Codex-ready handoff**. Stop using "complete" as a label if a mandatory function is missing. Clearly distinguish shipped website features from approved-for-later scientific runtime features.

**Start by reading and reconciling the attached documents and all seven images. Then implement the website. No new design identity, no drift, no filler features.**
