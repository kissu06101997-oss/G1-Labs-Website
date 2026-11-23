import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  compact?: boolean;
}

/**
 * Renders the ONE canonical G1 Virtua Labs logo cropped directly from
 * 00_APPROVED_VISUAL_ANCHOR.png (278x50 px). Never redraw, skew, rotate,
 * recolor or replace with an independent SVG icon.
 */
export function BrandLogo({ href = "/", compact = false }: BrandLogoProps) {
  const width = compact ? 189 : 222;
  const height = compact ? 34 : 40;

  return (
    <Link
      href={href}
      className="inline-flex shrink-0 items-center rounded-lg focus-visible:outline-offset-4"
      aria-label="G1 Virtua Labs — Home"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/g1-canonical-logo.png"
        alt="G1 Virtua Labs"
        width={width}
        height={height}
        className={`block h-auto object-contain select-none ${
          compact
            ? "w-[144px] sm:w-[172px] lg:w-[189px]"
            : "w-[144px] sm:w-[164px] md:w-[174px] lg:w-[222px]"
        }`}
        style={{ aspectRatio: "278 / 50" }}
      />
    </Link>
  );
}
