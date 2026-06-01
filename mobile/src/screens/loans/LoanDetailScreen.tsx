import { useEffect } from "react";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Edit3, FileText, Plus, Trash2 } from "lucide-react-native";
import { Text, TouchableOpacity, View, Linking } from "react-native";
import { api, getApiBaseUrl } from "../../api/client";
import { useAuth } from "../../providers/AuthProvider";
import { AmountText } from "../../components/AmountText";
import { AppButton } from "../../components/AppButton";
import { ProgressBar } from "../../components/ProgressBar";
import { Screen } from "../../components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { StatusBadge } from "../../components/StatusBadge";
import { RootStackParamList } from "../../navigation/types";
import { showAlert } from "../../providers/AlertProvider";
import { useAppTheme } from "../../providers/ThemeProvider";
import { getErrorMessage } from "../../utils/errors";
import { formatDate, formatTime, getProgress } from "../../utils/format";
import { fontFamily } from "../../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "LoanDetail">;

const getContactName = (contactId: unknown) => {
  if (typeof contactId === "object" && contactId && "name" in contactId) {
    return String((contactId as { name: string }).name);
  }

  return "Contact";
};

const getContactId = (contactId: unknown) => {
  if (typeof contactId === "object" && contactId && "_id" in contactId) {
    return String((contactId as { _id: string })._id);
  }

  return typeof contactId === "string" ? contactId : undefined;
};

export const LoanDetailScreen = ({ navigation, route }: Props) => {
  const { theme } = useAppTheme();
  const { token } = useAuth();
  const queryClient = useQueryClient();
  const { loanId } = route.params;

  const handleDownloadPdf = async () => {
    try {
      const baseUrl = getApiBaseUrl();
      const pdfUrl = `${baseUrl}/loans/${loanId}/pdf?token=${token}`;
      await Linking.openURL(pdfUrl);
    } catch (err) {
      showAlert({
        title: "Error",
        message: "PDF download nahi ho saka.",
        buttons: [{ text: "Ok" }],
      });
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleDownloadPdf}
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            backgroundColor: theme.peach,
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
          }}
        >
          <FileText color={theme.primaryDark} size={15} />
          <Text style={{ color: theme.primaryDark, fontFamily: fontFamily.bold, fontSize: 13 }}>
            PDF
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, token, theme]);

  const loanQuery = useQuery({
    queryKey: ["loan", loanId],
    queryFn: () => api.getLoan(loanId),
  });

  const deleteLoanMutation = useMutation({
    mutationFn: () => api.deleteLoan(loanId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["loans"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["contacts"] });
      navigation.goBack();
    },
  });

  const deletePaymentMutation = useMutation({
    mutationFn: (paymentId: string) => api.deletePayment(paymentId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["loan", loanId] });
      await queryClient.invalidateQueries({ queryKey: ["loans"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      await queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });

  const confirmLoanDelete = () => {
    showAlert({
      title: "Delete loan",
      message: "Is loan ki payments bhi delete ho jayengi.",
      buttons: [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteLoanMutation.mutate() },
      ],
    });
  };

  const confirmPaymentDelete = (paymentId: string) => {
    showAlert({
      title: "Delete payment",
      message: "Loan balance dobara calculate hoga.",
      buttons: [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deletePaymentMutation.mutate(paymentId) },
      ],
    });
  };

  if (loanQuery.isLoading) return <Screen><LoadingState label="Loading loan..." /></Screen>;
  if (loanQuery.isError || !loanQuery.data) {
    return <Screen><ErrorState message="Loan load nahi ho saka." onRetry={loanQuery.refetch} /></Screen>;
  }

  const { loan, payments } = loanQuery.data;
  const progress = getProgress(loan.paidAmount, loan.amount);
  const paymentActionLabel = loan.type === "TAKEN" ? "Maine Diya" : "Wapis Mila";
  const paymentVerb = loan.type === "TAKEN" ? "Maine diya" : "Mujhe mila";
  const contactId = getContactId(loan.contactId);
  let cumulativePaid = 0;
  const runningBalances = [...payments]
    .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime())
    .reduce<Record<string, number>>((acc, payment) => {
      cumulativePaid += payment.amount;
      acc[payment._id] = Math.max(loan.amount - cumulativePaid, 0);
      return acc;
    }, {});

  return (
    <Screen className="pt-5">
      <View className="rounded-lg border border-border bg-card p-5" style={theme.shadowSoft}>
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text className="text-2xl font-black text-dark">{getContactName(loan.contactId)}</Text>
            <Text className="mt-2 text-sm font-medium text-muted">{loan.description || "Simple loan record"}</Text>
          </View>
          <View className="items-end gap-2">
            <StatusBadge value={loan.type} />
            <StatusBadge value={loan.status} />
          </View>
        </View>

        <View className="mt-5 gap-2">
          <View className="flex-row justify-between">
            <Text className="text-xs font-bold text-muted">Paid {progress}%</Text>
            <AmountText amount={loan.remainingAmount} prefix="Baqi Raqam " className="text-xs font-bold text-muted" />
          </View>
          <ProgressBar progress={progress} />
        </View>

        <View className="mt-5 flex-row justify-between">
          <View>
            <Text className="text-xs font-bold uppercase text-muted">Total</Text>
            <AmountText amount={loan.amount} className="mt-1 text-lg font-black text-dark" />
          </View>
          <View>
            <Text className="text-xs font-bold uppercase text-muted">Paid</Text>
            <AmountText amount={loan.paidAmount} className="mt-1 text-lg font-black text-success" />
          </View>
        </View>

        <View className="mt-5 flex-row justify-between">
          <Text className="text-sm font-semibold text-muted">Issued {formatDate(loan.issueDate)}</Text>
          <Text className="text-sm font-semibold text-muted">Due {formatDate(loan.dueDate)}</Text>
        </View>

        {(deleteLoanMutation.isError || deletePaymentMutation.isError) ? (
          <Text className="mt-3 text-sm font-semibold text-danger">
            {getErrorMessage(deleteLoanMutation.error || deletePaymentMutation.error)}
          </Text>
        ) : null}

        <View className="mt-5">
          <AppButton title={paymentActionLabel} icon={Plus} onPress={() => navigation.navigate("QuickAddPayment", { loanId })} />
        </View>

        <View className="mt-3 flex-row gap-3">
          <View className="flex-1">
            <AppButton title="Edit" icon={Edit3} variant="secondary" onPress={() => navigation.navigate("LoanForm", { loanId })} />
          </View>
          <View className="flex-1">
            <AppButton title="Delete" icon={Trash2} variant="danger" onPress={confirmLoanDelete} loading={deleteLoanMutation.isPending} />
          </View>
        </View>
        {contactId ? (
          <View className="mt-3">
            <AppButton title="Contact Ledger" icon={BookOpen} variant="secondary" onPress={() => navigation.navigate("ContactLedger", { contactId })} />
          </View>
        ) : null}
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <Text className="text-lg font-black text-dark">Payment History</Text>
        <Text className="text-xs font-bold uppercase text-muted">{payments.length} records</Text>
      </View>

      <View className="mt-4 gap-3">
        {payments.length ? (
          payments.map((payment) => (
            <View key={payment._id} className="rounded-lg border border-border bg-card p-4" style={theme.shadowSoft}>
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <Text style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 16 }}>
                    {paymentVerb}:{" "}
                    <AmountText amount={payment.amount} style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 16 }} />
                  </Text>
                  <Text style={{ color: theme.muted, fontFamily: fontFamily.bold, fontSize: 12, marginTop: 4 }}>
                    {payment.method} · {formatDate(payment.paymentDate)} · {formatTime(payment.createdAt)}
                  </Text>
                  <View
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: theme.peach,
                      borderRadius: 999,
                      paddingHorizontal: 12,
                      paddingVertical: 5,
                      marginTop: 10,
                    }}
                  >
                    <AmountText
                      amount={runningBalances[payment._id] ?? loan.remainingAmount}
                      prefix="Baqi: "
                      style={{ color: theme.primaryDark, fontFamily: fontFamily.extraBold, fontSize: 11 }}
                    />
                  </View>
                  {payment.note ? <Text className="mt-2 text-sm text-dark">{payment.note}</Text> : null}
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="h-9 w-9 items-center justify-center rounded-lg bg-background-soft"
                    onPress={() => navigation.navigate("PaymentForm", { loanId, paymentId: payment._id })}
                  >
                    <Edit3 color={theme.primary} size={17} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="h-9 w-9 items-center justify-center rounded-lg bg-peach"
                    onPress={() => confirmPaymentDelete(payment._id)}
                  >
                    <Trash2 color={theme.danger} size={17} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <EmptyState title="No payments yet" subtitle="Payment add karein, remaining balance automatically update ho jayega." />
        )}
      </View>
    </Screen>
  );
};
