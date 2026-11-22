"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound, Loader2, ShieldCheck } from "lucide-react";
import type { Locale } from "@/lib/types";

interface SignInFormProps {
  locale: Locale;
  nextPath?: string;
  roleHint?: string;
  showSyntheticFixtures?: boolean;
}

const SYNTHETIC_ACCOUNTS = [
  { label: "Student A (School A — Guntur, Class 10-A)", email: "student.a@school-guntur-01.test", role: "student" },
  { label: "Student B (School B — Vijayawada, Class 10-A)", email: "student.b@school-vijayawada-02.test", role: "student" },
  { label: "Teacher A (School A — Guntur, Class 10-A)", email: "teacher.a@school-guntur-01.test", role: "teacher" },
  { label: "Teacher B (School B — Vijayawada, Class 10-A)", email: "teacher.b@school-vijayawada-02.test", role: "teacher" },
  { label: "School Admin (School A — Guntur)", email: "schooladmin.a@school-guntur-01.test", role: "school_admin" },
  { label: "District Admin (Guntur District)", email: "district.guntur@ap-edu.test", role: "district_admin" },
  { label: "State Admin (Andhra Pradesh)", email: "state.ap@ap-edu.test", role: "state_admin" },
  { label: "Content Editor (Editorial Workflow)", email: "editor@g1virtualabs.test", role: "content_editor" },
  { label: "Content Reviewer (Independent Two-Person Sign-Off)", email: "reviewer@g1virtualabs.test", role: "content_reviewer" },
];

export function SignInForm({
  locale,
  nextPath,
  roleHint,
  showSyntheticFixtures = false,
}: SignInFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState(
    roleHint === "teacher" ? "teacher.a@school-guntur-01.test" : ""
  );
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isTe = locale === "te-IN";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/auth/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        authenticated?: boolean;
        redirectTo?: string;
        detail?: string;
      };

      if (!res.ok || !data.authenticated) {
        setError(data.detail || "Unable to sign in with those credentials.");
        setSubmitting(false);
        return;
      }

      const safeNext =
        nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//")
          ? nextPath
          : data.redirectTo || "/student";

      router.push(safeNext);
      router.refresh();
    } catch {
      setError("Network error while signing in.");
      setSubmitting(false);
    }
  }

  return (
    <div className={showSyntheticFixtures ? "grid grid-cols-1 gap-8 lg:grid-cols-12" : "mx-auto max-w-xl"}>
      <section aria-labelledby="signin-heading" className={`g1-card p-7 ${showSyntheticFixtures ? "lg:col-span-6" : ""}`}>
        <div className="g1-eyebrow">
          {isTe ? "పాఠశాల ఖాతా ప్రవేశం" : "School account sign-in"}
        </div>
        <h1
          id="signin-heading"
          className="mt-3 text-3xl font-extrabold tracking-tight text-[#0c2444]"
        >
          {isTe ? "G1 Virtua Labs లో సైన్ ఇన్ చేయండి" : "Sign in to G1 Virtua Labs"}
        </h1>
        <p className="mt-2 text-sm text-[#4b637a]">
          {isTe
            ? "మీ స్థానిక పాఠశాల ఖాతాతో విద్యార్థి, ఉపాధ్యాయ లేదా నిర్వహణ వర్క్‌స్పేస్‌ను తెరవండి."
            : "Access your role-scoped student, teacher, administration, or editorial workspace."}
        </p>

        {error && (
          <div
            role="alert"
            className="mt-5 rounded-xl border border-[#fecdca] bg-[#fef3f2] px-4 py-3 text-sm font-semibold text-[#b42318]"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="signin-email"
              className="block text-sm font-bold text-[#133354]"
            >
              {isTe ? "ఖాతా ఇమెయిల్" : "School account email"}
            </label>
            <input
              id="signin-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student.a@school-guntur-01.test"
              className="mt-1.5 h-12 w-full rounded-xl border border-[#c3d7e5] bg-[#f8fcff] px-4 text-sm text-[#0c2444]"
            />
          </div>

          <div>
            <label
              htmlFor="signin-password"
              className="block text-sm font-bold text-[#133354]"
            >
              {isTe ? "పాస్‌వర్డ్" : "Password"}
            </label>
            <input
              id="signin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 h-12 w-full rounded-xl border border-[#c3d7e5] bg-[#f8fcff] px-4 text-sm text-[#0c2444]"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="g1-btn g1-btn-teal w-full min-h-[48px]"
            data-testid="signin-submit"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <KeyRound className="h-4 w-4" aria-hidden="true" />
            )}
            <span>{isTe ? "సైన్ ఇన్" : "Sign in"}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </form>

        <div className="g1-hint mt-6 flex items-start gap-2.5">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#007875]" aria-hidden="true" />
          <span>
            {isTe
              ? "సెషన్ కుకీలు HTTP-only మరియు server-verified RBAC తో రక్షించబడతాయి. నిజమైన విద్యార్థుల వ్యక్తిగత డేటా సేకరించబడదు."
              : "Sessions use server-verified HTTP-only cookies with CSRF protection and school-scoped role enforcement. No real student data is collected."}
          </span>
        </div>
      </section>

      {/* Transparent local synthetic test roster helper — strictly gated by ALLOW_LOCAL_SYNTHETIC_FIXTURES */}
      {showSyntheticFixtures && (
        <aside aria-labelledby="synthetic-roster-heading" className="g1-card p-7 lg:col-span-6">
        <span className="g1-tag g1-tag-blue">Local QA Fixtures · Synthetic Only</span>
        <h2
          id="synthetic-roster-heading"
          className="mt-3 text-xl font-extrabold text-[#0c2444]"
        >
          {isTe ? "స్థానిక పరీక్షా ఖాతాలు" : "Seeded local synthetic accounts"}
        </h2>
        <p className="mt-1.5 text-xs leading-relaxed text-[#4b637a]">
          Select any seeded local role below to prefill credentials for testing role isolation,
          two-mode launches, teacher assignment publishing, and editorial sign-off. All accounts
          share the local fixture password <code className="rounded bg-[#eef6fb] px-1.5 py-0.5 font-mono text-[#0c2444]">G1LocalTest!2026</code>.
        </p>

        <ul className="mt-4 divide-y divide-[#e8f0f5] rounded-2xl border border-[#ddebf3]">
          {SYNTHETIC_ACCOUNTS.map((acc) => (
            <li key={acc.email} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
              <div>
                <div className="text-xs font-extrabold text-[#0c2444]">{acc.label}</div>
                <div className="font-mono text-[11px] text-[#4b637a]">{acc.email}</div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEmail(acc.email);
                  setPassword("G1LocalTest!2026");
                  setError(null);
                }}
                className="rounded-lg border border-[#c3d7e5] bg-white px-3 py-1.5 text-xs font-bold text-[#007875] hover:bg-[#eef8ff]"
                data-testid={`fill-${acc.email}`}
              >
                Use fixture
              </button>
            </li>
          ))}
        </ul>
      </aside>
      )}
    </div>
  );
}
