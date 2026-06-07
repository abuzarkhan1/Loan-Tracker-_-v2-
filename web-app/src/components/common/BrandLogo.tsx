import React from "react";
import { cn } from "../../lib/cn";

type BrandLogoProps = {
  showText?: boolean;
  compact?: boolean;
  markSize?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-9 w-9",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  showText = true,
  compact = false,
  markSize = "md",
  className,
}) => {
  const gradientId = React.useId().replace(/:/g, "");
  const markGradientId = `loanTrackerMark-${gradientId}`;
  const paperGradientId = `loanTrackerPaper-${gradientId}`;

  return (
    <div className={cn("flex min-w-0 items-center gap-3", className)}>
      <svg
        viewBox="0 0 64 64"
        role="img"
        aria-label="Loan Tracker"
        className={cn("shrink-0 drop-shadow-sm", sizeClass[markSize])}
      >
        <defs>
          <linearGradient id={markGradientId} x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="var(--primary)" />
            <stop offset="1" stopColor="#a259ff" />
          </linearGradient>
          <linearGradient id={paperGradientId} x1="18" y1="14" x2="45" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#f6f9fc" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="12" fill={`url(#${markGradientId})`} />
        <path
          d="M20 16.5h19.4c1.4 0 2.7.6 3.7 1.6l4.3 4.4c.9.9 1.4 2.2 1.4 3.5v21.5c0 2.2-1.8 4-4 4H20c-2.2 0-4-1.8-4-4v-27c0-2.2 1.8-4 4-4Z"
          fill={`url(#${paperGradientId})`}
        />
        <path d="M39 17v7.5c0 1.1.9 2 2 2h7.3" fill="none" stroke="#635bff" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M24 29h14M24 36h10" stroke="#697386" strokeWidth="3" strokeLinecap="round" />
        <circle cx="43.5" cy="42.5" r="9.5" fill="#0a2540" />
        <path d="M39.5 42.5h8M43.5 38.5v8" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
        <path d="M17.5 23.5c-3.2 2.1-5.1 5.7-5.1 9.8 0 4.7 2.7 8.9 6.7 10.9" stroke="#ffffff" strokeOpacity=".72" strokeWidth="2.2" strokeLinecap="round" />
      </svg>

      {showText ? (
        <span className="min-w-0 select-none">
          <span className={cn("block truncate font-bold tracking-tight text-appText", compact ? "text-sm" : "text-base")}>
            Loan<span className="text-appPrimary">Tracker</span>
          </span>
          {!compact ? (
            <span className="block truncate text-xs font-medium text-appMuted">
              Personal finance
            </span>
          ) : null}
        </span>
      ) : null}
    </div>
  );
};

export default BrandLogo;
