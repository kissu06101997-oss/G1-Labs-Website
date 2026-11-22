"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Server, Users, Lock } from "lucide-react";
import { apiFetch } from "@/lib/client-api";

export interface SchoolAdminData {
  scope: "school";
  schoolName: string | null;
  roster: Array<{
    principalId: string;
    email: string;
    displayName: string;
    role: string;
    enabled: boolean;
    grade: number | null;
  }>;
  devices: Array<{
    deviceId: string;
    label: string;
    ramGb: number;
    gpuClass: string;
    webgl2Supported: boolean;
    networkProfileMbps: number;
  }>;
  auditEvents: Array<{
    eventId: string;
    actionType: string;
    occurredAt: string;
    retentionClass: string;
  }>;
}

export interface AggregateAdminData {
  scope: "district" | "state";
  districtName: string | null;
  suppressionThreshold: number;
  note: string;
  schools: Array<{
    schoolCode: string;
    schoolName: string;
    districtName: string;
    activeLearners: { value: number | null; suppressed: boolean; display: string };
    assignmentsPublished: number;
    submittedAssessments: { value: number | null; suppressed: boolean; display: string };
  }>;
}

export function AdminWorkspaceClient({
  data,
  currentPrincipalId,
}: {
  data: SchoolAdminData | AggregateAdminData;
  currentPrincipalId: string;
}) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function toggleEnabled(principalId: string, nextEnabled: boolean) {
    setBusyId(principalId);
    setNotice(null);
    try {
      const res = await apiFetch<{ updated?: boolean; detail?: string }>("/api/admin/overview", {
        method: "POST",
        body: { principalId, enabled: nextEnabled },
      });
      if (!res.ok) {
        setNotice(res.data.detail || "Unable to update account status.");
      } else {
        setNotice(`Account status updated and recorded in audit_event.`);
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  if (data.scope === "school") {
    return (
      <div className="space-y-6">
        <div>
          <div className="g1-eyebrow">School Administration</div>
          <h1 className="mt-2.5 text-3xl font-extrabold text-[#0c2444]">
            {data.schoolName || "School Administration"}
          </h1>
          <p className="mt-1 text-sm text-[#4b637a]">
            School-scoped roster controls, classroom device readiness inventory, and immutable
            security audit log.
          </p>
        </div>

        {notice && (
          <div role="status" className="rounded-xl border border-[#b4e6cf] bg-[#eafbf2] px-4 py-3 text-sm font-semibold text-[#046c49]">
            {notice}
          </div>
        )}

        <section className="g1-card overflow-hidden">
          <div className="flex items-center gap-2 border-b border-[#e8f0f5] px-6 py-4">
            <Users className="h-5 w-5 text-[#007875]" aria-hidden="true" />
            <h2 className="text-lg font-extrabold text-[#0c2444]">School roster &amp; role grants</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-[#f2f8fc] text-[11px] font-bold uppercase tracking-wider text-[#4b637a]">
                  <th className="px-6 py-3">Account (Synthetic)</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8f0f5]">
                {data.roster.map((r) => (
                  <tr key={r.principalId}>
                    <td className="px-6 py-3.5">
                      <div className="font-bold text-[#0c2444]">{r.displayName}</div>
                      <div className="font-mono text-xs text-[#4b637a]">{r.email}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="g1-tag">{r.role}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`g1-tag ${r.enabled ? "g1-tag-green" : "g1-tag-warn"}`}>
                        {r.enabled ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-6 py-3.5">
                      {r.principalId === currentPrincipalId ? (
                        <span className="text-xs text-[#4b637a]">Current admin</span>
                      ) : (
                        <button
                          type="button"
                          disabled={busyId === r.principalId}
                          onClick={() => toggleEnabled(r.principalId, !r.enabled)}
                          className="rounded-lg border border-[#c3d7e5] bg-white px-3 py-1.5 text-xs font-bold text-[#1a3b59] hover:bg-[#f2f8fc]"
                        >
                          {r.enabled ? "Disable" : "Re-enable"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="g1-card p-6">
            <div className="flex items-center gap-2">
              <Server className="h-5 w-5 text-[#0663ab]" aria-hidden="true" />
              <h2 className="text-lg font-extrabold text-[#0c2444]">Device readiness metadata</h2>
            </div>
            <ul className="mt-4 space-y-3">
              {data.devices.map((d) => (
                <li key={d.deviceId} className="rounded-xl border border-[#ddebf3] bg-[#f8fcff] p-3.5 text-xs">
                  <div className="font-bold text-[#0c2444]">{d.label}</div>
                  <div className="mt-1 text-[#4b637a]">
                    {d.ramGb} GB RAM · {d.gpuClass} · {d.networkProfileMbps} Mbps · WebGL2{" "}
                    {d.webgl2Supported ? "Yes" : "No"}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="g1-card p-6">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-[#046c49]" aria-hidden="true" />
              <h2 className="text-lg font-extrabold text-[#0c2444]">Recent school audit events</h2>
            </div>
            <ul className="mt-4 divide-y divide-[#e8f0f5] text-xs">
              {data.auditEvents.map((ev) => (
                <li key={ev.eventId} className="flex items-center justify-between gap-2 py-2.5">
                  <span className="font-mono font-bold text-[#0c2444]">{ev.actionType}</span>
                  <span className="text-[#4b637a]">
                    {new Date(ev.occurredAt).toLocaleString("en-IN")}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="g1-eyebrow">
          {data.scope === "district" ? "District Administration" : "State Programme Review"}
        </div>
        <h1 className="mt-2.5 text-3xl font-extrabold text-[#0c2444]">
          {data.scope === "district"
            ? `${data.districtName || "District"} — Aggregated School Roll-Up`
            : "Andhra Pradesh — State Aggregate Roll-Up"}
        </h1>
        <p className="mt-1.5 text-sm text-[#4b637a]">{data.note}</p>
      </div>

      <div className="g1-hint flex items-center gap-2.5">
        <Lock className="h-4 w-4 shrink-0 text-[#007875]" aria-hidden="true" />
        <span>
          <strong>Small-cell privacy suppression active (threshold &lt; {data.suppressionThreshold}):</strong>{" "}
          Cohorts below {data.suppressionThreshold} learners or submissions are automatically masked.
          Individual student records are never returned to district or state roles.
        </span>
      </div>

      <section className="g1-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#f2f8fc] text-[11px] font-bold uppercase tracking-wider text-[#4b637a]">
                <th className="px-6 py-3">School Code</th>
                <th className="px-4 py-3">School</th>
                <th className="px-4 py-3">District</th>
                <th className="px-4 py-3">Active Learners</th>
                <th className="px-4 py-3">Assignments</th>
                <th className="px-6 py-3">Submitted Assessments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8f0f5]">
              {data.schools.map((s) => (
                <tr key={s.schoolCode}>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-[#0c2444]">{s.schoolCode}</td>
                  <td className="px-4 py-4 font-bold text-[#0c2444]">{s.schoolName}</td>
                  <td className="px-4 py-4 text-[#4b637a]">{s.districtName}</td>
                  <td className="px-4 py-4">
                    <span className={s.activeLearners.suppressed ? "g1-tag g1-tag-warn" : "font-bold text-[#0c2444]"}>
                      {s.activeLearners.display}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-[#133354]">{s.assignmentsPublished}</td>
                  <td className="px-6 py-4">
                    <span className={s.submittedAssessments.suppressed ? "g1-tag g1-tag-warn" : "font-bold text-[#046c49]"}>
                      {s.submittedAssessments.display}
                    </span>
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
