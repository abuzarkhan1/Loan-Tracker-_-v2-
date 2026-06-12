import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import BrandLogo from "../common/BrandLogo";
import { NAV_ITEMS } from "../../config/navigation.config";
import { ROUTES } from "../../config/routes.config";
import { cn } from "../../lib/cn";

export const MobileTopbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === path;
    }
    if (path === ROUTES.EXPENSES) {
      return location.pathname.startsWith(ROUTES.EXPENSES) || location.pathname.startsWith(ROUTES.TRANSACTIONS);
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="flex h-14 w-full select-none items-center justify-between rounded-full border border-appBorder bg-appCard/75 px-4 shadow-level2 backdrop-blur-md md:hidden">
        <Link to="/" className="min-w-0">
          <BrandLogo compact markSize="sm" />
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-md border border-appBorder bg-appSurface p-2 text-appMuted transition-all hover:text-appText focus:outline-none focus:ring-2 focus:ring-appPrimary/20"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu overlay list */}
      {menuOpen && (
        <div className="fixed inset-x-3 top-[76px] z-40 flex max-h-[calc(100vh-92px)] animate-in flex-col overflow-hidden rounded-xl border border-appBorder bg-appCard shadow-elevated slide-in-from-top duration-200 md:hidden">
          <nav className="flex-1 space-y-1.5 overflow-y-auto p-3">
            {NAV_ITEMS.map((item, i) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-md border-l-2 px-3 py-3 text-sm font-medium transition-all",
                    active 
                      ? "border-appPrimary bg-appSurface text-appPrimary shadow-level1" 
                      : "border-transparent text-appMuted hover:bg-appSurface hover:text-appText"
                  )}
                >
                  <span className={cn("flex h-8 w-8 items-center justify-center rounded-md", active ? "bg-appPrimary/10" : "bg-appSurface")}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
};

export default MobileTopbar;
