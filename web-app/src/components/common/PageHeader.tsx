import React from "react";
import { cn } from "../../lib/cn";

interface PageHeaderProps {
  kicker?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  kicker,
  title,
  description,
  icon,
  actions,
  className,
}) => {
  return (
    <div className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex min-w-0 items-start gap-4">
        {icon ? (
          <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-appBorder bg-appCard text-appPrimary shadow-level1">
            {icon}
          </div>
        ) : null}
        <div className="min-w-0">
          {kicker ? <p className="page-kicker">{kicker}</p> : null}
          <h1 className="page-title">{title}</h1>
          {description ? <p className="page-subtitle">{description}</p> : null}
        </div>
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  );
};

export default PageHeader;
