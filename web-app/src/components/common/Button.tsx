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
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full border font-medium transition duration-300 ease-out hover:-translate-y-0.5 focus:outline-none focus:ring-1 focus:ring-white/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "border-transparent bg-white text-black font-semibold hover:bg-neutral-200 shadow-lg shadow-white/5",
    secondary:
      "border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10",
    success:
      "border-transparent bg-emerald-600 text-white hover:bg-emerald-500 shadow-lg shadow-emerald-600/10",
    danger:
      "border-transparent bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-600/10",
    outline:
      "border-white/10 bg-white/5 text-white hover:border-white/30 hover:bg-white/10",
    ghost:
      "border-transparent bg-transparent text-white/80 hover:bg-white/5 hover:text-white",
  };

  const sizes = {
    sm: "h-8 px-4 text-xs",
    md: "h-10 px-5 text-sm",
    lg: "h-12 px-6 text-base",
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
      {!isLoading && leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
      {children}
      {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
    </button>
  );
};

export default Button;
