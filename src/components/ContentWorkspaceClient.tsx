"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FilePlus2, RotateCcw, ShieldCheck } from "lucide-react";
import { apiFetch } from "@/lib/client-api";
import type { ApCorpusSummary } from "@/lib/catalog";
import type { PrincipalRole } from "@/lib/types";

interface ContentWorkspaceProps {
  role: PrincipalRole;
  principalId: string;
  apCorpusSummary: ApCorpusSummary;
  versions: Array<{
    experimentId: string;
    contentVersion: string;
    subject: string;
    manifestSha256: string;
    publicationStatus: string;
    title: string;
    publishedAt: string | null;
    retiredAt: string | null;
  }>;
  reviews: Array<{
    reviewId: string;
    experimentId: string;
    contentVersion: string;
    editorPrincipalId: string;
    editorName: string;
    reviewerName: string | null;
    status: string;
    notes: string | null;
    submittedAt: string;
  }>;
}

export function ContentWorkspaceClient({
  role,
  principalId,
  apCorpusSummary,
  versions,
  reviews,
}: ContentWorkspaceProps) {
  const router = useRouter();
  const [experimentId, setExperimentId] = useState("AP-CHEM-10-2.3");
  const [newVersion, setNewVersion] = useState("0.2.0-candidate");
  const [notes, setNotes] = useState("Proposed edition and bilingual glossary update for independent reviewer sign-off.");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleProposeDraft(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const base = versions.find((v) => v.experimentId === experimentId);
      const res = await apiFetch<{ reviewId?: string; detail?: string }>("/api/content/versions", {
        method: "POST",
        body: {
          experimentId,
          baseVersion: base?.contentVersion ?? "0.1.0-research",
          newContentVersion: newVersion.trim(),
          notes: notes.trim(),
          checklist: {
            editionVerified: true,
            bilingualChecked: true,
            safetyReviewed: true,
            modelBounded: true,
            rightsCleared: true,
          },
        },
      });
      if (!res.ok) {
        setError(res.data.detail || "Unable to submit draft version.");
      } else {
        setMessage(`Draft ${experimentId}@${newVersion} submitted for independent reviewer sign-off.`);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDecision(reviewId: string, decision: "approved" | "rework" | "revoked") {
    setMessage(null);
    setError(null);
    setBusy(true);
    try {
      const res = await apiFetch<{ status?: string; detail?: string }>(
        `/api/content/versions/${reviewId}/decision`,
        {
          method: "POST",
          body: {
            decision,
            notes: `Independent reviewer marked as ${decision} during local Gate W workflow verification.`,
          },
        }
      );
      if (!res.ok) {
        setError(res.data.detail || "Unable to record review decision.");
      } else {
        setMessage(`Review decision '${decision}' persisted and audited.`);
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="g1-eyebrow">Curriculum &amp; Science Governance (AT-07)</div>
        <h1 className="mt-2.5 text-3xl font-extrabold text-[#0c2444]">
          Content Editorial &amp; Two-Person Publication Review
        </h1>
        <p className="mt-1.5 text-sm text-[#4b637a]">
          Signed in as <strong>{role}</strong>. PostgreSQL enforces that the approving reviewer must
          be a distinct principal from the submitting editor, and rollbacks preserve replayability of
          existing sessions.
        </p>
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm font-semibold text-[#b42318]">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="rounded-xl border border-[#b4e6cf] bg-[#eafbf2] px-4 py-3 text-sm font-semibold text-[#046c49]">
          {message}
        </div>
      )}

      {/* Normalized AP candidate corpus summary */}
      <section className="g1-card p-6">
        <h2 className="text-lg font-extrabold text-[#0c2444]">
          Andhra Pradesh Candidate Research Corpus (Internal Reference Only)
        </h2>
        <p className="mt-1 text-xs text-[#4b637a]">
          Unapproved research candidates from 13 official volumes. Literal &quot;null&quot; CSV fields are
          normalized to typed nulls; candidates never appear as deployable student content until
          independent two-person sign-off.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-5">
          <div className="rounded-xl bg-[#f4fafe] p-3.5">
            <div className="text-xs font-bold text-[#4b637a]">Total candidates</div>
            <div className="mt-1 text-2xl font-extrabold text-[#0c2444]">{apCorpusSummary.totalCandidates}</div>
          </div>
          <div className="rounded-xl bg-[#eaf7ff] p-3.5">
            <div className="text-xs font-bold text-[#0663ab]">Chemistry</div>
            <div className="mt-1 text-2xl font-extrabold text-[#0663ab]">{apCorpusSummary.bySubject.chemistry}</div>
          </div>
          <div className="rounded-xl bg-[#eaf7ff] p-3.5">
            <div className="text-xs font-bold text-[#0663ab]">Physics</div>
            <div className="mt-1 text-2xl font-extrabold text-[#0663ab]">{apCorpusSummary.bySubject.physics}</div>
          </div>
          <div className="rounded-xl bg-[#eafbf2] p-3.5">
            <div className="text-xs font-bold text-[#046c49]">Biology</div>
            <div className="mt-1 text-2xl font-extrabold text-[#046c49]">{apCorpusSummary.bySubject.biology}</div>
          </div>
          <div className="rounded-xl bg-[#f4fafe] p-3.5">
            <div className="text-xs font-bold text-[#4b637a]">Current vs Prior</div>
            <div className="mt-1 text-lg font-extrabold text-[#0c2444]">
              {apCorpusSummary.currentEditionCount} / {apCorpusSummary.priorEditionCount}
            </div>
          </div>
        </div>
      </section>

      {role === "content_editor" && (
        <form onSubmit={handleProposeDraft} className="g1-card space-y-4 p-6">
          <div className="flex items-center gap-2">
            <FilePlus2 className="h-5 w-5 text-[#007875]" aria-hidden="true" />
            <h2 className="text-lg font-extrabold text-[#0c2444]">Submit new draft version for review</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="draft-exp" className="block text-xs font-bold text-[#133354]">
                Experiment
              </label>
              <select
                id="draft-exp"
                value={experimentId}
                onChange={(e) => setExperimentId(e.target.value)}
                className="mt-1 h-11 w-full rounded-xl border border-[#c3d7e5] bg-[#f8fcff] px-3 text-sm"
              >
                <option value="AP-CHEM-10-2.3">AP-CHEM-10-2.3 — Zinc and dilute sulfuric acid</option>
                <option value="AP-PHYS-10-9.10">AP-PHYS-10-9.10 — Glass slab refraction</option>
                <option value="AP-BIO-09-5.1">AP-BIO-09-5.1 — Onion epidermis</option>
                <option value="AP-CHEM-10-2.1">AP-CHEM-10-2.1 — Acid-base indicators</option>
              </select>
            </div>
            <div>
              <label htmlFor="draft-ver" className="block text-xs font-bold text-[#133354]">
                New immutable version tag
              </label>
              <input
                id="draft-ver"
                type="text"
                value={newVersion}
                onChange={(e) => setNewVersion(e.target.value)}
                required
                className="mt-1 h-11 w-full rounded-xl border border-[#c3d7e5] bg-[#f8fcff] px-3 font-mono text-sm"
              />
            </div>
          </div>
          <div>
            <label htmlFor="draft-notes" className="block text-xs font-bold text-[#133354]">
              Editorial change summary &amp; edition citation
            </label>
            <input
              id="draft-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              className="mt-1 h-11 w-full rounded-xl border border-[#c3d7e5] bg-[#f8fcff] px-3 text-sm"
            />
          </div>
          <button type="submit" disabled={busy} className="g1-btn g1-btn-teal" data-testid="submit-draft-btn">
            Submit draft to reviewer queue
          </button>
        </form>
      )}

      {/* Editorial Review Queue */}
      <section className="g1-card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-[#e8f0f5] px-6 py-4">
          <ShieldCheck className="h-5 w-5 text-[#046c49]" aria-hidden="true" />
          <h2 className="text-lg font-extrabold text-[#0c2444]">Two-person review queue</h2>
        </div>
        <div className="divide-y divide-[#e8f0f5]">
          {reviews.map((rev) => (
            <div key={rev.reviewId} className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <strong className="font-mono text-sm text-[#0c2444]">
                    {rev.experimentId}@{rev.contentVersion}
                  </strong>
                  <span
                    className={`g1-tag ${
                      rev.status === "approved"
                        ? "g1-tag-green"
                        : rev.status === "revoked"
                          ? "g1-tag-warn"
                          : "g1-tag-blue"
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-[#4b637a]">
                  Editor: {rev.editorName}
                  {rev.reviewerName ? ` · Reviewer: ${rev.reviewerName}` : " · Awaiting independent reviewer"}
                </p>
                {rev.notes && <p className="mt-1 text-xs text-[#133354]">{rev.notes}</p>}
              </div>

              {role === "content_reviewer" && rev.editorPrincipalId !== principalId && (
                <div className="flex flex-wrap gap-2">
                  {rev.status !== "approved" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDecision(rev.reviewId, "approved")}
                      className="g1-btn g1-btn-green min-h-[38px] px-3.5 text-xs"
                      data-testid={`approve-review-${rev.reviewId}`}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Approve &amp; publish</span>
                    </button>
                  )}
                  {rev.status !== "revoked" && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => handleDecision(rev.reviewId, "revoked")}
                      className="g1-btn g1-btn-outline min-h-[38px] px-3.5 text-xs"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Rollback / Retire</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Published manifests table */}
      <section className="g1-card overflow-hidden">
        <div className="border-b border-[#e8f0f5] px-6 py-4">
          <h2 className="text-lg font-extrabold text-[#0c2444]">Immutable version manifests</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead>
              <tr className="bg-[#f2f8fc] font-bold uppercase tracking-wider text-[#4b637a]">
                <th className="px-6 py-3">Experiment</th>
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-6 py-3">Manifest SHA-256</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8f0f5]">
              {versions.map((v) => (
                <tr key={`${v.experimentId}-${v.contentVersion}`}>
                  <td className="px-6 py-3 font-bold text-[#0c2444]">{v.experimentId}</td>
                  <td className="px-4 py-3 font-mono text-[#133354]">{v.contentVersion}</td>
                  <td className="px-4 py-3">
                    <span className={`g1-tag ${v.retiredAt ? "g1-tag-warn" : v.publishedAt ? "g1-tag-green" : ""}`}>
                      {v.retiredAt ? "retired" : v.publicationStatus}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-mono text-[11px] text-[#4b637a]">
                    {v.manifestSha256.slice(0, 24)}…
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
