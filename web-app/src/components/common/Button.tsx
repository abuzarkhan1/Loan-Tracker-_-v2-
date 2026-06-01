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
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 duration-150";

  const variants = {
    primary: "bg-appPrimary text-white hover:bg-appPrimaryDark focus:ring-appPrimary focus:ring-offset-appBg shadow-md hover:shadow-lg",
    secondary: "bg-appBgSoft text-appText hover:bg-appBorder focus:ring-appMuted focus:ring-offset-appBg border border-appBorder",
    success: "bg-appSuccess text-white hover:opacity-90 focus:ring-appSuccess focus:ring-offset-appBg shadow-md",
    danger: "bg-appDanger text-white hover:opacity-90 focus:ring-appDanger focus:ring-offset-appBg shadow-md",
    outline: "bg-transparent border border-appBorder text-appText hover:bg-appBgSoft focus:ring-appMuted",
    ghost: "bg-transparent text-appText hover:bg-appBgSoft focus:ring-appMuted",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
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
