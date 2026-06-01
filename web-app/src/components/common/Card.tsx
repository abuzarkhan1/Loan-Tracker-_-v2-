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
  const baseStyles = "rounded-2xl transition-all duration-200 overflow-hidden";
  
  const variants = {
    flat: "bg-appBgSoft",
    bordered: "bg-appCard border border-appBorder shadow-sm",
    elevated: "bg-appCard shadow-soft border border-appBorder/40",
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
        hoverable && "hover:shadow-md hover:scale-[1.005] cursor-pointer active:scale-[0.998]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
