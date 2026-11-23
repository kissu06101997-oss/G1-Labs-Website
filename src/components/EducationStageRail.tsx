"use client";

import Link from "next/link";
import { Layers } from "lucide-react";
import {
  EDUCATION_STAGES,
  type EducationStageSpec,
} from "@/lib/education-stages";
import type { Locale } from "@/lib/types";

interface EducationStageRailProps {
  locale: Locale;
  selectedGrade?: number | null;
  onSelectGrade?: (grade: number | null) => void;
  hrefBase?: string;
  showAllOption?: boolean;
}

export function EducationStageRail({
  locale,
  selectedGrade = 10,
  onSelectGrade,
  hrefBase = "/laboratories",
  showAllOption = false,
}: EducationStageRailProps) {
  const isTe = locale === "te-IN";

  function renderPillContent(stage: EducationStageSpec, isSelected: boolean) {
    const label = isTe ? stage.shortLabelTe : stage.shortLabelEn;
    return (
      <>
        <span className="block truncate font-extrabold leading-tight">{label}</span>
        <span
          className={`mt-0.5 block truncate text-[10px] font-semibold ${
            isSelected ? "text-[#d5f7f5]" : "text-[#5b7488]"
          }`}
        >
          {stage.availability === "available"
            ? isTe
              ? "ప్రయోగాలు సిద్ధం"
              : "Labs available"
            : stage.availability === "preview_only"
              ? isTe
                ? "ప్రివ్యూ మాత్రమే"
                : "Preview only"
              : isTe
                ? "సమీక్షలో ఉంది"
                : "Under review"}
        </span>
      </>
    );
  }

  return (
    <section
      aria-label={isTe ? "తరగతి వారీగా ప్రయోగశాలలు (7 స్థాయిలు)" : "Explore by class (7 learning stages)"}
      className="g1-stage-deck"
      data-testid="education-stage-rail"
    >
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex shrink-0 items-center gap-2.5 px-1 xl:w-[215px]">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e5f6f5] text-[#007875]"
            aria-hidden="true"
          >
            <Layers className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <strong className="block truncate text-sm font-extrabold text-[#0c2444]">
              {isTe ? "తరగతి ఎక్స్‌ప్లోరర్" : "Explore by class"}
            </strong>
            <small className="block truncate text-xs font-medium text-[#526b80]">
              {isTe ? "7 విద్యా స్థాయిలు (6–10 & ఇంటర్)" : "Seven learning stages"}
            </small>
          </div>
        </div>

        <div
          role="group"
          aria-label={isTe ? "విద్యా స్థాయి ఎంపిక" : "Education stage selector"}
          className={`flex flex-1 items-center gap-2 overflow-x-auto pb-1 pt-0.5 sm:grid sm:grid-cols-4 ${
            showAllOption ? "lg:grid-cols-8" : "lg:grid-cols-7"
          } xl:overflow-visible xl:pb-0`}
        >
          {showAllOption && onSelectGrade && (
            <button
              type="button"
              onClick={() => onSelectGrade(null)}
              aria-pressed={selectedGrade === null}
              data-testid="stage-pill-all"
              className={`g1-stage-pill min-w-[112px] sm:min-w-0 ${
                selectedGrade === null ? "g1-stage-pill-active" : ""
              }`}
            >
              <span className="block truncate font-extrabold leading-tight">
                {isTe ? "అన్ని తరగతులు" : "All 7 stages"}
              </span>
              <span
                className={`mt-0.5 block truncate text-[10px] font-semibold ${
                  selectedGrade === null ? "text-[#d5f7f5]" : "text-[#5b7488]"
                }`}
              >
                {isTe ? "6వ–ఇంటర్ 2వ" : "Class 6–Inter 2"}
              </span>
            </button>
          )}

          {EDUCATION_STAGES.map((stage) => {
            const isSelected = selectedGrade === stage.grade;
            const pillClass = `g1-stage-pill min-w-[122px] sm:min-w-0 ${
              isSelected ? "g1-stage-pill-active" : ""
            }`;

            if (onSelectGrade) {
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => onSelectGrade(isSelected && showAllOption ? null : stage.grade)}
                  aria-pressed={isSelected}
                  data-testid={`stage-pill-${stage.id}`}
                  title={isTe ? stage.labelTe : stage.labelEn}
                  className={pillClass}
                >
                  {renderPillContent(stage, isSelected)}
                </button>
              );
            }

            return (
              <Link
                key={stage.id}
                href={`${hrefBase}?grade=${stage.grade}`}
                aria-current={isSelected ? "true" : undefined}
                data-testid={`stage-pill-${stage.id}`}
                title={isTe ? stage.labelTe : stage.labelEn}
                className={pillClass}
              >
                {renderPillContent(stage, isSelected)}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
