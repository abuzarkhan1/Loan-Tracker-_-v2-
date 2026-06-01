import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Edit3, Landmark, Plus, ReceiptText } from "lucide-react-native";
import { Text, View } from "react-native";
import { api } from "../../api/client";
import { AmountText } from "../../components/AmountText";
import { AppButton } from "../../components/AppButton";
import { LoanCard } from "../../components/LoanCard";
import { Screen } from "../../components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { SummaryCard } from "../../components/SummaryCard";
import { RootStackParamList } from "../../navigation/types";
import { useAppTheme } from "../../providers/ThemeProvider";
import { formatCurrency } from "../../utils/format";
import { fontFamily } from "../../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "ContactLoanProfile">;

const sourceLabel = (source?: string) => source === "DEVICE_CONTACT" ? "Phone Contact" : "Manual";

export const ContactLoanProfileScreen = ({ navigation, route }: Props) => {
  const { theme } = useAppTheme();
  const { contactId } = route.params;

  const contactQuery = useQuery({
    queryKey: ["contact", contactId],
    queryFn: () => api.getContact(contactId),
  });

  if (contactQuery.isLoading) return <Screen><LoadingState label="Loading contact profile..." /></Screen>;
  if (contactQuery.isError || !contactQuery.data) {
    return <Screen><ErrorState message="Contact profile load nahi ho saka." onRetry={contactQuery.refetch} /></Screen>;
  }

  const { contact, summary, recentLoans } = contactQuery.data;
  const activeLoans = recentLoans.filter((loan) => loan.remainingAmount > 0);
  const firstActiveLoan = activeLoans[0];

  return (
    <Screen className="pt-5">
      <View className="rounded-3xl border border-border bg-card p-5" style={theme.shadowSoft}>
        <View className="flex-row items-start gap-4">
          <View className="h-14 w-14 items-center justify-center rounded-2xl bg-peach">
            <Text className="text-lg font-black text-primary">{contact.name.trim().charAt(0).toUpperCase()}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-2xl font-black text-dark">{contact.name}</Text>
            <Text className="mt-2 text-sm font-semibold text-muted">{contact.phone || contact.email || "No phone or email"}</Text>
            <View className="mt-3 self-start rounded-full bg-background-soft px-3 py-1">
              <Text className="text-[10px] font-black uppercase text-muted">{sourceLabel(contact.source)}</Text>
            </View>
          </View>
        </View>

        <View className="mt-5 rounded-2xl bg-background-soft p-4">
          <Text className="text-xs font-black uppercase text-muted">Net Balance</Text>
          <AmountText
            amount={summary.overallBalance}
            className="mt-1 text-2xl font-black"
            style={{ color: summary.overallBalance >= 0 ? theme.success : theme.danger, fontFamily: fontFamily.extraBold }}
          />
          <Text className="mt-1 text-xs font-semibold text-muted">
            Positive ka matlab mujhe lene hain, negative ka matlab mujhe dene hain.
          </Text>
        </View>
      </View>

      <View className="mt-5 flex-row flex-wrap justify-between gap-y-3">
        <SummaryCard label="Total Diya" value={formatCurrency(summary.totalGiven)} icon={Landmark} tone="success" />
        <SummaryCard label="Total Liya" value={formatCurrency(summary.totalTaken)} icon={Landmark} tone="danger" />
        <SummaryCard label="Wapis Mila" value={formatCurrency(summary.totalReceivedBack)} icon={Landmark} tone="primary" />
        <SummaryCard label="Wapis Diya" value={formatCurrency(summary.totalPaidBack)} icon={Landmark} tone="warning" />
      </View>

      <View className="mt-5 gap-3">
        <View className="flex-row gap-3">
          <View className="flex-1">
            <AppButton title="I Gave" icon={Plus} onPress={() => navigation.navigate("LoanForm", { contactId, defaultType: "GIVEN" })} />
          </View>
          <View className="flex-1">
            <AppButton title="I Took" icon={Plus} variant="secondary" onPress={() => navigation.navigate("LoanForm", { contactId, defaultType: "TAKEN" })} />
          </View>
        </View>
        <AppButton
          title="Quick Payment"
          icon={ReceiptText}
          variant="secondary"
          onPress={() => {
            if (firstActiveLoan) navigation.navigate("QuickAddPayment", { loanId: firstActiveLoan._id, contactId });
            else navigation.navigate("LoanForm", { contactId });
          }}
        />
        <AppButton title="View Ledger" icon={BookOpen} variant="secondary" onPress={() => navigation.navigate("ContactLedger", { contactId })} />
        <AppButton title="Edit Contact" icon={Edit3} variant="secondary" onPress={() => navigation.navigate("ContactForm", { contactId })} />
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <Text className="text-lg font-black text-dark">Active Loans</Text>
        <Text className="text-xs font-black uppercase text-muted">{activeLoans.length} active</Text>
      </View>
      <View className="mt-4 gap-3">
        {activeLoans.length ? (
          activeLoans.map((loan) => (
            <LoanCard key={loan._id} loan={{ ...loan, contactId: contact }} onPress={() => navigation.navigate("LoanDetail", { loanId: loan._id })} />
          ))
        ) : (
          <EmptyState title="No active loans" subtitle="Loan add karein to contact ka hisaab yahan show hoga." />
        )}
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <Text className="text-lg font-black text-dark">Recent Loans</Text>
        <Text className="text-xs font-black uppercase text-muted">{recentLoans.length} total</Text>
      </View>
      <View className="mt-4 gap-3">
        {recentLoans.length ? (
          recentLoans.map((loan) => (
            <LoanCard key={loan._id} loan={{ ...loan, contactId: contact }} onPress={() => navigation.navigate("LoanDetail", { loanId: loan._id })} />
          ))
        ) : (
          <EmptyState title="No loan history" subtitle="Is contact ke sath abhi koi loan record nahi hai." />
        )}
      </View>
    </Screen>
  );
};
