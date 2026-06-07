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
          "absolute inset-0 bg-appSecondary/55 backdrop-blur-sm transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Slide Container */}
      <div className="absolute inset-y-0 right-0 flex max-w-full pl-10">
        <div
          className={cn(
            "flex h-full w-screen transform flex-col border-l border-appBorder bg-appCard shadow-elevated transition-transform duration-300 ease-in-out",
            sizes[size],
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-appBorder bg-appSurface px-6 py-4">
            <h3 className="text-base font-semibold text-appText">{title}</h3>
            <button
              onClick={onClose}
              className="rounded-md p-1.5 text-appMuted transition-all hover:bg-appBgSoft hover:text-appText focus:outline-none focus:ring-2 focus:ring-appPrimary/20"
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
