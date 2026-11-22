"use client";

import { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { LabStageCanvas, type DispatchActionArgs } from "./LabStageCanvas";
import { apiFetch } from "@/lib/client-api";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";
import type { LabSessionState } from "@/lib/science-adapters";
import type {
  AssessmentContract,
  ExperimentDefinition,
  LabActionResult,
  Locale,
  ObservationRecord,
  SessionContract,
} from "@/lib/types";

interface AssessmentSummary extends AssessmentContract {
  criteriaPassed?: number;
  criteriaTotal?: number;
  summary?: string;
}

interface LabPlayerClientProps {
  initialSession: SessionContract;
  initialState: LabSessionState;
  initialObservations: ObservationRecord[];
  initialAssessment: AssessmentSummary | null;
  definition: ExperimentDefinition;
  actorId: string;
  locale: Locale;
}

export function LabPlayerClient({
  initialSession,
  initialState,
  initialObservations,
  initialAssessment,
  definition,
  actorId,
  locale,
}: LabPlayerClientProps) {
  const dict = getDictionary(locale);
  const copy = getExperimentCopy(definition.experimentId, locale);

  const [session, setSession] = useState<SessionContract>(initialSession);
  const [state, setState] = useState<LabSessionState>(initialState);
  const [observations, setObservations] = useState<ObservationRecord[]>(initialObservations);
  const [assessment, setAssessment] = useState<AssessmentSummary | null>(initialAssessment);

  // Bounded variable inputs for Experiment Mode
  const [zincUmol, setZincUmol] = useState<number>(initialState.zincUmol ?? 2.0);
  const [acidEqUmol, setAcidEqUmol] = useState<number>(initialState.acidEqUmol ?? 3.0);
  const [incidentAngle, setIncidentAngle] = useState<number>(initialState.incidentAngleDeg ?? 45);
  const [slabThickness, setSlabThickness] = useState<number>(initialState.slabThicknessMm ?? 20);
  const [bioField, setBioField] = useState<number>(initialState.selectedField ?? 0);
  const [bioPlane, setBioPlane] = useState<number>(initialState.acquiredPlane ?? 0);
  const [claimChoice, setClaimChoice] = useState<string>(
    initialState.claimNote || "supported_model_and_limits_verified"
  );

  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<{ kind: "info" | "error" | "success"; text: string } | null>(null);

  const isSim = session.mode === "simulation";
  const isSubmitted = session.status === "submitted" || assessment !== null;
  const steps = isSim
    ? definition.modeConfigurations.simulation.steps
    : definition.modeConfigurations.experiment.steps;
  const rubricId = isSim
    ? definition.modeConfigurations.simulation.rubricId
    : definition.modeConfigurations.experiment.rubricId;

  async function syncFromServer() {
    const res = await apiFetch<{
      session?: SessionContract;
      state?: LabSessionState;
      observations?: ObservationRecord[];
      assessment?: AssessmentSummary | null;
    }>(`/api/v1/sessions/${session.sessionId}?include=full`);
    if (res.ok && res.data.session && res.data.state) {
      setSession(res.data.session);
      setState(res.data.state);
      if (res.data.observations) setObservations(res.data.observations);
      if (res.data.assessment !== undefined) setAssessment(res.data.assessment);
    }
  }

  async function dispatchAction(args: DispatchActionArgs) {
    if (busy || isSubmitted) return;
    setBusy(true);
    setFeedback(null);

    try {
      const payload = {
        sessionId: session.sessionId,
        labId: session.labId,
        experimentId: session.experimentId,
        mode: session.mode,
        actorId,
        targetObjectId: args.targetObjectId,
        actionType: args.actionType,
        parametersWithUnits: args.parametersWithUnits ?? {},
        expectedRevision: session.revision,
        ...(args.interactionPort ? { interactionPort: args.interactionPort } : {}),
        ...(args.choiceId ? { choiceId: args.choiceId } : {}),
      };

      const res = await apiFetch<LabActionResult & { detail?: string }>(
        `/api/v1/sessions/${session.sessionId}/actions`,
        {
          method: "POST",
          body: payload,
        }
      );

      if (res.status === 409 && res.data.reasonCode === "REVISION_CONFLICT") {
        // Authoritative conflict recovery: fetch confirmed checkpoint!
        setFeedback({
          kind: "error",
          text: `Revision conflict (409): server is at revision ${res.data.committedRevision}. Syncing confirmed checkpoint...`,
        });
        await syncFromServer();
        return;
      }

      if (!res.ok || !res.data.accepted) {
        setFeedback({
          kind: "error",
          text: `${res.data.reasonCode || "REJECTED"}: ${res.data.uncertainty?.note || res.data.detail || "Action rejected without mutating session state."}`,
        });
        return;
      }

      // Refresh authoritative state + checkpoint from PostgreSQL
      await syncFromServer();
      setFeedback({
        kind: "success",
        text: `Committed at revision ${res.data.committedRevision} (${res.data.reasonCode}).`,
      });
    } finally {
      setBusy(false);
    }
  }

  async function handleGuidedStepAdvance() {
    const idx = state.stepIndex;
    if (idx === 0) {
      await dispatchAction({
        targetObjectId: definition.sceneId,
        actionType: "complete_aim",
      });
      return;
    }

    if (definition.subject === "chemistry") {
      if (idx === 1) {
        await dispatchAction({
          targetObjectId: "chem.transfer:1",
          actionType: "setup_apparatus",
          interactionPort: "port_soap_receiver",
        });
      } else if (idx === 2) {
        await dispatchAction({
          targetObjectId: "chem.reaction-tube:1",
          actionType: "identify_reagent",
          choiceId: "Zn",
        });
        await dispatchAction({
          targetObjectId: "chem.reaction-tube:1",
          actionType: "identify_reagent",
          choiceId: "dilute_H2SO4",
        });
      } else if (idx === 3) {
        await dispatchAction({
          targetObjectId: "chem.reaction-tube:1",
          actionType: "propose_virtual_amount",
          parametersWithUnits: {
            zincAmount: { value: 2.0, unit: "umol" },
            acidEquivalent: { value: 3.0, unit: "umol" },
          },
        });
      } else {
        await dispatchAction({
          targetObjectId: definition.sceneId,
          actionType: "record_claim",
          choiceId: claimChoice,
        });
      }
      return;
    }

    if (definition.subject === "physics") {
      if (idx === 1) {
        await dispatchAction({
          targetObjectId: "phys.glass-slab:1",
          actionType: "place_optic",
          interactionPort: "port_parallel_normal",
        });
      } else if (idx === 2) {
        await dispatchAction({
          targetObjectId: "phys.glass-slab:1",
          actionType: "select_incident_ray",
          parametersWithUnits: {
            angle: { value: 45, unit: "deg" },
            slabThickness: { value: 20, unit: "mm" },
          },
        });
      } else if (idx === 3) {
        await dispatchAction({
          targetObjectId: "phys.glass-slab:1",
          actionType: "observe_ray",
          parametersWithUnits: {
            angle: { value: 30, unit: "deg" },
            slabThickness: { value: 20, unit: "mm" },
          },
        });
      } else {
        await dispatchAction({
          targetObjectId: definition.sceneId,
          actionType: "record_claim",
          choiceId: claimChoice,
        });
      }
      return;
    }

    // Biology guided steps
    if (idx === 1) {
      await dispatchAction({
        targetObjectId: "bio.prepared-onion-slide:1",
        actionType: "select_field",
        parametersWithUnits: { fieldIndex: { value: 1, unit: "1" } },
      });
    } else if (idx === 2) {
      await dispatchAction({
        targetObjectId: "bio.compound-microscope:1",
        actionType: "select_acquired_plane",
        parametersWithUnits: { fixturePlaneIndex: { value: 1, unit: "1" } },
      });
    } else if (idx === 3) {
      await dispatchAction({
        targetObjectId: "bio.image-view:1",
        actionType: "mark_visible_boundary",
        choiceId: "cell_wall",
      });
    } else {
      await dispatchAction({
        targetObjectId: definition.sceneId,
        actionType: "record_claim",
        choiceId: claimChoice,
      });
    }
  }

  async function handleRunExperimentTrial(isComparison = false) {
    if (definition.subject === "chemistry") {
      await dispatchAction({
        targetObjectId: "chem.reaction-tube:1",
        actionType: isComparison ? "compare_observation" : "propose_virtual_amount",
        parametersWithUnits: {
          zincAmount: { value: zincUmol, unit: "umol" },
          acidEquivalent: { value: acidEqUmol, unit: "umol" },
        },
      });
    } else if (definition.subject === "physics") {
      await dispatchAction({
        targetObjectId: "phys.glass-slab:1",
        actionType: isComparison ? "observe_ray" : "select_incident_ray",
        parametersWithUnits: {
          angle: { value: incidentAngle, unit: "deg" },
          slabThickness: { value: slabThickness, unit: "mm" },
        },
      });
    } else {
      await dispatchAction({
        targetObjectId: "bio.prepared-onion-slide:1",
        actionType: "select_field",
        parametersWithUnits: { fieldIndex: { value: bioField, unit: "1" } },
      });
      await dispatchAction({
        targetObjectId: "bio.compound-microscope:1",
        actionType: "select_acquired_plane",
        parametersWithUnits: { fixturePlaneIndex: { value: bioPlane, unit: "1" } },
      });
    }
  }

  async function handleSubmitAttempt() {
    if (busy || isSubmitted) return;
    setBusy(true);
    setFeedback(null);
    try {
      const evidenceIds = observations.map((o) => o.observationId);
      const res = await apiFetch<AssessmentSummary & { detail?: string }>(
        `/api/v1/attempts/${session.attemptId}/submission`,
        {
          method: "POST",
          body: {
            expectedRevision: session.revision,
            rubricId,
            evidenceIds,
          },
        }
      );

      if (!res.ok) {
        setFeedback({
          kind: "error",
          text: res.data.detail || "Unable to submit assessment.",
        });
        return;
      }

      await syncFromServer();
      setFeedback({
        kind: "success",
        text: `Assessment submitted and locked (Submission ID ${res.data.submissionId}).`,
      });
    } finally {
      setBusy(false);
    }
  }

  // Primary theoretical value readout for Experiment Mode right panel
  const primaryTheoryMetric =
    definition.subject === "chemistry"
      ? {
          label: "Maximum theoretical H₂",
          value:
            state.theoreticalH2Umol !== null && state.theoreticalH2Umol !== undefined
              ? `${state.theoreticalH2Umol} µmol`
              : "Not computed",
          note: "For current synthetic test inputs",
        }
      : definition.subject === "physics"
        ? {
            label: "Theoretical transverse offset",
            value:
              state.transverseOffsetMm !== null && state.transverseOffsetMm !== undefined
                ? `${state.transverseOffsetMm} mm`
                : "Not computed",
            note:
              state.refractedAngleDeg !== null && state.refractedAngleDeg !== undefined
                ? `Refracted angle r = ${state.refractedAngleDeg}° (emergent e = ${state.emergentAngleDeg}°)`
                : "Ideal Snell geometry (n = 1.500)",
          }
        : {
            label: "Quantitative scale calibration",
            value: "Unavailable",
            note: `Qualitative inspection: Field ${state.selectedField ?? 0} · Plane ${state.acquiredPlane ?? 0}`,
          };

  function formatTrialSummary(trial: Record<string, unknown> | null | undefined): string {
    if (!trial) return "Not recorded";
    if (definition.subject === "chemistry" && typeof trial.theoreticalH2Umol === "number") {
      return `${trial.theoreticalH2Umol} µmol H₂ (${trial.zincUmol} Zn, ${trial.acidEqUmol} H⁺)`;
    }
    if (definition.subject === "physics" && typeof trial.transverseOffsetMm === "number") {
      return `${trial.transverseOffsetMm} mm (i=${trial.incidentAngleDeg}°, d=${trial.slabThicknessMm} mm)`;
    }
    if (definition.subject === "biology") {
      return `Field ${String(trial.selectedField ?? 0)} · Plane ${String(trial.acquiredPlane ?? 0)} (qualitative)`;
    }
    return "Recorded";
  }

  return (
    <main id="main-content" className="mx-auto w-full max-w-[1480px] flex-1 px-4 py-6 sm:px-8 lg:px-10">
      {/* Top mode & authoritative revision header matching 06 & 07 */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className={`g1-tag ${isSim ? "g1-tag-blue" : "g1-tag-green"}`}>
            {isSim ? dict.player.simBadge : dict.player.expBadge}
          </span>
          <h1 className="mt-2.5 text-2xl font-extrabold tracking-tight text-[#0c2444] sm:text-[28px]">
            {isSim
              ? `${copy.activityLabel} — ${copy.shortTitle}`
              : `${copy.activityLabel} — ${locale === "te-IN" ? "ఆమోదించిన పరికల్పన పరీక్ష" : "Test a supported hypothesis"}`}
          </h1>
        </div>

        <div className="text-left sm:text-right">
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <span className="g1-tag" data-testid="player-status-chip">
              {isSim
                ? `Step ${Math.min(steps.length, state.stepIndex + 1)} of ${steps.length}`
                : copy.modelScopeBadge}
            </span>
            <span className="g1-tag font-mono" data-testid="player-revision-badge">
              {dict.player.savedAtRevision} {session.revision}
            </span>
          </div>
          <p className="mt-1.5 text-xs text-[#4b637a]">
            {isSim ? `Manifest ${session.manifestSha256.slice(0, 12)}… · ${session.engineAbi}` : copy.modelLimitNote}
          </p>
        </div>
      </div>

      {/* Live status / rejection / submitted rubric feedback */}
      {feedback && (
        <div
          role={feedback.kind === "error" ? "alert" : "status"}
          data-testid="player-feedback-banner"
          className={`mb-4 flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
            feedback.kind === "error"
              ? "border-[#fecdca] bg-[#fef3f2] text-[#b42318]"
              : "border-[#b4e6cf] bg-[#eafbf2] text-[#046c49]"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.kind === "error" ? (
              <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button
            type="button"
            onClick={() => void syncFromServer()}
            className="inline-flex items-center gap-1 text-xs underline"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Sync</span>
          </button>
        </div>
      )}

      {isSubmitted && assessment && (
        <section
          aria-label="Submitted rubric feedback"
          data-testid="player-submitted-banner"
          className="mb-5 rounded-2xl border border-[#b4e6cf] bg-[#eafbf2] p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#046c49]">
                Submitted · Authoritative Server Rubric
              </div>
              <h2 className="mt-1 text-lg font-extrabold text-[#0c2444]">
                {assessment.rubricId} — {assessment.gradeState.toUpperCase()}
                {assessment.criteriaTotal
                  ? ` (${assessment.criteriaPassed}/${assessment.criteriaTotal} criteria met)`
                  : ""}
              </h2>
              {assessment.summary && (
                <p className="mt-1 text-xs text-[#2a4f44]">{assessment.summary}</p>
              )}
            </div>
            <Link href="/student" className="g1-btn g1-btn-green min-h-[40px] text-xs">
              Return to dashboard →
            </Link>
          </div>
        </section>
      )}

      {/* 3-Column Player Workspace matching 06 & 07 */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* LEFT PANEL */}
        <section
          aria-label={isSim ? dict.player.currentStep : dict.player.inquirySetup}
          className="g1-card flex flex-col justify-between p-5 lg:col-span-3"
        >
          {isSim ? (
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#0663ab]">
                {dict.player.currentStep}
              </div>
              <h2 className="mt-2 text-lg font-extrabold text-[#0c2444]">
                {steps[Math.min(steps.length - 1, state.stepIndex)]}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#4b637a]">
                Complete each guided step using the highlighted bench control or the accessible
                Equipment list.
              </p>

              <hr className="my-4 border-[#dfebf2]" />

              <ol className="space-y-2 text-xs">
                {steps.map((label, idx) => {
                  const done = state.completedSteps.includes(idx);
                  const active = idx === state.stepIndex && !isSubmitted;
                  return (
                    <li
                      key={label}
                      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 font-semibold ${
                        active
                          ? "bg-[#e8f3ff] font-extrabold text-[#0663ab]"
                          : done
                            ? "text-[#007875]"
                            : "text-[#4b637a]"
                      }`}
                    >
                      <span aria-hidden="true" className="w-4 text-center font-bold">
                        {done ? "✓" : idx + 1}
                      </span>
                      <span>{label}</span>
                    </li>
                  );
                })}
              </ol>

              <div className="g1-hint mt-5">
                Use the highlighted control or the accessible Equipment list. Incorrect connections
                or unsupported reagents show a clear reason without mutating lab state.
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#046c49]">
                {dict.player.inquirySetup}
              </div>
              <h2 className="mt-2 text-lg font-extrabold leading-snug text-[#0c2444]">
                {copy.inquiryQuestion}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#4b637a]">
                Keep one variable fixed. Change one approved parameter within its admitted domain
                for comparison.
              </p>

              <hr className="my-4 border-[#dfebf2]" />

              {definition.subject === "chemistry" && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="var-zinc" className="block text-xs font-bold text-[#133354]">
                      Zinc amount (µmol · 0–10, step 0.5)
                    </label>
                    <select
                      id="var-zinc"
                      disabled={isSubmitted}
                      value={zincUmol}
                      onChange={(e) => setZincUmol(Number(e.target.value))}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#cde3ee] bg-[#f3f9fb] px-3 text-sm font-semibold text-[#0c2444]"
                    >
                      {[0, 0.5, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 10].map((v) => (
                        <option key={v} value={v}>
                          {v.toFixed(1)} µmol
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="var-acid" className="block text-xs font-bold text-[#133354]">
                      Acid equivalents (µmol H⁺ eq · 0–10)
                    </label>
                    <select
                      id="var-acid"
                      disabled={isSubmitted}
                      value={acidEqUmol}
                      onChange={(e) => setAcidEqUmol(Number(e.target.value))}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#cde3ee] bg-[#f3f9fb] px-3 text-sm font-semibold text-[#0c2444]"
                    >
                      {[0, 1, 2, 3, 4, 5, 6, 8, 10].map((v) => (
                        <option key={v} value={v}>
                          {v.toFixed(1)} µmol H⁺ equivalent
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {definition.subject === "physics" && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="var-angle" className="block text-xs font-bold text-[#133354]">
                      Incident angle (deg · 0–60°)
                    </label>
                    <select
                      id="var-angle"
                      disabled={isSubmitted}
                      value={incidentAngle}
                      onChange={(e) => setIncidentAngle(Number(e.target.value))}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#cde3ee] bg-[#f3f9fb] px-3 text-sm font-semibold text-[#0c2444]"
                    >
                      {[0, 15, 30, 45, 60].map((v) => (
                        <option key={v} value={v}>
                          {v}°
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="var-thick" className="block text-xs font-bold text-[#133354]">
                      Slab thickness (mm · 10–30 mm)
                    </label>
                    <select
                      id="var-thick"
                      disabled={isSubmitted}
                      value={slabThickness}
                      onChange={(e) => setSlabThickness(Number(e.target.value))}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#cde3ee] bg-[#f3f9fb] px-3 text-sm font-semibold text-[#0c2444]"
                    >
                      {[10, 15, 20, 25, 30].map((v) => (
                        <option key={v} value={v}>
                          {v} mm
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {definition.subject === "biology" && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="var-field" className="block text-xs font-bold text-[#133354]">
                      Acquired slide field (0–2)
                    </label>
                    <select
                      id="var-field"
                      disabled={isSubmitted}
                      value={bioField}
                      onChange={(e) => setBioField(Number(e.target.value))}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#cde3ee] bg-[#f3f9fb] px-3 text-sm font-semibold text-[#0c2444]"
                    >
                      <option value={0}>Field 0 — Low-power overview</option>
                      <option value={1}>Field 1 — Epidermal sheet margin</option>
                      <option value={2}>Field 2 — Central polygonal walls</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="var-plane" className="block text-xs font-bold text-[#133354]">
                      Focal plane index (0–2)
                    </label>
                    <select
                      id="var-plane"
                      disabled={isSubmitted}
                      value={bioPlane}
                      onChange={(e) => setBioPlane(Number(e.target.value))}
                      className="mt-1.5 h-11 w-full rounded-xl border border-[#cde3ee] bg-[#f3f9fb] px-3 text-sm font-semibold text-[#0c2444]"
                    >
                      <option value={0}>Plane 0 (Surface)</option>
                      <option value={1}>Plane 1 (Mid cell wall)</option>
                      <option value={2}>Plane 2 (Deep plane)</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="g1-hint mt-4">
                Synthetic validation fixture. Unsupported reagents, calibration-missing claims, and
                kinetics remain outside this model.
              </div>

              <button
                type="button"
                disabled={busy || isSubmitted}
                onClick={() => void handleRunExperimentTrial(false)}
                className="g1-btn g1-btn-green mt-4 w-full"
                data-testid="exp-run-calculation-btn"
              >
                {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
                <span>{dict.player.runCalculation}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}
        </section>

        {/* CENTER STAGE */}
        <section aria-label="Laboratory stage" className="lg:col-span-6">
          <LabStageCanvas
            definition={definition}
            mode={session.mode}
            locale={locale}
            state={state}
            disabled={busy || isSubmitted}
            onDispatch={dispatchAction}
          />
        </section>

        {/* RIGHT PANEL: Observation Notebook / Theory-only Evidence */}
        <section
          aria-label={isSim ? dict.player.observationNotebook : dict.player.evidenceComparisons}
          className="g1-card flex flex-col justify-between p-5 lg:col-span-3"
        >
          <div>
            <div
              className={`text-[11px] font-extrabold uppercase tracking-[0.14em] ${
                isSim ? "text-[#4b637a]" : "text-[#046c49]"
              }`}
            >
              {isSim ? dict.player.observationNotebook : dict.player.evidenceComparisons}
            </div>
            <h2 className="mt-2 text-lg font-extrabold text-[#0c2444]">
              {isSim ? dict.player.evidence : dict.player.theoryOnlyResults}
            </h2>

            {!isSim && (
              <>
                <div className="mt-3 rounded-2xl border border-[#c3e8d3] bg-[#effbf5] p-4">
                  <div className="text-xs font-semibold text-[#3d5c50]">
                    {primaryTheoryMetric.label}
                  </div>
                  <div
                    className="mt-1.5 text-3xl font-extrabold tracking-tight text-[#046c49]"
                    data-testid="exp-primary-result"
                  >
                    {primaryTheoryMetric.value}
                  </div>
                  <div className="mt-1.5 text-xs text-[#426356]">{primaryTheoryMetric.note}</div>
                </div>

                <div className="mt-4">
                  <h3 className="text-xs font-extrabold text-[#0c2444]">Trial comparison</h3>
                  <dl className="mt-2 divide-y divide-[#e8f0f4] text-xs">
                    <div className="flex items-center justify-between gap-2 py-2.5">
                      <dt className="shrink-0 text-[#4b637a]">Control</dt>
                      <dd className="text-right font-bold text-[#0c2444]">
                        {formatTrialSummary(state.controlTrial)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-2 py-2.5">
                      <dt className="shrink-0 text-[#4b637a]">Comparison</dt>
                      <dd className="text-right font-bold text-[#0c2444]">
                        {formatTrialSummary(state.comparisonTrial)}
                      </dd>
                    </div>
                  </dl>
                  <button
                    type="button"
                    disabled={busy || isSubmitted}
                    onClick={() => void handleRunExperimentTrial(true)}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-extrabold text-[#046c49] hover:underline disabled:opacity-50"
                    data-testid="exp-record-comparison-btn"
                  >
                    <span>{dict.player.recordComparison}</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </>
            )}

            <hr className="my-4 border-[#dfebf2]" />

            {observations.length === 0 ? (
              <div className="g1-hint">{dict.player.noObservationYet}</div>
            ) : (
              <ul
                tabIndex={0}
                aria-label="Confirmed server observations"
                className="max-h-[210px] space-y-2.5 overflow-y-auto rounded-xl text-xs"
                data-testid="observation-list"
              >
                {observations.map((obs) => (
                  <li
                    key={obs.observationId}
                    className="rounded-xl border border-[#dcebf3] bg-[#f8fcff] p-3"
                  >
                    <div className="font-bold text-[#0c2444]">{obs.metric}</div>
                    <div className="mt-0.5 font-semibold text-[#0663ab]">
                      {obs.value === null
                        ? "Unavailable"
                        : typeof obs.value === "string"
                          ? obs.value
                          : `${obs.value.value} ${obs.value.unit}`}
                    </div>
                    <div className="mt-1 text-[11px] text-[#4b637a]">{obs.uncertainty.note}</div>
                  </li>
                ))}
              </ul>
            )}

            {/* Claim-Evidence-Reasoning reflection selector */}
            {!isSubmitted && (
              <div className="mt-4">
                <label htmlFor="claim-select" className="block text-[11px] font-bold uppercase tracking-wider text-[#4b637a]">
                  Claim &amp; limitation note
                </label>
                <select
                  id="claim-select"
                  value={claimChoice}
                  onChange={(e) => setClaimChoice(e.target.value)}
                  className="mt-1 h-9 w-full rounded-lg border border-[#cde3ee] bg-white px-2.5 text-xs text-[#0c2444]"
                >
                  <option value="supported_model_and_limits_verified">
                    Observed evidence matches model scope; physical calibration/rate limits noted
                  </option>
                  <option value="control_and_comparison_explained">
                    Compared controlled change against baseline with explicit units
                  </option>
                </select>
              </div>
            )}
          </div>

          <div className="mt-5">
            <div className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#4b637a]">
              {dict.player.safety}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-[#4b637a]">
              {definition.safetyRules.join(" ")}
            </p>
          </div>
        </section>
      </div>

      {/* Bottom Action Bar matching 06 & 07 */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
        <Link
          href={`/experiments/${definition.experimentId}`}
          className="g1-btn g1-btn-outline"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>{dict.player.backToDetail}</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          {!isSim && (
            <span className="hidden text-xs text-[#4b637a] md:inline">
              {dict.player.provenanceFooter}
            </span>
          )}

          {isSim && !isSubmitted && (
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleGuidedStepAdvance()}
              className="g1-btn g1-btn-blue"
              data-testid="sim-next-step-btn"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
              <span>{dict.player.nextCheck}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}

          {!isSubmitted && (
            <button
              type="button"
              disabled={busy || observations.length === 0}
              onClick={() => void handleSubmitAttempt()}
              className={`g1-btn ${isSim ? "g1-btn-teal" : "g1-btn-green"}`}
              data-testid="player-submit-attempt-btn"
            >
              <span>{dict.player.submitPractical}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
