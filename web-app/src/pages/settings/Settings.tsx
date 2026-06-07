import React from "react";
import {
  ChevronRight,
  Info,
  Layers,
  LogOut,
  Moon,
  ReceiptText,
  Sun,
  User as UserIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button";
import Card from "../../components/common/Card";
import PageHeader from "../../components/common/PageHeader";
import { ROUTES } from "../../config/routes.config";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";

export const Settings: React.FC = () => {
  const { mode, toggleMode, isDark } = useTheme();
  const { user, logout } = useAuth();

  const settingsLinks = [
    {
      title: "Profile",
      description: "Update your name and account information.",
      icon: <UserIcon className="h-5 w-5 text-appPrimary" />,
      route: ROUTES.PROFILE,
    },
    {
      title: "Categories",
      description: "Manage expense and income categories.",
      icon: <Layers className="h-5 w-5 text-appSuccess" />,
      route: ROUTES.CATEGORIES,
    },
    {
      title: "Expenses",
      description: "Open expense, income, budget, and cash-flow tracking.",
      icon: <ReceiptText className="h-5 w-5 text-appDanger" />,
      route: ROUTES.EXPENSES,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <PageHeader
        kicker="Preferences"
        title="Settings"
        description="Keep the app simple: profile, theme, categories, app info, and logout."
        icon={<Info className="h-6 w-6" />}
      />

      {user && (
        <Card variant="elevated" className="flex items-center justify-between gap-4 border-appBorder/50 bg-appCard p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-appPrimary text-sm font-semibold text-white shadow-sm">
              {user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div>
              <span className="block text-sm font-semibold text-appText">{user.name}</span>
              <span className="block text-xs text-appMuted">{user.email}</span>
            </div>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {settingsLinks.map((link) => (
          <Link key={link.route} to={link.route}>
            <Card
              variant="bordered"
              hoverable
              className="flex h-full items-start justify-between gap-4 border-appBorder/50 p-4"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0 rounded-lg border border-appBorder bg-appBgSoft p-2">
                  {link.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-appText">{link.title}</h3>
                  <p className="mt-1 text-xs font-normal leading-5 text-appMuted">{link.description}</p>
                </div>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-appMuted" />
            </Card>
          </Link>
        ))}
      </div>

      <Card variant="bordered" className="space-y-4 border-appBorder/50 p-5">
        <h3 className="flex items-center gap-1.5 border-b border-appBorder pb-2 text-xs font-semibold uppercase tracking-[0.05em] text-appMuted">
          <Info className="h-4 w-4 text-appPrimary" />
          App Preferences
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-appBorder bg-appSurface p-4">
            <div>
              <span className="block text-xs font-semibold text-appText">Theme</span>
              <span className="text-xs text-appMuted">Current: {mode}</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleMode}
              leftIcon={isDark ? <Sun className="h-4 w-4 text-appWarning" /> : <Moon className="h-4 w-4" />}
            >
              {isDark ? "Light" : "Dark"}
            </Button>
          </div>

          <div className="flex items-center justify-between gap-4 rounded-lg border border-appBorder bg-appSurface p-4">
            <div>
              <span className="block text-xs font-semibold text-appText">App Info</span>
              <span className="text-xs text-appMuted">Loan tracking + expenses/income</span>
            </div>
            <span className="rounded-md border border-appBorder bg-appCard px-3 py-1 text-xs font-medium text-appMuted">
              v1.0
            </span>
          </div>
        </div>
      </Card>

      <Card variant="bordered" className="border-appBorder/50 p-5">
        <Button
          variant="danger"
          leftIcon={<LogOut className="h-4 w-4" />}
          onClick={logout}
        >
          Logout
        </Button>
      </Card>
    </div>
  );
};

export default Settings;
