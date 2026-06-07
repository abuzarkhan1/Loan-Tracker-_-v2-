import React, { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/cn";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "success" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false,
  leftIcon,
  rightIcon,
  disabled,
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-appPrimary/30 focus:ring-offset-2 focus:ring-offset-appBg active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary: "bg-appPrimary text-white hover:bg-appPrimaryHover shadow-level1 shadow-appPrimary/10",
    secondary: "border border-appBorder bg-appCard text-appText shadow-level1 hover:bg-appBgSoft",
    success: "bg-appSuccess text-white hover:opacity-90 shadow-level1",
    danger: "bg-appDanger text-white hover:opacity-90 shadow-level1",
    outline: "border border-appBorder bg-appCard text-appText shadow-level1 hover:bg-appBgSoft",
    ghost: "bg-transparent text-appText hover:bg-appBgSoft",
  };

  const sizes = {
    sm: "h-8 px-3 text-[13px] gap-1.5",
    md: "h-9 px-4 text-sm gap-2",
    lg: "h-10 px-5 text-[15px] gap-2.5",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
      {!isLoading && leftIcon && <span className="inline-flex">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex">{rightIcon}</span>}
    </button>
  );
};

export default Button;
