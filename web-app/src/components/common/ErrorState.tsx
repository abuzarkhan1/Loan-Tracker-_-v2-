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
    <div className="flex min-h-[300px] flex-col items-center justify-center rounded-[24px] border border-appDanger/20 bg-appCard p-8 text-center shadow-sm">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-appDanger bg-opacity-10 text-appDanger mb-4">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h3 className="text-base font-extrabold text-appText mb-1">{title}</h3>
      <p className="max-w-md text-sm font-semibold text-appMuted mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} leftIcon={<RotateCcw className="h-3.5 w-3.5" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};

export default ErrorState;
