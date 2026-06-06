import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Coins,
  HandCoins,
  Target,
  WalletCards,
} from "lucide-react";
import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import AmountText from "../../components/common/AmountText";
import Badge from "../../components/common/Badge";
import Card from "../../components/common/Card";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PageHeader from "../../components/common/PageHeader";
import { ROUTES } from "../../config/routes.config";
import useDashboard from "../../hooks/useDashboard";
import { useGoalSummary } from "../../hooks/useGoals";
import { cn } from "../../lib/cn";

const chartPalette = {
  primary: "var(--primary)",
  muted: "var(--muted)",
  success: "var(--success)",
  warning: "var(--warning)",
  border: "var(--border)",
  card: "var(--card)",
  text: "var(--text)",
  mutedText: "var(--muted)",
};

const tooltipStyle = {
  backgroundColor: chartPalette.card,
  border: `1px solid ${chartPalette.border}`,
  borderRadius: 16,
  boxShadow: "0 12px 40px var(--shadow-color)",
  color: chartPalette.text,
};

type MetricCardProps = {
  label: string;
  value: number;
  icon: React.ElementType;
  tone: "primary" | "success" | "danger" | "warning";
  isCount?: boolean;
};

const toneClass = {
  primary: "text-appPrimary",
  success: "text-appSuccess",
  danger: "text-appDanger",
  warning: "text-appWarning",
};

const toneBg = {
  primary: "bg-appPeach",
  success: "bg-appMint",
  danger: "bg-appDanger/10",
  warning: "bg-appYellow",
};

const MetricCard = ({ label, value, icon: Icon, tone, isCount }: MetricCardProps) => (
  <Card hoverable className="border-appBorder/60">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-appMuted">{label}</p>
        {isCount ? (
          <p className={cn("mt-2 text-3xl font-extrabold tracking-tight", toneClass[tone])}>{value}</p>
        ) : (
          <AmountText amount={value} className={cn("mt-2 block text-2xl font-extrabold tracking-tight", toneClass[tone])} />
        )}
      </div>
      <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", toneBg[tone], toneClass[tone])}>
        <Icon className="h-5 w-5" />
      </div>
    </div>
  </Card>
);

const QuickAction = ({
  label,
  description,
  icon: Icon,
  onClick,
}: {
  label: string;
  description: string;
  icon: React.ElementType;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="premium-card-hover group rounded-[24px] border border-appBorder bg-appCard p-4 text-left shadow-sm"
  >
    <div className="flex items-start gap-3">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-appPeach text-appPrimary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-appText">{label}</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-appMuted">{description}</p>
      </div>
    </div>
  </button>
);

const ChartCard = ({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  className?: string;
}) => (
  <Card className={cn("border-appBorder/60", className)}>
    <div className="mb-5 flex items-start justify-between gap-4">
      <div>
        <h3 className="text-sm font-extrabold text-appText">{title}</h3>
        <p className="mt-1 text-xs font-semibold leading-5 text-appMuted">{subtitle}</p>
      </div>
    </div>
    {children}
  </Card>
);

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { summary, monthlyChart, loanTypeChart, isLoading, error, refetch } = useDashboard();
  const goalSummaryQuery = useGoalSummary();

  if (isLoading) return <LoadingState message="Loading dashboard..." type="card-skeletons" count={6} />;
  if (error) return <ErrorState onRetry={refetch} message="Could not fetch dashboard summary." />;

  const chartData = monthlyChart?.length ? monthlyChart : [];
  const pieData = loanTypeChart?.length
    ? loanTypeChart.map((item) => ({ name: item.type === "GIVEN" ? "Given" : "Taken", value: item.amount }))
    : [];
  const pieColors = [chartPalette.primary, chartPalette.muted];
  const balance = summary?.overallBalance || 0;
  const goalSummary = goalSummaryQuery.data;
  const nearestGoal = goalSummary?.nearestGoal;
  const goalProgress = goalSummary?.totalTargetAmount
    ? Math.min(100, Math.round((goalSummary.totalSavedAmount / goalSummary.totalTargetAmount) * 100))
    : 0;

  const metrics: MetricCardProps[] = [
    {
      label: "Mujhe Lene Hain",
      value: summary?.netReceivable || 0,
      icon: ArrowUpRight,
      tone: "success",
    },
    {
      label: "Mujhe Dene Hain",
      value: summary?.netPayable || 0,
      icon: ArrowDownLeft,
      tone: "danger",
    },
    {
      label: "Total Wapis Mila",
      value: summary?.totalReceivedBack || 0,
      icon: CheckCircle,
      tone: "primary",
    },
    {
      label: "Overdue Loans",
      value: summary?.overdueLoans || 0,
      icon: Clock,
      tone: "warning",
      isCount: true,
    },
  ];

  return (
    <div className="w-full space-y-7">
      <PageHeader
        kicker="Overview"
        title="Dashboard"
        description="A clean picture of your loans, repayments, expenses, and saving progress."
        icon={<WalletCards className="h-6 w-6" />}
      />

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <Card variant="elevated" className="border-appBorder/60">
          <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <Badge variant={balance >= 0 ? "success" : "danger"} size="sm">
                {balance >= 0 ? "Positive balance" : "Payable balance"}
              </Badge>
              <p className="mt-5 text-[10px] font-black uppercase tracking-[0.22em] text-appMuted">Overall Balance</p>
              <AmountText
                amount={Math.abs(balance)}
                className={cn(
                  "mt-2 block text-4xl font-extrabold tracking-tight sm:text-5xl",
                  balance >= 0 ? "text-appText" : "text-appDanger",
                )}
              />
              <p className="mt-4 max-w-xl text-sm font-semibold leading-6 text-appMuted">
                {balance >= 0
                  ? "Net receivable is higher than payable. Aapka hisaab positive hai."
                  : "Net payable is higher than receivable. Payback planning zaroori hai."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-appBorder/60 bg-appBgSoft p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Active</p>
                <p className="mt-1 text-2xl font-extrabold text-appText">{summary?.activeLoans || 0}</p>
              </div>
              <div className="rounded-2xl border border-appBorder/60 bg-appBgSoft p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Completed</p>
                <p className="mt-1 text-2xl font-extrabold text-appSuccess">{summary?.completedLoans || 0}</p>
              </div>
              <div className="col-span-2 rounded-2xl border border-appBorder/60 bg-appBgSoft p-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Total Loan Volume</p>
                <AmountText
                  amount={(summary?.totalLoanGiven || 0) + (summary?.totalLoanTaken || 0)}
                  className="mt-1 block text-2xl font-extrabold text-appText"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card hoverable className="border-appBorder/60" onClick={() => navigate(ROUTES.GOALS)}>
          <div className="flex h-full flex-col justify-between gap-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-appMuted">Saving Goals</p>
                <h2 className="mt-2 text-xl font-extrabold text-appText">
                  {goalSummary?.activeGoals ? `${goalSummary.activeGoals} active` : "No active goals"}
                </h2>
                <p className="mt-2 text-xs font-semibold leading-5 text-appMuted">
                  {nearestGoal
                    ? `${nearestGoal.progressPercent}% complete for ${nearestGoal.title}`
                    : "Add a target and save money step by step."}
                </p>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-appPeach text-appPrimary">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-appMuted">
                <span>Progress</span>
                <span>{goalProgress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-appBorder">
                <div className="h-full rounded-full bg-appPrimary transition-all duration-500 ease-out" style={{ width: `${goalProgress}%` }} />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-appBgSoft p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Saved</p>
                  <AmountText amount={goalSummary?.totalSavedAmount || 0} className="mt-1 block text-sm font-extrabold text-appSuccess" />
                </div>
                <div className="rounded-2xl bg-appBgSoft p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-appMuted">Target</p>
                  <AmountText amount={goalSummary?.totalTargetAmount || 0} className="mt-1 block text-sm font-extrabold text-appText" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => <MetricCard key={metric.label} {...metric} />)}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickAction
          label="Add Loan"
          description="Record money given or taken."
          icon={HandCoins}
          onClick={() => navigate(ROUTES.ADD_LOAN)}
        />
        <QuickAction
          label="Add Payment"
          description="Update a partial repayment."
          icon={Coins}
          onClick={() => navigate(ROUTES.ADD_PAYMENT)}
        />
        <QuickAction
          label="Add Expense / Income"
          description="Log everyday cash movement."
          icon={WalletCards}
          onClick={() => navigate(ROUTES.ADD_TRANSACTION)}
        />
        <QuickAction
          label="Add Goal"
          description="Save toward a personal target."
          icon={Target}
          onClick={() => navigate(ROUTES.ADD_GOAL)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <ChartCard
          title="Monthly Loan Activity"
          subtitle="Given, taken, received, and paid trend."
          className="lg:col-span-2"
        >
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ReBarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartPalette.border} opacity={0.7} vertical={false} />
                <XAxis dataKey="month" fontSize={11} tickLine={false} axisLine={false} stroke={chartPalette.mutedText} />
                <YAxis fontSize={11} tickLine={false} axisLine={false} stroke={chartPalette.mutedText} />
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: chartPalette.text, fontWeight: 800 }} cursor={{ fill: "var(--background-soft)" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 700, color: chartPalette.mutedText }} />
                <Bar name="Given" dataKey="given" fill={chartPalette.primary} radius={[8, 8, 0, 0]} />
                <Bar name="Taken" dataKey="taken" fill={chartPalette.muted} radius={[8, 8, 0, 0]} />
                <Bar name="Received" dataKey="received" fill={chartPalette.success} radius={[8, 8, 0, 0]} />
                <Bar name="Paid" dataKey="paid" fill={chartPalette.warning} radius={[8, 8, 0, 0]} />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Loan Type Split" subtitle="Given vs taken principal.">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={62} outerRadius={88} dataKey="value" paddingAngle={4}>
                  {pieData.map((_item, index) => <Cell key={index} fill={pieColors[index % pieColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: chartPalette.text, fontWeight: 800 }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: 12, fontWeight: 700, color: chartPalette.mutedText }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;
