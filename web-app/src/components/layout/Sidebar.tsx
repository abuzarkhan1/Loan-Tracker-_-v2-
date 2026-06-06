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
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col bg-appCard/95 backdrop-blur-xl border-r border-appBorder h-screen sticky top-0 transition-all duration-300 ease-out z-30 shrink-0",
        collapsed ? "w-20" : "w-72",
      )}
    >
      <div className="flex h-[72px] items-center justify-between px-5 border-b border-appBorder/50 bg-appBgSoft/55">
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
          className="hidden rounded-xl border border-appBorder/60 bg-appCard p-1.5 text-appMuted transition-all duration-200 hover:bg-appBgSoft hover:text-appText focus:outline-none md:block"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-3.5 space-y-7">
        {NAV_GROUPS.map((group) => (
          <div key={group.title} className="space-y-1.5">
            {!collapsed ? (
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-appMuted/80 px-3.5 mb-2">
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
                    "nav-item-transition group relative flex items-center gap-3.5 rounded-2xl px-3.5 py-3 text-sm font-bold",
                    active
                      ? "bg-appPrimary text-white shadow-md shadow-appPrimary/15"
                      : "text-appMuted hover:bg-appBgSoft/90 hover:text-appText",
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <span className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    active ? "bg-white/20" : "bg-appBgSoft text-appMuted group-hover:text-appText",
                  )}>
                    <Icon className="h-4 w-4 shrink-0" />
                  </span>
                  {!collapsed ? <span className="truncate">{item.label}</span> : null}
                  {!collapsed && active ? <span className="ml-auto h-2 w-2 rounded-full bg-white/80" /> : null}
                  {collapsed ? (
                    <div className="pointer-events-none absolute left-16 z-50 whitespace-nowrap rounded-xl border border-appBorder bg-appCard px-3 py-2 text-xs font-bold text-appText opacity-0 shadow-soft transition-opacity group-hover:opacity-100">
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
