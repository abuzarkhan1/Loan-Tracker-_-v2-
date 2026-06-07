import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { ROUTES } from "../../config/routes.config";
import { cn } from "../../lib/cn";

export const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  if (location.pathname === ROUTES.DASHBOARD) return null;

  return (
    <nav className="mb-2 flex max-w-full select-none items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs font-medium text-appMuted">
      <Link to="/" className="flex items-center gap-1 transition-colors hover:text-appText">
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>

      {pathnames.map((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;

        // Skip UUIDs or IDs in label, clean up labels
        const isId = value.match(/^[0-9a-fA-F]{24}$/) || value.match(/^\d+$/);
        const label = isId 
          ? "Detail" 
          : value.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

        return (
          <div key={to} className="flex shrink-0 items-center gap-1.5">
            <ChevronRight className="h-3 w-3 text-appMuted/60" />
            {isLast ? (
              <span className="max-w-[150px] truncate font-semibold text-appText">{label}</span>
            ) : (
              <Link to={to} className={cn("max-w-[150px] truncate transition-colors hover:text-appText")}>
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
};

export default Breadcrumbs;
