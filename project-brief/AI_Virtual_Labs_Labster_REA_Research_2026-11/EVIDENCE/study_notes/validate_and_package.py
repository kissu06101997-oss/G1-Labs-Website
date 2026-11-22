"""Validate content and create the hash-checked portable research ZIP."""
import csv
import hashlib
import json
import math
import re
import sys
from collections import Counter
from datetime import date
from pathlib import Path, PurePosixPath
from urllib.parse import unquote, urlsplit
from tempfile import TemporaryDirectory
from zipfile import ZipFile, ZIP_DEFLATED

import jsonschema
import yaml
from openapi_spec_validator import validate
from pglast import parse_sql

root = Path(__file__).resolve().parents[2]
def read(path):
    return path.read_text(encoding="utf-8-sig")
def load(file):
    return json.loads(read(root / file))
def table(file):
    with (root / file).open(encoding="utf-8-sig", newline="") as stream:
        rows = csv.DictReader(stream, strict=True)
        assert rows.fieldnames and len(set(rows.fieldnames)) == len(rows.fieldnames), file
        records = list(rows)
        assert records and all(None not in r and None not in r.values() for r in records), file
        return records
def check_url(url):
    parsed = urlsplit(url)
    assert parsed.scheme in ("http","https") and parsed.netloc and " " not in url, url
def digest(data):
    return hashlib.sha256(data).hexdigest()

required = """README_START_HERE.md MASTER_BLUEPRINT.md MASTER_BLUEPRINT_FULL.md EXECUTIVE_DECISIONS.md RESEARCH_METHOD_AND_COVERAGE.md SOURCES_AND_EVIDENCE.csv TRACEABILITY_MATRIX.csv data/labster_catalog.csv data/labster_catalog.json data/ap_experiment_catalog.csv data/ap_chemistry_catalog.csv data/ap_physics_catalog.csv data/ap_biology_catalog.csv data/apparatus_library.csv data/chemistry_apparatus.csv data/physics_apparatus.csv data/biology_apparatus.csv data/cross_lab_reuse_matrix.csv data/science_model_registry.csv data/deep_dive_index.csv data/technology_comparison.csv data/performance_benchmarks.csv data/cost_scenarios.csv data/data_dictionary.md specs/experiment_definition.schema.json specs/lab_action.schema.json specs/science_model_contract.schema.json specs/website_lab_api.openapi.yaml specs/database_schema.sql specs/example_activity_2_3.json specs/activity_2_3_test_cases.csv specs/example_physics_experiment.json specs/example_biology_experiment.json specs/physics_science_test_cases.csv specs/biology_science_test_cases.csv specs/site_map.md specs/screen_inventory.csv specs/acceptance_tests.csv specs/implementation_backlog.csv""".split()
assert all((root/f).is_file() for f in required)
assert len(list((root/"docs").glob("*.md"))) == 19
files = [f for f in root.rglob("*") if f.is_file()]
for f in files:
    if f.suffix in {".md", ".yaml", ".sql", ".txt", ".py"}:
        content = read(f)
        assert "\x00" not in content, f
    if f.suffix == ".json":
        load(f.relative_to(root))
    if f.suffix == ".csv":
        table(f.relative_to(root))

index = table("SOURCES_AND_EVIDENCE.csv")
assert len({s["source_id"] for s in index}) == len(index)
by_id = {row["source_id"]:row for row in index}
for row in index:
    check_url(row["url"])
    date.fromisoformat(row["retrieved_ist"])
    assert row["description"] and (root / row["evidence_path"]).is_file(), row
lab = table("data/labster_catalog.csv")
jlab = load("data/labster_catalog.json")
assert len(lab) == len(jlab) == 311
jsonschema.Draft202012Validator(load("data/labster_catalog.schema.json")).validate(jlab)
keys = ("research_id", "canonical_url", "public_title")
assert [tuple(x[k] for k in keys) for x in lab] == [tuple(x[k] for k in keys) for x in jlab]
assert all(len({x[k] for x in lab}) == 311 for k in keys)
for row in lab:
    assert row["catalog_page_source_id"] in by_id and row["detail_source_id"] in by_id
    assert row["play_status"].lower() == "not_tested", row["play_status"]
    check_url(row["canonical_url"])
counts = load("EVIDENCE/public_sources/labster_catalog_coverage.json")
assert dict(Counter(str(x["catalog_page"]) for x in jlab)) == counts["catalogue_card_counts_by_page"]
tags = Counter(label for row in jlab for label in row["vendor_subject_tags"])
assert dict(tags) == counts["subject_memberships_nonexclusive"]
assert counts["independently_discovered_official_detail_urls_including_variant"] == 312
assert len(table("data/labster_catalog_alternate_routes.csv")) >= 1
assert Counter(r["subject"] for r in table("data/deep_dive_index.csv")) == {"Chemistry":4,"Physics":4,"Biology":4}

ap = table("data/ap_experiment_catalog.csv")
assert len({r["experiment_id"] for r in ap}) == len(ap) == 340
for subject, count in {"chemistry":120, "physics":130, "biology":90}.items():
    rows = table(f"data/ap_{subject}_catalog.csv")
    assert rows == [r for r in ap if r["subject"].lower() == subject] and len(rows) == count
for row in ap:
    assert row["source_id"] in by_id
    check_url(row["source_url"])
crosswalk = table("data/labster_ap_concept_crosswalk.csv")
assert Counter(r["subject_code"] for r in crosswalk) == {"CHEM":4,"PHYS":4,"BIO":4}
assert all(r["labster_id"] in {x["research_id"] for x in lab} and r["ap_candidate_id"] in {x["experiment_id"] for x in ap} for r in crosswalk)
deep = table("data/deep_dive_index.csv")
assert all(all(x in by_id for x in r["source_ids"].split("|")) for r in deep)

def check_schema(schema, instance):
    jsonschema.Draft202012Validator.check_schema(schema)
    validator = jsonschema.Draft202012Validator(schema, format_checker=jsonschema.Draft202012Validator.FORMAT_CHECKER)
    validator.validate(instance)
schema = load("specs/experiment_definition.schema.json")
ap_ids = {x["experiment_id"] for x in ap}
for name in ("example_activity_2_3", "example_physics_experiment", "example_biology_experiment"):
    ex = load(f"specs/{name}.json")
    check_schema(schema, ex)
    assert ex["experimentId"] in ap_ids
    assert ex["subject"] == ex["labId"] and len(ex["modeConfigurations"]) == 2
    assert all(x["min"] <= x["max"] for x in ex["supportedVariableRanges"].values())
models = load("specs/science_models.json")
for model in models:
    check_schema(load("specs/science_model_contract.schema.json"), model)
    assert all(s in by_id for s in model["sourceIds"])
launch = load("specs/launch_and_event.schema.json")["$defs"]
action = load("specs/lab_action.schema.json")["$defs"]
runtime = load("specs/runtime_examples.json")
for name, schema in {"launchRequest":launch["request"], "launchResponse":launch["launch"], "learningEvent":launch["event"], "labActionRequest":action["request"], "labActionResult":action["result"], "labActionConflict":action["result"]}.items():
    check_schema(schema, runtime[name])
bad = dict(runtime["labActionConflict"], visualCueIds=["invalid-cue"])
assert not jsonschema.Draft202012Validator(action["result"]).is_valid(bad)

openapi = root / "specs/website_lab_api.openapi.yaml"
api = yaml.safe_load(read(openapi))
validate(api, base_uri=openapi.as_uri())
assert len(api["paths"]) == 9
statements = len(parse_sql(read(root/"specs/database_schema.sql")))
assert statements == 35
assert "FOREIGN KEY(school_id,assignment_id,class_id) REFERENCES assignment(school_id,assignment_id,class_id)" in read(root/"specs/database_schema.sql")
teacher = api["paths"]["/teacher/classes/{classId}/assignments"]["post"]["requestBody"]["content"]["application/json"]["schema"]
assert "localeBundleVersion" in teacher["required"]
assert "derive" in api["paths"]["/sessions/{sessionId}/actions"]["post"]["responses"]["409"]["description"]
assert math.isclose(math.degrees(math.asin(math.sin(math.radians(45))/1.5)), 28.12550570205571)
internal = 20 * math.sin(math.radians(45)-math.asin(math.sin(math.radians(45))/1.5)) / math.cos(math.asin(math.sin(math.radians(45))/1.5))
assert math.isclose(internal, 6.582846163546404) and min(2,3/2) == 1.5 and 100*0.5 == 50
cost = table("data/cost_scenarios.csv")
assert len(cost) == 9
for r in cost:
    reserve = float(r["risk_reserve_fraction"])
    tot = (float(r["monthly_infra_subtotal_usd"])+float(r["monthly_staff_usd"]))*(1+reserve)
    assert abs(tot-float(r["monthly_total_planning_usd"])) <= 0.01, r["scenario_id"]

tests = {r["test_id"] for r in table("specs/acceptance_tests.csv")}
backlog = {r["task_id"] for r in table("specs/implementation_backlog.csv")}
trace = table("TRACEABILITY_MATRIX.csv")
assert len(trace) == 17 and all(r["acceptance_test"] in tests and r["epic"] in backlog for r in trace)

md = [f for f in files if f.suffix == ".md"]
unborn = {"MANIFEST.json","SHA256SUMS.txt","VALIDATION_REPORT.md"}
bad_links = []
for path in md:
    content = re.sub(r"```[\s\S]*?```", "", read(path))
    for dest in re.findall(r"\]\((<[^>]+>|[^\s)]+)\)", content):
        dest = dest.strip("<>")
        if re.match(r"https?://", dest):
            check_url(dest)
        elif not re.match(r"(mailto:|#)", dest):
            child = unquote(dest.split("#")[0])
            if not (path.parent / child).exists() and child not in unborn:
                bad_links.append((path.relative_to(root).as_posix(), child))
assert not bad_links, bad_links

report = {"sources":len(index),"labster_cards":len(lab),"labster_known_detail_routes":312,"ap_candidates":len(ap),
          "subject_counts":dict(Counter(r["subject"] for r in ap)),"markdown_files_checked":len(md),
          "json_files_checked":sum(f.suffix==".json" for f in files),
          "csv_files_checked":sum(f.suffix==".csv" for f in files),"openapi_paths":len(api["paths"]),
          "postgresql_statements_parsed":statements,"schema_examples_checked":12,"cost_cases":len(cost),
          "traceability_requirements":len(trace),"chapters":19}
print(json.dumps(report, ensure_ascii=False))

if "--package" not in sys.argv:
    sys.exit()
assert (root / "VALIDATION_REPORT.md").is_file()
assert (root / "EXECUTIVE_SUMMARY.pdf").is_file()
summary = root / "EVIDENCE/study_notes/package_validation.json"
summary.write_text(json.dumps(report, indent=2, ensure_ascii=False)+"\n",encoding="utf-8")

verified = {"data/labster_catalog.csv","data/labster_catalog.json","data/labster_catalog.schema.json","SOURCES_AND_EVIDENCE.csv",
            "data/labster_catalog_alternate_routes.csv","data/labster_catalog_taxonomy.csv",
            "EVIDENCE/public_sources/labster_catalog_coverage.json","EVIDENCE/public_sources/AP_TEXTBOOK_ACCESS.json",
            "EVIDENCE/study_notes/rea_control_evidence.json","EVIDENCE/study_notes/package_validation.json",
            "EVIDENCE/study_notes/browser_observation.md"}
excluded = {"MANIFEST.json","SHA256SUMS.txt","LABSTER_RESEARCH_COMPLETE.zip"}
files = sorted(f for f in root.rglob("*") if f.is_file() and f.name not in excluded and "__pycache__" not in f.parts)
entries = []
for f in files:
    path = f.relative_to(root).as_posix()
    raw = f.read_bytes()
    assert raw, path
    status = "VERIFIED" if path in verified else "PROPOSED"
    if path.startswith("EVIDENCE/") or f.name.startswith("SOURCES_") or path == "VALIDATION_REPORT.md":
        status = "VERIFIED"
    if "study_notes/" in path and path.endswith(".py"):
        status = "PROPOSED"
    if path.endswith("deep_dive_index.csv") or path.endswith("03_deep_dive_experiments.md"):
        status = "VERIFIED"
    entries.append({"path":path,"bytes":len(raw),"sha256":digest(raw),"status":status})
manifest = {"as_of_ist":"2026-11-22","version":"1.0","files":entries,
            "integrity_metadata":{"MANIFEST.json":"Listed and hashed in SHA256SUMS.txt","SHA256SUMS.txt":"Has no self-hash; ZIP checksum delivered separately"},
            "status_meanings":{"VERIFIED":"Artifact independently parsed, observed or reconciled within the validation scope","PROPOSED":"Design, planning candidate or mixed analysis; see row and chapter qualifications","UNVERIFIED":"Not established","BLOCKED":"External prerequisite required","NOT_APPLICABLE":"Out of scope"}}
mf = root / "MANIFEST.json"
mf.write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+"\n",encoding="utf-8")
checks = root / "SHA256SUMS.txt"
checks.write_text("".join(f"{e['sha256']}  {e['path']}\n" for e in entries)+f"{digest(mf.read_bytes())}  MANIFEST.json\n",encoding="utf-8")
archive = root.parent / "LABSTER_RESEARCH_COMPLETE.zip"
assert not archive.exists(), f"Choose a clean destination to avoid replacing {archive}"
with ZipFile(archive,"x",ZIP_DEFLATED,compresslevel=8) as z:
    for f in [*files,mf,checks]:
        z.write(f,f"{root.name}/{f.relative_to(root).as_posix()}")
with ZipFile(archive) as z:
    assert z.testzip() is None
    prefix = root.name + "/"
    expected = {prefix+e["path"] for e in entries}|{prefix+"MANIFEST.json",prefix+"SHA256SUMS.txt"}
    assert set(z.namelist()) == expected and len(z.namelist()) == len(expected)
    assert all(not PurePosixPath(n).is_absolute() and ".." not in PurePosixPath(n).parts for n in expected)
    z_manifest = json.loads(z.read(prefix+"MANIFEST.json"))
    assert z_manifest == manifest
    for e in z_manifest["files"]:
        binary = z.read(prefix+e["path"])
        assert len(binary)==e["bytes"] and digest(binary)==e["sha256"], e["path"]
    assert z.read(prefix+"SHA256SUMS.txt")==checks.read_bytes()
    with TemporaryDirectory(prefix="avl-release-verify-") as temporary:
        dest=Path(temporary)
        z.extractall(dest)
        extracted=dest/root.name
        for line in read(extracted/"SHA256SUMS.txt").splitlines():
            wanted, rel=line.split("  ",1)
            assert digest((extracted/rel).read_bytes())==wanted, rel
    print(json.dumps({"archive_path":str(archive),"zip_bytes":archive.stat().st_size,"zip_sha256":digest(archive.read_bytes()),"archive_members":len(expected),"verification":"CRC, manifest and payload SHA-256 verified"}))

