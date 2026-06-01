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
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-dashed border-appBorder bg-appCard p-8 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-appBgSoft text-appMuted mb-4">
        {icon || <FolderOpen className="h-8 w-8" />}
      </div>
      <h3 className="text-base font-bold text-appText mb-1">{title}</h3>
      <p className="max-w-xs text-sm text-appMuted mb-6 leading-relaxed">{description}</p>
      {actionText && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
