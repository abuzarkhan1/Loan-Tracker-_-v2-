import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import BrandLogo from "../common/BrandLogo";
import { NAV_GROUPS } from "../../config/navigation.config";
import { ROUTES } from "../../config/routes.config";
import { cn } from "../../lib/cn";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (c: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
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
    <aside
      className={cn(
        "hidden md:flex flex-col bg-appSurface/65 backdrop-blur-md border border-appBorder h-[calc(100vh-2rem)] my-4 ml-4 rounded-3xl transition-all duration-300 ease-out z-30 shrink-0 relative shadow-level3",
        collapsed ? "w-20" : "w-72",
      )}
    >
      <div className="flex h-16 items-center justify-between border-b border-appBorder bg-appCard/50 px-5 rounded-t-3xl">
        {!collapsed ? (
          <Link to="/" className="min-w-0">
            <BrandLogo markSize="md" />
          </Link>
        ) : (
          <Link to="/" className="mx-auto">
            <BrandLogo showText={false} markSize="md" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden rounded-full border border-appBorder bg-appCard p-1.5 text-appMuted transition-all duration-200 hover:bg-appSurface hover:text-appText focus:outline-none focus:ring-2 focus:ring-appPrimary/20 md:block"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1.5">
            {!collapsed ? (
              <p className="mb-2 px-3.5 text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">
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
                    "nav-item-transition group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-[15px] font-medium",
                    active
                      ? "border-l-2 border-appPrimary bg-appCard text-appPrimary shadow-level1"
                      : "border-l-2 border-transparent text-appMuted hover:bg-appCard hover:text-appText",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
                    active ? "bg-appPrimary/10 text-appPrimary" : "bg-appCard text-appMuted group-hover:text-appText",
                  )}>
                    <Icon className="h-4 w-4 shrink-0" />
                  </span>
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  {!collapsed && active ? <span className="ml-auto h-1.5 w-1.5 rounded-full bg-appPrimary" /> : null}
                  {collapsed ? (
                    <div className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded-lg border border-appBorder bg-appCard px-3 py-2 text-xs font-medium text-appText opacity-0 shadow-level2 transition-opacity group-hover:opacity-100">
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
