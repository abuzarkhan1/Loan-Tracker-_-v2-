import { Target } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { Goal } from "../api/types";
import { useAppTheme } from "../providers/ThemeProvider";
import { formatCurrency } from "../utils/format";
import { fontFamily } from "../utils/theme";
import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";

type GoalCardProps = {
  goal: Goal;
  onPress?: () => void;
};

export const GoalCard = ({ goal, onPress }: GoalCardProps) => {
  const { theme } = useAppTheme();

  return (
    <TouchableOpacity activeOpacity={0.86} onPress={onPress} disabled={!onPress}>
      <View
        className="rounded-3xl border p-4"
        style={[{ backgroundColor: theme.card, borderColor: theme.border }, theme.shadowSoft]}
      >
        <View className="flex-row items-start gap-3">
          <View
            style={{
              height: 46,
              width: 46,
              borderRadius: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: goal.status === "COMPLETED" ? theme.mint : theme.peach,
            }}
          >
            <Target color={goal.status === "COMPLETED" ? theme.success : theme.primaryDark} size={21} />
          </View>
          <View className="min-w-0 flex-1">
            <View className="flex-row items-start justify-between gap-2">
              <View className="min-w-0 flex-1">
                <Text numberOfLines={1} style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 16 }}>
                  {goal.title}
                </Text>
                <Text style={{ color: theme.muted, fontFamily: fontFamily.semiBold, fontSize: 12, marginTop: 4 }}>
                  {formatCurrency(goal.savedAmount)} saved of {formatCurrency(goal.targetAmount)}
                </Text>
              </View>
              <StatusBadge value={goal.status} />
            </View>

            <View className="mt-4 gap-2">
              <View className="flex-row items-center justify-between">
                <Text style={{ color: theme.muted, fontFamily: fontFamily.bold, fontSize: 11 }}>
                  {goal.progressPercent}% complete
                </Text>
                <Text style={{ color: theme.primaryDark, fontFamily: fontFamily.extraBold, fontSize: 11 }}>
                  {goal.status === "COMPLETED" ? "Ready" : `${formatCurrency(goal.remainingAmount)} left`}
                </Text>
              </View>
              <ProgressBar progress={goal.progressPercent} />
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
