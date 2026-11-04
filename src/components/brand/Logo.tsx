import React from "react";
import Link from "next/link";

interface MonogramProps {
  size?: number;
  className?: string;
  color?: string;
  accentColor?: string;
}

/**
 * Geometric H+A Monogram
 * Two strong vertical pillars (H) with an interconnected inverted V / tent (A)
 * and horizontal bridge.
 */
export function HAMonogram({
  size = 36,
  className = "",
  color = "currentColor",
  accentColor = "#DC552C",
}: MonogramProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 ${className}`}
      aria-label="HUSH ARCHIVE H+A Monogram"
    >
      {/* Subtle background container plate for archival seal look */}
      <rect
        x="2"
        y="2"
        width="96"
        height="96"
        rx="8"
        fill="currentColor"
        fillOpacity="0.04"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeOpacity="0.15"
      />

      {/* Left Pillar of H */}
      <path
        d="M 16 16 H 32 V 84 H 16 Z"
        fill={color}
      />

      {/* Right Pillar of H */}
      <path
        d="M 68 16 H 84 V 84 H 68 Z"
        fill={color}
      />

      {/* A Apex and Interconnected Inverted V diagonals */}
      <path
        d="M 50 16 L 68 54 H 54 L 50 44 L 46 54 H 32 L 50 16 Z"
        fill={color}
      />

      {/* Archival Crossbar connecting pillars (H crossbar & A base) */}
      <path
        d="M 32 50 H 68 V 62 H 32 Z"
        fill={color}
      />

      {/* Discovery Orange accent diamond in the center negative space */}
      <polygon
        points="50,68 56,76 50,84 44,76"
        fill={accentColor}
      />
    </svg>
  );
}

interface LogoProps {
  variant?: "horizontal" | "stacked" | "symbol-only" | "compact";
  size?: "sm" | "md" | "lg";
  withTagline?: boolean;
  className?: string;
  linkToHome?: boolean;
}

export function Logo({
  variant = "horizontal",
  size = "md",
  withTagline = false,
  className = "",
  linkToHome = true,
}: LogoProps) {
  const iconSizes = {
    sm: 28,
    md: 36,
    lg: 48,
  };

  const textSizes = {
    sm: "text-base tracking-widest",
    md: "text-lg md:text-xl tracking-wider",
    lg: "text-2xl md:text-3xl tracking-widest",
  };

  const content = (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Monogram */}
      <HAMonogram size={iconSizes[size]} color="#363062" accentColor="#DC552C" />

      {variant !== "symbol-only" && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-semibold font-display text-deep-archive uppercase ${textSizes[size]}`}
              style={{
                fontFamily:
                  "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
                letterSpacing: "0.12em",
              }}
            >
              Hush Archive
            </span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-discovery-orange" />
          </div>
          {withTagline && (
            <span className="text-[10px] md:text-xs font-mono text-dusty-violet tracking-tight">
              A catalogue of internet curiosities
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link
        href="/"
        className="group inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-deep-archive rounded-md"
        title="HUSH ARCHIVE — Home"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export function CompactMobileLogo() {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <HAMonogram size={28} color="#363062" accentColor="#DC552C" />
      <span
        className="font-bold text-sm text-deep-archive tracking-wider uppercase font-display"
        style={{
          fontFamily:
            "'Bahnschrift', 'Bahnschrift SemiBold', 'DIN Alternate', sans-serif",
        }}
      >
        HUSH
      </span>
    </Link>
  );
}

export default Logo;
