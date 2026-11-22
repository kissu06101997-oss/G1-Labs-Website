"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, Lock, MonitorCheck, SlidersHorizontal } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import { getDictionary } from "@/lib/i18n";
import type { LabMode, LabSubject, Locale } from "@/lib/types";

interface ModeLauncherProps {
  experimentId: string;
  labId: LabSubject;
  contentVersion: string;
  manifestSha256: string;
  engineAbi: string;
  publicationStatus: "research_fixture" | "review_pending" | "approved";
  locale: Locale;
  isSignedIn: boolean;
  canLaunch: boolean;
  assignmentId?: string | null;
  allowedModes?: LabMode[];
}

export function ModeLauncher({
  experimentId,
  labId,
  contentVersion,
  manifestSha256,
  engineAbi,
  publicationStatus,
  locale,
  isSignedIn,
  canLaunch,
  assignmentId = null,
  allowedModes,
}: ModeLauncherProps) {
  const router = useRouter();
  const dict = getDictionary(locale);
  const [launchingMode, setLaunchingMode] = useState<LabMode | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isReviewPending = publicationStatus === "review_pending";
  const simEnabled = !isReviewPending && (!allowedModes || allowedModes.includes("simulation"));
  const expEnabled = !isReviewPending && (!allowedModes || allowedModes.includes("experiment"));

  async function handleLaunch(mode: LabMode) {
    setErrorMsg(null);
    if (isReviewPending) return;

    if (!isSignedIn) {
      const nextUrl = assignmentId
        ? `/experiments/${experimentId}?assignmentId=${assignmentId}`
        : `/experiments/${experimentId}`;
      router.push(`/sign-in?next=${encodeURIComponent(nextUrl)}`);
      return;
    }

    if (!canLaunch) {
      setErrorMsg(
        locale === "te-IN"
          ? "ప్రయోగాన్ని ప్రారంభించడానికి విద్యార్థి లేదా ఉపాధ్యాయ ఖాతా అవసరం."
          : "Sign in with a student or teacher account to launch a laboratory session."
      );
      return;
    }

    setLaunchingMode(mode);
    try {
      // Step 1: Request single-use launch grant via authenticated POST /api/v1/launch
      const launchRes = await apiFetch<{
        launchToken?: string;
        detail?: string;
      }>("/api/v1/launch", {
        method: "POST",
        body: {
          assignmentId: assignmentId || null,
          experimentId,
          labId,
          mode,
          contentVersion,
          manifestSha256,
          locale,
          engineAbi,
        },
      });

      if (!launchRes.ok || !launchRes.data.launchToken) {
        setErrorMsg(launchRes.data.detail || "Unable to authorize laboratory launch.");
        setLaunchingMode(null);
        return;
      }

      // Step 2: Redeem single-use token via same-origin POST body (NEVER in URL!)
      const redeemRes = await apiFetch<{
        sessionId?: string;
        detail?: string;
      }>("/api/v1/launch/redeem", {
        method: "POST",
        body: {
          launchToken: launchRes.data.launchToken,
        },
      });

      if (!redeemRes.ok || !redeemRes.data.sessionId) {
        setErrorMsg(redeemRes.data.detail || "Unable to redeem launch grant.");
        setLaunchingMode(null);
        return;
      }

      router.push(`/player/${redeemRes.data.sessionId}`);
    } catch {
      setErrorMsg("Network error while opening laboratory session.");
      setLaunchingMode(null);
    }
  }

  return (
    <section aria-labelledby="choose-mode-heading" className="mt-7">
      <h2
        id="choose-mode-heading"
        className="text-xl font-extrabold tracking-tight text-[#0c2444]"
      >
        {dict.detail.chooseModeHeading}
      </h2>

      {isReviewPending && (
        <div
          role="status"
          className="mt-3 flex items-center gap-2.5 rounded-2xl border border-[#f5d5a3] bg-[#fff8ec] px-4 py-3 text-sm font-semibold text-[#7a4400]"
        >
          <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{dict.detail.reviewLocked}</span>
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="mt-3 rounded-2xl border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm font-semibold text-[#b42318]"
        >
          {errorMsg}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Simulation Mode = BLUE */}
        <div className="g1-mode-blue flex items-start gap-4 p-6">
          <div
            className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#dff2ff] text-[#0663ab]"
            aria-hidden="true"
          >
            <MonitorCheck className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-[#0663ab]">{dict.detail.simTitle}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#2d4d67]">
              {dict.detail.simDesc}
            </p>
            <button
              type="button"
              onClick={() => handleLaunch("simulation")}
              disabled={!simEnabled || launchingMode !== null}
              className="g1-btn g1-btn-blue mt-4 min-h-[42px] px-5 text-sm"
              data-testid="launch-simulation-btn"
            >
              {launchingMode === "simulation" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              <span>{dict.detail.simCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Experiment Mode = GREEN */}
        <div className="g1-mode-green flex items-start gap-4 p-6">
          <div
            className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-[#dcf7ea] text-[#046c49]"
            aria-hidden="true"
          >
            <SlidersHorizontal className="h-6 w-6" strokeWidth={2.2} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-extrabold text-[#046c49]">{dict.detail.expTitle}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-[#2a4f44]">
              {dict.detail.expDesc}
            </p>
            <button
              type="button"
              onClick={() => handleLaunch("experiment")}
              disabled={!expEnabled || launchingMode !== null}
              className="g1-btn g1-btn-green mt-4 min-h-[42px] px-5 text-sm"
              data-testid="launch-experiment-btn"
            >
              {launchingMode === "experiment" ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : null}
              <span>{dict.detail.expCta}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
