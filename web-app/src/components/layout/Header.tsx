import React, { useState } from "react";
import { 
  LogOut, 
  User, 
  Plus, 
  ChevronDown,
  HandCoins,
  ReceiptText,
  Target,
  WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth.store";
import ThemeToggle from "../common/ThemeToggle";
import Button from "../common/Button";
import Card from "../common/Card";
import { ROUTES } from "../../config/routes.config";

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickAddOpen, setQuickAddOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const getGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return "Good Morning";
    if (hr < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <header className="hidden h-14 w-full items-center justify-between rounded-full border border-appBorder bg-appCard/75 px-6 shadow-level2 backdrop-blur-md md:flex">
      {/* Welcome text */}
      <div className="flex flex-col">
        <h1 className="select-none text-sm font-semibold tracking-tight text-appText">
          {getGreeting()},{user?.name ? ` ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="hidden text-xs font-normal text-appMuted sm:block">Loans, contacts, expenses, and goals in one calm workspace.</p>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3">
        {/* Quick actions dropdown */}
        <div className="relative">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setQuickAddOpen(!quickAddOpen)}
            leftIcon={<Plus className="h-4 w-4" />}
            rightIcon={<ChevronDown className="h-3 w-3" />}
            className="rounded-md"
          >
            Quick Add
          </Button>

          {quickAddOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setQuickAddOpen(false)} />
              <Card
                variant="elevated"
                padding="none"
                className="absolute right-0 z-40 mt-2 w-60 animate-in border border-appBorder py-2 fade-in slide-in-from-top-2 duration-150"
              >
                {[
                  { label: "Add Loan", route: ROUTES.ADD_LOAN, icon: HandCoins },
                  { label: "Add Payment", route: ROUTES.ADD_PAYMENT, icon: ReceiptText },
                  { label: "Add Expense", route: `${ROUTES.ADD_TRANSACTION}?type=EXPENSE`, icon: WalletCards },
                  { label: "Add Goal", route: ROUTES.ADD_GOAL, icon: Target },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.route); setQuickAddOpen(false); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-[13px] font-medium text-appText transition-colors hover:bg-appSurface"
                    >
                      <Icon className="h-4 w-4 text-appPrimary" />
                      {item.label}
                    </button>
                  );
                })}
              </Card>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 rounded-md border border-appBorder bg-appSurface p-1 transition-all hover:bg-appBorder/60 focus:outline-none focus:ring-2 focus:ring-appPrimary/20 sm:px-2.5 sm:py-1.5"
            aria-label="Open profile menu"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-appPrimary text-xs font-semibold text-black">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <span className="hidden max-w-[80px] truncate text-xs font-medium tracking-wide text-appText sm:inline">
              {user?.name ? user.name.split(" ")[0] : "Profile"}
            </span>
            <ChevronDown className="h-3.5 w-3.5 text-appMuted shrink-0" />
          </button>

          {profileOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
              <Card
                variant="elevated"
                padding="none"
                className="absolute right-0 z-40 mt-2 w-52 animate-in border border-appBorder py-2 fade-in slide-in-from-top-2 duration-150"
              >
                <div className="select-none border-b border-appBorder px-4 py-2">
                  <p className="truncate text-xs font-semibold text-appText">{user?.name || "Guest"}</p>
                  <p className="truncate text-xs text-appMuted">{user?.email || ""}</p>
                </div>
                
                <button
                  onClick={() => { navigate(ROUTES.SETTINGS); setProfileOpen(false); }}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-medium text-appText transition-colors hover:bg-appSurface"
                >
                  <User className="h-4 w-4 text-appMuted" /> Profile Settings
                </button>

                <button
                  onClick={() => { handleLogout(); setProfileOpen(false); }}
                  className="flex w-full items-center gap-2 border-t border-appBorder px-4 py-2.5 text-left text-xs font-medium text-appDanger transition-colors hover:bg-appDanger/5"
                >
                  <LogOut className="h-4 w-4 text-appDanger" /> Log Out
                </button>
              </Card>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
