import React, { SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/cn";

export interface SelectOption {
  label: string;
  value: string | number;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, helperText, placeholder, id, ...props }, ref) => {
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-[13px] font-medium leading-4 text-appText pl-2">
            {label}
          </label>
        )}
        <div className="relative flex items-center rounded-full bg-appInput">
          <select
            id={id}
            className={cn(
              "h-10 w-full cursor-pointer appearance-none rounded-full border border-appBorder bg-transparent px-5 pr-10 text-[15px] font-normal text-appText transition-all placeholder:text-appMuted focus:border-white/30 focus:outline-none focus:ring-1 focus:ring-white/25 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-appDanger focus:border-appDanger focus:ring-appDanger",
              className
            )}
            ref={ref}
            {...props}
          >
            {placeholder && <option value="" className="bg-[#141414] text-white">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#141414] text-white">
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom arrow icon */}
          <div className="absolute right-4 pointer-events-none flex items-center text-appMuted">
            <svg className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M5.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.576 0 0.436 0.445 0.408 1.197 0 1.615l-4.695 4.502c-0.218 0.208-0.507 0.313-0.789 0.313s-0.571-0.105-0.789-0.313l-4.695-4.502c-0.408-0.418-0.436-1.17 0-1.615z" />
            </svg>
          </div>
        </div>

        {error && <p className="text-xs font-medium text-appDanger pl-2">{error}</p>}
        {!error && helperText && <p className="text-xs text-appMuted pl-2">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
