import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import Button from "./Button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We encountered an error loading this information. Please check your internet connection and try again.",
  onRetry,
}) => {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-xl border border-appDanger/20 bg-appCard p-6 text-center shadow-level1">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-appDanger/10 text-appDanger">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="mb-1 text-base font-semibold text-appText">{title}</h3>
      <p className="mb-6 max-w-md text-sm font-normal leading-relaxed text-appTextSecondary">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
