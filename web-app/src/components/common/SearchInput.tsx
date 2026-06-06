import React, { InputHTMLAttributes } from "react";
import { Search, X } from "lucide-react";
import { cn } from "../../lib/cn";

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  className,
  placeholder = "Search...",
  ...props
}) => {
  return (
    <div className={cn("relative flex w-full items-center rounded-2xl bg-appInput shadow-sm", className)}>
      <div className="absolute left-3.5 flex items-center text-appMuted pointer-events-none">
        <Search className="h-4 w-4" />
      </div>
      
      <input
        type="text"
        className="w-full rounded-2xl border border-appBorder bg-transparent py-3 pl-10 pr-10 text-sm font-semibold text-appText transition-all placeholder:text-appMuted focus:border-appPrimary focus:outline-none focus:ring-2 focus:ring-appPrimary/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        {...props}
      />

      {value && (
        <button
          type="button"
          className="absolute right-3.5 flex items-center text-appMuted hover:text-appText transition-colors focus:outline-none"
          onClick={() => {
            onChange("");
            if (onClear) onClear();
          }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
