import React, { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "muted" | "peach" | "mint" | "yellow";
  size?: "sm" | "md";
  outlined?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  outlined = false,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-full tracking-wider transition-colors duration-150 uppercase";

  const variants = {
    primary: outlined 
      ? "border border-appPrimary text-appPrimary bg-transparent" 
      : "bg-appPrimary bg-opacity-10 text-appPrimary",
    success: outlined 
      ? "border border-appSuccess text-appSuccess bg-transparent" 
      : "bg-appSuccess bg-opacity-10 text-appSuccess",
    warning: outlined 
      ? "border border-appWarning text-appWarning bg-transparent" 
      : "bg-appWarning bg-opacity-10 text-appWarning",
    danger: outlined 
      ? "border border-appDanger text-appDanger bg-transparent" 
      : "bg-appDanger bg-opacity-10 text-appDanger",
    muted: outlined 
      ? "border border-appMuted text-appMuted bg-transparent" 
      : "bg-appMuted bg-opacity-10 text-appMuted",
    peach: outlined 
      ? "border border-[#f36f56] text-[#f36f56] bg-transparent" 
      : "bg-[#ffe4d3] text-[#d95441] dark:bg-opacity-10 dark:text-[#f36f56]",
    mint: outlined 
      ? "border border-[#1b7d62] text-[#1b7d62] bg-transparent" 
      : "bg-[#d9f1d7] text-[#1b7d62] dark:bg-opacity-10 dark:text-[#d9f1d7]",
    yellow: outlined 
      ? "border border-[#ffd56a] text-[#ffd56a] bg-transparent" 
      : "bg-[#ffd56a] bg-opacity-20 text-[#8a6d1f] dark:text-[#ffd56a]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-2.5 py-1 text-xs",
  };

  return (
    <span
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
