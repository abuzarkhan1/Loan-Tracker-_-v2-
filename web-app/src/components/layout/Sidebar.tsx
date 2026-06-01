import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BadgeCent, ChevronLeft, ChevronRight, HandCoins, LayoutDashboard, Settings2, Users2, Wallet } from "lucide-react";
import { ROUTES } from "../../config/routes.config";
import { cn } from "../../lib/cn";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const menuGroups = [
    {
      title: "Core",
      items: [
        { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
        { label: "Loans", icon: HandCoins, path: ROUTES.LOANS },
        { label: "Contacts", icon: Users2, path: ROUTES.CONTACTS },
      ],
    },
    {
      title: "Expenses",
      items: [
        { label: "Transactions", icon: Wallet, path: ROUTES.TRANSACTIONS },
        { label: "Categories", icon: BadgeCent, path: ROUTES.CATEGORIES },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Settings", icon: Settings2, path: ROUTES.SETTINGS },
      ],
    },
  ];

  const isActive = (path: string) => {
    if (path === ROUTES.DASHBOARD) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-appCard border-r border-appBorder h-screen sticky top-0 transition-all duration-300 z-30 shrink-0",
        collapsed ? "w-20" : "w-64",
      )}
    >
      <div className="flex h-16 items-center justify-between px-5 border-b border-appBorder/50 bg-appBgSoft/35">
        {!collapsed ? (
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-appPrimary text-white font-bold shadow-md">
              LT
            </span>
            <span className="font-extrabold text-base tracking-wide text-appText select-none">
              Loan<span className="text-appPrimary">Tracker</span>
            </span>
          </Link>
        ) : (
          <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-xl bg-appPrimary text-white font-bold mx-auto shadow-md">
            LT
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-appMuted hover:text-appText p-1.5 rounded-lg hover:bg-appBgSoft border border-transparent hover:border-appBorder transition-all duration-200 hidden md:block focus:outline-none"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title} className="space-y-1.5">
            {!collapsed ? (
              <p className="text-[10px] font-bold uppercase tracking-widest text-appMuted/80 px-3.5 mb-1.5">
                {group.title}
              </p>
            ) : null}
            {group.items.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 relative group",
                    active
                      ? "bg-appPrimary text-white shadow-md shadow-appPrimary/10 active:scale-[0.98]"
                      : "text-appMuted hover:text-appText hover:bg-appBgSoft",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  {collapsed ? (
                    <div className="absolute left-16 bg-appText text-appCard text-xs rounded px-2 py-1 opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-md z-50">
                      {item.label}
                    </div>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
