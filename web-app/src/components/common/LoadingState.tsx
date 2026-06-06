import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  type?: "spinner" | "skeleton" | "card-skeletons";
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading data...",
  type = "spinner",
  count = 3,
}) => {
  if (type === "skeleton") {
    return (
      <div className="w-full space-y-4 animate-pulse">
        <div className="h-4 bg-appBorder rounded w-1/3"></div>
        <div className="space-y-2">
          <div className="h-10 bg-appBorder rounded"></div>
          <div className="h-10 bg-appBorder rounded"></div>
          <div className="h-10 bg-appBorder rounded"></div>
        </div>
      </div>
    );
  }

  if (type === "card-skeletons") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="rounded-[24px] border border-appBorder bg-appCard p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div className="h-4 bg-appBorder rounded w-1/3"></div>
              <div className="h-6 bg-appBorder rounded-full w-1/4"></div>
            </div>
            <div className="h-8 bg-appBorder rounded w-2/3"></div>
            <div className="h-2 bg-appBorder rounded w-full"></div>
            <div className="flex justify-between gap-4 pt-2">
              <div className="h-9 bg-appBorder rounded-xl w-1/2"></div>
              <div className="h-9 bg-appBorder rounded-xl w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex min-h-[250px] w-full flex-col items-center justify-center gap-4 rounded-[24px] border border-appBorder/50 bg-appCard/80">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-appPeach text-appPrimary">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
      <span className="text-sm font-bold text-appMuted">{message}</span>
    </div>
  );
};

export default LoadingState;
