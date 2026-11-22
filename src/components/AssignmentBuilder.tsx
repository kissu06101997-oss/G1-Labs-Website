"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, PlusCircle } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import type { CatalogItem, LabMode } from "@/lib/types";

interface AssignmentBuilderProps {
  classes: Array<{ classId: string; label: string; grade: number }>;
  experiments: CatalogItem[];
}

export function AssignmentBuilder({ classes, experiments }: AssignmentBuilderProps) {
  const router = useRouter();
  const publishable = experiments.filter((e) => e.publicationStatus !== "review_pending");

  const [classId, setClassId] = useState(classes[0]?.classId ?? "");
  const [experimentId, setExperimentId] = useState(publishable[0]?.experimentId ?? "");
  const [allowSim, setAllowSim] = useState(true);
  const [allowExp, setAllowExp] = useState(true);
  const [dueDate, setDueDate] = useState("2026-12-28");
  const [attemptLimit, setAttemptLimit] = useState(3);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedExp = publishable.find((e) => e.experimentId === experimentId) ?? publishable[0];

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!classId || !selectedExp) {
      setError("Select a class and an approved/pilot experiment.");
      return;
    }

    const modes: LabMode[] = [];
    if (allowSim) modes.push("simulation");
    if (allowExp) modes.push("experiment");
    if (modes.length === 0) {
      setError("Enable at least one learning mode (Simulation Mode or Experiment Mode).");
      return;
    }

    const rubricId = allowExp && !allowSim
      ? selectedExp.modeConfigurations.experiment.rubricId
      : selectedExp.modeConfigurations.simulation.rubricId;

    setBusy(true);
    try {
      const res = await apiFetch<{ assignmentId?: string; status?: string; detail?: string }>(
        `/api/v1/teacher/classes/${classId}/assignments`,
        {
          method: "POST",
          body: {
            experimentId: selectedExp.experimentId,
            contentVersion: selectedExp.contentVersion,
            rubricId,
            modes,
            dueAt: `${dueDate}T17:00:00+05:30`,
            attemptLimit,
            localeBundleVersion: "locale-en-te@1.0.0",
          },
        }
      );

      if (!res.ok) {
        setError(res.data.detail || "Unable to publish assignment.");
        setBusy(false);
        return;
      }

      setSuccessMsg(
        `Published ${selectedExp.experimentId} (v${selectedExp.contentVersion}, rubric ${rubricId}) — Assignment ID ${res.data.assignmentId}.`
      );
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handlePublish} className="g1-card space-y-5 p-6">
      <div>
        <h2 className="text-xl font-extrabold text-[#0c2444]">Publish versioned class assignment</h2>
        <p className="mt-1 text-xs text-[#4b637a]">
          Pins exact experiment version, immutable rubric ID, allowed modes, attempt limit and
          English/Telugu locale bundle in PostgreSQL.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm font-semibold text-[#b42318]">
          {error}
        </div>
      )}

      {successMsg && (
        <div
          role="status"
          data-testid="assignment-published-banner"
          className="flex items-center gap-2 rounded-xl border border-[#b4e6cf] bg-[#eafbf2] px-4 py-3 text-sm font-semibold text-[#046c49]"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="assign-class" className="block text-xs font-bold text-[#133354]">
            Authorized class
          </label>
          <select
            id="assign-class"
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-[#c3d7e5] bg-[#f8fcff] px-3.5 text-sm font-semibold text-[#0c2444]"
          >
            {classes.map((c) => (
              <option key={c.classId} value={c.classId}>
                {c.label} (Class {c.grade})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="assign-experiment" className="block text-xs font-bold text-[#133354]">
            Qualified experiment &amp; pinned version
          </label>
          <select
            id="assign-experiment"
            value={experimentId}
            onChange={(e) => setExperimentId(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-[#c3d7e5] bg-[#f8fcff] px-3.5 text-sm font-semibold text-[#0c2444]"
          >
            {publishable.map((exp) => (
              <option key={exp.experimentId} value={exp.experimentId}>
                {exp.experimentId} — {exp.title} (v{exp.contentVersion})
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="rounded-2xl border border-[#ddebf3] bg-[#f8fcff] p-4">
        <legend className="px-1 text-xs font-bold text-[#133354]">Allowed learning modes</legend>
        <div className="mt-2 flex flex-wrap gap-5">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-[#0663ab]">
            <input
              type="checkbox"
              checked={allowSim}
              onChange={(e) => setAllowSim(e.target.checked)}
              className="h-4 w-4 accent-[#0663ab]"
            />
            <span>Simulation Mode (Blue · Guided practical)</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2.5 text-sm font-bold text-[#046c49]">
            <input
              type="checkbox"
              checked={allowExp}
              onChange={(e) => setAllowExp(e.target.checked)}
              className="h-4 w-4 accent-[#046c49]"
            />
            <span>Experiment Mode (Green · Bounded inquiry)</span>
          </label>
        </div>
      </fieldset>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="assign-due" className="block text-xs font-bold text-[#133354]">
            Due date (IST · Asia/Kolkata)
          </label>
          <input
            id="assign-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
            className="mt-1.5 h-11 w-full rounded-xl border border-[#c3d7e5] bg-[#f8fcff] px-3.5 text-sm text-[#0c2444]"
          />
        </div>
        <div>
          <label htmlFor="assign-attempts" className="block text-xs font-bold text-[#133354]">
            Attempt limit (1–20)
          </label>
          <input
            id="assign-attempts"
            type="number"
            min={1}
            max={20}
            value={attemptLimit}
            onChange={(e) => setAttemptLimit(Number(e.target.value))}
            className="mt-1.5 h-11 w-full rounded-xl border border-[#c3d7e5] bg-[#f8fcff] px-3.5 text-sm text-[#0c2444]"
          />
        </div>
        <div>
          <span className="block text-xs font-bold text-[#133354]">Locale bundle pinned</span>
          <div className="mt-1.5 flex h-11 items-center rounded-xl border border-[#ddebf3] bg-white px-3.5 font-mono text-xs text-[#4b637a]">
            locale-en-te@1.0.0
          </div>
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={busy}
          className="g1-btn g1-btn-teal"
          data-testid="publish-assignment-submit"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <PlusCircle className="h-4 w-4" aria-hidden="true" />}
          <span>Publish assignment to class</span>
        </button>
      </div>
    </form>
  );
}
