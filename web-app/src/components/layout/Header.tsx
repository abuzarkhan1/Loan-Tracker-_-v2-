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
    <header className="sticky top-0 z-20 hidden h-[72px] items-center justify-between border-b border-appBorder bg-appCard/90 px-8 shadow-sm backdrop-blur-xl md:flex">
      {/* Welcome text */}
      <div className="flex flex-col">
        <h1 className="select-none text-sm font-extrabold tracking-tight text-appText">
          {getGreeting()},{user?.name ? ` ${user.name.split(" ")[0]}` : ""}
        </h1>
        <p className="hidden text-xs font-semibold text-appMuted sm:block">Loans, contacts, expenses, and goals in one calm workspace.</p>
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
            className="rounded-xl"
          >
            Quick Add
          </Button>

          {quickAddOpen && (
            <>
              <div className="fixed inset-0 z-30" onClick={() => setQuickAddOpen(false)} />
              <Card
                variant="elevated"
                padding="none"
                className="absolute right-0 mt-2 w-60 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150 border border-appBorder/50"
              >
                {[
                  { label: "Add Loan", route: ROUTES.ADD_LOAN, icon: HandCoins },
                  { label: "Add Payment", route: ROUTES.ADD_PAYMENT, icon: ReceiptText },
                  { label: "Add Expense / Income", route: ROUTES.ADD_TRANSACTION, icon: WalletCards },
                  { label: "Add Goal", route: ROUTES.ADD_GOAL, icon: Target },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      onClick={() => { navigate(item.route); setQuickAddOpen(false); }}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-xs font-bold text-appText transition-colors hover:bg-appBgSoft"
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
            className="flex items-center gap-2 bg-appBgSoft hover:bg-appBorder border border-appBorder rounded-xl p-1 sm:px-2.5 sm:py-1.5 transition-all focus:outline-none"
            aria-label="Open profile menu"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-appPrimary text-white text-xs font-bold font-sans">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <span className="hidden sm:inline text-xs font-bold text-appText tracking-wide truncate max-w-[80px]">
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
                className="absolute right-0 mt-2 w-52 py-2 z-40 animate-in fade-in slide-in-from-top-2 duration-150 border border-appBorder/50"
              >
                <div className="px-4 py-2 border-b border-appBorder/50 select-none">
                  <p className="text-xs font-bold text-appText truncate">{user?.name || "Guest"}</p>
                  <p className="text-[10px] text-appMuted truncate">{user?.email || ""}</p>
                </div>
                
                <button
                  onClick={() => { navigate(ROUTES.SETTINGS); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-appText hover:bg-appBgSoft transition-colors flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-appMuted" /> Profile Settings
                </button>

                <button
                  onClick={() => { handleLogout(); setProfileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-xs font-semibold text-appDanger hover:bg-appDanger/5 transition-colors flex items-center gap-2 border-t border-appBorder/50"
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
