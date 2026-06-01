import React, { useEffect } from "react";
import { X } from "lucide-react";
import Card from "./Card";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
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

  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />
      
      {/* Container */}
      <Card
        variant="elevated"
        padding="none"
        className={`relative z-10 w-full ${sizes[size]} max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-appBorder bg-appBgSoft/40">
          <h3 className="text-base font-bold text-appText">{title}</h3>
          <button
            onClick={onClose}
            className="text-appMuted hover:text-appText p-1.5 rounded-lg hover:bg-appBgSoft transition-all focus:outline-none"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </Card>
    </div>
  );
};

export default Modal;
