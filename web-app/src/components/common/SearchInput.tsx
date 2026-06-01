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
    <div className={cn("relative flex w-full items-center rounded-xl bg-appInput shadow-sm", className)}>
      <div className="absolute left-3.5 flex items-center text-appMuted pointer-events-none">
        <Search className="h-4.5 w-4.5" />
      </div>
      
      <input
        type="text"
        className="w-full rounded-xl border border-appBorder bg-transparent py-2 pl-10 pr-10 text-sm text-appText transition-all placeholder:text-appMuted focus:border-appPrimary focus:outline-none focus:ring-1 focus:ring-appPrimary"
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
