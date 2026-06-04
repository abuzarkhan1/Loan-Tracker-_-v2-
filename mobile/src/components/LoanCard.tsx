import { CalendarDays } from "lucide-react-native";
import { Text, TouchableOpacity, View } from "react-native";
import { Loan } from "../api/types";
import { useAppTheme } from "../providers/ThemeProvider";
import { formatCurrency, getProgress } from "../utils/format";
import { fontFamily } from "../utils/theme";

const getContactName = (loan: Loan) => {
  return typeof loan.contactId === "string" ? "Contact" : loan.contactId?.name || "Contact";
};

const initials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return parts.slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join("") || "C";
};

const shortDate = (date?: string | Date | null) => {
  if (!date) return "No date";

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
  }).format(new Date(date));
};

const getStatusMeta = (status: Loan["status"]) => {
  if (status === "COMPLETED") {
    return { label: "Mukammal", tone: "success" as const };
  }

  if (status === "OVERDUE") {
    return { label: "Overdue", tone: "danger" as const };
  }

  return { label: "Jari Hai", tone: "warning" as const };
};

export const LoanCard = ({ loan, onPress }: { loan: Loan; onPress: () => void }) => {
  const { theme } = useAppTheme();
  const name = getContactName(loan);
  const progress = getProgress(loan.paidAmount, loan.amount);
  const given = loan.type === "GIVEN";
  const typeLabel = given ? "Lena Hai" : "Dena Hai";
  const statusMeta = getStatusMeta(loan.status);
  const amountColor = given ? theme.success : theme.danger;
  const avatarBackground = given ? theme.mint : theme.peach;
  const progressWidth = `${Math.min(100, Math.max(progress === 0 ? 1.5 : progress, 0))}%` as `${number}%`;
  const statusBackground =
    statusMeta.tone === "success" ? theme.mint : statusMeta.tone === "danger" ? theme.peach : theme.yellow;
  const statusColor =
    statusMeta.tone === "success" ? theme.success : statusMeta.tone === "danger" ? theme.danger : theme.warning;
  const dateLabel = loan.status === "COMPLETED" ? "Paid" : "Due";
  const dateValue = loan.dueDate || loan.issueDate;

  return (
    <TouchableOpacity
      activeOpacity={0.86}
      onPress={onPress}
      style={[
        {
          borderRadius: 24,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          paddingHorizontal: 18,
          paddingVertical: 16,
        },
        theme.mode === "dark"
          ? theme.shadowSoft
          : {
              shadowColor: "#2b2631",
              shadowOpacity: 0.055,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
              elevation: 3,
            },
      ]}
    >
      <View className="flex-row items-start gap-3">
        <View
          style={{
            height: 50,
            width: 50,
            borderRadius: 25,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: avatarBackground,
          }}
        >
          <Text style={{ color: amountColor, fontFamily: fontFamily.extraBold, fontSize: 16 }}>
            {initials(name)}
          </Text>
        </View>

        <View className="min-w-0 flex-1">
          <Text
            numberOfLines={1}
            style={{ color: theme.text, fontFamily: fontFamily.extraBold, fontSize: 16 }}
          >
            {name}
          </Text>
          <View
            className="mt-2 self-start rounded-full px-3 py-1"
            style={{ backgroundColor: avatarBackground }}
          >
            <Text style={{ color: amountColor, fontFamily: fontFamily.extraBold, fontSize: 11 }}>
              {typeLabel}
            </Text>
          </View>
        </View>

        <View className="items-end">
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.76}
            style={{ color: amountColor, fontFamily: fontFamily.extraBold, fontSize: 21, maxWidth: 128 }}
          >
            {formatCurrency(loan.amount).replace(/\u00a0/g, " ")}
          </Text>
          <Text style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 12, marginTop: 8 }}>
            {progress}% {given ? "wapis" : "diya"}
          </Text>
        </View>
      </View>

      <View
        className="mt-4 overflow-hidden rounded-full"
        style={{ height: 7, backgroundColor: theme.mode === "dark" ? theme.surface : "#f1efec" }}
      >
        <View
          style={{
            height: "100%",
            width: progressWidth,
            borderRadius: 999,
            backgroundColor: theme.primary,
          }}
        />
      </View>

      <View className="mt-4 flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <CalendarDays color={theme.muted} size={16} />
          <Text numberOfLines={1} style={{ color: theme.muted, fontFamily: fontFamily.medium, fontSize: 12.5 }}>
            {dateLabel} {shortDate(dateValue)}
          </Text>
        </View>

        <View className="rounded-full px-3 py-1.5" style={{ backgroundColor: statusBackground }}>
          <Text style={{ color: statusColor, fontFamily: fontFamily.extraBold, fontSize: 11.5 }}>
            {statusMeta.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};
