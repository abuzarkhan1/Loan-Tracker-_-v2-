import React from "react";
import { AlertTriangle, X } from "lucide-react";
import Button from "./Button";
import Card from "./Card";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      {/* Dialogue box */}
      <Card variant="elevated" className="relative z-10 w-full max-w-md animate-in fade-in zoom-in-95 duration-150">
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-appMuted hover:text-appText transition-colors rounded-lg p-1 focus:ring-2 focus:ring-appMuted"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${isDestructive ? 'bg-appDanger bg-opacity-10 text-appDanger' : 'bg-appWarning bg-opacity-10 text-appWarning'}`}>
              <AlertTriangle className="h-5.5 w-5.5" />
            </div>
            <h3 className="text-lg font-bold text-appText">{title}</h3>
          </div>

          <p className="text-sm text-appMuted leading-relaxed">{message}</p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
              {cancelText}
            </Button>
            <Button 
              variant={isDestructive ? "danger" : "primary"} 
              size="sm" 
              onClick={onConfirm} 
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ConfirmDialog;
