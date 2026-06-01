import React, { useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "../../lib/cn";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-xl",
  };

  return (
    <div className={cn("fixed inset-0 z-50 overflow-hidden transition-all duration-300", isOpen ? "pointer-events-auto" : "pointer-events-none")}>
      {/* Backdrop */}
      <div
        className={cn(
          "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Slide Container */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={cn(
            "w-screen transform bg-appCard border-l border-appBorder shadow-elevated transition-transform duration-300 ease-in-out flex flex-col h-full",
            sizes[size],
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-appBorder bg-appBgSoft/40">
            <h3 className="text-base font-bold text-appText">{title}</h3>
            <button
              onClick={onClose}
              className="text-appMuted hover:text-appText p-1.5 rounded-lg hover:bg-appBgSoft transition-all focus:outline-none"
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
