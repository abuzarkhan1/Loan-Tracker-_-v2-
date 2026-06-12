import { Link } from "react-router-dom";
import { APP_CONFIG } from "../../config/app.config";
import { cn } from "../../utils/cn";

export const BrandMark = ({ compact = false, className }: { compact?: boolean; className?: string }) => {
  return (
    <Link to="/" className={cn("inline-flex min-w-0 items-center gap-3", className)} aria-label={`${APP_CONFIG.appName} home`}>
      {/* Premium 4-dots logo element from the design component */}
      <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white top-0 left-1/2 transform -translate-x-1/2 opacity-80" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white left-0 top-1/2 transform -translate-y-1/2 opacity-80" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white right-0 top-1/2 transform -translate-y-1/2 opacity-80" />
        <span className="absolute w-1.5 h-1.5 rounded-full bg-white bottom-0 left-1/2 transform -translate-x-1/2 opacity-80" />
      </div>
      {compact ? null : (
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold tracking-tight text-white sm:text-base">
            Loan<span className="text-white/60">Tracker</span>
          </span>
        </span>
      )}
    </Link>
  );
};
