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
      <div className="flex w-full flex-col gap-1">
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium leading-4 text-appText">
            {label}
          </label>
        )}
        <div className="relative flex items-center rounded-md bg-appInput">
          <div className="absolute left-3.5 flex items-center text-appMuted pointer-events-none">
            <Calendar className="h-4 w-4" />
          </div>
          
          <input
            id={id}
            type="date"
            className={cn(
              "h-10 w-full cursor-pointer appearance-none rounded-md border border-appBorder bg-transparent pl-10 pr-4 text-[15px] font-normal text-appText transition-all focus:border-appPrimary focus:outline-none focus:ring-[3px] focus:ring-appPrimary/10 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-appDanger focus:border-appDanger focus:ring-appDanger/10",
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
