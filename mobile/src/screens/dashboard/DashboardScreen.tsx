import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ChevronRight,
  HandCoins,
  Scale,
  Target,
  TrendingUp,
  WalletCards,
  type LucideIcon,
} from "lucide-react-native";
import { useMemo } from "react";
import { Text, TouchableOpacity, useWindowDimensions, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Svg, { G, Line, Rect, Text as SvgText } from "react-native-svg";
import type { GoalSummary, MonthlyChartPoint } from "../../api/types";
import { api } from "../../api/client";
import { Screen } from "../../components/Screen";
import { ProgressBar } from "../../components/ProgressBar";
import { ErrorState, LoadingState } from "../../components/StateViews";
import { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../../providers/AuthProvider";
import { useAppTheme } from "../../providers/ThemeProvider";
import { formatCurrency } from "../../utils/format";
import { fontFamily } from "../../utils/theme";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const currency = (value = 0) => formatCurrency(value).replace(/\u00a0/g, " ");

const getInitials = (name?: string) => {
  const parts = (name || "User").trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "U";
};

const buildEmptyMonthlyData = () => {
  const now = new Date();

  return Array.from({ length: 6 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    return {
      month: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      given: 0,
      taken: 0,
      received: 0,
      paid: 0,
    };
  });
};

const monthLabel = (month: string) => {
  const [year, monthIndex] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(year, monthIndex - 1, 1));
};

const SurfaceCard = ({ children, className = "", compact = false }: { children: React.ReactNode; className?: string; compact?: boolean }) => {
  const { theme } = useAppTheme();

  return (
    <View
      className={className}
      style={[
        {
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          padding: compact ? 16 : 24,
        },
        theme.shadowSoft,
      ]}
    >
      {children}
    </View>
  );
};

const DashboardHeader = ({ name }: { name?: string }) => {
  const { theme } = useAppTheme();
  const displayName = name || "User";

  return (
    <View className="flex-row items-center justify-between gap-4">
      <View className="flex-1">
        <Text style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 13 }}>
          Assalam-o-Alaikum
        </Text>
        <Text
          numberOfLines={1}
          style={{ color: theme.text, fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40, marginTop: 2 }}
        >
          {displayName}
        </Text>
        <Text style={{ color: theme.textSecondary, fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22, marginTop: 2 }}>
          Your loan and money overview
        </Text>
      </View>
      <View
        style={{
          height: 44,
          width: 44,
          borderRadius: 999,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.surface,
          borderWidth: 1,
          borderColor: theme.border,
        }}
      >
        <Text style={{ color: theme.primary, fontFamily: fontFamily.bold, fontSize: 15 }}>
          {getInitials(displayName)}
        </Text>
      </View>
    </View>
  );
};

const BalanceCard = ({
  balance,
  active,
  overdue,
}: {
  balance: number;
  active: number;
  overdue: number;
}) => {
  const { theme } = useAppTheme();
  const positive = balance >= 0;
  const panelColors = theme.mode === "dark"
    ? (["#070C18", "#0F1D33", "#1A2B4A"] as const)
    : (["#0A2540", "#123456"] as const);
  const panelMuted = theme.mode === "dark" ? "#8B9CB5" : "#A3ACB9";
  const panelSecondary = theme.mode === "dark" ? "#F0F6FC" : "#C7D2E1";
  const panelBorder = theme.mode === "dark" ? "#2A3441" : "rgba(255,255,255,0.12)";
  const statBg = theme.mode === "dark" ? "rgba(240,246,252,0.06)" : "rgba(246,249,252,0.08)";
  const statBorder = theme.mode === "dark" ? "rgba(42,52,65,0.9)" : "rgba(227,232,238,0.10)";
  const badgeBg = theme.mode === "dark" ? "rgba(124,115,255,0.20)" : "rgba(99,91,255,0.18)";
  const badgeBorder = theme.mode === "dark" ? "rgba(124,115,255,0.34)" : "rgba(122,115,255,0.34)";
  const overdueColor = theme.mode === "dark" ? "#F85149" : "#FFB2C0";

  return (
    <LinearGradient
      colors={panelColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        {
          marginTop: 24,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: panelBorder,
          padding: 24,
        },
        theme.shadowElevated,
      ]}
    >
      <View className="flex-row items-center justify-between gap-3">
        <View>
          <Text style={{ color: panelMuted, fontFamily: fontFamily.semiBold, fontSize: 12 }}>
            OVERALL BALANCE
          </Text>
          <Text style={{ color: panelSecondary, fontFamily: fontFamily.regular, fontSize: 13, marginTop: 4 }}>
            {positive ? "Net receivable" : "Net payable"}
          </Text>
        </View>
        <View
          className="flex-row items-center gap-1.5 px-3 py-2"
          style={{ backgroundColor: badgeBg, borderRadius: 6, borderWidth: 1, borderColor: badgeBorder }}
        >
          {positive ? <TrendingUp color={theme.white} size={13} /> : <ArrowUpRight color={theme.white} size={13} />}
          <Text
            style={{
              color: theme.white,
              fontFamily: fontFamily.medium,
              fontSize: 13,
            }}
          >
            {positive ? "Positive" : "Payable"}
          </Text>
        </View>
      </View>

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.7}
        style={{ color: theme.white, fontFamily: fontFamily.bold, fontSize: 40, lineHeight: 48, marginTop: 18 }}
      >
        {currency(Math.abs(balance))}
      </Text>

      <View className="mt-6 flex-row gap-3">
        <View className="flex-1 px-4 py-3" style={{ backgroundColor: statBg, borderRadius: 8, borderWidth: 1, borderColor: statBorder }}>
          <Text style={{ color: panelMuted, fontFamily: fontFamily.medium, fontSize: 12 }}>Active Loans</Text>
          <Text style={{ color: theme.white, fontFamily: fontFamily.semiBold, fontSize: 20, marginTop: 4 }}>{active}</Text>
        </View>
        <View className="flex-1 px-4 py-3" style={{ backgroundColor: statBg, borderRadius: 8, borderWidth: 1, borderColor: statBorder }}>
          <Text style={{ color: panelMuted, fontFamily: fontFamily.medium, fontSize: 12 }}>Overdue</Text>
          <Text style={{ color: overdue > 0 ? overdueColor : theme.white, fontFamily: fontFamily.semiBold, fontSize: 20, marginTop: 4 }}>
            {overdue}
          </Text>
        </View>
      </View>
    </LinearGradient>
  );
};

const MetricTile = ({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: "success" | "danger" | "primary" | "warning";
}) => {
  const { theme } = useAppTheme();
  const toneColor =
    tone === "success" ? theme.success : tone === "danger" ? theme.danger : tone === "warning" ? theme.warning : theme.primary;
  const toneBg =
    tone === "success" ? theme.mint : tone === "danger" ? theme.peach : tone === "warning" ? theme.yellow : theme.backgroundSoft;

  return (
    <SurfaceCard className="w-[48.5%]" compact>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text style={{ color: theme.muted, fontFamily: fontFamily.semiBold, fontSize: 12 }}>
            {label}
          </Text>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.72}
            style={{ color: theme.text, fontFamily: fontFamily.semiBold, fontSize: 20, marginTop: 8 }}
          >
            {currency(value)}
          </Text>
        </View>
        <View
          style={{
            height: 36,
            width: 36,
            borderRadius: 8,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: toneBg,
          }}
        >
          <Icon color={toneColor} size={18} strokeWidth={2.5} />
        </View>
      </View>
    </SurfaceCard>
  );
};

const SectionTitle = ({
  title,
  action,
  onPress,
}: {
  title: string;
  action?: string;
  onPress?: () => void;
}) => {
  const { theme } = useAppTheme();

  return (
    <View className="mb-3 mt-6 flex-row items-center justify-between">
      <Text style={{ color: theme.text, fontFamily: fontFamily.semiBold, fontSize: 20 }}>{title}</Text>
      {action && onPress ? (
        <TouchableOpacity activeOpacity={0.85} className="flex-row items-center gap-1" onPress={onPress}>
          <Text style={{ color: theme.primary, fontFamily: fontFamily.medium, fontSize: 13 }}>{action}</Text>
          <ChevronRight color={theme.primary} size={15} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const LegendItem = ({ color, label }: { color: string; label: string }) => {
  const { theme } = useAppTheme();

  return (
    <View className="flex-row items-center gap-1.5">
      <View style={{ height: 8, width: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 12 }}>{label}</Text>
    </View>
  );
};

const MonthlyFlowCard = ({
  data,
  chartWidth,
}: {
  data: MonthlyChartPoint[];
  chartWidth: number;
}) => {
  const { theme } = useAppTheme();
  const chartData = data.length ? data : buildEmptyMonthlyData();
  const successColor = theme.success;
  const dangerColor = theme.danger;
  const gridColor = theme.mode === "dark" ? "rgba(227,232,238,0.10)" : "#E3E8EE";
  const maxValue = Math.max(...chartData.flatMap((item) => [item.received, item.paid]), 1);
  const chartHeight = 128;
  const plotTop = 8;
  const plotHeight = 76;
  const labelY = 112;
  const groupWidth = chartWidth / chartData.length;
  const barWidth = Math.min(11, groupWidth * 0.18);
  const barGap = 7;
  const netPeriod = chartData.reduce((total, item) => total + item.received - item.paid, 0);

  return (
    <SurfaceCard>
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text style={{ color: theme.muted, fontFamily: fontFamily.semiBold, fontSize: 12 }}>
            LAST 6 MONTHS
          </Text>
          <Text style={{ color: theme.text, fontFamily: fontFamily.semiBold, fontSize: 20, marginTop: 4 }}>
            Received vs Paid
          </Text>
        </View>
        <View className="mt-1 flex-row gap-3">
          <LegendItem color={successColor} label="Mila" />
          <LegendItem color={dangerColor} label="Diya" />
        </View>
      </View>

      <View className="mt-4 overflow-hidden">
        <Svg width={chartWidth} height={chartHeight}>
          {[0, 1, 2].map((item) => {
            const y = plotTop + (item * plotHeight) / 2;
            return <Line key={item} x1={0} x2={chartWidth} y1={y} y2={y} stroke={gridColor} strokeWidth={1} />;
          })}
          {chartData.map((item, index) => {
            const center = groupWidth * index + groupWidth / 2;
            const receivedHeight = (item.received / maxValue) * plotHeight;
            const paidHeight = (item.paid / maxValue) * plotHeight;

            return (
              <G key={item.month}>
                <Rect
                  x={center - barGap / 2 - barWidth}
                  y={plotTop + plotHeight - receivedHeight}
                  width={barWidth}
                  height={receivedHeight}
                  rx={7}
                  fill={successColor}
                />
                <Rect
                  x={center + barGap / 2}
                  y={plotTop + plotHeight - paidHeight}
                  width={barWidth}
                  height={paidHeight}
                  rx={7}
                  fill={dangerColor}
                />
                <SvgText
                  x={center}
                  y={labelY}
                  fill={theme.muted}
                  fontFamily={fontFamily.medium}
                  fontSize={10}
                  textAnchor="middle"
                >
                  {monthLabel(item.month)}
                </SvgText>
              </G>
            );
          })}
        </Svg>
      </View>

      <View className="mt-1 flex-row items-center justify-between gap-4">
        <Text style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 13 }}>
          Net movement
        </Text>
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.78}
          style={{
            color: netPeriod >= 0 ? theme.success : theme.danger,
            fontFamily: fontFamily.semiBold,
            fontSize: 16,
          }}
        >
          {netPeriod >= 0 ? "+" : ""}
          {currency(netPeriod)}
        </Text>
      </View>
    </SurfaceCard>
  );
};

const GoalShortcutCard = ({ summary, onPress }: { summary?: GoalSummary; onPress: () => void }) => {
  const { theme } = useAppTheme();
  const nearestGoal = summary?.nearestGoal;
  const activeGoals = summary?.activeGoals || 0;
  const totalSaved = summary?.totalSavedAmount || 0;
  const totalTarget = summary?.totalTargetAmount || 0;
  const progress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;

  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress}>
      <View
        className="mt-5 rounded-3xl border p-4"
        style={[{ backgroundColor: theme.card, borderColor: theme.border }, theme.shadowSoft]}
      >
        <View className="flex-row items-start gap-3">
          <View
            style={{
              height: 44,
              width: 44,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: theme.surface,
            }}
          >
            <Target color={theme.primary} size={21} />
          </View>
          <View className="min-w-0 flex-1">
            <View className="flex-row items-start justify-between gap-3">
              <View className="min-w-0 flex-1">
                <Text style={{ color: theme.text, fontFamily: fontFamily.semiBold, fontSize: 16 }}>
                  Saving Goals
                </Text>
                <Text numberOfLines={1} style={{ color: theme.muted, fontFamily: fontFamily.semiBold, fontSize: 12, marginTop: 4 }}>
                  {activeGoals ? `${activeGoals} active · ${currency(totalSaved)} saved` : "Add your first saving target"}
                </Text>
              </View>
              <View className="flex-row items-center gap-1">
                <Text style={{ color: theme.primary, fontFamily: fontFamily.medium, fontSize: 13 }}>
                  Open
                </Text>
                <ChevronRight color={theme.primary} size={15} />
              </View>
            </View>

            {activeGoals ? (
              <View className="mt-4 gap-2">
                <View className="flex-row items-center justify-between gap-3">
                  <Text numberOfLines={1} style={{ color: theme.text, fontFamily: fontFamily.medium, fontSize: 13, flex: 1 }}>
                    {nearestGoal?.title || "All active goals"}
                  </Text>
                  <Text style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 12 }}>
                    {progress}%
                  </Text>
                </View>
                <ProgressBar progress={progress} />
                {nearestGoal ? (
                  <Text style={{ color: theme.muted, fontFamily: fontFamily.semiBold, fontSize: 11 }}>
                    {currency(nearestGoal.remainingAmount)} left for {nearestGoal.title}
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export const DashboardScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { user } = useAuth();
  const { theme } = useAppTheme();
  const { width } = useWindowDimensions();
  const chartWidth = Math.max(220, width - 72);

  const summaryQuery = useQuery({ queryKey: ["dashboard", "summary"], queryFn: api.getSummary });
  const monthlyQuery = useQuery({ queryKey: ["dashboard", "monthly-chart", 6], queryFn: () => api.getMonthlyChart(6) });
  const goalsSummaryQuery = useQuery({ queryKey: ["goals", "summary"], queryFn: api.getGoalSummary });

  const monthlyData = useMemo(() => monthlyQuery.data || buildEmptyMonthlyData(), [monthlyQuery.data]);

  if (summaryQuery.isLoading) {
    return (
      <Screen>
        <LoadingState label="Loading dashboard..." />
      </Screen>
    );
  }

  if (summaryQuery.isError || !summaryQuery.data) {
    return (
      <Screen>
        <ErrorState message="Dashboard load nahi ho saka." onRetry={summaryQuery.refetch} />
      </Screen>
    );
  }

  const summary = summaryQuery.data;

  return (
    <Screen className="pt-1">
      <DashboardHeader name={user?.name} />

      <BalanceCard
        balance={summary.overallBalance}
        active={summary.activeLoans}
        overdue={summary.overdueLoans}
      />

      <View className="mt-4 flex-row flex-wrap justify-between gap-y-3">
        <MetricTile label="MUJHE LENE HAIN" value={summary.netReceivable} tone="success" icon={ArrowDownLeft} />
        <MetricTile label="MUJHE DENE HAIN" value={summary.netPayable} tone="danger" icon={ArrowUpRight} />
        <MetricTile label="WAPIS MILA" value={summary.totalReceivedBack} tone="primary" icon={HandCoins} />
        <MetricTile label="WAPIS DIYA" value={summary.totalPaidBack} tone="warning" icon={WalletCards} />
      </View>

      <GoalShortcutCard summary={goalsSummaryQuery.data} onPress={() => navigation.navigate("Goals")} />

      <SectionTitle title="Monthly Flow" action="Transactions" onPress={() => navigation.navigate("Transactions")} />
      {monthlyQuery.isError ? (
        <ErrorState message="Monthly flow load nahi ho saka." onRetry={monthlyQuery.refetch} />
      ) : (
        <MonthlyFlowCard data={monthlyData} chartWidth={chartWidth} />
      )}

      <View className="mt-6 flex-row items-center justify-center gap-2">
        <Scale color={theme.muted} size={14} />
        <Text style={{ color: theme.muted, fontFamily: fontFamily.bold, fontSize: 11.5 }}>
          Simple ledger. Clear balance. No extra noise.
        </Text>
      </View>
    </Screen>
  );
};
