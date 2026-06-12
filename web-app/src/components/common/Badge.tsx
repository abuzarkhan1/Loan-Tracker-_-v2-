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
  const baseStyles = "inline-flex items-center justify-center rounded-full border font-medium transition-colors duration-150";

  const variants = {
    primary: outlined 
      ? "border border-appPrimary text-appPrimary bg-transparent" 
      : "border-appPrimary/15 bg-appPrimary/10 text-appPrimary",
    success: outlined 
      ? "border border-appSuccess text-appSuccess bg-transparent" 
      : "border-appSuccess/15 bg-appSuccess/10 text-appSuccess",
    warning: outlined 
      ? "border border-appWarning text-appWarning bg-transparent" 
      : "border-appWarning/20 bg-appWarning/10 text-appWarning",
    danger: outlined 
      ? "border border-appDanger text-appDanger bg-transparent" 
      : "border-appDanger/15 bg-appDanger/10 text-appDanger",
    muted: outlined 
      ? "border border-appMuted text-appMuted bg-transparent" 
      : "border-appBorder bg-appMuted/10 text-appMuted",
    peach: outlined 
      ? "border border-appDanger text-appDanger bg-transparent" 
      : "border-appDanger/15 bg-appDanger/10 text-appDanger",
    mint: outlined 
      ? "border border-appSuccess text-appSuccess bg-transparent" 
      : "border-appSuccess/15 bg-appSuccess/10 text-appSuccess",
    yellow: outlined 
      ? "border border-appWarning text-appWarning bg-transparent" 
      : "border-appWarning/20 bg-appWarning/10 text-appWarning",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs leading-4",
    md: "px-3 py-1 text-[13px] leading-5",
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
