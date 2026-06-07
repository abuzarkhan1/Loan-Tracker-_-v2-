import { Text, View } from "react-native";
import { LoanStatus, LoanType } from "../api/types";
import { useAppTheme } from "../providers/ThemeProvider";
import { fontFamily } from "../utils/theme";

const labels: Record<string, string> = {
  ACTIVE: "Active",
  PARTIALLY_PAID: "Partial",
  COMPLETED: "Completed",
  OVERDUE: "Overdue",
  GIVEN: "Mujhe Lene Hain",
  TAKEN: "Mujhe Dene Hain",
  DEFAULT: "Default",
  CANCELLED: "Cancelled",
  PAID: "Paid",
  ARCHIVED: "Archived",
};

export const StatusBadge = ({ value }: { value: LoanStatus | LoanType | string }) => {
  const { theme } = useAppTheme();
  const isType = value === "GIVEN" || value === "TAKEN";
  const backgroundColor =
    value === "COMPLETED" || value === "GIVEN" ? theme.mint : value === "PARTIALLY_PAID" ? theme.yellow : theme.peach;
  const color =
    value === "COMPLETED" || value === "GIVEN" ? theme.success : value === "PARTIALLY_PAID" ? theme.warning : theme.danger;

  return (
    <View
      style={{
        borderRadius: 6,
        paddingHorizontal: isType ? 12 : 10,
        paddingVertical: 4,
        backgroundColor,
        borderWidth: 1,
        borderColor: theme.border,
      }}
    >
      <Text style={{ color, fontFamily: fontFamily.medium, fontSize: 12 }}>{labels[value] || value}</Text>
    </View>
  );
};
