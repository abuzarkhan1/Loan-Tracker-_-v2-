import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Archive, CheckCircle2, Edit3, HandCoins, RotateCcw, Target, Trash2 } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { api } from "../../api/client";
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
import { formatCurrency, formatDate } from "../../utils/format";
import { fontFamily } from "../../utils/theme";

type Props = NativeStackScreenProps<RootStackParamList, "GoalDetail">;

const DetailAmount = ({ label, value, tone }: { label: string; value: number; tone?: "success" | "danger" }) => {
  const { theme } = useAppTheme();
  const color = tone === "success" ? theme.success : tone === "danger" ? theme.danger : theme.text;
  return (
    <View className="flex-1 rounded-2xl px-4 py-3" style={{ backgroundColor: theme.backgroundSoft }}>
      <Text style={{ color: theme.muted, fontFamily: fontFamily.bold, fontSize: 11 }}>{label}</Text>
      <AmountText amount={value} className="mt-1 text-lg font-black" style={{ color, fontFamily: fontFamily.extraBold }} />
    </View>
  );
};

export const GoalDetailScreen = ({ navigation, route }: Props) => {
  const { theme } = useAppTheme();
  const queryClient = useQueryClient();
  const { goalId } = route.params;

  const goalQuery = useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => api.getGoal(goalId),
  });

  const invalidate = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["goals"] }),
      queryClient.invalidateQueries({ queryKey: ["goal", goalId] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
    ]);
  };

  const updateMutation = useMutation({
    mutationFn: (status: "ACTIVE" | "ARCHIVED") => api.updateGoal(goalId, { status }),
    onSuccess: invalidate,
  });

  const deleteGoalMutation = useMutation({
    mutationFn: () => api.deleteGoal(goalId),
    onSuccess: async () => {
      await invalidate();
      navigation.goBack();
    },
  });

  const deleteContributionMutation = useMutation({
    mutationFn: (contributionId: string) => api.deleteGoalContribution(goalId, contributionId),
    onSuccess: invalidate,
  });

  if (goalQuery.isLoading) return <Screen><LoadingState label="Loading goal..." /></Screen>;
  if (goalQuery.isError || !goalQuery.data) {
    return <Screen><ErrorState message="Goal load nahi ho saka." onRetry={goalQuery.refetch} /></Screen>;
  }

  const { goal, contributions } = goalQuery.data;
  const isCompleted = goal.status === "COMPLETED";
  const isArchived = goal.status === "ARCHIVED";

  const confirmDeleteGoal = () => {
    showAlert({
      title: "Delete goal?",
      message: "Is goal ki saved money history bhi delete ho jayegi.",
      buttons: [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteGoalMutation.mutate() },
      ],
    });
  };

  const confirmDeleteContribution = (contributionId: string) => {
    showAlert({
      title: "Delete saved money?",
      message: "Goal progress dobara calculate hoga.",
      buttons: [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteContributionMutation.mutate(contributionId) },
      ],
    });
  };

  return (
    <Screen className="pt-5">
      <View
        className="rounded-3xl border p-5"
        style={[{ backgroundColor: theme.card, borderColor: theme.border }, theme.shadowElevated]}
      >
        <View className="flex-row items-start justify-between gap-3">
          <View className="flex-1">
            <Text style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 25 }}>
              {goal.title}
            </Text>
            <Text style={{ color: theme.muted, fontFamily: fontFamily.semiBold, fontSize: 13, marginTop: 6 }}>
              {goal.note || "Simple saving target"}
            </Text>
          </View>
          <StatusBadge value={goal.status} />
        </View>

        <View className="mt-5 gap-2">
          <View className="flex-row items-center justify-between">
            <Text style={{ color: theme.muted, fontFamily: fontFamily.bold, fontSize: 12 }}>
              {goal.progressPercent}% complete
            </Text>
            <Text style={{ color: theme.primaryDark, fontFamily: fontFamily.extraBold, fontSize: 12 }}>
              {isCompleted ? "Ready to buy" : `${formatCurrency(goal.remainingAmount)} left`}
            </Text>
          </View>
          <ProgressBar progress={goal.progressPercent} />
        </View>

        <View className="mt-5 flex-row gap-3">
          <DetailAmount label="Target" value={goal.targetAmount} />
          <DetailAmount label="Saved" value={goal.savedAmount} tone="success" />
        </View>
        <View className="mt-3">
          <DetailAmount label="Remaining" value={goal.remainingAmount} tone={goal.remainingAmount > 0 ? "danger" : "success"} />
        </View>

        {isCompleted ? (
          <View className="mt-5 flex-row items-start gap-3 rounded-2xl p-4" style={{ backgroundColor: theme.mint }}>
            <CheckCircle2 color={theme.success} size={22} />
            <View className="flex-1">
              <Text style={{ color: theme.success, fontFamily: fontFamily.extraBold, fontSize: 14 }}>
                Goal complete
              </Text>
              <Text style={{ color: theme.success, fontFamily: fontFamily.semiBold, fontSize: 12, marginTop: 4 }}>
                You have saved enough for {goal.title}.
              </Text>
            </View>
          </View>
        ) : null}

        {(updateMutation.isError || deleteGoalMutation.isError || deleteContributionMutation.isError) ? (
          <Text className="mt-4 text-sm font-semibold text-danger">
            {getErrorMessage(updateMutation.error || deleteGoalMutation.error || deleteContributionMutation.error)}
          </Text>
        ) : null}

        {!isCompleted && !isArchived ? (
          <View className="mt-5">
            <AppButton title="Add Money" icon={HandCoins} onPress={() => navigation.navigate("AddGoalContribution", { goalId })} />
          </View>
        ) : null}

        <View className="mt-3 flex-row gap-3">
          <View className="flex-1">
            <AppButton title="Edit" icon={Edit3} variant="secondary" onPress={() => navigation.navigate("AddEditGoal", { goalId })} />
          </View>
          <View className="flex-1">
            <AppButton
              title={isArchived ? "Restore" : "Archive"}
              icon={isArchived ? RotateCcw : Archive}
              variant="secondary"
              loading={updateMutation.isPending}
              onPress={() => updateMutation.mutate(isArchived ? "ACTIVE" : "ARCHIVED")}
            />
          </View>
        </View>
        <View className="mt-3">
          <AppButton title="Delete Goal" icon={Trash2} variant="danger" loading={deleteGoalMutation.isPending} onPress={confirmDeleteGoal} />
        </View>
      </View>

      <View className="mt-6 flex-row items-center justify-between">
        <Text className="text-lg font-black text-dark">Saved Money History</Text>
        <Text className="text-xs font-bold uppercase text-muted">{contributions.length} records</Text>
      </View>

      <View className="mt-4 gap-3">
        {contributions.length ? (
          contributions.map((contribution) => (
            <View
              key={contribution._id}
              className="rounded-3xl border p-4"
              style={[{ backgroundColor: theme.card, borderColor: theme.border }, theme.shadowSoft]}
            >
              <View className="flex-row items-start justify-between gap-3">
                <View className="flex-1">
                  <AmountText amount={contribution.amount} className="text-lg font-black text-dark" />
                  <Text style={{ color: theme.muted, fontFamily: fontFamily.bold, fontSize: 12, marginTop: 4 }}>
                    {formatDate(contribution.date)}
                  </Text>
                  {contribution.note ? (
                    <Text style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 12, marginTop: 8 }}>
                      {contribution.note}
                    </Text>
                  ) : null}
                </View>
                <View className="flex-row gap-2">
                  <TouchableOpacity
                    className="h-9 w-9 items-center justify-center rounded-lg bg-background-soft"
                    onPress={() => navigation.navigate("AddGoalContribution", { goalId, contributionId: contribution._id })}
                  >
                    <Edit3 color={theme.primary} size={17} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="h-9 w-9 items-center justify-center rounded-lg bg-peach"
                    onPress={() => confirmDeleteContribution(contribution._id)}
                  >
                    <Trash2 color={theme.danger} size={17} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <EmptyState title="No money added yet" subtitle="Add small amounts whenever you save for this goal." />
        )}
      </View>

      <View className="mt-6 flex-row items-center justify-center gap-2">
        <Target color={theme.muted} size={14} />
        <Text style={{ color: theme.muted, fontFamily: fontFamily.bold, fontSize: 11.5 }}>
          Progress only. No expense double-counting.
        </Text>
      </View>
    </Screen>
  );
};
