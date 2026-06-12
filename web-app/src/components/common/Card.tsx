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
  const baseStyles = "premium-card overflow-hidden";

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
        paddings[padding],
        hoverable && "cursor-pointer hover:-translate-y-0.5 hover:border-white/20 hover:shadow-level3 active:translate-y-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
