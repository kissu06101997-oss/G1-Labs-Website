"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, RotateCcw, Search } from "lucide-react";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";
import type { CatalogItem, LabSubject, Locale } from "@/lib/types";

interface CatalogueViewProps {
  items: CatalogItem[];
  locale: Locale;
  initialSubject: LabSubject | "";
  initialGrade: string;
  initialQuery: string;
  lockedSubject?: LabSubject;
}

export function CatalogueView({
  items,
  locale,
  initialSubject,
  initialGrade,
  initialQuery,
  lockedSubject,
}: CatalogueViewProps) {
  const router = useRouter();
  const dict = getDictionary(locale);
  const [isPending, startTransition] = useTransition();

  const [queryText, setQueryText] = useState(initialQuery);
  const [subject, setSubject] = useState<string>(lockedSubject ?? initialSubject);
  const [grade, setGrade] = useState<string>(initialGrade);

  function pushFilters(nextQ: string, nextSubject: string, nextGrade: string) {
    const params = new URLSearchParams();
    if (nextQ.trim()) params.set("q", nextQ.trim());
    if (!lockedSubject && nextSubject) params.set("subject", nextSubject);
    if (nextGrade) params.set("grade", nextGrade);

    const base = lockedSubject ? `/laboratories/${lockedSubject}` : "/laboratories";
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `${base}?${qs}` : base);
    });
  }

  const hasActiveFilters =
    queryText.trim().length > 0 || (!lockedSubject && subject !== "") || grade !== "";

  return (
    <div>
      {/* Clean elevated search & filter card matching 02_Experiment_Catalogue.png */}
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          pushFilters(queryText, subject, grade);
        }}
        className="g1-card mt-7 flex flex-col gap-3 p-4 md:flex-row md:items-center"
      >
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#4b637a]"
            aria-hidden="true"
          />
          <label htmlFor="catalogue-search" className="sr-only">
            {dict.catalogue.searchPlaceholder}
          </label>
          <input
            id="catalogue-search"
            type="search"
            value={queryText}
            onChange={(e) => {
              const val = e.target.value;
              setQueryText(val);
              pushFilters(val, subject, grade);
            }}
            placeholder={dict.catalogue.searchPlaceholder}
            className="h-11 w-full rounded-xl border border-[#dbe7ee] bg-[#f8fcff] pl-10 pr-4 text-sm text-[#0c2444] placeholder:text-[#5c748a]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {!lockedSubject && (
            <div className="flex items-center gap-2">
              <label htmlFor="subject-filter" className="sr-only">
                {dict.catalogue.subjectLabel}
              </label>
              <select
                id="subject-filter"
                value={subject}
                onChange={(e) => {
                  const val = e.target.value;
                  setSubject(val);
                  pushFilters(queryText, val, grade);
                }}
                className="h-11 rounded-xl border border-[#c3d7e5] bg-white px-3.5 text-sm font-bold text-[#1a3b59]"
              >
                <option value="">
                  {dict.catalogue.subjectLabel}: {dict.catalogue.all}
                </option>
                <option value="chemistry">{dict.subjects.chemistry.name}</option>
                <option value="physics">{dict.subjects.physics.name}</option>
                <option value="biology">{dict.subjects.biology.name}</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <label htmlFor="grade-filter" className="sr-only">
              {dict.catalogue.classLabel}
            </label>
            <select
              id="grade-filter"
              value={grade}
              onChange={(e) => {
                const val = e.target.value;
                setGrade(val);
                pushFilters(queryText, subject, val);
              }}
              className="h-11 rounded-xl border border-[#c3d7e5] bg-white px-3.5 text-sm font-bold text-[#1a3b59]"
            >
              <option value="">
                {dict.catalogue.classLabel}: {dict.catalogue.all}
              </option>
              <option value="8">{dict.catalogue.classPrefix} 8</option>
              <option value="9">{dict.catalogue.classPrefix} 9</option>
              <option value="10">{dict.catalogue.classPrefix} 10</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={() => {
                setQueryText("");
                if (!lockedSubject) setSubject("");
                setGrade("");
                pushFilters("", lockedSubject ?? "", "");
              }}
              className="g1-btn g1-btn-outline min-h-[44px] px-3.5 text-xs"
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{dict.catalogue.resetFilters}</span>
            </button>
          )}
        </div>
      </form>

      {/* Section title + transparent AP curriculum review status */}
      <div className="mt-7 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-2xl font-extrabold tracking-tight text-[#0c2444]">
          {dict.catalogue.availableHeading}
        </h2>
        <p className="text-xs font-medium text-[#4b637a]" aria-live="polite">
          {isPending ? dict.common.loading : dict.catalogue.statusNote}
        </p>
      </div>

      {/* Results grid: strictly ONE View experiment action per card */}
      {items.length === 0 ? (
        <div role="status" className="g1-card mt-5 p-10 text-center">
          <h3 className="text-lg font-bold text-[#0c2444]">{dict.catalogue.emptyTitle}</h3>
          <p className="mt-2 text-sm text-[#4b637a]">{dict.catalogue.emptyDesc}</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((exp) => {
            const copy = getExperimentCopy(exp.experimentId, locale);
            const isReviewOnly = exp.publicationStatus === "review_pending";
            const subjName = dict.subjects[exp.subject].name;

            return (
              <article
                key={`${exp.experimentId}-${exp.contentVersion}`}
                className="g1-card flex flex-col overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
              >
                <div className="h-[152px] w-full overflow-hidden bg-[#ebf7fc]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={copy.imagePath}
                    alt={copy.shortTitle}
                    className={`h-full w-full ${copy.imagePath.endsWith(".svg") ? "object-contain p-1.5" : "object-cover"}`}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="text-xs font-extrabold text-[#166c8a]">
                      {subjName} ·{" "}
                      {isReviewOnly
                        ? dict.catalogue.curriculumReview
                        : `${dict.catalogue.classPrefix} ${exp.grade}`}
                    </div>
                    <h3 className="mt-1.5 text-base font-extrabold text-[#0c2444]">
                      {isReviewOnly ? copy.shortTitle : copy.activityLabel === "Activity 2.3" ? `Activity 2.3 — ${copy.shortTitle}` : copy.shortTitle}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#4b637a]">
                      {copy.subtitle}
                    </p>
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/experiments/${exp.experimentId}`}
                      className="inline-flex min-h-[36px] items-center gap-1.5 text-xs font-extrabold text-[#007875] hover:underline"
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
  );
}
