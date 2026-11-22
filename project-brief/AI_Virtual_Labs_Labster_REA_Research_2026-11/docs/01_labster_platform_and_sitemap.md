# Labster public product surfaces

22 November 2026 IST. Access classes below apply to the observed source, not to the feature's internal implementation.

| Surface | What the evidence establishes | Class and source |
|---|---|---|
| Catalogue | Header links to support, login and demonstration. Main list offers a search field, Higher Education and High School entries, a discipline selector, reset and card links. Cards display title, short description, time and varying tags. Course, skill and concept are alternate discovery routes. The initial AX tree showed a zero count alongside cards, so it was unsuitable as an exact counter. | OBSERVED R-AX1. PUBLISHED R-CAT, R-COURSES |
| Public simulation detail | Demo listing exposes overview, course context, accessibility field, related content, demonstration links and a login/LMS FAQ. | OBSERVED R-AX2. PUBLISHED R-DEMO |
| Curriculum matching | Course suggestions and a textbook matching surface are public. Advanced/Elite plans describe human curriculum-mapping services. | PUBLISHED R-COURSES |
| Help, accessibility and support | Public help centre; keyboard and resizable-text guidance for supported simulations. Accessible-mode support varies by title, browser and generation. | PUBLISHED R-ACCESS, R-A11Y |
| Login and service boundary | Public header links to my.labster.com. Student onboarding describes institution LMS or Course Manager. Authenticated UI and provider-side services were inaccessible to this investigation. | OBSERVED R-AX1. PUBLISHED R-STU |
| Public marketing | Homepage/navigation link to pricing, customer support, guides, case studies, webinars, terms and security. Demo CTA requires following the vendor’s public demonstration process. | OBSERVED R-AX1, R-AX2 |
| Hosting inference | Public marketing, help centre, theory pages, login and partner LMS have distinguishable URL surfaces. Internal databases, runtime service boundaries, deployment model and access mechanisms are unknown. | INFERRED from R-AX1, R-STU, R-THEORY |

Public navigation tree: homepage → catalogue → search / level / discipline / course / concept / skill → simulation detail → demonstration/support or sign-in. Separately, help centre → student, instructor, simulation support, accessibility. Theory site → discipline → title-specific reading. Partner LMS or Course Manager → assignment → player → dashboard is vendor documented. Public listing metadata is separate from institutional entitlements.

| Published journey | Evidence a student or educator encounters | Independent product decision |
|---|---|---|
| Student via school | Instructor publishes assignment or supplies course entry. Learner enters simulation, completes missions/questions and may resume at a checkpoint. Grades sync through supported LMS connections, or appear in the Course Manager. [R-STU, R-SAVE, R-GRADE] | Begin with pseudonymous school enrollment. Expose all three hubs, assignment, mode chooser, explicit save status and student-controlled retry. |
| Instructor | In a course, select simulation, set publication, due date and allowed attempts, customize/apply supported quizzes, view outcomes or export. [R-COURSEMGR, R-QUIZ, R-INST] | Build a class-scoped report with mode and rubric versions, evidence provenance and reconciliation status. Freeze an assigned quiz version and retain prior attempts. |
| Institution admin | Admin-only dashboard for institutional adoption, participation and course activity. [R-ADMIN] | School admin can manage roster and course memberships. District/state obtain aggregated dashboards and approved exports with small-cell suppression. |
| Support | Help documentation recommends device checks and checkpoint recovery. [R-DEVICE, R-SAVE] | Device preflight, recoverable session status, reference code and accessible fallback built into the player shell. |

Public navigation observations describe a compact top menu and dense catalogue cards with thumbnail, title, brief and length. Responsive breakpoints, touch behavior, auth transitions, loading/error variants, proprietary quiz content, exact student and teacher UI and contractual APIs were not functionally tested. Use source links in the consolidated evidence register.
