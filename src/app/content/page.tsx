import { redirect } from "next/navigation";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { ContentWorkspaceClient } from "@/components/ContentWorkspaceClient";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { getApCorpusSummary } from "@/lib/catalog";
import { query } from "@/lib/db";
import type { ExperimentDefinition } from "@/lib/types";

export default async function ContentReviewPage() {
  const [auth, locale] = await Promise.all([getCurrentSession(), getRequestLocale()]);
  if (!auth) redirect("/sign-in?next=/content");
  if (auth.role !== "content_editor" && auth.role !== "content_reviewer" && auth.role !== "state_admin") {
    redirect("/");
  }

  const [versionsRes, reviewsRes] = await Promise.all([
    query<{
      experiment_id: string;
      content_version: string;
      subject: string;
      manifest_digest: string;
      definition: ExperimentDefinition;
      published_at: Date | null;
      retired_at: Date | null;
    }>(
      `SELECT experiment_id, content_version, subject::text, manifest_digest, definition, published_at, retired_at
       FROM experiment_version
       ORDER BY experiment_id ASC, content_version DESC`
    ),
    query<{
      review_id: string;
      experiment_id: string;
      content_version: string;
      editor_principal_id: string;
      editor_name: string;
      reviewer_name: string | null;
      status: string;
      notes: string | null;
      submitted_at: Date;
    }>(
      `SELECT
         er.review_id, er.experiment_id, er.content_version, er.editor_principal_id,
         ed.display_name AS editor_name, rv.display_name AS reviewer_name,
         er.status, er.notes, er.submitted_at
       FROM editorial_review er
       JOIN principal_credential ed ON ed.principal_id = er.editor_principal_id
       LEFT JOIN principal_credential rv ON rv.principal_id = er.reviewer_principal_id
       ORDER BY er.submitted_at DESC`
    ),
  ]);

  return (
    <>
      <AppHeader variant="content" locale={locale} auth={auth} />
      <main id="main-content" className="mx-auto w-full max-w-[1360px] flex-1 px-4 py-9 sm:px-8 lg:px-14">
        <ContentWorkspaceClient
          role={auth.role}
          principalId={auth.principalId}
          apCorpusSummary={getApCorpusSummary()}
          versions={versionsRes.rows.map((v) => ({
            experimentId: v.experiment_id,
            contentVersion: v.content_version,
            subject: v.subject,
            manifestSha256: v.manifest_digest,
            publicationStatus: v.definition.publicationStatus,
            title: v.definition.title,
            publishedAt: v.published_at ? v.published_at.toISOString() : null,
            retiredAt: v.retired_at ? v.retired_at.toISOString() : null,
          }))}
          reviews={reviewsRes.rows.map((r) => ({
            reviewId: r.review_id,
            experimentId: r.experiment_id,
            contentVersion: r.content_version,
            editorPrincipalId: r.editor_principal_id,
            editorName: r.editor_name,
            reviewerName: r.reviewer_name,
            status: r.status,
            notes: r.notes,
            submittedAt: r.submitted_at.toISOString(),
          }))}
        />
      </main>
      <AppFooter locale={locale} />
    </>
  );
}
