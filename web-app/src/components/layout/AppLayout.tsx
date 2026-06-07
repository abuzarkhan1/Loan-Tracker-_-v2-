import React, { useState, useEffect } from "react";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { MobileTopbar } from "./MobileTopbar";
import { Breadcrumbs } from "./Breadcrumbs";
import { useThemeStore } from "../../store/theme.store";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const initializeTheme = useThemeStore((state) => state.initialize);

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  return (
    <div className="app-shell-bg flex h-screen w-screen overflow-hidden bg-appBg">
      {/* Sidebar for Desktop */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Container */}
      <div className="flex h-full flex-1 flex-col overflow-hidden">
        {/* Mobile View Topbar */}
        <MobileTopbar />

        {/* Desktop View Header */}
        <Header />

        {/* Scrollable Workspace */}
        <main className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-5 sm:px-6 lg:px-8">
          {/* Breadcrumbs HUD */}
          <Breadcrumbs />

          {/* Actual screen view */}
          <div className="mx-auto w-full max-w-[1200px] pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
