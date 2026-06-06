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
    <nav className="mb-3 flex max-w-full items-center gap-1.5 overflow-x-auto whitespace-nowrap rounded-2xl border border-appBorder/40 bg-appCard/70 px-3 py-2 text-xs font-bold text-appMuted shadow-sm backdrop-blur select-none">
      <Link to="/" className="hover:text-appText flex items-center gap-1 transition-colors">
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
          <div key={to} className="flex items-center gap-1.5 shrink-0">
            <ChevronRight className="h-3 w-3 text-appMuted/60" />
            {isLast ? (
              <span className="text-appText truncate max-w-[150px] font-bold">{label}</span>
            ) : (
              <Link to={to} className={cn("hover:text-appText transition-colors truncate max-w-[150px]")}>
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
