import { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";
import { useAppTheme } from "../providers/ThemeProvider";
import { fontFamily } from "../utils/theme";
import { AmountText } from "./AmountText";

export const SummaryCard = ({
  label,
  value,
  tone = "primary",
  icon: Icon,
}: {
  label: string;
  value: string;
  tone?: "primary" | "success" | "warning" | "danger";
  icon: LucideIcon;
}) => {
  const { theme } = useAppTheme();
  const toneColor = theme[tone];

  return (
    <View
      className="w-[48%]"
      style={[
        {
          gap: 14,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: theme.border,
          backgroundColor: theme.card,
          padding: 16,
        },
        theme.shadowSoft,
      ]}
    >
      <View
        style={{
          height: 48,
          width: 48,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          backgroundColor: tone === "success" ? theme.mint : tone === "warning" ? theme.yellow : tone === "danger" ? theme.peach : theme.backgroundSoft,
        }}
      >
        <Icon color={toneColor} size={19} />
      </View>
      <View>
        <Text style={{ color: theme.muted, fontFamily: fontFamily.semiBold, fontSize: 12, textTransform: "uppercase" }}>
          {label}
        </Text>
        <AmountText
          value={value}
          style={{ color: theme.text, fontFamily: fontFamily.semiBold, fontSize: 20, marginTop: 4 }}
          numberOfLines={1}
        />
      </View>
    </View>
  );
};
