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
    <div className={cn("relative flex w-full items-center rounded-md bg-appSurface", className)}>
      <div className="absolute left-3.5 flex items-center text-appMuted pointer-events-none">
        <Search className="h-4 w-4" />
      </div>
      
      <input
        type="text"
        className="h-10 w-full rounded-md border border-appBorder bg-transparent pl-10 pr-10 text-[15px] font-normal text-appText transition-all placeholder:text-appMuted focus:border-appPrimary focus:outline-none focus:ring-[3px] focus:ring-appPrimary/10"
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
