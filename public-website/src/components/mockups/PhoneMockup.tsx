import { ArrowDownLeft, ArrowUpRight, Plus, ReceiptText, WalletCards } from "lucide-react";
import type { ReactElement, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "../../utils/cn";

export type ScreenId = "dashboard" | "loans" | "detail" | "payment" | "expenses";

const MiniCard = ({ label, value, tone = "primary" }: { label: string; value: string; tone?: "primary" | "success" | "warning" | "danger" }) => {
  const toneClass = {
    primary: "bg-primary/10 text-primary",
    success: "bg-mint text-success",
    warning: "bg-yellow text-warning",
    danger: "bg-primary/10 text-danger",
  }[tone];

  return (
    <div className="rounded-xl border border-border bg-card p-3 shadow-soft">
      <div className={cn("mb-3 grid size-9 place-items-center rounded-lg", toneClass)}>
        {tone === "success" ? <ArrowDownLeft size={15} /> : tone === "danger" ? <ArrowUpRight size={15} /> : <ReceiptText size={15} />}
      </div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.05em] text-muted">{label}</p>
      <p className="mt-1 text-sm font-semibold text-dark">{value}</p>
    </div>
  );
};

const Progress = ({ value }: { value: number }) => (
  <div className="h-2 overflow-hidden rounded-full bg-background-soft">
    <div className="h-full rounded-full bg-primary" style={{ width: `${value}%` }} />
  </div>
);

const PhoneShell = ({ children, compact = false }: { children: ReactNode; compact?: boolean }) => (
  <div
    className={cn(
      "phone-shadow relative mx-auto w-full max-w-[280px] rounded-[32px] border border-[#0a2540] bg-[#0a2540] p-2.5 dark:border-[#2a3441] dark:bg-[#070c18] sm:max-w-[292px] sm:rounded-[34px] sm:p-3",
      compact && "max-w-[218px] rounded-[32px] sm:max-w-[226px] sm:rounded-[34px]",
    )}
  >
    <div
      className={cn(
        "h-[500px] overflow-hidden rounded-[24px] bg-app-gradient px-3.5 pb-5 pt-5 text-dark sm:h-[540px] sm:rounded-[26px] sm:px-4",
        compact && "h-[410px] rounded-xl px-3 sm:h-[438px] sm:rounded-xl",
      )}
    >
      <div className={cn("mx-auto mb-5 h-1.5 w-16 rounded-full bg-[#0a2540] dark:bg-[#070c18]", compact && "mb-4 w-12")} />
      {children}
    </div>
  </div>
);

const Header = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
    <div>
      <p className="text-lg font-semibold text-dark sm:text-xl">{title}</p>
      <p className="mt-1 text-[11px] font-medium text-muted">{subtitle}</p>
    </div>
    <button type="button" aria-label="Add" className="grid size-9 shrink-0 place-items-center rounded-md bg-primary text-white shadow-primary-glow sm:size-10">
      <Plus size={18} />
    </button>
  </div>
);

const DashboardScreen = () => (
  <>
    <Header title="Dashboard" subtitle="Aaj ki complete loan picture." />
    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
      <MiniCard label="Mujhe Lene Hain" value="Rs 84k" tone="success" />
      <MiniCard label="Mujhe Dene Hain" value="Rs 36k" tone="danger" />
      <MiniCard label="Total Wapis Mila" value="Rs 51k" tone="primary" />
      <MiniCard label="Baqi Raqam" value="Rs 47k" tone="warning" />
    </div>
    <div className="mt-3 rounded-xl border border-border bg-card p-3.5 shadow-soft sm:mt-4 sm:rounded-xl sm:p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-dark">Monthly Flow</p>
        <p className="text-[10px] font-medium text-muted">6 months</p>
      </div>
      <div className="flex h-24 items-end gap-2.5 sm:h-28 sm:gap-3">
        {[42, 68, 52, 78, 61, 88].map((height, index) => (
          <div key={index} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-full bg-primary/10">
              <div className="rounded-full bg-primary" style={{ height }} />
            </div>
            <span className="text-[9px] font-medium text-muted">{index + 1}</span>
          </div>
        ))}
      </div>
    </div>
  </>
);

const LoansScreen = () => (
  <>
    <Header title="Loans" subtitle="Given aur taken dono track karein." />
    <div className="grid gap-3">
      {[
        ["Ahmed Khan", "Mujhe Lene Hain", "Rs 20,000", 64, "success"],
        ["Bilal", "Mujhe Dene Hain", "Rs 12,500", 35, "danger"],
        ["Sara", "Partial", "Rs 8,000", 82, "warning"],
      ].map(([name, badge, amount, progress, tone]) => (
        <div key={name} className="rounded-xl border border-border bg-card p-3.5 shadow-soft sm:rounded-xl sm:p-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-base font-semibold text-dark">{name}</p>
              <p className="mt-1 text-[11px] font-medium text-muted">Due 12 Jun</p>
            </div>
            <span className={cn("rounded-md border px-2.5 py-1 text-[10px] font-medium", tone === "success" ? "border-success/20 bg-mint text-success" : tone === "danger" ? "border-danger/20 bg-danger/10 text-danger" : "border-warning/20 bg-yellow text-warning")}>
              {badge}
            </span>
          </div>
          <div className="mb-2 flex items-center justify-between text-[10px] font-semibold text-muted">
            <span>Paid {progress}%</span>
            <span>{amount}</span>
          </div>
          <Progress value={Number(progress)} />
        </div>
      ))}
    </div>
  </>
);

const DetailScreen = () => (
  <>
    <Header title="Loan Detail" subtitle="Payment History" />
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft sm:rounded-xl sm:p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-2xl font-semibold text-dark">Rs 20,000</p>
          <p className="mt-1 text-xs font-medium text-muted">Ahmed Khan</p>
        </div>
        <span className="rounded-md border border-warning/20 bg-yellow px-2.5 py-1 text-[10px] font-medium text-warning">Partial</span>
      </div>
      <div className="mt-5">
        <div className="mb-2 flex justify-between text-[11px] font-semibold text-muted">
          <span>Paid 65%</span>
          <span>Baqi Rs 7,000</span>
        </div>
        <Progress value={65} />
      </div>
    </div>
    <div className="mt-4 grid gap-3">
      {[
        ["Rs 5,000", "Cash", "Today, 8:30 PM"],
        ["Rs 4,000", "Bank", "18 May, 3:10 PM"],
        ["Rs 4,000", "EasyPaisa", "10 May, 12:20 PM"],
      ].map(([amount, method, date]) => (
        <div key={`${amount}-${date}`} className="flex items-center justify-between rounded-lg border border-border bg-card p-3.5 shadow-soft sm:rounded-xl sm:p-4">
          <div>
            <p className="font-semibold text-dark">{amount}</p>
            <p className="mt-1 text-[11px] font-medium text-muted">{method}</p>
          </div>
          <p className="text-right text-[10px] font-medium text-muted">{date}</p>
        </div>
      ))}
    </div>
  </>
);

const PaymentScreen = () => (
  <>
    <Header title="Nayi Payment" subtitle="Partial repayment save karein." />
    <div className="rounded-xl border border-border bg-card p-4 shadow-soft sm:rounded-xl sm:p-5">
      <label className="text-xs font-semibold uppercase tracking-[0.05em] text-muted">Amount</label>
      <div className="mt-2 rounded-md border border-border bg-input px-4 py-3 text-lg font-semibold text-dark">Rs 5,000</div>
      <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.05em] text-muted">Method</label>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {["Cash", "Bank", "JazzCash", "Other"].map((method, index) => (
          <span key={method} className={cn("rounded-md border px-3 py-2.5 text-center text-xs font-medium", index === 0 ? "border-primary bg-primary text-white" : "border-border bg-background-soft text-muted")}>
            {method}
          </span>
        ))}
      </div>
      <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.05em] text-muted">Payment Date</label>
      <div className="mt-2 rounded-md border border-border bg-input px-4 py-3 text-sm font-semibold text-dark">May 28, 2026</div>
      <button type="button" className="mt-6 h-10 w-full rounded-md bg-primary text-sm font-medium text-white shadow-primary-glow">
        Save Payment
      </button>
    </div>
  </>
);

const ExpensesScreen = () => (
  <>
    <Header title="Expenses" subtitle="Income aur kharch track karein." />
    <div className="grid gap-3">
      <div className="rounded-xl border border-border bg-card p-3.5 shadow-soft sm:rounded-xl sm:p-4">
        <div className="mb-4 flex items-center gap-2">
          <WalletCards className="text-primary" size={18} />
          <p className="text-sm font-semibold text-dark">Transactions</p>
        </div>
        {[
          ["Grocery", "Expense", "Rs 4,500", "danger"],
          ["Freelance", "Income", "Rs 18,000", "success"],
          ["Loan Recovery", "Received", "Rs 5,000", "primary"],
        ].map(([title, label, value, tone]) => (
          <div key={title} className="mt-3 flex items-center justify-between rounded-lg bg-background-soft p-3">
            <div>
              <p className="text-xs font-semibold text-dark">{title}</p>
              <p className="mt-1 text-[10px] font-medium uppercase text-muted">{label}</p>
            </div>
            <p className={cn("text-sm font-semibold", tone === "danger" ? "text-danger" : tone === "success" ? "text-success" : "text-primary")}>
              {value}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border bg-card p-3.5 shadow-soft sm:rounded-xl sm:p-4">
        <p className="text-sm font-semibold text-dark">Cash Summary</p>
        <div className="mt-5 grid grid-cols-2 gap-3">
          {([
            ["Rs 18k", "Income", ArrowDownLeft],
            ["Rs 4.5k", "Expense", ArrowUpRight],
          ] satisfies [string, string, LucideIcon][]).map(([value, label, Icon]) => (
            <div key={label} className="rounded-lg bg-background-soft p-3 text-center">
              <Icon className="mx-auto text-primary" size={17} />
              <p className="mt-2 text-lg font-semibold text-dark">{value}</p>
              <p className="text-[10px] font-medium text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

const screenMap: Record<ScreenId, ReactElement> = {
  dashboard: <DashboardScreen />,
  loans: <LoansScreen />,
  detail: <DetailScreen />,
  payment: <PaymentScreen />,
  expenses: <ExpensesScreen />,
};

export const PhoneMockup = ({ screen = "dashboard", compact = false, className }: { screen?: ScreenId; compact?: boolean; className?: string }) => (
  <div className={className}>
    <PhoneShell compact={compact}>{screenMap[screen]}</PhoneShell>
  </div>
);
