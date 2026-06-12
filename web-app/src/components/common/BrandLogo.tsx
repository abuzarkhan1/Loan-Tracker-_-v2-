import React from "react";
import { cn } from "../../lib/cn";

type BrandLogoProps = {
  showText?: boolean;
  compact?: boolean;
  markSize?: "sm" | "md" | "lg";
  className?: string;
};

export const BrandLogo: React.FC<BrandLogoProps> = ({
  showText = true,
  compact = false,
  markSize = "md",
  className,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const dotSizeClasses = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  const dotSize = dotSizeClasses[markSize];

  return (
    <div className={cn("inline-flex min-w-0 items-center gap-3", className)}>
      {/* Premium 4-dots logo element from public-website */}
      <div className={cn("relative flex items-center justify-center shrink-0", sizeClasses[markSize])}>
        <span className={cn("absolute rounded-full bg-white top-0 left-1/2 transform -translate-x-1/2 opacity-80", dotSize)} />
        <span className={cn("absolute rounded-full bg-white left-0 top-1/2 transform -translate-y-1/2 opacity-80", dotSize)} />
        <span className={cn("absolute rounded-full bg-white right-0 top-1/2 transform -translate-y-1/2 opacity-80", dotSize)} />
        <span className={cn("absolute rounded-full bg-white bottom-0 left-1/2 transform -translate-x-1/2 opacity-80", dotSize)} />
      </div>
      {showText && !compact ? (
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-sm font-semibold tracking-tight text-white sm:text-base">
            Loan<span className="text-white/60">Tracker</span>
          </span>
        </span>
      ) : null}
    </div>
  );
};

export default BrandLogo;
