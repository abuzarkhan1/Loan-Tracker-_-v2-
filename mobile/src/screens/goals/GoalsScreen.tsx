import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQuery } from "@tanstack/react-query";
import { Plus, Target } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { api } from "../../api/client";
import { GoalStatus } from "../../api/types";
import { AppButton } from "../../components/AppButton";
import { GoalCard } from "../../components/GoalCard";
import { Screen } from "../../components/Screen";
import { EmptyState, ErrorState, LoadingState } from "../../components/StateViews";
import { RootStackParamList } from "../../navigation/types";
import { useAppTheme } from "../../providers/ThemeProvider";
import { fontFamily } from "../../utils/theme";

type Navigation = NativeStackNavigationProp<RootStackParamList>;

const statusOptions: Array<{ label: string; value: GoalStatus }> = [
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Archived", value: "ARCHIVED" },
];

const StatusChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => {
  const { theme } = useAppTheme();
  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      className="flex-1 rounded-lg border py-2.5"
      style={{ borderColor: active ? theme.primary : theme.border, backgroundColor: active ? theme.primary : theme.pill }}
    >
      <Text style={{ color: active ? theme.white : theme.muted, fontFamily: fontFamily.medium, fontSize: 13, textAlign: "center" }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

export const GoalsScreen = () => {
  const { theme } = useAppTheme();
  const navigation = useNavigation<Navigation>();
  const [status, setStatus] = useState<GoalStatus>("ACTIVE");
  const goalsQuery = useQuery({
    queryKey: ["goals", status],
    queryFn: () => api.getGoals({ status, limit: 50 }),
  });

  const goals = goalsQuery.data?.goals || [];

  return (
    <Screen className="gap-5 pt-5">
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          <Text style={{ color: theme.text, fontFamily: fontFamily.bold, fontSize: 32, lineHeight: 40 }}>Goals</Text>
          <Text style={{ color: theme.textSecondary, fontFamily: fontFamily.regular, fontSize: 15, lineHeight: 22, marginTop: 2 }}>
            Save slowly for things you want.
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.86}
          onPress={() => navigation.navigate("AddEditGoal")}
          style={{
            height: 40,
            width: 40,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: theme.primary,
            shadowColor: theme.primary,
            shadowOpacity: 0.18,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 4,
          }}
        >
          <Plus color={theme.white} size={22} strokeWidth={2.1} />
        </TouchableOpacity>
      </View>

      <View className="flex-row gap-2">
        {statusOptions.map((option) => (
          <StatusChip
            key={option.value}
            label={option.label}
            active={status === option.value}
            onPress={() => setStatus(option.value)}
          />
        ))}
      </View>

      {goalsQuery.isLoading ? <LoadingState label="Loading goals..." /> : null}
      {goalsQuery.isError ? <ErrorState message="Goals load nahi ho sake." onRetry={goalsQuery.refetch} /> : null}

      <View className="gap-3">
        {!goalsQuery.isLoading && !goalsQuery.isError ? (
          goals.length ? (
            goals.map((goal) => (
              <GoalCard key={goal._id} goal={goal} onPress={() => navigation.navigate("GoalDetail", { goalId: goal._id })} />
            ))
          ) : (
            <EmptyState
              title={status === "ACTIVE" ? "No goals yet" : `No ${status.toLowerCase()} goals`}
              subtitle={status === "ACTIVE" ? "Add your first saving target." : "Goals will appear here when their status changes."}
            />
          )
        ) : null}
      </View>

      {status === "ACTIVE" && !goals.length && !goalsQuery.isLoading && !goalsQuery.isError ? (
        <AppButton title="Add Goal" icon={Target} onPress={() => navigation.navigate("AddEditGoal")} />
      ) : null}
    </Screen>
  );
};
