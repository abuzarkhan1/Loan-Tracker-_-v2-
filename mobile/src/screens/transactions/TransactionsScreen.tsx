import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, Plus, SlidersHorizontal, WalletCards } from "lucide-react-native";
import { useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { api } from "../../api/client";
import { TransactionType } from "../../api/types";
import { TransactionCard } from "../../components/TransactionCard";
import { Screen } from "../../components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { RootStackParamList } from "../../navigation/types";
import { useAppTheme } from "../../providers/ThemeProvider";
import { transactionTypeLabels, transactionTypeTone } from "../../utils/finance";
import { fontFamily } from "../../utils/theme";

type Navigation = NativeStackNavigationProp<RootStackParamList>;
type MonthOption = { key: string; label: string; from: string; to: string };

const toDateInput = (date: Date) => date.toISOString().slice(0, 10);

const buildMonthOptions = () => {
  const now = new Date();

  return Array.from({ length: 5 }).map((_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (4 - index), 1);
    const next = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    const end = new Date(next.getTime() - 1);

    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: new Intl.DateTimeFormat("en", { month: "short" }).format(date),
      from: toDateInput(date),
      to: toDateInput(end),
    };
  });
};

const formatDashboardCurrency = (value = 0) => {
  if (!value) return "Rs 0";
  const sign = value < 0 ? "-" : "";
  return `Rs ${sign}${Math.abs(value).toLocaleString("en-PK")}`;
};

const MonthChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={{
        minHeight: 38,
        minWidth: 66,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: active ? theme.primary : theme.border,
        backgroundColor: active ? theme.peach : theme.card,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
      }}
    >
      <Text style={{ color: active ? theme.primaryDark : theme.muted, fontFamily: fontFamily.extraBold, fontSize: 12.5 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const TypeChip = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      className="rounded-full border px-4 py-2"
      style={{ borderColor: active ? theme.primary : theme.border, backgroundColor: active ? theme.peach : theme.pill }}
    >
      <Text style={{ color: active ? theme.primaryDark : theme.muted, fontFamily: fontFamily.bold, fontSize: 11.5 }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const SummaryTile = ({
  label,
  amount,
  positive,
}: {
  label: string;
  amount: number;
  positive: boolean;
}) => {
  const { theme } = useAppTheme();
  const Icon = positive ? ArrowDownLeft : ArrowUpRight;
  const toneColor = positive ? theme.success : theme.danger;
  const toneBg = positive ? theme.mint : theme.peach;

  return (
    <View
      className="flex-1 rounded-2xl px-4 py-4"
      style={{ backgroundColor: theme.backgroundSoft }}
    >
      <View className="flex-row items-center gap-2">
        <View
          style={{
            height: 26,
            width: 26,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: toneBg,
          }}
        >
          <Icon color={toneColor} size={13} strokeWidth={2.5} />
        </View>
        <Text style={{ color: theme.muted, fontFamily: fontFamily.bold, fontSize: 12 }}>
          {label}
        </Text>
      </View>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.74}
        style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 18, marginTop: 11 }}
      >
        {formatDashboardCurrency(amount)}
      </Text>
    </View>
  );
};

const CashFlowSummary = ({
  monthLabel,
  income,
  expense,
  net,
}: {
  monthLabel: string;
  income: number;
  expense: number;
  net: number;
}) => {
  const { theme } = useAppTheme();
  const positive = net >= 0;

  return (
    <View
      className="mt-5"
      style={[
        {
          borderRadius: 28,
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
          padding: 18,
        },
        theme.shadowElevated,
      ]}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text style={{ color: theme.muted, fontFamily: fontFamily.extraBold, fontSize: 10.5 }}>
            {monthLabel.toUpperCase()} CASH FLOW
          </Text>
          <Text style={{ color: theme.muted, fontFamily: fontFamily.bold, fontSize: 11.5, marginTop: 4 }}>
            Income minus expenses
          </Text>
        </View>
        <View
          style={{
            height: 42,
            width: 42,
            borderRadius: 15,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: positive ? theme.mint : theme.peach,
          }}
        >
          <WalletCards color={positive ? theme.success : theme.primaryDark} size={19} strokeWidth={2.4} />
        </View>
      </View>

      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 34, marginTop: 13 }}
      >
        {formatDashboardCurrency(net)}
      </Text>

      <View className="mt-5 flex-row gap-3">
        <SummaryTile label="Amdani" amount={income} positive />
        <SummaryTile label="Kharchay" amount={expense} positive={false} />
      </View>
    </View>
  );
};

export const TransactionsScreen = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<Navigation>();
  const monthOptions = useMemo(buildMonthOptions, []);
  const [selectedMonth, setSelectedMonth] = useState<MonthOption>(monthOptions[monthOptions.length - 1]);
  const [type, setType] = useState<TransactionType | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  const transactionsQuery = useQuery({
    queryKey: ["transactions", selectedMonth.key, type],
    queryFn: () => api.getTransactions({
      type,
      dateFrom: selectedMonth.from,
      dateTo: selectedMonth.to,
      limit: 80,
    }),
  });

  const transactions = transactionsQuery.data?.transactions || [];
  const totals = transactions.reduce(
    (acc, transaction) => {
      const inflow = transactionTypeTone[transaction.type] === "inflow";
      if (inflow) acc.income += transaction.amount;
      else acc.expense += transaction.amount;
      return acc;
    },
    { income: 0, expense: 0 },
  );
  const net = totals.income - totals.expense;

  return (
    <Screen className="pt-1">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 26 }}>Expenses</Text>
          <Text style={{ color: theme.muted, fontFamily: fontFamily.semiBold, fontSize: 12.5, marginTop: 5 }}>
            Income, expenses, and loan cash flow
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={() => navigation.navigate("AddTransaction")}
          style={{
            height: 48,
            width: 48,
            borderRadius: 17,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.primary,
            shadowColor: theme.primaryDark,
            shadowOpacity: 0.18,
            shadowRadius: 16,
            shadowOffset: { width: 0, height: 8 },
            elevation: 5,
          }}
        >
          <Plus color={theme.white} size={25} strokeWidth={2.1} />
        </TouchableOpacity>
      </View>

      <CashFlowSummary
        monthLabel={selectedMonth.label}
        income={totals.income}
        expense={totals.expense}
        net={net}
      />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-5 -mx-5"
        contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
      >
        {monthOptions.map((month) => (
          <MonthChip
            key={month.key}
            label={month.label}
            active={selectedMonth.key === month.key}
            onPress={() => setSelectedMonth(month)}
          />
        ))}
      </ScrollView>

      <View className="mt-6 flex-row items-center justify-between">
        <View>
          <Text style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 20 }}>Transactions</Text>
          <Text style={{ color: theme.muted, fontFamily: fontFamily.semiBold, fontSize: 11.5, marginTop: 2 }}>
            {transactions.length} records
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.86}
          className="flex-row items-center gap-2 rounded-full border px-3 py-2"
          onPress={() => setShowFilters((value) => !value)}
          style={{ borderColor: showFilters ? theme.primary : theme.border, backgroundColor: showFilters ? theme.peach : theme.card }}
        >
          <SlidersHorizontal color={theme.primaryDark} size={16} />
          <Text style={{ color: theme.primaryDark, fontFamily: fontFamily.extraBold, fontSize: 12 }}>
            Filter
          </Text>
        </TouchableOpacity>
      </View>

      {showFilters ? (
        <View className="mt-3 flex-row flex-wrap gap-2">
          <TypeChip label="All" active={!type} onPress={() => setType(undefined)} />
          <TypeChip label="Income" active={type === "INCOME"} onPress={() => setType("INCOME")} />
          <TypeChip label="Expense" active={type === "EXPENSE"} onPress={() => setType("EXPENSE")} />
          <TypeChip label="Recovery" active={type === "LOAN_RECOVERY"} onPress={() => setType("LOAN_RECOVERY")} />
          <TypeChip label="Repayment" active={type === "LOAN_REPAYMENT"} onPress={() => setType("LOAN_REPAYMENT")} />
        </View>
      ) : null}

      <View
        className="mt-4 rounded-3xl border px-4 py-3"
        style={[
          { borderColor: theme.border, backgroundColor: theme.card },
          theme.shadowSoft,
        ]}
      >
        {transactionsQuery.isLoading ? <LoadingState label="Loading transactions..." /> : null}
        {transactionsQuery.isError ? <ErrorState message="Transactions load nahi ho sake." onRetry={transactionsQuery.refetch} /> : null}

        {!transactionsQuery.isLoading && !transactionsQuery.isError ? (
          transactions.length ? transactions.map((transaction, index) => (
            <TransactionCard
              key={transaction._id}
              transaction={transaction}
              showDivider={index !== transactions.length - 1}
              onPress={() => navigation.navigate("TransactionDetail", { transactionId: transaction._id })}
            />
          )) : (
            <EmptyState
              title="No transactions yet"
              subtitle={type ? `${transactionTypeLabels[type]} records abhi nahi hain.` : "Is mahine abhi koi income ya expense record nahi hai."}
            />
          )
        ) : null}
      </View>
    </Screen>
  );
};
