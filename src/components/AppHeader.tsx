"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { LocaleToggle } from "./LocaleToggle";
import { apiFetch } from "@/lib/client-api";
import { getDictionary } from "@/lib/i18n";
import type { AuthContext, Locale } from "@/lib/types";

export type HeaderVariant = "public" | "student" | "teacher" | "admin" | "content" | "player";

interface AppHeaderProps {
  variant?: HeaderVariant;
  locale: Locale;
  auth: Pick<AuthContext, "role" | "displayName" | "schoolName"> | null;
  playerMeta?: {
    subtitle: string;
    exitHref: string;
  };
}

export function AppHeader({
  variant = "public",
  locale,
  auth,
  playerMeta,
}: AppHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();
  const dict = getDictionary(locale);
  const isTe = locale === "te-IN";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  // W13: Close mobile drawer on Escape key and return focus to toggle button
  useEffect(() => {
    if (!mobileOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMobileOpen(false);
        menuBtnRef.current?.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await apiFetch("/api/auth/sign-out", { method: "POST" });
      router.push("/");
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  }

  const workspaceHref =
    auth?.role === "student"
      ? "/student"
      : auth?.role === "teacher"
        ? "/teacher"
        : auth?.role === "content_editor" || auth?.role === "content_reviewer"
          ? "/content"
          : "/admin";

  const roleBadgeLabel =
    auth?.role === "student"
      ? isTe
        ? "విద్యార్థి ఖాతా"
        : "Student"
      : auth?.role === "teacher"
        ? isTe
          ? "ఉపాధ్యాయ ఖాతా"
          : "Teacher"
        : auth?.role === "content_editor"
          ? isTe
            ? "ఎడిటర్"
            : "Editor"
          : auth?.role === "content_reviewer"
            ? isTe
              ? "సమీక్షకుడు"
              : "Reviewer"
            : auth?.role === "district_admin"
              ? isTe
                ? "జిల్లా అడ్మిన్"
                : "District admin"
              : auth?.role === "state_admin"
                ? isTe
                  ? "రాష్ట్ర అడ్మిన్"
                  : "State admin"
                : isTe
                  ? "పాఠశాల అడ్మిన్"
                  : "School admin";

  if (variant === "player") {
    return (
      <header className="sticky top-0 z-30 border-b border-[#d9e7f0] bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-10">
          <div className="flex min-w-0 items-center gap-4">
            <BrandLogo href={auth ? workspaceHref : "/"} compact />
            {playerMeta?.subtitle && (
              <span className="hidden truncate text-sm font-semibold text-[#4b637a] md:inline">
                {playerMeta.subtitle}
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <LocaleToggle locale={locale} />
            <Link
              href={playerMeta?.exitHref ?? (auth ? workspaceHref : "/laboratories")}
              className="g1-btn g1-btn-outline min-h-[40px] whitespace-nowrap px-3.5 text-xs sm:px-4 sm:text-sm"
            >
              {dict.nav.exitLab}
            </Link>
          </div>
        </div>
      </header>
    );
  }

  const navItems: Array<{ href: string; label: string; active: boolean }> =
    variant === "student"
      ? [
          { href: "/student", label: dict.nav.dashboard, active: pathname === "/student" },
          { href: "/student#assignments", label: dict.nav.assignments, active: false },
          { href: "/student#results", label: dict.nav.results, active: false },
          { href: "/help", label: dict.nav.help, active: pathname === "/help" },
        ]
      : variant === "teacher"
        ? [
            { href: "/teacher", label: dict.nav.classes, active: pathname === "/teacher" },
            {
              href: "/teacher/assignments",
              label: dict.nav.assignments,
              active: pathname.startsWith("/teacher/assignments"),
            },
            {
              href: "/teacher/reports",
              label: dict.nav.reports,
              active: pathname.startsWith("/teacher/reports"),
            },
            {
              href: "/laboratories",
              label: dict.nav.library,
              active: pathname.startsWith("/laboratories"),
            },
          ]
        : variant === "admin"
          ? [
              { href: "/admin", label: dict.nav.admin, active: pathname === "/admin" },
              {
                href: "/laboratories",
                label: dict.nav.laboratories,
                active: pathname.startsWith("/laboratories"),
              },
              { href: "/help", label: dict.nav.help, active: pathname === "/help" },
            ]
          : variant === "content"
            ? [
                { href: "/content", label: dict.nav.content, active: pathname === "/content" },
                {
                  href: "/laboratories",
                  label: dict.nav.laboratories,
                  active: pathname.startsWith("/laboratories"),
                },
                { href: "/help", label: dict.nav.help, active: pathname === "/help" },
              ]
            : [
                {
                  href: "/laboratories",
                  label: dict.nav.laboratories,
                  active:
                    pathname.startsWith("/laboratories") || pathname.startsWith("/experiments"),
                },
                {
                  href: auth?.role === "teacher" ? "/teacher" : "/sign-in?role=teacher",
                  label: dict.nav.forTeachers,
                  active: pathname.startsWith("/teacher"),
                },
                { href: "/help", label: dict.nav.help, active: pathname === "/help" },
              ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#ddeaf2] bg-white/96 backdrop-blur-sm">
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between gap-2 px-3 sm:px-5 lg:gap-5 lg:px-12">
        <BrandLogo href="/" />

        {/* Desktop & Tablet navigation — calibrated so 768px NEVER clips Sign in (W07) */}
        <nav
          aria-label="Primary navigation"
          className="hidden min-w-0 items-center gap-2 md:flex lg:gap-7"
        >
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={`whitespace-nowrap rounded-lg px-2 py-1.5 text-xs font-bold transition-colors lg:text-sm ${
                item.active
                  ? "text-[#007875]"
                  : "text-[#233c56] hover:text-[#007875]"
              }`}
              aria-current={item.active ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex lg:gap-3">
          <LocaleToggle locale={locale} />
          {auth ? (
            <div className="flex items-center gap-2">
              <Link
                href={workspaceHref}
                className="inline-flex min-h-[40px] items-center whitespace-nowrap rounded-xl bg-[#e5f7fb] px-3 py-1.5 text-xs font-extrabold tracking-wide text-[#0b6878] transition-colors hover:bg-[#d7f1f8]"
              >
                {roleBadgeLabel}
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                className="inline-flex min-h-[40px] items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#7894aa] bg-white px-2.5 text-xs font-bold text-[#0c2444] hover:bg-[#f5faff] lg:px-3"
                aria-label={dict.nav.signOut}
              >
                <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{dict.nav.signOut}</span>
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              data-testid="header-signin-link"
              className="g1-btn g1-btn-outline min-h-[40px] whitespace-nowrap px-3.5 text-xs lg:px-5 lg:text-sm"
            >
              {dict.nav.signIn}
            </Link>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex shrink-0 items-center gap-1.5 md:hidden">
          <LocaleToggle locale={locale} />
          <button
            ref={menuBtnRef}
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-[#7894aa] bg-white text-[#0c2444]"
            aria-expanded={mobileOpen}
            aria-controls="g1-mobile-nav-drawer"
            aria-label={
              mobileOpen
                ? isTe
                  ? "నావిగేషన్ మెనూ మూసివేయి"
                  : "Close navigation menu"
                : isTe
                  ? "నావిగేషన్ మెనూ తెరువు"
                  : "Open navigation menu"
            }
            data-testid="mobile-menu-toggle"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer (W13: Escape closes, aria-current matches desktop) */}
      {mobileOpen && (
        <div
          id="g1-mobile-nav-drawer"
          data-testid="mobile-nav-drawer"
          className="border-t border-[#e6f0f6] bg-white px-4 py-4 shadow-md md:hidden"
        >
          <nav aria-label="Mobile navigation" className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                aria-current={item.active ? "page" : undefined}
                className={`rounded-xl px-3.5 py-2.5 text-sm font-bold ${
                  item.active ? "bg-[#e9f8fb] text-[#007875]" : "text-[#233c56]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 border-t border-[#e6f0f6] pt-3">
              {auth ? (
                <div className="flex flex-col gap-2">
                  <Link
                    href={workspaceHref}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl bg-[#e5f7fb] px-3.5 py-2.5 text-sm font-bold text-[#0b6878]"
                  >
                    {roleBadgeLabel} — {auth.displayName}
                  </Link>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="g1-btn g1-btn-outline w-full justify-center"
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    <span>{dict.nav.signOut}</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setMobileOpen(false)}
                  className="g1-btn g1-btn-teal w-full justify-center"
                >
                  {dict.nav.signIn}
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
