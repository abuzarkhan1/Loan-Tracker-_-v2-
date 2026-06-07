import React, { InputHTMLAttributes, forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../lib/cn";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium leading-4 text-appText">
            {label}
          </label>
        )}
        <div className="relative flex items-center rounded-md bg-appInput">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center text-appMuted pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            id={id}
            type={actualType}
            className={cn(
              "h-10 w-full rounded-md border border-appBorder bg-transparent px-3 text-[15px] font-normal text-appText transition-all placeholder:text-appMuted focus:border-appPrimary focus:outline-none focus:ring-[3px] focus:ring-appPrimary/10 disabled:cursor-not-allowed disabled:opacity-50",
              leftIcon && "pl-10",
              (rightIcon || isPassword) && "pr-10",
              error && "border-appDanger focus:border-appDanger focus:ring-appDanger",
              className
            )}
            ref={ref}
            {...props}
          />

          {rightIcon && !isPassword && (
            <div className="absolute right-3.5 flex items-center text-appMuted pointer-events-none">
              {rightIcon}
            </div>
          )}

          {isPassword && (
            <button
              type="button"
              className="absolute right-3.5 flex items-center text-appMuted hover:text-appText transition-colors focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}
        </div>

        {error && <p className="text-xs font-medium text-appDanger">{error}</p>}
        {!error && helperText && <p className="text-xs text-appMuted">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
