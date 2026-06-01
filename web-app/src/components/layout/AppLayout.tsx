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
    <div className="flex h-screen w-screen overflow-hidden bg-appBg">
      {/* Sidebar for Desktop */}
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />

      {/* Main Container */}
      <div className="flex flex-1 flex-col h-full overflow-hidden">
        {/* Mobile View Topbar */}
        <MobileTopbar />

        {/* Desktop View Header */}
        <Header />

        {/* Scrollable Workspace */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-2">
          {/* Breadcrumbs HUD */}
          <Breadcrumbs />

          {/* Actual screen view */}
          <div className="flex-1 pb-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
