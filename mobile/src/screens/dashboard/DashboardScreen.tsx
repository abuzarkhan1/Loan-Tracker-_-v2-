import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { ArrowDownLeft, ArrowUpRight, ContactRound, Landmark, Plus, ReceiptText, WalletCards } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { api } from "../../api/client";
import { AppButton } from "../../components/AppButton";
import { Screen } from "../../components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { SummaryCard } from "../../components/SummaryCard";
import { RootStackParamList } from "../../navigation/types";
import { useAuth } from "../../providers/AuthProvider";
import { useAppTheme } from "../../providers/ThemeProvider";
import { formatCurrency } from "../../utils/format";
import { fontFamily } from "../../utils/theme";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const QuickAction = ({ title, icon: Icon, onPress }: { title: string; icon: typeof Plus; onPress: () => void }) => {
  const { theme } = useAppTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      className="flex-1 items-center gap-2 rounded-3xl border p-4"
      style={{ borderColor: theme.border, backgroundColor: theme.card, ...theme.shadowSoft }}
    >
      <View className="h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: theme.peach }}>
        <Icon color={theme.primary} size={20} />
      </View>
      <Text className="text-center text-xs font-black text-dark">{title}</Text>
    </TouchableOpacity>
  );
};

export const DashboardScreen = () => {
  const navigation = useNavigation<Navigation>();
  const { user } = useAuth();
  const { theme } = useAppTheme();
  const summaryQuery = useQuery({ queryKey: ["dashboard", "summary"], queryFn: api.getSummary });
  const loansQuery = useQuery({ queryKey: ["loans", "dashboard"], queryFn: () => api.getLoans({ limit: 4 }) });
  const transactionsQuery = useQuery({ queryKey: ["transactions", "dashboard"], queryFn: () => api.getTransactions({ limit: 5 }) });

  if (summaryQuery.isLoading) return <Screen><LoadingState label="Loading dashboard..." /></Screen>;
  if (summaryQuery.isError || !summaryQuery.data) {
    return <Screen><ErrorState message="Dashboard load nahi ho saka." onRetry={summaryQuery.refetch} /></Screen>;
  }

  const summary = summaryQuery.data;
  const recentLoans = loansQuery.data?.loans || [];
  const recentTransactions = transactionsQuery.data?.transactions || [];

  return (
    <Screen>
      <View className="gap-1">
        <Text className="text-sm font-bold text-muted">Assalam o Alaikum{user?.name ? `, ${user.name}` : ""}</Text>
        <Text className="text-3xl font-black text-dark">Loan Tracker</Text>
        <Text className="text-sm font-semibold text-muted">Loans, payments, expenses aur income ek simple jagah.</Text>
      </View>

      <View className="mt-6 flex-row flex-wrap justify-between gap-y-3">
        <SummaryCard label="Mujhe Lene Hain" value={formatCurrency(summary.netReceivable)} tone="success" icon={ArrowDownLeft} />
        <SummaryCard label="Mujhe Dene Hain" value={formatCurrency(summary.netPayable)} tone="danger" icon={ArrowUpRight} />
        <SummaryCard label="Total Wapis Mila" value={formatCurrency(summary.totalReceivedBack)} tone="primary" icon={ReceiptText} />
        <SummaryCard label="Total Wapis Diya" value={formatCurrency(summary.totalPaidBack)} tone="warning" icon={WalletCards} />
      </View>

      <View className="mt-4 rounded-3xl border p-5" style={{ borderColor: theme.border, backgroundColor: theme.card, ...theme.shadowSoft }}>
        <Text className="text-sm font-bold text-muted">Overall Balance</Text>
        <Text className="mt-2 text-3xl font-black text-dark">{formatCurrency(summary.overallBalance)}</Text>
        <Text className="mt-2 text-xs font-semibold text-muted">
          Active {summary.activeLoans} · Completed {summary.completedLoans} · Overdue {summary.overdueLoans}
        </Text>
      </View>

      <View className="mt-6">
        <Text className="mb-3 text-lg font-black text-dark">Quick Actions</Text>
        <View className="flex-row gap-3">
          <QuickAction title="Naya Loan" icon={Landmark} onPress={() => navigation.navigate("LoanForm")} />
          <QuickAction title="Expense" icon={ReceiptText} onPress={() => navigation.navigate("AddExpense")} />
          <QuickAction title="Income" icon={WalletCards} onPress={() => navigation.navigate("AddIncome")} />
          <QuickAction title="Contact" icon={ContactRound} onPress={() => navigation.navigate("ContactForm")} />
        </View>
      </View>

      <View className="mt-7">
        <View className="mb-3 flex-row items-center justify-between">
          <Text style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 18 }}>Recent Loans</Text>
          <AppButton title="View" variant="ghost" onPress={() => navigation.navigate("MainTabs", { screen: "Loans" })} />
        </View>
        {recentLoans.length ? (
          <View className="gap-3">
            {recentLoans.map((loan) => (
              <TouchableOpacity key={loan._id} activeOpacity={0.86} onPress={() => navigation.navigate("LoanDetail", { loanId: loan._id })} className="rounded-3xl border bg-card p-4">
                <Text className="text-base font-black text-dark">{typeof loan.contactId === "string" ? "Contact" : loan.contactId.name}</Text>
                <Text className="mt-1 text-xs font-bold text-muted">{loan.type} · {loan.status} · Baqi {formatCurrency(loan.remainingAmount)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : <EmptyState title="No loans yet" subtitle="Naya Loan se apna pehla hisaab start karein." />}
      </View>

      <View className="mt-7">
        <View className="mb-3 flex-row items-center justify-between">
          <Text style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 18 }}>Recent Expenses & Income</Text>
          <AppButton title="View" variant="ghost" onPress={() => navigation.navigate("Transactions")} />
        </View>
        {recentTransactions.length ? (
          <View className="gap-3">
            {recentTransactions.map((transaction) => (
              <View key={transaction._id} className="rounded-3xl border bg-card p-4" style={{ borderColor: theme.border }}>
                <Text className="text-base font-black text-dark">{transaction.source || transaction.type}</Text>
                <Text className="mt-1 text-xs font-bold text-muted">{transaction.type} · {transaction.paymentMethod} · {formatCurrency(transaction.amount)}</Text>
              </View>
            ))}
          </View>
        ) : <EmptyState title="No expenses or income" subtitle="Expense ya income add karne ke baad yahan show hoga." />}
      </View>
    </Screen>
  );
};
