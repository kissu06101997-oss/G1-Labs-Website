import Link from "next/link";
import {
  ArrowRight,
  Atom,
  FlaskConical,
  Leaf,
  MonitorCheck,
  SlidersHorizontal,
} from "lucide-react";
import { AppFooter } from "@/components/AppFooter";
import { AppHeader } from "@/components/AppHeader";
import { getCurrentSession, getRequestLocale } from "@/lib/auth";
import { getDictionary, getExperimentCopy } from "@/lib/i18n";
import type { LabSubject } from "@/lib/types";

const FEATURED_IDS = [
  { id: "AP-CHEM-10-2.3", subject: "chemistry" as LabSubject, grade: 10 },
  { id: "AP-PHYS-10-9.10", subject: "physics" as LabSubject, grade: 10 },
  { id: "AP-BIO-09-5.1", subject: "biology" as LabSubject, grade: 9 },
];

export default async function HomePage() {
  const [auth, locale] = await Promise.all([getCurrentSession(), getRequestLocale()]);
  const dict = getDictionary(locale);

  const subjectCards: Array<{
    key: LabSubject;
    href: string;
    bg: string;
    iconColor: string;
    linkColor: string;
    photo: string;
    Icon: typeof FlaskConical;
  }> = [
    {
      key: "chemistry",
      href: "/laboratories/chemistry",
      bg: "linear-gradient(155deg, #e7f8ff 0%, #c0e7fb 100%)",
      iconColor: "text-[#0671a8]",
      linkColor: "text-[#066596]",
      photo: "/assets/labs/chemistry_photo.jpg",
      Icon: FlaskConical,
    },
    {
      key: "physics",
      href: "/laboratories/physics",
      bg: "linear-gradient(155deg, #eef6ff 0%, #d2ecff 100%)",
      iconColor: "text-[#1662b5]",
      linkColor: "text-[#1359a3]",
      photo: "/assets/labs/physics_photo.jpg",
      Icon: Atom,
    },
    {
      key: "biology",
      href: "/laboratories/biology",
      bg: "linear-gradient(155deg, #edfff4 0%, #c9f4e0 100%)",
      iconColor: "text-[#04754f]",
      linkColor: "text-[#036a47]",
      photo: "/assets/labs/biology_photo.jpg",
      Icon: Leaf,
    },
  ];

  return (
    <>
      <AppHeader variant="public" locale={locale} auth={auth} />

      <main id="main-content" className="mx-auto w-full max-w-[1480px] flex-1 px-4 pb-12 pt-8 sm:px-8 lg:px-14 lg:pt-11">
        {/* Hero section matching 01_Homepage.png */}
        <section aria-labelledby="hero-heading" className="grid grid-cols-1 items-center gap-8 xl:grid-cols-12">
          <div className="xl:col-span-4">
            <div className="g1-eyebrow">{dict.home.eyebrow}</div>
            <h1
              id="hero-heading"
              className="mt-5 text-4xl font-extrabold tracking-tight text-[#0c2444] sm:text-[46px] sm:leading-[1.1]"
            >
              {dict.home.heroPrefix}{" "}
              <span className="text-[#0670b2]">{dict.subjects.chemistry.name}</span>,{" "}
              <span className="text-[#086cb5]">{dict.subjects.physics.name}</span>{" "}
              {dict.home.heroAnd}{" "}
              <span className="text-[#047852]">{dict.subjects.biology.name}</span>.
            </h1>
            <p className="mt-4 max-w-[440px] text-base leading-relaxed text-[#4b637a]">
              {dict.home.heroSubtitle}
            </p>
            <div className="mt-7">
              <Link
                href="/laboratories"
                className="g1-btn g1-btn-teal min-h-[50px] px-7 text-[15px]"
                data-testid="hero-explore-cta"
              >
                <span>{dict.home.exploreLabsCta}</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 xl:col-span-8">
            {subjectCards.map(({ key, href, bg, iconColor, linkColor, photo, Icon }) => {
              const info = dict.subjects[key];
              return (
                <Link
                  key={key}
                  href={href}
                  className="group relative flex min-h-[252px] flex-col justify-between overflow-hidden rounded-[22px] border border-white p-5 shadow-[0_12px_25px_rgba(39,123,175,0.11)] transition-transform duration-150 hover:-translate-y-0.5"
                  style={{ background: bg }}
                >
                  <div className="relative z-10 max-w-[132px]">
                    <div className={`mb-2 inline-flex ${iconColor}`} aria-hidden="true">
                      <Icon className="h-6 w-6" strokeWidth={2.2} />
                    </div>
                    <h2 className="text-[23px] font-extrabold tracking-tight text-[#0c2444]">
                      {info.name}
                    </h2>
                    <p className="mt-2 text-[13px] leading-snug text-[#2c4e6b]">
                      {info.shortDesc}
                    </p>
                  </div>

                  <div className={`relative z-10 mt-4 inline-flex items-center gap-1 text-xs font-extrabold ${linkColor}`}>
                    <span>{dict.home.exploreAction}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </div>

                  {/* Cropped laboratory subject photograph matching reference */}
                  <div
                    className="pointer-events-none absolute -right-6 bottom-0 h-[165px] w-[165px] overflow-hidden rounded-tl-[42%] opacity-95"
                    aria-hidden="true"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photo}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Non-clickable explanatory mode strip (blue Simulation vs green Experiment) */}
        <section
          aria-label={locale === "te-IN" ? "రెండు అభ్యాస మోడ్‌లు" : "Two learning modes"}
          className="mx-auto mt-8 grid max-w-[1280px] grid-cols-1 gap-5 md:grid-cols-2"
        >
          <div className="g1-mode-blue flex items-center gap-5 px-6 py-5">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#dff2ff] text-[#0663ab]"
              aria-hidden="true"
            >
              <MonitorCheck className="h-7 w-7" strokeWidth={2.1} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#0663ab]">
                {dict.home.simModeTitle}
              </h2>
              <p className="mt-1 text-sm text-[#2d4d67]">{dict.home.simModeDesc}</p>
            </div>
          </div>

          <div className="g1-mode-green flex items-center gap-5 px-6 py-5">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#dcf7ea] text-[#046c49]"
              aria-hidden="true"
            >
              <SlidersHorizontal className="h-7 w-7" strokeWidth={2.1} />
            </div>
            <div>
              <h2 className="text-xl font-extrabold tracking-tight text-[#046c49]">
                {dict.home.expModeTitle}
              </h2>
              <p className="mt-1 text-sm text-[#2a4f44]">{dict.home.expModeDesc}</p>
            </div>
          </div>
        </section>

        {/* Explore a practical — 3 approved pilot slices */}
        <section aria-labelledby="featured-practicals-heading" className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2
              id="featured-practicals-heading"
              className="text-2xl font-extrabold tracking-tight text-[#0c2444]"
            >
              {dict.home.explorePracticalHeading}
            </h2>
            <Link
              href="/laboratories"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#007875] hover:underline"
            >
              <span>{dict.home.browseAll}</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {FEATURED_IDS.map((item) => {
              const copy = getExperimentCopy(item.id, locale);
              const subjectName = dict.subjects[item.subject].name;
              const labelColor =
                item.subject === "biology"
                  ? "text-[#046c49]"
                  : item.subject === "physics"
                    ? "text-[#1359a3]"
                    : "text-[#066596]";

              return (
                <Link
                  key={item.id}
                  href={`/experiments/${item.id}`}
                  className="g1-card group flex min-h-[136px] overflow-hidden transition-transform duration-150 hover:-translate-y-0.5"
                >
                  <div className="w-[144px] shrink-0 bg-[#ebf7fc] sm:w-[158px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={copy.imagePath}
                      alt={copy.shortTitle}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <div className={`text-[11px] font-extrabold uppercase tracking-wider ${labelColor}`}>
                        {subjectName} · {dict.common.classWord} {item.grade}
                      </div>
                      <h3 className="mt-1.5 text-[16px] font-extrabold leading-snug text-[#0c2444]">
                        {copy.shortTitle}
                      </h3>
                      <p className="mt-1 text-xs text-[#4b637a]">{copy.activityLabel}</p>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-extrabold text-[#007875]">
                      <span>{dict.home.viewPractical}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      <AppFooter locale={locale} />
    </>
  );
}
