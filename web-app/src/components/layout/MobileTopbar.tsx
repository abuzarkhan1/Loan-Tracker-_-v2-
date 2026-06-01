import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgeCent, HandCoins, LayoutDashboard, Menu, Settings, Users2, Wallet, X } from "lucide-react";
import { ROUTES } from "../../config/routes.config";
import { cn } from "../../lib/cn";

export const MobileTopbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
    { label: "Loans", icon: HandCoins, path: ROUTES.LOANS },
    { label: "Contacts", icon: Users2, path: ROUTES.CONTACTS },
    { label: "Transactions", icon: Wallet, path: ROUTES.TRANSACTIONS },
    { label: "Categories", icon: BadgeCent, path: ROUTES.CATEGORIES },
    { label: "Settings", icon: Settings, path: ROUTES.SETTINGS },
  ];

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <div className="flex md:hidden h-14 items-center justify-between px-4 border-b border-appBorder bg-appCard sticky top-0 z-20 shadow-sm w-full select-none">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-appPrimary text-white text-xs font-bold font-sans">
            LT
          </span>
          <span className="font-extrabold text-sm text-appText tracking-wide">
            Loan<span className="text-appPrimary">Tracker</span>
          </span>
        </Link>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-appMuted hover:text-appText p-1.5 rounded-lg focus:outline-none"
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5.5 w-5.5" /> : <Menu className="h-5.5 w-5.5" />}
        </button>
      </div>

      {/* Menu overlay list */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 z-40 top-14 flex flex-col bg-appCard animate-in slide-in-from-top duration-200">
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {navItems.map((item, i) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={i}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all",
                    active 
                      ? "bg-appPrimary text-white shadow-md shadow-appPrimary/10" 
                      : "text-appMuted hover:text-appText hover:bg-appBgSoft"
                  )}
                >
                  <Icon className="h-5 w-5" />
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
