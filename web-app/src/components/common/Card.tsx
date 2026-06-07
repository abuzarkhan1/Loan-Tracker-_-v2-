import React, { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "flat" | "bordered" | "elevated" | "glass";
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = "bordered",
  hoverable = false,
  padding = "md",
  ...props
}) => {
  const baseStyles = "rounded-xl transition-all duration-200 overflow-hidden";
  
  const variants = {
    flat: "border border-appBorder bg-appBgSoft",
    bordered: "border border-appBorder bg-appCard shadow-level1",
    elevated: "border border-appBorder bg-appCard shadow-elevated",
    glass: "glass-card",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-6",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverable && "cursor-pointer hover:-translate-y-0.5 hover:border-appPrimary/50 hover:shadow-level2 active:translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
