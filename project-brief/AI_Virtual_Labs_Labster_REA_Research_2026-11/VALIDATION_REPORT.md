# Research validation report

**22 November 2026 IST · Release 1.0**

## Outcome

Reference package assembled and verified. The research coverage gate is **partial** on access-dependent evidence. The website-first design is sufficiently specified for technical and owner review. A new implementation requires separate authorization. Portal URLs, candidate classifications and scope in this report are effective as of the research date.

| Check | Result | Scope |
|---|---|---|
| Labster catalogue | PASS within observed indexed pages | 311 unique cards, four pages. 312 known public detail routes including a separately recorded same-title candidate. 359 archived taxonomy routes. Exact current live sitemap URL set and title variations beyond known routes remain unverified. |
| Dossier evidence | PASS for published/observed distinction | 12 balanced desk cases, zero live Labster sessions. Disclosed default Node mismatch and absent Codex REA registration. Independent REA CLI control returned completed action and evidence. |
| Andhra Pradesh catalogue | PASS for source provenance; PARTIAL current editions | 340 candidates: Chemistry 120, Physics 130, Biology 90 across 13 historical/current official source volumes. 126 candidates trace to current content, 214 to prior editions. Four of ten current links yielded usable files; three first slices have prior official page references and require current-edition confirmation and Telugu review. |
| Equal subject architecture | PASS at design level | One separately reusable room, two configurations, science adapter, provenance, asset inventory, student/teacher journey, accessibility, performance and QA plan per subject. |
| Source and traceability | PASS for format, pointers and references | 455 source IDs, external URL syntax, localized evidence paths and 17 tracked requirements. Current source limits and dates retained. Liveness not rechecked for every catalogue source at release. |
| Schemas and examples | PASS static validation | Draft 2020-12 schemas validate three experiment examples, three model profiles and six runtime examples. Negative rejected-action fixture cannot include visual cues. OpenAPI 3.1 validates nine paths and local refs. pglast parses 35 PostgreSQL statements. No production API, migrations or database role-isolation behavior ran. |
| Arithmetic and costs | PASS bounded checks | Ideal reference ray and offset, symbolic Chemistry ledger arithmetic and Biology unit conversion reproduced. All nine low/base/high cost totals independently reconciled with reserve. No physical measurement, procurement quote or throughput promised. |
| Cold-read | PASS for specification handoff | Independent agent received only the standalone Markdown and eight questions. All answered. Adjusted C/S sequencing, neutral room manifests, 409 checkpoint derivation, explicit assignment locale/rubric pinning and class-scoped projection integrity. Rebased three merged paths. See [cold-read answers](EVIDENCE/study_notes/cold_read_handoff.md) and [corrections](EVIDENCE/study_notes/cold_read_contract_resolutions.md). |
| Executive PDF | PASS visual review | Two pages rendered and inspected, with header/footer, table card spacing and all subject/cost text visible. Renderer emitted a Symbol font fallback message with no missing characters observed in rendered pages. |
| Archive | PASS on packaged output | Relative ZIP paths; decompression, CRC and individual SHA-256 checks against manifest and checksums. Archive SHA-256 is supplied separately to avoid self-references. |

## Outstanding gates

- **Vendor evidence:** written access and test scopes required for gameplay, private workflows, source/runtime inspection and benchmarks. Twelve desk cases remain PUBLISHED. Comparative claims stop at the published or public surface bounds.
- **Current curriculum:** AP/SCERT owner confirms exact current books and activity pages, grade scope (including out-of-corpus workbooks/upper-secondary if required) and Telugu parity. Some public files were unavailable and OCR screening does not establish every printed activity.
- **Science:** Chemistry observed outcomes and real stock review, calibrated Physics apparatus, and a rights-cleared, measured Biology image stack all need independent evidence and approval. Typed fixtures are research examples.
- **School performance/operation:** actual 4/8/16 GB device, accessibility, WAN, school pilot, authority/consent/legal retention/privacy, provider capacity, pricing and support requirements remain open.
- **Implementation:** website-first neutral player and all executable tests are future work. Runtime/PDF control and research verification ran outside the existing Unreal and Virtual Labs source projects.

## Reproduction

Use Python 3.14 or compatible Python, jsonschema, PyYAML, openapi-spec-validator 0.9.0 and pglast 8.9 for research verification. The test tools were installed in a separate temporary dependency directory. From the package root, run `python EVIDENCE/study_notes/validate_and_package.py` to reproduce static validation. Add `--package` only when intentionally writing a new release ZIP in a clean parent directory. The executive PDF generation and REA control script are separate. No school application tests were required in this research-only assignment.
