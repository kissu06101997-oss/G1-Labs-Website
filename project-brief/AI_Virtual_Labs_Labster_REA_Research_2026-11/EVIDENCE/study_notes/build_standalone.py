"""Create the standalone Markdown handoff and consolidate research source ledgers."""
import csv
import json
import re
from pathlib import Path

root = Path(__file__).resolve().parents[2]
source_files = ("SOURCES_ROOT.csv", "SOURCES_LABSTER.csv", "SOURCES_AP.csv", "SOURCES_PLATFORM.csv")
headers = ("source_id", "url", "retrieved_ist", "classification", "description", "evidence_path", "confidence")
sources = []
for name in source_files:
    with (root / name).open(encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        assert tuple(reader.fieldnames) == headers, (name, reader.fieldnames)
        sources.extend(reader)
assert len({s["source_id"] for s in sources}) == len(sources)
with (root / "SOURCES_AND_EVIDENCE.csv").open("w", encoding="utf-8", newline="") as f:
    writer = csv.DictWriter(f, headers)
    writer.writeheader()
    writer.writerows(sources)

def read(path):
    return path.read_text(encoding="utf-8-sig").strip()

def depth(text, title=None):
    lines = text.splitlines()
    if title is not None:
        lines[0] = "# " + title
    fenced = False
    for idx, line in enumerate(lines):
        if line.startswith("```"):
            fenced = not fenced
        elif not fenced and line.startswith("#"):
            lines[idx] = "#" + line
    return "\n".join(lines)

master = read(root / "MASTER_BLUEPRINT.md")
master = master.replace("# MASTER BLUEPRINT", "# MASTER BLUEPRINT FULL", 1)
master = master.replace(" and [fully merged handoff](MASTER_BLUEPRINT_FULL.md)", "")
sections = [master, "## Full research chapters"]
intro = ("EXECUTIVE_DECISIONS.md", "RESEARCH_METHOD_AND_COVERAGE.md")
for name in intro:
    sections.append(depth(read(root / name)))
for n, path in enumerate(sorted((root / "docs").glob("*.md")), 1):
    text = read(path)
    text = re.sub(r"\]\(\.\./", "](", text)

    def local_doc(match):
        target = match.group(1)
        return f"](docs/{target})" if (path.parent / target).is_file() else match.group(0)
    text = re.sub(r"\]\(([A-Za-z0-9_-]+\.md)\)", local_doc, text)
    sections.append(depth(text))
    assert text.splitlines()[0].startswith("# "), path

sections.append("""## Appendix A — Contract files included in full

The content below is the proposed interface source. Relative JSON references are file-local in the packaged OpenAPI. Use the named schema code blocks or the separate identical files when writing implementation tests. Fixture identity, values and tokens are synthetic. The production backend, database and renderer are not deployed.""")
specs = root / "specs"
contracts = ("experiment_definition.schema.json", "lab_action.schema.json",
             "science_model_contract.schema.json", "science_models.json", "launch_and_event.schema.json",
             "example_activity_2_3.json", "example_physics_experiment.json", "example_biology_experiment.json",
             "runtime_examples.json", "website_lab_api.openapi.yaml", "database_schema.sql")
for name in contracts:
    text = read(specs / name)
    language = "sql" if name.endswith(".sql") else "json"
    if language == "json":
        text = json.dumps(json.loads(text), ensure_ascii=False, indent=2)
    sections.append(f"### {name}\n\n```{language}\n{text}\n```")

sections.append("## Appendix B — Delivery and acceptance tables")
for path in (specs / "screen_inventory.csv", specs / "implementation_backlog.csv", specs / "acceptance_tests.csv",
             specs / "activity_2_3_test_cases.csv", specs / "physics_science_test_cases.csv", specs / "biology_science_test_cases.csv",
             root / "TRACEABILITY_MATRIX.csv"):
    sections.append(f"### {path.name}\n\n```csv\n{read(path)}\n```")

sections.append("""## Appendix C — Primary source index

For catalogue listing IDs and raw datasets, use the ZIP's Catalogue CSV/JSON and evidence ledger. Core product decisions and the information necessary to begin the website milestone are contained above.""")
compact = [s for s in sources if not s["source_id"].startswith("LAB-CAT-ENTRY-") and (
    not s["source_id"].startswith("LAB-CAT-") or len(s["source_id"]) < 14
)]
for s in compact:
    sid, url = s["source_id"], s["url"]
    if sid.startswith("LAB-CAT-") and re.fullmatch(r"LAB-CAT-\d{3,}", sid):
        continue
    desc = s["description"].replace("\n", " ").strip()
    sections.append(f"- **{sid}** · {s['classification']} · {s['retrieved_ist']} · {desc}. [Source]({url})")
sections.append("""## Appendix D — Package contents and limits

The ZIP includes the master documents, all chapter source files, catalogue/subject CSVs, raw REA tool-control evidence, access evidence, accepted planning contracts, decision/register files, validations and checksums. MANIFEST.json holds every payload path, size, digest and status. SHA256SUMS covers the manifest and payload. The checksums file has no self-hash. Protected publisher material is outside the deliverable. The evidence ledger names the source URLs and bounded findings.

This single file does not inline every catalogue record, archive URL or textbook observation. Those are research data rather than implementation decisions. The authoritative technology path is a provisional Babylon.js WebGL2 website-first test, with changes based on measured evidence and procurement review.""")
(root / "MASTER_BLUEPRINT_FULL.md").write_text("\n\n".join(sections) + "\n", encoding="utf-8")
print(f"source_rows={len(sources)} standalone_bytes={(root/'MASTER_BLUEPRINT_FULL.md').stat().st_size} chapter_count={len(list((root/'docs').glob('*.md')))}")
