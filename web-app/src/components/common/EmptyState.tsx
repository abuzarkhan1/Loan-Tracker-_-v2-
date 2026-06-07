import React from "react";
import { FolderOpen } from "lucide-react";
import Button from "./Button";

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-dashed border-appBorder bg-appCard p-6 text-center shadow-level1">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-appSurface text-appMuted">
        {icon || <FolderOpen className="h-5 w-5" />}
      </div>
      <h3 className="mb-1 text-base font-semibold text-appText">{title}</h3>
      <p className="mb-6 max-w-xs text-sm leading-relaxed text-appTextSecondary">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
