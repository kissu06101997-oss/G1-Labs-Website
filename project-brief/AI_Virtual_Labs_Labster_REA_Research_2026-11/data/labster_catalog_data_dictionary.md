# Labster catalogue data dictionary

Each row represents one card in the observed official catalogue. JSON preserves field types. CSV serializes list members using space, vertical bar, space and represents a true empty list as []. CSV uses the literal null for unknown or unavailable. A false accessibility value means the publisher explicitly printed No for its named mode on that detail route.

| Field or group | Interpretation |
| --- | --- |
| research_id | LS- followed by the uppercase slug from the observed official detail link. Stable for this snapshot. Preserve identity aliases when reconciling a future slug change. |
| canonical_url / public_title | Actual official page destination from the indexed catalogue anchor and the visible card title. Canonical within this research table. |
| vendor_subject_tags | Non-exclusive discipline tags on the card. Empty means visibly unlabelled. |
| vendor_course_matches | Course names from the visible publisher detail list. Null means the review did not establish a recognized visible match. |
| education_levels / detail_education_levels | Separately observed card and detail labels. An empty detail list represents a published no-items message. Grade suitability still requires AP curriculum review. |
| duration_min / duration_evidence / detail_duration_min | Integer estimate published by vendor and display source. No time was measured by an investigator. |
| language_options / vendor_accessibility_mode | Recognized language labels and publisher mode declaration from official detail. No accessibility conformance finding follows from these values. |
| subtopic / subtopic_evidence | Bibliographic topic from title, or editorial paraphrase for a documented example. |
| published_summary_ref / published_objectives_ref | Official detail source of the respective content. Full publisher text is referenced at its source. |
| published_summary_paraphrase / published_objectives_count | Original neutral summary for the curated set of twelve, and count of public objective bullets when their boundaries were visible. |
| published_nonoperational_technique_labels | Limited extraction of general technique names from detail headings. Empty means no reviewed label matched the technique vocabulary. Null means the indexed view did not include the relevant heading. |
| reported_* | Fields for relevant published inputs, equipment, goals, observations, pedagogy and control information. Null means no specific claim is carried in this row. |
| play_status | Experience was NOT_TESTED by the catalogue investigator. |
| media_reference / media_rights | Publisher listing containing references to its preview media. No media assets are included in the catalogue package. |
| our_candidate_subject / our_possible_reuse / our_estimated_complexity / our_science_risk | Independent concepts only. Complexity and risk are ordinal preliminary assessments, pending a full prototype specification. |
| ap_curriculum_crosswalk_status | Status of mapping to Andhra Pradesh official materials. Case examples suggest concepts pending the edition and activity mapping. |
| evidence_class / field_group_confidence | Publisher source class and confidence boundary. Original product decisions stay proposed. |
| catalog_page_source_id / detail_source_id / catalog_page_url | References into the source ledger and exact page observation identity. |
| catalog_page / catalog_position | One-based page and ordinal card position in the observed indexed partition. |
| retrieved_ist / detail_index_age_at_review | IST research date and relative timestamp text from the indexed view. Exact crawler times are unavailable for most detail pages. |
| known_unknowns | Specific interpretation boundary. |

The alternate-route CSV preserves independently observed same-title routes and their metadata differences. The taxonomy CSV preserves published index URLs by historical route type. It is an archive inventory, without a claim of present-day availability for each route.
