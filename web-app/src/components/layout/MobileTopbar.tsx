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
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-appBorder bg-appCard/95 px-4 shadow-sm backdrop-blur-xl select-none md:hidden">
        <Link to="/" className="min-w-0">
          <BrandLogo compact markSize="sm" />
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="rounded-2xl border border-appBorder bg-appBgSoft p-2 text-appMuted transition-all hover:text-appText focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Menu overlay list */}
      {menuOpen && (
        <div className="fixed inset-x-3 top-[76px] z-40 flex max-h-[calc(100vh-92px)] flex-col overflow-hidden rounded-[28px] border border-appBorder bg-appCard shadow-elevated animate-in slide-in-from-top duration-200 md:hidden">
          <nav className="flex-1 overflow-y-auto p-3 space-y-1.5">
            {NAV_ITEMS.map((item, i) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-bold transition-all",
                    active 
                      ? "bg-appPrimary text-white shadow-md shadow-appPrimary/10" 
                      : "text-appMuted hover:text-appText hover:bg-appBgSoft"
                  )}
                >
                  <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", active ? "bg-white/20" : "bg-appBgSoft")}>
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
