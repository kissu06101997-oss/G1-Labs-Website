"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, RotateCcw, Search } from "lucide-react";
import { EducationStageRail } from "./EducationStageRail";
import {
  EDUCATION_STAGES,
  formatStageLabel,
  getEducationStageByGrade,
} from "@/lib/education-stages";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";
import type { CatalogItem, LabSubject, Locale } from "@/lib/types";

interface CatalogueViewProps {
  items: CatalogItem[];
  locale: Locale;
  initialSubject: string;
  initialGrade: string;
  initialQuery: string;
  initialAvailability?: string;
  lockedSubject?: LabSubject;
}

export function CatalogueView({
  items,
  locale,
  initialSubject,
  initialGrade,
  initialQuery,
  initialAvailability = "all",
  lockedSubject,
}: CatalogueViewProps) {
  const router = useRouter();
  const dict = getDictionary(locale);
  const isTe = locale === "te-IN";
  const [isPending, startTransition] = useTransition();

  const [subject, setSubject] = useState(lockedSubject ?? initialSubject);
  const [grade, setGrade] = useState(initialGrade);
  const [queryText, setQueryText] = useState(initialQuery);
  const [availability, setAvailability] = useState(initialAvailability);

  function pushFilters(
    nextSubject: string,
    nextGrade: string,
    nextQuery: string,
    nextAvailability = availability
  ) {
    const params = new URLSearchParams();
    if (!lockedSubject && nextSubject) params.set("subject", nextSubject);
    if (nextGrade) params.set("grade", nextGrade);
    if (nextQuery.trim()) params.set("q", nextQuery.trim());
    if (nextAvailability && nextAvailability !== "all") {
      params.set("availability", nextAvailability);
    }

    const base = lockedSubject ? `/laboratories/${lockedSubject}` : "/laboratories";
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${base}?${qs}` : base);
    });
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    pushFilters(subject, grade, queryText, availability);
  }

  function handleReset() {
    setSubject(lockedSubject ?? "");
    setGrade("");
    setQueryText("");
    setAvailability("all");
    pushFilters(lockedSubject ?? "", "", "", "all");
  }

  const filteredItems = items.filter((item) => {
    if (availability === "launchable") return item.publicationStatus !== "review_pending";
    if (availability === "review_pending") return item.publicationStatus === "review_pending";
    return true;
  });

  const selectedGradeNum = grade ? Number(grade) : null;
  const activeStage = getEducationStageByGrade(selectedGradeNum);
  const launchableCount = filteredItems.filter(
    (i) => i.publicationStatus !== "review_pending"
  ).length;
  const reviewPendingCount = filteredItems.filter(
    (i) => i.publicationStatus === "review_pending"
  ).length;

  // W08: Balanced 2-column grid when a hub or filter result has exactly 2 cards!
  const gridColsClass =
    filteredItems.length === 2
      ? "grid-cols-1 md:grid-cols-2"
      : lockedSubject
        ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  return (
    <div className="mt-5 space-y-6">
      {/* 7-Stage Raised Dimensional Education Stage Rail */}
      <EducationStageRail
        locale={locale}
        selectedGrade={selectedGradeNum}
        showAllOption
        onSelectGrade={(nextGrade) => {
          const val = nextGrade === null ? "" : String(nextGrade);
          setGrade(val);
          pushFilters(subject, val, queryText, availability);
        }}
      />

      {/* Active Stage Info Banner when one of the 7 stages is selected */}
      {activeStage && (
        <div
          data-testid="selected-stage-status-banner"
          className={`flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-xs ${
            activeStage.availability === "available"
              ? "border-[#bfe7d5] bg-[#eefaf4] text-[#046c49]"
              : activeStage.availability === "preview_only"
                ? "border-[#c6e2f7] bg-[#eff7fe] text-[#0663ab]"
                : "border-[#f3dba8] bg-[#fff9eb] text-[#805100]"
          }`}
        >
          <div>
            <strong className="text-sm">
              {isTe ? activeStage.labelTe : activeStage.labelEn} ·{" "}
              {isTe ? activeStage.boardBandTe : activeStage.boardBandEn}
            </strong>
            <p className="mt-0.5 font-medium">
              {isTe ? activeStage.subjectStructureTe : activeStage.subjectStructureEn} —{" "}
              {isTe ? activeStage.statusNoteTe : activeStage.statusNoteEn}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setGrade("");
              pushFilters(subject, "", queryText, availability);
            }}
            className="rounded-xl border border-current/30 bg-white/80 px-3 py-1.5 text-xs font-extrabold hover:bg-white"
          >
            {isTe ? "అన్ని 7 స్థాయిలను చూపించు" : "Show all 7 stages"}
          </button>
        </div>
      )}

      {/* Search & Filter Toolbar matching 02_Catalogue_All_7_Classes.png */}
      <form
        onSubmit={handleSearchSubmit}
        role="search"
        aria-label={isTe ? "ప్రయోగాల శోధన" : "Search experiments"}
        className="g1-card flex flex-wrap items-center gap-3 p-3.5"
      >
        <div className="relative min-w-[220px] flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5a7288]"
            aria-hidden="true"
          />
          <label htmlFor="catalogue-search" className="sr-only">
            {dict.catalogue.searchPlaceholder}
          </label>
          <input
            id="catalogue-search"
            type="search"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            placeholder={dict.catalogue.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-[#7894aa] bg-[#f8fcff] pl-10 pr-4 text-sm text-[#0c2444] placeholder:text-[#5a7288]"
            data-testid="catalogue-search-input"
          />
        </div>

        {!lockedSubject && (
          <div className="flex items-center gap-2">
            <label htmlFor="subject-filter" className="text-xs font-bold text-[#38546c]">
              {dict.catalogue.subjectLabel}:
            </label>
            <select
              id="subject-filter"
              value={subject}
              onChange={(e) => {
                const v = e.target.value;
                setSubject(v);
                pushFilters(v, grade, queryText, availability);
              }}
              className="h-11 rounded-xl border border-[#7894aa] bg-white px-3 text-sm font-semibold text-[#0c2444]"
              data-testid="catalogue-subject-select"
            >
              <option value="">{dict.catalogue.all}</option>
              <option value="chemistry">{dict.subjects.chemistry.name}</option>
              <option value="physics">{dict.subjects.physics.name}</option>
              <option value="biology">{dict.subjects.biology.name}</option>
            </select>
          </div>
        )}

        <div className="flex items-center gap-2">
          <label htmlFor="catalogue-grade" className="text-xs font-bold text-[#38546c]">
            {dict.catalogue.classLabel}:
          </label>
          <select
            id="catalogue-grade"
            value={grade}
            onChange={(e) => {
              const v = e.target.value;
              setGrade(v);
              pushFilters(subject, v, queryText, availability);
            }}
            className="h-11 rounded-xl border border-[#7894aa] bg-white px-3 text-sm font-semibold text-[#0c2444]"
            data-testid="catalogue-grade-select"
          >
            <option value="">{dict.catalogue.all}</option>
            {EDUCATION_STAGES.map((st) => (
              <option key={st.id} value={String(st.grade)}>
                {isTe ? st.labelTe : st.labelEn}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="catalogue-availability" className="text-xs font-bold text-[#38546c]">
            {isTe ? "లభ్యత:" : "Availability:"}
          </label>
          <select
            id="catalogue-availability"
            value={availability}
            onChange={(e) => {
              const v = e.target.value;
              setAvailability(v);
              pushFilters(subject, grade, queryText, v);
            }}
            className="h-11 rounded-xl border border-[#7894aa] bg-white px-3 text-sm font-semibold text-[#0c2444]"
            data-testid="catalogue-availability-select"
          >
            <option value="all">{dict.catalogue.all}</option>
            <option value="launchable">
              {isTe ? "ప్రారంభించగల ప్రయోగాలు" : "Available neutral activities"}
            </option>
            <option value="review_pending">
              {isTe ? "సమీక్ష-పెండింగ్ ప్రివ్యూలు" : "Review-pending previews"}
            </option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="g1-btn g1-btn-teal min-h-[44px] px-5 text-sm"
          data-testid="catalogue-search-submit"
        >
          {isTe ? "వెతుకు" : "Apply"}
        </button>

        {(grade || queryText || availability !== "all" || (!lockedSubject && subject)) && (
          <button
            type="button"
            onClick={handleReset}
            className="g1-btn g1-btn-outline min-h-[44px] px-3.5 text-xs"
            data-testid="catalogue-reset-btn"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{dict.catalogue.resetFilters}</span>
          </button>
        )}
      </form>

      {/* Main Catalogue Workspace: Refine Left Rail (on main /laboratories) + Cards Grid */}
      <div
        className={
          lockedSubject
            ? "space-y-4"
            : "grid grid-cols-1 gap-6 lg:grid-cols-12"
        }
      >
        {!lockedSubject && (
          <aside
            aria-label={isTe ? "శోధన ఫిల్టర్లు" : "Refine your search"}
            className="g1-card h-fit p-5 lg:col-span-3"
          >
            <h2 className="text-base font-extrabold text-[#0c2444]">
              {isTe ? "శోధనను మెరుగుపరచండి" : "Refine your search"}
            </h2>

            <div className="mt-5">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#5a7288]">
                {isTe ? "సబ్జెక్టులు" : "SUBJECTS"}
              </div>
              <div className="mt-2 space-y-1">
                {(["", "chemistry", "physics", "biology"] as const).map((subjOpt) => {
                  const active = subject === subjOpt;
                  const label =
                    subjOpt === ""
                      ? isTe
                        ? "అన్ని సబ్జెక్టులు"
                        : "All subjects"
                      : dict.subjects[subjOpt].name;
                  return (
                    <button
                      key={subjOpt || "all"}
                      type="button"
                      onClick={() => {
                        setSubject(subjOpt);
                        pushFilters(subjOpt, grade, queryText, availability);
                      }}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${
                        active
                          ? "bg-[#e8f6f6] text-[#007875]"
                          : "text-[#38546c] hover:bg-[#f2f8fc]"
                      }`}
                    >
                      <span aria-hidden="true">{active ? "✓" : "○"}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <div className="text-[11px] font-extrabold uppercase tracking-[0.1em] text-[#5a7288]">
                {isTe ? "ప్రచురణ స్థితి" : "PUBLICATION STATUS"}
              </div>
              <div className="mt-2 space-y-1">
                {(
                  [
                    ["all", isTe ? "అన్నీ చూపించు" : "All listings"],
                    ["launchable", isTe ? "ప్రారంభించగల ప్రయోగాలు" : "Available neutral activities"],
                    ["review_pending", isTe ? "సమీక్ష-పెండింగ్ ప్రివ్యూలు" : "Review-pending previews"],
                  ] as const
                ).map(([val, label]) => {
                  const active = availability === val;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        setAvailability(val);
                        pushFilters(subject, grade, queryText, val);
                      }}
                      aria-pressed={active}
                      className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-bold transition-colors ${
                        active
                          ? "bg-[#e8f6f6] text-[#007875]"
                          : "text-[#38546c] hover:bg-[#f2f8fc]"
                      }`}
                    >
                      <span aria-hidden="true">{active ? "✓" : "○"}</span>
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

        <div className={lockedSubject ? "" : "lg:col-span-9"}>
          {/* Section header + live result announcement */}
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#0c2444]">
                {lockedSubject
                  ? isTe
                    ? `${dict.subjects[lockedSubject].name} ప్రయోగాలు`
                    : `${dict.subjects[lockedSubject].name} practicals`
                  : dict.catalogue.availableHeading}
              </h2>
              <p
                aria-live="polite"
                className="mt-0.5 text-xs font-semibold text-[#4b637a]"
                data-testid="catalogue-result-count"
              >
                {isTe
                  ? `${filteredItems.length} ప్రయోగాలు చూపబడుతున్నాయి (${launchableCount} ప్రారంభించగలవి · ${reviewPendingCount} సమీక్ష-పెండింగ్)`
                  : `Showing ${filteredItems.length} practical${filteredItems.length === 1 ? "" : "s"} (${launchableCount} launchable neutral · ${reviewPendingCount} review-pending)`}
              </p>
            </div>
            <span className="text-xs text-[#5a7288]">{dict.catalogue.statusNote}</span>
          </div>

          {filteredItems.length === 0 ? (
            <div
              className="g1-card p-8 text-center"
              data-testid="catalogue-empty-state"
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff4d7] text-[#805100]">
                <Clock className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mt-3 text-lg font-extrabold text-[#0c2444]">
                {activeStage
                  ? isTe
                    ? `${activeStage.labelTe} ప్రయోగాలు సమీక్షలో ఉన్నాయి`
                    : `${activeStage.labelEn} practicals are under curriculum review`
                  : dict.catalogue.emptyTitle}
              </h3>
              <p className="mx-auto mt-1.5 max-w-lg text-sm text-[#4b637a]">
                {activeStage
                  ? isTe
                    ? activeStage.statusNoteTe
                    : activeStage.statusNoteEn
                  : dict.catalogue.emptyDesc}
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="g1-btn g1-btn-teal"
                >
                  {dict.catalogue.resetFilters}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setGrade("10");
                    pushFilters(subject, "10", "", "all");
                  }}
                  className="g1-btn g1-btn-outline"
                >
                  {isTe ? "10వ తరగతి ప్రయోగాలు చూడండి" : "Explore Class 10 labs"}
                </button>
              </div>
            </div>
          ) : (
            <div className={`grid gap-5 ${gridColsClass}`}>
              {filteredItems.map((exp) => {
                const copy = getExperimentCopy(exp.experimentId, locale);
                const subjName = dict.subjects[exp.subject].name;
                const stageLabel = formatStageLabel(exp.grade, locale, true);
                const isPendingReview = exp.publicationStatus === "review_pending";

                return (
                  <article
                    key={exp.experimentId}
                    className="g1-card flex flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
                    data-testid={`catalogue-card-${exp.experimentId}`}
                  >
                    {/* Clean 16:9 media frame with honest source qualifier */}
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#e7f4f8]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={copy.thumbPath}
                        alt={`${copy.shortTitle} — ${copy.mediaQualifier}`}
                        className={`h-full w-full ${
                          isPendingReview ? "object-contain p-4 mix-blend-multiply" : "object-cover"
                        }`}
                      />
                      <span className="absolute bottom-2 left-2 rounded-lg bg-white/90 px-2 py-0.5 text-[10px] font-bold text-[#2b4c66] backdrop-blur-xs">
                        {copy.mediaQualifier}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`g1-tag ${
                            exp.subject === "biology" ? "g1-tag-green" : "g1-tag-blue"
                          }`}
                        >
                          {subjName.toUpperCase()} · {stageLabel.toUpperCase()}
                        </span>
                      </div>

                      <h3 className="mt-3 text-lg font-extrabold leading-snug text-[#0c2444]">
                        {copy.shortTitle}
                      </h3>
                      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-[#4b637a]">
                        {copy.subtitle}
                      </p>

                      {/* Bottom row: Status badge + EXACTLY ONE action (View experiment →) */}
                      <div className="mt-4 flex items-center justify-between gap-2 border-t border-[#e8f0f5] pt-3.5">
                        <span
                          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                            isPendingReview
                              ? "bg-[#fff4d7] text-[#805100]"
                              : "bg-[#e2f7ec] text-[#046c49]"
                          }`}
                        >
                          {isPendingReview ? (
                            <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                          ) : (
                            <CheckCircle2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                          )}
                          <span>
                            {isPendingReview
                              ? isTe
                                ? "సమీక్ష పెండింగ్"
                                : "Review pending"
                              : isTe
                                ? "ప్రారంభించగల ప్రయోగం"
                                : "Available neutral activity"}
                          </span>
                        </span>

                        <Link
                          href={`/experiments/${exp.experimentId}`}
                          className="inline-flex items-center gap-1 text-xs font-extrabold text-[#007875] hover:underline"
                          data-testid={`view-experiment-${exp.experimentId}`}
                        >
                          <span>{dict.catalogue.viewExperiment}</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
