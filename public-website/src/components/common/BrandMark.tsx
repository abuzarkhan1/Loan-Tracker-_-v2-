import { Link } from "react-router-dom";
import { useId } from "react";
import { APP_CONFIG } from "../../config/app.config";
import { cn } from "../../utils/cn";

export const BrandMark = ({ compact = false, className }: { compact?: boolean; className?: string }) => {
  const id = useId().replace(/:/g, "");
  const gradientId = `publicLoanTrackerMark-${id}`;
  const paperGradientId = `publicLoanTrackerPaper-${id}`;

  return (
    <Link to="/" className={cn("inline-flex min-w-0 items-center gap-3", className)} aria-label={`${APP_CONFIG.appName} home`}>
      <svg viewBox="0 0 64 64" role="img" aria-label={APP_CONFIG.appName} className="size-10 shrink-0 drop-shadow-sm">
        <defs>
          <linearGradient id={gradientId} x1="10" y1="6" x2="54" y2="58" gradientUnits="userSpaceOnUse">
            <stop stopColor="rgb(var(--color-primary))" />
            <stop offset="1" stopColor="#a259ff" />
          </linearGradient>
          <linearGradient id={paperGradientId} x1="18" y1="14" x2="45" y2="50" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#f6f9fc" />
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="56" height="56" rx="12" fill={`url(#${gradientId})`} />
        <path d="M20 16.5h19.4c1.4 0 2.7.6 3.7 1.6l4.3 4.4c.9.9 1.4 2.2 1.4 3.5v21.5c0 2.2-1.8 4-4 4H20c-2.2 0-4-1.8-4-4v-27c0-2.2 1.8-4 4-4Z" fill={`url(#${paperGradientId})`} />
        <path d="M39 17v7.5c0 1.1.9 2 2 2h7.3" fill="none" stroke="#635bff" strokeWidth="2.2" strokeLinecap="round" />
        <path d="M24 29h14M24 36h10" stroke="#697386" strokeWidth="3" strokeLinecap="round" />
        <circle cx="43.5" cy="42.5" r="9.5" fill="#0a2540" />
        <path d="M39.5 42.5h8M43.5 38.5v8" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      {compact ? null : (
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold text-dark sm:text-base">
            Loan<span className="text-primary">Tracker</span>
          </span>
          <span className="block truncate text-xs font-medium text-muted max-[390px]:hidden">Personal finance clarity</span>
        </span>
      )}
    </Link>
  );
};
