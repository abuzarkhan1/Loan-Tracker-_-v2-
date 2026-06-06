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
  const baseStyles = "rounded-[24px] transition-all duration-200 overflow-hidden";
  
  const variants = {
    flat: "bg-appBgSoft/80 border border-appBorder/35",
    bordered: "bg-appCard border border-appBorder shadow-sm",
    elevated: "bg-appCard shadow-elevated border border-appBorder/50",
    glass: "glass-card",
  };

  const paddings = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  return (
    <div
      className={cn(
        baseStyles,
        variants[variant],
        paddings[padding],
        hoverable && "hover:-translate-y-0.5 hover:border-appPrimary/25 hover:shadow-soft cursor-pointer active:translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
