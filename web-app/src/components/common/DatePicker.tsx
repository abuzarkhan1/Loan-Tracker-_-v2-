import React, { InputHTMLAttributes, forwardRef } from "react";
import { Calendar } from "lucide-react";
import { cn } from "../../lib/cn";

export interface DatePickerProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider text-appMuted">
            {label}
          </label>
        )}
        <div className="relative flex items-center bg-appInput rounded-xl shadow-sm">
          <div className="absolute left-3.5 flex items-center text-appMuted pointer-events-none">
            <Calendar className="h-4 w-4" />
          </div>
          
          <input
            id={id}
            type="date"
            className={cn(
              "w-full rounded-xl border border-appBorder bg-transparent pl-10 pr-4 py-2.5 text-sm text-appText transition-all focus:border-appPrimary focus:outline-none focus:ring-1 focus:ring-appPrimary disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
              error && "border-appDanger focus:border-appDanger focus:ring-appDanger",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>

        {error && <p className="text-xs font-medium text-appDanger">{error}</p>}
        {!error && helperText && <p className="text-xs text-appMuted">{helperText}</p>}
      </div>
    );
  }
);

DatePicker.displayName = "DatePicker";
export default DatePicker;
