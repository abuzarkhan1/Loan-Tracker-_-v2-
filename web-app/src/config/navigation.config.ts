import {
  BadgeCent,
  HandCoins,
  LayoutDashboard,
  ReceiptText,
  Settings2,
  Target,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { ROUTES } from "./routes.config";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  path: string;
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    title: "Core",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, path: ROUTES.DASHBOARD },
      { label: "Loans", icon: HandCoins, path: ROUTES.LOANS },
      { label: "Contacts", icon: Users2, path: ROUTES.CONTACTS },
      { label: "Goals", icon: Target, path: ROUTES.GOALS },
    ],
  },
  {
    title: "Expenses",
    items: [
      { label: "Expenses", icon: ReceiptText, path: ROUTES.EXPENSES },
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

export const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);
